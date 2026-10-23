// gummies.mjs - the product tree on the reference structure: hub (/live-rosin-gummies/), one page per line, one page
// per SKU (the client asked for "a page for each SKU instead of one long scroll, for search").
import { shell } from '../lib/layout.mjs';
import { esc, raw, u, gen, cubes, icon } from '../lib/html.mjs';
import { pageHero, breadcrumbs, eyebrow, wave, sun, grid, flavorCard, trustStrip, processSteps, ctaBand, relink } from '../lib/parts.mjs';
import { SITE } from '../content/site.mjs';
import { FLAVORS, LINES, AWARDS, byLine, flavorUrl, lineUrl } from '../content/flavors.mjs';

const lineKeys = ['core', 'specialty', 'limited'];

export function hub() {
  const bc = breadcrumbs([{ label: 'Home', href: '/' }, { label: 'Gummies' }]);
  const body = `
${pageHero({ eyebrow: 'Fresh-pressed hash rosin gummies', title: 'Stacks on stacks', scriptWord: 'of flavor', crumbs: bc.html,
    lead: 'Every Hashables gummy starts the same way: our own fresh frozen farm flower, pressed into solventless live rosin. No distillate, just full-spectrum hash and flavor that tastes like paradise.',
    img: 's-hero', imgAlt: 'A tropical beach at sunset under a pink sky', stacks: ['bangin-berry', 'blue-raspberry', 'peachy-mango'],
    cta: `<div class="btnrow"><a class="btn btn--sun" href="#core">Shop the lineup ${icon('arrow')}</a><a class="btn btn--glass" href="${u('/find-us/')}">${icon('pin')} Find a store</a></div>` })}
${lineKeys.map((k, i) => {
    const L = LINES[k];
    return `<section class="band ${i % 2 ? 'band--sky' : 'band--sand'} line-sec" id="${k === 'limited' ? 'limited' : k}" aria-labelledby="ls-${k}">
  <div class="wrap">
    <div class="line-sec__head" data-reveal>
      <div>${eyebrow(L.kicker)}<h2 id="ls-${k}" class="h2">${esc(L.name)}</h2></div>
      <div class="line-sec__copy"><p class="sec-lead">${esc(L.lead)}</p><ul class="ticks">${L.points.map((p) => `<li>${icon('check')} ${esc(p)}</li>`).join('')}</ul><a class="btn btn--ink" href="${u(lineUrl(k))}">Explore ${esc(L.name)} ${icon('arrow')}</a></div>
    </div>
    <div class="fgrid fgrid--${byLine(k).length}">${byLine(k).map((f) => flavorCard(f)).join('')}</div>
  </div>
</section>`;
  }).join('')}
${processSteps({ id: 'made' })}
${ctaBand()}
`;
  return shell({ route: '/live-rosin-gummies/', title: 'Live Rosin Gummies: Every Hashables Flavor', description: 'Shop every Hashables flavor: five core live rosin gummies, two specialties (sleep and sugar-free) and limited editions. Fresh-pressed, solventless hash rosin from New England.',
    body, schema: [bc.ld, { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Hashables gummies', itemListElement: FLAVORS.map((f, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE.url + flavorUrl(f), name: f.name })) }] });
}

export function line(k) {
  const L = LINES[k];
  const list = byLine(k);
  const bc = breadcrumbs([{ label: 'Home', href: '/' }, { label: 'Gummies', href: '/live-rosin-gummies/' }, { label: L.name }]);
  const others = lineKeys.filter((x) => x !== k);
  const body = `
${pageHero({ eyebrow: L.kicker, title: esc(L.title), crumbs: bc.html, lead: esc(L.lead), img: L.scene, imgAlt: '', stacks: list.slice(0, 3).map((f) => f.slug),
    cta: `<div class="btnrow"><a class="btn btn--sun" href="#lineup">See the flavors ${icon('arrow')}</a><a class="btn btn--glass" href="${u('/find-us/')}">${icon('pin')} Where to buy</a></div>` })}
<section class="band band--sand" id="lineup" aria-label="${esc(L.name)} flavors">
  <div class="wrap">
    <div class="sec-head" data-reveal>${eyebrow('The lineup')}<h2 class="h2">${list.length} ${list.length === 1 ? 'flavor' : 'flavors'}, one fresh-pressed rosin</h2><p class="sec-lead">${esc(L.body)}</p></div>
    <div class="lrows">${list.map((f, i) => `
      <article class="lrow ${i % 2 ? 'lrow--flip' : ''}" style="--c:${f.color};--g:${f.glow}" data-reveal>
        <div class="lrow__media">${gen(f.scene, { alt: f.sceneAlt, sizes: '(min-width: 1000px) 55vw, 92vw' })}<div class="lrow__cubes" data-parallax="-0.06">${cubes(f.slug, { alt: `A stack of ${f.name} gummy cubes`, cls: 'cubes cubes--pop' })}</div></div>
        <div class="lrow__body">
          <p class="lrow__line">${esc(f.badge || L.short)}${f.awards.length ? ` · ${icon('trophy')} Award winner` : ''}</p>
          <h3 class="h3">${esc(f.name)}</h3>
          <p class="lrow__tag">${esc(f.tagline)}</p>
          <p>${esc(f.notes)}</p>
          <ul class="chips">${f.chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
          <div class="btnrow"><a class="btn btn--ink" href="${u(flavorUrl(f))}">View ${esc(f.name)} ${icon('arrow')}</a><a class="btn btn--line" href="${u('/find-us/')}">${icon('pin')} Where to buy</a></div>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>
${trustStrip({ kicker: 'None of the filler', heading: 'All of the <span class="script script--ink">good stuff</span>' })}
<section class="band band--dusk more-lines" aria-labelledby="ml-h">
  ${sun('sun--cta')}${grid('grid-floor--cta')}
  <div class="wrap">
    <div class="sec-head sec-head--center" data-reveal>${eyebrow('Keep exploring')}<h2 id="ml-h" class="h2 h2--sun">More from <span class="script script--neon">the stack</span></h2></div>
    <div class="lcards">${others.map((o) => `<a class="lcard glass" href="${u(lineUrl(o))}" data-tilt data-reveal><span class="lcard__cubes">${byLine(o).slice(0, 2).map((f) => cubes(f.slug, { cls: 'cubes' })).join('')}</span><span class="lcard__k">${esc(LINES[o].kicker)}</span><span class="lcard__n">${esc(LINES[o].name)}</span><span class="lcard__go">See flavors ${icon('arrow')}</span></a>`).join('')}
    <a class="lcard glass" href="${u('/live-rosin-gummies/')}" data-tilt data-reveal><span class="lcard__cubes">${cubes('tropical-typhoon', { cls: 'cubes' })}${cubes('lemon-burst', { cls: 'cubes' })}</span><span class="lcard__k">Everything</span><span class="lcard__n">All gummies</span><span class="lcard__go">See all ${icon('arrow')}</span></a></div>
  </div>
</section>
${ctaBand()}
`;
  return shell({ route: lineUrl(k), title: L.seoTitle, description: L.meta, body, schema: [bc.ld] });
}

export function sku(f) {
  const L = LINES[f.line];
  const bc = breadcrumbs([{ label: 'Home', href: '/' }, { label: 'Gummies', href: '/live-rosin-gummies/' }, { label: L.name, href: lineUrl(f.line) }, { label: f.name }]);
  const siblings = FLAVORS.filter((x) => x.slug !== f.slug);
  const awards = f.awards.map((k) => AWARDS[k]);
  const night = f.slug === 'remberry';
  const specs = [
    ['Line', f.line === 'core' ? 'Core flavor, year-round' : f.line === 'specialty' ? `Specialty (${f.badge.toLowerCase()}), year-round` : 'Limited edition, while it lasts'],
    ['The feel', f.feel || 'Uplifting chill'],
    ['Extract', 'Solventless hash rosin (live rosin), fresh pressed'],
    ['Made from', 'Our own fresh frozen farm flower'],
    ['Potency', 'Printed on the state label of every pack'],
  ];
  const body = `
<section class="pdp ${night ? 'pdp--night' : ''}" style="--c:${f.color};--g:${f.glow}" aria-labelledby="pdp-h" data-parallax-root>
  <div class="clip" aria-hidden="true">
    <div class="pdp__bg" data-parallax="0.15">${gen(f.scene, { alt: '', sizes: '100vw', eager: true })}</div>
    <div class="pdp__veil"></div>
    ${grid('grid-floor--hero')}
  </div>
  <div class="wrap pdp__in">
    ${bc.html}
    <div class="pdp__grid">
      <div class="pdp__stage" aria-hidden="true">
        <div class="pdp__halo"></div>
        <div class="float float--pdp" data-parallax="-0.08">${cubes(f.slug, { cls: 'cubes cubes--hero', eager: true })}</div>
        ${f.badge ? `<span class="sticker sticker--pdp">${esc(f.badge)}</span>` : ''}
      </div>
      <div class="pdp__pane glass glass--strong" data-reveal>
        <p class="eyebrow">${esc(L.name)}${f.awards.length ? ` · ${icon('trophy')} Award winner` : ''}</p>
        <h1 id="pdp-h" class="pdp__h">${esc(f.name)} <span class="pdp__sub">Live Rosin Gummies</span></h1>
        <p class="pdp__tag">${esc(f.tagline)}</p>
        <p>${esc(f.notes)}</p>
        <ul class="chips chips--light">${f.chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
        <div class="btnrow"><a class="btn btn--sun" href="${u('/find-us/')}">${icon('pin')} Where to buy</a><a class="btn btn--glass" href="#details">Details ${icon('chev')}</a></div>
        <dl class="specs">${specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </div>
    </div>
  </div>
  ${wave('var(--sand)')}
</section>

<section class="band band--sand pdp-story" id="details" aria-labelledby="story-h">
  <div class="wrap pdp-story__in">
    <div class="pdp-story__copy" data-reveal>
      ${eyebrow('The backstory')}
      <h2 id="story-h" class="h2">${esc(f.name)}, <span class="script script--ink">in a nutshell</span></h2>
      <p class="sec-lead">${esc(f.story)}</p>
      <p class="pairs__h">Best paired with</p>
      <ul class="pairs pairs--ink">${f.pairs.map((p) => `<li>${icon(night ? 'moon' : 'sun')} ${esc(p)}</li>`).join('')}</ul>
    </div>
    <div class="pdp-tabs tabs" data-tabs data-reveal>
      <div class="tabs__list tabs__list--ink" role="tablist" aria-label="${esc(f.name)} details">
        <button type="button" role="tab" id="t-about" aria-controls="p-about" aria-selected="true">About</button>
        <button type="button" role="tab" id="t-rosin" aria-controls="p-rosin" aria-selected="false" tabindex="-1">The rosin</button>
        <button type="button" role="tab" id="t-use" aria-controls="p-use" aria-selected="false" tabindex="-1">Enjoy it right</button>
      </div>
      <div class="tabs__panel" role="tabpanel" id="p-about" aria-labelledby="t-about">
        <p>${esc(f.name)} is part of our ${esc(L.name.toLowerCase())} lineup. Like every Hashables gummy it’s made with fresh-pressed, solventless hash rosin instead of distillate, so it carries the full-spectrum character of the flower along with the fruit.</p>
        ${f.line === 'specialty' && f.slug === 'remberry' ? '<p><strong>What’s inside varies by market:</strong> Remberry pairs THC hash rosin with CBN and CBD, and it’s finished with melatonin in some markets and melatonin-free in others. The label on your pack is the final word.</p>' : ''}
        ${f.slug === 'blue-raspberry' ? '<p><strong>Sugar-free:</strong> Blue Raspberry is our sugar-free specialty. Check the pack for full ingredients and nutrition facts.</p>' : ''}
        <p>Ingredients, potency and nutrition facts are printed on each pack’s state label.</p>
      </div>
      <div class="tabs__panel" role="tabpanel" id="p-rosin" aria-labelledby="t-rosin" hidden>
        <p>Live rosin is a solventless cannabis extract. Fresh frozen flower is washed in ice water to separate its resin, and that hash is pressed with gentle heat and pressure into rosin. No hydrocarbons, no ethanol, no distillate.</p>
        <p>The result is full-spectrum: a broad mix of cannabinoids and terpenes that gives Hashables a real flower flavor you can’t get from distillate.</p>
        <p><a href="${u('/blog/what-is-live-rosin/')}">What is live rosin? ${icon('arrow')}</a></p>
      </div>
      <div class="tabs__panel" role="tabpanel" id="p-use" aria-labelledby="t-use" hidden>
        <ul class="ticks ticks--ink">
          <li>${icon('check')} Start low and take it slow, especially when edibles are new to you.</li>
          <li>${icon('check')} Edibles can take two hours or more to kick in. Wait before taking more.</li>
          <li>${icon('check')} Read the potency on the state label before you start.</li>
          <li>${icon('check')} Don’t drive or operate machinery. Keep away from kids and pets.</li>
          <li>${icon('check')} Store in a cool, dry place, sealed in the original pack.</li>
        </ul>
        <p><a href="${u('/blog/start-low-go-slow/')}">First time with edibles? ${icon('arrow')}</a></p>
      </div>
    </div>
  </div>
</section>

${awards.length ? `<section class="band band--dusk pdp-awards" aria-labelledby="aw-h">
  ${sun('sun--cta')}${grid('grid-floor--cta')}
  <div class="wrap">
    <div class="sec-head sec-head--center" data-reveal>${eyebrow('On the podium')}<h2 id="aw-h" class="h2 h2--sun">${esc(f.name)} <span class="script script--neon">wins</span></h2></div>
    <ul class="awards__list awards__list--${awards.length}">${awards.map((a, i) => `<li class="award glass" data-reveal style="--d:${i * 90}ms" data-tilt><span class="award__year">${esc(a.year)}</span><p class="award__place">${icon('trophy')} ${esc(a.place)}</p><h3 class="award__product">${esc(a.title)}</h3><a class="award__src" href="${a.href}" rel="noopener">Source: ${esc(a.source)} ${icon('out')}</a></li>`).join('')}</ul>
  </div>
</section>` : ''}

<section class="band band--sky siblings" aria-labelledby="sib-h">
  <div class="wrap">
    <div class="sec-head sec-head--row" data-reveal><div>${eyebrow('Keep stacking')}<h2 id="sib-h" class="h2">More <span class="script script--ink">flavors</span></h2></div><a class="btn btn--ink" href="${u('/live-rosin-gummies/')}">All gummies ${icon('arrow')}</a></div>
    <div class="hscroll" data-hscroll><div class="hscroll__track">${siblings.map((s) => flavorCard(s)).join('')}</div></div>
  </div>
</section>
${ctaBand({ title: `Find ${esc(f.name)} <span class="script script--neon">near you</span>`, text: 'Hashables are sold at licensed dispensaries. Use your location or a town name to find a shop, then check its live menu for this flavor.' })}
`;
  return shell({ route: flavorUrl(f), title: `${f.name} Live Rosin Gummies`, description: `${f.name} by Hashables: ${f.tagline} ${f.notes}`.slice(0, 158).replace(/\s+\S*$/, '') + '…',
    ogImage: `/assets/img/gen/${f.scene}-1600.webp`, body, bodyClass: night ? 'is-night' : '',
    schema: [bc.ld, { '@context': 'https://schema.org', '@type': 'Product', name: `${f.name} Live Rosin Gummies`, brand: { '@type': 'Brand', name: 'Hashables' },
      description: f.notes, image: SITE.url + `/assets/img/cut/cubes-${f.slug}.webp`, category: 'Cannabis edibles',
      ...(awards.length ? { award: awards.map((a) => `${a.place}, ${a.title}`) } : {}) }] });
}
