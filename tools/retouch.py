# retouch.py - remove the garbled marks an image model printed on garments and boards, deterministically.
#   python -I tools/retouch.py
# Each mark is covered with a clone of clean surface from the same garment or board (offset dx, dy), so the real
# texture and grain come along. A membrane correction then matches the clone's colour to the pixels just above and
# just below the mark, column by column, with the boundary differences smoothed sideways so a stray strand or fold at
# the edge cannot streak through. The edge is feathered by 1.2 px. No randomness: same raw in, same bytes out.
# Revision 7: G-RACK (Higgsfield Soul) printed five circular "logos" on the tees and three decals on the surfboard,
# against the house rule of no text, logos or marks. The raw stays in tmp/hf (git-ignored; its sha256 goes in the
# sidecar). The retouched JPEG is the tracked source that tools/derive.py reads.
import os, sys, json, hashlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# The board leans: its stringer runs from x 131 at y 645 to x 83 at y 1150 (measured), so a clone taken dy rows lower
# sits -0.095 * dy columns to the left.
LEAN = -0.095
JOBS = {
    'G-RACK': {
        'raw': 'tmp/hf/G-RACK.img', 'out': 'assets/generated/g-rack.jpg',
        # shape: ('e', cx, cy, rx, ry) ellipse, ('p', [(x, y), ...]) polygon, ('r', x0, y0, x1, y1) rectangle, in raw
        # pixels; src: (dx, dy) of the clean surface to clone; dy None = straight down by the mark's height + 6
        'marks': [
            (('e', 468, 599, 18, 19), (0, None), 'coral tee emblem'),
            (('e', 705, 585, 17, 19), (0, None), 'violet tee emblem'),
            (('e', 937, 610, 22, 22), (0, None), 'pink tee emblem'),
            (('e', 1225, 590, 25, 21), (0, None), 'yellow tee emblem'),
            (('e', 1582, 571, 26, 25), (0, None), 'aqua tee emblem'),
            (('p', [(154, 473), (95, 560), (197, 560)]), (round(LEAN * 175), 175), 'board triangle decal'),
            (('r', 91, 578, 172, 631), (round(LEAN * 70), 70), 'board black decal'),
            (('r', 42, 1072, 71, 1136), (round(LEAN * -72), -72), 'board rail sticker'),
        ],
    },
}

def shape_mask(size, shape):
    m = Image.new('L', size, 0)
    d = ImageDraw.Draw(m)
    if shape[0] == 'e':
        _, cx, cy, rx, ry = shape
        d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
    elif shape[0] == 'p':
        d.polygon(shape[1], fill=255)
    else:
        _, x0, y0, x1, y1 = shape
        d.rectangle((x0, y0, x1, y1), fill=255)
    return m

def smooth(v, k=7):
    # moving average across neighbouring columns, edges padded
    pad = np.pad(v, ((k // 2, k // 2), (0, 0)), mode='edge')
    return np.array([pad[i:i + k].mean(axis=0) for i in range(len(v))])

def run(key, job):
    raw = os.path.join(ROOT, job['raw'])
    src = Image.open(raw).convert('RGB')
    orig = np.asarray(src).astype(np.float64)
    H, W = orig.shape[:2]
    masks = [shape_mask(src.size, shape) for shape, _s, _n in job['marks']]
    grows = [np.asarray(m.filter(ImageFilter.MaxFilter(5))) > 127 for m in masks]   # 2 px past each mark
    every = np.logical_or.reduce(grows)
    out = orig.copy()
    log = []
    for (shape, (dx, dy), name), m, g in zip(job['marks'], masks, grows):
        ys, xs = np.nonzero(g)
        if dy is None:
            dy = int(ys.max() - ys.min() + 1 + 6)
        # fail closed: the clone source must be clean surface inside the frame, never another mark
        sy, sx = ys + dy, xs + dx
        if sy.min() < 3 or sy.max() >= H - 3 or sx.min() < 0 or sx.max() >= W:
            raise SystemExit('%s: clone source leaves the frame' % name)
        if every[sy, sx].any():
            raise SystemExit('%s: clone source overlaps a mark' % name)
        cols = np.unique(xs)
        dt, db, runs = [], [], []
        for x in cols:
            yy = ys[xs == x]
            y0, y1 = yy.min(), yy.max()
            if len(yy) != y1 - y0 + 1:
                raise SystemExit('%s: column %d has two runs' % (name, x))
            dt.append(orig[y0 - 3:y0, x].mean(axis=0) - orig[y0 - 3 + dy:y0 + dy, x + dx].mean(axis=0))
            db.append(orig[y1 + 1:y1 + 4, x].mean(axis=0) - orig[y1 + 1 + dy:y1 + 4 + dy, x + dx].mean(axis=0))
            runs.append((x, y0, y1))
        dt, db = smooth(np.array(dt)), smooth(np.array(db))
        fill = orig.copy()
        for (x, y0, y1), a, b in zip(runs, dt, db):
            n = y1 - y0 + 1
            t = ((np.arange(n) + 1) / (n + 1))[:, None]
            fill[y0:y1 + 1, x] = orig[y0 + dy:y1 + 1 + dy, x + dx] + a[None, :] * (1 - t) + b[None, :] * t
        alpha = np.asarray(Image.fromarray((g * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float64) / 255
        alpha[np.asarray(m) > 127] = 1.0
        alpha[~g] = 0.0
        out = out * (1 - alpha[:, :, None]) + fill * alpha[:, :, None]
        log.append({'mark': name, 'clone': [int(dx), int(dy)], 'pixels': int(g.sum())})
    res = Image.fromarray(np.clip(np.rint(out), 0, 255).astype(np.uint8))
    dst = os.path.join(ROOT, job['out'])
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    res.save(dst, 'JPEG', quality=92, subsampling=0, optimize=True)
    rec = {'raw': job['raw'], 'rawSha256': hashlib.sha256(open(raw, 'rb').read()).hexdigest(), 'out': job['out'],
           'outSha256': hashlib.sha256(open(dst, 'rb').read()).hexdigest(), 'size': list(res.size), 'marks': log}
    print(key, json.dumps(rec))
    return rec

if __name__ == '__main__':
    only = set(sys.argv[1:])
    for k, j in JOBS.items():
        if not only or k in only:
            run(k, j)
