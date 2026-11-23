(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var S = window.SITE, P = window.PROJECTS, C = window.CATEGORIES;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var bySlug = {}; P.forEach(function (p) { bySlug[p.slug] = p; });
  var cover = function (p) { return p.images[p.cover]; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var INITIAL = 6;

  /* ── personal details from config ── */
  document.title = S.name + " — " + S.roles[0] + " & " + S.roles[1];
  var copy = "© " + S.name + " " + S.year;
  $("#copy").textContent = copy; $("#footName").textContent = copy;
  $("#heroL").textContent = "Hello, I’m " + S.name + " — a " + S.roles[0].toLowerCase() + ", " + S.roles[2].toLowerCase() + " and " + S.roles[1].toLowerCase() + " shaping fashion, jewelry and beauty images.";
  // giant hero title: one block per line, © after the last one
  $("#wordmark").innerHTML = S.heroLines.map(function (l, i) {
    return '<span class="ln">' + esc(l) + (i === S.heroLines.length - 1 ? '<span class="c">©</span>' : "") + "</span>";
  }).join("");
  $("#wordmark").setAttribute("aria-label", "I’m " + S.name);
  $("#alias").textContent = "call me " + S.nickname;
  $("#bigWord").innerHTML = '<span>' + esc(S.footWord) + '</span><span class="c">©</span>';
  var aboutName = $("#aboutName"); if (aboutName) aboutName.textContent = S.name;
  var aboutNick = $("#aboutNick"); if (aboutNick) aboutNick.textContent = S.nickname;
  var mail = $("#mailBtn");
  if (S.email) { mail.hidden = false; mail.href = "mailto:" + S.email; mail.textContent = S.email; }
  var soc = [];
  if (S.instagram) soc.push(["Instagram", S.instagram]);
  if (S.behance) soc.push(["Behance", S.behance]);
  if (S.phone) soc.push([S.phone, "tel:" + S.phone.replace(/\s/g, "")]);
  $("#socials").innerHTML = soc.map(function (s) { return '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + "</a></li>"; }).join("");

  /* ── brands: marquee + typographic list ── */
  var mq = S.brands.map(function (b) { return "<span>" + esc(b) + "</span>"; }).join("");
  $("#brandTrack").innerHTML = mq + mq;
  $("#clients").innerHTML = S.brands.map(function (b) { return "<span>" + esc(b) + "</span>"; }).join(" <i>✦</i> ");

  /* ── expertise ── */
  var icons = [
    '<path d="M4 20 20 4M9 4h11v11" stroke="#000" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    '<circle cx="12" cy="12" r="3" stroke="#000" stroke-width="1.7" fill="none"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="#000" stroke-width="1.7" stroke-linecap="round"/>',
    '<rect x="3.5" y="7" width="17" height="12" rx="3" stroke="#000" stroke-width="1.7" fill="none"/><circle cx="12" cy="13" r="3.2" stroke="#000" stroke-width="1.7" fill="none"/><path d="M8.5 7 10 4.5h4L15.5 7" stroke="#000" stroke-width="1.7" stroke-linejoin="round" fill="none"/>',
    '<path d="M4 5h16v10H4zM8 19h8M12 15v4" stroke="#000" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  ];
  $("#expertise").innerHTML = S.expertise.map(function (e, i) {
    var im = window.IMG && window.IMG[e.img];
    var pic = im ? '<div class="pic"><img src="' + im.t + '" width="' + im.w + '" height="' + im.h + '" alt="" loading="lazy"></div>' : "";
    return '<article class="card-x reveal">' + pic + '<span class="ico"><svg width="18" height="18" viewBox="0 0 24 24">' + icons[i % icons.length] + '</svg></span><div class="txt"><h3>' + esc(e.t) + "</h3><p>" + esc(e.d) + "</p></div></article>";
  }).join("");

  /* ── faq ── */
  $("#faq").innerHTML = S.faq.map(function (f, i) {
    return "<details" + (i === 0 ? " open" : "") + "><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>";
  }).join("");
  $$("#faq details").forEach(function (d) {
    d.addEventListener("toggle", function () { if (d.open) $$("#faq details").forEach(function (o) { if (o !== d) o.open = false; }); });
  });

  /* ── work grid ── */
  var filter = "all", expanded = false;
  var fEl = $("#filters"), gEl = $("#grid"), moreBtn = $("#moreBtn");
  fEl.innerHTML = C.map(function (c) { return '<button role="tab" data-f="' + c[0] + '" aria-selected="' + (c[0] === "all") + '">' + esc(c[1]) + "</button>"; }).join("");

  function renderGrid() {
    var list = P.filter(function (p) { return filter === "all" || p.cats.indexOf(filter) > -1; });
    var shown = expanded ? list : list.slice(0, INITIAL);
    gEl.innerHTML = shown.map(function (p) {
      var c = cover(p);
      return '<a class="card reveal" href="#project/' + p.slug + '" data-open="' + p.slug + '">' +
        '<div class="card-media"><img src="' + c.t + '" width="' + c.w + '" height="' + c.h + '" alt="' + esc(p.title) + '" loading="lazy"><span class="count">' + p.images.length + ' images</span></div>' +
        "<h3>" + esc(p.title) + '</h3><p class="cat">' + p.tags.map(esc).join(" • ") + "</p></a>";
    }).join("");
    moreBtn.hidden = expanded || list.length <= INITIAL;
    observe();
  }
  fEl.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    filter = b.dataset.f; expanded = false;
    $$("button", fEl).forEach(function (x) { x.setAttribute("aria-selected", x === b); });
    renderGrid();
  });
  moreBtn.addEventListener("click", function () { expanded = true; renderGrid(); });

  /* ── scroll reveal + nav spy ── */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .06 }) : null;
  function observe() { $$(".reveal:not(.in)").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); }); }

  var links = $$(".pill a"), spyIds = ["top", "about", "work", "contact"];
  function spy() {
    var y = window.scrollY + window.innerHeight * .35, cur = "top";
    spyIds.forEach(function (id) { var el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) cur = "contact";
    links.forEach(function (a) { a.classList.toggle("active", a.dataset.s === cur); });
  }
  addEventListener("scroll", spy, { passive: true }); spy();

  /* ── project dialog ── */
  var dlg = $("#proj"), cur = null;
  function openProject(slug, pushHash) {
    var p = bySlug[slug]; if (!p) return;
    cur = p;
    $("#projTags").textContent = p.tags.join(" · ");
    $("#projTitle").textContent = p.title;
    $("#projBlurb").textContent = p.blurb;
    $("#gal").innerHTML = p.images.map(function (im, i) {
      return '<button class="g-item" data-i="' + i + '" aria-label="View image ' + (i + 1) + '"><img src="' + im.t + '" width="' + im.w + '" height="' + im.h + '" alt="' + esc(p.title) + " — image " + (i + 1) + '" loading="lazy"></button>';
    }).join("");
    var idx = P.indexOf(p), prev = P[(idx - 1 + P.length) % P.length], next = P[(idx + 1) % P.length];
    $("#projNav").innerHTML = '<button data-open="' + prev.slug + '"><small>← Previous</small><b>' + esc(prev.title) + '</b></button><button data-open="' + next.slug + '"><small>Next →</small><b>' + esc(next.title) + "</b></button>";
    if (!dlg.open) { dlg.showModal(); document.documentElement.style.overflow = "hidden"; }
    dlg.scrollTop = 0;
    if (pushHash !== false) history.replaceState(null, "", "#project/" + slug);
  }
  dlg.addEventListener("close", function () {
    document.documentElement.style.overflow = "";
    cur = null;
    if (location.hash.indexOf("#project/") === 0) history.replaceState(null, "", location.pathname + location.search + "#work");
  });
  $("#projClose").addEventListener("click", function () { if (dlg.open) dlg.close(); });
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-open]");
    if (o) { e.preventDefault(); openProject(o.dataset.open); }
  });
  $("#gal").addEventListener("click", function (e) {
    var b = e.target.closest(".g-item"); if (b) openViewer(+b.dataset.i);
  });

  /* ── image viewer ── */
  var vw = $("#viewer"), vi = 0;
  function showV() {
    var im = cur.images[vi];
    $("#vImg").src = im.f; $("#vImg").alt = cur.title + " — image " + (vi + 1);
    $("#vCount").textContent = (vi + 1) + " / " + cur.images.length;
    [1, -1].forEach(function (d) { (new Image()).src = cur.images[(vi + d + cur.images.length) % cur.images.length].f; });
  }
  function openViewer(i) { vi = i; showV(); if (!vw.open) vw.showModal(); }
  function step(d) { vi = (vi + d + cur.images.length) % cur.images.length; showV(); }
  $("#vClose").addEventListener("click", function () { vw.close(); });
  $("#vPrev").addEventListener("click", function () { step(-1); });
  $("#vNext").addEventListener("click", function () { step(1); });
  vw.addEventListener("click", function (e) { if (e.target === vw) vw.close(); });
  vw.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
  var tx = 0;
  vw.addEventListener("touchstart", function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
  vw.addEventListener("touchend", function (e) { var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });

  /* ── deep link ── */
  function fromHash() {
    var m = location.hash.match(/^#project\/([\w-]+)/);
    if (m && bySlug[m[1]]) openProject(m[1], false);
  }
  addEventListener("hashchange", function () { if (location.hash.indexOf("#project/") === 0) fromHash(); });

  renderGrid(); observe(); fromHash();
})();
