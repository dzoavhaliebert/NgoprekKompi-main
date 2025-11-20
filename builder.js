// builder.js - FIXED & ENHANCED VERSION
// Semua fungsi besar aplikasi dengan perbaikan bug dan fitur tambahan

// ============================================
// STATE MANAGEMENT
// ============================================
const AppState = {
    currentBuild: {
        components: [],
        totalPrice: 0,
        buildName: '',
        timestamp: null
    },
    budgetRange: {
        min: 0,
        max: 100000000
    },
    compatibilityIssues: [],
    performanceScores: null,
    isInitialized: false
};

// ============================================
// INITIALIZATION
// ============================================
function initializeApp() {
    if (AppState.isInitialized) {
        console.log('App already initialized');
        return;
    }
    
    try {
        attachEventListeners();
        initializeBudgetFilter();
        loadSavedBuilds();
        updateBuildList();
        updateTotal();
        
        // Check for pending preset from recommendation page
        checkPendingPreset();
        
        AppState.isInitialized = true;
        console.log('PC Builder Pro - System Ready');
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Terjadi kesalahan saat memuat aplikasi', 'error');
    }
}

function attachEventListeners() {
    const selects = document.querySelectorAll('.component-select');
    selects.forEach(select => {
        // Remove existing listeners to prevent duplicates
        select.replaceWith(select.cloneNode(true));
    });
    
    // Reattach to cloned elements
    document.querySelectorAll('.component-select').forEach(select => {
        select.addEventListener('change', function() {
            updateTotal();
            checkBudgetConstraints();
            runCompatibilityCheck();
        });
    });

    const minBudget = document.getElementById('budget-min');
    const maxBudget = document.getElementById('budget-max');
    
    if (minBudget) {
        minBudget.addEventListener('input', debounce(applyBudgetFilter, 300));
    }
    if (maxBudget) {
        maxBudget.addEventListener('input', debounce(applyBudgetFilter, 300));
    }
}

// ============================================
// NAVIGATION SYSTEM
// ============================================
function showSection(sectionId) {
    try {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            console.warn(`Section ${sectionId} not found`);
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Navigation error:', error);
    }
}

// ============================================
// PRICE CALCULATION
// ============================================
function updateTotal() {
    try {
        const components = gatherComponents();
        const total = components.reduce((sum, comp) => sum + comp.price, 0);
        
        AppState.currentBuild.totalPrice = total;
        AppState.currentBuild.components = components;
        
        const totalPriceElement = document.getElementById('total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = total.toLocaleString('id-ID');
        }
    } catch (error) {
        console.error('Error updating total:', error);
    }
}

function gatherComponents() {
    const components = [];
    const selects = document.querySelectorAll('.component-select');
    
    selects.forEach(select => {
        if (select.value) {
            const selectedOption = select.options[select.selectedIndex];
            const price = parseInt(selectedOption.getAttribute('data-price') || 0);
            const brand = selectedOption.getAttribute('data-brand') || '';
            const socket = selectedOption.getAttribute('data-socket') || '';
            
            components.push({
                type: select.id,
                value: select.value,
                name: selectedOption.text,
                price: price,
                brand: brand,
                socket: socket
            });
        }
    });
    
    return components;
}

// ============================================
// BUDGET CALCULATOR - ENHANCED
// ============================================
function initializeBudgetFilter() {
    const minBudget = document.getElementById('budget-min');
    const maxBudget = document.getElementById('budget-max');

    if (minBudget && maxBudget) {
        minBudget.value = AppState.budgetRange.min;
        maxBudget.value = AppState.budgetRange.max;
        
        updateBudgetDisplay();
    }
}

function applyBudgetFilter() {
    try {
        const minBudget = parseInt(document.getElementById('budget-min').value) || 0;
        const maxBudget = parseInt(document.getElementById('budget-max').value) || 100000000;

        // Validate budget range
        if (minBudget > maxBudget) {
            showNotification('Budget minimum tidak boleh lebih besar dari maximum', 'warning');
            return;
        }

        AppState.budgetRange.min = minBudget;
        AppState.budgetRange.max = maxBudget;

        updateBudgetDisplay();
        filterComponentsByBudget();
        checkBudgetConstraints();
    } catch (error) {
        console.error('Error applying budget filter:', error);
        showNotification('Terjadi kesalahan saat memfilter budget', 'error');
    }
}

function updateBudgetDisplay() {
    const minDisplay = document.getElementById('budget-min-display');
    const maxDisplay = document.getElementById('budget-max-display');
    
    if (minDisplay) {
        minDisplay.textContent = formatCurrency(AppState.budgetRange.min);
    }
    if (maxDisplay) {
        maxDisplay.textContent = formatCurrency(AppState.budgetRange.max);
    }
}

function filterComponentsByBudget() {
    const currentTotal = AppState.currentBuild.totalPrice;
    
    document.querySelectorAll('.component-select').forEach(select => {
        const currentValue = select.value;
        const currentPrice = currentValue ? parseInt(select.options[select.selectedIndex].getAttribute('data-price') || 0) : 0;
        const baseTotal = currentTotal - currentPrice;
        
        Array.from(select.options).forEach(option => {
            if (option.value && option.value !== '') {
                const price = parseInt(option.getAttribute('data-price') || 0);
                const totalWithComponent = baseTotal + price;

                if (totalWithComponent > AppState.budgetRange.max) {
                    option.disabled = true;
                    option.style.color = '#999';
                    option.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                } else {
                    option.disabled = false;
                    option.style.color = '';
                    option.style.backgroundColor = '';
                }
            }
        });
    });
}

function checkBudgetConstraints() {
    const budgetStatus = document.getElementById('budget-status');
    const total = AppState.currentBuild.totalPrice;
    const max = AppState.budgetRange.max;

    if (!budgetStatus) return;

    let statusHTML = '';

    const percentUsed = max > 0 ? (total / max) * 100 : 0;

    if (total > max) {
        statusHTML = `
            <div class="budget-alert budget-danger">
                <strong>⚠️ Melebihi Budget</strong>
                <p>Kelebihan ${formatCurrency(total - max)}</p>
            </div>
        `;
    } else if (total >= max * 0.9) {
        statusHTML = `
            <div class="budget-alert budget-warning">
                <strong>⚡ Mendekati Batas Budget</strong>
                <p>Sisa: ${formatCurrency(max - total)}</p>
            </div>
        `;
    } else if (total > 0) {
        statusHTML = `
            <div class="budget-alert budget-success">
                <strong>✓ Dalam Budget</strong>
                <p>Sisa: ${formatCurrency(max - total)}</p>
            </div>
        `;
    }

    statusHTML += `
        <div class="budget-progress">
            <div class="budget-progress-bar" style="width: ${Math.min(percentUsed, 100)}%"></div>
        </div>
        <div class="budget-info">
            <span>${formatCurrency(total)}</span>
            <span>${Math.round(percentUsed)}%</span>
            <span>${formatCurrency(max)}</span>
        </div>
    `;

    budgetStatus.innerHTML = statusHTML;
}

// ============================================
// COMPATIBILITY CHECK - ENHANCED
// ============================================
function runCompatibilityCheck() {
    try {
        AppState.compatibilityIssues = [];
        
        const components = gatherComponents();
        
        if (components.length === 0) {
            clearCompatibilityDisplay();
            return;
        }
        
        checkCPUMotherboardCompatibility(components);
        checkPSURequirements(components);
        checkRAMCompatibility(components);
        checkCaseCompatibility(components);
        checkCoolingCompatibility(components);
        checkBottlenecks(components);
        checkEssentialComponents(components);
        
        displayCompatibilityResults();
    } catch (error) {
        console.error('Compatibility check error:', error);
        showNotification('Terjadi kesalahan saat memeriksa kompatibilitas', 'error');
    }
}

function checkCPUMotherboardCompatibility(components) {
    const cpu = components.find(c => c.type === 'cpu-select');
    const mb = components.find(c => c.type === 'mb-select');
    
    if (cpu && mb) {
        const cpuBrand = cpu.brand;
        const mbSocket = mb.socket;
        
        if (cpuBrand !== mbSocket) {
            AppState.compatibilityIssues.push({
                level: 'critical',
                category: 'Socket Tidak Cocok',
                message: `CPU membutuhkan socket ${cpuBrand.toUpperCase()} tetapi motherboard memiliki socket ${mbSocket.toUpperCase()}`,
                components: ['CPU', 'Motherboard'],
                solution: 'Pilih motherboard dengan tipe socket yang cocok'
            });
        }
    } else if (cpu && !mb) {
        AppState.compatibilityIssues.push({
            level: 'critical',
            category: 'Komponen Hilang',
            message: 'CPU dipilih tetapi belum ada motherboard',
            components: ['Motherboard'],
            solution: 'Pilih motherboard yang kompatibel'
        });
    } else if (mb && !cpu) {
        AppState.compatibilityIssues.push({
            level: 'critical',
            category: 'Komponen Hilang',
            message: 'Motherboard dipilih tetapi belum ada CPU',
            components: ['CPU'],
            solution: 'Pilih processor yang kompatibel'
        });
    }
}

function checkPSURequirements(components) {
    const psu = components.find(c => c.type === 'psu-select');
    const gpu = components.find(c => c.type === 'vga-select');
    const cpu = components.find(c => c.type === 'cpu-select');
    
    if (!psu && (gpu || cpu)) {
        AppState.compatibilityIssues.push({
            level: 'critical',
            category: 'PSU Hilang',
            message: 'Sistem membutuhkan power supply unit',
            components: ['PSU'],
            solution: 'Pilih power supply yang sesuai'
        });
        return;
    }
    
    if (!psu) return;
    
    const psuValue = psu.value;
    let requiredWattage = 0;
    let recommendation = '';
    
    if (gpu) {
        if (gpu.value.includes('4090')) {
            requiredWattage = 1000;
            recommendation = '1000W atau lebih tinggi';
        } else if (gpu.value.includes('7900-xtx') || gpu.value.includes('4080')) {
            requiredWattage = 850;
            recommendation = '850W atau lebih tinggi';
        } else if (gpu.value.includes('4070') || gpu.value.includes('7900-xt') || gpu.value.includes('7800-xt')) {
            requiredWattage = 750;
            recommendation = '750W atau lebih tinggi';
        } else if (gpu.value.includes('4060') || gpu.value.includes('7600')) {
            requiredWattage = 650;
            recommendation = '650W atau lebih tinggi';
        } else {
            requiredWattage = 550;
            recommendation = '550W atau lebih tinggi';
        }
    }
    
    const psuWattage = parseInt(psuValue.match(/(\d+)w/i)?.[1] || 0);
    
    if (psuWattage < requiredWattage) {
        AppState.compatibilityIssues.push({
            level: 'warning',
            category: 'Power Supply',
            message: `PSU mungkin tidak mencukupi. Saat ini: ${psuWattage}W, Rekomendasi: ${recommendation}`,
            components: ['PSU', 'GPU'],
            solution: `Upgrade ke PSU ${recommendation} untuk stabilitas sistem`
        });
    }
}

function checkRAMCompatibility(components) {
    const mb = components.find(c => c.type === 'mb-select');
    const ram = components.find(c => c.type === 'ram-select');
    
    if (!ram && mb) {
        AppState.compatibilityIssues.push({
            level: 'critical',
            category: 'RAM Hilang',
            message: 'Sistem membutuhkan memory untuk berfungsi',
            components: ['RAM'],
            solution: 'Pilih RAM yang sesuai untuk motherboard Anda'
        });
        return;
    }
    
    if (mb && ram) {
        const isDDR5Board = mb.value.includes('z790') || mb.value.includes('b650') || mb.value.includes('x670') || mb.value.includes('b760');
        const isDDR5RAM = ram.value.includes('ddr5');
        
        if (isDDR5Board && !isDDR5RAM) {
            AppState.compatibilityIssues.push({
                level: 'warning',
                category: 'Tipe Memory',
                message: 'Platform modern terdeteksi tetapi RAM DDR4 dipilih. Mungkin tidak kompatibel.',
                components: ['RAM', 'Motherboard'],
                solution: 'Pilih RAM DDR5 untuk platform Intel/AMD modern'
            });
        }
    }
}

function checkCaseCompatibility(components) {
    const caseComp = components.find(c => c.type === 'case-select');
    const cooling = components.find(c => c.type === 'cooling-select');
    
    if (!caseComp && cooling) {
        AppState.compatibilityIssues.push({
            level: 'warning',
            category: 'Case Hilang',
            message: 'Belum ada case yang dipilih untuk build',
            components: ['Case'],
            solution: 'Pilih case yang sesuai'
        });
        return;
    }
    
    if (caseComp && cooling) {
        const isBasicCase = caseComp.value === 'basic';
        const is360AIO = cooling.value.includes('360');
        
        if (isBasicCase && is360AIO) {
            AppState.compatibilityIssues.push({
                level: 'warning',
                category: 'Ukuran Case',
                message: 'Case basic mungkin tidak mendukung AIO cooler 360mm',
                components: ['Case', 'Cooling'],
                solution: 'Pilih case yang lebih besar atau gunakan cooler yang lebih kecil'
            });
        }
    }
}

function checkCoolingCompatibility(components) {
    const cpu = components.find(c => c.type === 'cpu-select');
    const cooling = components.find(c => c.type === 'cooling-select');
    
    if (cpu && !cooling) {
        AppState.compatibilityIssues.push({
            level: 'warning',
            category: 'Cooler Hilang',
            message: 'CPU membutuhkan solusi pendinginan',
            components: ['Cooling'],
            solution: 'Pilih CPU cooler yang sesuai'
        });
        return;
    }
    
    if (cpu && cooling) {
        const isHighEndCPU = cpu.value.includes('i9') || cpu.value.includes('ryzen9') || 
                            cpu.value.includes('7950') || cpu.value.includes('14900');
        const isBasicCooler = cooling.value.includes('hyper-212');
        
        if (isHighEndCPU && isBasicCooler) {
            AppState.compatibilityIssues.push({
                level: 'warning',
                category: 'Performa Pendinginan',
                message: 'CPU high-end mungkin membutuhkan solusi pendinginan yang lebih baik',
                components: ['CPU', 'Cooling'],
                solution: 'Pertimbangkan untuk upgrade ke tower air cooler atau AIO liquid cooling'
            });
        }
    }
}

function checkBottlenecks(components) {
    const cpu = components.find(c => c.type === 'cpu-select');
    const gpu = components.find(c => c.type === 'vga-select');
    
    if (cpu && gpu) {
        const cpuPrice = cpu.price;
        const gpuPrice = gpu.price;
        
        if (gpuPrice > cpuPrice * 3.5) {
            AppState.compatibilityIssues.push({
                level: 'info',
                category: 'Keseimbangan Performa',
                message: 'GPU jauh lebih powerful dari CPU - potensi CPU bottleneck dalam gaming',
                components: ['CPU', 'GPU'],
                solution: 'Pertimbangkan upgrade CPU untuk keseimbangan yang lebih baik'
            });
        } else if (cpuPrice > gpuPrice * 3.5) {
            AppState.compatibilityIssues.push({
                level: 'info',
                category: 'Keseimbangan Performa',
                message: 'CPU jauh lebih powerful dari GPU - GPU mungkin membatasi performa gaming',
                components: ['CPU', 'GPU'],
                solution: 'Pertimbangkan upgrade GPU untuk menyeimbangkan kemampuan CPU'
            });
        }
    }
}

function checkEssentialComponents(components) {
    const required = [
        { type: 'cpu-select', name: 'CPU' },
        { type: 'mb-select', name: 'Motherboard' },
        { type: 'ram-select', name: 'RAM' },
        { type: 'storage-select', name: 'Storage' },
        { type: 'psu-select', name: 'Power Supply' }
    ];
    
    required.forEach(req => {
        const found = components.find(c => c.type === req.type);
        if (!found) {
            AppState.compatibilityIssues.push({
                level: 'critical',
                category: 'Komponen Hilang',
                message: `${req.name} diperlukan untuk sistem yang fungsional`,
                components: [req.name],
                solution: `Pilih ${req.name} untuk melengkapi build Anda`
            });
        }
    });
}

function displayCompatibilityResults() {
    const warningEl = document.getElementById('warning');
    const successEl = document.getElementById('success');
    
    if (warningEl) {
        warningEl.innerHTML = '';
        warningEl.classList.remove('show');
    }
    if (successEl) {
        successEl.innerHTML = '';
        successEl.classList.remove('show');
    }
    
    const critical = AppState.compatibilityIssues.filter(i => i.level === 'critical');
    const warnings = AppState.compatibilityIssues.filter(i => i.level === 'warning');
    
    if (critical.length > 0 || warnings.length > 0) {
        let html = '<div class="compatibility-results">';
        
        if (critical.length > 0) {
            html += '<div class="compatibility-section critical">';
            html += '<strong>🚨 Masalah Kritis (' + critical.length + ')</strong>';
            critical.forEach(issue => {
                html += `
                    <div class="issue-item">
                        <div class="issue-header">${issue.category}</div>
                        <div class="issue-message">${issue.message}</div>
                        <div class="issue-solution">💡 Solusi: ${issue.solution}</div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        if (warnings.length > 0) {
            html += '<div class="compatibility-section warning">';
            html += '<strong>⚠️ Peringatan (' + warnings.length + ')</strong>';
            warnings.forEach(issue => {
                html += `
                    <div class="issue-item">
                        <div class="issue-header">${issue.category}</div>
                        <div class="issue-message">${issue.message}</div>
                        <div class="issue-solution">💡 Rekomendasi: ${issue.solution}</div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        html += '</div>';
        if (warningEl) {
            warningEl.innerHTML = html;
            warningEl.classList.add('show');
        }
    } else if (AppState.currentBuild.components.length >= 5) {
        let html = '<div class="compatibility-success">';
        html += '<strong>✅ Semua Sistem Kompatibel</strong>';
        html += '<p>Tidak ada masalah kompatibilitas terdeteksi. Build Anda siap untuk dirakit.</p>';
        html += '</div>';
        if (successEl) {
            successEl.innerHTML = html;
            successEl.classList.add('show');
        }
    }
}

function clearCompatibilityDisplay() {
    const warningEl = document.getElementById('warning');
    const successEl = document.getElementById('success');
    
    if (warningEl) {
        warningEl.innerHTML = '';
        warningEl.classList.remove('show');
    }
    if (successEl) {
        successEl.innerHTML = '';
        successEl.classList.remove('show');
    }
}

// ============================================
// PERFORMANCE ANALYSIS - FIXED
// ============================================
function openAnalysisModal() {
    try {
        const components = gatherComponents();
        
        if (components.length === 0) {
            showNotification('Silakan pilih komponen terlebih dahulu untuk melihat analisis performa', 'warning');
            return;
        }
        
        const hasCPU = components.some(c => c.type === 'cpu-select');
        
        if (!hasCPU) {
            showNotification('CPU diperlukan untuk analisis performa', 'warning');
            return;
        }
        
        calculatePerformanceMetrics(components);
        displayPerformanceAnalysis();
        
        const modal = document.getElementById('analysis-modal');
        if (modal) modal.classList.add('show');
    } catch (error) {
        console.error('Error opening analysis modal:', error);
        showNotification('Terjadi kesalahan saat membuka analisis performa', 'error');
    }
}

function calculatePerformanceMetrics(components) {
    const cpu = components.find(c => c.type === 'cpu-select');
    const gpu = components.find(c => c.type === 'vga-select');
    const ram = components.find(c => c.type === 'ram-select');
    
    let cpuScore = calculateCPUScore(cpu);
    let gpuScore = calculateGPUScore(gpu);
    let ramMultiplier = calculateRAMMultiplier(ram);
    
    AppState.performanceScores = {
        pcmark: Math.round(3000 + (cpuScore * 60) + (gpuScore * 30) * ramMultiplier),
        geekbench: Math.round(5000 + (cpuScore * 80) * ramMultiplier),
        cinebench: Math.round(5000 + (cpuScore * 100) * ramMultiplier),
        timespy: Math.round(2000 + (gpuScore * 100) + (cpuScore * 20)),
        
        gaming1080p: calculateGamingScore(cpu, gpu, ram, '1080p'),
        gaming1440p: calculateGamingScore(cpu, gpu, ram, '1440p'),
        gaming4k: calculateGamingScore(cpu, gpu, ram, '4k'),
        
        gaming: calculateUseCaseScore(components, 'gaming'),
        productivity: calculateUseCaseScore(components, 'productivity'),
        contentCreation: calculateUseCaseScore(components, 'content'),
        
        overallRating: calculateOverallRating(components)
    };
}

function calculateCPUScore(cpu) {
    if (!cpu) return 30;
    
    const cpuScores = {
        'i9-14900k': 180, 'i9-13900k': 170,
        'ryzen9-7950x3d': 175, 'ryzen9-7900x3d': 165,
        'i7-14700k': 150, 'i7-13700k': 145,
        'ryzen7-7800x3d': 155, 'ryzen7-7700x': 145,
        'i5-14600k': 130, 'i5-13600k': 125, 'i5-13400': 110,
        'ryzen5-7600x': 120, 'ryzen5-7600': 115,
        'i3-14100': 80, 'i3-13100': 75
    };
    
    for (let key in cpuScores) {
        if (cpu.value.includes(key)) {
            return cpuScores[key];
        }
    }
    
    return 100;
}

function calculateGPUScore(gpu) {
    if (!gpu) return 20;
    
    const gpuScores = {
        '4090': 280, '7900-xtx': 260, '4080': 240,
        '7900-xt': 220, '4070-ti': 200, '7800-xt': 190,
        '4070': 180, '4060-ti': 140, '7600': 120,
        'gtx-1050': 50, 'rx-580': 55
    };
    
    for (let key in gpuScores) {
        if (gpu.value.includes(key)) {
            return gpuScores[key];
        }
    }
    
    return 100;
}

function calculateRAMMultiplier(ram) {
    if (!ram) return 0.8;
    
    if (ram.value.includes('32gb')) return 1.15;
    if (ram.value.includes('16gb')) return 1.0;
    return 0.85;
}

function calculateGamingScore(cpu, gpu, ram, resolution) {
    if (!cpu || !gpu) return 0;
    
    const cpuScore = calculateCPUScore(cpu);
    const gpuScore = calculateGPUScore(gpu);
    const ramMult = calculateRAMMultiplier(ram);
    
    let score = 0;
    
    if (resolution === '1080p') {
        score = (cpuScore * 0.4 + gpuScore * 0.6) * ramMult * 0.5;
    } else if (resolution === '1440p') {
        score = (cpuScore * 0.3 + gpuScore * 0.7) * ramMult * 0.45;
    } else if (resolution === '4k') {
        score = (cpuScore * 0.2 + gpuScore * 0.8) * ramMult * 0.4;
    }
    
    return Math.min(Math.round(score), 100);
}

function calculateUseCaseScore(components, useCase) {
    const cpu = components.find(c => c.type === 'cpu-select');
    const gpu = components.find(c => c.type === 'vga-select');
    const ram = components.find(c => c.type === 'ram-select');
    
    const cpuScore = calculateCPUScore(cpu);
    const gpuScore = calculateGPUScore(gpu);
    const ramMult = calculateRAMMultiplier(ram);
    
    let score = 0;
    
    switch(useCase) {
        case 'gaming':
            score = (cpuScore * 0.3 + gpuScore * 0.7) * ramMult * 0.45;
            break;
        case 'productivity':
            score = (cpuScore * 0.6 + gpuScore * 0.2) * ramMult * 0.55;
            break;
        case 'content':
            score = (cpuScore * 0.5 + gpuScore * 0.4) * ramMult * 0.5;
            break;
    }
    
    return Math.min(Math.round(score), 100);
}

function calculateOverallRating(components) {
    const gaming = calculateUseCaseScore(components, 'gaming');
    const productivity = calculateUseCaseScore(components, 'productivity');
    const content = calculateUseCaseScore(components, 'content');
    
    const average = (gaming + productivity + content) / 3;
    
    if (average >= 85) return 'Excellent';
    if (average >= 70) return 'Very Good';
    if (average >= 55) return 'Good';
    if (average >= 40) return 'Fair';
    return 'Basic';
}

function displayPerformanceAnalysis() {
    const scores = AppState.performanceScores;
    if (!scores) return;
    
    // Animate benchmark scores
    setTimeout(() => animateScore('pcmark-score', scores.pcmark), 100);
    setTimeout(() => animateScore('geekbench-score', scores.geekbench), 200);
    setTimeout(() => animateScore('cinebench-score', scores.cinebench), 300);
    setTimeout(() => animateScore('3dmark-score', scores.timespy), 400);
    
    const modalBody = document.querySelector('#analysis-modal .modal-body');
    if (!modalBody) return;
    
    // Remove old sections if they exist
    const oldGaming = document.getElementById('gaming-performance');
    const oldUsecase = document.getElementById('usecase-scores');
    const oldRating = document.getElementById('overall-rating');
    const oldYoutube = document.getElementById('youtube-links-section');
    
    if (!oldGaming) {
        // Create gaming section
        const gamingSection = document.createElement('div');
        gamingSection.className = 'performance-section';
        gamingSection.innerHTML = `
            <h4>🎮 Performa Gaming</h4>
            <div id="gaming-performance" class="gaming-performance"></div>
        `;
        modalBody.appendChild(gamingSection);
    }
    
    if (!oldUsecase) {
        // Create usecase section
        const useCaseSection = document.createElement('div');
        useCaseSection.className = 'performance-section';
        useCaseSection.innerHTML = `
            <h4>📊 Performa Berdasarkan Penggunaan</h4>
            <div id="usecase-scores" class="usecase-scores"></div>
        `;
        modalBody.appendChild(useCaseSection);
    }
    
    if (!oldRating) {
        // Create rating section
        const ratingSection = document.createElement('div');
        ratingSection.className = 'performance-section';
        ratingSection.innerHTML = `
            <h4>⭐ Rating Sistem Keseluruhan</h4>
            <div id="overall-rating" class="overall-rating"></div>
        `;
        modalBody.appendChild(ratingSection);
    }
    
    if (!oldYoutube) {
        // Create YouTube links section
        const youtubeSection = document.createElement('div');
        youtubeSection.className = 'performance-section';
        youtubeSection.innerHTML = `
            <h4>📺 Referensi Video Benchmark</h4>
            <div id="youtube-links-section" class="youtube-links-section"></div>
        `;
        modalBody.appendChild(youtubeSection);
    }
    
    // Update content
    updateGamingPerformance(scores);
    updateUseCaseScores(scores);
    updateOverallRating(scores);
    updateYoutubeLinks();
}

// New function to update YouTube links
function updateYoutubeLinks() {
    const container = document.getElementById('youtube-links-section');
    if (!container) return;
    
    const components = gatherComponents();
    const cpu = components.find(c => c.type === 'cpu-select');
    const gpu = components.find(c => c.type === 'vga-select');
    const ram = components.find(c => c.type === 'ram-select');
    
    const links = generateYoutubeLinks(cpu, gpu, ram);
    
    let html = '<div class="youtube-links-grid">';
    
    // Gaming Benchmark Link
    if (links.gaming) {
        html += `
            <a href="${links.gaming}" target="_blank" class="youtube-link gaming-link">
                <div class="youtube-link-icon">🎮</div>
                <div class="youtube-link-content">
                    <h5>Gaming Benchmark</h5>
                    <p>Lihat performa gaming dengan FPS counter</p>
                </div>
                <div class="youtube-link-arrow">→</div>
            </a>
        `;
    }
    
    // Benchmark Scores Link
    if (links.benchmark) {
        html += `
            <a href="${links.benchmark}" target="_blank" class="youtube-link benchmark-link">
                <div class="youtube-link-icon">📊</div>
                <div class="youtube-link-content">
                    <h5>Benchmark Scores</h5>
                    <p>3DMark, Cinebench, dan benchmark lainnya</p>
                </div>
                <div class="youtube-link-arrow">→</div>
            </a>
        `;
    }
    
    // FPS Test Link
    if (links.fps) {
        html += `
            <a href="${links.fps}" target="_blank" class="youtube-link fps-link">
                <div class="youtube-link-icon">🎯</div>
                <div class="youtube-link-content">
                    <h5>FPS Test (1080p/1440p/4K)</h5>
                    <p>Test performa di berbagai resolusi</p>
                </div>
                <div class="youtube-link-arrow">→</div>
            </a>
        `;
    }
    
    // Review Link
    if (links.review) {
        html += `
            <a href="${links.review}" target="_blank" class="youtube-link review-link">
                <div class="youtube-link-icon">⭐</div>
                <div class="youtube-link-content">
                    <h5>Review & Analisis</h5>
                    <p>Review lengkap dan analisis performa</p>
                </div>
                <div class="youtube-link-arrow">→</div>
            </a>
        `;
    }
    
    // Comparison Link (only if both CPU and GPU)
    if (links.comparison && cpu && gpu) {
        html += `
            <a href="${links.comparison}" target="_blank" class="youtube-link comparison-link">
                <div class="youtube-link-icon">🔄</div>
                <div class="youtube-link-content">
                    <h5>Perbandingan Build</h5>
                    <p>Bandingkan dengan build serupa</p>
                </div>
                <div class="youtube-link-arrow">→</div>
            </a>
        `;
    }
    
    html += '</div>';
    
    // Add component info
    if (cpu || gpu) {
        html += '<div class="youtube-component-info">';
        html += '<p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 1rem; text-align: center;">';
        html += '🔍 Pencarian untuk: ';
        if (cpu) html += `<strong>${extractComponentName(cpu.name)}</strong>`;
        if (cpu && gpu) html += ' + ';
        if (gpu) html += `<strong>${extractComponentName(gpu.name)}</strong>`;
        html += '</p>';
        html += '</div>';
    }
    
    // Add helpful note
    html += `
        <div class="youtube-note">
            <p><strong>💡 Tips:</strong> Cari video dengan tanggal upload terbaru untuk hasil yang lebih akurat. 
            Video dengan "FPS test" atau "benchmark" di judul biasanya menampilkan hasil yang detail.</p>
        </div>
    `;
    
    container.innerHTML = html;
}

function updateGamingPerformance(scores) {
    const container = document.getElementById('gaming-performance');
    if (!container) return;
    
    const html = `
        <div class="gaming-resolution">
            <span class="resolution-label">1080p Ultra</span>
            <div class="score-bar">
                <div class="score-fill" style="width: ${scores.gaming1080p}%"></div>
            </div>
            <span class="score-value">${scores.gaming1080p}/100</span>
        </div>
        <div class="gaming-resolution">
            <span class="resolution-label">1440p Ultra</span>
            <div class="score-bar">
                <div class="score-fill" style="width: ${scores.gaming1440p}%"></div>
            </div>
            <span class="score-value">${scores.gaming1440p}/100</span>
        </div>
        <div class="gaming-resolution">
            <span class="resolution-label">4K Ultra</span>
            <div class="score-bar">
                <div class="score-fill" style="width: ${scores.gaming4k}%"></div>
            </div>
            <span class="score-value">${scores.gaming4k}/100</span>
        </div>
    `;
    
    container.innerHTML = html;
}

function updateUseCaseScores(scores) {
    const container = document.getElementById('usecase-scores');
    if (!container) return;
    
    const html = `
        <div class="usecase-item">
            <span class="usecase-label">🎮 Gaming</span>
            <div class="usecase-meter">
                <div class="usecase-fill" style="width: ${scores.gaming}%"></div>
            </div>
            <span class="usecase-score">${scores.gaming}%</span>
        </div>
        <div class="usecase-item">
            <span class="usecase-label">💼 Produktivitas</span>
            <div class="usecase-meter">
                <div class="usecase-fill" style="width: ${scores.productivity}%"></div>
            </div>
            <span class="usecase-score">${scores.productivity}%</span>
        </div>
        <div class="usecase-item">
            <span class="usecase-label">🎬 Content Creation</span>
            <div class="usecase-meter">
                <div class="usecase-fill" style="width: ${scores.contentCreation}%"></div>
            </div>
            <span class="usecase-score">${scores.contentCreation}%</span>
        </div>
    `;
    
    container.innerHTML = html;
}

function updateOverallRating(scores) {
    const container = document.getElementById('overall-rating');
    if (!container) return;
    
    const ratingColors = {
        'Excellent': '#10B981',
        'Very Good': '#3B82F6',
        'Good': '#F59E0B',
        'Fair': '#F97316',
        'Basic': '#6B7280'
    };
    
    const color = ratingColors[scores.overallRating] || '#6B7280';
    
    container.innerHTML = `
        <div class="rating-badge" style="background: ${color}">
            ${scores.overallRating}
        </div>
        <p style="text-align: center; margin-top: 1rem; color: var(--text-gray);">
            ${getRatingDescription(scores.overallRating)}
        </p>
    `;
}

function getRatingDescription(rating) {
    const descriptions = {
        'Excellent': 'Build premium dengan performa luar biasa untuk semua kebutuhan',
        'Very Good': 'Build yang sangat baik dengan performa tinggi',
        'Good': 'Build yang solid untuk gaming dan produktivitas',
        'Fair': 'Build entry-level yang cukup untuk kebutuhan dasar',
        'Basic': 'Build minimal untuk penggunaan ringan'
    };
    return descriptions[rating] || '';
}

function generateYoutubeLink(cpu, gpu) {
    let searchQuery = '';
    
    if (cpu && gpu) {
        // Both CPU and GPU selected - prioritize GPU benchmarks
        const cpuName = extractComponentName(cpu.name);
        const gpuName = extractComponentName(gpu.name);
        searchQuery = `${cpuName} ${gpuName} benchmark gaming test`;
    } else if (gpu) {
        // Only GPU
        const gpuName = extractComponentName(gpu.name);
        searchQuery = `${gpuName} benchmark test gameplay`;
    } else if (cpu) {
        // Only CPU
        const cpuName = extractComponentName(cpu.name);
        searchQuery = `${cpuName} benchmark test performance`;
    } else {
        // No components
        searchQuery = 'PC benchmark test';
    }
    
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
}

// Helper function to extract clean component name
function extractComponentName(fullName) {
    // Remove price from name (e.g., "Intel Core i5-14600K - Rp 4.800.000")
    let name = fullName.split('-')[0].trim();
    
    // Clean up common patterns
    name = name.replace(/\s+/g, ' ').trim();
    
    return name;
}

// Generate multiple YouTube links for different scenarios
function generateYoutubeLinks(cpu, gpu, ram) {
    const links = {
        gaming: null,
        benchmark: null,
        review: null,
        fps: null,
        comparison: null
    };
    
    const cpuName = cpu ? extractComponentName(cpu.name) : null;
    const gpuName = gpu ? extractComponentName(gpu.name) : null;
    const ramSize = ram ? (ram.value.includes('32gb') ? '32GB' : '16GB') : null;
    
    if (cpuName && gpuName) {
        // Gaming benchmarks with FPS counter
        links.gaming = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${cpuName} ${gpuName} gaming benchmark FPS test 2024`)}`;
        
        // Pure benchmark scores
        links.benchmark = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${cpuName} ${gpuName} benchmark Cinebench 3DMark`)}`;
        
        // Component review
        links.review = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${cpuName} ${gpuName} review performance analysis`)}`;
        
        // FPS in popular games
        links.fps = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${cpuName} ${gpuName} FPS test 1080p 1440p 4K`)}`;
        
        // Comparison with similar builds
        links.comparison = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${cpuName} vs ${gpuName} gaming comparison`)}`;
    } else if (gpuName) {
        links.gaming = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${gpuName} gaming benchmark test`)}`;
        links.benchmark = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${gpuName} benchmark 3DMark TimeSpy`)}`;
        links.review = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${gpuName} review`)}`;
        links.fps = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${gpuName} FPS test`)}`;
    } else if (cpuName) {
        links.gaming = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${cpuName} gaming test`)}`;
        links.benchmark = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${cpuName} Cinebench benchmark`)}`;
        links.review = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${cpuName} review`)}`;
    }
    
    return links;
}

function closeAnalysisModal() {
    const modal = document.getElementById('analysis-modal');
    if (modal) modal.classList.remove('show');
}

// ============================================
// PRESET BUILDS - ENHANCED WITH CROSS-PAGE SUPPORT
// ============================================
function loadPreset(presetType) {
    try {
        const presets = {
            office: {
                'cpu-select': 'intel-i3-14100',
                'mb-select': 'gigabyte-b760m-ds3h',
                'ram-select': 'gskill-ripjaws-v-16gb',
                'storage-select': 'wd-blue-sn570-1tb',
                'psu-select': 'cooler-master-mwe-bronze-v2-650w',
                'case-select': 'basic',
                'cooling-select': 'cooler-master-hyper-212-halo',
                'os-select': 'windows-11-home'
            },
            school: {
                'cpu-select': 'intel-i3-14100f',
                'mb-select': 'gigabyte-b760m-ds3h',
                'ram-select': 'gskill-ripjaws-v-16gb',
                'storage-select': 'wd-blue-sn570-1tb',
                'psu-select': 'fsp-hyper-k-600w',
                'case-select': 'basic',
                'cooling-select': 'cooler-master-hyper-212-halo',
                'os-select': 'windows-11-home'
            },
            budget: {
                'cpu-select': 'amd-ryzen5-7600',
                'mb-select': 'gigabyte-b650-gaming-x-ax',
                'ram-select': 'kingston-fury-beast-ddr5-16gb',
                'vga-select': 'amd-rx-7600',
                'storage-select': 'wd-blue-sn570-1tb',
                'psu-select': 'deepcool-pk-d-650w',
                'case-select': 'nzxt-h510',
                'cooling-select': 'deepcool-ak620',
                'os-select': 'windows-11-home'
            },
            gaming: {
                'cpu-select': 'intel-i5-14600k',
                'mb-select': 'asus-tuf-b760-plus-wifi',
                'ram-select': 'corsair-vengeance-rgb-ddr5-32gb',
                'vga-select': 'nvidia-rtx-4070-super',
                'storage-select': 'samsung-990-pro-1tb',
                'psu-select': 'corsair-rm750e-750w',
                'case-select': 'corsair-4000d',
                'cooling-select': 'arctic-liquid-freezer-ii-360',
                'os-select': 'windows-11-home'
            },
            editing: {
                'cpu-select': 'amd-ryzen9-7900x',
                'mb-select': 'msi-mag-b650-tomahawk-wifi',
                'ram-select': 'corsair-vengeance-rgb-ddr5-32gb',
                'vga-select': 'nvidia-rtx-4080-super',
                'storage-select': 'samsung-990-pro-1tb',
                'psu-select': 'corsair-rm1000x-shift-1000w',
                'case-select': 'lian-li-lancool-ii-mesh',
                'cooling-select': 'nzxt-kraken-360',
                'os-select': 'windows-11-pro'
            },
            server: {
                'cpu-select': 'amd-ryzen9-7900',
                'mb-select': 'asus-rog-strix-b650-a-gaming-wifi',
                'ram-select': 'corsair-vengeance-rgb-ddr5-32gb',
                'storage-select': 'samsung-990-pro-1tb',
                'psu-select': 'seasonic-focus-gm-750w',
                'case-select': 'fractal-meshify-c',
                'cooling-select': 'noctua-nh-d15',
                'os-select': 'windows-11-pro'
            }
        };
        
        const preset = presets[presetType];
        
        if (!preset) {
            showNotification('Preset tidak ditemukan', 'error');
            return;
        }
        
        const presetNames = {
            office: 'Produktivitas Kantor',
            school: 'PC Sekolah / Belajar',
            budget: 'Entry Level Gaming',
            gaming: 'Gaming Performa Tinggi',
            editing: 'Content Creation',
            server: 'Server / Workstation'
        };
        
        // Check if we're on the build page or recommendation page
        const buildSection = document.getElementById('build');
        const hasComponentSelects = document.querySelectorAll('.component-select').length > 0;
        
        if (buildSection && hasComponentSelects) {
            // We're already on the build page - load directly
            loadPresetComponents(preset);
            showNotification(`✓ Preset dimuat: ${presetNames[presetType]}`, 'success');
        } else {
            // We're on recommendation page - save to sessionStorage and redirect
            sessionStorage.setItem('pendingPreset', JSON.stringify({
                type: presetType,
                preset: preset,
                name: presetNames[presetType]
            }));
            
            showNotification(`Memuat preset: ${presetNames[presetType]}...`, 'info');
            
            // Redirect to rakitpc.html
            setTimeout(() => {
                window.location.href = 'rakitpc.html';
            }, 500);
        }
    } catch (error) {
        console.error('Error loading preset:', error);
        showNotification('Terjadi kesalahan saat memuat preset', 'error');
    }
}

// Helper function to load preset components
function loadPresetComponents(preset) {
    try {
        // Reset all components first
        document.querySelectorAll('.component-select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        // Load preset components
        for (let selectId in preset) {
            const select = document.getElementById(selectId);
            if (select) {
                select.value = preset[selectId];
            } else {
                console.warn(`Component select not found: ${selectId}`);
            }
        }
        
        // Update totals and check compatibility
        if (typeof updateTotal === 'function') {
            updateTotal();
        }
        if (typeof runCompatibilityCheck === 'function') {
            runCompatibilityCheck();
        }
        
        // Scroll to top of build section
        const buildSection = document.getElementById('build');
        if (buildSection) {
            buildSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } catch (error) {
        console.error('Error loading preset components:', error);
        throw error;
    }
}

// Function to check and load pending preset on page load
function checkPendingPreset() {
    try {
        const pendingPreset = sessionStorage.getItem('pendingPreset');
        
        if (pendingPreset) {
            const data = JSON.parse(pendingPreset);
            
            // Clear the pending preset
            sessionStorage.removeItem('pendingPreset');
            
            // Wait for DOM to be fully ready
            setTimeout(() => {
                const hasComponentSelects = document.querySelectorAll('.component-select').length > 0;
                
                if (hasComponentSelects) {
                    loadPresetComponents(data.preset);
                    showNotification(`✓ Preset dimuat: ${data.name}`, 'success');
                    console.log(`Loaded pending preset: ${data.type}`);
                } else {
                    console.error('Component selects not found on page');
                    showNotification('Halaman belum siap. Silakan muat ulang preset.', 'warning');
                }
            }, 500);
        }
    } catch (error) {
        console.error('Error checking pending preset:', error);
        sessionStorage.removeItem('pendingPreset');
    }
}

// ============================================
// SAVE & LOAD CONFIGURATION - ENHANCED
// ============================================
function saveBuild() {
    try {
        const components = gatherComponents();
        
        if (components.length === 0) {
            showNotification('Tidak ada komponen yang dipilih. Silakan konfigurasi build Anda terlebih dahulu', 'error');
            return;
        }
        
        const requiredComponents = ['cpu-select', 'mb-select', 'ram-select', 'storage-select', 'psu-select'];
        const selectedTypes = components.map(c => c.type);
        const missingRequired = requiredComponents.filter(req => !selectedTypes.includes(req));
        
        if (missingRequired.length > 0) {
            showNotification('Komponen penting masih kurang. Silakan lengkapi konfigurasi build Anda', 'warning');
            return;
        }
        
        const buildName = prompt('Masukkan nama untuk build ini:', `Build ${new Date().toLocaleDateString('id-ID')}`);
        
        if (!buildName) {
            showNotification('Penyimpanan build dibatalkan', 'info');
            return;
        }
        
        const buildData = {
            id: generateBuildId(),
            name: buildName,
            timestamp: new Date().toISOString(),
            components: components,
            totalPrice: AppState.currentBuild.totalPrice,
            compatibilityIssues: AppState.compatibilityIssues.length,
            performanceScores: AppState.performanceScores
        };
        
        let savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        savedBuilds.unshift(buildData);
        
        // Limit to 20 builds
        if (savedBuilds.length > 20) {
            savedBuilds = savedBuilds.slice(0, 20);
        }
        
        localStorage.setItem('savedBuilds', JSON.stringify(savedBuilds));
        
        updateBuildList();
        showNotification(`✓ Build "${buildName}" berhasil disimpan`, 'success');
    } catch (error) {
        console.error('Error saving build:', error);
        showNotification('Terjadi kesalahan saat menyimpan build', 'error');
    }
}

function loadBuild(buildId) {
    try {
        const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        const build = savedBuilds.find(b => b.id === buildId);
        
        if (!build) {
            showNotification('Build tidak ditemukan', 'error');
            return;
        }
        
        // Reset all components
        document.querySelectorAll('.component-select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        // Load components
        build.components.forEach(comp => {
            const select = document.getElementById(comp.type);
            if (select) {
                select.value = comp.value;
            }
        });
        
        updateTotal();
        runCompatibilityCheck();
        
        showNotification(`✓ Build "${build.name}" berhasil dimuat`, 'success');
        
        const buildSection = document.getElementById('build');
        if (buildSection) showSection('build');
    } catch (error) {
        console.error('Error loading build:', error);
        showNotification('Terjadi kesalahan saat memuat build', 'error');
    }
}

function deleteBuild(buildId) {
    try {
        if (!confirm('Apakah Anda yakin ingin menghapus build ini?')) {
            return;
        }
        
        let savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        savedBuilds = savedBuilds.filter(b => b.id !== buildId);
        
        localStorage.setItem('savedBuilds', JSON.stringify(savedBuilds));
        
        updateBuildList();
        showNotification('✓ Build berhasil dihapus', 'info');
    } catch (error) {
        console.error('Error deleting build:', error);
        showNotification('Terjadi kesalahan saat menghapus build', 'error');
    }
}

function loadSavedBuilds() {
    try {
        const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        console.log(`Memuat ${savedBuilds.length} build yang tersimpan`);
    } catch (error) {
        console.error('Error loading saved builds:', error);
    }
}

function updateBuildList() {
    const container = document.getElementById('saved-builds-list');
    if (!container) return;
    
    try {
        const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        
        if (savedBuilds.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>📦 Belum ada build tersimpan</p>
                    <p class="empty-subtitle">Mulai merakit dan simpan konfigurasi Anda</p>
                </div>
            `;
            return;
        }
        
        let html = '<div class="builds-grid">';
        
        savedBuilds.forEach(build => {
            const date = new Date(build.timestamp).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const statusIcon = build.compatibilityIssues === 0 ? '✅' : '⚠️';
            
            html += `
                <div class="build-card">
                    <div class="build-card-header">
                        <h4>${build.name}</h4>
                        <span class="build-date">${date}</span>
                    </div>
                    <div class="build-card-body">
                        <div class="build-price">${formatCurrency(build.totalPrice)}</div>
                        <div class="build-components">
                            ${statusIcon} ${build.components.length} komponen
                            ${build.compatibilityIssues > 0 ? ` • ${build.compatibilityIssues} masalah` : ''}
                        </div>
                    </div>
                    <div class="build-card-actions">
                        <button class="btn-load" onclick="loadBuild('${build.id}')">Muat</button>
                        <button class="btn-export" onclick="exportBuild('${build.id}')">Export</button>
                        <button class="btn-delete" onclick="deleteBuild('${build.id}')">Hapus</button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error updating build list:', error);
        container.innerHTML = '<p style="color: var(--danger);">Error memuat build tersimpan</p>';
    }
}

function exportBuild(buildId) {
    try {
        const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        const build = savedBuilds.find(b => b.id === buildId);
        
        if (!build) {
            showNotification('Build tidak ditemukan', 'error');
            return;
        }
        
        let exportText = `${'='.repeat(60)}\n`;
        exportText += `KONFIGURASI BUILD PC\n`;
        exportText += `${'='.repeat(60)}\n\n`;
        exportText += `Nama Build: ${build.name}\n`;
        exportText += `Tanggal: ${new Date(build.timestamp).toLocaleString('id-ID')}\n`;
        exportText += `Total Harga: ${formatCurrency(build.totalPrice)}\n`;
        exportText += `Kompatibilitas: ${build.compatibilityIssues === 0 ? 'Semua Kompatibel' : `${build.compatibilityIssues} Masalah`}\n\n`;
        exportText += `${'-'.repeat(60)}\n`;
        exportText += `KOMPONEN:\n`;
        exportText += `${'-'.repeat(60)}\n\n`;
        
        build.components.forEach(comp => {
            const typeName = comp.type.replace('-select', '').toUpperCase().padEnd(15);
            exportText += `${typeName}: ${comp.name}\n`;
            exportText += `${' '.repeat(15)}  Harga: ${formatCurrency(comp.price)}\n\n`;
        });
        
        if (build.performanceScores) {
            exportText += `${'-'.repeat(60)}\n`;
            exportText += `SKOR PERFORMA:\n`;
            exportText += `${'-'.repeat(60)}\n\n`;
            exportText += `PCMark 10       : ${build.performanceScores.pcmark}\n`;
            exportText += `Geekbench       : ${build.performanceScores.geekbench}\n`;
            exportText += `Cinebench R23   : ${build.performanceScores.cinebench}\n`;
            exportText += `3DMark Time Spy: ${build.performanceScores.timespy}\n\n`;
            exportText += `Gaming 1080p    : ${build.performanceScores.gaming1080p}/100\n`;
            exportText += `Gaming 1440p    : ${build.performanceScores.gaming1440p}/100\n`;
            exportText += `Gaming 4K       : ${build.performanceScores.gaming4k}/100\n\n`;
            exportText += `Rating Keseluruhan: ${build.performanceScores.overallRating}\n`;
        }
        
        exportText += `\n${'='.repeat(60)}\n`;
        exportText += `Dihasilkan oleh NgoPi - High-end Builder\n`;
        exportText += `NgoPi.com\n`;
        exportText += `${'='.repeat(60)}\n`;
        
        const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${build.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('✓ Build berhasil di-export', 'success');
    } catch (error) {
        console.error('Error exporting build:', error);
        showNotification('Terjadi kesalahan saat export build', 'error');
    }
}

// ============================================
// CONTACT FORM - ENHANCED
// ============================================
function initializeContactForm() {
    const form = document.getElementById('suggestion-form');
    if (!form) return;
    
    // Remove existing listener
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                category: document.getElementById('category').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };
            
            let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
            submissions.unshift(formData);
            
            // Limit to 50 submissions
            if (submissions.length > 50) {
                submissions = submissions.slice(0, 50);
            }
            
            localStorage.setItem('formSubmissions', JSON.stringify(submissions));
            
            const successEl = document.getElementById('form-success');
            const errorEl = document.getElementById('form-error');
            if (successEl) successEl.style.display = 'flex';
            if (errorEl) errorEl.style.display = 'none';
            
            newForm.reset();
            
            setTimeout(() => {
                if (successEl) successEl.style.display = 'none';
            }, 5000);
            
            showNotification('✓ Pesan Anda telah berhasil dikirim. Terima kasih!', 'success');
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorEl = document.getElementById('form-error');
            if (errorEl) errorEl.style.display = 'flex';
            showNotification('Terjadi kesalahan saat mengirim pesan', 'error');
        }
    });
}

// ============================================
// UTILITY ACTIONS - ENHANCED
// ============================================
function resetBuild() {
    if (!confirm('Apakah Anda yakin ingin mereset semua komponen?')) {
        return;
    }
    
    try {
        document.querySelectorAll('.component-select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        updateTotal();
        clearCompatibilityDisplay();
        
        showNotification('✓ Build berhasil direset', 'info');
    } catch (error) {
        console.error('Error resetting build:', error);
        showNotification('Terjadi kesalahan saat reset build', 'error');
    }
}

function printBuildSummary() {
    try {
        const components = gatherComponents();
        
        if (components.length === 0) {
            showNotification('Tidak ada komponen untuk dicetak', 'error');
            return;
        }
        
        const printWindow = window.open('', '', 'width=800,height=600');
        
        let printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Ringkasan Build PC - ${new Date().toLocaleDateString('id-ID')}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 40px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    h1 {
                        color: #001529;
                        border-bottom: 3px solid #3B82F6;
                        padding-bottom: 10px;
                    }
                    .header-info {
                        background: #F0F9FF;
                        padding: 15px;
                        border-radius: 8px;
                        margin: 20px 0;
                    }
                    .component {
                        padding: 15px;
                        border-bottom: 1px solid #E5E7EB;
                    }
                    .component-type {
                        font-weight: bold;
                        color: #002B5C;
                        display: inline-block;
                        width: 150px;
                    }
                    .component-name {
                        color: #001529;
                    }
                    .component-price {
                        color: #3B82F6;
                        float: right;
                        font-weight: bold;
                    }
                    .total {
                        background: #001529;
                        color: white;
                        padding: 20px;
                        margin-top: 20px;
                        border-radius: 8px;
                        font-size: 24px;
                        font-weight: bold;
                        text-align: center;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #6B7280;
                        font-size: 12px;
                    }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>🖥️ Konfigurasi Build PC</h1>
                <div class="header-info">
                    <p><strong>Tanggal:</strong> ${new Date().toLocaleString('id-ID')}</p>
                    <p><strong>Komponen:</strong> ${components.length}</p>
                </div>
                
                <h2>Komponen:</h2>
        `;
        
        components.forEach(comp => {
            const typeName = comp.type.replace('-select', '').toUpperCase();
            printContent += `
                <div class="component">
                    <span class="component-type">${typeName}:</span>
                    <span class="component-name">${comp.name}</span>
                    <span class="component-price">${formatCurrency(comp.price)}</span>
                </div>
            `;
        });
        
        printContent += `
                <div class="total">
                    Total: ${formatCurrency(AppState.currentBuild.totalPrice)}
                </div>
                
                <div class="footer">
                    <p>Dihasilkan oleh NgoPi - High-end Builder</p>
                    <p>ngopi.com</p>
                </div>
                
                <div class="no-print" style="margin-top: 30px; text-align: center;">
                    <button onclick="window.print()" style="padding: 10px 30px; background: #001529; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">🖨️ Print</button>
                    <button onclick="window.close()" style="padding: 10px 30px; background: #6B7280; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">❌ Tutup</button>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        showNotification('✓ Preview cetak dibuka', 'info');
    } catch (error) {
        console.error('Error printing build summary:', error);
        showNotification('Terjadi kesalahan saat membuat preview cetak', 'error');
    }
}

// ============================================
// COMPARE BUILDS - NEW FEATURE
// ============================================
function compareBuilds() {
    try {
        const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        
        if (savedBuilds.length < 2) {
            showNotification('Minimal 2 build diperlukan untuk perbandingan', 'warning');
            return;
        }
        
        // Create comparison modal
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-container" style="max-width: 1200px;">
                <div class="modal-header">
                    <h2>🔄 Bandingkan Build</h2>
                    <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Fitur perbandingan build akan segera tersedia</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error comparing builds:', error);
        showNotification('Terjadi kesalahan saat membandingkan build', 'error');
    }
}

// ============================================
// SEARCH FUNCTIONALITY - NEW FEATURE
// ============================================
function initializeSearch() {
    const searchBtn = document.querySelector('.search-btn');
    if (!searchBtn) return;
    
    searchBtn.addEventListener('click', function() {
        const searchTerm = prompt('Cari komponen:');
        if (searchTerm && searchTerm.trim() !== '') {
            searchComponents(searchTerm.trim());
        }
    });
}

function searchComponents(term) {
    const lowerTerm = term.toLowerCase();
    let found = false;
    
    document.querySelectorAll('.component-select').forEach(select => {
        Array.from(select.options).forEach(option => {
            if (option.text.toLowerCase().includes(lowerTerm)) {
                select.value = option.value;
                select.scrollIntoView({ behavior: 'smooth', block: 'center' });
                found = true;
            }
        });
    });
    
    if (found) {
        updateTotal();
        runCompatibilityCheck();
        showNotification(`✓ Komponen ditemukan: "${term}"`, 'success');
    } else {
        showNotification(`Komponen "${term}" tidak ditemukan`, 'warning');
    }
}

// ============================================
// AUTO-SAVE FEATURE - NEW
// ============================================
let autoSaveTimer = null;

function enableAutoSave() {
    document.querySelectorAll('.component-select').forEach(select => {
        select.addEventListener('change', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                autoSaveBuild();
            }, 30000); // Auto-save after 30 seconds of inactivity
        });
    });
}

function autoSaveBuild() {
    const components = gatherComponents();
    if (components.length === 0) return;
    
    const autoSaveData = {
        components: components,
        totalPrice: AppState.currentBuild.totalPrice,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('autoSaveBuild', JSON.stringify(autoSaveData));
    console.log('Build auto-saved');
}

function loadAutoSavedBuild() {
    try {
        const autoSaved = localStorage.getItem('autoSaveBuild');
        if (!autoSaved) return;
        
        const data = JSON.parse(autoSaved);
        const diffMinutes = (Date.now() - data.timestamp) / 60000;
        
        // Hanya load jika penyimpanan kurang dari 1 jam
        if (diffMinutes > 60) return;

        // Cek apakah popup sudah pernah muncul di sesi ini
        const alreadyAsked = sessionStorage.getItem('buildConfirmShown');
        if (alreadyAsked) return;

        // Tandai agar popup tidak muncul lagi dalam sesi ini
        sessionStorage.setItem('buildConfirmShown', 'true');

        // Tampilkan confirm
        if (confirm('Build yang belum selesai terdeteksi. Muat build tersebut?')) {
            data.components.forEach(comp => {
                const select = document.getElementById(comp.type);
                if (select) {
                    select.value = comp.value;
                }
            });

            updateTotal();
            runCompatibilityCheck();
            showNotification('✓ Build yang tersimpan otomatis telah dimuat', 'success');
        }
        
    } catch (error) {
        console.error('Error loading auto-saved build:', error);
    }
}


// ============================================
// KEYBOARD SHORTCUTS - NEW FEATURE
// ============================================
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveBuild();
        }
        
        // Ctrl+R to reset
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            resetBuild();
        }
        
        // Ctrl+P to print
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            printBuildSummary();
        }
        
        // Ctrl+A to open analysis
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            openAnalysisModal();
        }
    });
}

// ============================================
// PRICE ALERT FEATURE - NEW
// ============================================
function setPriceAlert(maxPrice) {
    localStorage.setItem('priceAlert', maxPrice);
    showNotification(`✓ Alert harga diatur pada ${formatCurrency(maxPrice)}`, 'success');
}

function checkPriceAlert() {
    const alert = localStorage.getItem('priceAlert');
    if (!alert) return;
    
    const maxPrice = parseInt(alert);
    const currentPrice = AppState.currentBuild.totalPrice;
    
    if (currentPrice > maxPrice) {
        showNotification(`⚠️ Build melebihi alert harga: ${formatCurrency(currentPrice)}`, 'warning');
    }
}

// ============================================
// EXPORT TO JSON - NEW FEATURE
// ============================================
function exportBuildToJSON(buildId) {
    try {
        const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        const build = savedBuilds.find(b => b.id === buildId);
        
        if (!build) {
            showNotification('Build tidak ditemukan', 'error');
            return;
        }
        
        const jsonData = JSON.stringify(build, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${build.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('✓ Build berhasil di-export ke JSON', 'success');
    } catch (error) {
        console.error('Error exporting to JSON:', error);
        showNotification('Terjadi kesalahan saat export ke JSON', 'error');
    }
}

// ============================================
// IMPORT FROM JSON - NEW FEATURE
// ============================================
function importBuildFromJSON() {
    try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const buildData = JSON.parse(event.target.result);
                    
                    // Validate data
                    if (!buildData.components || !Array.isArray(buildData.components)) {
                        showNotification('Format file tidak valid', 'error');
                        return;
                    }
                    
                    // Load components
                    buildData.components.forEach(comp => {
                        const select = document.getElementById(comp.type);
                        if (select) {
                            select.value = comp.value;
                        }
                    });
                    
                    updateTotal();
                    runCompatibilityCheck();
                    showNotification('✓ Build berhasil di-import', 'success');
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    showNotification('File JSON tidak valid', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    } catch (error) {
        console.error('Error importing JSON:', error);
        showNotification('Terjadi kesalahan saat import', 'error');
    }
}

// ============================================
// SHARE BUILD FEATURE - NEW
// ============================================
function shareBuild(buildId) {
    try {
        const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        const build = savedBuilds.find(b => b.id === buildId);
        
        if (!build) {
            showNotification('Build tidak ditemukan', 'error');
            return;
        }
        
        const shareText = `Build PC: ${build.name}\nTotal: ${formatCurrency(build.totalPrice)}\n${build.components.length} komponen`;
        
        if (navigator.share) {
            navigator.share({
                title: build.name,
                text: shareText,
                url: window.location.href
            }).then(() => {
                showNotification('✓ Build berhasil dibagikan', 'success');
            }).catch((error) => {
                console.error('Error sharing:', error);
                copyToClipboard(shareText);
            });
        } else {
            copyToClipboard(shareText);
        }
    } catch (error) {
        console.error('Error sharing build:', error);
        showNotification('Terjadi kesalahan saat membagikan build', 'error');
    }
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showNotification('✓ Disalin ke clipboard', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showNotification('Gagal menyalin ke clipboard', 'error');
    }
    
    document.body.removeChild(textarea);
}

// ============================================
// DUPLICATE BUILD - NEW FEATURE
// ============================================
function duplicateBuild(buildId) {
    try {
        const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        const build = savedBuilds.find(b => b.id === buildId);
        
        if (!build) {
            showNotification('Build tidak ditemukan', 'error');
            return;
        }
        
        const duplicatedBuild = {
            ...build,
            id: generateBuildId(),
            name: `${build.name} (Copy)`,
            timestamp: new Date().toISOString()
        };
        
        savedBuilds.unshift(duplicatedBuild);
        localStorage.setItem('savedBuilds', JSON.stringify(savedBuilds));
        
        updateBuildList();
        showNotification('✓ Build berhasil diduplikasi', 'success');
    } catch (error) {
        console.error('Error duplicating build:', error);
        showNotification('Terjadi kesalahan saat menduplikasi build', 'error');
    }
}

// ============================================
// STATISTICS - NEW FEATURE
// ============================================
function showStatistics() {
    try {
        const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
        
        if (savedBuilds.length === 0) {
            showNotification('Belum ada data untuk statistik', 'info');
            return;
        }
        
        const totalBuilds = savedBuilds.length;
        const avgPrice = savedBuilds.reduce((sum, b) => sum + b.totalPrice, 0) / totalBuilds;
        const maxPrice = Math.max(...savedBuilds.map(b => b.totalPrice));
        const minPrice = Math.min(...savedBuilds.map(b => b.totalPrice));
        
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h2>📊 Statistik Build</h2>
                    <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-top: 1rem;">
                        <div class="stat-card" style="background: rgba(59, 130, 246, 0.1); padding: 1.5rem; border-radius: 10px; border: 1px solid rgba(59, 130, 246, 0.3);">
                            <h4 style="color: #60A5FA; margin-bottom: 0.5rem;">Total Build</h4>
                            <p style="font-size: 2rem; font-weight: 700; color: white;">${totalBuilds}</p>
                        </div>
                        <div class="stat-card" style="background: rgba(16, 185, 129, 0.1); padding: 1.5rem; border-radius: 10px; border: 1px solid rgba(16, 185, 129, 0.3);">
                            <h4 style="color: #6EE7B7; margin-bottom: 0.5rem;">Rata-rata Harga</h4>
                            <p style="font-size: 1.5rem; font-weight: 700; color: white;">${formatCurrency(Math.round(avgPrice))}</p>
                        </div>
                        <div class="stat-card" style="background: rgba(245, 158, 11, 0.1); padding: 1.5rem; border-radius: 10px; border: 1px solid rgba(245, 158, 11, 0.3);">
                            <h4 style="color: #FCD34D; margin-bottom: 0.5rem;">Harga Tertinggi</h4>
                            <p style="font-size: 1.5rem; font-weight: 700; color: white;">${formatCurrency(maxPrice)}</p>
                        </div>
                        <div class="stat-card" style="background: rgba(139, 92, 246, 0.1); padding: 1.5rem; border-radius: 10px; border: 1px solid rgba(139, 92, 246, 0.3);">
                            <h4 style="color: #C4B5FD; margin-bottom: 0.5rem;">Harga Terendah</h4>
                            <p style="font-size: 1.5rem; font-weight: 700; color: white;">${formatCurrency(minPrice)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error showing statistics:', error);
        showNotification('Terjadi kesalahan saat menampilkan statistik', 'error');
    }
}

// ============================================
// INITIALIZATION WITH ENHANCED FEATURES
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeApp();
    initializeContactForm();
    initializeSearch();
    initializeKeyboardShortcuts();
    enableAutoSave();
    
    // Load auto-saved build if exists
    setTimeout(loadAutoSavedBuild, 1000);
    
    console.log('✓ All features initialized successfully');
    console.log('Keyboard shortcuts: Ctrl+S (Save), Ctrl+R (Reset), Ctrl+P (Print), Ctrl+A (Analysis)');
});

// ============================================
// ERROR BOUNDARY
// ============================================
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    showNotification('Terjadi kesalahan pada aplikasi. Silakan refresh halaman.', 'error');
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('Terjadi kesalahan pada aplikasi. Silakan coba lagi.', 'error');
});

console.log('builder.js - Enhanced version loaded successfully');