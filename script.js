// Manejo del Menú Móvil
const menuBtn = document.getElementById('mobile-toggle'); // Cambiado a mobile-toggle para coincidir con tu HTML
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Función para cerrar el menú móvil al hacer clic en un link
window.closeMobile = () => {
    mobileMenu?.classList.add('hidden');
};

// Animaciones al hacer Scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.style.opacity = "1";
        }
    });
}, observerOptions);

// Aplicar el observador a todos los elementos con la clase de animación
document.querySelectorAll('.animate-fade-in-up').forEach((el) => {
    observer.observe(el);
});

// --- LÓGICA DE TRADUCCIÓN ---

async function aplicarTraduccion(lang) {
    try {
        // En Vite, la carpeta public es la raíz, usamos /locales/
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) throw new Error(`No se pudo cargar el archivo: ${response.status}`);
        
        const textos = await response.json();

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const clave = el.getAttribute('data-i18n');
            
            // Esta línea permite navegar por objetos anidados como "hero.title"
            const traduccion = clave.split('.').reduce((obj, i) => (obj ? obj[i] : null), textos);
            
            if (traduccion) {
                // Si es un input o textarea, traducimos el placeholder
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = traduccion;
                } else {
                    // Para el resto, usamos innerHTML (por si hay etiquetas <br/>)
                    el.innerHTML = traduccion;
                }
            }
        });

        localStorage.setItem('idioma_preferido', lang);
        document.documentElement.lang = lang;
        
    } catch (error) {
        console.error("Error al cargar el idioma:", error);
    }
}

// Hacer la función accesible globalmente para los onclick del menú móvil
window.changeLanguage = aplicarTraduccion;

document.getElementById('btn-es')?.addEventListener('click', () => aplicarTraduccion('es'));
document.getElementById('btn-en')?.addEventListener('click', () => aplicarTraduccion('en'));

window.addEventListener('DOMContentLoaded', () => {
    const langGuardado = localStorage.getItem('idioma_preferido') || 'es';
    aplicarTraduccion(langGuardado);
});