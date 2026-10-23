// parts.mjs - shared sections for the Hashables pages ("Paradise Grid": retro surf x synthwave x glass).
import { esc, raw, u, gen, genUrl, cubes, icon, jsonld } from './html.mjs';
import { SITE } from '../content/site.mjs';
import { FLAVORS, LINES, AWARDS, flavorUrl, lineUrl, byLine } from '../content/flavors.mjs';

export const sun = (cls = '') => `<div class="sun ${cls}" aria-hidden="true"></div>`;
export const grid = (cls = '') => `<div class="grid-floor ${cls}" aria-hidden="true"></div>`;

/** wave seam between two bands; `to` is the colour of the band BELOW (it paints the wave) */
export const wave = (to = 'var(--sand)', flip = false, cls = '') => `<div class="seam ${flip ? 'seam--flip' : ''} ${cls}" aria-hidden="true" style="--to:${to}"><svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,64 C160,104 320,112 480,88 C640,64 720,24 880,28 C1040,32 1160,92 1300,96 C1360,98 1410,86 1440,76 L1440,120 L0,120 Z"/><path class="seam__2" d="M0,92 C200,70 360,60 520,76 C700,94 820,112 1000,100 C1160,90 1300,60 1440,64 L1440,120 L0,120 Z"/></svg></div>`;

export const eyebrow = (t, cls = '') => `<p class="eyebrow ${cls}">${raw(t)}</p>`;

export function breadcrumbs(items) {
  // items: [{label, href}] ending with the current page (no href)
  const html = `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((c, i) => `<li>${c.href && i < items.length - 1 ? `<a href="${u(c.href)}">${esc(c.label)}</a>` : `<span aria-current="page">${esc(c.label)}</span>`}</li>`).join('')}</ol></nav>`;
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, ...(c.href ? { item: SITE.url + c.href } : {}) })) };
  return { html, ld };
}

/** inner-page hero: full-bleed photo (or night/sunset ground) + glass pane + optional protruding cube stacks */
export function pageHero({ eyebrow: eb, title, lead = '', img, imgAlt = '', cta = '', crumbs = '', stacks = [], tone = 'dusk', scriptWord = '', align = 'left', short = false }) {
  return `<section class="phero phero--${tone} ${short ? 'phero--short' : ''} phero--${align}" data-parallax-root>
  <div class="clip">
    <div class="phero__media" data-parallax="0.18">${img ? gen(img, { alt: imgAlt, sizes: '100vw', eager: true, cls: 'phero__img' }) : ''}</div>
    <div class="phero__veil" aria-hidden="true"></div>
    ${sun('sun--hero')}${grid('grid-floor--hero')}
  </div>
  <div class="phero__in wrap">
    ${crumbs}
    <div class="phero__pane glass" data-reveal>
      ${eb ? eyebrow(eb) : ''}
      <h1 class="phero__h">${raw(title)}${scriptWord ? ` <span class="script script--neon">${esc(scriptWord)}</span>` : ''}</h1>
      ${lead ? `<p class="phero__lead">${raw(lead)}</p>` : ''}
      ${cta}
    </div>
  </div>
  ${stacks.length ? `<div class="phero__stacks" aria-hidden="true">${stacks.map((s, i) => `<div class="float float--${i}" data-parallax="${(0.08 + i * 0.06).toFixed(2)}">${cubes(s, { cls: 'cubes cubes--float' })}</div>`).join('')}</div>` : ''}
  ${wave('var(--sand)')}
</section>`;
}

export function flavorCard(f, { level = 'h3', big = false } = {}) {
  const L = LINES[f.line];
  return `<article class="fcard ${big ? 'fcard--big' : ''}" style="--c:${f.color};--g:${f.glow}" data-tilt>
  <a class="fcard__link" href="${u(flavorUrl(f))}" aria-label="${esc(f.name)}: view flavor"></a>
  <div class="fcard__bg" aria-hidden="true">${gen(f.scene, { alt: '', sizes: '(min-width: 900px) 30vw, 90vw' })}</div>
  <div class="fcard__glow" aria-hidden="true"></div>
  ${cubes(f.slug, { alt: `A stack of ${f.name} Hashables gummy cubes`, cls: 'cubes fcard__cubes' })}
  <div class="fcard__body">
    <p class="fcard__line">${esc(f.badge || L.short)}</p>
    <${level} class="fcard__name">${esc(f.name)}</${level}>
    <p class="fcard__tag">${esc(f.tagline)}</p>
    <span class="fcard__go">View flavor ${icon('arrow')}</span>
  </div>
</article>`;
}

export function flavorTabs({ id = 'flavors', heading = 'Stacks on stacks <span class="script script--neon">of flavor</span>', lead = '' } = {}) {
  const tabs = [['core', 'Core'], ['specialty', 'Specialty'], ['limited', 'Limited']];
  return `<section class="band band--swirl stack-sec" id="${id}" aria-labelledby="${id}-h">
  <div class="band__bg" aria-hidden="true"><img src="${u('/assets/img/brand/swirl-black-1920.webp')}" alt="" loading="lazy" width="1920" height="1281"></div>
  <div class="wrap">
    <div class="sec-head sec-head--center" data-reveal>
      ${eyebrow('The flavors')}
      <h2 id="${id}-h" class="h2 h2--sun">${heading}</h2>
      ${lead ? `<p class="sec-lead">${raw(lead)}</p>` : ''}
    </div>
    <div class="tabs" data-tabs>
      <div class="tabs__list" role="tablist" aria-label="Flavor lines">
        ${tabs.map(([k, label], i) => `<button type="button" role="tab" id="tab-${id}-${k}" aria-controls="panel-${id}-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(label)} <small>${byLine(k).length}</small></button>`).join('')}
      </div>
      ${tabs.map(([k], i) => `<div class="tabs__panel" role="tabpanel" id="panel-${id}-${k}" aria-labelledby="tab-${id}-${k}" ${i === 0 ? '' : 'hidden'}>
        <p class="tabs__intro">${esc(LINES[k].lead)} <a href="${u(lineUrl(k))}">All ${esc(LINES[k].name.toLowerCase())} ${icon('arrow')}</a></p>
        <div class="fgrid fgrid--${byLine(k).length}">${byLine(k).map((f) => flavorCard(f)).join('')}</div>
      </div>`).join('')}
    </div>
  </div>
  ${wave('var(--sand)')}
</section>`;
}

export const TRUST = [
  { icon: 'press', title: 'Fresh pressed', text: 'Live rosin pressed from fresh frozen flower, never distillate.' },
  { icon: 'drop', title: 'Solventless', text: 'Just ice, water, heat and pressure from plant to rosin.' },
  { icon: 'leaf', title: 'Our own farm flower', text: 'It starts with flower grown on Nova Farms’ own farms.' },
  { icon: 'spark', title: 'Full-spectrum', text: 'A broad cannabinoid and terpene profile, and real flower flavor.' },
  { icon: 'trophy', title: 'Award-winning', text: 'Hash makers with High Times and Harvest Cup hardware.' },
];
export function trustStrip({ heading = 'Fresh. Pressed. <span class="script script--ink">Paradise.</span>', kicker = 'The Hashables standard' } = {}) {
  return `<section class="band band--sand trust" aria-labelledby="trust-h">
  <div class="wrap">
    <div class="sec-head" data-reveal>${eyebrow(kicker)}<h2 id="trust-h" class="h2">${heading}</h2></div>
    <ul class="trust__list">${TRUST.map((t, i) => `<li class="trust__item" data-reveal style="--d:${i * 70}ms"><span class="trust__ico">${icon(t.icon)}</span><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></li>`).join('')}</ul>
  </div>
</section>`;
}

export const STEPS = [
  { n: '01', title: 'Farm flower', text: 'It starts on our farms, with fresh flower from our own harvests.', img: 's-bud', alt: 'Close-up of a frosty cannabis flower on the plant' },
  { n: '02', title: 'Fresh frozen', text: 'Instead of drying and curing, the flower is frozen fresh to hold on to its terpenes and character.', img: 's-frozen', alt: 'Freshly harvested cannabis flowers on crushed ice' },
  { n: '03', title: 'Pressed into live rosin', text: 'Ice water separates the resin, then gentle heat and pressure turn it into solventless hash rosin.', img: 's-rosin', alt: 'A small mound of freshly pressed hash rosin on parchment' },
  { n: '04', title: 'Stacked into flavor', text: 'Full-spectrum rosin meets flavor in a sugar-dusted cube. Stacks on stacks of it.', cube: 'tropical-typhoon', alt: 'A stack of Tropical Typhoon gummy cubes' },
];
export function processSteps({ heading = 'From our farm to <span class="script script--ink">fresh pressed</span>', id = 'process' } = {}) {
  return `<section class="band band--sand process" id="${id}" aria-labelledby="${id}-h">
  <div class="wrap">
    <div class="sec-head" data-reveal>${eyebrow('How Hashables are made')}<h2 id="${id}-h" class="h2">${heading}</h2>
      <p class="sec-lead">Plenty of gummies start with distillate. Ours start with flower from our own farms, frozen fresh and pressed into solventless live rosin. That’s why Hashables taste like real flower, not just sugar.</p></div>
    <ol class="steps">${STEPS.map((s, i) => `<li class="step" data-reveal style="--d:${i * 90}ms">
      <div class="step__media">${s.img ? gen(s.img, { alt: s.alt, sizes: '(min-width: 1000px) 24vw, (min-width: 640px) 45vw, 90vw' }) : `<div class="step__cube">${cubes(s.cube, { alt: s.alt })}</div>`}</div>
      <span class="step__n">${s.n}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol>
  </div>
</section>`;
}

export function videoBlock() {
  return `<div class="yt" data-yt="${SITE.video}">
  <button type="button" class="yt__btn" aria-label="Play the video: What are Hashables?">
    <img src="${u('/assets/img/brand/what-are-hashables.webp')}" alt="" width="1080" height="579" loading="lazy">
    <span class="yt__play">${icon('play')}</span><span class="yt__label">What are Hashables?</span>
  </button>
</div>`;
}

export function awardsBand({ id = 'awards' } = {}) {
  const items = [AWARDS.hc23, AWARDS.ht23, AWARDS.ht22];
  return `<section class="band band--dusk awards" id="${id}" aria-labelledby="${id}-h">
  ${sun('sun--awards')}${grid('grid-floor--awards')}
  <div class="wrap awards__in">
    <div class="awards__head" data-reveal>
      ${eyebrow('Award-winning hash makers')}
      <h2 id="${id}-h" class="h2 h2--sun">Hardware on <span class="script script--neon">the shelf</span></h2>
      <p class="sec-lead sec-lead--light">Award-winning hash is the base of every gummy we make. A few highlights from the trophy case:</p>
      <img class="awards__badges" src="${u('/assets/img/brand/awards-badges.webp')}" alt="Hashables award badges: 1st Place Edible, MJ Unpacked, and High Times Cannabis Cup Winner" width="800" height="366" loading="lazy">
    </div>
    <ul class="awards__list">${items.map((a, i) => `<li class="award glass" data-reveal style="--d:${i * 90}ms" data-tilt>
      <span class="award__year">${esc(a.year)}</span>
      <p class="award__place">${icon('trophy')} ${esc(a.place)}</p>
      <h3 class="award__product">${esc(a.product)}</h3>
      <p class="award__title">${esc(a.title)}</p>
      <a class="award__src" href="${a.href}" rel="noopener">Source: ${esc(a.source)} ${icon('out')}</a>
    </li>`).join('')}</ul>
  </div>
</section>`;
}

export function finderBand({ heading = 'Getcha <span class="script script--neon">some</span>', lead = 'Hashables are sold at licensed dispensaries. Use your location or type the town you’re in. No ZIP code needed.' } = {}) {
  return `<section class="band band--palms finder-band" aria-labelledby="fb-h">
  <div class="band__bg" aria-hidden="true"><img src="${u('/assets/img/brand/pink-palms-2146.webp')}" alt="" loading="lazy" width="2146" height="1432"></div>
  <div class="wrap finder-band__in">
    <div class="finder-band__pane glass glass--strong" data-reveal>
      ${eyebrow('Store finder')}
      <h2 id="fb-h" class="h2">${heading}</h2>
      <p>${raw(lead)}</p>
      <form class="finder-mini" action="${u('/find-us/')}" method="get" data-finder-mini>
        <button type="button" class="btn btn--sun" data-locate>${icon('locate')} Use my location</button>
        <label class="finder-mini__field"><span class="sr">Town or city</span>${icon('search')}<input name="town" type="text" inputmode="search" autocomplete="address-level2" placeholder="Or type a town, e.g. Worcester"></label>
        <button type="submit" class="btn btn--glass">Find</button>
      </form>
      <p class="fine">Availability may vary. Please check the dispensary’s live menu for the latest offerings.</p>
    </div>
    <div class="finder-band__stack" aria-hidden="true"><div class="float float--a" data-parallax="0.12">${cubes('watermelon-jolt', { cls: 'cubes cubes--float' })}</div><div class="float float--b" data-parallax="0.2">${cubes('lemon-burst', { cls: 'cubes cubes--float' })}</div></div>
  </div>
</section>`;
}

export function faqMini(faq, ids, { heading = 'Questions, <span class="script script--ink">answered</span>' } = {}) {
  const all = faq.topics.flatMap((t) => t.items);
  const picks = ids.map((i) => all[i]).filter(Boolean);
  return `<section class="band band--sand faqmini" aria-labelledby="faqm-h">
  <div class="wrap faqmini__in">
    <div class="sec-head" data-reveal>${eyebrow('FAQ')}<h2 id="faqm-h" class="h2">${heading}</h2><p class="sec-lead">The questions we hear most, from what live rosin is to where to find a stack near you.</p><a class="btn btn--ink" href="${u('/faqs/')}">All FAQs ${icon('arrow')}</a></div>
    <div class="acc" data-reveal>${picks.map((q) => `<details class="acc__item"><summary>${esc(q.q)}<span class="acc__ico">${icon('chev')}</span></summary><div class="acc__body">${relink(q.a)}</div></details>`).join('')}</div>
  </div>
</section>`;
}

/** content HTML authored with site-root hrefs ("/find-us/") -> relative to the current page */
export const relink = (html) => String(html).replace(/href="(\/[^"]*)"/g, (m, p) => `href="${u(p)}"`);

export function blogCards(articles, { heading = 'Fresh from <span class="script script--ink">the blog</span>', limit = 3, more = true } = {}) {
  return `<section class="band band--sand blogrow" aria-labelledby="blog-h">
  <div class="wrap">
    <div class="sec-head sec-head--row" data-reveal><div>${eyebrow('Learn')}<h2 id="blog-h" class="h2">${heading}</h2></div>${more ? `<a class="btn btn--ink" href="${u('/blog/')}">All articles ${icon('arrow')}</a>` : ''}</div>
    <div class="bgrid">${articles.slice(0, limit).map((a, i) => postCard(a, i)).join('')}</div>
  </div>
</section>`;
}
export function postCard(a, i = 0) {
  return `<article class="post" data-reveal style="--d:${i * 80}ms" data-tilt>
  <a class="post__link" href="${u('/blog/' + a.slug + '/')}" aria-label="${esc(a.title)}"></a>
  <div class="post__img">${gen(a.heroImage, { alt: '', sizes: '(min-width: 900px) 30vw, 90vw' })}</div>
  <div class="post__body"><p class="post__cat">${esc(a.category)} · ${a.readMinutes} min read</p><h3>${esc(a.title)}</h3><p>${esc(a.dek)}</p><span class="post__go">Read ${icon('arrow')}</span></div>
</article>`;
}

export function ctaBand({ title = 'Find Hashables <span class="script script--neon">near you</span>', text = 'Hashables are sold at licensed dispensaries. Use your location or a town name to find a shop near you, then check its live menu.', btn = 'Open the store finder', href = '/find-us/' } = {}) {
  return `<section class="band band--dusk cta" aria-label="Find Hashables">
  ${sun('sun--cta')}${grid('grid-floor--cta')}
  <div class="wrap cta__in" data-reveal><h2 class="h2 h2--sun">${title}</h2><p>${raw(text)}</p><a class="btn btn--sun" href="${u(href)}">${icon('pin')} ${esc(btn)}</a></div>
</section>`;
}

export { jsonld, gen, genUrl, cubes, icon, esc, raw, u };
