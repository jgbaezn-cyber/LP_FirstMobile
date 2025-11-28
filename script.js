// Loading Screen
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
});

// MMenú
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");

// Abrir menú
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = 'hidden';
});

// Cerrar menú
closeMenu.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = 'auto';
});

// Cerrar menú luego de hacer click en links
document.querySelectorAll(".mobile-nav-list a").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = 'auto';
    });
});

// Cerrar menú luego de hacer click fuera
document.addEventListener("click", (e) => {
    if (!e.target.closest('.mobile-menu') && !e.target.closest('.hamburger') && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = 'auto';
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 60; // Compensar header
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(i => {
            i.classList.remove('active');
        });
        this.classList.add('active');
    });
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
            item.classList.add('active');
        }
    });
});

// Carrito
let cartCount = 0;
let cartItems = [];
const cartCountElement = document.querySelector('.cart-count');

// Notificaciones
function showNotification(message) {
    // Eliminar notificaciones existentes
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 4%;
        left: 4%;
        background: white;
        color: #1f2937;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 1000;
        border-left: 4px solid #dc2626;
        transform: translateY(-20px);
        opacity: 0;
        transition: all 0.3s ease;
        text-align: center;
        font-weight: 500;
        font-size: 0.9rem;
        line-height: 1.4;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animación de la entrada
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función de agregar al carrito 
function addToCart(name, price, image, button) {
    cartCount++;
    cartItems.push({ name, price, image });
    
    // Actualizar el contador del carrito
    cartCountElement.textContent = cartCount;
    cartCountElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartCountElement.style.transform = 'scale(1)';
    }, 300);
    
    // Mostrar la notificación
    showNotification(`✅ ${name} agregado al carrito\nPrecio: ${price}`);
    
    if (button) {
        const originalHTML = button.innerHTML;
        const originalBackground = button.style.background;
        
        button.innerHTML = '<i class="fas fa-check"></i>Agregado';
        button.style.background = '#16a34a';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = originalBackground;
            button.disabled = false;
        }, 2000);
    }
    
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Inicializar carrito
function initializeCart() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.producto-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.precio').textContent;
            const productImage = productCard.querySelector('img').src;
            
            addToCart(productName, productPrice, productImage, this);
        });
    });
}

// Ver Más Productos
document.getElementById('verMasProductos')?.addEventListener('click', function() {
    showNotification('📦 Pronto agregaremos más productos a nuestra colección');
    
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>Cargando...';
    this.disabled = true;
    
    setTimeout(() => {
        this.innerHTML = '<i class="fas fa-chevron-down"></i>Ver Más Productos';
        this.disabled = false;
    }, 2000);
});

document.getElementById('form-contacto').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification('📧 ¡Gracias por tu mensaje!\nTe contactaremos dentro de 24 horas.');
    this.reset();
});

document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (email && email.includes('@')) {
        showNotification(`📬 ¡Gracias por suscribirte!\nRecibirás nuestras novedades en: ${email}`);
        this.reset();
    } else {
        showNotification('❌ Por favor ingresa un email válido');
    }
});

document.querySelectorAll('.producto-card').forEach(card => {
    card.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
});

// Prevenir el zoom cuando se hace doble click
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    
    // Actualizar el año de pie de página
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
    
    document.querySelector('.mobile-bottom-nav .nav-item[href="#inicio"]').classList.add('active');
});

window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

document.addEventListener('touchmove', function(e) {
    if (e.scale !== 1) {
        e.preventDefault();
    }
}, { passive: false });