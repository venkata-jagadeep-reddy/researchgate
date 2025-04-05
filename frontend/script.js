// script.js
import { checkServerHealth, isAuthenticated } from './js/auth.js';
import { initTheme } from './js/theme.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize theme
    initTheme();
    
    // Check if server is running
    const serverRunning = await checkServerHealth();
    if (!serverRunning) {
        console.warn('Server is not running. Some features may not work properly.');
    }
    
    // Check if user is already authenticated
    const currentPath = window.location.pathname;
    if (currentPath.includes('index.html') || currentPath === '/') {
        // On landing page, check if user is already authenticated
        if (isAuthenticated()) {
            window.location.href = 'dashboard.html';
        }
    } else if (currentPath.includes('auth.html')) {
        // On auth page, check if user is already authenticated
        if (isAuthenticated()) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // On protected pages, check if user is authenticated
        if (!isAuthenticated()) {
            window.location.href = 'index.html';
        }
    }
    
    // Add animation to app cards
    const appCards = document.querySelectorAll('.app-card');
    
    appCards.forEach((card, index) => {
        // Stagger the animation of cards
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Add hover effect to app links
    const appLinks = document.querySelectorAll('.app-link');
    
    appLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.querySelector('i').classList.add('fa-bounce');
        });
        
        link.addEventListener('mouseleave', () => {
            link.querySelector('i').classList.remove('fa-bounce');
        });
    });
    
    // Check if all apps are available
    checkAppAvailability();
});

function checkAppAvailability() {
    const appLinks = document.querySelectorAll('.app-link');
    
    appLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Use fetch with AbortController for better timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        fetch(href, { 
            method: 'HEAD',
            signal: controller.signal
        })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    // If the file doesn't exist, add a "coming soon" class
                    link.classList.add('coming-soon');
                    link.innerHTML = '<i class="fas fa-clock"></i> Coming Soon';
                }
            })
            .catch(() => {
                clearTimeout(timeoutId);
                // If there's an error, assume the file doesn't exist
                link.classList.add('coming-soon');
                link.innerHTML = '<i class="fas fa-clock"></i> Coming Soon';
            });
    });
} 