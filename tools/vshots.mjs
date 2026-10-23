// vshots.mjs - viewport screenshots at exact sizes and DPRs (the operator reviews at 1280x585 @1.5), at several scroll
// positions, plus overflow / broken-image checks. Uses tools/cdp.mjs (headless Chrome, network guard: local only).
//   node tools/vshots.mjs --base http://127.0.0.1:8791 --pages /,/find-us/ --vp 1280x585@1.5,390x844@3m --steps 3 --out tmp/shots/r1
import fs from 'node:fs';
import path from 'node:path';
import { launch, sleep } from './cdp.mjs';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? a.concat([[v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]]) : a), []));
const base = args.base || 'http://127.0.0.1:8791';
const pages = String(args.pages || '/').split(',');
const vps = String(args.vp || '1280x585@1.5').split(',').map((s) => { const m = /^(\d+)x(\d+)@([\d.]+)(m?)$/.exec(s); return { w: +m[1], h: +m[2], dpr: +m[3], mobile: !!m[4] }; });
const steps = Number(args.steps ?? 2);
const out = path.resolve(args.out || 'tmp/shots/v');
fs.mkdirSync(path.dirname(out), { recursive: true });
const b = await launch({ port: 0 });
const report = [];
try {
  for (const vp of vps) {
    for (const pg of pages) {
      const p = await b.newPage({ width: vp.w, height: vp.h, mobile: vp.mobile });
      await p.send('Emulation.setDeviceMetricsOverride', { width: vp.w, height: vp.h, deviceScaleFactor: vp.dpr, mobile: vp.mobile });
      if (args.motion !== 'on') await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      const url = base + pg + (pg.includes('?') ? '&' : '?') + 'age=ok&static';
      await p.goto(url, { settle: 700, timeout: 60000 });
      const iw = await p.eval('innerWidth');
      // with mobile emulation an overflowing page widens the layout viewport: that is a finding, not a tool failure
      if (iw !== vp.w && !(vp.mobile && iw > vp.w)) throw new Error(`viewport not applied: wanted ${vp.w} got ${iw}`);
      if (iw !== vp.w) console.log(`  ! ${pg} at ${vp.w}: layout viewport grew to ${iw} (horizontal overflow)`);
      await p.eval('document.fonts.ready.then(() => true)');
      const H = await p.eval('document.documentElement.scrollHeight');
      for (let y = 0; y < H; y += vp.h) { await p.eval(`scrollTo(0, ${y})`); await sleep(120); }
      await p.eval(`Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 6000); })))`);
      const slug = (pg.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home');
      for (let k = 0; k <= steps; k++) {
        const y = Math.round(k * vp.h * 0.92);
        await p.eval(`scrollTo(0, ${y})`); await sleep(350);
        const r = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
        fs.writeFileSync(`${out}.${slug}.${vp.w}.${k}.jpg`, Buffer.from(r.data, 'base64'));
      }
      const info = await p.eval(`(() => { const sw = document.documentElement.scrollWidth; const wide = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > ${vp.w} + 0.5 && getComputedStyle(e).position !== 'fixed' && !e.closest('.hero, .phero, .pdp, .feature, .finder-band, .ftr, .band--dusk, .chill, .seam, .hscroll, .nf, .art__hero, .band--swirl, .band--palms') }).slice(0, 6).map(e => e.tagName + '.' + String(e.className).slice(0, 40)); return { sw, wide, broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')).slice(0, 6), h: document.documentElement.scrollHeight }; })()`);
      report.push({ page: pg, vp: `${vp.w}x${vp.h}@${vp.dpr}`, ...info });
      console.log(`${vp.w}x${vp.h}@${vp.dpr} ${pg} height ${info.h} scrollWidth ${info.sw}${info.sw > vp.w ? ' OVERFLOW' : ''} broken ${info.broken.length} ${info.wide.length ? 'wide: ' + info.wide.join(' ') : ''}`);
      await p.close?.();
    }
  }
} finally { await b.close(); }
fs.writeFileSync(out + '.report.json', JSON.stringify(report, null, 1));
