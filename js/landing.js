/* ============================================
   D'FLEUR - Landing Pages JS
   Catálogo por secciones + funciones de contacto
   Estilo del catálogo (ver landing/css/landing.css)
   ============================================ */

// Barra de urgencia por fases: se carga sola desde js/urgencia.js (mismo directorio que este archivo)
(function () {
    try {
        var me = document.currentScript && document.currentScript.src;
        var src = me ? me.replace(/landing\.js(\?.*)?$/, 'urgencia.js') : '../js/urgencia.js';
        var s = document.createElement('script');
        s.src = src;
        s.onload = function () { if (typeof filterProducts === 'function' && document.querySelector('.products-container')) filterProducts(); };
        document.head.appendChild(s);
    } catch (e) { /* noop */ }
})();

// Configuración global
const WA_NUMBER = '56936187973';
const BUSINESS_NAME = "D'Fleur";
const ADS_CONVERSION_ID = 'AW-18163228199/rdZwCIbo-qwcEKe889RD';

// Secciones del catálogo (mismo orden que catalogo.html)
const SECCIONES = [
    { id: 'rosas', titulo: "Ramos de Rosas", emoji: '🌹', fecha: '', iso: '', sub: "Docenas, medias docenas y ramos grandes de rosas rojas" },
    { id: 'corazones', titulo: "Corazones y Ferrero", emoji: '❤️', fecha: '', iso: '', sub: "Rosas en forma de corazón y detalles con Ferrero Rocher" },
    { id: 'girasoles', titulo: "Girasoles", emoji: '🌻', fecha: '', iso: '', sub: "Desde un girasol hasta ramos monumentales" },
    { id: 'mix', titulo: "Gerberas, Lilium y Mixtos", emoji: '🌸', fecha: '', iso: '', sub: "Color y aroma con gerberas, lilium, claveles y astromelias" },
    { id: 'cajas', titulo: "Cajas, Canastas y Sorpresas", emoji: '🎁', fecha: '', iso: '', sub: "Canastas, sombrereras, peluches y globos" },
    { id: 'novias', titulo: "Ramos de Novia", emoji: '🤍', fecha: '', iso: '', sub: "Ramos y ramilletes para el gran día" }
];

// Catálogo de productos D'Fleur (precios en CLP).
//  - num: número de la foto (assets/webp/N.webp); se muestra como "Nº N"
//  - tags: etiquetas de los filtros de las landings (ramos, centros-mesa, pedestales, corazones, cajas,
//          coronas-funebres, especiales, decoracion, premium) + 'bouquets'
//  - consultar: true → sin precio fijo, se muestra "Consultar"
const CATALOGO = [
    { num: 1, nombre: "Rayito de Sol", descripcion: "1 girasol con paniculata en papel blanco con borde dorado. Un detalle sencillo que ilumina cualquier día.", precio: 6000, imagen: "../assets/webp/1.webp", seccion: "girasoles", tags: ["ramos", "bouquets"], kw: "un girasol economico paniculata girasoles" },
    { num: 2, nombre: "Sol Radiante", descripcion: "Ramo de girasoles frescos en papel blanco con cinta amarilla. Alegría pura para cumpleaños, logros o porque sí.", precio: 38000, imagen: "../assets/webp/2.webp", seccion: "girasoles", tags: ["ramos", "bouquets"], kw: "ramo girasoles amarillo cinta girasoles" },
    { num: 3, nombre: "Girasoles Dorados", descripcion: "Ramo amplio de girasoles en papel negro decorado con mariposas doradas y lazo. Elegante, luminoso y difícil de olvidar.", precio: 105000, imagen: "../assets/webp/3.webp", seccion: "girasoles", tags: ["ramos", "bouquets", "premium"], kw: "ramo grande girasoles mariposas doradas papel negro girasoles" },
    { num: 4, nombre: "Noche de Girasoles", descripcion: "Ramo de girasoles envuelto en papel negro con borde dorado y tarjeta. El contraste perfecto entre lo sobrio y lo alegre.", precio: 48000, imagen: "../assets/webp/4.webp", seccion: "girasoles", tags: ["ramos", "bouquets"], kw: "girasoles papel negro tarjeta girasoles" },
    { num: 5, nombre: "Alegría de Sol", descripcion: "3 girasoles con abundante paniculata en papel blanco y dorado. Pequeño en precio, grande en alegría.", precio: 19000, imagen: "../assets/webp/5.webp", seccion: "girasoles", tags: ["ramos", "bouquets"], kw: "tres girasoles paniculata economico girasoles" },
    { num: 6, nombre: "Campo de Girasoles", descripcion: "Gran ramo de girasoles en papel blanco con cintas. Para sorprender a lo grande.", precio: 158000, imagen: "../assets/webp/6.webp", seccion: "girasoles", tags: ["ramos", "bouquets", "premium"], kw: "ramo gigante girasoles blanco girasoles" },
    { num: 7, nombre: "Mar de Girasoles", descripcion: "Ramo XL de girasoles en papel negro translúcido. Un impacto visual que se roba todas las miradas.", precio: 206000, imagen: "../assets/webp/7.webp", seccion: "girasoles", tags: ["ramos", "bouquets", "premium"], kw: "ramo xl girasoles papel negro girasoles" },
    { num: 8, nombre: "Girasoles Imperiales", descripcion: "Ramo monumental de girasoles de tallo largo en papel negro con dorado. Nuestra pieza más imponente para un momento inolvidable.", precio: 413000, imagen: "../assets/webp/8.webp", seccion: "girasoles", tags: ["ramos", "bouquets", "premium", "especiales"], kw: "ramo monumental girasoles tallo largo girasoles" },
    { num: 9, nombre: "Gerbera Rosa", descripcion: "1 gerbera rosada con paniculata en papel rosa y cordel. Un gesto tierno al mejor precio.", precio: 6000, imagen: "../assets/webp/9.webp", seccion: "mix", tags: ["ramos", "bouquets"], kw: "una gerbera rosada economico gerberas" },
    { num: 10, nombre: "Dulzura Pastel", descripcion: "Ramo de gerberas en tonos rosa y crema con flores de relleno, en papel rosado con dorado. Suave, delicado y lleno de cariño.", precio: 48000, imagen: "../assets/webp/10.webp", seccion: "mix", tags: ["ramos", "bouquets"], kw: "gerberas rosadas crema pastel gerberas" },
    { num: 11, nombre: "Jardín Fucsia", descripcion: "Ramo de gerberas fucsia rodeadas de paniculata en papel rosado. Color intenso para alegrar el día.", precio: 54000, imagen: "../assets/webp/11.webp", seccion: "mix", tags: ["ramos", "bouquets"], kw: "gerberas fucsia rosadas paniculata gerberas" },
    { num: 12, nombre: "Gerberas en Gris", descripcion: "Gerberas fucsia con paniculata y limonium en papel gris y cinta rosada. Moderno y alegre a la vez.", precio: 28000, imagen: "../assets/webp/12.webp", seccion: "mix", tags: ["ramos", "bouquets"], kw: "gerberas fucsia papel gris gerberas" },
    { num: 13, nombre: "Rosas y Lilium", descripcion: "6 rosas rosadas, 4 astromelias y 3 lilium con paniculata en papel verde menta. Fresco, femenino y perfumado.", precio: 49000, imagen: "../assets/webp/13.webp", seccion: "mix", tags: ["ramos", "bouquets"], kw: "rosas rosadas astromelias lilium rosas lilium" },
    { num: 14, nombre: "Novia Blanca", descripcion: "Ramo de novia con 8 rosas blancas y 12 astromelias, amarrado con cordel natural. Clásico y luminoso para el gran día.", precio: 56000, imagen: "../assets/webp/14.webp", seccion: "novias", tags: ["ramos", "bouquets", "especiales"], kw: "ramo de novia matrimonio boda rosas blancas astromelias rosas novias" },
    { num: 15, nombre: "Canasta Sol y Pasión", descripcion: "Canasta de mimbre con 10 rosas rojas y 3 girasoles con follaje. Ideal para regalar en casa o en la oficina.", precio: 56000, imagen: "../assets/webp/15.webp", seccion: "cajas", tags: ["centros-mesa", "decoracion"], kw: "canasta mimbre rosas rojas girasoles rosas girasoles cajas" },
    { num: 16, nombre: "Corazón Real", descripcion: "Corazón de 100 a 120 rosas aprox. con 12 Ferrero Rocher, corona y cinta personalizada. Una declaración de amor a lo grande.", precio: 388000, imagen: "../assets/webp/16.webp", seccion: "corazones", tags: ["corazones", "premium", "especiales"], kw: "corazon 100 120 rosas ferrero corona cinta personalizada rosas ferrero" },
    { num: 17, nombre: "Caja Just for You", descripcion: "Caja redonda con mix de astromelias, maules y 5 rosas. Delicada y lista para regalar.", precio: 45000, imagen: "../assets/webp/17.webp", seccion: "cajas", tags: ["cajas", "centros-mesa"], kw: "caja redonda astromelias maules rosas blancas rosas cajas" },
    { num: 18, nombre: "Novios Románticos", descripcion: "Ramo de novia con 9 rosas, astromelias y eucalipto, más ramillete para el novio. La pareja perfecta para el sí.", precio: 56000, imagen: "../assets/webp/18.webp", seccion: "novias", tags: ["ramos", "bouquets", "especiales"], kw: "ramo de novia ramillete novio matrimonio eucalipto rosas novias" },
    { num: 19, nombre: "Elegancia en Jarrón", descripcion: "12 rosas rojas de tallo largo en jarrón de vidrio con lazo blanco. Llega lista para lucir, sin buscar florero.", precio: 44000, imagen: "../assets/webp/19.webp", seccion: "rosas", tags: ["centros-mesa", "decoracion"], kw: "12 rosas rojas jarron florero rosas" },
    { num: 20, nombre: "Espejo de Cumpleaños", descripcion: "Entre 19 y 24 rosas rojas alrededor de un espejo con frase. Un recuerdo que se queda aunque pasen las flores.", precio: 56000, imagen: "../assets/webp/20.webp", seccion: "rosas", tags: ["ramos", "especiales"], kw: "rosas espejo frase cumpleaños personalizado rosas" },
    { num: 21, nombre: "Sombrerera Sol y Rosas", descripcion: "16 rosas rojas y 10 girasoles en caja sombrerera negra con lazo rojo. Llamativa, elegante y llena de vida.", precio: 94000, imagen: "../assets/webp/21.webp", seccion: "cajas", tags: ["cajas", "centros-mesa", "premium"], kw: "sombrerera caja negra rosas girasoles rosas girasoles cajas" },
    { num: 22, nombre: "Gran Sorpresa Rosa", descripcion: "Ramo de 10 gerberas, oso de peluche rosado grande y 3 globos de helio. La sorpresa completa para un cumpleaños.", precio: 121000, imagen: "../assets/webp/22.webp", seccion: "cajas", tags: ["especiales", "premium"], kw: "oso peluche grande globos helio gerberas cumpleaños gerberas peluche globo" },
    { num: 23, nombre: "Mandala de Sol", descripcion: "40 rosas aprox. y 12 girasoles en diseño circular con paniculata y papel negro. Un ramo que parece una obra de arte.", precio: 128000, imagen: "../assets/webp/23.webp", seccion: "girasoles", tags: ["ramos", "bouquets", "premium"], kw: "40 rosas 12 girasoles circular rosas girasoles" },
    { num: 24, nombre: "Caja Claveles y Lilium", descripcion: "Caja blanca con 15 claveles rojos y 5 lilium blancos, con lazo dorado. Elegante y aromática.", precio: 56000, imagen: "../assets/webp/24.webp", seccion: "mix", tags: ["cajas", "centros-mesa", "decoracion"], kw: "claveles rojos lilium blancos caja lilium cajas" },
    { num: 25, nombre: "Sol y Rosas", descripcion: "3 girasoles y 3 rosas rojas con follaje en papel negro. Equilibrio perfecto entre alegría y romance.", precio: 35000, imagen: "../assets/webp/25.webp", seccion: "girasoles", tags: ["ramos", "bouquets"], kw: "3 girasoles 3 rosas rosas girasoles" },
    { num: 26, nombre: "Box Corazón", descripcion: "Box con 5 rosas rojas y globo de corazón. Un detalle romántico y compacto.", precio: 40000, imagen: "../assets/webp/26.webp", seccion: "cajas", tags: ["cajas", "especiales"], kw: "box 5 rosas globo corazon rosas globo cajas" },
    { num: 27, nombre: "Corazón de Rosas y Ferrero", descripcion: "Caja corazón con 14 rosas rojas y 16 Ferrero Rocher. Dulce y romántico en una sola caja.", precio: 75000, imagen: "../assets/webp/27.webp", seccion: "corazones", tags: ["corazones", "cajas"], kw: "caja corazon 14 rosas 16 ferrero chocolates rosas ferrero cajas" },
    { num: 28, nombre: "Ramito Primaveral", descripcion: "Astromelias, 3 rosas rojas y 1 girasol en papel kraft. Colorido, fresco y económico.", precio: 33000, imagen: "../assets/webp/28.webp", seccion: "girasoles", tags: ["ramos", "bouquets"], kw: "astromelias rosas girasol kraft rosas girasoles" },
    { num: 29, nombre: "Clásico Infalible", descripcion: "Ramo de 10 rosas rojas con paniculata en papel negro y dorado. El clásico que nunca falla.", precio: 38000, imagen: "../assets/webp/29.webp", seccion: "rosas", tags: ["ramos", "bouquets"], kw: "10 rosas rojas rosas" },
    { num: 30, nombre: "Inicial de Amor", descripcion: "10 rosas rojas con letra personalizada en paniculata. Lleva la inicial de quien más quieres.", precio: 50000, imagen: "../assets/webp/30.webp", seccion: "rosas", tags: ["ramos", "bouquets", "especiales"], kw: "10 rosas letra inicial personalizada rosas" },
    { num: 31, nombre: "Gran Declaración", descripcion: "Ramo de 50 rosas rojas con mariposas doradas y tarjeta. Abundante, elegante y muy romántico.", precio: 138000, imagen: "../assets/webp/31.webp", seccion: "rosas", tags: ["ramos", "bouquets", "premium"], kw: "50 rosas rojas mariposas rosas" },
    { num: 32, nombre: "Recuerdos en Rosas", descripcion: "70 rosas rojas con 4 fotos personalizadas y lazo de perlas. Sus mejores momentos, entre flores.", precio: 194000, imagen: "../assets/webp/32.webp", seccion: "rosas", tags: ["ramos", "bouquets", "premium", "especiales"], kw: "70 rosas fotos personalizadas perlas rosas" },
    { num: 33, nombre: "Osito y Sol", descripcion: "4 rosas rojas, 1 girasol y peluche de oso. Un abrazo en forma de ramo.", precio: 40000, imagen: "../assets/webp/33.webp", seccion: "cajas", tags: ["ramos", "bouquets", "especiales"], kw: "peluche oso rosas girasol rosas girasoles peluche" },
    { num: 34, nombre: "Corazón Clásico", descripcion: "Corazón de 35 a 40 rosas rojas bordeado de paniculata en papel negro. Romántico de principio a fin.", precio: null, consultar: true, imagen: "../assets/webp/34.webp", seccion: "corazones", tags: ["corazones", "ramos"], kw: "corazon 35 40 rosas rojas rosas" },
    { num: 35, nombre: "Corazón Bicolor", descripcion: "100 rosas en forma de corazón, rojas al centro y blancas alrededor, con mariposas doradas. Un diseño de impacto para fechas especiales.", precio: 206000, imagen: "../assets/webp/35.webp", seccion: "corazones", tags: ["corazones", "premium"], kw: "100 rosas corazon rojas blancas rosas" },
    { num: 36, nombre: "Corazón Ferrero", descripcion: "18 a 20 rosas rojas con caja corazón de Ferrero Rocher al centro. Flores y chocolate en un mismo abrazo.", precio: 75000, imagen: "../assets/webp/36.webp", seccion: "corazones", tags: ["corazones", "ramos"], kw: "18 20 rosas ferrero corazon chocolates rosas ferrero" },
    { num: 37, nombre: "Lilium Rosé", descripcion: "8 rosas y 6 lilium en tonos rosados con paniculata. Suave, aromático y muy femenino.", precio: 58000, imagen: "../assets/webp/37.webp", seccion: "mix", tags: ["ramos", "bouquets"], kw: "8 rosas 6 lilium rosados rosas lilium" },
    { num: 38, nombre: "Canasta Girasol", descripcion: "Canasta tipo cartera con girasoles, astromelias y follaje, con lazo amarillo. Alegre y fácil de llevar.", precio: 44000, imagen: "../assets/webp/38.webp", seccion: "cajas", tags: ["centros-mesa", "cajas"], kw: "canasta mix cartera girasoles astromelias girasoles cajas" },
    { num: 39, nombre: "Canasta Primavera", descripcion: "Canasta tipo cartera con gerbera, rosas, claveles y flores amarillas. Una explosión de color.", precio: 44000, imagen: "../assets/webp/39.webp", seccion: "cajas", tags: ["centros-mesa", "cajas"], kw: "canasta mix cartera gerbera claveles amarillo gerberas cajas" },
    { num: 40, nombre: "Canasta Pasión", descripcion: "Canasta tipo cartera roja con rosas, claveles rojos y margaritas. Intensa y llena de amor.", precio: 44000, imagen: "../assets/webp/40.webp", seccion: "cajas", tags: ["centros-mesa", "cajas"], kw: "canasta mix cartera roja rosas claveles margaritas rosas cajas" },
    { num: 41, nombre: "Canasta Rosé", descripcion: "Canasta tipo cartera rosada con rosas, claveles y pompones pastel. Tierna y delicada.", precio: 44000, imagen: "../assets/webp/41.webp", seccion: "cajas", tags: ["centros-mesa", "cajas"], kw: "canasta mix cartera rosada claveles pompones rosas cajas" },
    { num: 42, nombre: "Corazón Dorado", descripcion: "Caja corazón con 9 rosas rojas, 8 Ferrero Rocher y mariposas doradas. Romance con un toque dulce.", precio: 56000, imagen: "../assets/webp/42.webp", seccion: "corazones", tags: ["corazones", "cajas"], kw: "caja corazon 9 rosas 8 ferrero mariposas rosas ferrero cajas" },
    { num: 43, nombre: "Fiesta de Rosas", descripcion: "24 rosas rojas, rosadas y blancas en papel rosado con borde dorado. Variado, alegre y romántico.", precio: 73000, imagen: "../assets/webp/43.webp", seccion: "rosas", tags: ["ramos", "bouquets"], kw: "24 rosas mix colores rosas" },
    { num: 44, nombre: "Romance Rosé", descripcion: "12 rosas rojas con paniculata en papel rosado marmoleado. Un clásico con un toque moderno.", precio: 38000, imagen: "../assets/webp/44.webp", seccion: "rosas", tags: ["ramos", "bouquets"], kw: "12 rosas docena rosas" },
    { num: 45, nombre: "Directo al Corazón", descripcion: "6 rosas rojas con paniculata en papel negro y lazo rojo. Pequeño, elegante y directo al corazón.", precio: 28000, imagen: "../assets/webp/45.webp", seccion: "rosas", tags: ["ramos", "bouquets"], kw: "6 rosas media docena economico rosas" },
    { num: 46, nombre: "Corazón de Chocolate", descripcion: "Corazón de Ferrero Rocher rodeado de rosas rojas y paniculata en papel negro. Para quienes aman las flores y los dulces por igual.", precio: 111000, imagen: "../assets/webp/46.webp", seccion: "corazones", tags: ["corazones", "premium", "ramos"], kw: "corazon ferrero rocher rosas chocolates rosas ferrero" },
    { num: 47, nombre: "Carta y Rosas", descripcion: "Rosas rojas con Ferrero Rocher, paniculata y carta personalizada en papel negro. Un detalle con mensaje propio.", precio: 20000, imagen: "../assets/webp/47.webp", seccion: "corazones", tags: ["ramos", "bouquets", "especiales"], kw: "rosas ferrero carta mensaje economico rosas ferrero" },
    { num: 48, nombre: "Cascada Ferrero", descripcion: "25 rosas rojas con corazón de Ferrero Rocher y mariposas doradas. Largo, vistoso y muy dulce.", precio: 85000, imagen: "../assets/webp/48.webp", seccion: "corazones", tags: ["ramos", "bouquets", "premium"], kw: "25 rosas ferrero corazon rosas ferrero" },
    { num: 49, nombre: "Caja Cumpleañera", descripcion: "Mix de flores y dulces en caja con globo burbuja de cumpleaños. Todo lo que necesita una celebración.", precio: 56000, imagen: "../assets/webp/49.webp", seccion: "cajas", tags: ["cajas", "especiales"], kw: "flores dulces globo burbuja cumpleaños globo cajas" },
    { num: 50, nombre: "Corona para Mamá", descripcion: "12 rosas rojas y 6 Ferrero Rocher en sombrerera negra con corona dorada. Para la reina de la casa.", precio: 56000, imagen: "../assets/webp/50.webp", seccion: "cajas", tags: ["cajas", "centros-mesa"], kw: "12 rosas 6 ferrero sombrerera corona mama rosas ferrero cajas" },
    { num: 51, nombre: "Lo Lograste", descripcion: "2 girasoles y 3 Ferrero Rocher con globo burbuja personalizado. Perfecto para graduaciones y logros.", precio: 28000, imagen: "../assets/webp/51.webp", seccion: "cajas", tags: ["especiales"], kw: "girasoles ferrero globo burbuja graduacion girasoles ferrero globo" },
    { num: 52, nombre: "Novia Jardín", descripcion: "Ramo de novia con claveles blancos, rosas durazno, suculentas y paniculata rosada. Romántico, natural y con estilo boho.", precio: 73000, imagen: "../assets/webp/52.webp", seccion: "novias", tags: ["ramos", "bouquets", "especiales"], kw: "ramo de novia boda suculentas claveles rosas novias" },
    { num: 53, nombre: "Caja Osito Rosado", descripcion: "12 rosas en tonos rosa y lila con peluche de oso en caja corazón. Ternura en estado puro.", precio: 69000, imagen: "../assets/webp/53.webp", seccion: "corazones", tags: ["corazones", "cajas", "especiales"], kw: "12 rosas peluche oso caja corazon rosas peluche cajas" },
    { num: 54, nombre: "Alas de Pasión", descripcion: "25 rosas rojas en papel negro con mariposas doradas y tarjeta. Elegante y apasionado.", precio: 63000, imagen: "../assets/webp/54.webp", seccion: "rosas", tags: ["ramos", "bouquets"], kw: "25 rosas rojas rosas" }
];

// Variable global para prioridad de tags por landing (ej: 'girasoles')
var LANDING_PRIORITY_TAG = '';

/* ─── Formato de precio ─── */
function formatPrice(n) {
    return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
function priceLabel(p) {
    if (p.consultar || p.precio == null) return 'Consultar';
    return (p.desde ? 'Desde ' : '') + formatPrice(p.precio);
}

/* ─── Tracking de conversión Google Ads ─── */
function trackConversion(url) {
    try {
        if (typeof gtag === 'function') {
            gtag('event', 'conversion', {
                'send_to': ADS_CONVERSION_ID,
                'event_callback': function () { window.open(url, '_blank'); }
            });
            // Fallback en caso de que el callback no dispare
            setTimeout(function () { window.open(url, '_blank'); }, 1500);
        } else {
            window.open(url, '_blank');
        }
    } catch (e) {
        window.open(url, '_blank');
    }
}

/* ─── Funciones de contacto WhatsApp ─── */
function contactWA() {
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Hola, vi su página y me gustaría más información sobre sus arreglos florales.');
    trackConversion(url);
    return false;
}

function orderWA() {
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Hola, quiero hacer un pedido de flores a domicilio en Antofagasta.');
    trackConversion(url);
    return false;
}

function productWA(idx) {
    var p = CATALOGO[idx];
    if (!p) return false;
    var ref = p.num ? ' (Nº ' + p.num + ')' : '';
    var msg = 'Hola, me interesa el ' + p.nombre + ref + (p.consultar ? '' : ' por ' + priceLabel(p)) + '. ¿Podrían darme más información?';
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    trackConversion(url);
    return false;
}

/* ─── Normalización (minúsculas + sin tildes) ─── */
function normalizeText(str) {
    return (str || '')
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
}

function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 22a10 10 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A10 10 0 1 1 12 22z"/></svg>';

/* ─── Banda de precio ─── */
function priceBand(p) {
    if (p.precio == null) return '';
    if (p.precio <= 30000) return 'precio-bajo';
    if (p.precio <= 80000) return 'precio-medio';
    return 'precio-alto';
}

/* ─── Renderizar tarjeta de producto ─── */
function renderCard(p, idx) {
    var isDest = p.tags.indexOf('destacado') >= 0;
    return '<div class="product-item' + (isDest ? ' product-item--destacado' : '') + '" data-tags="' + p.tags.join(',') + '" data-price="' + p.precio + '" data-number="' + (p.num || '') + '">' +
        '<div class="product-image">' +
            '<img src="' + p.imagen + '" alt="' + escapeHtml(p.nombre) + '" loading="lazy">' +
            (p.num ? '<span class="product-number">Nº ' + p.num + '</span>' : '') +
            (isDest ? '<span class="product-featured-badge">Destacado</span>' : '') +
            '<span class="price">' + priceLabel(p) + '</span>' +
        '</div>' +
        '<div class="product-info">' +
            '<h3>' + escapeHtml(p.nombre) + '</h3>' +
            '<p>' + escapeHtml(p.descripcion) + '</p>' +
            '<button class="btn-order" onclick="return productWA(' + idx + ')">' + WA_ICON + ' Pedir por WhatsApp</button>' +
        '</div>' +
    '</div>';
}

/* ─── Encabezado de sección ─── */
function daysUntil(iso) {
    if (!iso) return null;
    var parts = iso.split('-');
    var target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    var today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.round((target - today) / 86400000);
}
function renderSectionHead(s) {
    var d = daysUntil(s.iso);
    var cd = '';
    if (s.iso && window.DFleurUrgencia) {
        cd = window.DFleurUrgencia.pastilla(s.iso); // frase según la fase (js/urgencia.js)
    } else if (d !== null) {
        if (d > 1) cd = 'Faltan ' + d + ' días';
        else if (d === 1) cd = '¡Es mañana!';
        else if (d === 0) cd = '¡Es hoy!';
    }
    return '<div class="section-head" id="sec-' + s.id + '">' +
        '<h2>' + s.emoji + ' ' + s.titulo + '</h2>' +
        '<span class="ln"></span>' +
        (s.fecha ? '<span class="date">' + s.fecha + '</span>' : '') +
        (cd ? '<span class="countdown">' + cd + '</span>' : '') +
    '</div>' +
    (s.sub ? '<p class="section-sub">' + s.sub + '</p>' : '');
}

/* ─── Filtrado y búsqueda ─── */
function filterProducts() {
    var container = document.querySelector('.products-container');
    if (!container) return;

    var activeFilter = document.querySelector('.filter-btn.active');
    var filterVal = activeFilter ? activeFilter.getAttribute('data-filter') : 'todos';
    var rawSearch = document.getElementById('search-input') ? document.getElementById('search-input').value : '';
    var searchVal = normalizeText(rawSearch.trim());

    function matches(p) {
        if (p.oculto) return false;
        var tags = p.tags.concat([p.seccion, priceBand(p)]);
        if (filterVal !== 'todos' && tags.indexOf(filterVal) < 0) return false;
        if (searchVal) {
            var n = p.num ? (p.num + ' #' + p.num + ' n' + p.num + ' nº' + p.num + ' ') : '';
            var haystack = normalizeText(n + p.nombre + ' ' + p.descripcion + ' ' + tags.join(' ').replace(/-/g, ' ') + ' ' + (p.kw || ''));
            if (haystack.indexOf(searchVal) < 0) return false;
        }
        return true;
    }

    var html = '';
    var count = 0;

    SECCIONES.forEach(function (s) {
        var items = [];
        CATALOGO.forEach(function (p, idx) {
            if (p.seccion === s.id && matches(p)) items.push({ p: p, idx: idx });
        });
        if (!items.length) return;

        // Dentro de cada sección: destacados primero, luego prioridad de la landing
        items.sort(function (a, b) {
            var aDest = a.p.tags.indexOf('destacado') >= 0 ? 0 : 1;
            var bDest = b.p.tags.indexOf('destacado') >= 0 ? 0 : 1;
            if (aDest !== bDest) return aDest - bDest;
            if (LANDING_PRIORITY_TAG) {
                var aHas = a.p.tags.indexOf(LANDING_PRIORITY_TAG) >= 0 ? 0 : 1;
                var bHas = b.p.tags.indexOf(LANDING_PRIORITY_TAG) >= 0 ? 0 : 1;
                if (aHas !== bHas) return aHas - bHas;
            }
            return 0;
        });

        html += '<section class="product-section">' + renderSectionHead(s) + '<div class="product-grid">';
        items.forEach(function (it) { html += renderCard(it.p, it.idx); count++; });
        html += '</div></section>';
    });

    container.innerHTML = html;

    var counter = document.getElementById('results-count');
    if (counter) counter.textContent = count;

    var empty = document.getElementById('empty-state');
    if (empty) empty.style.display = count === 0 ? 'block' : 'none';

    var clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = rawSearch ? 'flex' : 'none';
}

/* ─── URL: leer/escribir filtro activo ─── */
function readFilterFromURL() {
    var params = new URLSearchParams(window.location.search);
    var f = params.get('filter') || params.get('category');
    if (!f) {
        var hash = (window.location.hash || '').replace(/^#\??/, '').trim();
        if (hash) f = hash;
    }
    return f;
}

function updateURLForFilter(filter) {
    try {
        var url = new URL(window.location.href);
        if (filter === 'todos' || !filter) {
            url.searchParams.delete('filter');
            url.searchParams.delete('category');
            window.history.replaceState({}, '', url.pathname + url.search);
        } else {
            url.searchParams.set('filter', filter);
            window.history.replaceState({}, '', url.pathname + url.search + '#' + filter);
        }
    } catch (e) { /* noop */ }
}

function applyFilterByName(filter, updateUrl) {
    var btn = document.querySelector('.filter-btn[data-filter="' + filter + '"]');
    if (!btn) {
        btn = document.querySelector('.filter-btn[data-filter="todos"]');
        filter = 'todos';
    }
    document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    filterProducts();
    if (updateUrl !== false) updateURLForFilter(filter);
}

/* ─── Inicializar catálogo ─── */
function initCatalog() {
    var initialFilter = readFilterFromURL();
    if (initialFilter) {
        applyFilterByName(initialFilter, false);
    } else {
        filterProducts();
    }

    document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            applyFilterByName(this.getAttribute('data-filter'), true);
        });
    });

    var searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', filterProducts);

    var clearBtn = document.getElementById('search-clear');
    if (clearBtn) {
        clearBtn.style.display = 'none';
        clearBtn.addEventListener('click', function () {
            if (searchInput) { searchInput.value = ''; searchInput.focus(); }
            filterProducts();
        });
    }

    window.addEventListener('popstate', function () { applyFilterByName(readFilterFromURL() || 'todos', false); });
    window.addEventListener('hashchange', function () { applyFilterByName(readFilterFromURL() || 'todos', false); });

    initImagePreview();
}

/* ─── Vista previa (lightbox) de imágenes ─── */
function initImagePreview() {
    if (document.getElementById('image-preview-modal')) return;

    var css = ''
        + '.product-image{cursor:zoom-in}'
        + '.image-preview-modal{position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem;opacity:0;pointer-events:none;transition:opacity .25s ease}'
        + '.image-preview-modal.is-open{opacity:1;pointer-events:auto}'
        + '.image-preview-modal[hidden]{display:none !important}'
        + '.image-preview-content{position:relative;max-width:min(95vw,1000px);max-height:92vh;display:flex;flex-direction:column;align-items:center;justify-content:center}'
        + '.image-preview-img{max-width:100%;max-height:82vh;width:auto;height:auto;border-radius:6px;background:#fff;object-fit:contain}'
        + '.image-preview-caption{color:#D9B569;margin-top:.8rem;font-size:1rem;font-family:"Cormorant Garamond",serif;letter-spacing:1px;text-align:center}'
        + '.image-preview-close{position:fixed;top:1rem;right:1.2rem;width:44px;height:44px;border-radius:50%;border:1px solid #D9B569;background:#151515;color:#D9B569;font-size:1.8rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10000}'
        + 'body.preview-open{overflow:hidden}';

    var styleTag = document.createElement('style');
    styleTag.id = 'image-preview-styles';
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    var modal = document.createElement('div');
    modal.id = 'image-preview-modal';
    modal.className = 'image-preview-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Vista previa de imagen');
    modal.hidden = true;
    modal.innerHTML = ''
        + '<button class="image-preview-close" type="button" aria-label="Cerrar vista previa">&times;</button>'
        + '<div class="image-preview-content" role="document">'
        +   '<img class="image-preview-img" alt="" />'
        +   '<div class="image-preview-caption"></div>'
        + '</div>';
    document.body.appendChild(modal);

    var imgEl   = modal.querySelector('.image-preview-img');
    var capEl   = modal.querySelector('.image-preview-caption');
    var closeBt = modal.querySelector('.image-preview-close');

    function openPreview(src, alt, title) {
        imgEl.src = src;
        imgEl.alt = alt || '';
        capEl.textContent = title || alt || '';
        modal.hidden = false;
        void modal.offsetWidth;
        modal.classList.add('is-open');
        document.body.classList.add('preview-open');
    }
    function closePreview() {
        modal.classList.remove('is-open');
        document.body.classList.remove('preview-open');
        setTimeout(function () { modal.hidden = true; imgEl.src = ''; }, 260);
    }

    document.addEventListener('click', function (e) {
        var target = e.target;
        if (!target) return;
        if (target.closest && target.closest('button, a')) return;
        var wrapper = target.closest && target.closest('.product-image');
        if (!wrapper) return;
        var img = wrapper.querySelector('img');
        if (!img) return;
        e.preventDefault();
        var card = wrapper.closest('.product-item, .product-card');
        var title = '';
        if (card) {
            var t = card.querySelector('.product-title, h3, h2');
            if (t) title = (t.textContent || '').trim();
        }
        openPreview(img.currentSrc || img.src, img.alt, title);
    });

    closeBt.addEventListener('click', closePreview);
    modal.addEventListener('click', function (e) { if (e.target === modal) closePreview(); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closePreview();
    });
}
