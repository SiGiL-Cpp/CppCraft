// runtime.js — browser-only interactivity for pre-rendered cppcraft pages.
// All content rendering happens at build time (build/build.js).
// This file handles: theme, playground execution, gadget messaging, hljs, fold toggles.

// ─── Constants ────────────────────────────────────────────────────────────────

const GODBOLT_URL     = 'https://godbolt.org/api/compiler/g132/compile';
const GODBOLT_HEADERS = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

// ─── Theme ────────────────────────────────────────────────────────────────────

function getCookie(name) {
  return document.cookie.split('; ').reduce((acc, part) => {
    const [k, v] = part.split('=');
    return k === name ? decodeURIComponent(v) : acc;
  }, null);
}

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀ Light' : '◑ Dark';

  const hljs_link = document.getElementById('hljs-theme');
  if (hljs_link) {
    hljs_link.href = theme === 'dark'
      ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css'
      : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
  }

  broadcastThemeToGadgets(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';
  setCookie('theme', next);
  applyTheme(next);
}

// ─── Gadget theme sync ────────────────────────────────────────────────────────

function broadcastThemeToGadgets(theme) {
  document.querySelectorAll('iframe[data-gadget-src]').forEach(iframe => {
    iframe.contentWindow?.postMessage({ type: 'set-theme', theme }, '*');
  });
}

window.addEventListener('message', (e) => {
  if (e.data?.type === 'gadget-height') {
    const iframe = document.querySelector(`iframe[data-gadget-src="${e.data.src}"]`);
    if (iframe) iframe.style.height = e.data.height + 'px';
  }
});

// ─── ANSI escape code renderer ────────────────────────────────────────────────

function ansiToHtml(text) {
  let html = '';
  let state    = { bold: false, italic: false, fg: null, bg: null };
  let spanOpen = false;

  function escape(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function stateIsDefault(s) { return !s.bold && !s.italic && s.fg === null && s.bg === null; }

  function openSpan() {
    const parts = [];
    if (state.bold)   parts.push('font-weight:600');
    if (state.italic) parts.push('font-style:italic');
    if (state.fg)     parts.push(`color:${state.fg}`);
    if (state.bg)     parts.push(`background:${state.bg}`);
    html += `<span style="${parts.join(';')}">`;
    spanOpen = true;
  }

  function closeSpan() { if (spanOpen) { html += '</span>'; spanOpen = false; } }

  function applyCode(code) {
    if (/^38;2;/.test(code)) { const [,,r,g,b] = code.split(';'); state.fg = `rgb(${r},${g},${b})`; return; }
    if (/^48;2;/.test(code)) { const [,,r,g,b] = code.split(';'); state.bg = `rgb(${r},${g},${b})`; return; }
    switch (code) {
      case '': case '0': state = {bold:false,italic:false,fg:null,bg:null}; break;
      case '1': case '01': state.bold = true; break;
      case '3': state.italic = true; break;
      case '22': state.bold = false; break;
      case '23': state.italic = false; break;
      case '30': state.fg = '#555';    break;
      case '31': state.fg = '#e07060'; break;
      case '32': state.fg = '#5dba8a'; break;
      case '33': state.fg = '#b0a850'; break;
      case '34': state.fg = '#5a9ade'; break;
      case '35': state.fg = '#bb88cc'; break;
      case '36': state.fg = '#5ababa'; break;
      case '37': state.fg = '#cdd4e0'; break;
      case '39': state.fg = null; break;
      case '49': state.bg = null; break;
    }
  }

  const parts = text.split(/\x1b\[([0-9;]*)([mK])/);
  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) { if (parts[i]) html += escape(parts[i]); }
    else if (i % 3 === 1) {
      const params = parts[i], term = parts[i+1]; i++;
      if (term === 'K') continue;
      closeSpan();
      const codes = params.split(';');
      let j = 0;
      while (j < codes.length) {
        if ((codes[j]==='38'||codes[j]==='48') && codes[j+1]==='2') {
          applyCode(codes.slice(j,j+5).join(';')); j += 5;
        } else { applyCode(codes[j]||'0'); j++; }
      }
      if (!stateIsDefault(state)) openSpan();
    }
  }
  closeSpan();
  return html;
}

// ─── SVG Frame Scrubber ───────────────────────────────────────────────────────

function renderSVGFrames(container, rawOutput) {
  container.innerHTML = '';
  const DELIMITER = '---FRAME---';
  const frames    = rawOutput.includes(DELIMITER)
    ? rawOutput.split(DELIMITER).map(s => s.trim()).filter(Boolean)
    : [rawOutput];

  const display = document.createElement('div');
  display.className = 'svg-display';
  display.innerHTML = frames[0];
  container.appendChild(display);

  if (frames.length > 1) {
    const wrap  = document.createElement('div');
    wrap.className = 'svg-scrubber';
    const label = document.createElement('span');
    label.className   = 'svg-frame-label';
    label.textContent = `Frame 1 / ${frames.length}`;
    const slider = document.createElement('input');
    slider.type = 'range'; slider.min = 0; slider.max = frames.length - 1; slider.value = 0;
    slider.addEventListener('input', () => {
      const i = parseInt(slider.value);
      display.innerHTML = frames[i];
      label.textContent = `Frame ${i+1} / ${frames.length}`;
    });
    wrap.appendChild(slider);
    wrap.appendChild(label);
    container.appendChild(wrap);
  }
}

// ─── Playground ───────────────────────────────────────────────────────────────

function initPlaygrounds() {
  document.querySelectorAll('.playground-editor').forEach(editor => {
    const box      = editor.closest('.box-playground, .box');
    const output   = box.querySelector('.playground-output');
    const svgDisp  = box.querySelector('.playground-svg');
    const runBtn   = box.querySelector('.playground-run');
    const clearBtn = box.querySelector('.playground-clear');

    const bpBefore = decodeURIComponent(editor.dataset.bpBefore || '');
    const bpAfter  = decodeURIComponent(editor.dataset.bpAfter  || '');

    // Tab key inserts 4 spaces instead of moving focus
    editor.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      e.preventDefault();
      const start = editor.selectionStart;
      const end   = editor.selectionEnd;
      if (!e.shiftKey) {
        editor.value = editor.value.slice(0, start) + '    ' + editor.value.slice(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
      } else {
        const textBeforeCursor = editor.value.slice(0, start);
        if(const spaceMatch = textBeforeCursor.match(/ {1,4}$/)){
          const spacesToDelete = spaceMatch[0].length;
          editor.value = textBeforeCursor.slice(0, -spacesToDelete) + editor.value.slice(end);
          editor.selectionStart = editor.selectionEnd = start - spacesToDelete;
        }
      }
    });

    runBtn.addEventListener('click', async () => {
      output.textContent = 'Compiling…';
      output.className   = 'playground-output';
      svgDisp.style.display = 'none';
      runBtn.disabled = true;

      const fullCode = [bpBefore, editor.value, bpAfter].join('\n');

      try {
        const res  = await fetch(GODBOLT_URL, {
          method: 'POST', headers: GODBOLT_HEADERS,
          body: JSON.stringify({
            source: fullCode,
            options: {
              userArguments:     '-std=c++23 -finput-charset=UTF-8',
              executeParameters: { args: '', stdin: '' },
              compilerOptions:   { executorRequest: true },
              filters:           { execute: true },
              tools: [], libraries: [],
            },
          }),
        });

        const data       = await res.json();
        const execResult = data.execResult || data;
        const buildFailed = execResult.buildResult?.code !== 0;
        const compileErr  = execResult.buildResult?.stderr?.map(l => l.text).join('\n').trim() || '';
        const stdout      = execResult.stdout?.map(l => l.text).join('\n').trim() || '';
        const stderr      = execResult.stderr?.map(l => l.text).join('\n').trim() || '';

        if (buildFailed && compileErr) {
          output.innerHTML = ansiToHtml(compileErr);
          output.className = 'playground-output error';
        } else if (stdout.startsWith('<svg')) {
          renderSVGFrames(svgDisp, stdout);
          svgDisp.style.display = 'block';
          output.style.display  = 'none';
        } else {
          output.style.display = 'block';
          const combined = stdout + (stderr ? '\n--- stderr ---\n' + stderr : '') || '(no output)';
          output.innerHTML = ansiToHtml(combined);
          output.className = 'playground-output';
        }
      } catch (err) {
        output.textContent = 'Network error: ' + err.message;
        output.className   = 'playground-output error';
      }
      runBtn.disabled = false;
    });

    clearBtn.addEventListener('click', () => {
      output.textContent       = '—';
      output.className         = 'playground-output';
      output.style.display     = 'block';
      svgDisp.style.display    = 'none';
      svgDisp.innerHTML        = '';
    });
  });
}

// ─── Foldable section toggle labels ──────────────────────────────────────────
// Build time emits static ▸/▾ — wire up live toggle so the arrow updates.

function initFoldingSections() {
  document.querySelectorAll('.section-fold').forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary) return;
    const text = summary.textContent.replace(/^[▸▾]\s*/, '');
    const arrow = () => details.open ? '▾ ' : '▸ ';
    summary.textContent = arrow() + text;
    details.addEventListener('toggle', () => {
      summary.textContent = arrow() + text;
    });
  });

  document.querySelectorAll('.box-foldable').forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary) return;
    const text = summary.textContent.replace(/^[▸▾]\s*/, '');
    const arrow = () => details.open ? '▾ ' : '▸ ';
    summary.textContent = arrow() + text;
    details.addEventListener('toggle', () => {
      summary.textContent = arrow() + text;
    });
  });
}

// ─── Syntax highlighting ──────────────────────────────────────────────────────

function initHighlighting() {
  if (typeof hljs === 'undefined') return;
  document.querySelectorAll('pre code[class^="language-"]').forEach(block => {
    hljs.highlightElement(block);
  });
}

// ─── Gadget iframe theme correction ──────────────────────────────────────────
// Build time emits ?theme=dark; correct it on load if the saved theme differs.

function initGadgets(theme) {
  document.querySelectorAll('iframe[data-gadget-src]').forEach(iframe => {
    const base = iframe.dataset.gadgetSrc;
    const sep  = base.includes('?') ? '&' : '?';
    iframe.src = `${base}${sep}theme=${theme}`;
  });
}

// ─── Page init ────────────────────────────────────────────────────────────────

function initPage() {
  const saved     = getCookie('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const theme     = saved || preferred;

  applyTheme(theme);
  initGadgets(theme);
  initPlaygrounds();
  initFoldingSections();
  initHighlighting();
}
