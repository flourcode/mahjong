/* MahjongCenter site search
   Runs entirely in the browser using SEARCH_INDEX from search-index.js.
   No searches are sent anywhere or recorded. */
(function () {
  "use strict";
  var input = document.getElementById("search-q");
  var list = document.getElementById("search-results");
  var status = document.getElementById("search-status");
  if (!input || !list || typeof SEARCH_INDEX === "undefined") return;

  function norm(s) {
    return String(s || "").toLowerCase().replace(/[\u2018\u2019']/g, "").replace(/[^a-z0-9 ]+/g, " ");
  }

  // Score each page: title matches count most, then keywords, then description.
  function score(item, terms) {
    var title = norm(item.title), desc = norm(item.description), cat = norm(item.category);
    var keys = norm((item.keywords || []).join(" | "));
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i], hit = 0;
      if (title.indexOf(t) > -1) hit += 6;
      if (keys.indexOf(t) > -1) hit += 4;
      if (desc.indexOf(t) > -1) hit += 2;
      if (cat.indexOf(t) > -1) hit += 1;
      if (!hit) return 0; // every word must match somewhere
      total += hit;
    }
    return total;
  }

  var STOP = ["a", "an", "the", "in", "to", "of", "do", "you", "can", "how", "what", "is", "i", "my", "for", "on", "does"];

  function run() {
    var q = input.value.trim();
    list.innerHTML = "";
    if (!q) { status.textContent = ""; return; }
    var terms = norm(q).split(/\s+/).filter(function (t) { return t && STOP.indexOf(t) === -1; });
    if (!terms.length) terms = norm(q).split(/\s+/).filter(Boolean);
    var results = SEARCH_INDEX
      .map(function (item) { return { item: item, s: score(item, terms) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });

    status.textContent = results.length
      ? results.length + (results.length === 1 ? " guide found" : " guides found")
      : "No guides match that yet. Try fewer or simpler words, like \u201cjoker\u201d or \u201cwall.\u201d";

    results.forEach(function (r) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = r.item.url;
      var c = document.createElement("span"); c.className = "r-cat"; c.textContent = r.item.category;
      var t = document.createElement("span"); t.className = "r-title"; t.textContent = r.item.title;
      var d = document.createElement("span"); d.className = "r-desc"; d.textContent = r.item.description;
      a.appendChild(c); a.appendChild(t); a.appendChild(d);
      li.appendChild(a); list.appendChild(li);
    });
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get("q")) input.value = params.get("q");
  input.addEventListener("input", run);
  input.form.addEventListener("submit", function (e) {
    e.preventDefault();
    var url = new URL(window.location.href);
    url.searchParams.set("q", input.value.trim());
    history.replaceState(null, "", url);
    run();
  });
  run();
  input.focus();
})();
