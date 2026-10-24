// html.mjs - tiny HTML helpers for the Hashables static build. Every URL a page prints is RELATIVE to that page,
// so dist/ serves from any directory (a GitHub Pages subpath included) with no rewrite step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/image-manifest.json'), 'utf8'));

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// an HTML fragment authored in this repo (content files): trusted, passed through
export const raw = (s) => String(s ?? '');

let CUR = '/';
export const setPage = (route) => { CUR = route; };
export const page = () => CUR;

/** site-root path ('/find-us/', '/assets/x.webp', '/#flavors') -> path relative to the current page */
export function u(target) {
  if (/^(https?:|mailto:|tel:|#|data:)/.test(target)) return target;
  const [p, hash = ''] = target.split('#');
  const from = CUR.replace(/[^/]*$/, '').split('/').filter(Boolean);
  const to = p.split('/').filter(Boolean);
  let i = 0;
  while (i < from.length && i < to.length && from[i] === to[i] && !(i === to.length - 1 && !p.endsWith('/'))) i++;
  let r = '../'.repeat(from.length - i) + to.slice(i).join('/');
  if (p.endsWith('/') && to.length > i) r += '/';
  if (!r) r = './';
  return r + (hash ? '#' + hash : '');
}

/** responsive <img> for a generated still (src/content/image-manifest.json) */
export function gen(key, { alt = '', sizes = '100vw', cls = '', eager = false, style = '' } = {}) {
  const m = MANIFEST[key];
  if (!m) throw new Error('no image ' + key);
  const set = m.sizes.map(([w]) => `${u('/assets/img/gen/' + key + '-' + w + '.webp')} ${w}w`).join(', ');
  const [w, h] = m.sizes[0];
  const fallback = u('/assets/img/gen/' + key + '-' + (m.sizes.find(([x]) => x <= 1600) || m.sizes[0])[0] + '.webp');
  return `<img src="${fallback}" srcset="${set}" sizes="${esc(sizes)}" width="${w}" height="${h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''} ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'} data-ai="generated">`;
}
export const genUrl = (key, w = 1600) => u('/assets/img/gen/' + key + '-' + w + '.webp');

/** a transparent cube-stack cut-out (the client's own product art) */
export const CUBE_SIZE = {};
// sm: the 220 px thumbnail from tools/thumbs.py (menus show the stacks at ~56-64 px)
export function cubes(slug, { alt = '', cls = 'cubes', eager = false, sm = false } = {}) {
  const [file, w, h] = sm ? ['-sm.webp', 220, 184] : ['.webp', 660, 552];
  return `<img src="${u('/assets/img/cut/cubes-' + slug + file)}" width="${w}" height="${h}" alt="${esc(alt)}" class="${cls}" ${eager ? 'decoding="async"' : 'loading="lazy" decoding="async"'}>`;
}

export const attrs = (o) => Object.entries(o).filter(([, v]) => v !== false && v != null).map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`)).join(' ');
export const icon = (name) => `<svg class="ico" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
export const jsonld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
