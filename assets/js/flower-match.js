/* Flower Match: a calm, Mahjong-inspired tile matching game.
   Every board has exactly one matching pair. No timer, free hints.
   All flower artwork is drawn here in SVG, so there are no image files to manage.
   To add a flower: add a line to DESIGNS using the same format. */
(function () {
  "use strict";

  var board = document.getElementById("fm-board");
  if (!board) return;

  // ---------------------------------------------------------------- Palette
  var C = {
    green: "#1E8A2E", pink: "#F7A8C4", orange: "#F05A28", brown: "#7A3B12", ochre: "#D98011",
    navy: "#1F2A6B", blue: "#3E63B8", cream: "#F6E7CC", coral: "#E8505B", white: "#FFFDF8"
  };

  // ---------------------------------------------------------------- Drawing helpers
  // All shapes are drawn in a 100 x 100 box centered on (0,0).
  function petal(shape, len, w, d) {
    switch (shape) {
      case "round": return '<circle cx="0" cy="' + (-d) + '" r="' + w + '"/>';
      case "oval": return '<ellipse cx="0" cy="' + (-len / 2) + '" rx="' + w + '" ry="' + (len / 2) + '"/>';
      case "point":
        return '<path d="M0 0 C' + w + ' ' + (-len * 0.35) + ' ' + (w * 0.6) + ' ' + (-len * 0.85) + ' 0 ' + (-len) +
          ' C' + (-w * 0.6) + ' ' + (-len * 0.85) + ' ' + (-w) + ' ' + (-len * 0.35) + ' 0 0Z"/>';
      case "ray": return '<path d="M' + (-w) + ' 0 L0 ' + (-len) + ' L' + w + ' 0Z"/>';
      case "tear":
        return '<path d="M0 0 C' + w + ' ' + (-len * 0.2) + ' ' + w + ' ' + (-len) + ' 0 ' + (-len) +
          ' C' + (-w) + ' ' + (-len) + ' ' + (-w) + ' ' + (-len * 0.2) + ' 0 0Z"/>';
    }
    return "";
  }

  function petals(o) {
    var out = "", n = o.n, rot = o.rot || 0;
    for (var i = 0; i < n; i++) {
      out += '<g transform="rotate(' + (rot + i * 360 / n) + ')">' + petal(o.shape, o.len || 44, o.w || 10, o.d || 22) + "</g>";
    }
    var stroke = o.stroke ? ' stroke="' + o.stroke + '" stroke-width="' + (o.sw || 2.5) + '" stroke-linejoin="round"' : "";
    return '<g fill="' + o.fill + '"' + stroke + ">" + out + "</g>";
  }

  function circle(r, fill, stroke, sw) {
    return '<circle r="' + r + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (sw || 3) + '"' : "") + "/>";
  }

  function lines(n, r1, r2, color, sw) {
    var out = "";
    for (var i = 0; i < n; i++) {
      var a = (i * 2 * Math.PI) / n;
      out += '<line x1="' + (Math.cos(a) * r1).toFixed(2) + '" y1="' + (Math.sin(a) * r1).toFixed(2) +
        '" x2="' + (Math.cos(a) * r2).toFixed(2) + '" y2="' + (Math.sin(a) * r2).toFixed(2) + '"/>';
    }
    return '<g stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round">' + out + "</g>";
  }

  var STEM = '<g><path d="M0 -4 V40" stroke="' + C.pink + '" stroke-width="4" stroke-linecap="round"/>' +
    '<ellipse cx="-9" cy="22" rx="9" ry="4" fill="' + C.pink + '" transform="rotate(-25 -9 22)"/>' +
    '<ellipse cx="9" cy="30" rx="9" ry="4" fill="' + C.pink + '" transform="rotate(25 9 30)"/>' +
    '<path d="M-26 -12 A26 26 0 0 1 26 -12 Z" fill="' + C.ochre + '"/>' +
    (function () {
      var out = "";
      for (var k = 1; k < 8; k++) {
        var a = Math.PI + (k * Math.PI) / 8;
        out += '<line x1="' + (Math.cos(a) * 7).toFixed(2) + '" y1="' + (-12 + Math.sin(a) * 7).toFixed(2) + '" x2="' + (Math.cos(a) * 22).toFixed(2) + '" y2="' + (-12 + Math.sin(a) * 22).toFixed(2) + '"/>';
      }
      return '<g stroke="' + C.cream + '" stroke-width="2.4" stroke-linecap="round">' + out + "</g>";
    })() +
    '<path d="M-26 -12 Q0 6 26 -12" fill="' + C.pink + '"/><circle cx="0" cy="-12" r="5" fill="' + C.orange + '"/></g>';

  // ---------------------------------------------------------------- Flower designs
  // [accessible name, svg layers]
  var DESIGNS = [
    ["green starburst with pink center", petals({ n: 16, shape: "ray", len: 44, w: 5, fill: C.green }) + circle(6, C.pink)],
    ["pink five-petal flower with orange center", petals({ n: 5, shape: "round", d: 21, w: 16, fill: C.pink }) + circle(13, C.orange)],
    ["brown six-petal flower", petals({ n: 6, shape: "oval", len: 44, w: 13, fill: C.brown }) + circle(6, C.pink)],
    ["green scalloped flower with pink dot", petals({ n: 8, shape: "round", d: 25, w: 15, fill: C.green }) + circle(8, C.pink)],
    ["navy flower with large blue center", petals({ n: 6, shape: "round", d: 25, w: 13, fill: C.navy }) + circle(22, C.blue)],
    ["ochre four-petal flower with cream center", petals({ n: 4, shape: "round", d: 21, w: 20, fill: C.ochre }) + circle(12, C.cream)],
    ["pink flower with large green center", petals({ n: 8, shape: "round", d: 25, w: 13, fill: C.pink }) + circle(20, C.green)],
    ["orange daisy", petals({ n: 12, shape: "point", len: 44, w: 8, fill: C.orange }) + circle(7, C.pink)],
    ["pink daisy outlined in brown", petals({ n: 16, shape: "point", len: 44, w: 6, fill: C.pink, stroke: C.brown, sw: 1.8 }) + circle(6, C.orange)],
    ["brown sunburst disc", circle(44, C.brown) + lines(24, 11, 39, C.cream, 3) + circle(7, C.pink)],
    ["coral scalloped flower with cream center", petals({ n: 8, shape: "round", d: 25, w: 15, fill: C.coral }) + petals({ n: 8, shape: "round", d: 20, w: 12, fill: C.pink, rot: 22.5 }) + circle(16, C.cream)],
    ["ochre scalloped flower with white dot", petals({ n: 8, shape: "round", d: 25, w: 14, fill: C.ochre }) + circle(7, C.white)],
    ["orange six-point asterisk", petals({ n: 6, shape: "oval", len: 44, w: 9, fill: C.orange }) + circle(5, C.pink)],
    ["green flower with large pink center", petals({ n: 6, shape: "round", d: 26, w: 14, fill: C.green }) + circle(24, C.pink)],
    ["pink, cream and brown bullseye", circle(42, C.pink) + circle(32, C.cream) + circle(22, C.brown) + circle(12, C.pink)],
    ["pink stemmed fan flower", STEM],
    ["brown scalloped flower with pink rings", petals({ n: 8, shape: "round", d: 27, w: 14, fill: C.brown }) + circle(27, C.pink) + circle(18, C.cream) + circle(8, C.orange)],
    ["blue eight-petal daisy", petals({ n: 8, shape: "point", len: 43, w: 13, fill: C.blue }) + circle(9, C.ochre)],
    ["navy starburst with ochre center", petals({ n: 12, shape: "ray", len: 44, w: 6, fill: C.navy }) + circle(8, C.ochre)],
    ["pink star outlined in brown", petals({ n: 12, shape: "point", len: 44, w: 7, fill: C.pink, stroke: C.brown, sw: 2 }) + circle(5, C.cream)],
    ["green and pink layered flower", petals({ n: 4, shape: "oval", len: 44, w: 13, fill: C.green, rot: 45 }) + petals({ n: 4, shape: "oval", len: 30, w: 9, fill: C.pink }) + circle(6, C.orange)],
    ["ochre sun with orange center", petals({ n: 12, shape: "ray", len: 44, w: 8, fill: C.ochre }) + circle(22, C.orange)],
    ["coral five-petal flower with pink inner petals", petals({ n: 5, shape: "round", d: 23, w: 15, fill: C.coral }) + petals({ n: 5, shape: "round", d: 12, w: 8, fill: C.pink, rot: 36 }) + circle(5, C.ochre)],
    ["cream flower outlined in brown", petals({ n: 6, shape: "round", d: 24, w: 14, fill: C.cream, stroke: C.brown, sw: 3 }) + circle(10, C.brown)],
    ["white eight-petal flower outlined in blue", petals({ n: 8, shape: "oval", len: 42, w: 9, fill: C.white, stroke: C.blue, sw: 3 }) + circle(8, C.blue)],
    ["green six-petal spoon flower", petals({ n: 6, shape: "tear", len: 44, w: 14, fill: C.green, stroke: C.white, sw: 2 }) + circle(7, C.ochre)],
    ["orange ten-petal ring flower", petals({ n: 10, shape: "round", d: 28, w: 9, fill: C.orange }) + circle(17, C.cream) + circle(6, C.orange)],
    ["pink and coral double daisy", petals({ n: 8, shape: "point", len: 44, w: 12, fill: C.pink }) + petals({ n: 8, shape: "point", len: 30, w: 9, fill: C.coral, rot: 22.5 }) + circle(6, C.ochre)],
    ["navy disc with white dots", circle(42, C.navy) + petals({ n: 8, shape: "round", d: 30, w: 7, fill: C.white }) + circle(14, C.pink)],
    ["green five-point star", petals({ n: 5, shape: "ray", len: 44, w: 17, fill: C.green }) + circle(10, C.pink)],
    ["brown four-petal flower with orange center", petals({ n: 4, shape: "oval", len: 44, w: 16, fill: C.brown }) + circle(12, C.orange)],
    ["coral seven-petal flower", petals({ n: 7, shape: "round", d: 24, w: 13, fill: C.coral }) + circle(11, C.white) + circle(5, C.coral)],
    ["ochre twelve-petal flower with pink center", petals({ n: 12, shape: "oval", len: 44, w: 6, fill: C.ochre }) + circle(12, C.pink)],
    ["blue scalloped flower with navy center", petals({ n: 10, shape: "round", d: 27, w: 11, fill: C.blue }) + circle(18, C.navy) + circle(6, C.cream)],
    ["orange and pink layered flower", petals({ n: 6, shape: "round", d: 24, w: 15, fill: C.orange }) + petals({ n: 6, shape: "round", d: 15, w: 10, fill: C.pink, rot: 30 }) + circle(6, C.orange)],
    ["green fine-petal daisy", petals({ n: 20, shape: "point", len: 44, w: 4.5, fill: C.green }) + circle(10, C.ochre)],
    ["cream disc with brown spokes", circle(42, C.cream, C.brown, 3) + lines(12, 15, 38, C.brown, 3) + circle(10, C.coral)],
    ["pink four-leaf clover flower", petals({ n: 4, shape: "round", d: 18, w: 17, fill: C.pink }) + circle(8, C.green)],
    ["blue six-petal flower with orange center", petals({ n: 6, shape: "round", d: 23, w: 14, fill: C.blue }) + circle(12, C.orange)],
    ["navy star with pink inner star", petals({ n: 6, shape: "point", len: 44, w: 16, fill: C.navy }) + petals({ n: 6, shape: "point", len: 28, w: 10, fill: C.pink, rot: 30 }) + circle(5, C.white)],
    ["cream daisy outlined in ochre", petals({ n: 10, shape: "point", len: 44, w: 10, fill: C.cream, stroke: C.ochre, sw: 2.5 }) + circle(9, C.ochre)],
    ["green five-petal flower with blue center", petals({ n: 5, shape: "round", d: 22, w: 15, fill: C.green }) + circle(11, C.blue)]
  ];

  function svgFor(i) {
    return '<svg viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">' + DESIGNS[i][1] + "</svg>";
  }

  // ---------------------------------------------------------------- Rules to show at the end
  var RULES = [
    ["A Joker can never be used in a pair or as a single tile. Only in groups of three or more.", "/rules/joker-rules/"],
    ["You can never pass a Joker during the Charleston.", "/strategy/charleston/"],
    ["The dealer, called East, starts with 14 tiles. Everyone else starts with 13.", "/rules/table-setup/"],
    ["Colors on the NMJL card show how many suits a hand uses, not which suits.", "/rules/how-to-read-nmjl-card/"],
    ["\u201cSoap\u201d is the White Dragon. It also counts as zero in year hands.", "/rules/glossary/"],
    ["Any single player can stop the second Charleston before it starts.", "/strategy/charleston/"],
    ["A hand marked C on the card is concealed: you can\u2019t call discards for it, except the winning tile.", "/rules/how-to-read-nmjl-card/"],
    ["Holding the wrong number of tiles can make your hand dead. Count every few turns.", "/rules/dead-hand/"],
    ["Green Dragons go with Bams, Red with Craks, and White with Dots.", "/rules/how-to-read-nmjl-card/"]
  ];

  // ---------------------------------------------------------------- State
  var SIZES = [16, 25, 36];
  var size = 25, pairs = 0, tiles = [], selected = -1, hintLevel = 0, locked = false;

  var elPairs = document.getElementById("fm-pairs");
  var elPairsLabel = document.getElementById("fm-pairs-label");
  var elStatus = document.getElementById("fm-status");
  var elSizeText = document.getElementById("fm-size-text");
  var summary = document.getElementById("fm-summary");

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // While the end screen is open, keep keyboard focus out of the board behind it.
  var behind = [board, document.querySelector(".fm-actions"), document.querySelector(".fm-bar"), document.querySelector(".fm-prompt")];
  function setInert(on) {
    behind.forEach(function (el) { if (el) { if (on) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
  }

  function setStatus(msg) { elStatus.textContent = msg; }

  function updateCount() {
    elPairs.textContent = pairs;
    elPairsLabel.textContent = pairs === 1 ? "pair found" : "pairs found";
  }

  function newBoard() {
    var pool = shuffle(DESIGNS.map(function (_, i) { return i; })).slice(0, size - 1);
    var twin = pool[Math.floor(Math.random() * pool.length)];
    tiles = shuffle(pool.concat([twin]));
    selected = -1; hintLevel = 0; locked = false;
    board.setAttribute("data-size", String(size));
    elSizeText.textContent = size + " tiles";
    board.innerHTML = "";
    tiles.forEach(function (d, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "fm-tile";
      b.setAttribute("aria-pressed", "false");
      b.setAttribute("aria-label", DESIGNS[d][0]);
      b.dataset.index = i;
      b.innerHTML = svgFor(d);
      board.appendChild(b);
    });
    setStatus("Tap one flower. Then its perfect match.");
  }

  function btn(i) { return board.children[i]; }

  function pairIndexes() {
    var seen = {};
    for (var i = 0; i < tiles.length; i++) {
      if (seen[tiles[i]] !== undefined) return [seen[tiles[i]], i];
      seen[tiles[i]] = i;
    }
    return [0, 0];
  }

  function clearSelection() {
    if (selected > -1) btn(selected).setAttribute("aria-pressed", "false");
    selected = -1;
  }

  function onTile(i) {
    if (locked) return;
    if (selected === -1) {
      selected = i;
      btn(i).setAttribute("aria-pressed", "true");
      setStatus("Now tap its perfect match.");
      return;
    }
    if (selected === i) { clearSelection(); setStatus("Tap one flower. Then its perfect match."); return; }

    if (tiles[i] === tiles[selected]) {
      locked = true;
      btn(i).setAttribute("aria-pressed", "true");
      btn(i).classList.add("is-match");
      btn(selected).classList.add("is-match");
      pairs += 1;
      updateCount();
      setStatus("That\u2019s the pair. Here\u2019s a fresh board.");
      setTimeout(newBoard, 800);
    } else {
      var a = btn(selected), b = btn(i);
      b.classList.remove("is-miss"); void b.offsetWidth; b.classList.add("is-miss");
      clearSelection();
      setStatus("Not quite. Take another look.");
      setTimeout(function () { a.classList.remove("is-miss"); b.classList.remove("is-miss"); }, 400);
    }
  }

  board.addEventListener("click", function (e) {
    var t = e.target.closest(".fm-tile");
    if (t) onTile(Number(t.dataset.index));
  });

  document.getElementById("fm-hint").addEventListener("click", function () {
    if (locked) return;
    var p = pairIndexes();
    hintLevel = Math.min(hintLevel + 1, 2);
    btn(p[0]).classList.add("is-hint");
    if (hintLevel === 2) {
      btn(p[1]).classList.add("is-hint");
      setStatus("Both tiles of the pair are glowing.");
    } else {
      setStatus("One tile of the pair is glowing. Can you find its twin?");
    }
  });

  document.getElementById("fm-size").addEventListener("click", function () {
    size = SIZES[(SIZES.indexOf(size) + 1) % SIZES.length];
    newBoard();
    setStatus("Now playing with " + size + " tiles. Tap one flower, then its match.");
  });

  document.getElementById("fm-done").addEventListener("click", function () {
    var r = RULES[Math.floor(Math.random() * RULES.length)];
    document.getElementById("fm-summary-count").textContent = pairs + (pairs === 1 ? " pair found." : " pairs found.");
    document.getElementById("fm-rule-text").textContent = r[0];
    document.getElementById("fm-rule-link").setAttribute("href", r[1]);
    summary.hidden = false;
    setInert(true);
    summary.focus();
  });

  document.getElementById("fm-again").addEventListener("click", function () {
    summary.hidden = true;
    setInert(false);
    pairs = 0;
    updateCount();
    newBoard();
    board.querySelector(".fm-tile").focus();
  });

  updateCount();
  newBoard();
})();
