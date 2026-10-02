/* Novum Store — vetrina demo */
(() => {
  "use strict";

  const WA_NUMBER = "393493900045";
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches || /[?&]still\b/.test(location.search);
  const FINE_POINTER = matchMedia("(pointer: fine)").matches;

  // I capi si modificano in capi.js
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const CAT_LABELS = window.NOVUM_CATEGORIE || {};
  const ITEMS = (window.NOVUM_CAPI || [])
    .map((c) => ({ id: slug(c.nome), name: c.nome, cat: c.categoria, price: Number(c.prezzo), img: c.foto, date: c.data, alt: c.nome }))
    .sort((x, y) => y.date.localeCompare(x.date));
  const CATS = [{ id: "all", label: "Tutto" }].concat(
    Object.keys(CAT_LABELS).filter((k) => ITEMS.some((i) => i.cat === k)).map((k) => ({ id: k, label: CAT_LABELS[k] }))
  );
  const catLabelOf = (id) => CAT_LABELS[id] || id;
  const HOME_COUNT = 8;

  // Orari (ora di Roma). Giorni: 0 = domenica.
  const HOURS = { 1: [[600, 780], [960, 1200]], 2: [[600, 780], [960, 1200]], 3: [[600, 780], [960, 1200]], 4: [[600, 780], [960, 1200]], 5: [[600, 780], [960, 1200]], 6: [[600, 780], [960, 1200]], 0: [] };
  const CLOSURES = [{ from: "2026-08-07", to: "2026-08-26", note: "chiusura estiva" }];
  const DAY_NAMES = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const euro = (n) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  const pad = (n) => String(n).padStart(2, "0");
  const hhmm = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

  /* ---------------- Time in Rome ---------------- */
  function romeNow() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short"
    }).formatToParts(new Date()).map((p) => [p.type, p.value]));
    const iso = `${parts.year}-${parts.month}-${parts.day}`;
    const dow = new Date(`${iso}T12:00:00Z`).getUTCDay();
    return { iso, dow, min: Number(parts.hour) * 60 + Number(parts.minute) };
  }
  const addDays = (iso, n) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const closedOn = (iso) => CLOSURES.find((c) => iso >= c.from && iso <= c.to);
  const slotsFor = (iso) => (closedOn(iso) ? [] : HOURS[new Date(`${iso}T12:00:00Z`).getUTCDay()] || []);

  function shopStatus() {
    const now = romeNow();
    const today = slotsFor(now.iso);
    const cur = today.find(([a, b]) => now.min >= a && now.min < b);
    if (cur) {
      const left = cur[1] - now.min;
      const h = Math.floor(left / 60), m = left % 60;
      const span = h ? `${h} h ${pad(m)} min` : `${m} min`;
      return { open: true, short: `Aperto · chiude tra ${span}`, big: "Aperto ora", next: `Chiude alle ${hhmm(cur[1])}, tra ${span}.` };
    }
    for (let i = 0; i < 14; i++) {
      const iso = addDays(now.iso, i);
      const s = slotsFor(iso).find(([a]) => i > 0 || a > now.min);
      if (s) {
        const dow = new Date(`${iso}T12:00:00Z`).getUTCDay();
        const when = i === 0 ? "oggi" : i === 1 ? "domani" : DAY_NAMES[dow];
        const closure = closedOn(now.iso);
        return { open: false, short: `Chiuso · riapre ${when} ${hhmm(s[0])}`, big: closure ? "Chiuso per ferie" : "Ora chiuso", next: `Riapre ${when} alle ${hhmm(s[0])}.` };
      }
    }
    return { open: false, short: "Chiuso", big: "Ora chiuso", next: "" };
  }

  function renderStatus() {
    const st = shopStatus();
    document.body.classList.toggle("is-open", st.open);
    $$("[data-status-text]").forEach((el) => (el.textContent = st.short));
    const big = $("[data-status-big]"); if (big) big.textContent = st.big;
    const nx = $("[data-status-next]"); if (nx) nx.textContent = st.next;
    renderHours();
  }

  function renderHours() {
    const tb = $("[data-hours]"); if (!tb) return;
    const { dow } = romeNow();
    const order = [1, 2, 3, 4, 5, 6, 0];
    tb.innerHTML = order.map((d) => {
      const s = HOURS[d];
      const txt = s.length ? s.map(([a, b]) => `${hhmm(a)}–${hhmm(b)}`).join(" · ") : "Chiuso";
      const name = DAY_NAMES[d][0].toUpperCase() + DAY_NAMES[d].slice(1);
      return `<tr class="${d === dow ? "is-today" : ""}"><th scope="row">${name}</th><td>${txt}</td></tr>`;
    }).join("");
  }

  /* ---------------- Relative dates ---------------- */
  const rtf = new Intl.RelativeTimeFormat("it", { numeric: "auto" });
  function since(iso) {
    const today = romeNow().iso;
    const days = Math.round((Date.parse(`${today}T12:00:00Z`) - Date.parse(`${iso}T12:00:00Z`)) / 864e5);
    if (days < 14) return rtf.format(-days, "day");
    if (days < 60) return rtf.format(-Math.round(days / 7), "week");
    return rtf.format(-Math.round(days / 30), "month");
  }
  const dateLabel = (iso) => new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short" }).format(new Date(`${iso}T12:00:00Z`));

  /* ---------------- Ultimo arrivo (home) ---------------- */
  function initLatest() {
    const box = $("[data-latest]"); if (!box || !ITEMS.length) return;
    const it = ITEMS[0];
    box.innerHTML = `
      <a class="latest__media" href="catalogo.html#${it.id}" aria-label="Vedi ${it.name} nel catalogo">
        <img src="${it.img}" alt="${it.alt}" width="360" height="640">
      </a>
      <div class="latest__body">
        <p class="latest__when">Ultimo arrivo · <time datetime="${it.date}">${since(it.date)}</time></p>
        <h2 class="latest__name">${it.name}</h2>
        <div class="latest__row">
          <p class="price">${euro(it.price)} <span class="price__demo">demo</span></p>
          <a class="frame__ask" href="${waLink(`Ciao Novum! Vorrei info su: ${it.name}. Taglia: `)}" target="_blank" rel="noopener">Chiedi <svg class="ico"><use href="#i-arrow"/></svg></a>
        </div>
      </div>`;
  }

  /* ---------------- Catalog ---------------- */
  let setFilter = () => {};
  function initCatalog() {
    const grid = $("[data-grid]"); if (!grid) return;
    grid.innerHTML = ITEMS.slice(0, HOME_COUNT).map((it, i) => `
      <li class="item">
        <a class="item__media" href="catalogo.html#${it.id}" aria-label="Vedi ${it.name} nel catalogo">
          <img src="${it.img}" alt="${it.alt}" loading="lazy" width="360" height="640">
          ${i < 3 ? '<span class="item__flag">Nuovo</span>' : ""}
        </a>
        <div class="item__body">
          <h3 class="item__name">${it.name}</h3>
          <p class="price">${euro(it.price)} <span class="price__demo">demo</span></p>
          <p class="item__cat">${catLabelOf(it.cat)} · arrivato ${since(it.date)}</p>
          <a class="item__ask" href="${waLink(`Ciao Novum! Vorrei info su: ${it.name}. Taglia: `)}" target="_blank" rel="noopener">Chiedi su WhatsApp <svg class="ico"><use href="#i-arrow"/></svg></a>
        </div>
      </li>`).join("");
    const more = $("[data-more-label]");
    if (more) more.textContent = `Vedi tutti i ${ITEMS.length} capi`;
  }

  /* ---------------- Catalog page ---------------- */
  let viewerApi = null;
  function initCatalogPage() {
    const list = $("[data-catalog]"); if (!list) return;
    const filters = $("[data-filters]"), count = $("[data-count]"), sortEl = $("[data-sort]");
    const dlg = $("[data-viewer]");
    const newest = ITEMS.slice(0, 3).map((i) => i.id);
    const catLabel = catLabelOf;
    let cat = "all", sort = "new", visible = [];

    function render() {
      visible = ITEMS.filter((it) => cat === "all" || it.cat === cat);
      if (sort === "new") visible.sort((a, b) => b.date.localeCompare(a.date));
      if (sort === "price-asc") visible.sort((a, b) => a.price - b.price);
      if (sort === "price-desc") visible.sort((a, b) => b.price - a.price);
      list.innerHTML = visible.map((it, i) => `
        <li class="card" id="capo-${it.id}">
          <button type="button" class="card__media" data-open="${it.id}" aria-label="Vedi grande: ${it.name}">
            <img src="${it.img}" alt="${it.alt}" ${i > 2 ? 'loading="lazy"' : ""} width="360" height="640">
            ${newest.includes(it.id) ? '<span class="item__flag">Nuovo</span>' : ""}
            <span class="card__zoom" aria-hidden="true"><svg class="ico"><use href="#i-zoom"/></svg></span>
          </button>
          <div class="card__body">
            <h2 class="card__name">${it.name}</h2>
            <p class="card__price">${euro(it.price)} <span class="price__demo">demo</span></p>
            <p class="card__meta">${catLabel(it.cat)} · arrivato ${since(it.date)}</p>
            <a class="btn btn--solid card__ask" href="${waLink(`Ciao Novum! Vorrei info su: ${it.name}. Taglia: `)}" target="_blank" rel="noopener"><svg class="ico"><use href="#i-chat"/></svg><span>Chiedi su WhatsApp</span></a>
          </div>
        </li>`).join("");
      count.textContent = `${visible.length} ${visible.length === 1 ? "capo" : "capi"}${cat === "all" ? "" : ` · ${catLabel(cat)}`}`;
      list.classList.remove("is-cutting"); void list.offsetWidth; list.classList.add("is-cutting");
    }

    filters.innerHTML = CATS.map((c, i) => {
      const n = c.id === "all" ? ITEMS.length : ITEMS.filter((it) => it.cat === c.id).length;
      return `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${i === 0}" title="Tasto ${i + 1}">${c.label} <span class="chip__n">${n}</span></button>`;
    }).join("");
    setFilter = (c) => {
      cat = c;
      $$(".chip", filters).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === c)));
      render();
    };
    filters.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (b) setFilter(b.dataset.cat); });
    sortEl.addEventListener("change", () => { sort = sortEl.value; render(); });
    list.addEventListener("click", (e) => { const b = e.target.closest("[data-open]"); if (b) open(b.dataset.open); });

    // viewer
    let cur = null;
    const img = $("[data-viewer-img]", dlg);
    const pool = () => (visible.some((v) => v.id === cur) ? visible : ITEMS);
    function fill(id) {
      const it = ITEMS.find((x) => x.id === id); if (!it) return;
      cur = id;
      const p = pool(), i = p.findIndex((x) => x.id === id);
      img.src = it.img; img.alt = it.alt;
      $("[data-viewer-name]", dlg).textContent = it.name;
      $("[data-viewer-price]", dlg).innerHTML = `${euro(it.price)} <span class="price__demo">demo</span>`;
      $("[data-viewer-cat]", dlg).textContent = catLabel(it.cat);
      $("[data-viewer-date]", dlg).textContent = `${dateLabel(it.date)} · ${since(it.date)}`;
      $("[data-viewer-pos]", dlg).textContent = `${pad(i + 1)}/${pad(p.length)}`;
      $("[data-viewer-wa]", dlg).href = waLink(`Ciao Novum! Vorrei info su: ${it.name}. Taglia: `);
      $("[data-viewer-share-label]", dlg).textContent = "Copia link del capo";
      dlg.classList.remove("is-cutting"); void dlg.offsetWidth; dlg.classList.add("is-cutting");
      history.replaceState(null, "", `#${id}`);
    }
    function step(d) {
      const p = pool(), i = p.findIndex((x) => x.id === cur);
      fill(p[(i + d + p.length) % p.length].id);
    }
    function open(id) { fill(id); if (!dlg.open) dlg.showModal(); }
    function close() { dlg.close(); }
    dlg.addEventListener("close", () => {
      history.replaceState(null, "", location.pathname + location.search);
      const card = document.getElementById(`capo-${cur}`);
      if (card) $("[data-open]", card).focus();
    });
    dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
    $("[data-viewer-close]", dlg).addEventListener("click", close);
    $("[data-viewer-prev]", dlg).addEventListener("click", () => step(-1));
    $("[data-viewer-next]", dlg).addEventListener("click", () => step(1));
    $("[data-viewer-share]", dlg).addEventListener("click", async () => {
      const url = `${location.origin}${location.pathname}#${cur}`;
      try { await navigator.clipboard.writeText(url); $("[data-viewer-share-label]", dlg).textContent = "Link copiato"; }
      catch (_) { $("[data-viewer-share-label]", dlg).textContent = url; }
    });
    let sx = 0;
    dlg.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }, { passive: true });
    viewerApi = { isOpen: () => dlg.open, step };

    render();
    const hash = decodeURIComponent(location.hash.slice(1));
    if (ITEMS.some((x) => x.id === hash)) open(hash);
  }

  /* ---------------- Strass wordmark ---------------- */
  function initStrass() {
    const host = $("[data-strass]"); if (!host) return;
    const canvas = $("canvas", host);
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1, dots = [], sprite = null, gap = 8, running = false, raf = 0, visible = true;
    const mouse = { x: -9999, y: -9999, active: false };
    const sparks = [];

    function makeSprite(r) {
      const s = document.createElement("canvas");
      const size = Math.ceil(r * 2 * dpr) + 2;
      s.width = s.height = size;
      const c = s.getContext("2d"), m = size / 2, R = r * dpr;
      const g = c.createRadialGradient(m - R * 0.35, m - R * 0.35, R * 0.05, m, m, R);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.35, "#e9e7e2");
      g.addColorStop(0.7, "#9c9a95");
      g.addColorStop(1, "#3c3b38");
      c.fillStyle = g; c.beginPath(); c.arc(m, m, R, 0, Math.PI * 2); c.fill();
      // facet glint
      c.fillStyle = "rgba(255,255,255,0.95)";
      c.beginPath(); c.arc(m - R * 0.32, m - R * 0.32, R * 0.22, 0, Math.PI * 2); c.fill();
      return s;
    }

    function build() {
      const rect = host.getBoundingClientRect();
      W = Math.round(rect.width); H = Math.round(rect.height);
      if (!W || !H) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr; canvas.height = H * dpr;
      gap = Math.max(5, Math.round(W / 118));
      const r = gap * 0.42;
      sprite = makeSprite(r);

      // render the word offscreen, then sample
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const o = off.getContext("2d");
      let fs = H * 1.02;
      const setFont = () => { o.font = `900 ${fs}px Archivo, system-ui, sans-serif`; try { o.fontStretch = "ultra-expanded"; } catch (_) {} };
      setFont();
      const tw = o.measureText("NOVUM").width;
      fs = fs * Math.min(1, (W * 0.985) / tw);
      setFont();
      o.textBaseline = "alphabetic";
      o.fillStyle = "#fff";
      const m = o.measureText("NOVUM");
      const asc = m.actualBoundingBoxAscent || fs * 0.72;
      o.fillText("NOVUM", 2, (H + asc) / 2);
      const data = o.getImageData(0, 0, W, H).data;
      const prev = dots;
      dots = [];
      for (let y = Math.floor(gap / 2); y < H; y += gap) {
        const odd = Math.round(y / gap) % 2;
        for (let x = Math.floor(gap / 2) + (odd ? gap / 2 : 0); x < W; x += gap) {
          if (data[(Math.floor(y) * W + Math.floor(x)) * 4 + 3] > 140) {
            const p = prev[dots.length];
            dots.push({ hx: x, hy: y, x: p ? p.x : x + (REDUCED ? 0 : (Math.random() - 0.5) * W * 0.6), y: p ? p.y : y + (REDUCED ? 0 : (Math.random() - 0.5) * H * 1.6), vx: 0, vy: 0, s: 0.85 + Math.random() * 0.3 });
          }
        }
      }
      host.classList.add("is-live");
      wake();
    }

    function step() {
      raf = 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const R = 70 + gap * 4, R2 = R * R;
      const sw = sprite.width / dpr;
      for (const d of dots) {
        if (!REDUCED) {
          let ax = (d.hx - d.x) * 0.055, ay = (d.hy - d.y) * 0.055;
          if (mouse.active) {
            const dx = d.x - mouse.x, dy = d.y - mouse.y, q = dx * dx + dy * dy;
            if (q < R2) { const f = (1 - q / R2) * 5.5 / Math.sqrt(q + 1); ax += dx * f; ay += dy * f; }
          }
          d.vx = (d.vx + ax) * 0.8; d.vy = (d.vy + ay) * 0.8;
          d.x += d.vx; d.y += d.vy;
        } else { d.x = d.hx; d.y = d.hy; }
        const s = sw * d.s;
        ctx.drawImage(sprite, d.x - s / 2, d.y - s / 2, s, s);
      }
      // twinkles: a few 4-point glints
      if (!REDUCED && Math.random() < 0.18 && dots.length) {
        const d = dots[(Math.random() * dots.length) | 0];
        sparks.push({ d, t: 0 });
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i]; sp.t += 1 / 26;
        if (sp.t >= 1) { sparks.splice(i, 1); continue; }
        const a = Math.sin(sp.t * Math.PI), L = gap * (1.2 + 1.6 * a);
        ctx.strokeStyle = `rgba(255,255,255,${0.9 * a})`; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sp.d.x - L, sp.d.y); ctx.lineTo(sp.d.x + L, sp.d.y);
        ctx.moveTo(sp.d.x, sp.d.y - L); ctx.lineTo(sp.d.x, sp.d.y + L);
        ctx.stroke();
      }
      running = !REDUCED && visible;
      if (running) raf = requestAnimationFrame(step);
    }
    function wake() { if (!raf && sprite) raf = requestAnimationFrame(step); }

    const toLocal = (cx, cy) => { const r = canvas.getBoundingClientRect(); mouse.x = cx - r.left; mouse.y = cy - r.top; };
    host.addEventListener("pointermove", (e) => { toLocal(e.clientX, e.clientY); mouse.active = true; wake(); });
    host.addEventListener("pointerdown", (e) => { toLocal(e.clientX, e.clientY); mouse.active = true; wake(); });
    host.addEventListener("pointerleave", () => { mouse.active = false; });
    host.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") mouse.active = false; });

    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) wake(); else { cancelAnimationFrame(raf); raf = 0; }
    }).observe(host);

    let rt = 0;
    new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(build, 120); }).observe(host);
    (document.fonts ? document.fonts.load('900 100px "Archivo"').then(() => document.fonts.ready) : Promise.resolve()).finally(build);
  }

  /* ---------------- Strass mode (Konami) ---------------- */
  function initStrassMode() {
    const cv = $("[data-trail]"); const ctx = cv.getContext("2d");
    let on = false, parts = [], raf = 0, dpr = 1;
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; };
    size(); addEventListener("resize", size);
    const emit = (x, y) => {
      for (let i = 0; i < 2; i++) parts.push({ x, y, vx: (Math.random() - 0.5) * 2.2, vy: -Math.random() * 1.6, r: 2 + Math.random() * 3.2, life: 1 });
      if (!raf) raf = requestAnimationFrame(tick);
    };
    function tick() {
      raf = 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += 0.12; p.x += p.vx; p.y += p.vy; p.life -= 0.016;
        if (p.life <= 0 || p.y > innerHeight + 10) { parts.splice(i, 1); continue; }
        const g = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(255,255,255,${p.life})`); g.addColorStop(0.6, `rgba(200,198,192,${p.life})`); g.addColorStop(1, `rgba(70,69,66,${p.life})`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      if (parts.length) raf = requestAnimationFrame(tick);
    }
    addEventListener("pointermove", (e) => { if (on && !REDUCED) emit(e.clientX, e.clientY); }, { passive: true });
    return () => { on = !on; toast(on ? "Modalità strass attivata ✦" : "Modalità strass disattivata"); };
  }

  let toastT = 0;
  function toast(msg) {
    const t = $("[data-toast]"); t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  /* ---------------- Keyboard ---------------- */
  function initKeys(toggleStrass) {
    const pop = $("#shortcuts");
    const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let k = 0;
    $("[data-shortcuts-open]")?.addEventListener("click", () => pop.togglePopover?.());
    addEventListener("keydown", (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      k = key === KONAMI[k] ? k + 1 : key === KONAMI[0] ? 1 : 0;
      if (k === KONAMI.length) { k = 0; toggleStrass(); return; }

      const tag = (e.target.tagName || "").toLowerCase();
      if (e.metaKey || e.ctrlKey || e.altKey || tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
      if (e.key === "?") { e.preventDefault(); pop.togglePopover?.(); return; }
      if (viewerApi && viewerApi.isOpen()) {
        if (e.key === "ArrowRight") viewerApi.step(1);
        else if (e.key === "ArrowLeft") viewerApi.step(-1);
        return;
      }
      if (/^[1-6]$/.test(e.key)) { const c = CATS[Number(e.key) - 1]; if (c) setFilter(c.id); }
    });
  }

  /* ---------------- Misc ---------------- */
  function initMisc() {
    // generic WhatsApp links get a friendly prefilled message
    $$("a[data-wa]").forEach((a) => (a.href = waLink("Ciao Novum! Ho visto il sito e vorrei qualche info.")));

    const strip = $("#demoStrip");
    const syncStrip = () => document.documentElement.style.setProperty("--strip-h", strip.hidden ? "0px" : `${strip.offsetHeight}px`);
    new ResizeObserver(syncStrip).observe(strip);
    try { if (sessionStorage.getItem("novum-demo-hide")) strip.hidden = true; } catch (_) {}
    syncStrip();
    $(".demo-strip__close", strip).addEventListener("click", () => { strip.hidden = true; syncStrip(); try { sessionStorage.setItem("novum-demo-hide", "1"); } catch (_) {} });

    // nav: mark the section in view
    const navObserver = new IntersectionObserver((ens) => {
      ens.forEach((en) => {
        if (!en.isIntersecting) return;
        $$(".bar__nav a").forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${en.target.id}`)));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "capi", "negozio", "contatti"].forEach((id) => { const el = document.getElementById(id); if (el) navObserver.observe(el); });
  }

  function hello() {
    const art = [
      " _  _  ___  __   __ _   _  __  __ ",
      "| \\| |/ _ \\ \\ \\ / /| | | ||  \\/  |",
      "| .` | (_) | \\ V / | |_| || |\\/| |",
      "|_|\\_|\\___/   \\_/   \\___/ |_|  |_|",
    ].join("\n");
    console.log(`%c${art}`, "font-family:monospace;color:#f6f4f0;background:#0a0a0a;padding:8px 12px;line-height:1.2");
    console.log("%cCiao smanettone. Hai aperto la console di un negozio di vestiti.\nPremi ? sul sito per le scorciatoie. E c'è un codice che i gamer conoscono…", "color:#d8d2c8;font:13px system-ui");
  }

  /* ---------------- Boot ---------------- */
  renderStatus();
  setInterval(renderStatus, 30_000);
  initLatest();
  initCatalog();
  initCatalogPage();
  initStrass();
  initKeys(initStrassMode());
  initMisc();
  hello();
})();
