#!/usr/bin/env node
// build.js — pre-renders every pages/*.md into a complete HTML file.
// Run: node build/build.js
// Output: one .html file per .md file, written alongside the source.

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const require   = createRequire(import.meta.url);
const marked    = require('marked');
const jsyaml    = require('js-yaml');

// ─── Box defaults ─────────────────────────────────────────────────────────────

const BOX_DEFAULTS = {
  illus:      '↩ Illustration',
  pitfall:    '⚠ Pitfall',
  aside:      '◎ Aside',
  principle:  '→ Principle',
  recap:      'ℹ Recap',
  playground: '⌨ Exercise',
  gadget:     '◈ Interactive',
};

// ─── String-based HTML builders ───────────────────────────────────────────────
// These mirror lesson.js but emit HTML strings instead of DOM nodes.

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function wrapBox(type, label, bodyHtml, fold) {
  const labelText = escHtml(label);
  if (fold) {
    const open = fold === 'open' ? ' open' : '';
    return `<details class="box box-${type} box-foldable"${open}>
<summary class="box-label">▸ ${labelText}</summary>
<div class="box-body">${bodyHtml}</div>
</details>`;
  }
  return `<div class="box box-${type}">
<div class="box-label">${labelText}</div>
<div class="box-body">${bodyHtml}</div>
</div>`;
}

function makeBox(type, label, rawContent, fold) {
  const bodyHtml = marked.parse(rawContent.trim());
  return wrapBox(type, label, bodyHtml, fold);
}

function makePlayground(rawContent, title, fold) {
  let config;
  try { config = jsyaml.load(rawContent); } catch { config = {}; }

  const label       = title || (BOX_DEFAULTS.playground + (config.id ? ` — ${config.id}` : ''));
  const defaultCode = (config.default_code || '').trimEnd();
  const heightStyle = config.height ? ` style="min-height:${config.height}px"` : '';

  // Encode boilerplate parts as data attributes so runtime JS can read them
  const bpBefore = encodeURIComponent(config.boilerplate_before || '');
  const bpAfter  = encodeURIComponent(config.boilerplate_after  || '');

  const content = `<textarea class="playground-editor" spellcheck="false"${heightStyle}
data-bp-before="${bpBefore}"
data-bp-after="${bpAfter}">${escHtml(defaultCode)}</textarea>
<div class="playground-controls">
  <button class="playground-run">Run</button>
  <button class="playground-clear">Clear output</button>
</div>
<div class="playground-output">—</div>
<div class="playground-svg" style="display:none"></div>`;

  return wrapBox('playground', label, content, fold);
}

function makeGadget(rawContent, title, fold) {
  let config;
  try { config = jsyaml.load(rawContent); } catch { config = {}; }

  const theme  = 'dark'; // build-time default; runtime JS will correct on load
  const src    = `${config.src}?theme=${theme}`;
  const height = config.height || 400;

  const content = `<iframe src="${escHtml(src)}"
  style="width:100%;height:${height}px;border:none;display:block"
  data-gadget-src="${escHtml(config.src)}"></iframe>`;

  return wrapBox('gadget', title || BOX_DEFAULTS.gadget, content, fold);
}

// ─── Box dispatch ─────────────────────────────────────────────────────────────

const BOX_TYPES = {
  illus:      (c, t, f) => makeBox('illus',     t || BOX_DEFAULTS.illus,     c, f),
  pitfall:    (c, t, f) => makeBox('pitfall',   t || BOX_DEFAULTS.pitfall,   c, f),
  aside:      (c, t, f) => makeBox('aside',     t || BOX_DEFAULTS.aside,     c, f),
  principle:  (c, t, f) => makeBox('principle', t || BOX_DEFAULTS.principle, c, f),
  recap:      (c, t, f) => makeBox('recap',     t || BOX_DEFAULTS.recap,     c, f),
  playground: (c, t, f) => makePlayground(c, t, f),
  gadget:     (c, t, f) => makeGadget(c, t, f),
};

// ─── marked configuration ─────────────────────────────────────────────────────

marked.use({
  renderer: {
    heading(text, level) {
      let fold = null, clean = text;
      if (/^(&gt;|>)\s*/.test(text)) { fold = 'closed'; clean = text.replace(/^(&gt;|>)\s*/, ''); }
      else if (/^(&lt;|<)\s*/.test(text)) { fold = 'open'; clean = text.replace(/^(&lt;|<)\s*/, ''); }
      const plain = clean.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, '');
      const id    = plain.toLowerCase().replace(/[^\w]+/g, '-');
      const attr  = fold ? ` data-fold="${fold}"` : '';
      return `<h${level} id="${id}"${attr}>${clean}</h${level}>\n`;
    },
    code(code, infostring) {
      const info = (infostring || '').trim();
      const candidates = [':', '>', '<'].map(ch => ({ ch, i: info.indexOf(ch) })).filter(x => x.i !== -1).sort((a,b) => a.i - b.i);
      const sep   = candidates.length ? candidates[0] : null;
      const lang  = sep ? info.slice(0, sep.i).trim() : info;
      const title = sep ? info.slice(sep.i + 1).trim() : '';
      const fold  = sep && sep.ch !== ':' ? (sep.ch === '>' ? 'closed' : 'open') : null;

      // Box types: render immediately as HTML, not as <pre><code>
      if (BOX_TYPES[lang]) {
        return BOX_TYPES[lang](code, title || '', fold);
      }

      // Regular code block — emit pre/code for hljs to pick up at runtime
      const body      = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const titleAttr = title ? ` data-title="${title.replace(/"/g,'&quot;')}"` : '';
      const foldAttr  = fold  ? ` data-fold="${fold}"` : '';
      return `<pre><code class="language-${lang}"${titleAttr}${foldAttr}>${body}\n</code></pre>\n`;
    }
  }
});

// ─── Front-matter parser ──────────────────────────────────────────────────────

function parseFrontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: text };
  let meta = {};
  try { meta = jsyaml.load(match[1]) || {}; } catch {}
  return { meta, body: text.slice(match[0].length) };
}

// ─── Post-processor: foldable section headings ────────────────────────────────
// The marked heading renderer emits data-fold attributes on headings;
// this function wraps them and their content in <details> elements.
// We work on the raw HTML string using a simple state machine rather than
// a DOM, since we're in Node without jsdom.

function mountFoldingSections(html) {
  // Extract <pre> blocks first so their internal whitespace is never touched.
  const preBlocks = [];
  const withPlaceholders = html.replace(/<pre[\s\S]*?<\/pre>/g, match => {
    preBlocks.push(match);
    return `\x00PRE${preBlocks.length - 1}\x00`;
  });

  // Split into tokens at top-level tag boundaries.
  const tokens = withPlaceholders
    .replace(/>\s*</g, '>\n<')
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const result = [];
  let i = 0;

  function foldLevel(tok) {
    const m = tok.match(/^<h([23456])[^>]*data-fold="(open|closed)"[^>]*>/);
    return m ? parseInt(m[1]) : 0;
  }

  function headingLevel(tok) {
    const m = tok.match(/^<h([23456])[\s>]/);
    return m ? parseInt(m[1]) : 0;
  }

  function headingText(tok) {
    return tok.replace(/<[^>]+>/g, '');
  }

  while (i < tokens.length) {
    const tok   = tokens[i];
    const level = foldLevel(tok);

    if (!level) { result.push(tok); i++; continue; }

    const foldMatch = tok.match(/data-fold="(open|closed)"/);
    const isOpen    = foldMatch && foldMatch[1] === 'open';
    const text      = headingText(tok);
    const id        = tok.match(/id="([^"]+)"/)?.[1] || '';

    // Collect body tokens until next heading of same or higher level
    const body = [];
    i++;
    while (i < tokens.length) {
      const l = headingLevel(tokens[i]);
      if (l > 0 && l <= level) break;
      body.push(tokens[i]);
      i++;
    }

    const openAttr = isOpen ? ' open' : '';
    result.push(
      `<details class="section-fold section-fold-h${level}"${openAttr}>`,
      `<summary class="section-fold-summary h${level}-summary">▸ ${text}</summary>`,
      `<h${level} id="${id}" style="display:none"></h${level}>`,
      `<div class="section-fold-body">`,
      ...body,
      `</div>`,
      `</details>`
    );
  }

  // Restore pre blocks with their original content intact
  return result.join('\n')
    .replace(/\x00PRE(\d+)\x00/g, (_, idx) => preBlocks[parseInt(idx)]);
}

// ─── Page nav ─────────────────────────────────────────────────────────────────

function buildPageNav(meta) {
  const prev = meta.prev
    ? `<a href="${meta.prev}.html" class="page-nav-link page-nav-prev">‹ Previous</a>`
    : `<span class="page-nav-link page-nav-disabled">‹ Previous</span>`;
  const next = meta.next
    ? `<a href="${meta.next}.html" class="page-nav-link page-nav-next">Next ›</a>`
    : `<span class="page-nav-link page-nav-disabled">Next ›</span>`;
  return `<nav class="page-nav">${prev}${next}</nav>`;
}

// ─── HTML shell ───────────────────────────────────────────────────────────────

function buildShell(meta, articleHtml, navHtml) {
  const title = meta.title ? escHtml(meta.title) : 'cppcraft';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="lesson.css">
  <link id="hljs-theme" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
</head>
<body>
  <header class="site-header">
    <nav class="lesson-nav" id="lesson-nav"></nav>
    <button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()">◑ Dark</button>
  </header>
  <div id="lesson-root">
    <article class="lesson">
      ${articleHtml}
    </article>
    ${navHtml}
  </div>
  <script src="runtime.js"></script>
  <script>initPage();</script>
</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const pagesDir = join(ROOT, 'pages');
const outDir   = ROOT;  // HTML files go to repo root, md sources stay in pages/
const files    = readdirSync(pagesDir).filter(f => f.endsWith('.md'));

for (const file of files) {
  const mdPath   = join(pagesDir, file);
  const htmlPath = join(outDir, file.replace(/\.md$/, '.html'));
  const raw      = readFileSync(mdPath, 'utf8');

  const { meta, body } = parseFrontMatter(raw);
  let articleHtml      = marked.parse(body);
  articleHtml          = mountFoldingSections(articleHtml);

  const navHtml  = buildPageNav(meta);
  const fullHtml = buildShell(meta, articleHtml, navHtml);

  writeFileSync(htmlPath, fullHtml, 'utf8');
  console.log(`✓  ${file} → ${file.replace('.md', '.html')}`);
}

console.log(`\nBuilt ${files.length} page(s).`);
