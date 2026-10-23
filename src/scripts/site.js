/* Hashables redesign - interactions. No dependencies. Every effect respects prefers-reduced-motion. */
(() => {
  const d = document, w = window, root = d.documentElement;
  const qs = (s, r = d) => r.querySelector(s), qsa = (s, r = d) => [...r.querySelectorAll(s)];
  const reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = w.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const params = new URLSearchParams(location.search);
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const sess = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  root.classList.add('js');
  if (params.has('static')) root.classList.remove('js');   // QA: everything visible, no reveal

  /* ---------- focus trap helper ---------- */
  const focusables = (el) => qsa('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', el).filter((x) => x.offsetParent !== null);
  function trap(el, e) {
    if (e.key !== 'Tab') return;
    const f = focusables(el); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- age gate ---------- */
  const gate = qs('[data-gate]');
  if (params.get('age') === 'ok') store.set('hsh-21', '1');
  if (gate && store.get('hsh-21') !== '1') {
    gate.hidden = false; d.body.classList.add('gate-open');
    const yes = qs('[data-gate-yes]', gate);
    setTimeout(() => yes && yes.focus(), 60);
    gate.addEventListener('keydown', (e) => trap(gate, e));
    yes && yes.addEventListener('click', () => { store.set('hsh-21', '1'); gate.hidden = true; d.body.classList.remove('gate-open'); const m = qs('#main'); m && m.focus({ preventScroll: true }); });
  }

  /* ---------- header ---------- */
  const hdr = qs('[data-hdr]');
  const onScrollHdr = () => hdr && hdr.classList.toggle('is-scrolled', w.scrollY > 24);
  onScrollHdr();
  const here = location.pathname.replace(/index\.html$/, '');
  qsa('.hdr__nav a').forEach((a) => { const p = new URL(a.href).pathname; if (p !== '/' && here.startsWith(p) && p.length > 1) a.setAttribute('aria-current', 'page'); });

  /* ---------- drawer ---------- */
  const drawer = qs('[data-drawer]'), opener = qs('[data-menu-open]');
  let lastFocus = null;
  function openDrawer() { if (!drawer) return; lastFocus = d.activeElement; drawer.hidden = false; d.body.style.overflow = 'hidden'; opener && opener.setAttribute('aria-expanded', 'true'); setTimeout(() => { const c = qs('.drawer__close', drawer); c && c.focus(); }, 30); }
  function closeDrawer() { if (!drawer || drawer.hidden) return; drawer.hidden = true; d.body.style.overflow = ''; opener && opener.setAttribute('aria-expanded', 'false'); lastFocus && lastFocus.focus && lastFocus.focus(); }
  opener && opener.addEventListener('click', openDrawer);
  qsa('[data-menu-close]').forEach((b) => b.addEventListener('click', closeDrawer));
  drawer && drawer.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); trap(drawer, e); });
  drawer && qsa('a', drawer).forEach((a) => a.addEventListener('click', () => { if (a.hash && a.pathname === location.pathname) closeDrawer(); }));

  /* ---------- background videos ---------- */
  const vids = qsa('video[data-bgvideo]');
  const toggle = qs('[data-video-toggle]');
  const saveData = navigator.connection && navigator.connection.saveData;
  let userPaused = sess.get('hsh-vid-paused') === '1';
  const setToggle = () => { if (!toggle) return; toggle.setAttribute('aria-pressed', String(userPaused)); toggle.setAttribute('aria-label', userPaused ? 'Play the background video' : 'Pause the background video'); toggle.innerHTML = `<svg class="ico" aria-hidden="true"><use href="#i-${userPaused ? 'play' : 'pause'}"></use></svg>`; };
  if (reduce || saveData) { if (toggle) toggle.hidden = true; }
  else if (vids.length) {
    const load = (v) => { if (v.dataset.loaded) return; v.dataset.loaded = '1'; v.src = w.innerWidth < 900 ? v.dataset.srcSm : v.dataset.srcLg; v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true }); };
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { const v = en.target; if (en.isIntersecting) { load(v); if (!userPaused) v.play().catch(() => {}); } else v.pause(); }), { rootMargin: '200px 0px' });
    vids.forEach((v) => { v.muted = true; io.observe(v); });
    setToggle();
    toggle && toggle.addEventListener('click', () => { userPaused = !userPaused; sess.set('hsh-vid-paused', userPaused ? '1' : '0'); vids.forEach((v) => (userPaused ? v.pause() : v.dataset.loaded && v.play().catch(() => {}))); setToggle(); });
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = qsa('[data-reveal]');
  if (root.classList.contains('js')) {
    if ('IntersectionObserver' in w && !reduce) {
      const rio = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      reveals.forEach((el) => rio.observe(el));
      // failsafe: anything in the first screen shows at once; nothing stays hidden if the observer never fires
      const inView = () => reveals.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
      requestAnimationFrame(inView); setTimeout(inView, 900);
      setTimeout(() => reveals.forEach((el) => el.classList.add('is-in')), 6000);
    } else reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- parallax depth ---------- */
  const px = reduce ? [] : qsa('[data-parallax]');
  let ticking = false;
  function paint() {
    ticking = false;
    const vh = innerHeight;
    for (const el of px) {
      const host = el.parentElement || el;
      const r = host.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const f = parseFloat(el.dataset.parallax) || 0;
      const off = (r.top + r.height / 2 - vh / 2) * -f;
      el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
    }
  }
  const onScroll = () => { onScrollHdr(); if (!ticking && px.length) { ticking = true; requestAnimationFrame(paint); } };
  w.addEventListener('scroll', onScroll, { passive: true });
  w.addEventListener('resize', onScroll);
  paint();

  /* ---------- tilt + glare ---------- */
  if (fine && !reduce) {
    qsa('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((x - 0.5) * 9).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * 7).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- tabs ---------- */
  qsa('[data-tabs]').forEach((box) => {
    const tabs = qsa('[role="tab"]', box);
    const select = (t, focus) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; const p = d.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
      if (focus) t.focus();
      const p = d.getElementById(t.getAttribute('aria-controls'));
      p && qsa('[data-reveal]', p).forEach((el) => el.classList.add('is-in'));
      paint();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = e.key; let n = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (k === 'ArrowLeft' || k === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === 'Home') n = tabs[0]; if (k === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* ---------- FAQ search ---------- */
  const fs = qs('[data-faq-search]');
  if (fs) {
    const items = qsa('[data-faq-item]'), topics = qsa('[data-faq-topic]'), none = qs('[data-faq-none]');
    fs.addEventListener('input', () => {
      const q = fs.value.trim().toLowerCase();
      let shown = 0;
      items.forEach((it) => { const hit = !q || it.textContent.toLowerCase().includes(q); it.hidden = !hit; if (hit) shown++; if (q && hit && q.length > 2) it.open = true; if (!q) it.open = false; });
      topics.forEach((t) => { t.hidden = !qsa('[data-faq-item]', t).some((it) => !it.hidden); });
      if (none) none.hidden = shown > 0;
    });
  }

  /* ---------- blog filter ---------- */
  const fb = qs('[data-filter]');
  if (fb) {
    const btns = qsa('button', fb), cells = qsa('.bgrid__cell');
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const c = b.dataset.cat;
      cells.forEach((cell) => { cell.hidden = !(c === '*' || cell.dataset.cat === c); });
      qsa('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    }));
  }

  /* ---------- YouTube facade (no request to YouTube until asked) ---------- */
  qsa('[data-yt]').forEach((box) => {
    const btn = qs('button', box);
    btn && btn.addEventListener('click', () => {
      const f = d.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${box.dataset.yt}?autoplay=1&rel=0`;
      f.title = 'What are Hashables? (YouTube video)';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      box.replaceChildren(f);
      f.focus();
    });
  });

  /* ---------- mailto forms (no backend, nothing stored) ---------- */
  qsa('form[data-mailto]').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const lines = []; let subject = form.dataset.subject || 'Hashables';
    for (const [k, v] of fd.entries()) { if (String(v).trim()) lines.push(`${k}: ${v}`); }
    const first = [...fd.values()].find((v) => String(v).trim());
    if (first) subject += ': ' + String(first).slice(0, 60);
    location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n') + '\n\nSent from hashables.com')}`;
  }));

  /* ---------- store finder hints ---------- */
  qsa('[data-finder-mini]').forEach((form) => {
    const loc = qs('[data-locate]', form);
    loc && loc.addEventListener('click', () => { location.href = form.getAttribute('action') + '?near=me#finder'; });
  });
  const hint = qs('[data-town-hint]');
  const showHint = (msg) => { if (!hint) return; hint.textContent = msg; hint.hidden = false; };
  if (hint) {
    const town = (params.get('town') || '').trim().slice(0, 60);
    if (town) showHint(`Looking near ${town}? Type “${town}” into the search box on the map and pick a shop from the list.`);
    else if (params.get('near') === 'me') showHint('Tap the location button on the map and allow location access. Shops near you will appear on the map and in the list.');
  }
  qsa('[data-locate-scroll]').forEach((b) => b.addEventListener('click', () => {
    showHint('Tap the location button on the map and allow location access. Shops near you will appear on the map and in the list.');
    const m = qs('.finder__map'); m && m.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }));
})();
