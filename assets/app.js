(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var S = window.SITE, P = window.PROJECTS, C = window.CATEGORIES;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var bySlug = {}; P.forEach(function (p) { bySlug[p.slug] = p; });
  var cover = function (p) { return p.images[p.cover]; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var INITIAL = 9;

  /* ── personal details from config ── */
  document.title = S.name + " — " + S.roles[0] + " & " + S.roles[1];
  $("#logo").textContent = S.name;
  $("#footName").textContent = S.name;
  $("#firstName").textContent = S.firstName;
  $("#year").textContent = new Date().getFullYear();
  $("#avail").hidden = !S.available;
  var mail = $("#mailBtn");
  if (!S.email || /example\.com$/.test(S.email)) { mail.hidden = true; }   // hide until a real email is set in config.js
  else { mail.href = "mailto:" + S.email; mail.textContent = S.email; }
  var soc = [];
  if (S.instagram) soc.push(["Instagram", S.instagram]);
  if (S.behance) soc.push(["Behance", S.behance]);
  if (S.phone) soc.push([S.phone, "tel:" + S.phone.replace(/\s/g, "")]);
  $("#socials").innerHTML = soc.map(function (s) { return '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + "</a></li>"; }).join("");

  /* ── hero ── */
  var hp = bySlug[S.heroSlug] || P[0];
  $("#heroPhoto").innerHTML = '<img src="' + cover(hp).t + '" width="' + cover(hp).w + '" height="' + cover(hp).h + '" alt="' + esc(hp.title) + ' — featured image" fetchpriority="high">';
  $("#avatars").innerHTML = S.avatarSlugs.map(function (s) { return bySlug[s] ? '<img src="' + cover(bySlug[s]).t + '" alt="" width="42" height="42">' : ""; }).join("");

  // rotating role word
  var roleEl = $("#role"), ri = 0;
  roleEl.textContent = S.roles[0];
  if (S.roles.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(function () {
      roleEl.classList.add("out");
      setTimeout(function () { ri = (ri + 1) % S.roles.length; roleEl.textContent = S.roles[ri]; roleEl.classList.remove("out"); }, 450);
    }, 2600);
  }

  /* ── brand marquee ── */
  var brandHTML = S.brands.map(function (b) { return '<span class="brand ' + b[1] + '">' + esc(b[0]) + "</span>"; }).join("");
  $("#brandTrack").innerHTML = brandHTML + brandHTML;

  /* ── recent works wall ── */
  $("#wallCols").innerHTML = S.wallSlugs.filter(function (s) { return bySlug[s]; }).map(function (s) {
    var p = bySlug[s], c = cover(p);
    return '<a href="#project/' + p.slug + '" data-open="' + p.slug + '" aria-label="' + esc(p.title) + '"><img src="' + c.t + '" width="' + c.w + '" height="' + c.h + '" alt="' + esc(p.title) + '" loading="lazy"></a>';
  }).join("");

  /* ── work grid ── */
  var filter = "all", expanded = false;
  var fEl = $("#filters"), gEl = $("#grid"), moreBtn = $("#moreBtn");
  fEl.innerHTML = C.map(function (c) { return '<button role="tab" data-f="' + c[0] + '" aria-selected="' + (c[0] === "all") + '">' + esc(c[1]) + "</button>"; }).join("");

  function renderGrid() {
    var list = P.filter(function (p) { return filter === "all" || p.cats.indexOf(filter) > -1; });
    var shown = expanded ? list : list.slice(0, INITIAL);
    gEl.innerHTML = shown.map(function (p) {
      var c = cover(p);
      return '<article class="card reveal"><a class="card-btn" href="#project/' + p.slug + '" data-open="' + p.slug + '">' +
        '<div class="card-media"><img src="' + c.t + '" width="' + c.w + '" height="' + c.h + '" alt="' + esc(p.title) + '" loading="lazy"><span class="count">' + p.images.length + ' images</span></div>' +
        '<div class="card-meta"><h3>' + esc(p.title) + '</h3><div class="pills">' + p.tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div></div></a></article>";
    }).join("");
    moreBtn.hidden = expanded || list.length <= INITIAL;
    moreBtn.textContent = "Show all " + list.length + " projects";
    observe();
  }
  fEl.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    filter = b.dataset.f; expanded = false;
    fEl.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-selected", x === b); });
    renderGrid();
  });
  moreBtn.addEventListener("click", function () { expanded = true; renderGrid(); });

  /* ── scroll reveal + nav state ── */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .08 }) : null;
  function observe() {
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });
  }
  var nav = $("#nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 40); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ── menu ── */
  var menu = $("#menu"), mbtn = $("#menuBtn");
  function setMenu(open) {
    menu.hidden = !open; mbtn.setAttribute("aria-expanded", open); mbtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  mbtn.addEventListener("click", function () { setMenu(menu.hidden); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) setMenu(false); });

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
  function closeProject() {
    if (dlg.open) dlg.close();
  }
  dlg.addEventListener("close", function () {
    document.documentElement.style.overflow = "";
    cur = null;
    if (location.hash.indexOf("#project/") === 0) history.replaceState(null, "", location.pathname + location.search + "#work");
  });
  $("#projClose").addEventListener("click", closeProject);

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
    // preload neighbours
    [1, -1].forEach(function (d) { var n = cur.images[(vi + d + cur.images.length) % cur.images.length]; (new Image()).src = n.f; });
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
