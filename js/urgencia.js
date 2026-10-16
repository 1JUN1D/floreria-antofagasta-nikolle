/* ============================================================
   D'FLEUR · Barra de urgencia por fases
   ------------------------------------------------------------
   Muestra una barra fija con reloj en vivo y frases que cambian
   según los días que faltan para la fecha más cercana.
   Escasez REAL: el stock se despacha en orden de pedido y se agota.

   Cómo se usa:
     catalogo.html  → <script src="js/urgencia.js"></script>
     landings       → landing.js lo carga solo (mismo directorio js/)

   Para previsualizar una fase sin esperar:
     catalogo.html?simular=2026-09-18   (cualquier fecha AAAA-MM-DD)

   Editar aquí: fechas, nombres y frases (abajo en EVENTOS y FRASES).
   ============================================================ */
(function () {
    'use strict';
    if (window.DFleurUrgencia) return; // evitar doble carga

    /* ─── 1. Fechas (editar cada año) ─── */
    var EVENTOS = [
        // Agrega aquí las fechas especiales (ej. Día de la Madre, San Valentín). Formato:
        // { id: 'madre', nombre: 'Día de la Madre', emoji: '💐', iso: 'AAAA-MM-DD', diaLargo: 'domingo 10 de mayo', corto: 'el 10', ancla: '#rosas' }
    ];
    var DIAS_REDENCION = 2;          // días después de un evento en que se ofrece el siguiente como "segunda oportunidad"
    var ROTACION_MS = 5500;          // cada cuánto cambia la frase
    var WA_NUMERO = '56950086800';

    /* ─── 2. Frases por fase ───
       {n} = nombre del evento · {d} = días que faltan · {corto} = "el 19" · {dia} = "sábado 19 de septiembre" */
    var FRASES = {
        sembrar: [   // 8 días o más · presión baja: sembrar la fecha
            '{n} es el {dia}. Los que piden con tiempo eligen entre todos los diseños.',
            'Aparta hoy tu diseño y elige la hora de entrega {corto}.',
            '{corto_may} llega más rápido de lo que crees. Deja el detalle resuelto hoy.'
        ],
        escasez: [   // 4 a 7 días · escasez real de stock
            'Las flores frescas se piden con anticipación: los diseños más pedidos se agotan primero.',
            'Cada pedido que entra resta stock para {corto}. Asegura el tuyo hoy.',
            'Faltan {d} días. Escríbenos y te lo dejamos apartado en 1 minuto.'
        ],
        presion: [   // 2 a 3 días · presión
            'Quedan {d} días y el stock baja con cada pedido. Cuando se acaba, no salen más.',
            'Si lo pides hoy, eliges el diseño. Si esperas, eliges entre lo que quede.',
            'Que no te agarre {corto} sin detalle.'
        ],
        manana: [    // 1 día
            '{n} es MAÑANA. Se despacha en orden de pedido hasta agotar stock.',
            'Últimas horas para apartar: pide hoy y mañana llega a su puerta.',
            'Mañana todos escriben a la vez. Hoy todavía escoges tú.'
        ],
        hoy: [       // día 0
            '¡Es HOY! Entregas el mismo día mientras haya stock. Escribe ahora y te confirmamos en minutos.',
            'Aún estás a tiempo, pero cada pedido que entra va antes que el tuyo.',
            'Hoy sí o sí: pide ahora y hoy mismo lo recibe.'
        ],
        redencion: [ // se pasó el evento anterior → segunda oportunidad
            '¿Se te pasó {corto_prev}? {corto_may} es tu segunda oportunidad: {n}.'
        ]
    };

    /* Pastilla corta que va en la cabecera de cada sección */
    var PASTILLAS = {
        sembrar: 'Faltan {d} días',
        escasez: 'Faltan {d} días · pide con tiempo',
        presion: 'Quedan {d} días · stock limitado',
        manana:  'Es mañana · últimos pedidos',
        hoy:     'Es hoy · entrega mismo día'
    };

    var ETIQUETA_BOTON = 'Pedir ahora';
    function mensajeWA(ev) {
        return 'Hola, quiero apartar un detalle para ' + ev.nombre + ' (' + ev.diaLargo + '). ¿Qué diseños tienen disponibles?';
    }

    /* ============================================================
       Lógica (normalmente no hace falta editar de aquí hacia abajo)
       ============================================================ */
    function fechaLocal(iso) {
        var p = iso.split('-');
        return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10), 0, 0, 0, 0);
    }

    // Fecha "de hoy" (permite ?simular=AAAA-MM-DD para previsualizar)
    var SIMULADA = null;
    try {
        var q = new URLSearchParams(window.location.search).get('simular');
        if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) SIMULADA = fechaLocal(q);
    } catch (e) { /* noop */ }
    function ahora() {
        if (!SIMULADA) return new Date();
        var real = new Date();
        var d = new Date(SIMULADA.getTime());
        d.setHours(real.getHours(), real.getMinutes(), real.getSeconds(), real.getMilliseconds());
        return d;
    }
    function diasHasta(iso) {
        var hoy = ahora(); hoy.setHours(0, 0, 0, 0);
        return Math.round((fechaLocal(iso) - hoy) / 86400000);
    }
    function fase(d) {
        if (d >= 8) return 'sembrar';
        if (d >= 4) return 'escasez';
        if (d >= 2) return 'presion';
        if (d === 1) return 'manana';
        if (d === 0) return 'hoy';
        return null;
    }
    function capitalizar(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
    function rellenar(txt, ev, d, prev) {
        return txt
            .replace(/\{n\}/g, ev.nombre)
            .replace(/\{d\}/g, d)
            .replace(/\{dia\}/g, ev.diaLargo)
            .replace(/\{corto_may\}/g, capitalizar(ev.corto))
            .replace(/\{corto\}/g, ev.corto)
            .replace(/\{corto_prev\}/g, prev ? prev.corto : '');
    }

    // Evento activo: el más cercano que no haya pasado
    function eventoActivo() {
        var prev = null;
        for (var i = 0; i < EVENTOS.length; i++) {
            var d = diasHasta(EVENTOS[i].iso);
            if (d >= 0) return { ev: EVENTOS[i], d: d, prev: prev };
            prev = EVENTOS[i];
        }
        return null;
    }

    /* API pública: pastilla para las cabeceras de sección */
    function pastilla(iso) {
        var d = diasHasta(iso);
        var f = fase(d);
        if (!f) return '';
        var ev = null;
        for (var i = 0; i < EVENTOS.length; i++) if (EVENTOS[i].iso === iso) ev = EVENTOS[i];
        return rellenar(PASTILLAS[f], ev || { nombre: '', diaLargo: '', corto: '' }, d, null);
    }

    /* ─── CSS ─── */
    var CSS = '\
.urg-bar{position:sticky;top:0;z-index:49;background:#151515;color:#fff;border-top:1px solid #2a2a2a;border-bottom:1px solid #D9B569;font-family:"Poppins",system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.18)}\
.urg-bar.urg-oculta{display:none}\
.urg-in{max-width:1200px;margin:0 auto;padding:9px 44px 9px 16px;display:flex;align-items:center;justify-content:center;gap:10px 18px;flex-wrap:wrap;position:relative}\
.urg-ev{display:inline-flex;align-items:center;gap:7px;font-size:.66rem;letter-spacing:1.6px;text-transform:uppercase;font-weight:700;color:#D9B569;white-space:nowrap}\
.urg-ev .urg-dot{width:7px;height:7px;border-radius:50%;background:#D9B569;box-shadow:0 0 0 0 rgba(217,181,105,.7);animation:urgPulso 1.6s infinite}\
@keyframes urgPulso{0%{box-shadow:0 0 0 0 rgba(217,181,105,.7)}70%{box-shadow:0 0 0 8px rgba(217,181,105,0)}100%{box-shadow:0 0 0 0 rgba(217,181,105,0)}}\
.urg-reloj{display:inline-flex;align-items:baseline;gap:4px;font-variant-numeric:lining-nums tabular-nums;white-space:nowrap}\
.urg-reloj b{font-family:"Cormorant Garamond",Georgia,serif;font-variant-numeric:lining-nums tabular-nums;font-size:1.45rem;font-weight:700;color:#fff;line-height:1;min-width:1.4ch;text-align:right}\
.urg-reloj small{font-size:.6rem;letter-spacing:1px;text-transform:uppercase;color:#bdbdbd;margin-right:4px}\
.urg-reloj .urg-para{font-size:.62rem;color:#bdbdbd;letter-spacing:.6px;text-transform:uppercase;margin-right:6px}\
.urg-msg{flex:1 1 260px;min-width:0;font-size:.84rem;line-height:1.35;color:#F3E7C9;text-align:center;transition:opacity .35s ease,transform .35s ease}\
.urg-msg.urg-fade{opacity:0;transform:translateY(4px)}\
.urg-msg strong{color:#D9B569}\
.urg-btn{display:inline-flex;align-items:center;gap:7px;background:#D9B569;color:#151515;border:1px solid #D9B569;border-radius:4px;padding:8px 14px;font:600 .72rem/1 "Poppins",system-ui,sans-serif;letter-spacing:1px;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:background .2s,color .2s}\
.urg-btn:hover{background:#151515;color:#D9B569}\
.urg-btn svg{width:15px;height:15px;fill:currentColor}\
.urg-cerrar{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:26px;height:26px;border:none;background:transparent;color:#8a8a8a;font-size:1.2rem;line-height:1;cursor:pointer;border-radius:50%}\
.urg-cerrar:hover{color:#fff;background:#2a2a2a}\
@media (max-width:640px){\
.urg-in{padding:8px 38px 9px 12px;gap:6px 12px}\
.urg-ev{font-size:.6rem;letter-spacing:1.2px}\
.urg-reloj b{font-size:1.25rem}\
.urg-msg{flex-basis:100%;font-size:.8rem;order:3;cursor:pointer}\
.urg-msg::after{content:" Pedir ›";color:#D9B569;font-weight:600;white-space:nowrap}\
.urg-btn{display:none}\
}\
@media (prefers-reduced-motion:reduce){.urg-ev .urg-dot{animation:none}.urg-msg{transition:none}}';

    var WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 22a10 10 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A10 10 0 1 1 12 22z"/></svg>';

    function abrirWA(ev) {
        var url = 'https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(mensajeWA(ev));
        var etiqueta = 'barra_urgencia_' + ev.id;
        try {
            if (typeof window.trackWhatsAppLead === 'function') return window.trackWhatsAppLead(url, etiqueta); // catálogo
            if (typeof window.trackConversion === 'function') { window.trackConversion(url); return false; }   // landings
        } catch (e) { /* noop */ }
        window.open(url, '_blank');
        return false;
    }

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function montar() {
        var activo = eventoActivo();
        if (!activo) return; // ya pasaron todas las fechas → sin barra

        var ev = activo.ev, d = activo.d;
        var f = fase(d);
        if (!f) return;

        // ¿La cerró en esta visita?
        try { if (sessionStorage.getItem('urg-cerrada-' + ev.id) === '1') return; } catch (e) { /* noop */ }

        // Frases de la fase (+ redención si el evento anterior pasó hace poco)
        var frases = FRASES[f].slice();
        if (activo.prev) {
            var dPrev = diasHasta(activo.prev.iso); // negativo
            if (dPrev < 0 && -dPrev <= DIAS_REDENCION) frases.unshift(FRASES.redencion[0]);
        }
        frases = frases.map(function (t) { return rellenar(t, ev, d, activo.prev); });

        // CSS
        var st = document.createElement('style');
        st.textContent = CSS;
        document.head.appendChild(st);

        // Dónde va: después del nav de secciones (catálogo) o del header (landings)
        var ancla = document.querySelector('.section-nav') || document.querySelector('.header') || document.body.firstElementChild;

        var bar = document.createElement('div');
        bar.className = 'urg-bar';
        bar.setAttribute('role', 'region');
        bar.setAttribute('aria-label', 'Cuenta regresiva ' + ev.nombre);
        var objetivo = fechaLocal(ev.iso);
        if (d === 0) objetivo = new Date(objetivo.getTime() + 86400000); // hoy: cuenta hasta el final del día
        var paraTxt = d === 0 ? 'termina en' : 'para ' + ev.corto;
        bar.innerHTML =
            '<div class="urg-in">' +
                '<span class="urg-ev"><span class="urg-dot"></span>' + ev.emoji + ' ' + ev.nombre + ' · ' + ev.diaLargo.replace(/ de septiembre/, ' sep') + '</span>' +
                '<span class="urg-reloj" aria-live="off"><span class="urg-para">' + paraTxt + '</span>' +
                    '<b data-u="d">0</b><small>d</small><b data-u="h">00</b><small>h</small><b data-u="m">00</b><small>m</small><b data-u="s">00</b><small>s</small>' +
                '</span>' +
                '<p class="urg-msg" aria-live="polite"></p>' +
                '<button type="button" class="urg-btn">' + WA_SVG + ETIQUETA_BOTON + '</button>' +
                '<button type="button" class="urg-cerrar" aria-label="Cerrar aviso">&times;</button>' +
            '</div>';
        if (ancla && ancla.parentNode) ancla.parentNode.insertBefore(bar, ancla.nextSibling);
        else document.body.insertBefore(bar, document.body.firstChild);

        // Pegada justo debajo del elemento sticky que la precede
        function ajustarTop() {
            var top = 0;
            if (ancla) {
                var pos = window.getComputedStyle(ancla).position;
                if (pos === 'sticky' || pos === 'fixed') top = Math.round(ancla.getBoundingClientRect().height);
            }
            bar.style.top = top + 'px';
        }
        ajustarTop();
        window.addEventListener('resize', ajustarTop);
        window.addEventListener('load', ajustarTop);

        // Reloj en vivo
        var uD = bar.querySelector('[data-u="d"]'), uH = bar.querySelector('[data-u="h"]'),
            uM = bar.querySelector('[data-u="m"]'), uS = bar.querySelector('[data-u="s"]');
        function tic() {
            var ms = objetivo - ahora();
            if (ms < 0) ms = 0;
            var s = Math.floor(ms / 1000);
            uD.textContent = Math.floor(s / 86400);
            uH.textContent = pad(Math.floor(s % 86400 / 3600));
            uM.textContent = pad(Math.floor(s % 3600 / 60));
            uS.textContent = pad(s % 60);
            if (ms === 0 && !SIMULADA) { // cambió el día: recalcular fase
                clearInterval(reloj); clearInterval(rot);
                bar.parentNode.removeChild(bar); st.parentNode.removeChild(st);
                montar();
            }
        }
        tic();
        var reloj = setInterval(tic, 1000);

        // Frases rotativas
        var msg = bar.querySelector('.urg-msg');
        var i = 0;
        function resaltar(t) {
            // resalta números y palabras clave en dorado
            return t.replace(/(\d+ días?|HOY|MAÑANA|hoy|mañana|el 19|el 21|El 19|El 21|1 minuto|stock)/g, '<strong>$1</strong>');
        }
        msg.innerHTML = resaltar(frases[0]);
        var rot = null;
        if (frases.length > 1) {
            rot = setInterval(function () {
                i = (i + 1) % frases.length;
                msg.classList.add('urg-fade');
                setTimeout(function () { msg.innerHTML = resaltar(frases[i]); msg.classList.remove('urg-fade'); }, 360);
            }, ROTACION_MS);
        }

        // Botón y cierre
        bar.querySelector('.urg-btn').addEventListener('click', function () { abrirWA(ev); });
        msg.addEventListener('click', function () { if (window.matchMedia('(max-width:640px)').matches) abrirWA(ev); });
        bar.querySelector('.urg-cerrar').addEventListener('click', function () {
            bar.classList.add('urg-oculta');
            try { sessionStorage.setItem('urg-cerrada-' + ev.id, '1'); } catch (e) { /* noop */ }
        });
    }

    window.DFleurUrgencia = { pastilla: pastilla, diasHasta: diasHasta, fase: fase, eventos: EVENTOS };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
    else montar();
})();
