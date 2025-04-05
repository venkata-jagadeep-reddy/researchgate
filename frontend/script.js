// script.js
import { checkServerHealth } from './js/main.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize theme
    initTheme();
    
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
    
    // Check if server is running
    const serverRunning = await checkServerHealth();
    if (!serverRunning) {
        showServerError();
    }
    
    // Check if all apps are available
    checkAppAvailability();
});

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (prefersDark) {
        html.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }
    
    // Add event listener for theme toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

function showServerError() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'server-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>Server is not running. Please start the server to use all features.</span>
        </div>
    `;
    document.body.appendChild(errorDiv);

    // Add styles for the error message
    const style = document.createElement('style');
    style.textContent = `
        .server-error {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
        }
        .error-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .server-error i {
            font-size: 1.2em;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
}

function checkAppAvailability() {
    const appLinks = document.querySelectorAll('.app-link');
    
    appLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Create a fetch request to check if the file exists
        fetch(href, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    // If the file doesn't exist, add a "coming soon" class
                    link.classList.add('coming-soon');
                    link.innerHTML = '<i class="fas fa-clock"></i> Coming Soon';
                }
            })
            .catch(() => {
                // If there's an error, assume the file doesn't exist
                link.classList.add('coming-soon');
                link.innerHTML = '<i class="fas fa-clock"></i> Coming Soon';
            });
    });
} 