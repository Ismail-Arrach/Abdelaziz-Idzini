(function () {
  const P = PROFILE;
  const L = P.links;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const ICON = {
    fb: '<path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9H17l.5-4h-4V9c0-.6.4-1 1-1z"/>',
    yt: '<path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10 15V9l5.2 3z"/>',
    mail: '<path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m3 7 9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    in: '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/>',
    user: '<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    globe: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" fill="none" stroke="currentColor" stroke-width="1.8"/>'
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">${ICON[k]}</svg>`;

  /* ── نصوص ── */
  $$("[data-p]").forEach((el) => (el.textContent = P[el.dataset.p] || ""));
  $$("[data-src]").forEach((img) => (img.src = P[img.dataset.src]));
  $("#year").textContent = new Date().getFullYear();

  /* ── روابط الواجهة ── */
  const social = [
    L.facebookPage && { href: L.facebookPage, icon: "fb", label: "الصفحة الرسمية" },
    L.youtube && { href: L.youtube, icon: "yt", label: "قناة اليوتيوب" },
    L.linkedin && { href: L.linkedin, icon: "in", label: "لينكدإن" },
    L.email && { href: "mailto:" + L.email, icon: "mail", label: L.email }
  ].filter(Boolean);
  $("#hero-social").innerHTML = social.map((s) => `<a href="${esc(s.href)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}">${svg(s.icon)}</a>`).join("");

  /* ── أغلفة الكتب ── */
  const fakeCover = (b, i) => `
    <div class="cover cover-gen g${i % 4}">
      <span class="cg-author">د. عبد العزيز إدزني</span>
      <span class="cg-rule" aria-hidden="true"></span>
      <strong class="cg-title">${esc(b.title)}</strong>
      <span class="cg-foot"><span>${esc(b.edition || "")}</span><span>${esc(b.year)}</span></span>
    </div>`;
  const realCover = (b) => `<div class="cover"><img src="${esc(b.cover)}" alt="غلاف: ${esc(b.title)}" loading="lazy"></div>`;
  /* ── الواجهة: الصفات المتناوبة ── */
  const roles = [P.rank + " · " + P.speciality, P.centre, "المنسق البيداغوجي السابق لماستر المنازعات المدنية والعقارية", "باحث ومؤلف في القانون الخاص"];
  const rot = $("#roles-rotator");
  if (rot) {
    rot.innerHTML = roles.map((r, i) => `<span class="${i === 0 ? "is-on" : ""}">${esc(r)}</span>`).join("");
    const spans = $$("span", rot);
    let ri = 0;
    if (!calm) setInterval(() => {
      spans[ri].classList.remove("is-on"); spans[ri].classList.add("is-out");
      const prev = spans[ri];
      setTimeout(() => prev.classList.remove("is-out"), 700);
      ri = (ri + 1) % spans.length;
      spans[ri].classList.add("is-on");
    }, 3200);
  }

  /* بطاقة أحدث إصدار + شريط العناوين */
  const newest = P.books.find((b) => b.cover);
  if (newest && $("#h2-latest")) {
    $("#h2-latest").innerHTML = `<img src="${esc(newest.cover)}" alt=""><span><small>أحدث إصدار · ${esc(newest.year)}</small>${esc(newest.title)}</span>`;
  }
  const titles = [...P.books, ...P.collective].map((b) => `<span>${esc(b.title)}</span><i>✦</i>`).join("");
  if ($("#h2-ticker")) $("#h2-ticker").innerHTML = titles + titles;

  /* حركة الصورة مع الفأرة */
  if (fine && !calm) {
    const hero = $(".hero2");
    hero && hero.addEventListener("mousemove", (e) => {
      hero.style.setProperty("--mx", (e.clientX / innerWidth - 0.5).toFixed(3));
      hero.style.setProperty("--my", (e.clientY / innerHeight - 0.5).toFixed(3));
    });
  }

  /* الانتماءات */
  $("#affiliations").innerHTML = (P.affiliations || []).map((a) => `<li>${esc(a)}</li>`).join("");

  /* ── كاروسيل الكتب ثلاثي الأبعاد ── */
  const flows = [];
  function buildFlow(root, items, details) {
    const n = items.length;
    let active = 0, timer = null;
    root.innerHTML = `
      <div class="flow-stage" tabindex="0" aria-roledescription="carousel">
        ${items.map((b, i) => `
          <button class="flow-item" type="button" data-i="${i}" aria-label="${esc(b.title)}">
            ${b.cover ? realCover(b) : fakeCover(b, i)}
          </button>`).join("")}
      </div>
      <div class="flow-nav">
        <button class="flow-arrow" type="button" data-dir="-1" aria-label="السابق">→</button>
        <div class="flow-dots">${items.map((_, i) => `<span data-i="${i}"></span>`).join("")}</div>
        <button class="flow-arrow" type="button" data-dir="1" aria-label="التالي">←</button>
      </div>
      <div class="flow-info" aria-live="polite"></div>
      <div class="flow-progress"><span></span></div>`;
    const els = $$(".flow-item", root), dots = $$(".flow-dots span", root), info = $(".flow-info", root), bar = $(".flow-progress span", root);

    const render = () => {
      els.forEach((el, i) => {
        let o = i - active;
        if (o > n / 2) o -= n;
        if (o < -n / 2) o += n;
        const a = Math.abs(o);
        el.style.setProperty("--o", o);
        el.style.setProperty("--a", a);
        el.style.zIndex = 20 - a;
        el.classList.toggle("is-active", o === 0);
        el.classList.toggle("is-hidden", a > 3);
        el.tabIndex = o === 0 ? 0 : -1;
      });
      dots.forEach((d, i) => d.classList.toggle("is-on", i === active));
      const b = items[active];
      info.innerHTML = `
        <div class="fi-anim">
          <span class="fi-count"><b>${String(active + 1).padStart(2, "0")}</b> / ${String(n).padStart(2, "0")}</span>
          <h3>${esc(b.title)}</h3>
          ${details(b)}
        </div>`;
      bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
    };
    const go = (i) => { active = (i + n) % n; render(); };
    const play = () => { if (calm) return; stop(); timer = setInterval(() => go(active + 1), 4200); root.classList.add("is-playing"); };
    const stop = () => { clearInterval(timer); root.classList.remove("is-playing"); };

    els.forEach((el) => el.addEventListener("click", () => { go(+el.dataset.i); play(); }));
    dots.forEach((d) => d.addEventListener("click", () => { go(+d.dataset.i); play(); }));
    $$(".flow-arrow", root).forEach((a) => a.addEventListener("click", () => { go(active + +a.dataset.dir); play(); }));
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", () => root.offsetParent && play());
    $(".flow-stage", root).addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { go(active + 1); play(); }
      if (e.key === "ArrowRight") { go(active - 1); play(); }
    });
    /* السحب باللمس */
    let x0 = null;
    root.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    root.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(active + (dx > 0 ? 1 : -1));
      x0 = null; play();
    });
    render();
    flows.push({ root, play, stop });
  }

  buildFlow($("#flow-books"), P.books, (b) => `
    <span class="fi-kind">${esc(b.kind)}</span>
    <dl>
      <div><dt>السنة</dt><dd>${esc(b.year)}</dd></div>
      <div><dt>الطبعة</dt><dd>${esc(b.edition)}</dd></div>
      <div><dt>الناشر</dt><dd>${esc(b.publisher)}</dd></div>
      ${b.isbn ? `<div><dt>ردمك</dt><dd dir="ltr">${esc(b.isbn)}</dd></div>` : ""}
    </dl>`);
  buildFlow($("#flow-collective"), P.collective.map((b) => ({ ...b, edition: "مؤلف جماعي" })), (b) => `
    <span class="fi-kind">تنسيق مؤلف جماعي</span>
    <dl>
      <div><dt>السنة</dt><dd>${esc(b.year)}</dd></div>
      <div><dt>بالاشتراك مع</dt><dd>${esc(b.with)}</dd></div>
      <div><dt>النشر</dt><dd>${esc(b.note)}</dd></div>
    </dl>`);

  /* التشغيل التلقائي فقط عندما يكون القسم ظاهرا */
  const worksIO = new IntersectionObserver(([en]) => {
    flows.forEach((f) => (en.isIntersecting && f.root.offsetParent ? f.play() : f.stop()));
  }, { threshold: 0.25 });
  worksIO.observe($("#works"));

  /* ── أرقام ── */
  const talksN = P.talks.length, confN = P.conferences.length;
  const stats = [
    [P.books.length, "مؤلفات فردية"],
    [P.collective.length, "مؤلفات جماعية منسقة"],
    [P.articles.length, "مقالا علميا محكما"],
    [talksN, "مداخلة علمية"],
    [confN, "مؤتمرا وندوة منسقة"],
    [P.phdDefended.length + P.phdOngoing.length, "أطروحة دكتوراه مؤطرة"]
  ];
  $("#stats").innerHTML = stats.map(([n, t]) => `<div class="stat reveal"><strong data-count="${n}">${n}</strong><span>${t}</span></div>`).join("");
  $("#badge-books").textContent = P.books.length + P.collective.length;

  /* ── نبذة ── */
  $("#bio").innerHTML = P.bio.map((p) => `<p>${esc(p)}</p>`).join("");
  $("#expertise").innerHTML = P.expertise.map((e) => `<li>${esc(e)}</li>`).join("");

  /* ── المسار ── */
  $("#career").innerHTML = P.career.map((c, i) => `
    <li class="${i === 0 ? "is-now" : ""}">
      <span class="tl-period">${esc(c.period)}</span>
      <strong>${esc(c.role)}</strong>
      <span class="tl-place">${esc(c.place)}</span>
    </li>`).join("");
  $("#degrees").innerHTML = P.degrees.map((d) => `<li><span class="deg-year">${esc(d.year)}</span><span>${esc(d.title)}</span></li>`).join("");
  $("#roles").innerHTML = P.roles.map((r) => `<li>${esc(r)}</li>`).join("");

  /* ── المؤلفات ── */
  $("#n-books").textContent = P.books.length;
  $("#n-collective").textContent = P.collective.length;
  $("#n-articles").textContent = P.articles.length;

  $("#articles").innerHTML = P.articles.map((a) => {
    const [journal, ...rest] = a.where.split("، ");
    return `
    <li class="reveal">
      <span class="art-year">${esc(a.year || "—")}</span>
      <div>
        <h3>${esc(a.title)}</h3>
        <span class="art-journal">${esc(journal)}</span>${rest.length ? `<span class="art-issue">${esc(rest.join("، "))}</span>` : ""}
      </div>
    </li>`;
  }).join("");

  /* ── التدريس ── */
  $("#t-licence").innerHTML = P.teaching.licence.map((t) => `<li>${esc(t)}</li>`).join("");
  $("#t-master").innerHTML = P.teaching.master.map((t) => `<li>${esc(t)}</li>`).join("");

  /* ── المؤتمرات ── */
  const thumb = (s) => s.replace(/(\.\w+)$/, "-t$1");
  $("#confs").innerHTML = P.conferences.map((c, ci) => {
    const pics = (c.poster ? [c.poster] : []).concat(c.photos || []);
    const cover = c.poster || (c.photos && c.photos[0]);
    return `
    <article class="conf reveal ${c.scope === "دولي" ? "is-intl" : ""} ${cover ? "has-media" : ""}">
      ${cover ? `<button type="button" class="conf-cover" data-album="${ci}" aria-label="صور ${esc(c.title)}"><img src="${esc(c.poster ? c.poster : thumb(cover))}" alt="" loading="lazy"><span>📷 ${pics.length} ${pics.length > 2 && pics.length < 11 ? "صور" : "صورة"}</span></button>` : ""}
      <div class="conf-top"><span class="scope">${esc(c.scope)}</span><time>${esc(c.date)}</time></div>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.place)}</p>
      <span class="conf-role">${esc(c.role || "منسق ورئيس اللجنة التنظيمية")}</span>
      ${c.call ? `<div class="conf-call"><span class="conf-call-date">📣 الدعوة للمشاركة · ${esc(c.call.date)}</span><p>${esc(c.call.text)}</p><button type="button" class="conf-album-btn" data-album="k${ci}">الورقة التقديمية وشروط المشاركة (${c.call.pages.length} صفحات) ←</button></div>` : ""}
      ${c.note ? `<details class="conf-note"><summary>${esc(c.noteTitle || "نبذة")}</summary>${String(c.note).split("\n").map((p) => `<p>${esc(p)}</p>`).join("")}</details>` : ""}
      ${pics.length ? `<button type="button" class="conf-album-btn" data-album="${ci}">عرض الصور ←</button>` : ""}
    </article>`;
  }).join("");

  /* ── المسالك التي ينسقها ── */
  const mBox = $("#masters");
  if (mBox && P.masters && P.masters.length) mBox.innerHTML = P.masters.map((m, i) => `
    <article class="master reveal">
      <button type="button" class="master-cover" data-album="m${i}" aria-label="البطاقة التقنية"><img src="${esc(thumb(m.pages[0]))}" alt="" loading="lazy"><span>📄 البطاقة التقنية</span></button>
      <div class="master-body">
        <span class="master-role">${esc(m.role)}</span>
        <h3>${esc(m.heading || m.title)}</h3>
        <p class="master-place">${esc(m.place)}</p>
        <p>${esc(m.summary)}</p>
        <ul class="master-units">${m.units.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>
        <div class="master-actions">
          <button type="button" class="btn btn-gold" data-album="m${i}">الورقة التعريفية للماستر</button>
          ${m.link ? `<a class="btn btn-line" href="${esc(m.link)}" target="_blank" rel="noopener">رابط الترشيح ↗</a>` : ""}
        </div>
      </div>
    </article>`).join("");

  /* ── ألبوم الصور ── */
  const album = document.createElement("div");
  album.className = "album"; album.hidden = true;
  album.setAttribute("role", "dialog"); album.setAttribute("aria-modal", "true");
  album.innerHTML = `<button class="album-x" type="button" aria-label="إغلاق">✕</button>
    <button class="album-nav album-prev" type="button" aria-label="السابقة">→</button>
    <figure class="album-fig"><img alt=""><figcaption></figcaption></figure>
    <button class="album-nav album-next" type="button" aria-label="التالية">←</button>
    <div class="album-strip"></div>`;
  document.body.appendChild(album);
  let aPics = [], aIdx = 0, aTitle = "";
  const aShow = (i) => {
    aIdx = (i + aPics.length) % aPics.length;
    $(".album-fig img", album).src = aPics[aIdx];
    $(".album-fig figcaption", album).textContent = `${aTitle} — ${aIdx + 1} / ${aPics.length}`;
    $$(".album-strip button", album).forEach((b, k) => b.classList.toggle("on", k === aIdx));
  };
  const aOpen = (key) => {
    // "t3" = مداخلة رقم 3، وإلا رقم مؤتمر
    const k0 = String(key).charAt(0), kn = +String(key).slice(1);
    if (k0 === "m") {
      const m = P.masters[kn];
      aPics = m.pages; aTitle = "بطاقة تقنية – " + m.title;
      $(".album-strip", album).innerHTML = aPics.map((s, k) => `<button type="button" data-k="${k}"><img src="${esc(thumb(s))}" alt=""></button>`).join("");
      album.hidden = false; document.documentElement.classList.add("lec-lock"); aShow(0);
      return;
    }
    if (k0 === "k") {
      // الدعوة للمشاركة: صفحات الورقة التقديمية
      const cc = P.conferences[kn];
      aPics = cc.call.pages; aTitle = "الدعوة للمشاركة – " + cc.title;
      $(".album-strip", album).innerHTML = aPics.map((s, k) => `<button type="button" data-k="${k}"><img src="${esc(thumb(s))}" alt=""></button>`).join("");
      album.hidden = false; document.documentElement.classList.add("lec-lock"); aShow(0);
      return;
    }
    const c = k0 === "t" ? P.talks[kn] : k0 === "p" ? P.phdDefended[kn] : P.conferences[+key];
    aPics = (c.poster ? [c.poster] : []).concat(c.photos || []); aTitle = c.title;
    $(".album-strip", album).innerHTML = aPics.map((s, k) => `<button type="button" data-k="${k}"><img src="${esc(s === c.poster ? s : thumb(s))}" alt=""></button>`).join("");
    album.hidden = false; document.documentElement.classList.add("lec-lock"); aShow(0);
  };
  const aClose = () => { album.hidden = true; document.documentElement.classList.remove("lec-lock"); };
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-album]"); if (b) aOpen(b.dataset.album); });
  $(".album-x", album).addEventListener("click", aClose);
  $(".album-prev", album).addEventListener("click", () => aShow(aIdx - 1));
  $(".album-next", album).addEventListener("click", () => aShow(aIdx + 1));
  $(".album-strip", album).addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (b) aShow(+b.dataset.k); });
  album.addEventListener("click", (e) => { if (e.target === album) aClose(); });
  document.addEventListener("keydown", (e) => {
    if (album.hidden) return;
    if (e.key === "Escape") aClose();
    if (e.key === "ArrowLeft") aShow(aIdx + 1);
    if (e.key === "ArrowRight") aShow(aIdx - 1);
  });
  let aX = null;
  album.addEventListener("touchstart", (e) => { aX = e.touches[0].clientX; }, { passive: true });
  album.addEventListener("touchend", (e) => { if (aX === null) return; const dx = e.changedTouches[0].clientX - aX; if (Math.abs(dx) > 40) aShow(aIdx + (dx < 0 ? 1 : -1)); aX = null; });

  /* ── الندوات القادمة + تبويب القادمة/المنظمة ── */
  const upcoming = (P.upcoming || []).slice().sort((a, b) => String(a.start || "").localeCompare(String(b.start || "")));
  $("#n-past").textContent = P.conferences.length;
  $("#n-upcoming").textContent = upcoming.length || "";
  $("#upcoming").innerHTML = upcoming.length
    ? upcoming.map((c) => `
    <article class="conf is-next ${c.scope === "دولي" ? "is-intl" : ""}">
      <div class="conf-top"><span class="scope">${esc(c.scope || "")}</span><time>${esc(c.date)}</time></div>
      <span class="conf-soon">قريبا</span>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.place || "")}</p>
      <span class="conf-role">${esc(c.role || "منسق ورئيس اللجنة التنظيمية")}</span>
      ${c.link ? `<a class="conf-link" href="${esc(c.link)}" target="_blank" rel="noopener">التفاصيل والتسجيل ↗</a>` : ""}
    </article>`).join("")
    : `<div class="conf-empty"><span aria-hidden="true">🗓</span><h3>لا توجد مواعيد معلنة حاليا</h3><p>سيتم الإعلان هنا عن الندوات والمؤتمرات القادمة فور تحديد مواعيدها.</p></div>`;
  const ctabs = $$(".conf-tab"), cpanes = $$(".conf-pane");
  const showConf = (k) => {
    ctabs.forEach((t) => { const on = t.dataset.ct === k; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", on); });
    cpanes.forEach((p) => p.classList.toggle("is-active", p.dataset.cp === k));
    $$(`.conf-pane[data-cp="${k}"] .reveal`).forEach((el) => el.classList.add("in"));
  };
  ctabs.forEach((t) => t.addEventListener("click", () => showConf(t.dataset.ct)));
  if (!upcoming.length) showConf("past");

  /* ── المداخلات (6 أولا ثم الكل) ── */
  const SHOW = 6;
  $("#talks-count").textContent = `${talksN} مداخلة في ندوات ومؤتمرات وطنية ودولية`;
  $("#talks").innerHTML = P.talks.map((t, i) => {
    const pics = (t.poster ? [t.poster] : []).concat(t.photos || []);
    return `
    <li class="${i >= SHOW ? "is-extra" : ""} ${pics.length ? "has-media" : ""}">
      <span class="talk-year">${esc(t.year)}</span>
      <div>
        ${t.kind ? `<span class="talk-kind">${esc(t.kind)}${t.date ? " · " + esc(t.date) : ""}</span>` : ""}
        <h4>${esc(t.title)}</h4><p>${esc(t.event)}</p>
        ${t.note ? `<details class="conf-note"><summary>كلمة بالمناسبة</summary><p>${esc(t.note)}</p></details>` : ""}
      </div>
      ${pics.length ? `<button type="button" class="talk-media" data-album="t${i}" aria-label="صور: ${esc(t.title)}"><img src="${esc(t.poster || thumb(pics[0]))}" alt="" loading="lazy"><span>📷 ${pics.length}</span></button>` : ""}
    </li>`;
  }).join("");
  const moreBtn = $("#talks-more");
  if (talksN <= SHOW) moreBtn.remove();
  else moreBtn.addEventListener("click", () => {
    const open = $("#talks").classList.toggle("show-all");
    moreBtn.textContent = open ? "إخفاء" : "عرض كل المداخلات";
  });

  /* ── الإشراف ── */
  const sup = [
    [P.phdDefended.length + P.phdOngoing.length, "أطروحة دكتوراه تحت إشرافه"],
    [P.juries, "أطروحة ناقشها عضوا ومقررا"],
    [P.masterTheses, "رسالة ماستر مؤطرة"],
    [P.licenceProjects, "بحث إجازة مؤطر"]
  ];
  $("#sup-stats").innerHTML = sup.map(([n, t]) => `<div class="sup-stat reveal"><strong data-count="${n}">${n}</strong><span>${t}</span></div>`).join("");
  $("#phd-done").innerHTML = P.phdDefended.map((t, i) => {
    if (!t.photos && !t.jury) return `<li><span class="done">✓</span>${esc(t.title)} <small>${esc(t.date)}</small></li>`;
    const pics = t.photos || [];
    return `<li class="phd-rich">
      ${pics.length ? `<button type="button" class="phd-cover" data-album="p${i}" aria-label="صور المناقشة"><img src="${esc(thumb(pics[0]))}" alt="" loading="lazy"><span>📷 ${pics.length}</span></button>` : ""}
      <div class="phd-body">
        <span class="done">✓</span><strong>${esc(t.title)}</strong>
        <small class="phd-meta">${esc(t.day || t.date)}${t.student ? " · " + esc(t.student) : ""}</small>
        ${t.mention ? `<span class="phd-mention">ميزة: ${esc(t.mention)}</span>` : ""}
        ${t.jury ? `<details class="conf-note"><summary>لجنة المناقشة</summary><ul class="phd-jury">${t.jury.map((j) => `<li>${esc(j)}</li>`).join("")}</ul></details>` : ""}
        ${t.note ? `<details class="conf-note"><summary>كلمة المشرف</summary>${String(t.note).split("\n").map((p) => `<p>${esc(p)}</p>`).join("")}</details>` : ""}
      </div>
    </li>`;
  }).join("");
  $("#phd-ongoing").innerHTML = P.phdOngoing.map((t) => `<li>${esc(t)}</li>`).join("");

  /* ── القنوات ── */
  const channels = [
    L.youtube && { href: L.youtube, icon: "yt", cls: "ch-yt", title: "قناة اليوتيوب", text: "محاضرات في المدخل لدراسة القانون والقانون العقاري." },
    L.facebookPage && { href: L.facebookPage, icon: "fb", cls: "ch-fb", title: "الصفحة الرسمية", text: "نشر المعلومة القانونية والتوعية القانونية." },
    L.facebookProfile && { href: L.facebookProfile, icon: "user", cls: "ch-pr", title: "الحساب الشخصي", text: "حساب الدكتور عبد العزيز إدزني على فيسبوك." },
    L.linkedin && { href: L.linkedin, icon: "in", cls: "ch-in", title: "لينكدإن", text: "الملف المهني للدكتور عبد العزيز إدزني." },
    L.centre && { href: L.centre, icon: "globe", cls: "ch-ce", title: "المركز الوطني", text: "الموقع الرسمي للمركز الوطني للدراسات القانونية والأبحاث البيئية." }
  ].filter(Boolean);
  $("#channels").innerHTML = channels.map((c) => `
    <a class="channel ${c.cls} reveal" href="${esc(c.href)}" target="_blank" rel="noopener">
      <span class="ch-icon">${svg(c.icon)}</span>
      <strong>${c.title}</strong>
      <span>${c.text}</span>
      <span class="ch-go" aria-hidden="true">↖</span>
    </a>`).join("");

  /* ── التواصل ── */
  $("#contact-list").innerHTML = [
    L.email && `<li><a href="mailto:${esc(L.email)}">${svg("mail")}<span><small>البريد المهني</small>${esc(L.email)}</span></a></li>`,
    L.email2 && `<li><a href="mailto:${esc(L.email2)}">${svg("mail")}<span><small>البريد الإلكتروني</small>${esc(L.email2)}</span></a></li>`,
    L.phone && `<li><a href="tel:${esc(L.phone.replace(/\s/g, ""))}">${svg("phone")}<span><small>الهاتف</small><bdi dir="ltr">${esc(L.phone)}</bdi></span></a></li>`,
    L.facebookPage && `<li><a href="${esc(L.facebookPage)}" target="_blank" rel="noopener">${svg("fb")}<span><small>فيسبوك</small>الصفحة الرسمية</span></a></li>`,
    L.youtube && `<li><a href="${esc(L.youtube)}" target="_blank" rel="noopener">${svg("yt")}<span><small>يوتيوب</small>@idziniabdelaziz2893</span></a></li>`,
    L.linkedin && `<li><a href="${esc(L.linkedin)}" target="_blank" rel="noopener">${svg("in")}<span><small>لينكدإن</small>Idzini Abdelaaziz</span></a></li>`
  ].filter(Boolean).join("");

  /* ── استشارة قانونية ── */
  const consultMail = L.consultEmail || L.email2 || L.email;
  if (consultMail) {
    const subject = "طلب استشارة قانونية";
    const body = "السلام عليكم دكتور عبد العزيز إدزني،\n\nالاسم الكامل:\nرقم الهاتف:\nالمدينة:\nمجال الاستشارة (عقاري، مدني، مسطري...):\n\nموضوع الاستشارة:\n\n\nوشكرا.";
    const href = "mailto:" + consultMail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    document.querySelectorAll("[data-consult]").forEach((a) => { a.href = href; });
    const ce = $("#consult-email"); if (ce) ce.textContent = consultMail;
  }

  /* ── التبويبات ── */
  const tabs = $$(".tab");
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((t) => { const on = t === tab; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", on); });
    $$(".panel").forEach((p) => p.classList.toggle("is-active", p.dataset.panel === tab.dataset.tab));
    $$(`.panel[data-panel="${tab.dataset.tab}"] .reveal`).forEach((el) => el.classList.add("in"));
    flows.forEach((f) => (f.root.offsetParent ? f.play() : f.stop()));
  }));

  /* ── القائمة ── */
  const burger = $("#burger");
  const setMenu = (o) => { burger.setAttribute("aria-expanded", o); document.body.classList.toggle("menu-open", o); };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  $$("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* ── تمرير ── */
  const header = $("#header"), bar = $("#progress");
  const onScroll = () => {
    header.classList.toggle("scrolled", scrollY > 30);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── ميلان الكتب ── */
  if (fine && !calm) {
    $$(".book-3d").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 22}deg`);
        el.style.setProperty("--rx", `${(0.5 - (e.clientY - r.top) / r.height) * 12}deg`);
      });
      el.addEventListener("mouseleave", () => { el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg"); });
    });
  }

  /* ── عداد الأرقام ── */
  const countUp = (el) => {
    const target = +el.dataset.count;
    if (calm || !target) return;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = "0";
    requestAnimationFrame(step);
  };

  /* ── الظهور التدريجي ── */
  $$(".stats, .shelf, .confs, .sup-stats, .channel-grid, .articles").forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty("--d", `${(i % 6) * 80}ms`)));
  document.documentElement.classList.add("js");
  if ("IntersectionObserver" in window && !calm) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      $$("[data-count]", en.target).forEach(countUp);
      if (en.target.matches("[data-count]")) countUp(en.target);
      io.unobserve(en.target);
    }), { threshold: 0.15 });
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  }
})();
