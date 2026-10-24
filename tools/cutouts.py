# cutouts.py - transparent layers from Hashables' own art (assets/source -> src/assets/img/cut/).
#   python -I tools/cutouts.py
# Palm silhouettes: Pink_Palms_Hashables_DSK_Background.webp is maroon palms on flat pink; alpha from how much
#    darker each pixel is than the pink field, colour kept as the palm's own maroon.
# (The flavor cube-stack cut-outs this script used to make were retired in revision 6: the site shows the HSH26
# packaging art from tools/brand-assets.py instead.)
import os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'source')
OUT = os.path.join(ROOT, 'src', 'assets', 'img', 'cut')
os.makedirs(OUT, exist_ok=True)

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
