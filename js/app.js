/*
  StashVI — main program.
  You normally don't need to edit this file. Stashes live in stashes.js,
  words live in i18n.js.
*/
(function () {
  "use strict";

  // ---------- Settings ----------
  var MAP_IMAGE = "assets/leonida-map.webp";
  var MAP_W = 2400;  // map image width in pixels
  var MAP_H = 3041;  // map image height in pixels
  var SAVE_KEY = "stashvi.collected";
  var LANG_KEY = "stashvi.lang";

  // ---------- Saving on the phone (localStorage) ----------
  // Wrapped in try/catch because private browsing can block storage.
  function load(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }

  // ---------- Data ----------
  var stashes = (window.STASHES || []).filter(function (s) {
    var ok = s && s.id && typeof s.money === "number" && typeof s.x === "number" &&
      typeof s.y === "number" && s.name && s.place;
    if (!ok) console.warn("StashVI: skipping a stash with missing info", s);
    return ok;
  });
  var seen = {};
  stashes.forEach(function (s) {
    if (seen[s.id]) console.warn("StashVI: two stashes share the id '" + s.id + "'. Give each a unique id.");
    seen[s.id] = true;
  });

  var collected = new Set(load(SAVE_KEY, []));
  var browserLang = (navigator.language || "en").toLowerCase().indexOf("es") === 0 ? "es" : "en";
  var lang = load(LANG_KEY, browserLang);
  if (!window.TEXT[lang]) lang = "en";

  function t(key) { return window.TEXT[lang][key] || window.TEXT.en[key] || key; }
  function txt(obj) { return obj[lang] || obj.en || ""; }
  function formatMoney(n) {
    return "$" + Math.round(n).toLocaleString(lang === "es" ? "es-MX" : "en-US");
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // ---------- Map ----------
  var bounds = [[-MAP_H, 0], [0, MAP_W]];
  var map = L.map("map", {
    crs: L.CRS.Simple,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    minZoom: -5,   // allow zooming out far enough to fit a phone; tightened below
    maxZoom: 1.5,
    maxBounds: L.latLngBounds(bounds).pad(0.15),
    maxBoundsViscosity: 0.8,
    attributionControl: true
  });
  L.imageOverlay(MAP_IMAGE, bounds).addTo(map);
  map.attributionControl.setPrefix(false);
  map.fitBounds(bounds);
  map.setMinZoom(map.getZoom() - 0.5);

  function toLatLng(s) { return [-(s.y / 100) * MAP_H, (s.x / 100) * MAP_W]; }

  var markers = {};
  stashes.forEach(function (s) {
    var m = L.marker(toLatLng(s), { icon: pinIcon(s), title: txt(s.name), riseOnHover: true });
    m.bindPopup(function () { return popupContent(s); }, { maxWidth: 260, minWidth: 200 });
    m.addTo(map);
    markers[s.id] = m;
  });

  function pinIcon(s) {
    var done = collected.has(s.id);
    return L.divIcon({
      className: "",
      html: '<div class="pin' + (done ? " done" : "") + '"><span>' + (done ? "✓" : "$") + "</span></div>",
      iconSize: [34, 34],
      iconAnchor: [17, 40],
      popupAnchor: [0, -40]
    });
  }

  function popupContent(s) {
    var box = el("div", "popup");
    box.appendChild(el("h3", "", txt(s.name)));
    box.appendChild(el("p", "", txt(s.place)));
    var pay = el("p");
    pay.appendChild(document.createTextNode(t("payout") + " "));
    pay.appendChild(el("span", "money", formatMoney(s.money)));
    box.appendChild(pay);
    box.appendChild(checkButton(s));
    return box;
  }

  function checkButton(s) {
    var done = collected.has(s.id);
    var b = el("button", "check");
    b.type = "button";
    b.setAttribute("aria-pressed", done ? "true" : "false");
    var box = el("span", "box", done ? "✓" : "");
    box.setAttribute("aria-hidden", "true");
    b.appendChild(box);
    b.appendChild(el("span", "", done ? t("isCollected") : t("markCollected")));
    b.addEventListener("click", function () { toggle(s.id); });
    return b;
  }

  // ---------- Checklist ----------
  function toggle(id) {
    if (collected.has(id)) collected.delete(id); else collected.add(id);
    save(SAVE_KEY, Array.from(collected));
    renderAll();
  }

  // ---------- List ----------
  function renderList() {
    var list = document.getElementById("stash-list");
    list.textContent = "";
    stashes.slice().sort(function (a, b) { return b.money - a.money; }).forEach(function (s) {
      var li = el("li", "card" + (collected.has(s.id) ? " done" : ""));
      li.appendChild(el("h3", "", txt(s.name)));
      li.appendChild(el("span", "money", formatMoney(s.money)));
      li.appendChild(el("p", "", txt(s.place)));
      var actions = el("div", "actions");
      actions.appendChild(checkButton(s));
      var go = el("button", "ghost", t("showOnMap"));
      go.type = "button";
      go.addEventListener("click", function () { showOnMap(s); });
      actions.appendChild(go);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function showOnMap(s) {
    switchView("map");
    map.setView(toLatLng(s), 0, { animate: false });
    markers[s.id].openPopup();
  }

  // ---------- Progress ----------
  function renderProgress() {
    var total = stashes.length, got = 0, totalMoney = 0, gotMoney = 0;
    stashes.forEach(function (s) {
      totalMoney += s.money;
      if (collected.has(s.id)) { got++; gotMoney += s.money; }
    });
    var p = document.getElementById("progress-text");
    p.textContent = "";
    p.appendChild(el("strong", "", got + "/" + total));
    p.appendChild(document.createTextNode(" " + t("collected") + " · "));
    p.appendChild(el("strong", "", formatMoney(gotMoney)));
    p.appendChild(document.createTextNode(" " + t("of") + " " + formatMoney(totalMoney)));
    document.getElementById("progress-fill").style.width =
      (totalMoney ? (gotMoney / totalMoney) * 100 : 0) + "%";
  }

  // ---------- Language ----------
  function applyLanguage() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-t]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-t"));
    });
    var btn = document.getElementById("lang-btn");
    btn.textContent = t("langName");
    btn.setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    map.attributionControl.removeAttribution(map._stashCredit || "");
    map._stashCredit = '<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> ' +
      'map: <a href="https://github.com/rolux/gtadb.org" target="_blank" rel="noopener">gtadb.org</a> &amp; ' +
      '<a href="https://github.com/navanem/gta6-leonida-atlas" target="_blank" rel="noopener">Leonida Atlas</a>';
    map.attributionControl.addAttribution(map._stashCredit);
    document.getElementById("pick-hint").textContent = t("pickHint");
  }

  document.getElementById("lang-btn").addEventListener("click", function () {
    lang = lang === "en" ? "es" : "en";
    save(LANG_KEY, lang);
    renderAll();
  });

  // ---------- Tabs ----------
  function switchView(name) {
    document.querySelectorAll(".view").forEach(function (v) {
      v.classList.toggle("active", v.id === "view-" + name);
    });
    document.querySelectorAll(".tab").forEach(function (tab) {
      var on = tab.getAttribute("data-view") === name;
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (name === "map") map.invalidateSize();
  }
  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () { switchView(tab.getAttribute("data-view")); });
  });

  document.getElementById("reset-btn").addEventListener("click", function () {
    if (window.confirm(t("resetConfirm"))) {
      collected.clear();
      save(SAVE_KEY, []);
      renderAll();
    }
  });

  // ---------- Pick mode (for you, the site owner) ----------
  // Add ?pick to the address, tap the map, copy x / y into stashes.js.
  if (new URLSearchParams(location.search).has("pick")) {
    document.getElementById("pick-hint").hidden = false;
    map.on("click", function (e) {
      var x = Math.round((e.latlng.lng / MAP_W) * 1000) / 10;
      var y = Math.round((-e.latlng.lat / MAP_H) * 1000) / 10;
      L.popup().setLatLng(e.latlng).setContent("x: " + x + ",<br>y: " + y + ",").openOn(map);
    });
  }

  // ---------- Draw everything ----------
  function renderAll() {
    applyLanguage();
    renderProgress();
    renderList();
    stashes.forEach(function (s) {
      var m = markers[s.id];
      m.setIcon(pinIcon(s));
      m.options.title = txt(s.name);
      if (m.isPopupOpen()) m.setPopupContent(popupContent(s));
    });
  }

  renderAll();
  // Opening the site with #list at the end of the address starts on the list.
  if (location.hash === "#list") switchView("list");
})();
