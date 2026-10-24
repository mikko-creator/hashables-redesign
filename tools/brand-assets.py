# brand-assets.py - web derivatives of the client's brand folder (HSH27_Brand_TW1, extracted to assets/source/hsh27/,
# export-ignored). Revision 6: the site leads with Hashables' own products and updated packaging.
#   python -I tools/brand-assets.py
# - pack/<slug>-{680,340,160}.webp + <slug>-og.jpg: the HSH26 menu tiles (the new packaging art, one per flavor)
# - pack/bag-<slug>-{900,480}.webp: the HSH26 mylar bag renders (only Electric Grape, Peachy Mango, Watermelon Jolt
#   were supplied), cropped to their alpha bounds
# - pack/bags-trio-{1400,760}.webp: those three bags fanned as on the HSH26 NJ one-sheet (Peachy Mango back left,
#   Electric Grape back right, Watermelon Jolt in front)
# - photo/<key>-<w>.webp: the studio product photos and brand backgrounds, in widths up to the source's own
# - photo/og-share.jpg: the default share image (the brand surfer with the bag trio)
# All of it is the client's own art and photography, so none carries the AI label. src/content/photo-manifest.json
# lists the photo keys, their sources and sizes for src/lib/html.mjs.
import json, os
from PIL import Image, ImageFilter

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'source', 'hsh27')
PACK = os.path.join(ROOT, 'src', 'assets', 'img', 'pack')
PHOTO = os.path.join(ROOT, 'src', 'assets', 'img', 'photo')
os.makedirs(PACK, exist_ok=True)
os.makedirs(PHOTO, exist_ok=True)
LINKS = os.path.join(SRC, '1_WIP_BRAND_FILE', 'Links')
BG = os.path.join(SRC, '2_Key_Elements', '3_Background_Images')
HIST = os.path.join(SRC, '5_Historical_Photos')

TILES = {
    'tropical-typhoon': 'HSH26_Menu_TropicalTyphoon.png', 'bangin-berry': 'HSH26_Menu_BanginBerry.png',
    'watermelon-jolt': 'HSH26_Menu_WatermelonJolt.png', 'peachy-mango': 'HSH26_Menu_PeachyMango.png',
    'electric-grape': 'HSH26_Menu_ElectricGrape.png', 'remberry': 'HSH26_Menu_Sleep_Remberry.png',
    'blue-raspberry': 'HSH26_Menu_SugarFree_BlueRaspberry.png', 'lemon-burst': 'HSH26_Menu_LTD_LemonBurst.png',
    'prickly-pear': 'HSH26_Menu_LTD_PricklyPear.png',
}
BAGS = {'electric-grape': 'HSH26_NJ_Mylar_ELECTRICGRAPE.png', 'peachy-mango': 'HSH26_NJ_Mylar_PEACHYMANGO.png',
        'watermelon-jolt': 'HSH26_NJ_Mylar_WATERMELONJOLT.png'}


def fit(im, w):
    return im if im.size[0] <= w else im.resize((w, round(im.size[1] * w / im.size[0])), Image.LANCZOS)


for slug, f in TILES.items():
    im = Image.open(os.path.join(LINKS, f)).convert('RGB')
    for w in (680, 340, 160):
        fit(im, w).save(os.path.join(PACK, '%s-%d.webp' % (slug, w)), 'WEBP', quality=84, method=6)
    im.save(os.path.join(PACK, '%s-og.jpg' % slug), 'JPEG', quality=86, optimize=True, progressive=True)
print('tiles', len(TILES))

dims = {'tile': [[680, 680], [340, 340], [160, 160]]}
bags = {}
for slug, f in BAGS.items():
    im = Image.open(os.path.join(LINKS, f)).convert('RGBA')
    im = im.crop(im.getchannel('A').point(lambda a: 255 if a > 2 else 0).getbbox())
    bags[slug] = im
    dims['bag'] = []
    for w in (900, 480):
        out = fit(im, w)
        out.save(os.path.join(PACK, 'bag-%s-%d.webp' % (slug, out.size[0])), 'WEBP', quality=86, method=6)
        dims['bag'].append(list(out.size))
    print('bag', slug, im.size)


def trio():
    W, H = 1600, 1000
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for slug, scale, angle, cx, cy in (('peachy-mango', .74, 7, .3, .38), ('electric-grape', .74, -7, .7, .38),
                                       ('watermelon-jolt', .9, 0, .5, .6)):
        b = bags[slug]
        b = b.resize((round(b.size[0] * scale), round(b.size[1] * scale)), Image.LANCZOS)
        b = b.rotate(angle, resample=Image.BICUBIC, expand=True)
        canvas.alpha_composite(b, (round(W * cx - b.size[0] / 2), round(H * cy - b.size[1] / 2)))
    return canvas.crop(canvas.getchannel('A').point(lambda a: 255 if a > 2 else 0).getbbox())


tr = trio()
dims['trio'] = []
for w in (1400, 760):
    out = fit(tr, w)
    out.save(os.path.join(PACK, 'bags-trio-%d.webp' % out.size[0]), 'WEBP', quality=86, method=6)
    dims['trio'].append(list(out.size))
print('trio', tr.size)

PHOTOS = {
    'lineup': (os.path.join(HIST, 'Copy of Copy of 0Q4A6298.jpg'), 'Hashables Tropical Typhoon, Watermelon Jolt and Peachy Mango jars stacked with pineapple, kiwi, watermelon, peach, dragon fruit and loose gummies on pink and aqua'),
    'peach-cactus': (os.path.join(HIST, 'Copy of Copy of 0Q4A6195.jpg'), 'Peachy Mango jars beside a potted cactus, a peach, a cut mango and orange gummies on a pink set'),
    'peach-pink': (os.path.join(HIST, 'Copy of Copy of 0Q4A6187.jpg'), 'A stack of Peachy Mango jars with mangoes, a peach and orange gummies on a pink set'),
    'peach-tall': (os.path.join(HIST, 'Copy of Copy of 0Q4A6212.jpg'), 'Peachy Mango jars, a cactus and cut mango on a pink set'),
    'typhoon-tower': (os.path.join(HIST, 'Copy of 0Q4A5989.jpg'), 'A tower of Tropical Typhoon jars beside a pineapple on an aqua set, blue gummies at the base'),
    'typhoon-kiwi': (os.path.join(HIST, 'Copy of 0Q4A6240.jpg'), 'Tropical Typhoon jars with kiwi and pineapple on an aqua set'),
    'watermelon-pink': (os.path.join(HIST, 'Copy of IMG_8496.JPG'), 'Watermelon Jolt jars stacked on watermelon slices beside a cactus, pink gummies in front'),
    'watermelon-green': (os.path.join(HIST, 'Copy of IMG_8502.JPG'), 'Watermelon Jolt jars with watermelon wedges and a cup of pink gummies on a green set'),
    'flatlay': (os.path.join(HIST, 'Copy of Hashables-Flavors.jpeg'), 'Hashables jars from above among kiwi, dragon fruit, mango and gummies'),
    'gummies': (os.path.join(HIST, 'gummies-slider.jpg'), 'A stack of colourful Hashables gummies among watermelon, kiwi, peach, mango and pineapple'),
    'typhoon-gummies': (os.path.join(HIST, 'HASH-TROPICAL-TYPHOON-GUMMIES.jpg'), 'Blue Tropical Typhoon gummies on a mirror under a paper umbrella'),
    'surfer': (os.path.join(BG, 'Surfer_Desk.png'), ''),
    'surfer-sunset': (os.path.join(BG, 'Surfer_Original.jpeg'), ''),
    'milkyway': (os.path.join(BG, 'Sleep_MilkyWay_Fade.tif'), ''),
    'palms-pink-inv': (os.path.join(BG, 'Palms_Pink_Inverted.png'), ''),
    'palms-yellow': (os.path.join(BG, 'Palms_Yellow_Desk.png'), ''),
    'spectrum': (os.path.join(BG, 'Gradient_FullSpectrum.jpg'), ''),
}
manifest = {}
for key, (src, alt) in PHOTOS.items():
    im = Image.open(src)
    if im.mode in ('RGBA', 'LA'):
        flat = Image.new('RGB', im.size, (24, 74, 92))
        flat.paste(im.convert('RGBA'), mask=im.convert('RGBA').getchannel('A'))
        im = flat
    im = im.convert('RGB')
    if key == 'milkyway':   # the file fades to white below the galaxy: keep the night sky
        im = im.crop((0, 0, im.size[0], round(im.size[1] * .56)))
    sizes = []
    for w in (2400, 1600, 960, 640):
        if w > im.size[0] and sizes:
            continue
        out = fit(im, w)
        p = os.path.join(PHOTO, '%s-%d.webp' % (key, out.size[0]))
        out.save(p, 'WEBP', quality=78, method=6)
        sizes.append([out.size[0], out.size[1], os.path.getsize(p)])
    manifest[key] = {'src': os.path.relpath(src, ROOT).replace('\\', '/'), 'w': im.size[0], 'h': im.size[1], 'alt': alt, 'sizes': sizes}
    print('photo', key, [s[0] for s in sizes])

# default share image: the brand surfer with the bag trio
sf = Image.open(os.path.join(PHOTO, 'surfer-2400.webp')).convert('RGB')
sw, sh = sf.size
crop_h = round(sw * 630 / 1200)
og = sf.crop((0, sh - crop_h, sw, sh)).resize((1200, 630), Image.LANCZOS).convert('RGBA')
t = fit(tr, 760)
og.alpha_composite(t, ((1200 - t.size[0]) // 2, 630 - t.size[1] - 24))
og.convert('RGB').save(os.path.join(PHOTO, 'og-share.jpg'), 'JPEG', quality=86, optimize=True, progressive=True)

out = {'note': 'The client\'s own photography and brand art from the HSH27 brand folder (tools/brand-assets.py). The jar photos show the earlier jar packaging.',
       'pack': dims, 'photos': manifest}
json.dump(out, open(os.path.join(ROOT, 'src', 'content', 'photo-manifest.json'), 'w'), indent=1)
print('manifest', len(PHOTOS), 'photos')
