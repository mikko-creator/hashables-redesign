# Hashables — website redesign concept

A redesign proposal for [hashables.com](https://hashables.com/): the original fresh-pressed hash gummy from Nova Farms.
This is a **pitch build**, not the live site.

**Live preview (noindex):** https://mikko-creator.github.io/hashables-redesign/
(the age gate accepts "Yes, I'm 21+"; add `?age=ok` to a link to skip it)

## What's in the concept

- **Content first.** Every flavor has its own page (9 SKU pages), plus a page per line (Core, Specialty, Limited
  Edition), a searchable FAQ help center (30 answers), a flavor-forward story page, Awards & Press with sourced
  wins, Lab Results, a phone-first store finder with a "tell us where to call" request form, and six SEO articles.
- **Retro beach surf x synthwave x glass.** Brand pink palms and the packaging swirl, the brand yellow / pink / aqua
  palette, a CSS-drawn striped sunset sun, a perspective grid horizon, frosted-glass panels over photography.
- **Depth.** Layered heroes (video, palms, grid, glass) with parallax, and the client's own gummy-cube stacks breaking
  out of their sections into the next band.
- **Navigation.** On desktop the wordmark sits centred with the menu split either side: Gummies opens a mega menu
  with every line and flavor, Learn and About open dropdowns, and Find us, Contact and the store-finder button sit in
  the bar. Phones and tablets get a menu button that opens the full-screen menu.
- **Motion.** A looping surf film in the home hero, coloured by a brand gradient, a looping wave video, scroll
  reveals, floating cube stacks, tilt-and-glare hovers. All of it stops under `prefers-reduced-motion`.
- **Built for search.** One H1 per page, descriptive titles and meta descriptions, canonical URLs, breadcrumbs,
  JSON-LD (Organization, Product, FAQPage, Article, BreadcrumbList), sitemap.xml and robots.txt for production.

## Pages (31)

`/` · `/live-rosin-gummies/` · `/live-rosin-gummies/{core,specialty,limited-edition}/` ·
`/live-rosin-gummies/{tropical-typhoon,bangin-berry,watermelon-jolt,peachy-mango,electric-grape,remberry,blue-raspberry,lemon-burst,prickly-pear}/` ·
`/find-us/` · `/our-story/` · `/faqs/` · `/lab-results/` · `/press/` · `/contact/` · `/careers/` · `/privacy-policy/` ·
`/accessibility/` · `/blog/` + 6 articles · `404.html`

## Build

Node 18+, no dependencies.

```bash
node src/build.mjs --strict      # renders dist/ (fails on a missing asset, a banned phrase, an empty page or a page without exactly one H1)
node tools/serve.mjs --root dist --port 8791 --not-found 404.html
```

Every URL the build prints is relative to its page, so `dist/` works from any folder or subpath.
`node tools/make-preview.mjs --prefix /hashables-redesign` turns `dist/` into the noindex preview.

| Path | What |
|---|---|
| `src/build.mjs` | page list, link/asset checks, sitemap + robots |
| `src/pages/` | home, gummies (hub, lines, SKUs), info pages, blog |
| `src/lib/` | layout (head, header with mega menu, mobile menu drawer, footer, age gate), shared sections, HTML helpers |
| `src/content/` | flavors, site config, FAQ, blog articles, privacy policy, image manifest |
| `src/styles/site.css`, `src/scripts/site.js` | the design system and interactions |
| `assets/generated/` | AI image originals with their prompt/seed sidecars |
| `tools/` | image derivatives (`derive.py`), cut-outs (`cutouts.py`) and their menu thumbnails (`thumbs.py`), video loops, generation runners, preview, checks |

## Imagery

- **Client art** (from hashables.com): the logo, the nine flavor cube photos (cut out for the floating stacks), the
  pink palms, yellow palms and swirl backgrounds, the award badges and the video thumbnail.
- **Generated** for the concept: 15 stills (fal flux-pro ultra), 3 stills (Higgsfield Qwen Image 3) and the looping
  wave video (Higgsfield Kling image-to-video). None shows a person, a product, text or a real Nova Farms place. Every
  generated file carries the IPTC `trainedAlgorithmicMedia` label (XMP in images, container tags in video).
- **Footage:** the home hero film is stock beach footage supplied for the pitch (two surfers walking out of the sea at
  sunset). It is encoded in greyscale and coloured on the page by a brand gradient in multiply
  (`tools/make-loop.mjs --gray --footage`). It is camera footage, so it carries no AI label.

## Fonts

Aldrich, Inter and Mr Dafoe, all under the SIL Open Font License. Hashables' current script face (Hey November) is
commercial, so the concept uses Mr Dafoe as a stand-in until the brand's licensed files are supplied.

See `docs/PITCH-NOTES.md` for decisions and the open questions for Nova Farms.
