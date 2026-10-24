// html.mjs - tiny HTML helpers for the Hashables static build. Every URL a page prints is RELATIVE to that page,
// so dist/ serves from any directory (a GitHub Pages subpath included) with no rewrite step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/image-manifest.json'), 'utf8'));
// the client's own photography, packaging art and brand backgrounds (tools/brand-assets.py)
const BRAND = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/photo-manifest.json'), 'utf8'));

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

const load = (eager) => (eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"');
const srcset = (base, dims) => dims.map(([w]) => `${u(base + w + '.webp')} ${w}w`).join(', ');

/** responsive <img> for a still: the client's own photography and brand art (photo-manifest.json) or one of the few
    generated stills left (image-manifest.json, marked data-ai); `pos` is the object-position of a cover crop */
export function pic(key, { alt = '', sizes = '100vw', cls = '', eager = false, style = '', pos = '' } = {}) {
  const ai = MANIFEST[key], m = ai || BRAND.photos[key];
  if (!m) throw new Error('no image ' + key);
  const base = (ai ? '/assets/img/gen/' : '/assets/img/photo/') + key + '-';
  const [w, h] = m.sizes[0];
  const fallback = u(base + (m.sizes.find(([x]) => x <= 1600) || m.sizes[0])[0] + '.webp');
  const st = [style, pos && `object-position:${pos}`].filter(Boolean).join(';');
  return `<img src="${fallback}" srcset="${srcset(base, m.sizes)}" sizes="${esc(sizes)}" width="${w}" height="${h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''}${st ? ` style="${st}"` : ''} ${load(eager)}${ai ? ' data-ai="generated"' : ''}>`;
}

/** site-root path of a still at the largest stored width up to `max` (share images, structured data) */
export function picPath(key, max = 1600) {
  const ai = MANIFEST[key], m = ai || BRAND.photos[key];
  if (!m) throw new Error('no image ' + key);
  const w = (m.sizes.find(([x]) => x <= max) || m.sizes[m.sizes.length - 1])[0];
  return (ai ? '/assets/img/gen/' : '/assets/img/photo/') + key + '-' + w + '.webp';
}

/** the HSH26 packaging art of a flavor: its square menu tile (logo, stack, name and badge on the flavor's swirl) */
export function pack(slug, { alt = '', sizes = '340px', cls = 'pack', eager = false } = {}) {
  const d = BRAND.pack.tile;
  return `<img src="${u(`/assets/img/pack/${slug}-340.webp`)}" srcset="${srcset(`/assets/img/pack/${slug}-`, d)}" sizes="${esc(sizes)}" width="${d[0][0]}" height="${d[0][1]}" alt="${esc(alt)}" class="${cls}" ${load(eager)}>`;
}
/** the flavors whose HSH26 mylar bag render was supplied (brand folder, 2026-10-25) */
export const HAS_BAG = new Set(['electric-grape', 'peachy-mango', 'watermelon-jolt']);
export function bag(slug, { alt = '', sizes = '480px', cls = 'bag', eager = false } = {}) {
  const d = BRAND.pack.bag;
  return `<img src="${u(`/assets/img/pack/bag-${slug}-${d[1][0]}.webp`)}" srcset="${srcset(`/assets/img/pack/bag-${slug}-`, d)}" sizes="${esc(sizes)}" width="${d[0][0]}" height="${d[0][1]}" alt="${esc(alt)}" class="${cls}" ${load(eager)}>`;
}
/** the three bags fanned as on the HSH26 one-sheet */
export function trio({ alt = 'Hashables Peachy Mango, Watermelon Jolt and Electric Grape in the new mylar bags', sizes = '560px', cls = 'trio', eager = false } = {}) {
  const d = BRAND.pack.trio;
  return `<img src="${u(`/assets/img/pack/bags-trio-${d[1][0]}.webp`)}" srcset="${srcset('/assets/img/pack/bags-trio-', d)}" sizes="${esc(sizes)}" width="${d[0][0]}" height="${d[0][1]}" alt="${esc(alt)}" class="${cls}" ${load(eager)}>`;
}

export const attrs = (o) => Object.entries(o).filter(([, v]) => v !== false && v != null).map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`)).join(' ');
export const icon = (name) => `<svg class="ico" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
export const jsonld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
