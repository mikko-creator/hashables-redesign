# derive.py - responsive WebP derivatives for the build (src/assets/img/...), Node-free and dependency-light (Pillow).
#   python -I tools/derive.py
# Generated stills (assets/generated/*.jpg from fal, tmp/hf/H-*.img from Higgsfield) -> src/assets/img/gen/<id>-<w>.webp,
# each carrying the IPTC trainedAlgorithmicMedia XMP (tools/ai-label.xmp), because a WebP re-encode drops the JPEG's
# APP1 label. Brand files from assets/source -> src/assets/img/brand/ (the client's own art: no AI label).
import os, json
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XMP = open(os.path.join(ROOT, 'tools', 'ai-label.xmp'), 'rb').read()
GEN = os.path.join(ROOT, 'src', 'assets', 'img', 'gen')
BRAND = os.path.join(ROOT, 'src', 'assets', 'img', 'brand')
os.makedirs(GEN, exist_ok=True); os.makedirs(BRAND, exist_ok=True)

WIDE = [2400, 1600, 960]
SMALL = [1600, 960, 640]
jobs = {
    's-hero': ('assets/generated/s-hero.jpg', WIDE), 's-wave': ('assets/generated/s-wave.jpg', WIDE),
    's-night': ('assets/generated/s-night.jpg', WIDE),
    's-bud': ('assets/generated/s-bud.jpg', SMALL), 's-frozen': ('assets/generated/s-frozen.jpg', SMALL),
    's-rosin': ('assets/generated/s-rosin.jpg', SMALL),
    'h-coast': ('tmp/hf/H-COAST.img', [2048, 1600, 960]), 'h-boards': ('tmp/hf/H-BOARDS.img', [2048, 1600, 960]),
    'h-towel': ('tmp/hf/H-TOWEL.img', [2048, 1600, 960]),
}
for f in ['tropical-typhoon', 'bangin-berry', 'watermelon-jolt', 'peachy-mango', 'electric-grape', 'lemon-burst',
          'prickly-pear', 'blue-raspberry', 'remberry']:
    jobs['f-' + f] = ('assets/generated/f-' + f + '.jpg', [2400, 1600, 960, 640])

manifest = {}
for key, (src, widths) in jobs.items():
    im = Image.open(os.path.join(ROOT, src)).convert('RGB')
    manifest[key] = {'src': src, 'w': im.size[0], 'h': im.size[1], 'sizes': []}
    for w in widths:
        if w > im.size[0]:
            continue
        h = round(im.size[1] * w / im.size[0])
        out = os.path.join(GEN, '%s-%d.webp' % (key, w))
        im.resize((w, h), Image.LANCZOS).save(out, 'WEBP', quality=78, method=6, xmp=XMP)
        manifest[key]['sizes'].append([w, h, os.path.getsize(out)])
    print(key, manifest[key]['sizes'])

# brand art (client-owned)
def keep(src, dst, width=None, q=88):
    im = Image.open(os.path.join(ROOT, 'assets', 'source', src))
    if width and im.size[0] > width:
        im = im.resize((width, round(im.size[1] * width / im.size[0])), Image.LANCZOS)
    im.save(os.path.join(BRAND, dst), quality=q, method=6)
    print('brand', dst, im.size)
keep('2026__09__Asset-33hsh-trophies-hd-copy.webp', 'awards-badges.webp')
keep('2026__09__Pink_Palms_Hashables_DSK_Background.webp', 'pink-palms-2146.webp', None, 80)
keep('2026__09__Pink_Palms_Hashables_DSK_Background.webp', 'pink-palms-1200.webp', 1200, 78)
keep('2020__09__hash-gradient-bg.jpg', 'swirl.webp', 1920, 72)
keep('2026__09__Black_Swirls_Hashables_DSK_Background.webp', 'swirl-black-1920.webp', 1920, 74)
keep('2026__09__Yellow_Palms_Hashables_DSK_Background.webp', 'yellow-palms-1600.webp', 1600, 76)
keep('2023__12__what-are-hashables-thumbnail-site.jpg', 'what-are-hashables.webp', 1280, 80)
json.dump(manifest, open(os.path.join(ROOT, 'src', 'content', 'image-manifest.json'), 'w'), indent=1)
