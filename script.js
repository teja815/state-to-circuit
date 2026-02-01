// ===== THEME MANAGEMENT =====
const modeToggle = document.getElementById('modeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const body = document.body;

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
}

function enableDarkMode() {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
    localStorage.setItem('theme', 'dark');
    if (histogramChart) updateHistogramColors();
}

function enableLightMode() {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
    localStorage.setItem('theme', 'light');
    if (histogramChart) updateHistogramColors();
}

if (modeToggle) {
    modeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    });
}

document.addEventListener('DOMContentLoaded', initTheme);

// ===== ANIMATION HELPERS =====
function animateElement(element, animationType = 'fade-in') {
    element.classList.add(animationType);
    setTimeout(() => {
        element.classList.remove(animationType);
    }, 500);
}

function showError(message) {
    const errorBox = document.getElementById('errorMsg');
    errorBox.textContent = message;
    errorBox.style.display = 'block';
    animateElement(errorBox, 'slide-up');
    
    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 5000);
}

// ===== HOVER TOOLTIP SYSTEM =====
function createHoverTooltip(triggerElement, tooltipContent) {
    const tooltip = document.createElement('div');
    tooltip.className = 'hover-tooltip';
    tooltip.innerHTML = tooltipContent;
    tooltip.style.cssText = `
        position: absolute;
        left: 0;
        top: 100%;
        margin-top: 8px;
        z-index: 50;
        padding: 12px 16px;
        border-radius: 8px;
        background: var(--card-bg, #fff);
        border: 1px solid var(--border-color, #e2e8f0);
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        font-size: 0.875rem;
        color: var(--text-muted, #64748b);
        white-space: normal;
        min-width: 280px;
        max-width: 450px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(4px);
        transition: all 0.2s ease-out;
        pointer-events: none;
    `;
    
    triggerElement.style.position = 'relative';
    triggerElement.style.cursor = 'help';
    triggerElement.style.borderBottom = '1px dashed currentColor';
    triggerElement.appendChild(tooltip);
    
    triggerElement.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        tooltip.style.transform = 'translateY(0)';
    });
    
    triggerElement.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.style.transform = 'translateY(4px)';
    });
}

// Initialize tooltips
function initTooltips() {
    // Tooltip for "Select Basis State" label
    const basisLabel = document.querySelector('label[for="basisSelector"]');
    if (basisLabel) {
        createHoverTooltip(basisLabel, `
            <p style="font-weight: 600; color: var(--text-primary, #1e293b); margin-bottom: 8px;">Basis States in Quantum Computing</p>
            <p>Basis states are the fundamental states of a quantum system. For n qubits, there are 2ⁿ possible basis states.</p>
            <p style="font-family: monospace; font-size: 0.75rem; margin-top: 8px;">Example: |00⟩, |01⟩, |10⟩, |11⟩ for 2 qubits</p>
            <p style="font-weight: 600; margin-top: 12px;">Dirac Notation:</p>
            <p style="font-family: monospace; font-size: 0.75rem;">|ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1</p>
        `);
    }
    
    // Tooltip for "Amplitude" label
    const ampLabel = document.querySelector('label[for="amplitudeInput"]');
    if (ampLabel) {
        createHoverTooltip(ampLabel, `
            <p style="font-weight: 600; color: var(--text-primary, #1e293b); margin-bottom: 8px;">Amplitude in Quantum States</p>
            <p>The amplitude is a complex number that determines the probability and phase of a basis state.</p>
            <p style="font-weight: 600; margin-top: 12px;">Key concepts:</p>
            <ul style="list-style: disc; padding-left: 16px; font-size: 0.75rem; margin-top: 4px;">
                <li><strong>Probability:</strong> |amplitude|² gives the measurement probability</li>
                <li><strong>Normalization:</strong> Sum of all |amplitudes|² must equal 1</li>
                <li><strong>Phase:</strong> The angle of the complex amplitude (visible on Q-sphere)</li>
            </ul>
            <p style="font-weight: 600; margin-top: 12px;">Column Vector Representation:</p>
            <p style="font-family: monospace; font-size: 0.75rem;">|ψ⟩ = [α₀, α₁, α₂, ...]ᵀ</p>
        `);
    }
    
    // Tooltip for "Wavefunction" label
    const waveLabel = document.querySelector('label[for="waveInput"]');
    if (waveLabel) {
        createHoverTooltip(waveLabel, `
            <p style="font-weight: 600; color: var(--text-primary, #1e293b); margin-bottom: 8px;">Wavefunction Expression</p>
            <p>Enter your quantum state as a sum of amplitude-basis pairs.</p>
            <p style="font-weight: 600; margin-top: 12px;">Format:</p>
            <p style="font-family: monospace; font-size: 0.75rem;">(amplitude)|basis⟩ + (amplitude)|basis⟩ + ...</p>
            <p style="font-weight: 600; margin-top: 12px;">Example:</p>
            <p style="font-family: monospace; font-size: 0.75rem;">(0.707)|00⟩ + (0.707)|11⟩</p>
        `);
    }
}

// ===== MAIN VARIABLES =====
const numQubitsInput = document.getElementById('numQubits');
const basisSelector = document.getElementById('basisSelector');
const amplitudeInput = document.getElementById('amplitudeInput');
const addTermBtn = document.getElementById('addTermBtn');
const waveInput = document.getElementById('waveInput');
let histogramChart = null;

// ===== SAMPLE WAVEFUNCTION GENERATOR =====
function generateSampleWavefunctions(n) {
    const totalCombinations = 1 << n;
    const samples = [];
    
    // Bell State
    if (n >= 2) {
        samples.push({
            name: "Bell State (|00⟩ + |11⟩)",
            wavefunction: `(0.707)|${'0'.repeat(n)}> + (0.707)|${'1'.repeat(n)}>`
        });
    }
    
    // Single excited state
    samples.push({
        name: `Single Excited |${'0'.repeat(n-1)}1⟩`,
        wavefunction: `(1.0)|${'0'.repeat(n-1)}1>`
    });
    
    // Even states only
    if (n >= 2) {
        const states = [];
        for (let i = 0; i < totalCombinations; i++) {
            if (i % 2 === 0) {
                const binStr = i.toString(2).padStart(n, '0');
                const amp = (1 / Math.sqrt(totalCombinations / 2)).toFixed(3);
                states.push(`(${amp})|${binStr}>`);
            }
        }
        samples.push({
            name: "Even States Only",
            wavefunction: states.join(' + ')
        });
    }
    
    // Single excitation states
    if (n >= 3) {
        const states = [];
        for (let i = 0; i < totalCombinations; i++) {
            const binStr = i.toString(2).padStart(n, '0');
            const hammingWeight = binStr.split('1').length - 1;
            if (hammingWeight === 1) {
                const amp = (1 / Math.sqrt(n)).toFixed(3);
                states.push(`(${amp})|${binStr}>`);
            }
        }
        samples.push({
            name: "Single Excitation States",
            wavefunction: states.join(' + ')
        });
    }
    
    // Custom pattern with zeros
    if (n >= 2) {
        const amp = (1 / Math.sqrt(2)).toFixed(3);
        samples.push({
            name: "Custom Pattern with Zeros",
            wavefunction: `(${amp})|${'0'.repeat(n)}> + (0.0)|${'0'.repeat(n-1)}1> + (${amp})|${'1'.repeat(n-1)}0>`
        });
    }
    
    return samples;
}

// ===== QUBIT INPUT HANDLER =====
numQubitsInput.addEventListener('input', () => {
    const n = parseInt(numQubitsInput.value);
    basisSelector.innerHTML = '<option value="">-- Select basis state --</option>';
    const basisStatesList = document.getElementById('basisStatesList');
    const sampleWaveDiv = document.getElementById('sampleWavefunctionsList');
    
    if (Number.isInteger(n) && n >= 1 && n <= 5) {
        const totalCombinations = 1 << n;
        
        // Populate dropdown
        for (let i = 0; i < totalCombinations; i++) {
            const binStr = i.toString(2).padStart(n, '0');
            const option = document.createElement('option');
            option.value = binStr;
            option.textContent = '|' + binStr + '⟩';
            basisSelector.appendChild(option);
        }
        
        // Show possible basis states description
        let html = `
            <div class="description-box" style="background: var(--card-bg-secondary, #f8fafc); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0); margin-top: 8px;">
                <p style="font-weight: 600; color: var(--text-primary, #1e293b); margin-bottom: 8px;">Possible basis states:</p>
                <p style="font-family: monospace; font-size: 0.75rem; line-height: 1.6; word-break: break-word;">
                    ${Array.from({length: totalCombinations}, (_, i) => `|${i.toString(2).padStart(n, '0')}⟩`).join(', ')}
                </p>
            </div>
        `;
        basisStatesList.innerHTML = html;

        // Generate and display sample wavefunctions
        const samples = generateSampleWavefunctions(n);
        sampleWaveDiv.innerHTML = `
            <div class="description-box" style="background: var(--card-bg-secondary, #f8fafc); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0); margin-top: 8px;">
                <p style="font-weight: 600; color: var(--text-primary, #1e293b); margin-bottom: 12px;">Example Wavefunctions (click to use):</p>
                <div id="sampleWavefunctionsContainer"></div>
            </div>
        `;
        
        const container = document.getElementById('sampleWavefunctionsContainer');
        samples.forEach(sample => {
            const sampleDiv = document.createElement('div');
            sampleDiv.className = 'sample-wavefunction';
            sampleDiv.style.cssText = `
                padding: 8px 12px;
                margin-bottom: 8px;
                background: var(--card-bg, #fff);
                border: 1px solid var(--border-color, #e2e8f0);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.75rem;
            `;
            sampleDiv.innerHTML = `<strong style="color: var(--primary-color, #3b82f6);">${sample.name}:</strong> <span style="word-break: break-all;">${sample.wavefunction}</span>`;
            sampleDiv.addEventListener('click', () => {
                waveInput.value = sample.wavefunction;
                animateElement(sampleDiv, 'slide-up');
            });
            sampleDiv.addEventListener('mouseenter', () => {
                sampleDiv.style.borderColor = 'var(--primary-color, #3b82f6)';
                sampleDiv.style.transform = 'translateX(4px)';
            });
            sampleDiv.addEventListener('mouseleave', () => {
                sampleDiv.style.borderColor = 'var(--border-color, #e2e8f0)';
                sampleDiv.style.transform = 'translateX(0)';
            });
            container.appendChild(sampleDiv);
        });

        // Random normalized state
        let amps = Array.from({length: totalCombinations}, () => Math.random());
        const norm = Math.sqrt(amps.reduce((sum, a) => sum + a * a, 0));
        amps = amps.map(a => a / norm);
        const wf = amps.map((a, i) => `(${a.toFixed(3)})|${i.toString(2).padStart(n, '0')}>`).join(' + ');
        
        const randomSampleDiv = document.createElement('div');
        randomSampleDiv.className = 'sample-wavefunction';
        randomSampleDiv.style.cssText = `
            padding: 8px 12px;
            background: var(--card-bg, #fff);
            border: 1px solid var(--border-color, #e2e8f0);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.75rem;
        `;
        randomSampleDiv.innerHTML = `<strong style="color: var(--primary-color, #3b82f6);">Random Normalized State:</strong> <span style="word-break: break-all;">${wf}</span>`;
        randomSampleDiv.addEventListener('click', () => {
            waveInput.value = wf;
            animateElement(randomSampleDiv, 'slide-up');
        });
        randomSampleDiv.addEventListener('mouseenter', () => {
            randomSampleDiv.style.borderColor = 'var(--primary-color, #3b82f6)';
            randomSampleDiv.style.transform = 'translateX(4px)';
        });
        randomSampleDiv.addEventListener('mouseleave', () => {
            randomSampleDiv.style.borderColor = 'var(--border-color, #e2e8f0)';
            randomSampleDiv.style.transform = 'translateX(0)';
        });
        container.appendChild(randomSampleDiv);
        
    } else {
        basisStatesList.innerHTML = '';
        if (sampleWaveDiv) sampleWaveDiv.innerHTML = '';
    }
    
    waveInput.value = '';
    document.getElementById('colVector').textContent = '';
    document.getElementById('errorMsg').textContent = '';
});

// ===== HISTOGRAM CHART =====
function updateHistogramColors() {
    if (!histogramChart) return;
    const isDark = body.classList.contains('dark-mode');
    const backgroundColor = isDark ? 'rgba(59, 130, 246, 0.7)' : 'rgba(54, 162, 235, 0.7)';
    const borderColor = isDark ? 'rgba(59, 130, 246, 1)' : 'rgba(54, 162, 235, 1)';
    const textColor = isDark ? '#f1f5f9' : '#1e293b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    histogramChart.data.datasets[0].backgroundColor = backgroundColor;
    histogramChart.data.datasets[0].borderColor = borderColor;
    histogramChart.options.scales.x.ticks.color = textColor;
    histogramChart.options.scales.y.ticks.color = textColor;
    histogramChart.options.scales.x.title.color = textColor;
    histogramChart.options.scales.y.title.color = textColor;
    histogramChart.options.scales.x.grid.color = gridColor;
    histogramChart.options.scales.y.grid.color = gridColor;
    histogramChart.options.plugins.title.color = textColor;
    histogramChart.update();
}

function drawHistogram(counts) {
    const labels = Object.keys(counts);
    const values = Object.values(counts);
    const ctx = document.getElementById('histogram').getContext('2d');
    
    const isDark = body.classList.contains('dark-mode');
    const backgroundColor = isDark ? 'rgba(59, 130, 246, 0.7)' : 'rgba(54, 162, 235, 0.7)';
    const borderColor = isDark ? 'rgba(59, 130, 246, 1)' : 'rgba(54, 162, 235, 1)';
    const textColor = isDark ? '#f1f5f9' : '#1e293b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    if (histogramChart) {
        histogramChart.data.labels = labels;
        histogramChart.data.datasets[0].data = values;
        updateHistogramColors();
        return;
    }

    histogramChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Measurement Counts',
                data: values,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Measurement Results',
                    color: textColor,
                    font: { size: 14, weight: 600 }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Bitstring Outcome', color: textColor },
                    ticks: { color: textColor, font: { family: 'monospace', size: 10 } },
                    grid: { color: gridColor }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Counts', color: textColor },
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

// ===== COMPLEX VECTOR CONVERSION =====
function makeComplexVector(vector) {
    return vector.map(v => {
        if (typeof v === 'number') return { re: v, im: 0 };
        if (v && typeof v.re === 'number' && typeof v.im === 'number') return v;
        return { re: 0, im: 0 };
    });
}

// ===== Q-SPHERE VISUALIZATION =====
function plotQSphere(divId, stateVec) {
    const nQ = Math.log2(stateVec.length);
    const spikeTraces = [];
    const tipTraces = [];
    const latitudeTraces = [];
    const labelX = [], labelY = [], labelZ = [], labelText = [];

    for (let i = 0; i < stateVec.length; i++) {
        const amp = stateVec[i];
        const re = amp.re, im = amp.im;
        const prob = re * re + im * im;
        const phase = Math.atan2(im, re);
        const weightStr = i.toString(2).padStart(nQ, '0');
        const hamming = weightStr.split('').filter(q => q === '1').length;
        const theta = (hamming / nQ) * Math.PI;
        const phi = 2 * Math.PI * i / stateVec.length;
        const r = 1.0;
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);

        labelX.push(x); labelY.push(y); labelZ.push(z);
        labelText.push(`|${weightStr}⟩`);

        spikeTraces.push({
            type: "scatter3d", mode: "lines",
            x: [0, x], y: [0, y], z: [0, z],
            line: { color: `hsl(${(phase * 180 / Math.PI + 360) % 360}, 80%, 50%)`, width: 1 + 8 * prob },
            opacity: 0.8, hoverinfo: "skip", showlegend: false
        });

        tipTraces.push({
            type: "scatter3d", mode: "markers",
            x: [x], y: [y], z: [z],
            marker: { size: 5 + 20 * prob, color: `hsl(${(phase * 180 / Math.PI + 360) % 360}, 80%, 40%)` },
            text: `|${weightStr}⟩<br>amp=${re.toFixed(2)} + ${im.toFixed(2)}i<br>P=${prob.toFixed(2)}<br>phase=${phase.toFixed(2)}`,
            hoverinfo: "text", showlegend: false
        });
    }

    const SPHERE_POINTS = 60;
    for (let k = 0; k <= nQ; k++) {
        const theta = (k / nQ) * Math.PI;
        const latX = [], latY = [], latZ = [];
        for (let p = 0; p <= SPHERE_POINTS; p++) {
            const phi = (p / SPHERE_POINTS) * 2 * Math.PI;
            latX.push(Math.sin(theta) * Math.cos(phi));
            latY.push(Math.sin(theta) * Math.sin(phi));
            latZ.push(Math.cos(theta));
        }
        latitudeTraces.push({
            type: "scatter3d", mode: "lines",
            x: latX, y: latY, z: latZ,
            line: { color: "gray", width: 1 },
            opacity: 0.2, hoverinfo: "skip", showlegend: false
        });
    }

    const U = 30, V = 30;
    const xs = [], ys = [], zs = [];
    for (let i = 0; i <= U; i++) {
        const theta = Math.PI * i / U;
        const rowX = [], rowY = [], rowZ = [];
        for (let j = 0; j <= V; j++) {
            const phi = 2 * Math.PI * j / V;
            rowX.push(Math.sin(theta) * Math.cos(phi));
            rowY.push(Math.sin(theta) * Math.sin(phi));
            rowZ.push(Math.cos(theta));
        }
        xs.push(rowX); ys.push(rowY); zs.push(rowZ);
    }

    const sphereSurface = {
        type: 'surface', x: xs, y: ys, z: zs, opacity: 0.2,
        colorscale: [[0, 'rgba(200, 230, 250, 0.5)'], [1, 'rgba(180, 200, 240, 0.3)']],
        showscale: false,
        contours: {
            x: { show: true, color: '#5a56568a' },
            y: { show: true, color: '#5a565680' },
            z: { show: true, color: '#5a565685' }
        },
        hoverinfo: 'skip', showlegend: false
    };

    const labelTraces = {
        type: "scatter3d", mode: "text",
        x: labelX, y: labelY, z: labelZ, text: labelText,
        textposition: "top center",
        textfont: { size: 11, color: body.classList.contains('dark-mode') ? '#e2e8f0' : '#333333' },
        hoverinfo: "skip", showlegend: false
    };

    const layout = {
        title: {
            text: 'Q-Sphere Visualization',
            font: { size: 14, color: body.classList.contains('dark-mode') ? '#e2e8f0' : '#1e293b' }
        },
        margin: { l: 0, r: 0, b: 0, t: 40 },
        scene: {
            aspectmode: 'cube',
            xaxis: { range: [-1.3, 1.3], showgrid: false, zeroline: false, showticklabels: false, visible: false },
            yaxis: { range: [-1.3, 1.3], showgrid: false, zeroline: false, showticklabels: false, visible: false },
            zaxis: { range: [-1.3, 1.3], showgrid: false, zeroline: false, showticklabels: false, visible: false },
            camera: { eye: { x: 0.8, y: 0.8, z: 0.8 } }
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent'
    };

    Plotly.newPlot(divId, [sphereSurface, ...latitudeTraces, ...spikeTraces, ...tipTraces, labelTraces], layout, { responsive: true, displayModeBar: false });
}

// ===== CIRCUIT DIAGRAM RENDERING =====
function renderCircuit(numQubits, gates) {
    const container = document.getElementById("circuitContainer");
    const numClassical = numQubits;
    container.innerHTML = "";
    container.innerHTML += "<h2>Circuit Diagram</h2>";
    
    // Create scrollable wrapper
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'circuit-scroll-wrapper';
    scrollWrapper.style.cssText = `
        overflow: auto;
        max-height: 400px;
        max-width: 100%;
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 8px;
        background: var(--card-bg, #fff);
        padding: 16px;
    `;
    
    // Tooltip
    let tooltip = document.getElementById('gateTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'gateTooltip';
        tooltip.style.cssText = `
            position: fixed;
            pointer-events: none;
            background: rgba(30,41,59,0.95);
            color: #fff;
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            z-index: 9999;
            display: none;
        `;
        document.body.appendChild(tooltip);
    }
    
    function showTooltip(text, evt) {
        tooltip.textContent = text;
        tooltip.style.display = 'block';
        tooltip.style.left = (evt.clientX + 12) + 'px';
        tooltip.style.top = (evt.clientY - 8) + 'px';
    }
    function hideTooltip() { tooltip.style.display = 'none'; }

    const width = 120 * (gates.length + 1);
    const qheight = 60;
    const cHeight = 40;
    const height = numQubits * qheight + numClassical * cHeight + 60;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    const isDark = body.classList.contains('dark-mode');
    const strokeColor = isDark ? '#24496dff' : '#000000';
    const textColor = isDark ? '#234363ff' : '#000000';
    const gateColor = isDark ? '#d0d9e9ff' : '#3c745bff';

    // Draw quantum wires
    for (let q = 0; q < numQubits; q++) {
        const y = 30 + q * qheight;
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", 20);
        line.setAttribute("y1", y);
        line.setAttribute("x2", width - 20);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", strokeColor);
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);

        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", 0);
        text.setAttribute("y", y + 5);
        text.setAttribute("fill", textColor);
        text.textContent = `q${q}`;
        svg.appendChild(text);
    }

    // Draw classical registers
    const startY = numQubits * qheight + 50;
    for (let c = 0; c < numClassical; c++) {
        const y = startY + c * cHeight;
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", 20);
        line.setAttribute("y1", y);
        line.setAttribute("x2", width - 20);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "blue");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);

        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", 0);
        text.setAttribute("y", y + 5);
        text.setAttribute("fill", textColor);
        text.textContent = `cr[${c}]`;
        svg.appendChild(text);
    }

    // Draw gates
    gates.forEach((g, i) => {
        const x = 100 + i * 120;

        if (["X", "Y", "Z", "H", "S", "T", "SDG", "TDG", "RX", "RY", "RZ", "PHASE"].includes(g.type)) {
            const qTarget = g.params[0];
            const y = 30 + qTarget * qheight;

            const rect = document.createElementNS(svgNS, "rect");
            rect.setAttribute("x", x - 25);
            rect.setAttribute("y", y - 25);
            rect.setAttribute("width", 50);
            rect.setAttribute("height", 50);
            rect.setAttribute("fill", gateColor);
            rect.setAttribute("stroke", strokeColor);
            rect.style.cursor = 'pointer';
            rect.addEventListener('mousemove', (evt) => showTooltip(g.type, evt));
            rect.addEventListener('mouseleave', hideTooltip);
            svg.appendChild(rect);

            const label = document.createElementNS(svgNS, "text");
            label.setAttribute("x", x);
            label.setAttribute("y", y);
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("font-size", "14");
            label.setAttribute("dominant-baseline", "middle");
            label.setAttribute("fill", textColor);

            if (["RX", "RY", "RZ", "PHASE"].includes(g.type)) {
                const angleDeg = g.angle ? (g.angle * 180 / Math.PI).toFixed(1) : "";
                label.textContent = `${g.type}${angleDeg ? `(${angleDeg}°)` : ""}`;
            } else {
                label.textContent = g.type;
            }
            svg.appendChild(label);
        }

        // CNOT
        if (g.type === "CNOT") {
            const c = g.params[0], t = g.params[1];
            const yc = 30 + c * qheight, yt = 30 + t * qheight;

            const dot = document.createElementNS(svgNS, "circle");
            dot.setAttribute("cx", x);
            dot.setAttribute("cy", yc);
            dot.setAttribute("r", 6);
            dot.setAttribute("fill", strokeColor);
            dot.style.cursor = 'pointer';
            dot.addEventListener('mousemove', (evt) => showTooltip('CNOT control', evt));
            dot.addEventListener('mouseleave', hideTooltip);
            svg.appendChild(dot);

            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", yt);
            circle.setAttribute("r", 12);
            circle.setAttribute("stroke", strokeColor);
            circle.setAttribute("fill", isDark ? "#1e293b" : "white");
            circle.style.cursor = 'pointer';
            circle.addEventListener('mousemove', (evt) => showTooltip('CNOT gate', evt));
            circle.addEventListener('mouseleave', hideTooltip);
            svg.appendChild(circle);

            const lineV = document.createElementNS(svgNS, "line");
            lineV.setAttribute("x1", x);
            lineV.setAttribute("y1", yc);
            lineV.setAttribute("x2", x);
            lineV.setAttribute("y2", yt);
            lineV.setAttribute("stroke", strokeColor);
            lineV.setAttribute("stroke-width", "2");
            svg.appendChild(lineV);

            const lineH = document.createElementNS(svgNS, "line");
            lineH.setAttribute("x1", x - 10);
            lineH.setAttribute("y1", yt);
            lineH.setAttribute("x2", x + 10);
            lineH.setAttribute("y2", yt);
            lineH.setAttribute("stroke", strokeColor);
            lineH.setAttribute("stroke-width", "2");
            svg.appendChild(lineH);

            const lineV2 = document.createElementNS(svgNS, "line");
            lineV2.setAttribute("x1", x);
            lineV2.setAttribute("y1", yt - 10);
            lineV2.setAttribute("x2", x);
            lineV2.setAttribute("y2", yt + 10);
            lineV2.setAttribute("stroke", strokeColor);
            lineV2.setAttribute("stroke-width", "2");
            svg.appendChild(lineV2);
        }

        // CZ
        if (g.type === "CZ") {
            const c = g.params[0], t = g.params[1];
            const yc = 30 + c * qheight, yt = 30 + t * qheight;

            const dotC = document.createElementNS(svgNS, "circle");
            dotC.setAttribute("cx", x);
            dotC.setAttribute("cy", yc);
            dotC.setAttribute("r", 6);
            dotC.setAttribute("fill", strokeColor);
            svg.appendChild(dotC);

            const dotT = document.createElementNS(svgNS, "circle");
            dotT.setAttribute("cx", x);
            dotT.setAttribute("cy", yt);
            dotT.setAttribute("r", 6);
            dotT.setAttribute("fill", strokeColor);
            svg.appendChild(dotT);

            const lineV = document.createElementNS(svgNS, "line");
            lineV.setAttribute("x1", x);
            lineV.setAttribute("y1", yc);
            lineV.setAttribute("x2", x);
            lineV.setAttribute("y2", yt);
            lineV.setAttribute("stroke", strokeColor);
            lineV.setAttribute("stroke-width", "2");
            svg.appendChild(lineV);
        }

        // SWAP
        if (g.type === "SWAP") {
            const a = g.params[0], b = g.params[1];
            const ya = 30 + a * qheight, yb = 30 + b * qheight;

            [[ya, -10, 10], [ya, 10, -10], [yb, -10, 10], [yb, 10, -10]].forEach(([y, d1, d2]) => {
                const line = document.createElementNS(svgNS, "line");
                line.setAttribute("x1", x - 10);
                line.setAttribute("y1", y + d1);
                line.setAttribute("x2", x + 10);
                line.setAttribute("y2", y + d2);
                line.setAttribute("stroke", strokeColor);
                line.setAttribute("stroke-width", "2");
                svg.appendChild(line);
            });

            const lineV = document.createElementNS(svgNS, "line");
            lineV.setAttribute("x1", x);
            lineV.setAttribute("y1", ya);
            lineV.setAttribute("x2", x);
            lineV.setAttribute("y2", yb);
            lineV.setAttribute("stroke", strokeColor);
            lineV.setAttribute("stroke-width", "2");
            svg.appendChild(lineV);
        }

        // Toffoli (CCNOT)
        if (g.type === "CCNOT") {
            const c1 = g.params[0], c2 = g.params[1], t = g.params[2];
            const y1 = 30 + c1 * qheight, y2 = 30 + c2 * qheight, yt = 30 + t * qheight;

            [y1, y2].forEach(yc => {
                const dot = document.createElementNS(svgNS, "circle");
                dot.setAttribute("cx", x);
                dot.setAttribute("cy", yc);
                dot.setAttribute("r", 6);
                dot.setAttribute("fill", strokeColor);
                svg.appendChild(dot);
            });

            const lineV = document.createElementNS(svgNS, "line");
            lineV.setAttribute("x1", x);
            lineV.setAttribute("y1", Math.min(y1, y2));
            lineV.setAttribute("x2", x);
            lineV.setAttribute("y2", yt);
            lineV.setAttribute("stroke", strokeColor);
            lineV.setAttribute("stroke-width", "2");
            svg.appendChild(lineV);

            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", yt);
            circle.setAttribute("r", 12);
            circle.setAttribute("stroke", strokeColor);
            circle.setAttribute("fill", isDark ? "#1e293b" : "white");
            svg.appendChild(circle);

            const lineH = document.createElementNS(svgNS, "line");
            lineH.setAttribute("x1", x - 10);
            lineH.setAttribute("y1", yt);
            lineH.setAttribute("x2", x + 10);
            lineH.setAttribute("y2", yt);
            lineH.setAttribute("stroke", strokeColor);
            lineH.setAttribute("stroke-width", "2");
            svg.appendChild(lineH);

            const lineV2 = document.createElementNS(svgNS, "line");
            lineV2.setAttribute("x1", x);
            lineV2.setAttribute("y1", yt - 10);
            lineV2.setAttribute("x2", x);
            lineV2.setAttribute("y2", yt + 10);
            lineV2.setAttribute("stroke", strokeColor);
            lineV2.setAttribute("stroke-width", "2");
            svg.appendChild(lineV2);
        }

        // Identity gates for unaffected qubits
        if (g.type !== "MEASURE") {
            for (let q = 0; q < numQubits; q++) {
                let isTarget = false;
                if (["X", "Y", "Z", "H", "S", "T", "SDG", "TDG", "RX", "RY", "RZ", "PHASE", "MEASURE"].includes(g.type)) {
                    isTarget = (q === g.params[0]);
                } else if (["CNOT", "CZ"].includes(g.type)) {
                    isTarget = (q === g.params[0] || q === g.params[1]);
                } else if (g.type === "CCNOT") {
                    isTarget = (q === g.params[0] || q === g.params[1] || q === g.params[2]);
                } else if (g.type === "SWAP") {
                    isTarget = (q === g.params[0] || q === g.params[1]);
                }

                if (!isTarget) {
                    const y = 30 + q * qheight;
                    const rect = document.createElementNS(svgNS, "rect");
                    rect.setAttribute("x", x - 15);
                    rect.setAttribute("y", y - 15);
                    rect.setAttribute("width", 30);
                    rect.setAttribute("height", 30);
                    rect.setAttribute("fill", isDark ? "#374151" : "#f0f0f0");
                    rect.setAttribute("stroke", strokeColor);
                    svg.appendChild(rect);

                    const label = document.createElementNS(svgNS, "text");
                    label.setAttribute("x", x);
                    label.setAttribute("y", y);
                    label.setAttribute("text-anchor", "middle");
                    label.setAttribute("dominant-baseline", "middle");
                    label.setAttribute("font-size", "12");
                    label.setAttribute("fill", textColor);
                    label.textContent = "I";
                    svg.appendChild(label);
                }
            }
        }
    });

    scrollWrapper.appendChild(svg);
    container.appendChild(scrollWrapper);
}

function convertBackendToCircuitGates(backendGates) {
    return backendGates.map(g => {
        if (["X", "Y", "Z", "H", "S", "T"].includes(g.gate)) {
            return { type: g.gate, params: g.qubits };
        }
        if (["RX", "RY", "RZ"].includes(g.gate)) {
            return { type: g.gate, params: g.qubits, angle: g.angle };
        }
        if (g.gate === "CNOT") return { type: "CNOT", params: [g.control, g.target] };
        if (g.gate === "CZ") return { type: "CZ", params: [g.control, g.target] };
        if (g.gate === "CCNOT") return { type: "CCNOT", params: [g.control1, g.control2, g.target] };
        if (g.gate === "SWAP") return { type: "SWAP", params: [g.q1, g.q2] };
        if (g.gate === "MEASURE") return { type: "MEASURE", params: [g.qubit, g.clbit] };
        return null;
    }).filter(Boolean);
}

// ===== ADD TERM BUTTON =====
addTermBtn.addEventListener('click', () => {
    const basis = basisSelector.value;
    const amplitude = amplitudeInput.value.trim();
    if (basis === '' || amplitude === '') return;

    const term = `(${amplitude})|${basis}>`;
    waveInput.value = waveInput.value ? waveInput.value + ' + ' + term : term;
    amplitudeInput.value = '';
    basisSelector.selectedIndex = 0;
    animateElement(addTermBtn, 'slide-up');
});

// ===== CONVERT WAVEFUNCTION =====
const btn = document.getElementById('convertBtn');
btn.addEventListener('click', convertWavefunction);

function convertWavefunction() {
    const n = parseInt(document.getElementById('numQubits').value, 10);
    const wf = document.getElementById('waveInput').value || '';
    const errorBox = document.getElementById('errorMsg');
    const out = document.getElementById('colVector');

    errorBox.textContent = '';
    errorBox.style.display = 'none';
    out.textContent = '';

    if (!Number.isInteger(n) || n < 1 || n > 5) {
        showError('⚠ Enter a valid number of qubits (between 1 and 5).');
        return;
    }

    const dim = 1 << n;
    let vector = new Array(dim).fill(0);

    const termRegex = /([+-]?\s*(?:\([^\)]+\)|[0-9.]+(?:e[+-]?\d+)?(?:i[0-9.+-]+)?))?\s*\|\s*([01]+)\s*>/g;
    let m;
    let anyMatch = false;
    const invalidTerms = [];

    while ((m = termRegex.exec(wf)) !== null) {
        anyMatch = true;
        let rawCoeff = (m[1] || '').trim();
        if (rawCoeff === '' || rawCoeff === '+') rawCoeff = '1';
        if (rawCoeff === '-') rawCoeff = '-1';
        rawCoeff = rawCoeff.replace(/[()]/g, '').replace(/^\+/, '');

        const basis = (m[2] || '').trim();
        if (basis.length > n) {
            invalidTerms.push('|' + basis + '>');
            continue;
        }

        const padded = basis.padStart(n, '0');
        const index = parseInt(padded, 2);

        if (!isNaN(index) && index < dim) {
            const num = parseFloat(rawCoeff);
            vector[index] = isNaN(num) ? rawCoeff : num;
        }
    }

    if (!anyMatch) {
        const zeros = '0'.repeat(n);
        const ones = '1'.repeat(n);
        showError(`⚠ No valid terms found. Example for ${n} qubit(s): (0.7)|${zeros}> + (0.7)|${ones}>`);
    }

    if (invalidTerms.length > 0) {
        showError(`⚠ Invalid basis states: ${invalidTerms.join(', ')} (expected ${n}-qubit states)`);
    }

    const sumSquares = vector.reduce((acc, val) => acc + (typeof val === 'number' ? val * val : 0), 0);
    if (sumSquares < 0.99 || sumSquares > 1.01) {
        showError(`⚠ Error: Invalid normalization. Sum of squares = ${sumSquares.toFixed(4)}. Should be ≈1.`);
        vector = new Array(dim).fill(0);
    }

    out.textContent = '[' + vector.join(', ') + ']';

    const convertBtn = document.getElementById('convertBtn');
    const originalText = convertBtn.textContent;
    convertBtn.textContent = 'Converting...';
    convertBtn.disabled = true;

    fetch("https://state-to-circuit.onrender.com/prepare_state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            num_qubits: n,
            amplitudes: vector,
            initial_basis: "0".repeat(n),
            optimized: true
        })
    })
    .then(res => res.json())
    .then(data => {
        const circuitGates = convertBackendToCircuitGates(data.gate_sequence);
        renderCircuit(data.num_qubits, circuitGates);

        let output = "";
        if (data.gate_sequence && data.gate_sequence.length > 0) {
            data.gate_sequence.forEach(step => {
                if (step.gate === "CNOT") {
                    output += `${step.step}. Apply CNOT (control q${step.control} → target q${step.target})\n`;
                } else if (["RX", "RY", "RZ"].includes(step.gate)) {
                    output += `${step.step}. Apply ${step.gate}(${step.angle.toFixed(6)}) on qubits ${step.qubits.join(", ")}\n`;
                } else {
                    output += `${step.step}. Apply ${step.gate} on qubits ${step.qubits.join(", ")}\n`;
                }
            });
        } else {
            output = "⚠ No gates returned by backend.";
        }

        const complexVec = makeComplexVector(vector);
        plotQSphere('qsphereDiv', complexVec);
        document.getElementById("backendOutput").textContent = output;
        drawHistogram(data.counts);

        convertBtn.textContent = originalText;
        convertBtn.disabled = false;
        animateElement(convertBtn, 'slide-up');
    })
    .catch(err => {
        document.getElementById("backendOutput").textContent = "❌ Backend error: " + err;
        convertBtn.textContent = originalText;
        convertBtn.disabled = false;
    });
}

// ===== INITIALIZE TOOLTIPS ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTooltips();
});
