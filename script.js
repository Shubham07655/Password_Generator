const outputField = document.getElementById('passwordOutput');
const lengthSlider = document.getElementById('lengthSlider');
const lengthDisplay = document.getElementById('lengthDisplay');
const chkUpper = document.getElementById('includeUpper');
const chkLower = document.getElementById('includeLower');
const chkNumbers = document.getElementById('includeNumbers');
const chkSymbols = document.getElementById('includeSymbols');
const generateBtn = document.getElementById('generateBtn');
const refreshBtn = document.getElementById('refreshBtn');
const copyBtn = document.getElementById('copyBtn');
const strengthBars = document.querySelectorAll('.bar');
const toastEl = document.getElementById('toast');

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+[]{}|;:,.<>?';

function getActiveCharset() {
  let charset = '';
  if (chkUpper.checked) charset += UPPER;
  if (chkLower.checked) charset += LOWER;
  if (chkNumbers.checked) charset += NUMBERS;
  if (chkSymbols.checked) charset += SYMBOLS;
  return charset;
}

function generatePassword() {
  let charset = getActiveCharset();
  const length = parseInt(lengthSlider.value, 10);

  if (charset.length === 0) {
    updateStrengthMeter(0);
    return '⬜⬜ select options';
  }

  let guaranteed = '';
  if (chkUpper.checked) guaranteed += UPPER[Math.floor(Math.random() * UPPER.length)];
  if (chkLower.checked) guaranteed += LOWER[Math.floor(Math.random() * LOWER.length)];
  if (chkNumbers.checked) guaranteed += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  if (chkSymbols.checked) guaranteed += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

  let remainingLength = length - guaranteed.length;
  let rest = '';
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    rest += charset[randomIndex];
  }

  let combined = (guaranteed + rest).split('');
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join('');
}

function computeStrength(pw) {
  if (!pw || pw === '⬜⬜ select options') return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  let typesUsed = 0;
  if (/[A-Z]/.test(pw)) typesUsed++;
  if (/[a-z]/.test(pw)) typesUsed++;
  if (/[0-9]/.test(pw)) typesUsed++;
  if (/[^A-Za-z0-9]/.test(pw)) typesUsed++;
  if (typesUsed >= 3) score = Math.min(4, score + 1);
  if (typesUsed === 4) score = Math.min(4, score + 1);
  return Math.min(4, Math.max(0, Math.floor(score)));
}

function updateStrengthMeter(level) {
  strengthBars.forEach((bar, idx) => {
    if (idx < level) bar.classList.add('active');
    else bar.classList.remove('active');
  });
}

function refreshPassword() {
  const newPw = generatePassword();
  outputField.value = newPw;
  const strength = computeStrength(newPw);
  updateStrengthMeter(strength);
}

function updateLengthDisplay() {
  lengthDisplay.textContent = lengthSlider.value;
  refreshPassword();
}

function copyToClipboard() {
  if (!outputField.value || outputField.value === '⬜⬜ select options') {
    return;
  }
  navigator.clipboard.writeText(outputField.value).then(() => {
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 1700);
  }).catch(() => {
    alert('press Ctrl+C to copy');
  });
}

lengthSlider.addEventListener('input', () => {
  lengthDisplay.textContent = lengthSlider.value;
  refreshPassword();
});

[chkUpper, chkLower, chkNumbers, chkSymbols].forEach(cb => {
  cb.addEventListener('change', refreshPassword);
});

generateBtn.addEventListener('click', (e) => {
  e.preventDefault();
  refreshPassword();
});

refreshBtn.addEventListener('click', (e) => {
  e.preventDefault();
  refreshPassword();
});

copyBtn.addEventListener('click', (e) => {
  e.preventDefault();
  copyToClipboard();
});

window.addEventListener('load', () => {
  refreshPassword();
});
