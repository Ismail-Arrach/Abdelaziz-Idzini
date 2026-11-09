/**
 * إحصائيات موقع د. عبد العزيز إدزني
 * - doPost: يسجل كل حدث يرسله الموقع في ورقة "Events".
 * - monthlyReport: يرسل كل شهر تقريرا بصيغة Excel (.xlsx) إلى البريد المحدد.
 * - setup: يُشغَّل مرة واحدة لإنشاء الأوراق وبرمجة الإرسال الشهري.
 * الخطوات كاملة في STATISTIQUES.md
 */

var REPORT_EMAIL = "a.idzini@gmail.com";   // يمكن وضع عدة عناوين مفصولة بفاصلة
var SITE_NAME = "موقع د. عبد العزيز إدزني";
var EVENTS = { visit: 1, section: 1, book: 1, tab: 1, consult: 1, contact: 1, social: 1, click: 1 };

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Events");
  if (!sh) {
    sh = ss.insertSheet("Events");
    sh.appendRow(["التاريخ", "الزائر", "الجلسة", "الحدث", "التفاصيل", "الجهاز", "المصدر"]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (!EVENTS[d.e]) return ContentService.createTextOutput("ignored");
    var clean = function (v, n) { return String(v || "").replace(/^[=+\-@]/, "'").slice(0, n); };
    var lock = LockService.getScriptLock(); lock.waitLock(5000);
    sheet_().appendRow([new Date(), clean(d.v, 40), clean(d.s, 40), d.e, clean(d.l, 200), clean(d.d, 20), clean(d.r, 80)]);
    lock.releaseLock();
    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error");
  }
}

function doGet() {
  var n = Math.max(sheet_().getLastRow() - 1, 0);
  return ContentService.createTextOutput("OK — " + n + " حدث مسجل");
}

/* ── التقرير الشهري ── */
function monthlyReport() {
  var now = new Date();
  var start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  var end = new Date(now.getFullYear(), now.getMonth(), 1);
  sendReport_(start, end);
}

/* لتجربة التقرير فورا على الشهر الحالي */
function testReportNow() {
  var now = new Date();
  sendReport_(new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 1));
}

function sendReport_(start, end) {
  var tz = Session.getScriptTimeZone();
  var label = Utilities.formatDate(start, tz, "yyyy-MM");
  var rows = sheet_().getDataRange().getValues().slice(1).filter(function (r) {
    return r[0] instanceof Date && r[0] >= start && r[0] < end;
  });

  var count = function (filterFn, keyFn) {
    var m = {};
    rows.filter(filterFn).forEach(function (r) { var k = keyFn(r) || "—"; m[k] = (m[k] || 0) + 1; });
    return Object.keys(m).map(function (k) { return [k, m[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
  };
  var is = function (ev) { return function (r) { return r[3] === ev; }; };

  var visits = rows.filter(is("visit")).length;
  var visitors = {}; rows.forEach(function (r) { visitors[r[1]] = 1; });
  var nVisitors = Object.keys(visitors).length;
  var consults = rows.filter(is("consult")).length;

  var ss = SpreadsheetApp.create("إحصائيات " + label);
  var put = function (sh, title, header, data) {
    sh.setRightToLeft(true);
    sh.getRange(1, 1).setValue(title).setFontWeight("bold").setFontSize(14);
    sh.getRange(3, 1, 1, header.length).setValues([header]).setFontWeight("bold").setBackground("#0e1a2b").setFontColor("#ffffff");
    if (data.length) sh.getRange(4, 1, data.length, header.length).setValues(data);
    sh.autoResizeColumns(1, header.length);
  };

  var s1 = ss.getSheets()[0]; s1.setName("ملخص");
  put(s1, SITE_NAME + " — شهر " + label, ["المؤشر", "العدد"], [
    ["عدد الزيارات", visits],
    ["عدد الزوار (مختلفين)", nVisitors],
    ["مشاهدات الأقسام", rows.filter(is("section")).length],
    ["الاطلاع على الكتب", rows.filter(is("book")).length],
    ["طلبات الاستشارة القانونية", consults],
    ["نقرات التواصل (بريد/هاتف)", rows.filter(is("contact")).length],
    ["نقرات فيسبوك ويوتيوب", rows.filter(is("social")).length]
  ]);
  put(ss.insertSheet("الأقسام"), "عدد مشاهدات كل قسم", ["القسم", "المشاهدات"], count(is("section"), function (r) { return r[4]; }));
  put(ss.insertSheet("الكتب"), "الكتب الأكثر اطلاعا", ["الكتاب", "النقرات"], count(is("book"), function (r) { return r[4]; }));
  put(ss.insertSheet("النقرات"), "كل النقرات", ["النوع", "التفاصيل", "العدد"],
    count(function (r) { return r[3] !== "visit" && r[3] !== "section" && r[3] !== "book"; }, function (r) { return r[3] + "|" + r[4]; })
      .map(function (x) { var p = x[0].split("|"); return [p[0], p[1], x[1]]; }));
  put(ss.insertSheet("حسب اليوم"), "الزيارات حسب اليوم", ["اليوم", "الزيارات"],
    count(is("visit"), function (r) { return Utilities.formatDate(r[0], tz, "yyyy-MM-dd"); }).sort(function (a, b) { return a[0] < b[0] ? -1 : 1; }));
  put(ss.insertSheet("الأجهزة والمصادر"), "الأجهزة ومصادر الزيارات", ["الجهاز / المصدر", "الزيارات"],
    count(is("visit"), function (r) { return r[5]; }).concat([["", ""]], count(is("visit"), function (r) { return r[6] || "مباشر"; })));
  SpreadsheetApp.flush();

  var url = "https://docs.google.com/spreadsheets/d/" + ss.getId() + "/export?format=xlsx";
  var blob = UrlFetchApp.fetch(url, { headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() } })
    .getBlob().setName("statistiques-idzini-" + label + ".xlsx");

  MailApp.sendEmail({
    to: REPORT_EMAIL,
    subject: "إحصائيات " + SITE_NAME + " — " + label,
    htmlBody: '<div dir="rtl" style="font-family:Tahoma,Arial">' +
      "<h2>إحصائيات شهر " + label + "</h2>" +
      "<p>عدد الزيارات: <b>" + visits + "</b><br>عدد الزوار: <b>" + nVisitors + "</b><br>" +
      "طلبات الاستشارة القانونية: <b>" + consults + "</b></p>" +
      "<p>التفاصيل الكاملة (الأقسام، الكتب، النقرات، الأيام، الأجهزة) في ملف Excel المرفق.</p></div>",
    attachments: [blob]
  });
  DriveApp.getFileById(ss.getId()).setTrashed(true);
}

/* يُشغَّل مرة واحدة */
function setup() {
  sheet_();
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "monthlyReport") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("monthlyReport").timeBased().onMonthDay(1).atHour(8).create();
}
