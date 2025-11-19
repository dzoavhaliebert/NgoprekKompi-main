// utils.js - FIXED & ENHANCED VERSION
// Fungsi utilitas yang dipakai di seluruh aplikasi

// ============================================
// CURRENCY FORMATTING
// ============================================
function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return 'Rp 0';
    }
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// ============================================
// ID GENERATION
// ============================================
function generateBuildId() {
    return 'build_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// DEBOUNCE FUNCTION
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// THROTTLE FUNCTION - NEW
// ============================================
function throttle(func, wait) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, wait);
        }
    };
}

// ============================================
// ANIMATE SCORE - ENHANCED
// ============================================
function animateScore(elementId, targetScore) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element ${elementId} not found for animation`);
        return;
    }
    
    let currentScore = 0;
    const increment = Math.max(1, targetScore / 30);
    const duration = 1000; // 1 second
    const steps = 30;
    const stepTime = duration / steps;
    
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        element.textContent = Math.round(currentScore).toLocaleString('id-ID');
    }, stepTime);
}

// ============================================
// ANIMATE NUMBER - NEW
// ============================================
function animateNumber(start, end, element, duration = 1000) {
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current).toLocaleString('id-ID');
    }, 16);
}

// ============================================
// NOTIFICATION SYSTEM - ENHANCED
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notif)) {
                document.body.removeChild(notif);
            }
        }, 300);
    });
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    notification.style.borderLeftColor = colors[type] || colors.info;
    notification.innerHTML = `
        <span style="font-size: 1.2rem; margin-right: 0.5rem;">${icons[type] || icons.info}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// ============================================
// TOAST NOTIFICATION - NEW
// ============================================
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 21, 41, 0.95);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// ============================================
// LOCAL STORAGE HELPER - NEW
// ============================================
const Storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            showNotification('Gagal menyimpan data', 'error');
            return false;
        }
    },
    
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },
    
    has: function(key) {
        return localStorage.getItem(key) !== null;
    }
};

// ============================================
// DATE FORMATTING - NEW
// ============================================
function formatDate(date, format = 'full') {
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        return 'Invalid Date';
    }
    
    const options = {
        full: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        date: { year: 'numeric', month: 'numeric', day: 'numeric' },
        time: { hour: '2-digit', minute: '2-digit' }
    };
    
    return d.toLocaleDateString('id-ID', options[format] || options.full);
}

// ============================================
// TIME AGO - NEW
// ============================================
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
        tahun: 31536000,
        bulan: 2592000,
        minggu: 604800,
        hari: 86400,
        jam: 3600,
        menit: 60,
        detik: 1
    };
    
    for (const [name, secondsInInterval] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInInterval);
        if (interval >= 1) {
            return `${interval} ${name} yang lalu`;
        }
    }
    
    return 'Baru saja';
}

// ============================================
// NUMBER FORMATTING - NEW
// ============================================
function formatNumber(num, decimals = 0) {
    if (typeof num !== 'number' || isNaN(num)) {
        return '0';
    }
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ============================================
// PERCENTAGE CALCULATOR - NEW
// ============================================
function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

// ============================================
// VALIDATION HELPERS - NEW
// ============================================
const Validator = {
    isEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    isPhone: function(phone) {
        const re = /^(\+62|62|0)[0-9]{9,12}$/;
        return re.test(phone.replace(/[\s-]/g, ''));
    },
    
    isEmpty: function(value) {
        return value === null || value === undefined || value === '';
    },
    
    isNumber: function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },
    
    minLength: function(value, min) {
        return value.length >= min;
    },
    
    maxLength: function(value, max) {
        return value.length <= max;
    }
};

// ============================================
// ARRAY HELPERS - NEW
// ============================================
const ArrayHelper = {
    unique: function(arr) {
        return [...new Set(arr)];
    },
    
    shuffle: function(arr) {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    },
    
    groupBy: function(arr, key) {
        return arr.reduce((result, item) => {
            const group = item[key];
            if (!result[group]) {
                result[group] = [];
            }
            result[group].push(item);
            return result;
        }, {});
    },
    
    sortBy: function(arr, key, order = 'asc') {
        return [...arr].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }
};

// ============================================
// STRING HELPERS - NEW
// ============================================
const StringHelper = {
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    truncate: function(str, length, suffix = '...') {
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },
    
    slugify: function(str) {
        return str
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },
    
    removeWhitespace: function(str) {
        return str.replace(/\s+/g, '');
    },
    
    countWords: function(str) {
        return str.trim().split(/\s+/).length;
    }
};

// ============================================
// DOM HELPERS - NEW
// ============================================
const DOMHelper = {
    createElement: function(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },
    
    getElement: function(selector) {
        return document.querySelector(selector);
    },
    
    getElements: function(selector) {
        return document.querySelectorAll(selector);
    },
    
    addClass: function(element, className) {
        if (element) element.classList.add(className);
    },
    
    removeClass: function(element, className) {
        if (element) element.classList.remove(className);
    },
    
    toggleClass: function(element, className) {
        if (element) element.classList.toggle(className);
    },
    
    hasClass: function(element, className) {
        return element ? element.classList.contains(className) : false;
    }
};

// ============================================
// LOADING INDICATOR - NEW
// ============================================
function showLoading(message = 'Memuat...') {
    const existing = document.getElementById('loading-indicator');
    if (existing) return;
    
    const loading = document.createElement('div');
    loading.id = 'loading-indicator';
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    loading.innerHTML = `
        <div style="
            background: var(--primary-dark);
            padding: 2rem 3rem;
            border-radius: 12px;
            border: 2px solid var(--accent);
            text-align: center;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 4px solid rgba(59, 130, 246, 0.3);
                border-top-color: var(--accent);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            "></div>
            <p style="color: white; font-size: 1.1rem; font-weight: 500;">${message}</p>
        </div>
        <style>
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading-indicator');
    if (loading) {
        loading.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(loading)) {
                document.body.removeChild(loading);
            }
        }, 300);
    }
}

// ============================================
// CONFIRM DIALOG - NEW
// ============================================
function showConfirm(message, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-container" style="max-width: 500px;">
            <div class="modal-header">
                <h2>⚠️ Konfirmasi</h2>
            </div>
            <div class="modal-body">
                <p style="font-size: 1.1rem; color: var(--text-light); margin: 1.5rem 0;">${message}</p>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button class="btn btn-secondary" id="cancel-btn">Batal</button>
                    <button class="btn btn-primary" id="confirm-btn">Konfirmasi</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#confirm-btn').onclick = function() {
        document.body.removeChild(modal);
        if (onConfirm) onConfirm();
    };
    
    modal.querySelector('#cancel-btn').onclick = function() {
        document.body.removeChild(modal);
        if (onCancel) onCancel();
    };
    
    modal.querySelector('.modal-overlay').onclick = function() {
        document.body.removeChild(modal);
        if (onCancel) onCancel();
    };
}

// ============================================
// COPY TO CLIPBOARD - NEW
// ============================================
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text)
            .then(() => {
                showNotification('✓ Disalin ke clipboard', 'success');
                return true;
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                return fallbackCopy(text);
            });
    } else {
        return fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showNotification('✓ Disalin ke clipboard', 'success');
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        showNotification('Gagal menyalin ke clipboard', 'error');
        return false;
    } finally {
        document.body.removeChild(textarea);
    }
}

// ============================================
// SCROLL TO TOP - NEW
// ============================================
function scrollToTop(smooth = true) {
    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

// ============================================
// SMOOTH SCROLL TO ELEMENT - NEW
// ============================================
function scrollToElement(elementId, offset = 100) {
    const element = document.getElementById(elementId);
    if (element) {
        const top = element.offsetTop - offset;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }
}

// ============================================
// CHECK IF ELEMENT IN VIEWPORT - NEW
// ============================================
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ============================================
// PERFORMANCE MONITOR - NEW
// ============================================
const Performance = {
    start: function(label) {
        if (window.performance) {
            performance.mark(`${label}-start`);
        }
    },
    
    end: function(label) {
        if (window.performance) {
            performance.mark(`${label}-end`);
            performance.measure(label, `${label}-start`, `${label}-end`);
            const measure = performance.getEntriesByName(label)[0];
            console.log(`${label}: ${measure.duration.toFixed(2)}ms`);
            return measure.duration;
        }
        return 0;
    }
};

// ============================================
// ERROR LOGGER - NEW
// ============================================
const ErrorLogger = {
    log: function(error, context = '') {
        const errorData = {
            message: error.message || String(error),
            stack: error.stack || '',
            context: context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        console.error('Error logged:', errorData);
        
        // Save to localStorage for debugging
        const errors = Storage.get('errorLogs', []);
        errors.push(errorData);
        
        // Keep only last 50 errors
        if (errors.length > 50) {
            errors.splice(0, errors.length - 50);
        }
        
        Storage.set('errorLogs', errors);
    },
    
    getErrors: function() {
        return Storage.get('errorLogs', []);
    },
    
    clearErrors: function() {
        Storage.remove('errorLogs');
    }
};

// ============================================
// EXPORT ALL UTILITIES
// ============================================
console.log('utils.js - Enhanced version loaded successfully');
console.log('Available utilities:', {
    formatCurrency,
    generateBuildId,
    debounce,
    throttle,
    animateScore,
    animateNumber,
    showNotification,
    showToast,
    Storage,
    formatDate,
    timeAgo,
    formatNumber,
    calculatePercentage,
    Validator,
    ArrayHelper,
    StringHelper,
    DOMHelper,
    showLoading,
    hideLoading,
    showConfirm,
    copyToClipboard,
    scrollToTop,
    scrollToElement,
    isInViewport,
    Performance,
    ErrorLogger
});