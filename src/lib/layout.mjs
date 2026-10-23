// layout.mjs - the page shell: <head>, icon sprite, age gate, header, menu drawer, footer.
import { esc, u, icon, cubes, jsonld } from './html.mjs';
import { SITE, NAV, DRAWER_LINKS, FOOTER } from '../content/site.mjs';
import { FLAVORS, LINES, flavorUrl, lineUrl } from '../content/flavors.mjs';

const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<linearGradient id="g-brand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd85d"/><stop offset=".34" stop-color="#a7f3e4"/><stop offset=".66" stop-color="#ff7ca5"/><stop offset="1" stop-color="#4fe3ff"/></linearGradient>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-out" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="9.5" r="2.5" fill="currentColor"/></symbol>
<symbol id="i-locate" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
<symbol id="i-insta" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></symbol>
<symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></symbol>
<symbol id="i-pause" viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></symbol>
<symbol id="i-trophy" viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5a3.5 3.5 0 0 0 3.6 4M16 6h3.5a3.5 3.5 0 0 1-3.6 4M12 13v4M8.5 20h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-leaf" viewBox="0 0 24 24"><path d="M12 21V11M12 11c0-4 3-7 7-8-1 4-3 7-7 8zM12 14c0-3-2.5-5.5-6-6 .5 3.4 2.6 5.6 6 6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></symbol>
<symbol id="i-snow" viewBox="0 0 24 24"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-press" viewBox="0 0 24 24"><path d="M4 4h16M4 20h16M7 4v4h10V4M7 20v-4h10v4M9 12h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></symbol>
<symbol id="i-drop" viewBox="0 0 24 24"><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></symbol>
<symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" fill="currentColor"/></symbol>
<symbol id="i-cube" viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></symbol>
<symbol id="i-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></symbol>
<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
<symbol id="i-wave" viewBox="0 0 24 24"><path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M7 11c0-3.9 3.1-7 7-7 2.6 0 4.8 1.4 6 3.5-3.2-.6-6 1.8-6 5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-lab" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L4.6 18.2A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.7-2.8L14 9V3M7.5 15h9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
</defs></svg>`;

/** the brush wordmark (Hashables' own vector logo, inlined so its Aldrich sub-line uses the site font) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const LOGO_SVG = fs.readFileSync(path.join(ROOT, 'src/assets/img/brand/hashables-logo.svg'), 'utf8')
  .replace(/<\?xml[^>]*>/, '').replace('<svg ', '<svg role="img" aria-label="Hashables" focusable="false" ');
let logoN = 0;
export function logo(cls = 'logo') {
  // unique ids per inline copy (the SVG declares id="Layer_2" / "Layer_1-2")
  logoN++;
  return LOGO_SVG.replace(/id="([^"]+)"/g, (m, id) => `id="${id}-${logoN}"`).replace('<svg ', `<svg class="${cls}" `);
}

const thumb = (f) => `<a class="dr-flavor" href="${u(flavorUrl(f))}" style="--c:${f.color}">${cubes(f.slug, { cls: 'dr-flavor__img' })}<span>${esc(f.name)}${f.badge ? `<small>${esc(f.badge)}</small>` : ''}</span></a>`;

export function header() {
  return `<header class="hdr" data-hdr>
  <div class="hdr__in">
    <a class="hdr__logo" href="${u('/')}" aria-label="Hashables home">${logo('logo logo--hdr')}</a>
    <nav class="hdr__nav" aria-label="Primary">
      ${NAV.map((n) => `<a href="${u(n.href)}">${esc(n.label)}</a>`).join('')}
    </nav>
    <div class="hdr__act">
      <a class="hdr__find" href="${u('/find-us/')}">${icon('pin')}<span>Find us</span></a>
      <a class="btn btn--sun btn--sm" href="${u('/find-us/')}">Getcha some</a>
      <button class="hdr__menu" type="button" aria-expanded="false" aria-controls="drawer" data-menu-open>${icon('menu')}<span>Menu</span></button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Site menu" hidden data-drawer>
  <div class="drawer__bg" data-menu-close></div>
  <div class="drawer__panel">
    <div class="drawer__top">
      <a href="${u('/')}" class="drawer__logo" aria-label="Hashables home">${logo('logo')}</a>
      <button class="drawer__close" type="button" data-menu-close aria-label="Close menu">${icon('close')}<span>Close</span></button>
    </div>
    <div class="drawer__grid">
      <section class="drawer__gummies" aria-labelledby="dr-g">
        <h2 id="dr-g" class="drawer__h"><a href="${u('/live-rosin-gummies/')}">Gummies ${icon('arrow')}</a></h2>
        ${['core', 'specialty', 'limited'].map((l) => `<div class="drawer__line"><a class="drawer__linehead" href="${u(lineUrl(l))}">${esc(LINES[l].name)}</a><div class="drawer__flavors">${FLAVORS.filter((f) => f.line === l).map(thumb).join('')}</div></div>`).join('')}
      </section>
      <nav class="drawer__links" aria-label="Menu">
        ${DRAWER_LINKS.map((n, i) => `<a href="${u(n.href)}" style="--i:${i}">${esc(n.label)}</a>`).join('')}
        <a href="${SITE.nova}" rel="noopener" style="--i:${DRAWER_LINKS.length}">About Nova Farms ${icon('out')}</a>
      </nav>
    </div>
    <div class="drawer__foot">
      <span>Proudly part of <a href="${SITE.nova}" rel="noopener">Nova Farms</a></span>
      <span class="drawer__social"><a href="${SITE.instagram}" rel="noopener" aria-label="Hashables on Instagram">${icon('insta')}</a><a href="${SITE.twitter}" rel="noopener" aria-label="Hashables on X (Twitter)">${icon('x')}</a></span>
    </div>
  </div>
</div>`;
}

export function footer() {
  const col = (title, items) => `<div class="ftr__col"><h2 class="ftr__h">${esc(title)}</h2><ul>${items.map((n) => `<li><a href="${u(n.href)}">${esc(n.label)}</a></li>`).join('')}</ul></div>`;
  return `<footer class="ftr">
  <div class="ftr__sky" aria-hidden="true"><div class="sun sun--ftr"></div><div class="grid-floor"></div><img class="ftr__palms" src="${u('/assets/img/cut/palms-1600.webp')}" alt="" loading="lazy" width="1600" height="1068"></div>
  <div class="ftr__in wrap">
    <div class="ftr__brand">
      <a href="${u('/')}" aria-label="Hashables home">${logo('logo logo--ftr')}</a>
      <p class="ftr__tag"><span class="script">Tastes like paradise.</span></p>
      <p class="ftr__blurb">Fresh-pressed, solventless hash rosin gummies. New England’s own, from <a href="${SITE.nova}" rel="noopener">Nova Farms</a>.</p>
      <div class="ftr__social"><a href="${SITE.instagram}" rel="noopener" aria-label="Instagram">${icon('insta')}</a><a href="${SITE.twitter}" rel="noopener" aria-label="X (Twitter)">${icon('x')}</a><a href="mailto:${SITE.email}" aria-label="Email Hashables">${icon('mail')}</a></div>
    </div>
    ${col('Explore', FOOTER.explore)}
    ${col('Learn', FOOTER.learn)}
    <div class="ftr__col"><h2 class="ftr__h">Say hey</h2><ul>
      <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
      <li class="ftr__muted">Wholesale: <a href="mailto:${SITE.wholesale}">${SITE.wholesale}</a></li>
      <li><a href="${SITE.apparel}" rel="noopener">Shop apparel ${icon('out')}</a></li>
    </ul></div>
  </div>
  <div class="ftr__legal wrap">
    <p>For use only by adults 21 and older. Keep out of reach of children and pets. Don’t drive or operate machinery after use. The effects of edibles may be delayed by two hours or more.</p>
    <p class="ftr__row"><span>© ${new Date().getFullYear()} Nova Farms – All Rights Reserved.</span><span>${FOOTER.legal.map((n) => `<a href="${u(n.href)}">${esc(n.label)}</a>`).join(' · ')}</span></p>
  </div>
</footer>`;
}

export function ageGate() {
  return `<div class="gate" data-gate hidden role="dialog" aria-modal="true" aria-labelledby="gate-h" aria-describedby="gate-p">
  <div class="gate__bg" aria-hidden="true"><img src="${u('/assets/img/brand/pink-palms-1200.webp')}" alt="" width="1200" height="801"><div class="sun sun--gate"></div><div class="grid-floor grid-floor--gate"></div></div>
  <div class="gate__card glass">
    ${logo('logo logo--gate')}
    <p class="gate__eyebrow">A quick check before the chill</p>
    <h2 id="gate-h" class="gate__h">Paradise is <span>21+</span></h2>
    <p id="gate-p">Are you 21 years of age or older?</p>
    <div class="gate__btns"><button type="button" class="btn btn--sun" data-gate-yes>Yes, I’m 21+</button><a class="btn btn--glass" href="https://www.google.com/" rel="noopener">Not yet</a></div>
    <p class="gate__fine">By entering you confirm you are of legal age to view cannabis content where you live.</p>
  </div>
</div>`;
}

export function shell({ route, title, description, body, ogImage = '/assets/img/gen/s-hero-1600.webp', schema = [], bodyClass = '', head = '' }) {
  const fullTitle = title ? `${title} | Hashables` : 'Hashables | Fresh-Pressed Hash Rosin Gummies';
  const canonical = SITE.url + (route === '/404.html' ? '/' : route);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#1a0b2e">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Hashables">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.url}${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${u('/assets/img/brand/favicon.svg')}" type="image/svg+xml">
<link rel="preload" href="${u('/assets/fonts/aldrich-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${u('/assets/fonts/inter-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${u('/assets/site.css')}">
<script>document.documentElement.classList.add('js');</script>
${head}
${schema.map(jsonld).join('\n')}
</head>
<body class="${bodyClass}">
${SPRITE}
<a class="skip" href="#main">Skip to content</a>
${ageGate()}
${header()}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
<script src="${u('/assets/site.js')}" defer></script>
</body>
</html>
`;
}
