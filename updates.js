/* قسم «المستجدات القانونية»: يقرأ PROFILE.updates ويعرضها من الأحدث إلى الأقدم مع تصفية حسب النوع */
(function () {
  "use strict";
  /* global PROFILE */
  var P = typeof PROFILE !== "undefined" ? PROFILE : {};
  var list = (P.updates || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  var box = document.getElementById("upd-list"), filters = document.getElementById("upd-filters");
  if (!box) return;

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmt(d) {
    try { return new Date(d + "T12:00:00").toLocaleDateString("ar-MA", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return d; }
  }
  var COLORS = { "تشريع": "#7a2e2a", "اجتهاد قضائي": "#0e1a2b", "نص تنظيمي": "#0f766e", "مستجد": "#b7791f", "إعلان": "#5d6675" };
  var fb = (P.links && P.links.facebookPage) || "";

  function show(el) { setTimeout(function () { el.classList.add("in"); }, 60); }

  if (!list.length) {
    filters.hidden = true;
    box.innerHTML = '<div class="upd-empty reveal"><span class="upd-empty-ico" aria-hidden="true">§</span>' +
      "<h3>تُنشر المستجدات القانونية هنا قريبا</h3><p>في انتظار ذلك، تابعوا المستجدات التي ينشرها الدكتور عبد العزيز إدزني على صفحته الرسمية.</p>" +
      (fb ? '<a class="btn btn-gold" href="' + esc(fb) + '" target="_blank" rel="noopener">الصفحة الرسمية على فيسبوك ←</a>' : "") + "</div>";
    show(box.firstElementChild);
    return;
  }

  var types = ["الكل"].concat(list.map(function (u) { return u.type; }).filter(function (t, i, a) { return t && a.indexOf(t) === i; }));
  filters.innerHTML = types.map(function (t, i) { return '<button type="button" class="upd-chip' + (i ? "" : " on") + '" data-t="' + esc(t) + '">' + esc(t) + "</button>"; }).join("");

  box.innerHTML = list.map(function (u, i) {
    var c = COLORS[u.type] || "#c9a04f", d = String(u.date || "");
    return '<article class="upd-card reveal" data-t="' + esc(u.type) + '" style="--c:' + c + ";--d:" + Math.min(i, 6) * 70 + 'ms">' +
      '<div class="upd-date"><b>' + esc(d.slice(8, 10) || "—") + "</b><span>" + esc(fmt(d).replace(/^\d+\s*/, "")) + "</span></div>" +
      '<div class="upd-body"><span class="upd-type">' + esc(u.type || "مستجد") + "</span>" +
      "<h3>" + esc(u.title) + "</h3>" + (u.summary ? '<p class="upd-sum">' + esc(u.summary) + "</p>" : "") +
      (u.body ? '<div class="upd-more" hidden>' + u.body + "</div>" : "") +
      '<div class="upd-foot">' + (u.source ? '<span class="upd-src">المصدر: ' + esc(u.source) + "</span>" : "") +
        (u.body ? '<button type="button" class="upd-toggle">اقرأ المزيد</button>' : "") +
        (u.images && u.images.length ? '<button type="button" class="upd-doc" data-i="' + i + '">📄 نص الحكم (' + u.images.length + " صفحات)</button>" : "") +
        (u.link ? '<a class="upd-link" href="' + esc(u.link) + '" target="_blank" rel="noopener">النص الكامل ↗</a>' : "") +
      "</div></div></article>";
  }).join("");
  Array.prototype.forEach.call(box.children, show);

  filters.addEventListener("click", function (e) {
    var b = e.target.closest(".upd-chip"); if (!b) return;
    Array.prototype.forEach.call(filters.children, function (x) { x.classList.toggle("on", x === b); });
    Array.prototype.forEach.call(box.children, function (card) { card.hidden = b.dataset.t !== "الكل" && card.dataset.t !== b.dataset.t; });
  });
  /* عارض صفحات الوثيقة */
  var viewer = document.createElement("div");
  viewer.className = "upd-viewer"; viewer.hidden = true;
  viewer.setAttribute("role", "dialog"); viewer.setAttribute("aria-modal", "true");
  viewer.innerHTML = '<div class="upd-vbar"><button type="button" class="upd-vclose" aria-label="إغلاق">✕</button><strong></strong></div><div class="upd-vpages"></div>';
  document.body.appendChild(viewer);
  function closeViewer() { viewer.hidden = true; document.documentElement.classList.remove("lec-lock"); viewer.querySelector(".upd-vpages").innerHTML = ""; }
  viewer.querySelector(".upd-vclose").addEventListener("click", closeViewer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !viewer.hidden) closeViewer(); });
  viewer.addEventListener("contextmenu", function (e) { e.preventDefault(); });

  box.addEventListener("click", function (e) {
    var doc = e.target.closest(".upd-doc");
    if (doc) {
      var u = list[Number(doc.dataset.i)];
      viewer.querySelector("strong").textContent = u.title;
      viewer.querySelector(".upd-vpages").innerHTML = u.images.map(function (s, n) {
        return '<figure><img src="' + esc(s) + '" alt="الصفحة ' + (n + 1) + '" loading="lazy" draggable="false"><figcaption>' + (n + 1) + " / " + u.images.length + "</figcaption></figure>";
      }).join("");
      viewer.hidden = false; document.documentElement.classList.add("lec-lock");
      viewer.querySelector(".upd-vpages").scrollTop = 0;
      return;
    }
    var t = e.target.closest(".upd-toggle"); if (!t) return;
    var more = t.closest(".upd-body").querySelector(".upd-more");
    more.hidden = !more.hidden; t.textContent = more.hidden ? "اقرأ المزيد" : "إخفاء";
  });
})();
