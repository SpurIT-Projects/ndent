// Main JavaScript for Neodent Clinic Website

document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    initializeNavigation();
    initializeScrollEffects();
    initializeModal();
    initializeFadeInAnimations();
    initializeFormValidation();
}

// Navigation functionality
function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (nav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Header background on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        // Header opacity
        if (scrollTop > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        
        // Show/hide scroll to top button
        if (scrollTop > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('appointmentModal');
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAppointmentForm();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeAppointmentForm();
        }
    });
}

// Open appointment form
function openAppointmentForm() {
    const modal = document.getElementById('appointmentModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close appointment form
function closeAppointmentForm() {
    const modal = document.getElementById('appointmentModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Scroll to services section
function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        const offsetTop = servicesSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Fade in animations on scroll
function initializeFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements
    const animatedElements = document.querySelectorAll('.advantage, .service__category, .doctor');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Form validation and submission
function initializeFormValidation() {
    const form = document.getElementById('appointmentForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = formData.get('name');
            const phone = formData.get('phone');
            
            // Basic validation
            if (!name || !phone) {
                showNotification('Пожалуйста, заполните обязательные поля', 'error');
                return;
            }
            
            if (!isValidPhone(phone)) {
                showNotification('Пожалуйста, введите корректный номер телефона', 'error');
                return;
            }
            
            // Simulate form submission
            submitAppointmentForm(formData);
        });
    }
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Submit appointment form
function submitAppointmentForm(formData) {
    // Show loading state
    const submitBtn = document.querySelector('#appointmentForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Ваша заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут.', 'success');
        
        // Reset form and close modal
        document.getElementById('appointmentForm').reset();
        closeAppointmentForm();
        
        // Log form data (in real implementation, send to server)
        console.log('Appointment form submitted:', Object.fromEntries(formData));
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification__close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Enhanced notification content styles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .notification__content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification__content i:first-child {
            font-size: 1.2rem;
        }
        
        .notification__close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
            font-size: 1rem;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        }
        
        .notification__close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Lazy loading for images
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
});

// Smooth scroll to top on page change (for future multi-page implementation)
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

// Performance optimization: Throttled scroll events
const throttledScrollHandler = debounce(function() {
    // Additional scroll-based animations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Focus management for modal
    if (e.key === 'Tab') {
        const modal = document.getElementById('appointmentModal');
        if (modal.classList.contains('active')) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    }
});

// Console log for debugging
console.log('Neodent Clinic Website initialized successfully!');