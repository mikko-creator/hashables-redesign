// home.mjs - "/" on the reference structure: featured hero, the standard, featured limited flavor, product explorer,
// how it's made (process + video), proof (awards), store finder, apparel, then FAQ + blog teasers (added: the client's
// must-haves are an FAQ and content written for search).
import { shell } from '../lib/layout.mjs';
import { esc, raw, u, gen, cubes, icon } from '../lib/html.mjs';
import { wave, sun, grid, eyebrow, trustStrip, flavorTabs, processSteps, videoBlock, awardsBand, finderBand, faqMini, blogCards } from '../lib/parts.mjs';
import { SITE } from '../content/site.mjs';
import { FLAVORS, LINES, flavorUrl, lineUrl } from '../content/flavors.mjs';

export function home({ faq, blog, pickFaq }) {
  const pp = FLAVORS.find((f) => f.slug === 'prickly-pear');
  const body = `
<section class="hero" data-parallax-root aria-labelledby="hero-h">
  <div class="clip" aria-hidden="true">
    <div class="hero__media" data-parallax="0.22">
      <img class="hero__poster" src="${u('/assets/media/hero-venice-poster.webp')}" alt="" width="1280" height="720" fetchpriority="high">
      <video class="hero__video" muted loop playsinline preload="none" poster="${u('/assets/media/hero-venice-poster.webp')}" data-bgvideo data-src-sm="${u('/assets/media/hero-venice-phone.mp4')}" data-src-lg="${u('/assets/media/hero-venice.mp4')}"></video>
    </div>
    <div class="hero__tint"></div>
    <div class="hero__veil"></div>
    ${grid('grid-floor--hero grid-floor--move')}
  </div>
  <div class="hero__in wrap">
    <div class="hero__pane glass" data-reveal>
      <p class="eyebrow">New England’s own hash rosin gummies</p>
      <h1 id="hero-h" class="hero__h"><span class="hero__h1">Tastes like</span> <span class="script script--neon hero__script">paradise.</span></h1>
      <p class="hero__lead"><strong>The Original, Fresh-Pressed Hash Gummy.</strong> Born from our own farm flower and pressed into pure live rosin, made for a legendary, easy-going, uplifting chill.</p>
      <div class="hero__cta"><a class="btn btn--sun" href="#flavors">Explore the flavors ${icon('arrow')}</a><a class="btn btn--glass" href="${u('/find-us/')}">${icon('pin')} Getcha some</a></div>
      <ul class="hero__chips" aria-label="Highlights"><li>${icon('drop')} Solventless</li><li>${icon('press')} Live rosin</li><li>${icon('trophy')} Award-winning</li></ul>
    </div>
  </div>
  <div class="hero__stacks" aria-hidden="true">
    <div class="float float--h0" data-parallax="0.10">${cubes('tropical-typhoon', { cls: 'cubes cubes--float', eager: true })}</div>
    <div class="float float--h1" data-parallax="0.18">${cubes('prickly-pear', { cls: 'cubes cubes--float', eager: true })}</div>
  </div>
  <button type="button" class="vidctl" data-video-toggle aria-label="Pause the background video" aria-pressed="false">${icon('pause')}</button>
  ${wave('var(--sand)')}
</section>

${trustStrip()}

<section class="feature" style="--c:${pp.color};--g:${pp.glow}" aria-labelledby="feat-h">
  <div class="clip" aria-hidden="true">
    <div class="feature__bg" data-parallax="0.12">${gen(pp.scene, { alt: '', sizes: '100vw' })}</div>
    <div class="feature__veil"></div>
  </div>
  ${wave('var(--sand)', true, 'seam--top')}
  <div class="wrap feature__in">
    <div class="feature__pane glass glass--strong" data-reveal>
      <span class="sticker sticker--pink sticker--pane" aria-hidden="true">Limited<br>run</span>
      ${eyebrow('Limited edition · Featured flavor')}
      <h2 id="feat-h" class="h2">${esc(pp.name)}</h2>
      <p class="feature__tag">${esc(pp.tagline)}</p>
      <p>${esc(pp.notes)}</p>
      <p class="pairs__h">Best paired with</p>
      <ul class="pairs">${pp.pairs.map((p) => `<li>${icon('sun')} ${esc(p)}</li>`).join('')}</ul>
      <div class="btnrow"><a class="btn btn--sun" href="${u(flavorUrl(pp))}">Explore the flavor ${icon('arrow')}</a><a class="btn btn--glass" href="${u(lineUrl('limited'))}">All limited editions</a></div>
    </div>
  </div>
</section>

${flavorTabs({ lead: 'Five year-round core flavors, two specialties and a couple of limited runs. Every one of them pressed from the same fresh live rosin.' })}

${processSteps()}

<section class="chill" aria-labelledby="chill-h">
  <div class="chill__media" aria-hidden="true">
    <img src="${u('/assets/media/wave-poster.webp')}" alt="" width="1920" height="1074" loading="lazy">
    <video muted loop playsinline preload="none" poster="${u('/assets/media/wave-poster.webp')}" data-bgvideo data-src-sm="${u('/assets/media/wave.mp4')}" data-src-lg="${u('/assets/media/wave.mp4')}"></video>
  </div>
  <div class="chill__veil" aria-hidden="true"></div>
  ${wave('var(--sand)', true, 'seam--top')}
  <div class="wrap chill__in">
    <div class="chill__copy" data-reveal>
      ${eyebrow('The feeling')}
      <h2 id="chill-h" class="chill__h">One feeling. Every flavor. <span class="script script--neon">Uplifting chill.</span></h2>
      <p>Hashables are a single-effect gummy. Whatever flavor you pick, it’s made for the same easy-going, sunny-side-up feeling: uplifting, chill and full of flavor. Think golden hour, not rush hour.</p>
      <a class="btn btn--glass" href="${u('/faqs/')}">How edibles work ${icon('arrow')}</a>
    </div>
    <div class="chill__video glass" data-reveal>${videoBlock()}</div>
  </div>
  ${wave('var(--dusk)')}
</section>

${awardsBand()}

${finderBand()}

<section class="band band--sand gear" aria-labelledby="gear-h">
  <div class="wrap gear__in">
    <div class="gear__media" data-reveal>${gen('h-boards', { alt: 'Three vintage longboards in faded aqua, coral and yellow standing in the sand before a grassy dune', sizes: '(min-width: 900px) 50vw, 92vw' })}<span class="sticker sticker--sun">Stay<br>salty</span></div>
    <div class="gear__body" data-reveal>
      ${eyebrow('Gear')}
      <h2 id="gear-h" class="h2">Rep the <span class="script script--ink">vibe</span></h2>
      <p>The retro beach look doesn’t have to stay on the screen. Hashables apparel lives over at our apparel shop, Higher Breed.</p>
      <a class="btn btn--ink" href="${SITE.apparel}" rel="noopener">Shop apparel ${icon('out')}</a>
    </div>
  </div>
</section>

${faqMini(faq, pickFaq, {})}

${blogCards(blog.articles)}
`;
  return shell({
    route: '/',
    title: '',
    description: SITE.description,
    body,
    bodyClass: 'is-home',
    head: `<link rel="preload" as="image" href="${u('/assets/media/hero-venice-poster.webp')}">`,
    schema: [
      { '@context': 'https://schema.org', '@type': 'Organization', '@id': SITE.url + '/#org', name: 'Hashables', url: SITE.url, email: SITE.email,
        logo: SITE.url + '/assets/img/brand/hashables-logo-straight.png', sameAs: [SITE.instagram, SITE.twitter],
        parentOrganization: { '@type': 'Organization', name: 'Nova Farms', url: 'https://novafarms.com/' } },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Hashables', url: SITE.url },
    ],
  });
}
