// build/watch.js — watches pages/*.md and rebuilds on change.
// Uses Node's built-in fs.watch, no extra dependencies.
// Run alongside: npx serve -l 8080 .

import { watch } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const pagesDir  = join(ROOT, 'pages');

// Initial build
console.log('Building...');
try {
  execSync('node build/build.js', { cwd: ROOT, stdio: 'inherit' });
} catch {}

console.log(`\nWatching ${pagesDir} for changes. Ctrl+C to stop.\n`);

// Debounce — avoid double-firing on some editors
const pending = new Set();
watch(pagesDir, { recursive: false }, (event, filename) => {
  if (!filename?.endsWith('.md')) return;
  if (pending.has(filename)) return;
  pending.add(filename);
  setTimeout(() => {
    pending.delete(filename);
    console.log(`\n${filename} changed — rebuilding...`);
    try {
      execSync('node build/build.js', { cwd: ROOT, stdio: 'inherit' });
      console.log('Done.\n');
    } catch {}
  }, 100);
});
