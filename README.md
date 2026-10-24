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
- **Products first.** The new HSH26 packaging leads: every flavor card, line row, product page and menu shows the
  flavor's own packaging tile, the mylar bag renders stand in the home and Gummies heroes and on their product pages,
  and the client's studio photography replaces the generated scenes.
- **Depth.** Layered heroes (video or photo, grid, glass) with parallax, and the new bags and packaging tiles breaking
  out of their sections into the next band.
- **Navigation.** On desktop the wordmark sits centred with the menu split either side: Gummies opens a mega menu
  with every line and flavor, Learn and About open dropdowns, and Find us, Contact and the store-finder button sit in
  the bar. Phones and tablets get a menu button that opens the full-screen menu.
- **Motion.** A looping surf film in the home hero under a light brand gradient, scroll reveals, parallax depth and
  tilt-and-glare hovers. All of it stops under `prefers-reduced-motion`.
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
| `tools/` | the client's brand-folder derivatives (`brand-assets.py`), image derivatives (`derive.py`), the footer palm cut-out (`cutouts.py`), video loops, generation runners, preview, checks |

## Imagery

- **Client art and photography** (HSH27 brand folder, via `tools/brand-assets.py`): the nine HSH26 packaging tiles,
  the mylar bag renders supplied for Electric Grape, Peachy Mango and Watermelon Jolt (also fanned together, as on the
  HSH26 one-sheet), the studio product photography, and the surfer, palm, Milky Way and full-spectrum backgrounds.
  From hashables.com: the logo, the pink palms, yellow palms and swirl backgrounds, the award badges and the video
  thumbnail. The studio photos show the earlier jar packaging.
- **Generated** for the concept: only three process stills remain (fresh flower, fresh frozen, pressed rosin; fal
  flux-pro ultra), because the brand folder has no process photography. Each carries the IPTC
  `trainedAlgorithmicMedia` label in its XMP. Every other generated still and the wave video were retired in favour of
  the client's own images.
- **Footage:** the home hero film is stock beach footage supplied for the pitch (two surfers walking out of the sea at
  sunset). The supplied file is 1280x720, so it was AI-upscaled to 1920x1080 with Topaz Proteus on fal
  (`tools/fal-upscale.mjs`) and looped by `tools/make-loop.mjs --footage` (1920x1080 desktop, 864x1080 phone crop). It
  keeps its own colour under the brand gradient in multiply at .45. It is camera footage, not AI-generated: its
  container tags say AI-upscaled, with the IPTC source type `algorithmicallyEnhanced`. A higher-resolution licensed
  original of the same clip would beat the upscale.

## Fonts

Aldrich, Inter and Mr Dafoe, all under the SIL Open Font License. Hashables' current script face (Hey November) is
commercial, so the concept uses Mr Dafoe as a stand-in until the brand's licensed files are supplied.

See `docs/PITCH-NOTES.md` for decisions and the open questions for Nova Farms.
