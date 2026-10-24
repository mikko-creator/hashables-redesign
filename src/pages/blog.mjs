// blog.mjs - /blog/ index and one page per article (src/content/blog.json).
import { shell } from '../lib/layout.mjs';
import { esc, raw, u, pic, picPath, icon } from '../lib/html.mjs';
import { pageHero, breadcrumbs, eyebrow, postCard, ctaBand, relink } from '../lib/parts.mjs';
import { SITE } from '../content/site.mjs';

export function blogIndex(blog) {
  const bc = breadcrumbs([{ label: 'Home', href: '/' }, { label: 'Blog' }]);
  const cats = [...new Set(blog.articles.map((a) => a.category))];
  const body = `
${pageHero({ eyebrow: 'The Hashables blog', title: 'Hash, flavor and', scriptWord: 'good vibes', crumbs: bc.html, img: 'flatlay', imgPos: '50% 42%', short: true,
    imgAlt: 'Hashables jars from above among kiwi, dragon fruit, mango and gummies', lead: 'Live rosin explained, flavor field guides and the basics of enjoying edibles, all in plain language.' })}
<section class="band band--sand blogidx" aria-label="Articles">
  <div class="wrap">
    <div class="chipbar" role="group" aria-label="Filter by topic" data-filter>
      <button type="button" aria-pressed="true" data-cat="*">All</button>${cats.map((c) => `<button type="button" aria-pressed="false" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}
    </div>
    <div class="bgrid bgrid--idx">${blog.articles.map((a, i) => `<div class="bgrid__cell" data-cat="${esc(a.category)}">${postCard(a, i)}</div>`).join('')}</div>
  </div>
</section>
${ctaBand()}
`;
  return shell({ route: '/blog/', title: 'Blog: Live Rosin, Flavor and Edibles 101', description: 'The Hashables blog: what live rosin is, how fresh-pressed hash gummies are made, a field guide to every flavor and how to start low and go slow with edibles.', body, schema: [bc.ld] });
}

export function article(a, blog) {
  const bc = breadcrumbs([{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog/' }, { label: a.title }]);
  const related = (a.related || []).map((s) => blog.articles.find((x) => x.slug === s)).filter(Boolean).slice(0, 3);
  const body = `
<article class="art" aria-labelledby="art-h">
  <header class="art__hero">
    <div class="art__img" data-parallax="0.15">${pic(a.heroImage, { alt: '', sizes: '100vw', eager: true })}</div>
    <div class="art__veil" aria-hidden="true"></div>
    <div class="wrap art__head">
      ${bc.html}
      <div class="art__pane glass" data-reveal>
        <p class="eyebrow">${esc(a.category)} · ${a.readMinutes} min read</p>
        <h1 id="art-h" class="art__h">${esc(a.title)}</h1>
        <p class="art__dek">${esc(a.dek)}</p>
      </div>
    </div>
  </header>
  <div class="band band--sand art__body-band">
    <div class="wrap art__grid">
      <div class="prose prose--art" data-reveal>${relink(a.body)}</div>
      <aside class="art__aside">
        <div class="glass glass--dark art__card"><p><strong>Getcha some.</strong> Hashables are sold at licensed dispensaries.</p><a class="btn btn--sun btn--sm" href="${u('/find-us/')}">${icon('pin')} Find a store</a></div>
        <div class="art__toc"><p class="art__toc-h">In this article</p><ol>${[...a.body.matchAll(/<h2>(.*?)<\/h2>/g)].map((m) => `<li>${m[1]}</li>`).join('')}</ol></div>
      </aside>
    </div>
  </div>
</article>
${related.length ? `<section class="band band--sky blogrow" aria-labelledby="rel-h"><div class="wrap"><div class="sec-head sec-head--row" data-reveal><div>${eyebrow('Keep reading')}<h2 id="rel-h" class="h2">Related <span class="script script--ink">articles</span></h2></div><a class="btn btn--ink" href="${u('/blog/')}">All articles ${icon('arrow')}</a></div><div class="bgrid">${related.map((r, i) => postCard(r, i)).join('')}</div></div></section>` : ''}
${ctaBand()}
`;
  return shell({ route: '/blog/' + a.slug + '/', title: a.title, description: a.metaDescription || a.dek, ogImage: picPath(a.heroImage), body,
    schema: [bc.ld, { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.metaDescription || a.dek, image: SITE.url + picPath(a.heroImage),
      author: { '@type': 'Organization', name: 'Hashables' }, publisher: { '@type': 'Organization', name: 'Hashables', url: SITE.url }, mainEntityOfPage: SITE.url + '/blog/' + a.slug + '/' }] });
}
