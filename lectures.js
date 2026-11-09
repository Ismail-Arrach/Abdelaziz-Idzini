/* قسم «المحاضرات والمقالات»: قراءة فقط داخل الموقع.
   الصفحات مخزنة كصور مقطعة ومخلوطة (images/lectures/<id>/<n>.jpg) ويعاد ترتيبها هنا على canvas،
   مع علامة مائية ومنع النقر الأيمن والسحب والطباعة والحفظ، وإخفاء المحتوى عند مغادرة النافذة.
   ملاحظة: لا يمكن لأي موقع منع التصوير بالهاتف منعا تاما؛ هذه الإجراءات تصعّب النسخ فقط. */
(function () {
  "use strict";
  /* global PROFILE */
  var LIST = (typeof PROFILE !== "undefined" && PROFILE.lectures) || [];
  var grid = document.getElementById("lectures-grid");
  if (!grid || !LIST.length) return;

  var COLS = 6, ROWS = 8;
  // نفس الخلط المستعمل عند إعداد الصور (build-pages.ps1)
  function perm(n, seed) {
    var a = [], s = seed, i, j, t;
    for (i = 0; i < n; i++) a.push(i);
    var M = 2147483648, A = 1103515245, hi = Math.floor(A / 65536), lo = A % 65536;
    for (i = n - 1; i > 0; i--) {
      // (s * A + 12345) mod 2^31 sans dépasser la précision des nombres JS
      s = (((s * hi) % M) * 65536 + s * lo + 12345) % M;
      j = s % (i + 1); t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var items = LIST.slice().sort(function (a, b) { return (b.sort || 0) - (a.sort || 0); });
  var countEl = document.getElementById("n-lectures");
  if (countEl) countEl.textContent = items.length;

  grid.innerHTML = items.map(function (l, i) {
    return '<article class="lec-card reveal" style="--d:' + (i * 0.08) + 's">' +
      '<div class="lec-top"><span class="lec-year">' + esc(l.year || "—") + '</span><span class="lec-kind">' + esc(l.kind) + '</span></div>' +
      '<h3>' + esc(l.title) + '</h3>' +
      '<p class="lec-where">' + esc(l.where) + '</p>' +
      '<div class="lec-foot"><span class="lec-pages">' + l.pages + ' صفحة</span>' +
      '<button type="button" class="btn btn-gold lec-open" data-id="' + esc(l.id) + '">اقرأ الآن <span aria-hidden="true">←</span></button></div>' +
      '</article>';
  }).join("");

  // البطاقات أضيفت بعد تهيئة حركة الظهور في script.js، فنظهرها هنا
  var cards = grid.querySelectorAll(".lec-card");
  setTimeout(function () {
    Array.prototype.forEach.call(cards, function (c) { c.classList.add("in"); });
    var head = document.querySelector("#lectures .section-head");
    if (head) head.classList.add("in");
  }, 60);

  /* ── القارئ ── */
  var reader = document.createElement("div");
  reader.className = "lec-reader";
  reader.setAttribute("role", "dialog");
  reader.setAttribute("aria-modal", "true");
  reader.hidden = true;
  reader.innerHTML =
    '<div class="lec-bar">' +
      '<button type="button" class="lec-close" aria-label="إغلاق">✕</button>' +
      '<div class="lec-bar-title"><strong></strong><small></small></div>' +
      '<div class="lec-zoom"><button type="button" data-z="-1" aria-label="تصغير">−</button><span>100%</span><button type="button" data-z="1" aria-label="تكبير">+</button></div>' +
    '</div>' +
    '<div class="lec-scroll"><div class="lec-pages-wrap"></div></div>' +
    '<div class="lec-guard" aria-hidden="true"><p>المحتوى محمي — عُد إلى النافذة لمتابعة القراءة</p></div>' +
    '<div class="lec-progress"><span></span></div>';
  document.body.appendChild(reader);

  var wrap = reader.querySelector(".lec-pages-wrap");
  var scroller = reader.querySelector(".lec-scroll");
  var zoomLabel = reader.querySelector(".lec-zoom span");
  var bar = reader.querySelector(".lec-progress span");
  var zoom = 1, current = null, observer = null;

  function watermark(ctx, w, h) {
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = "#0e1a2b";
    ctx.font = "600 " + Math.round(w / 26) + "px 'IBM Plex Sans Arabic', Tahoma, sans-serif";
    ctx.textAlign = "center";
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 6);
    for (var y = -h; y < h; y += w / 4) {
      for (var x = -w; x < w; x += w / 1.6) ctx.fillText("د. عبد العزيز إدزني — للقراءة فقط", x, y);
    }
    ctx.restore();
  }

  function drawPage(canvas) {
    if (canvas.dataset.done) return;
    canvas.dataset.done = "1";
    var img = new Image();
    img.onload = function () {
      var tw = Math.floor(img.width / COLS), th = Math.floor(img.height / ROWS);
      canvas.width = tw * COLS; canvas.height = th * ROWS;
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      var p = perm(COLS * ROWS, 7919 * Number(canvas.dataset.n) + 17);
      for (var i = 0; i < p.length; i++) {
        var src = p[i];
        ctx.drawImage(img, (i % COLS) * tw, Math.floor(i / COLS) * th, tw, th, (src % COLS) * tw, Math.floor(src / COLS) * th, tw, th);
      }
      watermark(ctx, canvas.width, canvas.height);
      // les pages scannées n'ont pas toutes la même hauteur : on adopte la vraie proportion
      canvas.parentNode.style.aspectRatio = canvas.width + " / " + canvas.height;
      canvas.parentNode.classList.add("is-ready");
      img.src = "";
    };
    img.src = canvas.dataset.src;
  }

  function open(id) {
    var l = items.filter(function (x) { return x.id === id; })[0];
    if (!l) return;
    current = l;
    reader.querySelector(".lec-bar-title strong").textContent = l.title;
    reader.querySelector(".lec-bar-title small").textContent = l.where + (l.year ? " · " + l.year : "");
    var html = "";
    for (var n = 1; n <= l.pages; n++) {
      html += '<figure class="lec-page" style="aspect-ratio:' + (l.ratio || 0.8) + '"><canvas data-n="' + n + '" data-src="images/lectures/' + l.id + "/" + n + '.jpg"></canvas><figcaption>' + n + " / " + l.pages + "</figcaption></figure>";
    }
    wrap.innerHTML = html;
    reader.hidden = false;
    document.documentElement.classList.add("lec-lock");
    scroller.scrollTop = 0;
    setZoom(1);
    if (observer) observer.disconnect();
    observer = "IntersectionObserver" in window ? new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { drawPage(e.target); observer.unobserve(e.target); } });
    }, { root: scroller, rootMargin: "800px 0px" }) : null;
    Array.prototype.forEach.call(wrap.querySelectorAll("canvas"), function (c) { observer ? observer.observe(c) : drawPage(c); });
    reader.querySelector(".lec-close").focus();
    if (window.idzTrack) window.idzTrack("book", "قراءة: " + l.title);
  }

  function close() {
    reader.hidden = true;
    wrap.innerHTML = "";
    document.documentElement.classList.remove("lec-lock");
    if (observer) observer.disconnect();
    current = null;
  }

  function setZoom(z) {
    zoom = Math.min(1.8, Math.max(0.6, z));
    wrap.style.setProperty("--z", zoom);
    zoomLabel.textContent = Math.round(zoom * 100) + "%";
  }

  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".lec-open");
    if (b) open(b.dataset.id);
  });
  reader.querySelector(".lec-close").addEventListener("click", close);
  reader.querySelector(".lec-zoom").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (b) setZoom(zoom + 0.2 * Number(b.dataset.z));
  });
  scroller.addEventListener("scroll", function () {
    var max = scroller.scrollHeight - scroller.clientHeight;
    bar.style.width = (max > 0 ? (scroller.scrollTop / max) * 100 : 0) + "%";
  }, { passive: true });

  /* ── الحماية ── */
  function guarded(e) { return !reader.hidden && reader.contains(e.target); }
  ["contextmenu", "dragstart", "selectstart", "copy", "cut"].forEach(function (t) {
    document.addEventListener(t, function (e) { if (guarded(e) || (t === "contextmenu" && e.target.tagName === "CANVAS")) e.preventDefault(); });
  });
  function hide(on) { reader.classList.toggle("is-guarded", on); }
  window.addEventListener("blur", function () { if (!reader.hidden) hide(true); });
  window.addEventListener("focus", function () { hide(false); });
  document.addEventListener("visibilitychange", function () { if (!reader.hidden) hide(document.hidden); });
  document.addEventListener("keydown", function (e) {
    if (reader.hidden) return;
    var k = (e.key || "").toLowerCase();
    if (k === "escape") { close(); return; }
    if ((e.ctrlKey || e.metaKey) && ["s", "p", "c", "a", "u"].indexOf(k) > -1) { e.preventDefault(); hide(true); setTimeout(function () { hide(false); }, 1200); }
    if (k === "printscreen" || (e.metaKey && e.shiftKey)) {
      hide(true);
      try { navigator.clipboard && navigator.clipboard.writeText(""); } catch (err) {}
      setTimeout(function () { hide(false); }, 1500);
    }
  });
  document.addEventListener("keyup", function (e) {
    if (!reader.hidden && (e.key || "").toLowerCase() === "printscreen") {
      try { navigator.clipboard && navigator.clipboard.writeText(""); } catch (err) {}
    }
  });
  window.addEventListener("beforeprint", function () { if (!reader.hidden) wrap.innerHTML = ""; });
})();
