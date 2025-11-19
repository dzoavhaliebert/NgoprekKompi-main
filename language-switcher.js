const LanguageState = {
    currentLang: 'id',
    initialized: false
};

function initializeLanguageSwitcher() {
    if (LanguageState.initialized) {
        console.log('Language switcher already initialized');
        return;
    }
    
    try {
        const savedLang = Storage.get('selectedLanguage', 'id');
        LanguageState.currentLang = savedLang;
        addLanguageSwitcherToNavbar();
        applyLanguage(LanguageState.currentLang);
        LanguageState.initialized = true;
        console.log('✓ Language switcher initialized. Current language:', LanguageState.currentLang);
    } catch (error) {
        console.error('Error initializing language switcher:', error);
    }
}

function addLanguageSwitcherToNavbar() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions || document.getElementById('language-switcher')) return;
    
    const languageSwitcher = document.createElement('div');
    languageSwitcher.id = 'language-switcher';
    languageSwitcher.className = 'language-switcher';
    languageSwitcher.innerHTML = `
        <button class="lang-btn" id="lang-btn" data-lang="${LanguageState.currentLang}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span class="lang-text">${LanguageState.currentLang.toUpperCase()}</span>
        </button>
        <div class="lang-dropdown" id="lang-dropdown">
            <button class="lang-option" data-lang="id">
                <span class="lang-flag">🇮🇩</span>
                <span class="lang-name">Bahasa Indonesia</span>
            </button>
            <button class="lang-option" data-lang="en">
                <span class="lang-flag">🇬🇧</span>
                <span class="lang-name">English Language</span>
            </button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .language-switcher { position: relative; margin-left: 1rem; }
        .lang-btn { background: transparent; border: 2px solid rgba(255, 255, 255, 0.2); color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; font-weight: 600; transition: all 0.3s ease; }
        .lang-btn:hover { border-color: var(--accent); background: rgba(59, 130, 246, 0.1); }
        .lang-text { font-weight: 700; }
        .lang-dropdown { position: absolute; top: calc(100% + 0.5rem); right: 0; background: var(--primary-dark); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 0.5rem; min-width: 200px; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all 0.3s ease; z-index: 1000; box-shadow: var(--shadow-xl); }
        .lang-dropdown.show { opacity: 1; visibility: visible; transform: translateY(0); }
        .lang-option { width: 100%; background: transparent; border: none; color: white; padding: 0.75rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem; border-radius: 6px; transition: all 0.3s ease; }
        .lang-option:hover { background: rgba(59, 130, 246, 0.2); }
        .lang-option.active { background: var(--accent); }
        .lang-flag { font-size: 1.5rem; }
        .lang-name { font-weight: 500; }
        @media (max-width: 768px) {
            .lang-btn { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
            .lang-dropdown { right: -1rem; }
        }
    `;
    document.head.appendChild(style);
    
    const searchBtn = navActions.querySelector('.search-btn');
    if (searchBtn) {
        navActions.insertBefore(languageSwitcher, searchBtn);
    } else {
        navActions.appendChild(languageSwitcher);
    }
    
    attachLanguageSwitcherEvents();
}

function attachLanguageSwitcherEvents() {
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!langBtn || !langDropdown) return;
    
    langBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-switcher')) {
            langDropdown.classList.remove('show');
        }
    });
    
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            switchLanguage(selectedLang);
            langDropdown.classList.remove('show');
        });
        
        if (option.getAttribute('data-lang') === LanguageState.currentLang) {
            option.classList.add('active');
        }
    });
}

function switchLanguage(lang) {
    if (lang === LanguageState.currentLang) return;
    
    if (!translations[lang]) {
        console.error('Language not supported:', lang);
        showNotification('Bahasa tidak didukung / Language not supported', 'error');
        return;
    }
    
    showLoading(lang === 'id' ? 'Mengganti bahasa...' : 'Switching language...');
    
    setTimeout(() => {
        try {
            LanguageState.currentLang = lang;
            Storage.set('selectedLanguage', lang);
            
            const langBtn = document.getElementById('lang-btn');
            if (langBtn) {
                langBtn.setAttribute('data-lang', lang);
                langBtn.querySelector('.lang-text').textContent = lang.toUpperCase();
            }
            
            document.querySelectorAll('.lang-option').forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-lang') === lang) {
                    option.classList.add('active');
                }
            });
            
            applyLanguage(lang);
            document.documentElement.lang = lang;
            
            hideLoading();
            showNotification(
                lang === 'id' ? '✓ Bahasa berhasil diganti' : '✓ Language successfully changed',
                'success'
            );
            
            console.log('Language switched to:', lang);
        } catch (error) {
            console.error('Error switching language:', error);
            hideLoading();
            showNotification('Error switching language', 'error');
        }
    }, 500);
}

function applyLanguage(lang) {
    const trans = translations[lang];
    if (!trans) {
        console.error('Translation not found for language:', lang);
        return;
    }
    
    try {
        updateNavbar(trans);
        const currentPage = getCurrentPage();
        
        switch(currentPage) {
            case 'home': updateHomePage(trans); break;
            case 'build': updateBuildPage(trans); break;
            case 'recommend': updateRecommendPage(trans); break;
            case 'disclaimer': updateDisclaimerPage(trans); break;
            case 'contact': updateContactPage(trans); break;
        }
        
        updateFooter(trans);
        console.log('✓ Language applied:', lang);
    } catch (error) {
        console.error('Error applying language:', error);
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    
    if (filename.includes('home') || filename === '' || filename === 'index.html') return 'home';
    else if (filename.includes('rakitpc')) return 'build';
    else if (filename.includes('rekomendasi')) return 'recommend';
    else if (filename.includes('disclaimer')) return 'disclaimer';
    else if (filename.includes('kontak')) return 'contact';
    
    return 'home';
}

function updateNavbar(trans) {
    const navBrand = document.querySelector('.nav-brand span');
    if (navBrand) navBrand.textContent = trans.nav.brand;
    
    const navLinks = document.querySelectorAll('.nav-links a');
    const navKeys = ['home', 'build', 'recommend', 'disclaimer', 'contact'];
    
    navLinks.forEach((link, index) => {
        if (navKeys[index]) link.textContent = trans.nav[navKeys[index]];
    });
}

function updateHomePage(trans) {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.innerHTML = trans.home.hero.title;
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.innerHTML = trans.home.hero.subtitle;
    
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        const buttonText = ctaButton.childNodes[0];
        if (buttonText) buttonText.textContent = trans.home.hero.cta + ' ';
    }
    
    const sectionTitle = document.querySelector('.section-title-modern');
    if (sectionTitle) sectionTitle.textContent = trans.home.features.title;
    
    const sectionDesc = document.querySelector('.section-description');
    if (sectionDesc) sectionDesc.textContent = trans.home.features.subtitle;
    
    const features = document.querySelectorAll('.feature-card-modern');
    const featureKeys = ['budget', 'compatibility', 'performance', 'save', 'compare', 'smart'];
    
    features.forEach((feature, index) => {
        if (featureKeys[index]) {
            const h3 = feature.querySelector('h3');
            const p = feature.querySelector('p');
            if (h3) h3.textContent = trans.home.features[featureKeys[index]].title;
            if (p) p.textContent = trans.home.features[featureKeys[index]].desc;
        }
    });
    
    const ctaTitle = document.querySelector('.cta-content h2');
    if (ctaTitle) ctaTitle.textContent = trans.home.cta.title;
    
    const ctaSubtitle = document.querySelector('.cta-content p');
    if (ctaSubtitle) ctaSubtitle.textContent = trans.home.cta.subtitle;
    
    const ctaBtnMain = document.querySelector('.btn-cta');
    if (ctaBtnMain) ctaBtnMain.textContent = trans.home.cta.button;
}

function updateBuildPage(trans) {
    const summaryHeaders = document.querySelectorAll('.summary-card h3');
    if (summaryHeaders[0]) summaryHeaders[0].textContent = trans.build.sidebar.budget;
    if (summaryHeaders[1]) summaryHeaders[1].textContent = trans.build.sidebar.summary;
    if (summaryHeaders[2]) summaryHeaders[2].textContent = trans.build.sidebar.savedBuilds;
    
    const budgetLabels = document.querySelectorAll('.budget-input-group label');
    if (budgetLabels[0]) budgetLabels[0].textContent = trans.build.sidebar.budgetMin;
    if (budgetLabels[1]) budgetLabels[1].textContent = trans.build.sidebar.budgetMax;
    
    const priceLabel = document.querySelector('.price-label');
    if (priceLabel) priceLabel.textContent = trans.build.sidebar.totalPrice;
    
    const actionButtons = document.querySelectorAll('.action-buttons .btn');
    if (actionButtons[0]) actionButtons[0].textContent = trans.build.actions.analysis;
    if (actionButtons[1]) actionButtons[1].textContent = trans.build.actions.save;
    if (actionButtons[2]) actionButtons[2].textContent = trans.build.actions.print;
    if (actionButtons[3]) actionButtons[3].textContent = trans.build.actions.reset;
    
    const componentLabels = document.querySelectorAll('.component-header label');
    const componentKeys = ['cpu', 'mb', 'ram', 'vga', 'storage', 'psu', 'case', 'cooling', 'os'];
    
    componentLabels.forEach((label, index) => {
        if (componentKeys[index]) label.textContent = trans.build.components[componentKeys[index]];
    });
    
    const selects = document.querySelectorAll('.component-select');
    selects.forEach(select => {
        const firstOption = select.options[0];
        if (firstOption && firstOption.value === '') {
            firstOption.textContent = trans.build.components.selectPlaceholder + ' ' + 
                                      select.previousElementSibling.textContent;
        }
    });
    
    const modalTitle = document.querySelector('#analysis-modal .modal-header h2');
    if (modalTitle) modalTitle.textContent = trans.build.modal.performance;
    
    const modalSubtitle = document.querySelector('#analysis-modal .modal-subtitle');
    if (modalSubtitle) modalSubtitle.textContent = trans.build.modal.subtitle;
}

function updateRecommendPage(trans) {
    const sectionHeader = document.querySelector('.section-header');
    if (sectionHeader) {
        const h2 = sectionHeader.querySelector('h2');
        const p = sectionHeader.querySelector('p');
        if (h2) h2.textContent = trans.recommend.title;
        if (p) p.textContent = trans.recommend.subtitle;
    }
    
    const presetCards = document.querySelectorAll('.preset-card');
    const presetKeys = ['office', 'school', 'budget', 'gaming', 'editing', 'server'];
    
    presetCards.forEach((card, index) => {
        if (presetKeys[index]) {
            const h3 = card.querySelector('h3');
            const badge = card.querySelector('.preset-badge');
            const button = card.querySelector('.btn-preset');
            
            if (h3) h3.textContent = trans.recommend.presets[presetKeys[index]].title;
            if (badge) badge.textContent = trans.recommend.presets[presetKeys[index]].badge;
            if (button) button.textContent = trans.recommend.button;
        }
    });
    
    const guideTitle = document.querySelector('.component-guide-section .section-title-modern');
    if (guideTitle) guideTitle.textContent = trans.recommend.guide.title;
    
    const guideDesc = document.querySelector('.component-guide-section .section-description');
    if (guideDesc) guideDesc.textContent = trans.recommend.guide.subtitle;
    
    const guideCards = document.querySelectorAll('.component-guide-card');
    const guideKeys = ['cpu', 'mb', 'ram', 'vga', 'storage', 'psu'];
    
    guideCards.forEach((card, index) => {
        if (guideKeys[index]) {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p');
            if (h3) h3.textContent = trans.recommend.guide[guideKeys[index]].title;
            if (p) p.textContent = trans.recommend.guide[guideKeys[index]].desc;
        }
    });
}

function updateDisclaimerPage(trans) {
    const sectionHeader = document.querySelector('.section-header');
    if (sectionHeader) {
        const h2 = sectionHeader.querySelector('h2');
        const p = sectionHeader.querySelector('p');
        if (h2) h2.textContent = trans.disclaimer.title;
        if (p) p.textContent = trans.disclaimer.subtitle;
    }
    
    const assemblySectionTitle = document.querySelector('.disclaimer-section:first-of-type h3');
    if (assemblySectionTitle) assemblySectionTitle.textContent = trans.disclaimer.assembly.title;
    
    const assemblySteps = document.querySelectorAll('.step-item');
    const stepKeys = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8', 'step9', 'step10'];
    assemblySteps.forEach((step, index) => {
        if (stepKeys[index] && trans.disclaimer.assembly[stepKeys[index]]) {
            const h4 = step.querySelector('h4');
            const p = step.querySelector('p');
            if (h4) h4.textContent = trans.disclaimer.assembly[stepKeys[index]].title;
            if (p) p.textContent = trans.disclaimer.assembly[stepKeys[index]].desc;
        }
    });
    
    const considerationsTitle = document.querySelector('.disclaimer-section:nth-of-type(2) h3');
    if (considerationsTitle) considerationsTitle.textContent = trans.disclaimer.considerations.title;
    
    const considerationItems = document.querySelectorAll('.disclaimer-section:nth-of-type(2) .info-item');
    const considerationKeys = ['socket', 'psu', 'ram', 'case', 'cooling', 'warranty', 'bios'];
    considerationItems.forEach((item, index) => {
        if (considerationKeys[index] && trans.disclaimer.considerations[considerationKeys[index]]) {
            const h4 = item.querySelector('h4');
            const p = item.querySelector('p');
            if (h4) h4.textContent = trans.disclaimer.considerations[considerationKeys[index]].title;
            if (p) p.textContent = trans.disclaimer.considerations[considerationKeys[index]].desc;
        }
    });
    
    const safetyTitle = document.querySelector('.disclaimer-section:nth-of-type(3) h3');
    if (safetyTitle) safetyTitle.textContent = trans.disclaimer.safety.title;
    
    const safetyItems = document.querySelectorAll('.disclaimer-section:nth-of-type(3) .info-item');
    const safetyKeys = ['workspace', 'antistatic', 'electricity', 'handling', 'force', 'professional'];
    safetyItems.forEach((item, index) => {
        if (safetyKeys[index] && trans.disclaimer.safety[safetyKeys[index]]) {
            const h4 = item.querySelector('h4');
            const p = item.querySelector('p');
            if (h4) h4.textContent = trans.disclaimer.safety[safetyKeys[index]].title;
            if (p) p.textContent = trans.disclaimer.safety[safetyKeys[index]].desc;
        }
    });
    
    const environmentTitle = document.querySelector('.disclaimer-section:nth-of-type(4) h3');
    if (environmentTitle) environmentTitle.textContent = trans.disclaimer.environment.title;
    
    const environmentItems = document.querySelectorAll('.disclaimer-section:nth-of-type(4) .info-item');
    const environmentKeys = ['disposal', 'efficiency', 'packaging', 'power'];
    environmentItems.forEach((item, index) => {
        if (environmentKeys[index] && trans.disclaimer.environment[environmentKeys[index]]) {
            const h4 = item.querySelector('h4');
            const p = item.querySelector('p');
            if (h4) h4.textContent = trans.disclaimer.environment[environmentKeys[index]].title;
            if (p) p.textContent = trans.disclaimer.environment[environmentKeys[index]].desc;
        }
    });
    
    const toolsTitle = document.querySelector('.disclaimer-section:nth-of-type(5) h3');
    if (toolsTitle) toolsTitle.textContent = trans.disclaimer.tools.title;
    
    const toolItems = document.querySelectorAll('.disclaimer-section:nth-of-type(5) .info-item');
    const toolKeys = ['screwdriver', 'flathead', 'wriststrap', 'thermal', 'cables', 'flashlight', 'manual'];
    toolItems.forEach((item, index) => {
        if (toolKeys[index] && trans.disclaimer.tools[toolKeys[index]]) {
            const h4 = item.querySelector('h4');
            const p = item.querySelector('p');
            if (h4) h4.textContent = trans.disclaimer.tools[toolKeys[index]].title;
            if (p) p.textContent = trans.disclaimer.tools[toolKeys[index]].desc;
        }
    });
    
    const generalTitle = document.querySelector('.disclaimer-general h3');
    if (generalTitle) generalTitle.textContent = trans.disclaimer.general.title;
    
    const generalText = document.querySelector('.disclaimer-general');
    if (generalText) {
        const paragraphs = generalText.querySelectorAll('p');
        if (paragraphs[0]) paragraphs[0].textContent = trans.disclaimer.general.intro;
        if (paragraphs[1]) paragraphs[1].innerHTML = `<strong>${trans.disclaimer.general.notResponsible}</strong>`;
        
        const ul = generalText.querySelector('ul');
        if (ul) {
            const listItems = ul.querySelectorAll('li');
            const liKeys = ['damage', 'incompatibility', 'pricing', 'performance', 'purchase', 'data'];
            listItems.forEach((li, index) => {
                if (liKeys[index]) li.textContent = trans.disclaimer.general[liKeys[index]];
            });
        }
        
        if (paragraphs[2]) paragraphs[2].innerHTML = `<strong>${trans.disclaimer.general.recommendations}</strong>`;
        
        const olItems = generalText.querySelectorAll('ol li');
        const olKeys = ['verify', 'checkPrice', 'consult', 'review', 'warranty'];
        olItems.forEach((li, index) => {
            if (olKeys[index]) li.textContent = trans.disclaimer.general[olKeys[index]];
        });
        
        const lastP = paragraphs[paragraphs.length - 1];
        if (lastP) lastP.innerHTML = `<strong>${trans.disclaimer.general.agreement}</strong>`;
    }
}

function updateContactPage(trans) {
    const sectionHeader = document.querySelector('.section-header');
    if (sectionHeader) {
        const h2 = sectionHeader.querySelector('h2');
        const p = sectionHeader.querySelector('p');
        if (h2) h2.textContent = trans.contact.title;
        if (p) p.textContent = trans.contact.subtitle;
    }
    
    const contactCards = document.querySelectorAll('.contact-card');
    
    if (contactCards[0]) {
        const h3 = contactCards[0].querySelector('h3');
        const phoneNum = contactCards[0].querySelector('a');
        const p = contactCards[0].querySelector('p');
        if (h3) h3.textContent = trans.contact.phone;
        if (phoneNum) phoneNum.textContent = trans.contact.phoneNumber;
        if (p) p.textContent = trans.contact.phoneHours;
    }
    
    if (contactCards[1]) {
        const h3 = contactCards[1].querySelector('h3');
        const email = contactCards[1].querySelector('a');
        const p = contactCards[1].querySelector('p');
        if (h3) h3.textContent = trans.contact.email;
        if (email) email.textContent = trans.contact.emailAddress;
        if (p) p.textContent = trans.contact.emailResponse;
    }
    
    if (contactCards[2]) {
        const h3 = contactCards[2].querySelector('h3');
        const paragraphs = contactCards[2].querySelectorAll('p');
        if (h3) h3.textContent = trans.contact.address;
        if (paragraphs[0]) paragraphs[0].textContent = trans.contact.addressLine1;
        if (paragraphs[1]) paragraphs[1].textContent = trans.contact.addressLine2;
        if (paragraphs[2]) paragraphs[2].textContent = trans.contact.country;
    }
    
    if (contactCards[3]) {
        const h3 = contactCards[3].querySelector('h3');
        const instaHandle = contactCards[3].querySelector('a');
        const p = contactCards[3].querySelector('p');
        if (h3) h3.textContent = trans.contact.instagram;
        if (instaHandle) instaHandle.textContent = trans.contact.instagramHandle;
        if (p) p.textContent = trans.contact.instagramDesc;
    }
    
    const formTitle = document.querySelector('.form-card h3');
    if (formTitle) formTitle.textContent = trans.contact.form.title;
    
    const formDesc = document.querySelector('.form-description');
    if (formDesc) formDesc.textContent = trans.contact.form.desc;
    
    const formGroups = document.querySelectorAll('.form-group');
    
    if (formGroups[0]) {
        const label = formGroups[0].querySelector('label');
        const input = formGroups[0].querySelector('input');
        if (label) label.textContent = trans.contact.form.name;
        if (input) input.placeholder = trans.contact.form.namePlaceholder;
    }
    
    if (formGroups[1]) {
        const label = formGroups[1].querySelector('label');
        const input = formGroups[1].querySelector('input');
        if (label) label.textContent = trans.contact.form.email;
        if (input) input.placeholder = trans.contact.form.emailPlaceholder;
    }
    
    if (formGroups[2]) {
        const label = formGroups[2].querySelector('label');
        const input = formGroups[2].querySelector('input');
        if (label) label.textContent = trans.contact.form.phone;
        if (input) input.placeholder = trans.contact.form.phonePlaceholder;
    }
    
    if (formGroups[3]) {
        const label = formGroups[3].querySelector('label');
        const select = formGroups[3].querySelector('select');
        if (label) label.textContent = trans.contact.form.category;
        if (select) {
            const options = select.querySelectorAll('option');
            if (options[0]) options[0].textContent = trans.contact.form.categoryPlaceholder;
            if (options[1]) options[1].textContent = trans.contact.form.categoryOptions.suggestion;
            if (options[2]) options[2].textContent = trans.contact.form.categoryOptions.criticism;
            if (options[3]) options[3].textContent = trans.contact.form.categoryOptions.question;
            if (options[4]) options[4].textContent = trans.contact.form.categoryOptions.bug;
            if (options[5]) options[5].textContent = trans.contact.form.categoryOptions.other;
        }
    }
    
    if (formGroups[4]) {
        const label = formGroups[4].querySelector('label');
        const textarea = formGroups[4].querySelector('textarea');
        if (label) label.textContent = trans.contact.form.message;
        if (textarea) textarea.placeholder = trans.contact.form.messagePlaceholder;
    }
    
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) {
        const btnText = submitBtn.childNodes[2];
        if (btnText && btnText.nodeType === Node.TEXT_NODE) {
            btnText.textContent = ' ' + trans.contact.form.submit;
        }
    }
}

function updateFooter(trans) {
    const footerSections = document.querySelectorAll('.footer-section');
    
    if (footerSections[0]) {
        const p = footerSections[0].querySelector('p');
        if (p) p.textContent = trans.footer.about;
    }
    
    if (footerSections[1]) {
        const h4 = footerSections[1].querySelector('h4');
        if (h4) h4.textContent = trans.footer.quickLinks;
        
        const links = footerSections[1].querySelectorAll('a');
        const linkKeys = ['home', 'build', 'recommend', 'disclaimer', 'contact'];
        
        links.forEach((link, index) => {
            if (linkKeys[index] && trans.nav[linkKeys[index]]) {
                link.textContent = trans.nav[linkKeys[index]];
            }
        });
    }
    
    if (footerSections[2]) {
        const h4 = footerSections[2].querySelector('h4');
        if (h4) h4.textContent = trans.footer.contact;
    }
    
    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) {
        const year = new Date().getFullYear();
        footerBottom.innerHTML = `&copy; ${year} NgoPi. ${trans.footer.copyright}`;
    }
}

function getCurrentLanguage() {
    return LanguageState.currentLang;
}

function t(key, lang = null) {
    const currentLang = lang || LanguageState.currentLang;
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }
    
    return value;
}

// Tambahkan fungsi ini ke language-switcher.js Anda

// ============================================
// APPLY TRANSLATIONS BY DATA-ATTRIBUTE
// ============================================
function applyTranslationsByAttribute(lang) {
    const trans = translations[lang];
    if (!trans) return;
    
    // Find all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getNestedTranslation(trans, key);
        
        if (translation) {
            // Check if element is input with placeholder
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            } 
            // Check if element is select with first option
            else if (element.tagName === 'SELECT' && element.getAttribute('data-translate-first')) {
                const firstOption = element.options[0];
                if (firstOption) {
                    firstOption.textContent = translation;
                }
            }
            // Otherwise set textContent
            else {
                element.textContent = translation;
            }
        }
    });
}

// Helper function to get nested translation
function getNestedTranslation(obj, path) {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
        if (value && value[key] !== undefined) {
            value = value[key];
        } else {
            return null;
        }
    }
    
    return value;
}

// ============================================
// UPDATE DISCLAIMER PAGE - ENHANCED
// ============================================
function updateDisclaimerPage(trans) {
    // Use data-translate attributes first
    applyTranslationsByAttribute(getCurrentLanguage());
    
    // Fallback manual updates for complex structures
    const sectionHeader = document.querySelector('.section-header');
    if (sectionHeader) {
        const h2 = sectionHeader.querySelector('h2');
        const p = sectionHeader.querySelector('p');
        if (h2 && !h2.hasAttribute('data-translate')) h2.textContent = trans.disclaimer.title;
        if (p && !p.hasAttribute('data-translate')) p.textContent = trans.disclaimer.subtitle;
    }
    
    // Assembly steps
    const assemblySectionTitle = document.querySelector('.info-box.warning-box:first-of-type h3');
    if (assemblySectionTitle && !assemblySectionTitle.hasAttribute('data-translate')) {
        assemblySectionTitle.textContent = trans.disclaimer.assembly.title;
    }
    
    const assemblySteps = document.querySelectorAll('.step-item');
    const stepKeys = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8', 'step9', 'step10'];
    assemblySteps.forEach((step, index) => {
        if (stepKeys[index] && trans.disclaimer.assembly[stepKeys[index]]) {
            const h4 = step.querySelector('h4');
            const p = step.querySelector('p');
            if (h4 && !h4.hasAttribute('data-translate')) h4.textContent = trans.disclaimer.assembly[stepKeys[index]].title;
            if (p && !p.hasAttribute('data-translate')) p.textContent = trans.disclaimer.assembly[stepKeys[index]].desc;
        }
    });
    
    console.log('✓ Disclaimer page updated with translations');
}

// Update the applyLanguage function to include data-translate
function applyLanguage(lang) {
    const trans = translations[lang];
    if (!trans) {
        console.error('Translation not found for language:', lang);
        return;
    }
    
    try {
        // Apply translations by data-attribute (works for all pages)
        applyTranslationsByAttribute(lang);
        
        // Update navbar
        updateNavbar(trans);
        
        // Get current page
        const currentPage = getCurrentPage();
        
        // Apply page-specific translations
        switch(currentPage) {
            case 'home': updateHomePage(trans); break;
            case 'build': updateBuildPage(trans); break;
            case 'recommend': updateRecommendPage(trans); break;
            case 'disclaimer': updateDisclaimerPage(trans); break;
            case 'contact': updateContactPage(trans); break;
        }
        
        // Update footer
        updateFooter(trans);
        
        console.log('✓ Language applied:', lang);
    } catch (error) {
        console.error('Error applying language:', error);
    }
}

// Export the new functions
window.applyTranslationsByAttribute = applyTranslationsByAttribute;
window.getNestedTranslation = getNestedTranslation;

console.log('language-switcher.js enhanced with data-translate support');
window.initializeLanguageSwitcher = initializeLanguageSwitcher;
window.switchLanguage = switchLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.t = t;

console.log('language-switcher.js loaded successfully');