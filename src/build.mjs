// build.mjs - render the Hashables redesign into dist/. Node builtins only.
//   node src/build.mjs [--strict]      (--strict: exit 1 on any banned word, missing asset or empty page)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setPage } from './lib/html.mjs';
import { home } from './pages/home.mjs';
import { hub, line, sku } from './pages/gummies.mjs';
import { findUs, ourStory, faqs, lab, press, contact, careers, privacy, accessibility, notFound } from './pages/info.mjs';
import { blogIndex, article } from './pages/blog.mjs';
import { FLAVORS, flavorUrl, lineUrl } from './content/flavors.mjs';
import { SITE } from './content/site.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const strict = process.argv.includes('--strict');
const faqDoc = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/faq.json'), 'utf8'));
const blog = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/blog.json'), 'utf8'));
const faq = faqDoc.faq;

// home-page FAQ teaser: the questions Nova named first (store near me, the effect, live rosin, the flavors)
const flat = faq.topics.flatMap((t) => t.items);
const pick = (re) => flat.findIndex((q) => re.test(q.q));
const pickFaq = [/near me|where can i (buy|find)/i, /effect|feel/i, /live rosin/i, /prickly pear/i].map(pick).filter((i, n, a) => i >= 0 && a.indexOf(i) === n);
while (pickFaq.length < 4) { const i = flat.findIndex((_, k) => !pickFaq.includes(k)); pickFaq.push(i); }

const pages = [];
const add = (route, fn) => pages.push({ route, fn });
add('/', () => home({ faq, blog, pickFaq }));
add('/live-rosin-gummies/', hub);
for (const k of ['core', 'specialty', 'limited']) add(lineUrl(k), () => line(k));
for (const f of FLAVORS) add(flavorUrl(f), () => sku(f));
add('/find-us/', findUs);
add('/our-story/', ourStory);
add('/faqs/', () => faqs(faq));
add('/lab-results/', () => lab(faqDoc.lab));
add('/press/', press);
add('/contact/', contact);
add('/careers/', careers);
add('/privacy-policy/', privacy);
add('/accessibility/', accessibility);
add('/blog/', () => blogIndex(blog));
for (const a of blog.articles) add('/blog/' + a.slug + '/', () => article(a, blog));
add('/404.html', notFound);

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
const problems = [];
// generic phrases the copy must never use; tools/banned-words.txt (workspace only) adds the names of other brands
const BANNED = [/feel the rush/i, /good tides?\b/i, /lorem ipsum/i, /\bTODO\b/, /\bTBD\b/];
const extra = path.join(ROOT, 'tools/banned-words.txt');
if (fs.existsSync(extra)) for (const w of fs.readFileSync(extra, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#'))) BANNED.push(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s?'), 'i'));
for (const p of pages) {
  setPage(p.route);
  const html = p.fn();
  const file = p.route.endsWith('/') ? path.join(DIST, p.route, 'index.html') : path.join(DIST, p.route);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  for (const re of BANNED) if (re.test(html)) problems.push(`${p.route}: banned ${re}`);
  if (text.replace(/\s+/g, ' ').length < 800) problems.push(`${p.route}: suspiciously little text`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) problems.push(`${p.route}: ${(html.match(/<h1[\s>]/g) || []).length} h1`);
}

// assets
const copyDir = (from, to) => { fs.mkdirSync(to, { recursive: true }); for (const e of fs.readdirSync(from, { withFileTypes: true })) { const s = path.join(from, e.name), d = path.join(to, e.name); if (e.isDirectory()) copyDir(s, d); else if (!/\.(png)$/i.test(e.name) || from.includes('brand')) fs.copyFileSync(s, d); } };
copyDir(path.join(ROOT, 'src/assets'), path.join(DIST, 'assets'));
fs.copyFileSync(path.join(ROOT, 'src/styles/site.css'), path.join(DIST, 'assets/site.css'));
fs.copyFileSync(path.join(ROOT, 'src/scripts/site.js'), path.join(DIST, 'assets/site.js'));

// every local reference must exist
for (const p of pages) {
  const file = p.route.endsWith('/') ? path.join(DIST, p.route, 'index.html') : path.join(DIST, p.route);
  const html = fs.readFileSync(file, 'utf8');
  const refs = [...html.matchAll(/(?:href|src|poster|data-src-sm|data-src-lg)="([^"#?]+)/g), ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => [null, s.trim().split(/\s+/)[0]]))].map((m) => m[1]);
  for (const r of refs) {
    if (/^(https?:|mailto:|tel:|data:)/.test(r)) continue;
    let t = path.resolve(path.dirname(file), r);
    if (r.endsWith('/') || fs.existsSync(t) && fs.statSync(t).isDirectory()) t = path.join(t, 'index.html');
    if (!fs.existsSync(t)) problems.push(`${p.route}: missing ${r}`);
  }
}

// SEO files for the production site (the noindex preview overrides robots.txt)
const urls = pages.filter((p) => p.route !== '/404.html').map((p) => `  <url><loc>${SITE.url}${p.route}</loc></url>`).join('\n');
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);

const size = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? size(path.join(d, e.name)) : fs.statSync(path.join(d, e.name)).size), 0);
console.log(`built ${pages.length} pages, dist ${(size(DIST) / 1048576).toFixed(1)} MB, ${problems.length} problems`);
for (const x of problems.slice(0, 40)) console.log('  -', x);
if (strict && problems.length) process.exitCode = 1;
