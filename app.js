/* Novum Store */
(() => {
  "use strict";

  const WA_NUMBER = "393493900045";
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches || /[?&]still\b/.test(location.search);
  const FINE_POINTER = matchMedia("(pointer: fine)").matches;

  // I capi si modificano in capi.js (il primo dell'elenco è il più nuovo)
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const FOCUS = { alto: "50% 12%", centro: "50% 45%", basso: "50% 85%" };
  const CAT_LABELS = window.NOVUM_CATEGORIE || {};
  const seen = new Set();
  const ITEMS = (window.NOVUM_CAPI || [])
    .filter((c) => c && c.nome && c.foto)
    .map((c) => {
      let id = slug(c.nome) || "capo"; while (seen.has(id)) id += "-2"; seen.add(id);
      return { id, name: c.nome, cat: c.categoria, price: Number(c.prezzo), img: c.foto, alt: c.nome, pos: FOCUS[c.inquadratura] || "50% 40%" };
    });
  const CATS = [{ id: "all", label: "Tutto" }].concat(
    Object.keys(CAT_LABELS).filter((k) => ITEMS.some((i) => i.cat === k)).map((k) => ({ id: k, label: CAT_LABELS[k] }))
  );
  const catLabelOf = (id) => CAT_LABELS[id] || "";
  const HOME_COUNT = 4;

  // Orari (ora di Roma). Giorni: 0 = domenica.
  const HOURS = { 1: [[600, 780], [960, 1200]], 2: [[600, 780], [960, 1200]], 3: [[600, 780], [960, 1200]], 4: [[600, 780], [960, 1200]], 5: [[600, 780], [960, 1200]], 6: [[600, 780], [960, 1200]], 0: [] };
  // Chiusure straordinarie (ferie): aggiungi { from: "AAAA-MM-GG", to: "AAAA-MM-GG" }
  const CLOSURES = [];
  const DAY_NAMES = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  const DAY_SHORT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const euro = (n) => (Number.isFinite(n) ? new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n) : "");
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  const askLink = (it) => waLink(`Ciao Novum! Vorrei info su: ${it.name}. Taglia: `);
  const pad = (n) => String(n).padStart(2, "0");
  const hhmm = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------------- Time in Rome ---------------- */
  function romeNow() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
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
    const cur = slotsFor(now.iso).find(([a, b]) => now.min >= a && now.min < b);
    if (cur) {
      const left = cur[1] - now.min;
      const h = Math.floor(left / 60), m = left % 60;
      const span = h ? `${h}\u00a0h\u00a0${pad(m)}\u00a0min` : `${m}\u00a0min`;
      return { open: true, short: `Aperto · fino alle ${hhmm(cur[1])}`, mini: `Aperto · ${hhmm(cur[1])}`, big: "Aperto ora", next: `Chiude alle\u00a0${hhmm(cur[1])}, tra ${span}.` };
    }
    for (let i = 0; i < 30; i++) {
      const iso = addDays(now.iso, i);
      const s = slotsFor(iso).find(([a]) => i > 0 || a > now.min);
      if (s) {
        const dow = new Date(`${iso}T12:00:00Z`).getUTCDay();
        const when = i === 0 ? "oggi" : i === 1 ? "domani" : DAY_NAMES[dow];
        const shortDay = i === 0 ? "" : i === 1 ? "domani " : DAY_SHORT[dow].toLowerCase() + " ";
        return { open: false, short: `Chiuso · apre ${i === 0 ? "" : when + " "}alle ${hhmm(s[0])}`, mini: `Chiuso · ${shortDay}${hhmm(s[0])}`, big: closedOn(now.iso) ? "Chiuso per ferie" : "Ora chiuso", next: `Riapre ${when} alle\u00a0${hhmm(s[0])}.` };
      }
    }
    return { open: false, short: "Chiuso", mini: "Chiuso", big: "Ora chiuso", next: "" };
  }

  function renderStatus() {
    const st = shopStatus();
    document.body.classList.toggle("is-open", st.open);
    $$("[data-status-text]").forEach((el) => (el.textContent = st.short));
    $$("[data-status-mini]").forEach((el) => (el.textContent = st.mini));
    const big = $("[data-status-big]"); if (big) big.textContent = st.big;
    const nx = $("[data-status-next]"); if (nx) nx.textContent = st.next;
    renderHours();
  }

  function renderHours() {
    const tb = $("[data-hours]"); if (!tb) return;
    const { dow } = romeNow();
    const fmt = (d) => (HOURS[d].length ? HOURS[d].map(([a, b]) => `${hhmm(a)}–${hhmm(b)}`).join("<br>") : "Chiuso");
    const groups = [];
    [1, 2, 3, 4, 5, 6, 0].forEach((d) => {
      const last = groups[groups.length - 1];
      if (last && last.txt === fmt(d)) last.days.push(d); else groups.push({ days: [d], txt: fmt(d) });
    });
    tb.innerHTML = groups.map((g) => {
      const name = g.days.length > 1 ? `${DAY_SHORT[g.days[0]]}–${DAY_SHORT[g.days[g.days.length - 1]]}` : DAY_NAMES[g.days[0]][0].toUpperCase() + DAY_NAMES[g.days[0]].slice(1);
      return `<tr class="${g.days.includes(dow) ? "is-today" : ""}"><th scope="row">${name}</th><td>${g.txt}</td></tr>`;
    }).join("");
  }

  /* ---------------- Muro di capi (home) ---------------- */
  function initWall() {
    const wall = $("[data-wall]"); if (!wall) return;
    if (!ITEMS.length) { wall.hidden = true; return; }
    const STEP = 2600;
    let cols = 0, shown = [], next = 0, tick = 0, timer = 0, visible = true;

    const colsNow = () => Math.max(1, parseInt(getComputedStyle(wall).getPropertyValue("--cols"), 10) || 1);
    const imgTag = (it, cls) => `<img class="wall__img ${cls}" src="${esc(it.img)}" alt="" style="object-position:${it.pos}" draggable="false">`;

    function build() {
      cols = colsNow();
      shown = Array.from({ length: cols }, (_, i) => i % ITEMS.length);
      next = cols % ITEMS.length; tick = 0;
      wall.innerHTML = shown.map((k) => {
        const it = ITEMS[k];
        return `<a class="wall__col" href="catalogo.html#${it.id}" tabindex="-1">${imgTag(it, "is-still")}</a>`;
      }).join("");
      plan();
    }

    function swap() {
      if (ITEMS.length <= cols) return;
      const c = tick % cols; tick++;
      let k = next, guard = 0;
      while (shown.includes(k) && guard++ < ITEMS.length) k = (k + 1) % ITEMS.length;
      next = (k + 1) % ITEMS.length;
      const it = ITEMS[k], col = wall.children[c];
      const pre = new Image();
      pre.onload = pre.onerror = () => {
        if (!col.isConnected) return;
        shown[c] = k;
        col.href = `catalogo.html#${it.id}`;
        col.insertAdjacentHTML("beforeend", imgTag(it, "is-in"));
        const fresh = col.lastElementChild;
        fresh.addEventListener("animationend", (e) => {
          if (e.animationName !== "wall-wipe") return;
          [...col.querySelectorAll(".wall__img")].forEach((im) => { if (im !== fresh) im.remove(); });
        });
      };
      pre.src = it.img;
    }

    function plan() {
      clearInterval(timer);
      if (REDUCED || !visible || document.hidden || ITEMS.length <= cols) return;
      timer = setInterval(swap, STEP);
    }

    let rt = 0;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (colsNow() !== cols) build(); }, 150); });
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; plan(); }).observe(wall);
    document.addEventListener("visibilitychange", plan);
    build();
  }

  /* ---------------- Ultimi arrivi (home) ---------------- */
  let setFilter = () => {};
  const ARRIVALS_COUNT = 4;
  function initArrivals() {
    const grid = $("[data-arrivals]"); if (!grid) return;
    grid.innerHTML = ITEMS.slice(0, ARRIVALS_COUNT).map((it) => `
      <li class="arr">
        <a class="arr__photo" href="catalogo.html#${it.id}" aria-label="Vedi ${esc(it.name)} nel catalogo">
          <img src="${esc(it.img)}" alt="${esc(it.alt)}" style="object-position:${it.pos}" loading="lazy" width="360" height="640">
        </a>
        <div class="arr__info">
          <h3 class="arr__name"><a href="catalogo.html#${it.id}">${esc(it.name)}</a></h3>
          <p class="arr__price">${euro(it.price)}</p>
        </div>
        <a class="arr__ask" href="${askLink(it)}" target="_blank" rel="noopener">Chiedi su WhatsApp<svg class="ico"><use href="#i-arrow"/></svg></a>
      </li>`).join("");
  }

  /* ---------------- Menu (telefono e tablet) ---------------- */
  function initMenu() {
    const btn = $("[data-menu-open]"), menu = $("[data-menu]"); if (!btn || !menu) return;
    const label = $("span", btn), use = $("use", btn);
    const set = (open) => {
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      label.textContent = open ? "Chiudi" : "Menu";
      use.setAttribute("href", open ? "#i-x" : "#i-menu");
      document.documentElement.classList.toggle("menu-open", open);
      if (open) $("a", menu).focus();
    };
    btn.addEventListener("click", () => set(menu.hidden));
    $$("[data-menu-link]", menu).forEach((a) => a.addEventListener("click", () => set(false)));
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { set(false); btn.focus(); } });
    matchMedia("(min-width: 1081px)").addEventListener("change", (m) => { if (m.matches) set(false); });
  }

  /* ---------------- Mappa: si carica solo se richiesta ---------------- */
  function initMap() {
    const box = $("[data-map]"); if (!box) return;
    const SRC = "https://maps.google.com/maps?q=Piazza%20Fausto%20e%20Luigi%20Gullo%2022%2C%20Cosenza&z=16&output=embed";
    const load = () => {
      box.innerHTML = `<iframe title="Mappa: Novum Store, Piazza Fausto e Luigi Gullo 22, Cosenza" src="${SRC}" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
      box.classList.add("is-loaded");
    };
    let ok = false;
    try { ok = localStorage.getItem("novum-maps") === "1"; } catch (_) {}
    if (ok) { load(); return; }
    $("[data-map-load]", box).addEventListener("click", () => { try { localStorage.setItem("novum-maps", "1"); } catch (_) {} load(); });
  }

  /* ---------------- Catalogo ---------------- */
  let viewerApi = null;
  function initCatalogPage() {
    const list = $("[data-catalog]"); if (!list) return;
    const filters = $("[data-filters]"), count = $("[data-count]"), sortEl = $("[data-sort]");
    const dlg = $("[data-viewer]");
    let cat = "all", sort = "new", visible = [];

    function render() {
      visible = ITEMS.filter((it) => cat === "all" || it.cat === cat);
      if (sort === "price-asc") visible.sort((a, b) => a.price - b.price);
      if (sort === "price-desc") visible.sort((a, b) => b.price - a.price);
      list.innerHTML = visible.length ? visible.map((it, i) => `
        <li class="card" id="capo-${it.id}">
          <button type="button" class="card__btn" data-open="${it.id}">
            <span class="card__media"><img src="${esc(it.img)}" alt="${esc(it.alt)}" style="object-position:${it.pos}" ${i > 7 ? 'loading="lazy"' : ""} width="360" height="640"></span>
            <span class="card__name">${esc(it.name)}</span>
            <span class="card__price">${euro(it.price)}</span>
          </button>
        </li>`).join("") : `<li class="cat-empty">Nessun capo in questa categoria al momento. <a href="${waLink("Ciao Novum! Cerco un capo che non vedo sul sito: ")}" target="_blank" rel="noopener">Chiedici su WhatsApp</a>.</li>`;
      count.textContent = `${visible.length} ${visible.length === 1 ? "capo" : "capi"}`;
    }

    filters.innerHTML = CATS.map((c, i) => `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${i === 0}">${esc(c.label)}</button>`).join("");
    setFilter = (c) => {
      if (!CATS.some((x) => x.id === c)) return;
      cat = c;
      $$(".chip", filters).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === c)));
      render();
    };
    filters.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (b) setFilter(b.dataset.cat); });
    sortEl.addEventListener("change", () => { sort = sortEl.value; render(); });
    list.addEventListener("click", (e) => { const b = e.target.closest("[data-open]"); if (b) open(b.dataset.open); });

    // visore
    let cur = null;
    const img = $("[data-viewer-img]", dlg);
    const pool = () => (visible.some((v) => v.id === cur) ? visible : ITEMS);
    function fill(id) {
      const it = ITEMS.find((x) => x.id === id); if (!it) return;
      cur = id;
      const p = pool(), i = p.findIndex((x) => x.id === id);
      img.src = it.img; img.alt = it.alt;
      $("[data-viewer-name]", dlg).textContent = it.name;
      $("[data-viewer-price]", dlg).textContent = euro(it.price);
      $("[data-viewer-cat]", dlg).textContent = catLabelOf(it.cat);
      $("[data-viewer-pos]", dlg).textContent = `${i + 1} / ${p.length}`;
      $("[data-viewer-wa]", dlg).href = askLink(it);
      $("[data-viewer-share-label]", dlg).textContent = "Copia link";
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
      const label = $("[data-viewer-share-label]", dlg);
      try {
        if (navigator.share && !FINE_POINTER) { await navigator.share({ title: $("[data-viewer-name]", dlg).textContent, url }); return; }
        await navigator.clipboard.writeText(url); label.textContent = "Link copiato";
      } catch (_) { /* condivisione annullata */ }
    });
    let sx = 0;
    $(".viewer__media", dlg).addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    $(".viewer__media", dlg).addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }, { passive: true });
    viewerApi = { isOpen: () => dlg.open, step };

    render();
    const hash = decodeURIComponent(location.hash.slice(1));
    if (ITEMS.some((x) => x.id === hash)) open(hash);
  }

  /* ---------------- Faretto e brillio sul cursore (solo mouse) ---------------- */
  function initCursorLight() {
    if (REDUCED || !FINE_POINTER || !$(".hero")) return;
    const SEL = ".wall__col, .arr__photo, .store__photo";
    const glint = document.createElement("span");
    glint.className = "glint"; glint.setAttribute("aria-hidden", "true");
    glint.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 0C12.8 8 16 11.2 24 12 16 12.8 12.8 16 12 24 11.2 16 8 12.8 0 12 8 11.2 11.2 8 12 0Z"/></svg>';
    document.body.appendChild(glint);
    let rest = 0, last = 0;
    const sparkle = (x, y) => {
      const now = performance.now(); if (now - last < 1400) return; last = now;
      glint.style.left = `${x}px`; glint.style.top = `${y}px`;
      glint.classList.remove("is-on"); void glint.offsetWidth; glint.classList.add("is-on");
    };
    document.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target.closest && e.target.closest(SEL);
      clearTimeout(rest);
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${e.clientX - r.left}px`);
      t.style.setProperty("--my", `${e.clientY - r.top}px`);
      t.classList.add("is-lit");
      rest = setTimeout(() => sparkle(e.clientX, e.clientY), 650);
    }, { passive: true });
    document.addEventListener("pointerout", (e) => {
      const t = e.target.closest && e.target.closest(SEL);
      if (t && !t.contains(e.relatedTarget)) { t.classList.remove("is-lit"); clearTimeout(rest); }
    });
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
      const size = Math.ceil(r * 2 * 1.6 * dpr) + 2;
      s.width = s.height = size;
      const c = s.getContext("2d"), m = size / 2, R = r * dpr;
      // castone scuro: stacca lo strass da qualsiasi foto sotto
      const halo = c.createRadialGradient(m, m, R * 0.9, m, m, R * 1.6);
      halo.addColorStop(0, "rgba(5,5,5,0.9)");
      halo.addColorStop(1, "rgba(5,5,5,0)");
      c.fillStyle = halo; c.beginPath(); c.arc(m, m, R * 1.6, 0, Math.PI * 2); c.fill();
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
      let moving = false;
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
          if (Math.abs(d.vx) + Math.abs(d.vy) > 0.03) moving = true;
        } else { d.x = d.hx; d.y = d.hy; }
        const s = sw * d.s;
        ctx.drawImage(sprite, d.x - s / 2, d.y - s / 2, s, s);
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
      // continua solo se qualcosa si muove: niente animazione a vuoto
      running = !REDUCED && visible && (moving || mouse.active || sparks.length > 0);
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
    // qualche brillio ogni tanto, a basso costo
    if (!REDUCED) setInterval(() => {
      if (!visible || document.hidden || !dots.length) return;
      for (let i = 0; i < 2; i++) sparks.push({ d: dots[(Math.random() * dots.length) | 0], t: 0 });
      wake();
    }, 700);

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
        addEventListener("keydown", (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      k = key === KONAMI[k] ? k + 1 : key === KONAMI[0] ? 1 : 0;
      if (k === KONAMI.length) { k = 0; toggleStrass(); return; }

      const tag = (e.target.tagName || "").toLowerCase();
      if (e.metaKey || e.ctrlKey || e.altKey || tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
      if (e.key === "?" && pop) { e.preventDefault(); pop.togglePopover?.(); return; }
      if (viewerApi && viewerApi.isOpen()) {
        if (e.key === "ArrowRight") viewerApi.step(1);
        else if (e.key === "ArrowLeft") viewerApi.step(-1);
        return;
      }
      if (/^[1-9]$/.test(e.key)) { const c = CATS[Number(e.key) - 1]; if (c) setFilter(c.id); }
    });
  }

  /* ---------------- Misc ---------------- */
  function initMisc() {
    $$("a[data-wa]").forEach((a) => (a.href = waLink("Ciao Novum! Ho visto il sito e vorrei qualche info.")));
    document.documentElement.style.setProperty("--strip-h", "0px");

    // menu: evidenzia la sezione visibile (solo in home)
    const navObserver = new IntersectionObserver((ens) => {
      ens.forEach((en) => {
        if (!en.isIntersecting) return;
        $$(".bar__nav a").forEach((a) => { if (a.getAttribute("href").startsWith("#")) a.setAttribute("aria-current", String(a.getAttribute("href") === `#${en.target.id}`)); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "negozio", "contatti"].forEach((id) => { const el = document.getElementById(id); if (el) navObserver.observe(el); });
  }

  function hello() {
    const art = [
      " _  _  ___  __   __ _   _  __  __ ",
      "| \\| |/ _ \\ \\ \\ / /| | | ||  \\/  |",
      "| .` | (_) | \\ V / | |_| || |\\/| |",
      "|_|\\_|\\___/   \\_/   \\___/ |_|  |_|",
    ].join("\n");
    console.log(`%c${art}`, "font-family:monospace;color:#f6f4f0;background:#0a0a0a;padding:8px 12px;line-height:1.2");
    console.log("%cCiao smanettone. Hai aperto la console di un negozio di vestiti.\nProva a premere ? sul sito. E c'è un codice che i gamer conoscono…", "color:#d8d2c8;font:13px system-ui");
  }

  /* ---------------- Boot ---------------- */
  renderStatus();
  setInterval(renderStatus, 30_000);
  initWall();
  initArrivals();
  initMenu();
  initMap();
  initCursorLight();
  initCatalogPage();
  initStrass();
  initKeys(initStrassMode());
  initMisc();
  hello();
})();
