// WebVPN Converter App Logic

// DOM Elements
const targetUrlInput = document.getElementById('targetUrl');
const vpnHostInput = document.getElementById('vpnHost');
const vpnKeyInput = document.getElementById('vpnKey');
const resultOutput = document.getElementById('resultOutput');
const btnClear = document.getElementById('btnClear');
const btnToggleConfig = document.getElementById('btnToggleConfig');
const configBody = document.getElementById('configBody');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = statusIndicator.querySelector('.status-text');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toastText');
const presetsBadges = document.getElementById('presetsBadges');

// App state variables
let conversionDebounceTimer;

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    // 1. Accordion Event Listener
    btnToggleConfig.addEventListener('click', toggleAccordion);

    // 2. Real-time Conversion Event Listeners with Debounce to prevent keystroke lag
    targetUrlInput.addEventListener('input', () => {
        handleInputChange();
        clearTimeout(conversionDebounceTimer);
        conversionDebounceTimer = setTimeout(updateConversion, 100); // 100ms debounce
    });
    
    vpnHostInput.addEventListener('input', () => {
        clearTimeout(conversionDebounceTimer);
        conversionDebounceTimer = setTimeout(updateConversion, 150);
    });
    
    vpnKeyInput.addEventListener('input', () => {
        clearTimeout(conversionDebounceTimer);
        conversionDebounceTimer = setTimeout(updateConversion, 150);
    });

    // 3. Clear button logic
    btnClear.addEventListener('click', clearInput);

    // 4. Load presets dynamically
    renderPresets();
});

// Accordion toggle
function toggleAccordion() {
    btnToggleConfig.classList.toggle('active');
    configBody.classList.toggle('open');
}

// Handle showing/hiding clear button
function handleInputChange() {
    if (targetUrlInput.value.trim() !== "") {
        btnClear.style.display = "block";
    } else {
        btnClear.style.display = "none";
    }
}

// Clear input field
function clearInput() {
    targetUrlInput.value = "";
    btnClear.style.display = "none";
    resultOutput.innerText = "等待输入源地址...";
    resultOutput.classList.add('empty');
    
    statusIndicator.classList.remove('ready');
    statusText.innerText = "待输入";
    targetUrlInput.focus();
}

// WebVPN core encryption logic
function encryptWebVPN(url, vpnHost, keyStr) {
    let targetUrl = url.trim();
    if (!targetUrl.includes("://")) {
        targetUrl = "http://" + targetUrl; // Default to http
    }

    const parts = targetUrl.split("://");
    const protocol = parts[0];
    const remaining = parts[1];

    let domainPart = "";
    let pathPart = "";
    const slashIdx = remaining.indexOf("/");

    if (slashIdx !== -1) {
        domainPart = remaining.substring(0, slashIdx);
        pathPart = remaining.substring(slashIdx + 1);
    } else {
        domainPart = remaining;
        pathPart = "";
    }

    // Extract domain and port
    let domain = domainPart;
    let portSuffix = "";
    if (domainPart.includes(":")) {
        const colonIdx = domainPart.indexOf(":");
        domain = domainPart.substring(0, colonIdx);
        portSuffix = "-" + domainPart.substring(colonIdx + 1);
    }

    // Configure Key & IV (both same UTF8 string)
    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const iv = CryptoJS.enc.Utf8.parse(keyStr);

    // Encrypt hostname using AES-128-CFB with NoPadding
    const encrypted = CryptoJS.AES.encrypt(domain, key, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding
    });

    const encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    const keyHex = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(keyStr));

    // Form final URL
    return `https://${vpnHost}/${protocol}${portSuffix}/${keyHex}${encryptedHex}/${pathPart}`;
}

// Core conversion driver
function updateConversion() {
    const rawUrl = targetUrlInput.value.trim();
    const host = vpnHostInput.value.trim();
    const keyStr = vpnKeyInput.value.trim();

    if (!rawUrl) {
        resultOutput.innerText = "等待输入源地址...";
        resultOutput.classList.add('empty');
        statusIndicator.classList.remove('ready');
        statusText.innerText = "待输入";
        return;
    }

    try {
        const converted = encryptWebVPN(rawUrl, host, keyStr);
        resultOutput.innerText = converted;
        resultOutput.classList.remove('empty');
        statusIndicator.classList.add('ready');
        statusText.innerText = "解析成功";

    } catch (e) {
        console.error(e);
        resultOutput.innerText = "解析错误，请确保加密密钥合法！";
        resultOutput.classList.add('empty');
        statusIndicator.classList.remove('ready');
        statusText.innerText = "解析出错";
    }
}

// Render presets dynamically from presets.js database
function renderPresets() {
    if (!presetsBadges) return;
    presetsBadges.innerHTML = "";

    if (typeof WEBVPN_PRESETS === 'undefined' || WEBVPN_PRESETS.length === 0) {
        presetsBadges.innerHTML = "<span style='font-size: 11px; color: var(--text-muted); font-style: italic;'>（暂无预设）</span>";
        return;
    }

    WEBVPN_PRESETS.forEach((preset, index) => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn';
        // Default active check (e.g. UESTC)
        if (vpnHostInput.value === preset.host && vpnKeyInput.value === preset.key) {
            btn.classList.add('active');
        }
        btn.textContent = preset.name;
        btn.addEventListener('click', () => selectPreset(index, btn));
        presetsBadges.appendChild(btn);
    });
}

// Select and apply preset
function selectPreset(index, btnElement) {
    const preset = WEBVPN_PRESETS[index];
    if (!preset) return;

    // Update active CSS state
    const buttons = presetsBadges.querySelectorAll('.preset-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    // Load values
    vpnHostInput.value = preset.host;
    vpnKeyInput.value = preset.key;

    updateConversion();
    showToast(`已应用预设: ${preset.name}`);
}

// Copy results to clipboard
function copyToClipboard(customText) {
    const text = customText || resultOutput.innerText;
    if (!customText && (resultOutput.classList.contains('empty') || !text)) return;

    navigator.clipboard.writeText(text).then(() => {
        showToast("链接复制成功！");
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast("链接复制成功！");
    });
}

// Launch generated link
function openLink(customText) {
    const text = customText || resultOutput.innerText;
    if (!customText && (resultOutput.classList.contains('empty') || !text)) return;
    window.open(text, '_blank');
}

// Toast helper
let toastTimeout;
function showToast(message) {
    toastText.innerText = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Utility function to escape HTML entities
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
