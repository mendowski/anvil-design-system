/* Helpers for the component documentation pages. Load after React, ReactDOM and dist/anvil.js. */
(function () {
  var h = React.createElement;
  var VERDICTS = { "do": ["Do", "check-circle"], "dont": ["Don’t", "close-circle"], "caution": ["Caution", "alert-triangle"] };

  function render(id, el) { var n = document.getElementById(id); if (n) ReactDOM.createRoot(n).render(el); return n; }
  function cap(text, el, style) { return h("div", { style: style }, h("div", { className: "doc-cap" }, text), el); }
  function list(items, ordered) { return items && h(ordered ? "ol" : "ul", null, items.map(function (s, i) { return h("li", { key: i }, s); })); }

  // A Do / Don't / Caution tile. kind: "do" | "dont" | "caution".
  function dd(kind, text, stage, opts) {
    var v = VERDICTS[kind];
    return h("figure", { className: "dd dd--" + kind + (opts && opts.wide ? " dd--wide" : ""), style: { margin: 0 } },
      h("div", { className: "dd-stage" }, stage), h("div", { className: "dd-bar" }),
      h("figcaption", null, h("span", { className: "dd-verdict" }, h(Anvil.Icon, { name: v[1], size: 16 }), v[0]), h("p", null, text)));
  }

  // Guidance rows: [{ t, p, li, ol, el, wide }] -> text on the left, examples on the right (wide: full width below).
  function rows(id, items) {
    render(id, h(React.Fragment, null, items.map(function (r, i) {
      return h("div", { className: "doc-config", key: i },
        h("div", null, h("h3", null, r.t), r.p && h("p", null, r.p), list(r.ol, true), list(r.li)),
        h("div", { className: r.stack ? "doc-stack" : "doc-row" }, r.el),
        r.wide && h("div", { className: "doc-stack full" }, r.wide));
    })));
  }

  // Number parts of a live component once it renders. parts: [[label, selector, position]].
  function tag(id, parts) {
    var host = document.getElementById(id), tries = 0;
    (function go() {
      var missing = parts.filter(function (pt) { return !host.querySelector(pt[1]); });
      if (missing.length && tries++ < 40) { setTimeout(go, 25); return; }
      parts.forEach(function (pt) {
        var el = host.querySelector(pt[1]);
        if (el) { el.setAttribute("data-m", pt[0]); el.setAttribute("data-at", pt[2] || "left"); }
      });
    })();
  }

  window.Doc = { h: h, render: render, cap: cap, list: list, dd: dd, rows: rows, tag: tag, noop: function () {} };
})();
