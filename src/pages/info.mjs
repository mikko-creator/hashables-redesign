// info.mjs - the brand pages of the reference structure: Find Us, Our Story, FAQs, Lab Results, Awards & Press,
// Contact, Careers, Privacy, Accessibility and the 404.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { shell } from '../lib/layout.mjs';
import { esc, raw, u, pic, pack, trio, icon } from '../lib/html.mjs';
import { pageHero, breadcrumbs, eyebrow, wave, sun, grid, awardsBand, processSteps, videoBlock, ctaBand, relink, flavorCard } from '../lib/parts.mjs';
import { SITE } from '../content/site.mjs';
import { FLAVORS, AWARDS } from '../content/flavors.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const crumbs = (label) => breadcrumbs([{ label: 'Home', href: '/' }, { label }]);
const FORM_NOTE = 'No account, no tracking: this form opens your own email app with the message filled in.';

export function findUs() {
  const bc = crumbs('Find Hashables');
  const body = `
${pageHero({ eyebrow: 'Store finder', title: 'Find Hashables', scriptWord: 'near you', crumbs: bc.html, img: 'surfer-sunset', imgPos: '50% 58%',
    imgAlt: '',
    lead: 'Hashables are sold at licensed dispensaries. Use your location or the name of the town you’re in, no ZIP code needed, then check the shop’s live menu.',
    cta: `<div class="btnrow"><a class="btn btn--sun" href="#finder">${icon('locate')} Open the finder</a><a class="btn btn--glass" href="#request">Ask your dispensary</a></div>` })}
<section class="band band--sand finder" id="finder" aria-labelledby="finder-h">
  <div class="wrap finder__in">
    <div class="finder__guide" data-reveal>
      ${eyebrow('Getcha some')}
      <h2 id="finder-h" class="h2">Three taps <span class="script script--ink">to a stack</span></h2>
      <ol class="finder__steps">
        <li><span>1</span><div><h3>Share your location, or type a town</h3><p>Tap the location button in the map, or search the town you’re in. You don’t need to know the ZIP.</p></div></li>
        <li><span>2</span><div><h3>Pick a shop</h3><p>Shops that carry Hashables appear on the map and in the list.</p></div></li>
        <li><span>3</span><div><h3>Check the live menu</h3><p>Availability may vary. Please check the dispensary’s live menu for the latest offerings before you head out.</p></div></li>
      </ol>
      <p class="finder__hint" data-town-hint hidden></p>
      <div class="btnrow"><button type="button" class="btn btn--ink" data-locate-scroll>${icon('locate')} Use my location</button><a class="btn btn--line" href="#request">Can’t find us nearby?</a></div>
    </div>
    <div class="finder__map glass" data-reveal>
      <div class="finder__bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="finder__url">${icon('pin')} Hashables store finder</span></div>
      <iframe class="finder__frame" src="${SITE.locator}" title="Hashables store finder map" loading="lazy" allow="geolocation" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>
<section class="band band--palms request" id="request" aria-labelledby="req-h">
  <div class="band__bg" aria-hidden="true"><img src="${u('/assets/img/brand/yellow-palms-1600.webp')}" alt="" loading="lazy" width="1600" height="1068"></div>
  <div class="wrap request__in">
    <div class="request__copy" data-reveal>${eyebrow('Not on your local menu?')}<h2 id="req-h" class="h2">Tell us where <span class="script script--ink">to call</span></h2><p>Name the dispensary you wish carried Hashables and we’ll pass it to our team. It helps us know where to knock next.</p></div>
    <form class="form glass glass--strong" data-mailto="${SITE.email}" data-subject="Dispensary request" data-reveal>
      <label><span>Dispensary name</span><input name="Dispensary" required autocomplete="organization" placeholder="e.g. your favorite local shop"></label>
      <label><span>Town</span><input name="Town" required autocomplete="address-level2" placeholder="e.g. Framingham"></label>
      <label><span>Your email <small>(optional, if you’d like a reply)</small></span><input name="Email" type="email" autocomplete="email"></label>
      <button class="btn btn--ink" type="submit">${icon('mail')} Send the request</button>
      <p class="fine">${FORM_NOTE}</p>
    </form>
  </div>
</section>
${ctaBand({ title: 'Know what you’re <span class="script script--neon">looking for?</span>', text: 'Browse every flavor before you go, from the core five to the limited runs.', btn: 'See all gummies', href: '/live-rosin-gummies/' })}
`;
  return shell({ route: '/find-us/', title: 'Find Hashables Near You: Store Finder', description: 'Find Hashables live rosin gummies at a licensed dispensary near you. Use your location or a town name, then check the shop’s live menu.', body, schema: [bc.ld] });
}

export function ourStory() {
  const bc = crumbs('Our Story');
  const body = `
${pageHero({ eyebrow: 'Our story', title: 'Real hash. Fresh pressed. <span class="hl">Tastes like paradise.</span>', crumbs: bc.html, img: 'peach-pink', imgPos: '62% 50%',
    imgAlt: 'A stack of Peachy Mango jars with mangoes, a peach and orange gummies on a pink set',
    lead: 'We make the gummy we always wanted: fresh-pressed hash rosin from our own farm flower, stacked into flavors that taste like a beach day and feel like an easy-going, uplifting chill.' })}
<section class="band band--sand triad" aria-labelledby="tri-h">
  <div class="wrap">
    <div class="sec-head sec-head--center" data-reveal>${eyebrow('What we stand on')}<h2 id="tri-h" class="h2">A commitment to <span class="script script--ink">the real thing</span></h2></div>
    <div class="triad__grid">
      <article class="triad__card" data-reveal data-tilt>${pic('s-bud', { alt: 'Close-up of a frosty cannabis flower', sizes: '(min-width: 900px) 30vw, 90vw' })}<div><h3>Real flower</h3><p>Hashables start with fresh frozen flower from Nova Farms’ own farms, frozen at harvest to keep its character.</p></div></article>
      <article class="triad__card" data-reveal data-tilt style="--d:90ms">${pic('s-rosin', { alt: 'Freshly pressed hash rosin on parchment', sizes: '(min-width: 900px) 30vw, 90vw' })}<div><h3>Real hash</h3><p>We’re award-winning hash makers, and that hash is the base of every gummy: solventless live rosin, fresh pressed. No distillate.</p></div></article>
      <article class="triad__card" data-reveal data-tilt style="--d:180ms">${pic('gummies', { alt: 'A stack of colourful Hashables gummies among watermelon, kiwi, peach, mango and pineapple', sizes: '(min-width: 900px) 30vw, 90vw' })}<div><h3>Real flavor</h3><p>Full-spectrum rosin keeps the flower’s character, and we stack fruit-forward flavor on top. Stacks on stacks of it.</p></div></article>
    </div>
  </div>
</section>
<section class="band band--sky story" aria-labelledby="st-h">
  <div class="wrap story__in">
    <div class="story__copy" data-reveal>
      ${eyebrow('The Hashables story')}
      <h2 id="st-h" class="h2">New England’s own <span class="script script--ink">since day one</span></h2>
      <p class="sec-lead">Hashables is a Nova Farms brand, and we’ve been making this gummy for the better part of a decade. When it launched, it was one of the first live rosin gummies in the Northeast.</p>
      <p>The idea was simple: if you love the taste of real flower, your gummy should taste like it too. So instead of distillate, every Hashables gummy is dosed with solventless hash rosin, pressed fresh from frozen flower. The result is full-spectrum, with a broad mix of cannabinoids and terpenes and a distinct flower flavor distillate can’t match.</p>
      <p>Along the way, our gummies picked up some hardware, including a category win at the 2023 Harvest Cup and podium finishes at the High Times Cannabis Cup Massachusetts People’s Choice Editions in 2022 and 2023. Recently we moved into new bags. Same gummy, new look.</p>
    </div>
    <div class="story__media story__media--bags" data-reveal>${trio({ sizes: '(min-width: 900px) 44vw, 90vw' })}<div class="story__badge glass">${icon('trophy')}<span><strong>Award-winning</strong> hash makers</span></div></div>
  </div>
</section>
<section class="band band--dusk look" aria-labelledby="look-h">
  ${sun('sun--awards')}${grid('grid-floor--awards')}
  <div class="wrap">
    <div class="sec-head sec-head--center" data-reveal>${eyebrow('The look of Hashables')}<h2 id="look-h" class="h2 h2--sun">Where the <span class="script script--neon">vibe</span> comes from</h2></div>
    <div class="look__grid">
      <details class="look__item glass" data-reveal open><summary><span class="look__ico">${icon('wave')}</span><h3>The swirl</h3>${icon('chev')}</summary><p>The swirl comes from our original packaging. We kept a little of it alive, and it still runs through our new bags.</p></details>
      <details class="look__item glass" data-reveal><summary><span class="look__ico">${icon('sun')}</span><h3>Palms and sunsets</h3>${icon('chev')}</summary><p>The retro, beachy, surfy look comes straight from how Hashables feel. It’s an uplifting chill, so we dressed it like the best beach day of the summer.</p></details>
      <details class="look__item glass" data-reveal><summary><span class="look__ico">${icon('cube')}</span><h3>The stack</h3>${icon('chev')}</summary><p>Our gummies are sugar-dusted cubes, and we like them stacked. Every flavor gets its own stack, and every stack starts with fresh-pressed rosin.</p></details>
    </div>
  </div>
</section>
<section class="band band--sand video-sec" aria-labelledby="vid-h">
  <div class="wrap video-sec__in">
    <div data-reveal>${eyebrow('Watch')}<h2 id="vid-h" class="h2">What are <span class="script script--ink">Hashables?</span></h2><p class="sec-lead">A quick look at the fresh-pressed hash gummy, straight from our team.</p></div>
    <div class="video-sec__frame glass" data-reveal>${videoBlock()}</div>
  </div>
</section>
<section class="band band--sky family" aria-labelledby="fam-h">
  <div class="wrap family__in" data-reveal>
    <div>${eyebrow('Part of the family')}<h2 id="fam-h" class="h2">Proudly <span class="script script--ink">Nova Farms</span></h2>
    <p>Hashables is one of the Nova Farms brands. Nova Farms grows and makes cannabis in Massachusetts and has dispensaries in Attleboro, Framingham and Dracut.</p>
    <a class="btn btn--ink" href="${SITE.nova}" rel="noopener">Meet the Nova Farms brands ${icon('out')}</a></div>
  </div>
</section>
${ctaBand()}
`;
  return shell({ route: '/our-story/', title: 'Our Story: The Original Fresh-Pressed Hash Gummy', description: 'Hashables is New England’s fresh-pressed hash gummy from Nova Farms: solventless live rosin from our own fresh frozen farm flower, made by award-winning hash makers.', body, schema: [bc.ld] });
}

export function faqs(faq) {
  const bc = crumbs('FAQs');
  const count = faq.topics.reduce((n, t) => n + t.items.length, 0);
  const body = `
${pageHero({ eyebrow: 'Hashables help center', title: 'FAQs', scriptWord: 'answered', crumbs: bc.html, img: 'watermelon-green', imgPos: '50% 55%', short: true,
    imgAlt: 'Watermelon Jolt jars with watermelon wedges and a cup of pink gummies on a green set',
    lead: esc(faq.intro || 'Questions are good. Clear answers are better.') })}
<section class="band band--sand help" aria-label="Frequently asked questions">
  <div class="wrap help__in">
    <aside class="help__side" data-reveal>
      <label class="help__search"><span class="sr">Search the FAQs</span>${icon('search')}<input type="search" placeholder="Search ${count} answers" data-faq-search></label>
      <p class="help__k">Browse by topic</p>
      <nav class="help__topics" aria-label="FAQ topics">${faq.topics.map((t) => `<a href="#${t.id}"><span>${esc(t.label)}</span><small>${t.items.length}</small></a>`).join('')}</nav>
      <div class="help__card glass glass--dark">${pack('remberry', { sizes: '96px', cls: 'help__pack' })}<p><strong>Still curious?</strong> We’d love to help.</p><a class="btn btn--sun btn--sm" href="${u('/contact/')}">Contact us</a></div>
    </aside>
    <div class="help__main">
      <p class="help__none" data-faq-none hidden>No answers match that search. Try another word, or <a href="${u('/contact/')}">ask us directly</a>.</p>
      ${faq.topics.map((t) => `<section class="help__topic" id="${t.id}" aria-labelledby="h-${t.id}" data-faq-topic>
        <h2 id="h-${t.id}" class="h3">${esc(t.label)}</h2>
        <div class="acc">${t.items.map((q) => `<details class="acc__item" data-faq-item><summary>${esc(q.q)}<span class="acc__ico">${icon('chev')}</span></summary><div class="acc__body">${relink(q.a)}</div></details>`).join('')}</div>
      </section>`).join('')}
    </div>
  </div>
</section>
${ctaBand()}
`;
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.topics.flatMap((t) => t.items).map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() } })) };
  return shell({ route: '/faqs/', title: 'FAQs: Hashables Live Rosin Gummies', description: 'Answers about Hashables: what live rosin is, the flavors, the sleep and sugar-free gummies, how edibles work and how to find Hashables near you.', body, schema: [bc.ld, ld] });
}

export function lab(labc) {
  const bc = crumbs('Lab Results');
  const body = `
${pageHero({ eyebrow: 'Quality', title: esc(labc.title), crumbs: bc.html, img: 'spectrum', short: true, imgAlt: '', lead: esc(labc.intro) })}
<section class="band band--sand labsec" aria-label="How lab results work">
  <div class="wrap labsec__in">
    <div class="labsec__copy">${labc.sections.map((s) => `<section class="prose" data-reveal><h2 class="h3">${esc(s.heading)}</h2>${relink(s.html)}</section>`).join('')}<p class="fine">${esc(labc.note)}</p></div>
    <form class="form glass glass--strong labsec__form" data-mailto="${SITE.email}" data-subject="COA request" data-reveal>
      <p class="form__h">${icon('lab')} Request a COA</p>
      <label><span>Flavor</span><select name="Flavor" required><option value="">Choose a flavor</option>${FLAVORS.map((f) => `<option>${esc(f.name)}</option>`).join('')}</select></label>
      <label><span>Batch or lot number</span><input name="Batch" required placeholder="As printed on the state label"></label>
      <label><span>Where you bought it <small>(optional)</small></span><input name="Dispensary" autocomplete="organization"></label>
      <button class="btn btn--ink" type="submit">${icon('mail')} Email the request</button>
      <p class="fine">${FORM_NOTE}</p>
    </form>
  </div>
</section>
${processSteps({ id: 'lab-process', heading: 'Clean from <span class="script script--ink">farm to press</span>' })}
`;
  return shell({ route: '/lab-results/', title: 'Lab Results and COAs', description: 'How to get the certificate of analysis (COA) for your pack of Hashables live rosin gummies, and what a COA shows.', body, schema: [bc.ld] });
}

export function press() {
  const bc = crumbs('Awards & Press');
  const news = [
    { outlet: 'High Times', date: 'Jan 16, 2024', title: 'The Winners of the High Times Cannabis Cup Massachusetts: People’s Choice Edition 2023', note: 'Tropical Typhoon takes third place for sativa gummies.', href: AWARDS.ht23.href },
    { outlet: 'Apex Trading', date: '2023', title: 'Congratulations to the Remarkable Massachusetts 2023 Harvest Cup Winners', note: 'Tropical Typhoon wins the Sugar Confections category.', href: AWARDS.hc23.href },
    { outlet: 'High Times', date: 'Nov 28, 2022', title: 'The Winners of the High Times Cannabis Cup Massachusetts: People’s Choice Edition 2022', note: 'Watermelon Jolt takes second place for sativa gummies.', href: AWARDS.ht22.href },
  ];
  const body = `
${pageHero({ eyebrow: 'Hashables in the news', title: 'Awards', scriptWord: '& press', crumbs: bc.html, img: 'typhoon-tower', imgPos: '50% 60%', short: true, imgAlt: 'A tower of Tropical Typhoon jars beside a pineapple on an aqua set',
    lead: 'We’re award-winning hash makers, and our gummies have the hardware to show for it.' })}
${awardsBand({ id: 'press-awards' })}
<section class="band band--sand news" aria-labelledby="news-h">
  <div class="wrap">
    <div class="sec-head" data-reveal>${eyebrow('In the news')}<h2 id="news-h" class="h2">As seen <span class="script script--ink">in</span></h2></div>
    <ul class="news__list">${news.map((n, i) => `<li class="news__item" data-reveal style="--d:${i * 70}ms"><p class="news__meta">${esc(n.outlet)} · ${esc(n.date)}</p><h3><a href="${n.href}" rel="noopener">${esc(n.title)} ${icon('out')}</a></h3><p>${esc(n.note)}</p></li>`).join('')}</ul>
    <div class="news__contact glass glass--dark" data-reveal><p><strong>Press and partnerships:</strong> say hey at <a href="mailto:${SITE.email}">${SITE.email}</a>.</p></div>
  </div>
</section>
`;
  return shell({ route: '/press/', title: 'Awards and Press', description: 'Hashables awards and press: High Times Cannabis Cup Massachusetts People’s Choice placings in 2022 and 2023, and the 2023 Harvest Cup Sugar Confections win.', body, schema: [bc.ld] });
}

export function contact() {
  const bc = crumbs('Contact');
  const body = `
${pageHero({ eyebrow: 'Contact', title: 'Say', scriptWord: 'hey', crumbs: bc.html, img: 'watermelon-pink', imgPos: '50% 52%', short: true, imgAlt: 'Watermelon Jolt jars stacked on watermelon slices beside a cactus',
    lead: 'Questions, flavor love, dispensary suggestions and partnership ideas are all welcome.' })}
<section class="band band--sand contact" aria-label="Contact options">
  <div class="wrap contact__in">
    <div class="contact__cards">
      <a class="ccard glass glass--dark" href="mailto:${SITE.email}" data-reveal data-tilt><span class="ccard__ico">${icon('mail')}</span><span class="ccard__k">General questions</span><span class="ccard__v">${SITE.email}</span></a>
      <a class="ccard glass glass--dark" href="mailto:${SITE.wholesale}" data-reveal data-tilt style="--d:80ms"><span class="ccard__ico">${icon('cube')}</span><span class="ccard__k">Wholesale</span><span class="ccard__v">${SITE.wholesale}</span></a>
      <a class="ccard glass glass--dark" href="${SITE.instagram}" rel="noopener" data-reveal data-tilt style="--d:160ms"><span class="ccard__ico">${icon('insta')}</span><span class="ccard__k">Instagram</span><span class="ccard__v">@hashables</span></a>
      <a class="ccard glass glass--dark" href="${SITE.twitter}" rel="noopener" data-reveal data-tilt style="--d:240ms"><span class="ccard__ico">${icon('x')}</span><span class="ccard__k">X (Twitter)</span><span class="ccard__v">@eat_hashables</span></a>
    </div>
    <form class="form glass glass--strong" data-mailto="${SITE.email}" data-subject="Hello from hashables.com" data-reveal>
      <p class="form__h">Send us a note</p>
      <label><span>Name</span><input name="Name" required autocomplete="name"></label>
      <label><span>Email</span><input name="Email" type="email" required autocomplete="email"></label>
      <label><span>Topic</span><select name="Topic"><option>A question about Hashables</option><option>My favorite flavor</option><option>A dispensary you’d like us to call on</option><option>Press or partnerships</option></select></label>
      <label><span>Message</span><textarea name="Message" rows="5" required></textarea></label>
      <button class="btn btn--ink" type="submit">${icon('mail')} Send</button>
      <p class="fine">${FORM_NOTE}</p>
    </form>
  </div>
</section>
`;
  return shell({ route: '/contact/', title: 'Contact Hashables', description: 'Contact Hashables: general questions at info@hashables.com, wholesale at info@stashie.com, or find us on Instagram @hashables.', body, schema: [bc.ld] });
}

export function careers() {
  const bc = crumbs('Careers');
  const body = `
${pageHero({ eyebrow: 'Careers', title: 'Join the', scriptWord: 'crew', crumbs: bc.html, img: 'palms-yellow', short: true, imgAlt: '',
    lead: 'Hashables is made by the team at Nova Farms, a Massachusetts cannabis company with its own farms and dispensaries.' })}
<section class="band band--sand" aria-label="Working with Hashables">
  <div class="wrap narrow prose" data-reveal>
    <h2 class="h3">Work with us</h2>
    <p>Love fresh-pressed hash and great flavor as much as we do? For roles across the Nova Farms family, Nova Farms is the place to start.</p>
    <p>Start at <a href="${SITE.nova}" rel="noopener">novafarms.com</a>, or drop us a line at <a href="mailto:${SITE.email}">${SITE.email}</a> and tell us what you’re great at.</p>
  </div>
</section>
${ctaBand({ title: 'Meanwhile, <span class="script script--neon">meet the stack</span>', text: 'Five core flavors, two specialties and a couple of limited runs.', btn: 'See the gummies', href: '/live-rosin-gummies/' })}
`;
  return shell({ route: '/careers/', title: 'Careers', description: 'Careers with Hashables and the Nova Farms family.', body, schema: [bc.ld] });
}

export function privacy() {
  const bc = crumbs('Privacy Policy');
  const html = fs.readFileSync(path.join(ROOT, 'src/content/privacy.html'), 'utf8');
  const body = `
${pageHero({ eyebrow: 'Legal', title: 'Privacy Policy', crumbs: bc.html, short: true, tone: 'night' })}
<section class="band band--sand" aria-label="Privacy policy text"><div class="wrap narrow prose prose--legal">${html}</div></section>`;
  return shell({ route: '/privacy-policy/', title: 'Privacy Policy', description: 'The privacy policy of Nova Farms, LLC for the Hashables website.', body, schema: [bc.ld] });
}

export function accessibility() {
  const bc = crumbs('Accessibility');
  const body = `
${pageHero({ eyebrow: 'Legal', title: 'Accessibility', crumbs: bc.html, short: true, tone: 'night' })}
<section class="band band--sand" aria-label="Accessibility statement"><div class="wrap narrow prose">
  <h2 class="h3">Paradise should be for everyone</h2>
  <p>We want every adult visitor to be able to use hashables.com comfortably. This site is built with semantic HTML, keyboard navigation, visible focus states, text alternatives for meaningful images and sufficient color contrast, and it follows your device’s reduced-motion setting by stopping animations and background video.</p>
  <p>We work toward the Web Content Accessibility Guidelines (WCAG) 2.2, level AA. Some content comes from third parties, such as the store finder map and the embedded video, and may not fully meet those guidelines.</p>
  <h2 class="h3">Tell us what isn’t working</h2>
  <p>If something on this site gets in your way, email <a href="mailto:${SITE.email}">${SITE.email}</a> with the page and what happened, and we’ll do our best to fix it or get you the information another way.</p>
</div></section>`;
  return shell({ route: '/accessibility/', title: 'Accessibility', description: 'The Hashables website accessibility statement.', body, schema: [bc.ld] });
}

export function notFound() {
  const body = `
<section class="nf">
  ${sun('sun--nf')}${grid('grid-floor--nf grid-floor--move')}
  <div class="wrap nf__in">
    <p class="eyebrow">Error 404</p>
    <div class="nf__product">${trio({ sizes: '(min-width: 720px) 380px, 70vw' })}</div>
    <h1 class="nf__h">Total <span class="script script--neon">wipeout.</span></h1>
    <p>That page washed out to sea. Let’s get you back on the board.</p>
    <div class="btnrow btnrow--center"><a class="btn btn--sun" href="${u('/')}">Back to the beach</a><a class="btn btn--glass" href="${u('/live-rosin-gummies/')}">See the flavors</a><a class="btn btn--glass" href="${u('/find-us/')}">Find a store</a></div>
  </div>
</section>`;
  return shell({ route: '/404.html', title: 'Page not found', description: 'This page washed out to sea.', body, bodyClass: 'is-404' });
}
