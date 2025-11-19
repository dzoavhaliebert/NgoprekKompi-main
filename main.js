// main.js - FIXED & ENHANCED VERSION
// Inisialisasi aplikasi pada setiap halaman dengan error handling dan fitur tambahan

// ============================================
// GLOBAL CONFIGURATION
// ============================================
const AppConfig = {
    version: '2.0.0',
    appName: 'Bangun PC - Professional Edition',
    autoSaveInterval: 30000, // 30 seconds
    maxSavedBuilds: 20,
    enableDebugMode: false,
    enableAnalytics: false
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log(`%c${AppConfig.appName} v${AppConfig.version}`, 'color: #3B82F6; font-size: 16px; font-weight: bold;');
    console.log('%cInitializing application...', 'color: #10B981;');
    
    // Start performance monitoring
    Performance.start('app-init');
    
    try {
        // Initialize language switcher first
        initializeLanguageSwitcher();
        
        // Initialize core functions
        initializeCore();
        
        // Initialize optional features
        initializeEnhancements();
        
        // Load persisted data
        loadPersistedData();
        
        // Setup event listeners
        setupGlobalListeners();
        
        // Check for updates
        checkForUpdates();
        
        Performance.end('app-init');
        
        console.log('%c✓ Application initialized successfully', 'color: #10B981; font-weight: bold;');
        
        // Show welcome message (only first time)
        showWelcomeMessage();
        
    } catch (error) {
        ErrorLogger.log(error, 'Initialization');
        console.error('❌ Failed to initialize application:', error);
        showNotification('Terjadi kesalahan saat memuat aplikasi. Silakan refresh halaman.', 'error');
    }
});

// ============================================
// CORE INITIALIZATION
// ============================================
function initializeCore() {
    try {
        // Initialize main app
        if (typeof initializeApp === 'function') {
            initializeApp();
            console.log('✓ Main app initialized');
        }
        
        // Initialize contact form
        if (typeof initializeContactForm === 'function') {
            initializeContactForm();
            console.log('✓ Contact form initialized');
        }
        
        // Initialize search
        if (typeof initializeSearch === 'function') {
            initializeSearch();
            console.log('✓ Search initialized');
        }
        
        // Initialize keyboard shortcuts
        if (typeof initializeKeyboardShortcuts === 'function') {
            initializeKeyboardShortcuts();
            console.log('✓ Keyboard shortcuts initialized');
        }
        
        // Enable auto-save
        if (typeof enableAutoSave === 'function') {
            enableAutoSave();
            console.log('✓ Auto-save enabled');
        }
        
    } catch (error) {
        ErrorLogger.log(error, 'Core initialization');
        throw error;
    }
}

// ============================================
// ENHANCEMENTS INITIALIZATION
// ============================================
function initializeEnhancements() {
    try {
        // Smooth scrolling for anchor links
        initializeSmoothScroll();
        
        // Back to top button
        initializeBackToTop();
        
        // Lazy loading for images
        initializeLazyLoading();
        
        // Dark mode toggle (if needed)
        // initializeDarkMode();
        
        // Tooltips
        initializeTooltips();
        
        // Analytics (if enabled)
        if (AppConfig.enableAnalytics) {
            initializeAnalytics();
        }
        
        console.log('✓ Enhancements initialized');
        
    } catch (error) {
        console.warn('Warning: Some enhancements failed to initialize:', error);
    }
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offset = 100;
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initializeBackToTop() {
    // Create button
    const button = document.createElement('button');
    button.id = 'back-to-top';
    button.innerHTML = '↑';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        display: none;
        transition: all 0.3s ease;
    `;
    
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    button.addEventListener('click', function() {
        scrollToTop(true);
    });
    
    document.body.appendChild(button);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 300) {
            button.style.display = 'block';
            button.style.animation = 'fadeIn 0.3s ease';
        } else {
            button.style.display = 'none';
        }
    }, 200));
}

// ============================================
// LAZY LOADING
// ============================================
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ============================================
// TOOLTIPS
// ============================================
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-size: 0.85rem;
                white-space: nowrap;
                z-index: 10000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                document.body.removeChild(this.tooltipElement);
                this.tooltipElement = null;
            }
        });
    });
}

// ============================================
// LOAD PERSISTED DATA
// ============================================
function loadPersistedData() {
    try {
        // Load auto-saved build
        if (typeof loadAutoSavedBuild === 'function') {
            setTimeout(loadAutoSavedBuild, 1000);
        }
        
        // Load user preferences
        loadUserPreferences();
        
        console.log('✓ Persisted data loaded');
    } catch (error) {
        console.warn('Warning: Failed to load some persisted data:', error);
    }
}

// ============================================
// USER PREFERENCES
// ============================================
function loadUserPreferences() {
    const preferences = Storage.get('userPreferences', {
        theme: 'dark',
        language: 'id',
        autoSave: true,
        notifications: true
    });
    
    // Apply preferences
    applyUserPreferences(preferences);
}

function applyUserPreferences(preferences) {
    // Apply theme
    if (preferences.theme) {
        document.body.setAttribute('data-theme', preferences.theme);
    }
    
    // Apply language
    if (preferences.language) {
        document.documentElement.lang = preferences.language;
    }
}

function saveUserPreferences(preferences) {
    Storage.set('userPreferences', preferences);
}

// ============================================
// GLOBAL EVENT LISTENERS
// ============================================
function setupGlobalListeners() {
    // Online/Offline detection
    window.addEventListener('online', function() {
        showNotification('✓ Koneksi internet tersambung', 'success');
    });
    
    window.addEventListener('offline', function() {
        showNotification('⚠️ Koneksi internet terputus', 'warning');
    });
    
    // Before unload warning
    window.addEventListener('beforeunload', function(e) {
        const components = typeof gatherComponents === 'function' ? gatherComponents() : [];
        
        if (components.length > 0) {
            const message = 'Anda memiliki konfigurasi yang belum disimpan. Yakin ingin meninggalkan halaman?';
            e.returnValue = message;
            return message;
        }
    });
    
    // Visibility change (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('Tab hidden - pausing updates');
        } else {
            console.log('Tab visible - resuming updates');
        }
    });
    
    // Detect slow network
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            showNotification('Koneksi internet lambat terdeteksi', 'warning');
        }
    }
    
    console.log('✓ Global listeners setup complete');
}

// ============================================
// WELCOME MESSAGE
// ============================================
function showWelcomeMessage() {
    const hasSeenWelcome = Storage.get('hasSeenWelcome', false);
    
    if (!hasSeenWelcome) {
        setTimeout(() => {
            showNotification('👋 Selamat datang di Bangun PC! Mulai merakit PC impian Anda.', 'info');
            Storage.set('hasSeenWelcome', true);
        }, 1500);
    }
}

// ============================================
// CHECK FOR UPDATES
// ============================================
function checkForUpdates() {
    const lastVersion = Storage.get('appVersion', '1.0.0');
    
    if (lastVersion !== AppConfig.version) {
        console.log(`Updated from ${lastVersion} to ${AppConfig.version}`);
        
        // Show update notification
        setTimeout(() => {
            showNotification(`✨ Aplikasi telah diperbarui ke versi ${AppConfig.version}`, 'success');
        }, 2000);
        
        // Save new version
        Storage.set('appVersion', AppConfig.version);
        
        // Show changelog if major update
        if (parseFloat(lastVersion) < parseFloat(AppConfig.version)) {
            showChangelog();
        }
    }
}

// ============================================
// CHANGELOG
// ============================================
function showChangelog() {
    const changelog = {
        '2.0.0': [
            'Penambahan fitur auto-save',
            'Peningkatan performa kompatibilitas check',
            'Perbaikan bug pada budget calculator',
            'Penambahan keyboard shortcuts',
            'Peningkatan UI/UX secara keseluruhan'
        ]
    };
    
    const currentChanges = changelog[AppConfig.version];
    if (!currentChanges) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-container">
            <div class="modal-header">
                <h2>🎉 Yang Baru di v${AppConfig.version}</h2>
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <ul style="color: var(--text-light); line-height: 2;">
                    ${currentChanges.map(change => `<li>✓ ${change}</li>`).join('')}
                </ul>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()" style="margin-top: 1.5rem; width: 100%;">
                    Mengerti
                </button>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        document.body.appendChild(modal);
    }, 3000);
}

// ============================================
// ANALYTICS (Optional)
// ============================================
function initializeAnalytics() {
    if (!AppConfig.enableAnalytics) return;
    
    // Track page view
    trackPageView();
    
    // Track user actions
    trackUserActions();
}

function trackPageView() {
    const pageData = {
        page: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString()
    };
    
    console.log('Page view tracked:', pageData);
}

function trackUserActions() {
    // Track button clicks
    document.addEventListener('click', function(e) {
        if (e.target.matches('button')) {
            console.log('Button clicked:', e.target.textContent);
        }
    });
}

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', function(event) {
    ErrorLogger.log(event.error, 'Global error');
    console.error('Global error caught:', event.error);
    
    if (AppConfig.enableDebugMode) {
        showNotification('Terjadi kesalahan pada aplikasi. Check console untuk detail.', 'error');
    }
});

window.addEventListener('unhandledrejection', function(event) {
    ErrorLogger.log(event.reason, 'Unhandled promise rejection');
    console.error('Unhandled promise rejection:', event.reason);
    
    if (AppConfig.enableDebugMode) {
        showNotification('Terjadi kesalahan async. Check console untuk detail.', 'error');
    }
});

// ============================================
// DEBUG MODE
// ============================================
if (AppConfig.enableDebugMode) {
    console.log('%cDebug Mode Enabled', 'color: #F59E0B; font-size: 14px; font-weight: bold;');
    
    // Expose useful functions to window for debugging
    window.debugUtils = {
        getState: () => AppState,
        getStorage: () => ({
            savedBuilds: Storage.get('savedBuilds', []),
            userPreferences: Storage.get('userPreferences', {}),
            autoSave: Storage.get('autoSaveBuild', null)
        }),
        getErrors: () => ErrorLogger.getErrors(),
        clearErrors: () => ErrorLogger.clearErrors(),
        clearStorage: () => Storage.clear(),
        testNotification: (type) => showNotification(`Test ${type} notification`, type),
        showStats: () => {
            if (typeof showStatistics === 'function') {
                showStatistics();
            }
        }
    };
    
    console.log('Debug utilities available at window.debugUtils');
}

// ============================================
// KEYBOARD SHORTCUTS HELP
// ============================================
function showKeyboardShortcuts() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-container">
            <div class="modal-header">
                <h2>⌨️ Keyboard Shortcuts</h2>
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <table style="width: 100%; color: var(--text-light);">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <td style="padding: 1rem;"><kbd>Ctrl + S</kbd></td>
                        <td style="padding: 1rem;">Simpan build</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <td style="padding: 1rem;"><kbd>Ctrl + R</kbd></td>
                        <td style="padding: 1rem;">Reset build</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <td style="padding: 1rem;"><kbd>Ctrl + P</kbd></td>
                        <td style="padding: 1rem;">Print ringkasan</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <td style="padding: 1rem;"><kbd>Ctrl + A</kbd></td>
                        <td style="padding: 1rem;">Buka analisis performa</td>
                    </tr>
                    <tr>
                        <td style="padding: 1rem;"><kbd>?</kbd></td>
                        <td style="padding: 1rem;">Tampilkan bantuan ini</td>
                    </tr>
                </table>
                <style>
                    kbd {
                        background: rgba(255, 255, 255, 0.1);
                        padding: 0.3rem 0.6rem;
                        border-radius: 4px;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        font-family: monospace;
                        font-weight: 600;
                    }
                </style>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Listen for ? key to show shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            showKeyboardShortcuts();
        }
    }
});

// ============================================
// SERVICE WORKER (PWA Support)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✓ Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// ============================================
// EXPORT FOR DEBUGGING
// ============================================
console.log('main.js - Enhanced version loaded successfully');
console.log(`%cApplication ready! Press ? for keyboard shortcuts`, 'color: #3B82F6; font-weight: bold;');