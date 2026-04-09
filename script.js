// ── AUDIO ENGINE ─────────────────────────────────────────
const AC = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, dur, vol = 0.12, type = 'sine') {
  const o = AC.createOscillator();
  const g = AC.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g); g.connect(AC.destination);
  g.gain.setValueAtTime(vol, AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
  o.start(); o.stop(AC.currentTime + dur);
}

const sounds = {
  digit:    () => playTone(1200, 0.045, 0.10, 'sine'),
  op:       () => playTone(900,  0.055, 0.11, 'sine'),
  equals:   () => { playTone(880, 0.07, 0.11); setTimeout(() => playTone(1100, 0.09, 0.09), 70); },
  clear:    () => playTone(500,  0.08,  0.10, 'sine'),
  delete:   () => playTone(700,  0.05,  0.09, 'sine'),
  sci:      () => playTone(1000, 0.05,  0.10, 'sine'),
  error:    () => playTone(300,  0.18,  0.10, 'sine'),
};

// ── RIPPLE ───────────────────────────────────────────────
function addRipple(btn, e) {
  const r = document.createElement('span');
  r.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

// ── DOM REFS ─────────────────────────────────────────────
const resultEl     = document.getElementById('result');
const expressionEl = document.getElementById('expression');
const opIndicator  = document.getElementById('opIndicator');
const historyList  = document.getElementById('historyList');
const historyPanel = document.getElementById('historyPanel');
const histToggle   = document.getElementById('histToggle');
const clearHistBtn = document.getElementById('clearHistory');
const sciToggle    = document.getElementById('sciToggle');
const sciButtons   = document.getElementById('sciButtons');
const themeToggle  = document.getElementById('themeToggle');

// ── STATE ────────────────────────────────────────────────
let current    = '0';
let expression = '';
let justEvaled = false;
let activeOp   = '';
let history    = JSON.parse(localStorage.getItem('calc-history') || '[]');

// ── OP INDICATOR ─────────────────────────────────────────
const opLabels = { '+': 'ADD', '-': 'SUBTRACT', '*': 'MULTIPLY', '/': 'DIVIDE', '%': 'PERCENT' };

function setOpIndicator(op) {
  activeOp = op;
  if (op && opLabels[op]) {
    opIndicator.textContent = opLabels[op];
    opIndicator.classList.add('show');
  } else {
    opIndicator.classList.remove('show');
  }
  // highlight active op button
  document.querySelectorAll('.btn-op').forEach(b => {
    b.classList.toggle('op-active', b.dataset.value === op);
  });
}

// ── DISPLAY ──────────────────────────────────────────────
function updateDisplay() {
  resultEl.textContent     = current;
  expressionEl.textContent = expression;
  resultEl.style.fontSize  = current.length > 14 ? '22px' : current.length > 10 ? '30px' : '42px';
  resultEl.style.animation = 'none';
  resultEl.offsetHeight;
  resultEl.style.animation = '';
}

// ── INPUT ────────────────────────────────────────────────
function inputDigit(d) {
  if (justEvaled) { current = d; expression = ''; justEvaled = false; setOpIndicator(''); }
  else current = current === '0' ? d : current + d;
  updateDisplay();
}

function inputDecimal() {
  if (justEvaled) { current = '0.'; expression = ''; justEvaled = false; }
  else if (!current.includes('.')) current += '.';
  updateDisplay();
}

function inputOperator(op) {
  justEvaled = false;
  const last = expression.slice(-1);
  expression = (expression && isOp(last))
    ? expression.slice(0, -1) + op
    : expression + current + op;
  current = '0';
  setOpIndicator(op);
  updateDisplay();
}

function inputPercent() {
  const v = parseFloat(current);
  if (!isNaN(v)) { current = (v / 100).toString(); updateDisplay(); }
}

function toggleSign() {
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  if (current === '-0') current = '0';
  updateDisplay();
}

function deleteLast() {
  if (justEvaled) return;
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay();
}

function clearAll() {
  current = '0'; expression = ''; justEvaled = false;
  setOpIndicator('');
  updateDisplay();
}

function calculate() {
  if (!expression) return;
  const fullExpr = expression + current;
  try {
    const raw = Function('"use strict"; return (' + fullExpr + ')')();
    if (!isFinite(raw)) throw new Error();
    const res = parseFloat(raw.toFixed(10)).toString();
    addHistory(fullExpr, res);
    expression = fullExpr + '=';
    current    = res;
    justEvaled = true;
    setOpIndicator('');
    updateDisplay();
    sounds.equals();
    return;
  } catch { /* fall through */ }
  current = 'Error';
  updateDisplay();
  sounds.error();
}

function isOp(ch) { return ['+', '-', '*', '/'].includes(ch); }

// ── SCIENTIFIC ───────────────────────────────────────────
const sciActions = {
  sin:  v => Math.sin(v * Math.PI / 180),
  cos:  v => Math.cos(v * Math.PI / 180),
  tan:  v => Math.tan(v * Math.PI / 180),
  log:  v => Math.log10(v),
  ln:   v => Math.log(v),
  sqrt: v => Math.sqrt(v),
  sq:   v => v * v,
};

function handleSci(action) {
  sounds.sci();
  if (action === 'pi') { current = Math.PI.toString(); updateDisplay(); return; }
  if (action === 'e')  { current = Math.E.toString();  updateDisplay(); return; }
  if (action === '(' || action === ')') {
    if (justEvaled) { expression = ''; justEvaled = false; }
    expression += action;
    updateDisplay();
    return;
  }
  if (action === 'pow') {
    inputOperator('**');
    setOpIndicator('');
    opIndicator.textContent = 'POWER';
    opIndicator.classList.add('show');
    return;
  }
  const fn = sciActions[action];
  if (!fn) return;
  const v = parseFloat(current);
  if (isNaN(v)) return;
  const res = parseFloat(fn(v).toFixed(10)).toString();
  const label = action === 'sqrt' ? `√(${v})` : action === 'sq' ? `(${v})²` : `${action}(${v})`;
  addHistory(label, res);
  current = res;
  justEvaled = true;
  updateDisplay();
}

// ── HISTORY ──────────────────────────────────────────────
function addHistory(expr, res) {
  history.unshift({ expr, res });
  if (history.length > 50) history.pop();
  localStorage.setItem('calc-history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (!history.length) {
    historyList.innerHTML = '<p class="no-history">No history yet</p>';
    return;
  }
  historyList.innerHTML = history.map((h, i) => `
    <li data-index="${i}">
      <div class="hist-expr">${h.expr}</div>
      <div class="hist-result">${h.res}</div>
    </li>`).join('');
}

historyList.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  current = history[li.dataset.index].res;
  expression = ''; justEvaled = true;
  updateDisplay();
  historyPanel.classList.remove('open');
});

clearHistBtn.addEventListener('click', () => {
  history = []; localStorage.removeItem('calc-history'); renderHistory();
});

histToggle.addEventListener('click', () => historyPanel.classList.toggle('open'));

// ── SCIENTIFIC TOGGLE ────────────────────────────────────
sciToggle.addEventListener('click', () => {
  sciButtons.classList.toggle('open');
  sciToggle.classList.toggle('active');
});

// ── THEME TOGGLE ─────────────────────────────────────────
themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const icon = document.getElementById('themeIcon');
  if (isDark) {
    // sun icon
    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  } else {
    // moon icon
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
});

// ── BUTTON CLICKS ────────────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    addRipple(btn, e);
    const val    = btn.dataset.value;
    const action = btn.dataset.action;
    const sci    = btn.dataset.sci;

    if (sci) { handleSci(sci); return; }

    if (action === 'clear')       { sounds.clear();  clearAll(); }
    else if (action === 'delete') { sounds.delete(); deleteLast(); }
    else if (action === 'equals') { calculate(); }
    else if (val === '.')         { sounds.digit();  inputDecimal(); }
    else if (val === '+/-')       { sounds.digit();  toggleSign(); }
    else if (val === '%')         { sounds.op();     inputPercent(); }
    else if (isOp(val))           { sounds.op();     inputOperator(val); }
    else                          { sounds.digit();  inputDigit(val); }
  });
});

// ── KEYBOARD ─────────────────────────────────────────────
const keyMap = {
  '0':'0','1':'1','2':'2','3':'3','4':'4',
  '5':'5','6':'6','7':'7','8':'8','9':'9',
  '.':'.', '+':'+', '-':'-', '*':'*', '/':'/', '%':'%',
  'Enter':'=', '=':'=', 'Backspace':'⌫', 'Escape':'AC'
};

document.addEventListener('keydown', e => {
  const mapped = keyMap[e.key];
  if (!mapped) return;
  e.preventDefault();

  const btn = [...document.querySelectorAll('.btn')].find(b =>
    b.dataset.value === mapped ||
    (mapped === '⌫' && b.dataset.action === 'delete') ||
    (mapped === 'AC' && b.dataset.action === 'clear') ||
    (mapped === '='  && b.dataset.action === 'equals')
  );
  if (btn) { btn.classList.add('active'); setTimeout(() => btn.classList.remove('active'), 150); }

  if (mapped === 'AC')         { sounds.clear();  clearAll(); }
  else if (mapped === '⌫')     { sounds.delete(); deleteLast(); }
  else if (mapped === '=')     { calculate(); }
  else if (mapped === '.')     { sounds.digit();  inputDecimal(); }
  else if (mapped === '%')     { sounds.op();     inputPercent(); }
  else if (isOp(mapped))       { sounds.op();     inputOperator(mapped); }
  else                         { sounds.digit();  inputDigit(mapped); }
});

// ── INIT ─────────────────────────────────────────────────
renderHistory();
updateDisplay();
