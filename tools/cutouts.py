# cutouts.py - transparent layers from Hashables' own art (assets/source -> src/assets/img/cut/).
#   python -I tools/cutouts.py
# 1. Flavor cube stacks: each *-hsh-gummy-site-v1.webp is a stack of sugar-dusted cubes on white with the flavor name
#    below and, on some, a yellow badge to the upper right. Keep ONLY the largest non-white connected region (the
#    stack), fill its holes (white sugar sparkles), feather the edge 1px and un-mix the white fringe, crop, save RGBA.
# 2. Palm silhouettes: Pink_Palms_Hashables_DSK_Background.webp is maroon palms on flat pink; alpha from how much
#    darker each pixel is than the pink field, colour kept as the palm's own maroon.
import os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'source')
OUT = os.path.join(ROOT, 'src', 'assets', 'img', 'cut')
os.makedirs(OUT, exist_ok=True)

FLAVORS = {
    'tropical-typhoon': 'tropical-typhoon', 'bangin-berry': 'bangin-berry', 'watermelon-jolt': 'watermelon-jolt',
    'peachy-mango': 'peachymango', 'electric-grape': 'electric-grape', 'lemon-burst': 'lemonburst',
    'prickly-pear': 'pricklypear', 'blue-raspberry': 'bluerazz', 'remberry': 'remberry-withml',
}
report = []
for slug, stem in FLAVORS.items():
    im = Image.open(os.path.join(SRC, '2026__09__' + stem + '-hsh-gummy-site-v1.webp')).convert('RGB')
    a = np.asarray(im).astype(np.float32)
    nonwhite = (a.min(axis=2) < 232)
    nonwhite = ndi.binary_closing(nonwhite, iterations=2)
    lab, n = ndi.label(nonwhite)
    sizes = ndi.sum(nonwhite, lab, range(1, n + 1))
    k = int(np.argmax(sizes)) + 1
    mask = ndi.binary_fill_holes(lab == k)
    # second-largest component share, so a stack fused with its label would show up in the report
    srt = sorted(sizes, reverse=True)
    ys, xs = np.where(mask)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    # the source cut is hard-edged and stair-stepped: drop its 2px border, then feather a fresh edge
    # the steps are 4-8px blocks baked into the source art: round them off (blur the mask, re-threshold), then pull
    # the edge 2px inside so the dark specks along the old boundary fall outside
    smooth = ndi.gaussian_filter(mask.astype(np.float32), 4.0) > 0.6
    core = ndi.binary_erosion(smooth, iterations=4)
    alpha = Image.fromarray((core * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1))
    al = np.asarray(alpha).astype(np.float32) / 255.0
    # every pixel takes the colour of its nearest core pixel, so the feathered rim carries cube colour, never white
    _, (iy, ix) = ndi.distance_transform_edt(~core, return_indices=True)
    rgb = a[iy, ix]
    rgba = np.dstack([rgb, al * 255.0]).astype(np.uint8)
    pad = 10
    crop = rgba[max(0, y0 - pad):y1 + pad + 1, max(0, x0 - pad):x1 + pad + 1]
    out = Image.fromarray(crop, 'RGBA')
    out.save(os.path.join(OUT, 'cubes-' + slug + '.png'), optimize=True)
    out.save(os.path.join(OUT, 'cubes-' + slug + '.webp'), quality=90, method=6)
    report.append((slug, out.size, int(srt[0]), int(srt[1]) if len(srt) > 1 else 0, n))

for r in report:
    print('cubes %-17s %4dx%-4d main=%7d second=%6d components=%d' % (r[0], r[1][0], r[1][1], r[2], r[3], r[4]))

# palms
im = Image.open(os.path.join(SRC, '2026__09__Pink_Palms_Hashables_DSK_Background.webp')).convert('RGB')
a = np.asarray(im).astype(np.float32)
L = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
bg = np.median(L[:200, 900:1300])          # open pink sky between the palms
palm = np.percentile(L, 2)
alpha = np.clip((bg - L) / max(1.0, (bg - palm)) * 1.15, 0, 1)
alpha[alpha < 0.06] = 0
col = np.array([42, 8, 30], dtype=np.float32)   # deep maroon, a touch darker than the art
rgba = np.dstack([np.broadcast_to(col, a.shape), alpha * 255.0]).astype(np.uint8)
out = Image.fromarray(rgba, 'RGBA')
out.save(os.path.join(OUT, 'palms.png'), optimize=True)
w = 1600
out.resize((w, round(out.size[1] * w / out.size[0])), Image.LANCZOS).save(os.path.join(OUT, 'palms-1600.webp'), quality=88, method=6)
print('palms bgL=%.1f palmL=%.1f size=%s' % (bg, palm, out.size))
