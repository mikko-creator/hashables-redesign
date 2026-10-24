# palms.py - the home hero's coconut palms (revision 4), from the fal render assets/generated/p-palms-b.jpg: two
# black palm silhouettes on white (AI-generated; prompt in src/content/palm-plan.json). They replace the cut-out of
# the client's posterised pink-palms art, whose fronds keyed out speckled.
#   python -I tools/palms.py
# 1. alpha from luminance on a smoothstep ramp (L <= 50 opaque, L >= 205 clear), so JPEG ringing never shows;
# 2. the bushes and ground at the foot of the render are cut off: the cut sits above the first row whose dark pixels
#    outnumber the two trunks;
# 3. specks under 40 px (and pinholes under 12 px) are dropped;
# 4. the alpha is upsampled 1.5x (Lanczos) and re-sharpened by a narrow ramp, so the edge stays crisp on 2x screens;
# 5. the frame is split at its empty centre into a left and a right palm, each cropped to its own bounds;
# 6. one flat colour (--dusk #1a0b2e), saved as WebP with the IPTC trainedAlgorithmicMedia XMP (tools/ai-label.xmp).
import os
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'generated', 'p-palms-b.jpg')
OUT = os.path.join(ROOT, 'src', 'assets', 'img', 'cut')
XMP = open(os.path.join(ROOT, 'tools', 'ai-label.xmp'), 'rb').read()
COLOUR = (26, 11, 46)   # --dusk
SCALE = 1.5


def ramp(x, lo, hi):
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


a = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
L = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
alpha = 1 - ramp(L, 50, 205)
H, W = alpha.shape

# 2. foot of the render: below y=1100 a row crosses only the two trunks, until the first bush leaf tip adds a third run
def runs(row):   # dark runs at least 3 px wide (a 1 px JPEG speck beside a trunk is not a leaf)
    on = np.r_[False, row > 0.5, False].astype(np.int8)
    d = np.diff(on)
    return int(((np.flatnonzero(d == -1) - np.flatnonzero(d == 1)) >= 3).sum())

assert all(runs(alpha[y]) == 2 for y in range(1100, 1200)), 'expected only the two trunks below y=1100'
start = next(y for y in range(1100, H) if runs(alpha[y]) > 2)
cut = start - 6
alpha = alpha[:cut]
trunks = int((alpha[cut - 1] > 0.5).sum())

# 3. specks and pinholes
solid = alpha > 0.5
lab, n = ndimage.label(solid)
area = ndimage.sum(solid, lab, range(1, n + 1))
specks = np.isin(lab, 1 + np.flatnonzero(area < 40))
alpha[ndimage.binary_dilation(specks, iterations=2) & ~ndimage.binary_dilation(~specks & solid, iterations=1)] = 0
holes, m = ndimage.label(~solid)
harea = ndimage.sum(~solid, holes, range(1, m + 1))
pin = np.isin(holes, 1 + np.flatnonzero(harea < 12))
alpha[pin] = 1

# 4. upsample, re-sharpen
up = Image.fromarray(alpha.astype(np.float32), 'F').resize((round(W * SCALE), round(cut * SCALE)), Image.LANCZOS)
alpha2 = ramp(np.asarray(up), 0.22, 0.78)

# 5. split at the widest empty column band around the centre
cols = (alpha2 > 0.02).sum(0)
mid = alpha2.shape[1] // 2
empty = np.flatnonzero(cols[mid - 400:mid + 400] == 0) + mid - 400
bands = np.split(empty, np.flatnonzero(np.diff(empty) != 1) + 1)
band = max(bands, key=len)
split = int(band[len(band) // 2])
print('render %dx%d  trunks %dpx wide at the cut  first bush tip at y=%d, cut at %d  specks %d  pinholes %d  split x=%d (empty %d..%d, scaled)' % (
    W, H, trunks, start, cut, int((area < 40).sum()), int((harea < 12).sum()), split, band[0], band[-1]))

for side, part in (('l', alpha2[:, :split]), ('r', alpha2[:, split:])):
    ys, xs = np.nonzero(part > 0.02)
    box = (xs.min(), ys.min(), xs.max() + 1, part.shape[0])   # keep the bottom edge: the trunk runs off it
    crop = part[box[1]:box[3], box[0]:box[2]]
    rgba = np.zeros(crop.shape + (4,), np.uint8)
    rgba[..., :3] = COLOUR
    rgba[..., 3] = np.round(crop * 255).astype(np.uint8)
    im = Image.fromarray(rgba, 'RGBA')
    dst = os.path.join(OUT, 'hero-palm-%s.webp' % side)
    im.save(dst, 'WEBP', lossless=True, method=6, xmp=XMP)
    print(side, im.size, '%d bytes' % os.path.getsize(dst), 'box', tuple(int(v) for v in box))
