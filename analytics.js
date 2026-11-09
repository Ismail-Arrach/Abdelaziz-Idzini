/* إحصائيات الزوار — ترسل أحداثا مجهولة الهوية إلى Google Apps Script (انظر STATISTIQUES.md).
   لا يُجمع أي معطى شخصي: معرّف عشوائي فقط، نوع الجهاز، ومصدر الزيارة. */
(function () {
  "use strict";
  /* global PROFILE */
  var URL = (typeof PROFILE !== "undefined" && PROFILE.analyticsUrl) || "";
  if (!URL) return;

  function rid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  function stored(store, key) {
    try { var v = store.getItem(key); if (!v) { v = rid(); store.setItem(key, v); } return v; }
    catch (e) { return rid(); }
  }
  var vid = stored(window.localStorage, "idz_vid");
  var sid = stored(window.sessionStorage, "idz_sid");
  var ref = "";
  try { if (document.referrer) { var h = new window.URL(document.referrer).hostname; if (h !== location.hostname) ref = h; } } catch (e) {}

  function send(ev, label) {
    var data = JSON.stringify({
      e: ev, l: String(label || "").slice(0, 200), v: vid, s: sid,
      d: window.innerWidth < 768 ? "هاتف" : (window.innerWidth < 1100 ? "لوحي" : "حاسوب"),
      r: ref
    });
    try { if (navigator.sendBeacon && navigator.sendBeacon(URL, new Blob([data], { type: "text/plain" }))) return; } catch (e) {}
    try { fetch(URL, { method: "POST", mode: "no-cors", body: data, keepalive: true }); } catch (e) {}
  }
  window.idzTrack = send;

  /* زيارة واحدة لكل جلسة */
  var first = true;
  try { first = !sessionStorage.getItem("idz_seen"); sessionStorage.setItem("idz_seen", "1"); } catch (e) {}
  if (first) send("visit", ref || "مباشر");

  /* مشاهدة الأقسام (مرة لكل تحميل) */
  var names = { about: "نبذة", path: "المسار", works: "المؤلفات", teaching: "التدريس", activities: "الأنشطة العلمية",
    supervision: "الإشراف", consult: "استشارة قانونية", contact: "تواصل" };
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { send("section", names[en.target.id]); io.unobserve(en.target); }
      });
    }, { threshold: 0.3 });
    Object.keys(names).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* النقرات */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a, button");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (a.hasAttribute("data-consult")) send("consult", "طلب استشارة قانونية");
    else if (a.classList.contains("flow-item")) send("book", a.getAttribute("aria-label"));
    else if (a.classList.contains("tab")) send("tab", a.textContent.replace(/\d+/g, "").trim());
    else if (a.id === "talks-more") send("click", "عرض كل المداخلات");
    else if (href.indexOf("mailto:") === 0) send("contact", "بريد: " + href.slice(7).split("?")[0]);
    else if (href.indexOf("tel:") === 0) send("contact", "هاتف");
    else if (/facebook\.com/.test(href)) send("social", "فيسبوك");
    else if (/youtube\.com|youtu\.be/.test(href)) send("social", "يوتيوب");
    else if (/^https?:/.test(href)) send("click", "رابط خارجي: " + href.slice(0, 120));
  }, true);
})();
