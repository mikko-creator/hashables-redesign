# thumbs.py - small cube-stack thumbnails for the header mega menu and the mobile drawer (shown at ~56-64 px, so a
# 220 px WebP covers 3x screens at a fraction of the 660 px cut-out's weight).
#   python -I tools/thumbs.py
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
CUT = ROOT / 'src' / 'assets' / 'img' / 'cut'
W = 220
n = 0
for png in sorted(CUT.glob('cubes-*.png')):
    im = Image.open(png).convert('RGBA')
    h = round(im.height * W / im.width)
    out = CUT / (png.stem + '-sm.webp')
    im.resize((W, h), Image.LANCZOS).save(out, 'WEBP', quality=84, method=6)
    print(f'{out.name} {W}x{h} {out.stat().st_size} B')
    n += 1
if n == 0:
    raise SystemExit('no cubes-*.png cut-outs found')
