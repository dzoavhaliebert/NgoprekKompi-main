// component-preview.js - Handler untuk menampilkan preview gambar komponen
// File ini menangani preview gambar saat komponen dipilih

// ============================================
// INITIALIZATION
// ============================================
function initializeComponentPreviews() {
    console.log('Initializing component previews...');
    
    // Tambahkan container preview untuk setiap komponen
    const componentCards = document.querySelectorAll('.component-card');
    
    componentCards.forEach(card => {
        addPreviewContainer(card);
    });
    
    // Attach event listeners untuk setiap select
    const selects = document.querySelectorAll('.component-select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            handleComponentSelection(this);
        });
        
        // Load initial image if there's a selected value
        if (select.value) {
            handleComponentSelection(select);
        }
    });
    
    console.log('âœ“ Component previews initialized');
}

// ============================================
// ADD PREVIEW CONTAINER
// ============================================
function addPreviewContainer(card) {
    // Check if preview container already exists
    if (card.querySelector('.component-preview-container')) {
        return;
    }
    
    const header = card.querySelector('.component-header');
    if (!header) return;
    
    // Create preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'component-preview-container';
    previewContainer.innerHTML = `
        <div class="component-preview-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>Pilih komponen untuk melihat preview</p>
        </div>
    `;
    
    // Insert after header
    header.insertAdjacentElement('afterend', previewContainer);
}

// ============================================
// HANDLE COMPONENT SELECTION
// ============================================
function handleComponentSelection(selectElement) {
    const value = selectElement.value;
    const componentCard = selectElement.closest('.component-card');
    const previewContainer = componentCard.querySelector('.component-preview-container');
    
    if (!previewContainer) return;
    
    // Clear existing content
    previewContainer.innerHTML = '';
    
    if (!value || value === '') {
        showPlaceholder(previewContainer);
        return;
    }
    
    // Get component type from select ID
    const componentType = selectElement.id.replace('-select', '');
    
    // Show loading state
    showLoadingState(previewContainer);
    
    // Get image URL
    const imageUrl = getComponentImage(componentType, value);
    
    if (imageUrl) {
        loadComponentImage(previewContainer, imageUrl, selectElement);
    } else {
        showPlaceholderImage(previewContainer, componentType);
    }
}

// ============================================
// SHOW PLACEHOLDER WITH TRANSLATION
// ============================================
function showPlaceholder(container) {
    const currentLang = getCurrentLanguage ? getCurrentLanguage() : 'id';
    const placeholderText = currentLang === 'en' 
        ? 'Select component to see preview'
        : 'Pilih komponen untuk melihat preview';
    
    container.innerHTML = `
        <div class="component-preview-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>${placeholderText}</p>
        </div>
    `;
}

// ============================================
// SHOW LOADING STATE WITH TRANSLATION
// ============================================
function showLoadingState(container) {
    const currentLang = getCurrentLanguage ? getCurrentLanguage() : 'id';
    const loadingText = currentLang === 'en' ? 'Loading image...' : 'Memuat gambar...';
    
    container.innerHTML = `
        <div class="component-preview-loading"></div>
        <div class="component-preview-placeholder">
            <p>${loadingText}</p>
        </div>
    `;
}

// ============================================
// LOAD COMPONENT IMAGE WITH TRANSLATION
// ============================================
function loadComponentImage(container, imageUrl, selectElement) {
    const img = new Image();
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const componentName = selectedOption.text;
    const componentPrice = selectedOption.getAttribute('data-price');
    const currentLang = getCurrentLanguage ? getCurrentLanguage() : 'id';
    const clickToEnlargeText = currentLang === 'en' ? 'Click to enlarge' : 'Klik untuk memperbesar';
    
    img.onload = function() {
        container.innerHTML = '';
        
        // Create image wrapper
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'component-preview-zoom';
        
        // Create image element
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        imgElement.alt = componentName;
        imgElement.className = 'component-preview-image';
        imgElement.title = clickToEnlargeText;
        
        // Add click event for lightbox
        imgElement.addEventListener('click', function() {
            openImageLightbox(imageUrl, componentName, componentPrice);
        });
        
        imageWrapper.appendChild(imgElement);
        
        // Add info badge
        if (componentPrice) {
            const badge = document.createElement('div');
            badge.className = 'component-info-badge';
            badge.textContent = formatCurrency(parseInt(componentPrice));
            imageWrapper.appendChild(badge);
        }
        
        container.appendChild(imageWrapper);
        
        // Add fade-in animation
        container.style.opacity = '0';
        setTimeout(() => {
            container.style.transition = 'opacity 0.3s ease';
            container.style.opacity = '1';
        }, 50);
    };
    
    img.onerror = function() {
        showErrorState(container);
    };
    
    img.src = imageUrl;
}


// ============================================
// SHOW PLACEHOLDER IMAGE
// ============================================
function showPlaceholderImage(container, componentType) {
    const placeholderUrl = getPlaceholderImage(componentType);
    
    const img = new Image();
    img.onload = function() {
        container.innerHTML = `
            <div class="component-preview-zoom">
                <img src="${placeholderUrl}" 
                     alt="Placeholder" 
                     class="component-preview-image"
                     style="opacity: 0.5;">
            </div>
        `;
    };
    img.onerror = function() {
        showErrorState(container);
    };
    img.src = placeholderUrl;
}

// ============================================
// SHOW ERROR STATE WITH TRANSLATION
// ============================================
function showErrorState(container) {
    const currentLang = getCurrentLanguage ? getCurrentLanguage() : 'id';
    const errorText = currentLang === 'en' ? 'Failed to load image' : 'Gagal memuat gambar';
    
    container.innerHTML = `
        <div class="component-preview-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>${errorText}</p>
        </div>
    `;
}

// ============================================
// IMAGE LIGHTBOX
// ============================================
function openImageLightbox(imageUrl, componentName, componentPrice) {
    // Remove existing lightbox if any
    const existingLightbox = document.querySelector('.image-lightbox');
    if (existingLightbox) {
        document.body.removeChild(existingLightbox);
    }
    
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    
    const priceText = componentPrice ? ` - ${formatCurrency(parseInt(componentPrice))}` : '';
    
    lightbox.innerHTML = `
        <div class="image-lightbox-content">
            <button class="image-lightbox-close" onclick="closeImageLightbox()">&times;</button>
            <img src="${imageUrl}" alt="${componentName}" class="image-lightbox-image">
            <div class="image-lightbox-info">${componentName}${priceText}</div>
        </div>
    `;
    
    // Close on overlay click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeImageLightbox();
        }
    });
    
    // Close on ESC key
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            closeImageLightbox();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    document.body.appendChild(lightbox);
    
    // Show with animation
    setTimeout(() => {
        lightbox.classList.add('show');
    }, 10);
}

function closeImageLightbox() {
    const lightbox = document.querySelector('.image-lightbox');
    if (lightbox) {
        lightbox.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(lightbox)) {
                document.body.removeChild(lightbox);
            }
        }, 300);
    }
}

// Make closeImageLightbox available globally
window.closeImageLightbox = closeImageLightbox;

// ============================================
// PRELOAD IMAGES
// ============================================
function preloadComponentImages() {
    console.log('Preloading component images...');
    
    let preloadedCount = 0;
    const totalImages = Object.keys(ComponentImages).reduce((acc, key) => 
        acc + Object.keys(ComponentImages[key]).length, 0
    );
    
    Object.keys(ComponentImages).forEach(type => {
        Object.keys(ComponentImages[type]).forEach(key => {
            const img = new Image();
            img.onload = function() {
                preloadedCount++;
                if (preloadedCount === totalImages) {
                    console.log(`âœ“ All ${totalImages} component images preloaded`);
                }
            };
            img.onerror = function() {
                console.warn(`Failed to preload: ${ComponentImages[type][key]}`);
                preloadedCount++;
            };
            img.src = ComponentImages[type][key];
        });
    });
}

// ============================================
// GET ALL SELECTED COMPONENTS WITH IMAGES
// ============================================
function getAllComponentsWithImages() {
    const components = [];
    const selects = document.querySelectorAll('.component-select');
    
    selects.forEach(select => {
        if (select.value) {
            const componentType = select.id.replace('-select', '');
            const selectedOption = select.options[select.selectedIndex];
            const imageUrl = getComponentImage(componentType, select.value);
            
            components.push({
                type: componentType,
                value: select.value,
                name: selectedOption.text,
                price: parseInt(selectedOption.getAttribute('data-price') || 0),
                imageUrl: imageUrl || getPlaceholderImage(componentType)
            });
        }
    });
    
    return components;
}

// ============================================
// SHOW BUILD SUMMARY WITH IMAGES AND TRANSLATION
// ============================================
function showBuildSummaryWithImages() {
    const components = getAllComponentsWithImages();
    const currentLang = getCurrentLanguage ? getCurrentLanguage() : 'id';
    const trans = translations[currentLang];
    
    if (components.length === 0) {
        const noComponentsText = trans.notifications.noComponents || 'Tidak ada komponen yang dipilih';
        showNotification(noComponentsText, 'warning');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal show';
    
    let totalPrice = components.reduce((sum, comp) => sum + comp.price, 0);
    
    let componentsHTML = components.map(comp => `
        <div class="component-preview-grid-item">
            <img src="${comp.imageUrl}" alt="${comp.name}" loading="lazy">
            <h4>${comp.name}</h4>
            <p>${formatCurrency(comp.price)}</p>
        </div>
    `).join('');
    
    const summaryTitle = currentLang === 'en' ? 'ðŸ“¦ Build Summary with Preview' : 'ðŸ“¦ Ringkasan Build dengan Preview';
    const totalPriceText = trans.build.sidebar.totalPrice || 'Total Harga';
    const saveText = trans.common.save || 'Simpan';
    const closeText = trans.common.close || 'Tutup';
    const saveBuildText = currentLang === 'en' ? 'Save Build' : 'Simpan Build';
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-container" style="max-width: 900px;">
            <div class="modal-header">
                <h2>${summaryTitle}</h2>
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="component-preview-grid">
                    ${componentsHTML}
                </div>
                <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(59, 130, 246, 0.1); border-radius: 8px; text-align: center;">
                    <h3 style="color: var(--text-light); margin-bottom: 0.5rem;">${totalPriceText}</h3>
                    <p style="font-size: 2rem; font-weight: 700; color: var(--accent-light);">${formatCurrency(totalPrice)}</p>
                </div>
                <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="saveBuild()">${saveBuildText}</button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">${closeText}</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Make sure all functions are available globally
window.showPlaceholder = showPlaceholder;
window.showLoadingState = showLoadingState;
window.showErrorState = showErrorState;
window.loadComponentImage = loadComponentImage;
window.showBuildSummaryWithImages = showBuildSummaryWithImages;
// ============================================
// REFRESH ALL PREVIEWS
// ============================================
function refreshAllPreviews() {
    const selects = document.querySelectorAll('.component-select');
    selects.forEach(select => {
        if (select.value) {
            handleComponentSelection(select);
        }
    });
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
window.initializeComponentPreviews = initializeComponentPreviews;
window.preloadComponentImages = preloadComponentImages;
window.getAllComponentsWithImages = getAllComponentsWithImages;
window.showBuildSummaryWithImages = showBuildSummaryWithImages;
window.refreshAllPreviews = refreshAllPreviews;

console.log('component-preview.js loaded successfully');