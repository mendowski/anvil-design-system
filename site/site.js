// Theme switcher: sets data-theme on <html> and on every example frame.
// PLI themes also get a Hex field. Its color replaces brand-interactive-primary-base in PLI Light and PLI Dark,
// and subdued (hover) and shade (pressed) are derived from it in each mode. Secondary matches primary. A color under WCAG AA shows an error.
(function () {
  var sel = document.getElementById("site-theme");
  var root = document.documentElement;
  var BRAND_KEY = "anvil-site-pli-brand";
  var VARS = { base: "--brand-interactive-primary-base", subdued: "--brand-interactive-primary-subdued", shade: "--brand-interactive-primary-shade" };
  // brand-interactive-secondary takes the same values as primary while a custom color is on.
  var SECONDARY = { base: "--brand-interactive-secondary-base", subdued: "--brand-interactive-secondary-subdued", shade: "--brand-interactive-secondary-shade" };
  var AA = 4.5;

  // Color math: hex <-> OKLCH, and WCAG contrast.
  function normHex(v) {
    v = (v || "").trim().replace(/^#/, "");
    if (/^[0-9a-f]{3}$/i.test(v)) v = v.replace(/./g, "$&$&");
    return /^[0-9a-f]{6}$/i.test(v) ? "#" + v.toLowerCase() : null;
  }
  function hexToRgb(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16) / 255; }); }
  function lin(v) { return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function delin(v) { return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; }
  function rgbToHex(c) {
    return "#" + c.map(function (v) { v = Math.round(Math.min(1, Math.max(0, v)) * 255); return (v < 16 ? "0" : "") + v.toString(16); }).join("");
  }
  function toOklch(hex) {
    var c = hexToRgb(hex).map(lin);
    var l = Math.cbrt(0.4122214708 * c[0] + 0.5363325363 * c[1] + 0.0514459929 * c[2]);
    var m = Math.cbrt(0.2119034982 * c[0] + 0.6806995451 * c[1] + 0.1073969566 * c[2]);
    var s = Math.cbrt(0.0883024619 * c[0] + 0.2817188376 * c[1] + 0.6299787005 * c[2]);
    var a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    var b = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    return { L: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, C: Math.sqrt(a * a + b * b), h: Math.atan2(b, a) };
  }
  function oklchToLinear(L, C, h) {
    var a = C * Math.cos(h), b = C * Math.sin(h);
    var l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    var m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    var s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
  }
  // Lowers chroma until the color fits in sRGB, so the hue stays true.
  function fromOklch(L, C, h) {
    L = Math.min(1, Math.max(0, L));
    for (var i = 0; i < 60; i++) {
      var r = oklchToLinear(L, C, h);
      if (r.every(function (v) { return v >= -0.0001 && v <= 1.0001; })) return rgbToHex(r.map(function (v) { return delin(Math.max(0, v)); }));
      C *= 0.92;
    }
    return rgbToHex(oklchToLinear(L, 0, h).map(function (v) { return delin(Math.max(0, v)); }));
  }
  function lum(hex) { var c = hexToRgb(hex).map(lin); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

  // Subdued and shade keep the lightness of the theme's own subdued and shade (lighter and darker in PLI Light;
  // in PLI Dark, Figma flips them: subdued is darker and shade lighter), with the entered color's hue.
  // Shade then moves further from subdued until hover and pressed text both pass AA.
  function derive(hex, d) {
    var b = toOklch(hex), db = toOklch(d.base), ds = toOklch(d.subdued), dh = toOklch(d.shade);
    function chroma(t) { return db.C > 0.001 ? b.C * t.C / db.C : t.C; }
    var subdued = fromOklch(ds.L, chroma(ds), b.h);
    var dir = dh.L > ds.L ? 1 : -1, L = dh.L, shade = fromOklch(L, chroma(dh), b.h);
    for (var i = 0; i < 40 && (contrast(shade, subdued) < AA || contrast(d.pressedText, shade) < AA); i++) {
      L += dir * 0.02;
      shade = fromOklch(L, chroma(dh), b.h);
    }
    return { base: hex, subdued: subdued, shade: shade };
  }

  var brand = null, tones = null, check = null;
  try { brand = normHex(localStorage.getItem(BRAND_KEY)); } catch (e) {}
  function isPli() { return /^pli-/.test(root.getAttribute("data-theme") || ""); }
  function setVars(de) {
    Object.keys(VARS).forEach(function (k) {
      [VARS[k], SECONDARY[k]].forEach(function (n) {
        if (tones) de.style.setProperty(n, tones[k]); else de.style.removeProperty(n);
      });
    });
  }
  // The theme's own values, read with the overrides off.
  function themeDefaults() {
    tones = null; setVars(root);
    var cs = getComputedStyle(root);
    function v(n) { return normHex(cs.getPropertyValue(n)) || "#000000"; }
    return { base: v(VARS.base), subdued: v(VARS.subdued), shade: v(VARS.shade),
      text: v("--button-primary-text-default"), pressedText: v("--button-primary-text-pressed") };
  }
  function paintAll() {
    var d = themeDefaults();
    check = null;
    if (isPli() && brand) {
      tones = derive(brand, d);
      check = { ratio: contrast(brand, d.text), text: d.text };
    }
    setVars(root);
    document.querySelectorAll("iframe[data-example]").forEach(function (f) {
      try { setVars(f.contentDocument.documentElement); } catch (e) {}
    });
    syncHex(d);
  }

  var hexWrap = null, hexInput = null, hexMsg = null, formatError = false;
  function syncHex(d) {
    if (!hexWrap) return;
    hexWrap.hidden = !isPli();
    if (!isPli()) return;
    hexInput.placeholder = d.base;
    var msg = "";
    if (formatError) msg = "Enter a hex color, like " + d.base + ".";
    else if (check && check.ratio < AA) {
      var mode = root.getAttribute("data-theme") === "pli-dark" ? "PLI Dark" : "PLI Light";
      var on = check.text === "#ffffff" ? "white" : check.text === "#000000" ? "black" : check.text;
      msg = "Not AA accessible: " + (Math.floor(check.ratio * 100) / 100).toFixed(2) + ":1 with " + on +
        " button text in " + mode + ". It needs 4.5:1.";
    }
    hexMsg.textContent = msg;
    hexMsg.hidden = !msg;
    if (msg) hexInput.setAttribute("aria-invalid", "true"); else hexInput.removeAttribute("aria-invalid");
  }

  function apply(t) {
    root.setAttribute("data-theme", t);
    document.querySelectorAll("iframe[data-example]").forEach(function (f) {
      try { f.contentDocument.documentElement.setAttribute("data-theme", t); } catch (e) {}
    });
    paintAll();
  }
  if (sel) {
    sel.value = root.getAttribute("data-theme") || "core-light";
    sel.addEventListener("change", function () {
      apply(sel.value);
      try { localStorage.setItem("anvil-site-theme", sel.value); } catch (e) {}
    });
    hexWrap = document.createElement("div");
    hexWrap.className = "site-theme site-hex";
    hexWrap.innerHTML = '<label for="site-hex">Hex</label>' +
      '<input id="site-hex" type="text" autocomplete="off" spellcheck="false" maxlength="7" aria-label="Hex color for the PLI primary brand color" aria-describedby="site-hex-msg">' +
      '<p class="site-hex__msg" id="site-hex-msg" role="status" hidden></p>';
    hexInput = hexWrap.querySelector("input");
    hexMsg = hexWrap.querySelector(".site-hex__msg");
    hexInput.value = brand || "";
    hexInput.addEventListener("input", function () {
      var raw = hexInput.value.trim(), v = normHex(raw);
      formatError = false;
      if (!raw) {
        brand = null;
        try { localStorage.removeItem(BRAND_KEY); } catch (e) {}
      } else if (v) {
        brand = v;
        try { localStorage.setItem(BRAND_KEY, v); } catch (e) {}
      } else {
        // Still typing: keep the last good color. The format error shows on blur.
        return;
      }
      paintAll();
    });
    hexInput.addEventListener("blur", function () {
      var raw = hexInput.value.trim(), v = normHex(raw);
      if (v) hexInput.value = v;
      formatError = !!raw && !v;
      syncHex(themeDefaultsKeep());
    });
    sel.closest("label").insertAdjacentElement("afterend", hexWrap);
    paintAll();
  }
  // syncHex needs the theme's defaults; read them without dropping the current overrides.
  function themeDefaultsKeep() { var t = tones, d = themeDefaults(); tones = t; setVars(root); return d; }

  // size example frames to their content
  document.querySelectorAll("iframe[data-example]").forEach(function (f) {
    var fixed = !!f.style.minWidth;
    function fit() {
      try {
        var d = f.contentDocument, de = d.documentElement;
        de.setAttribute("data-theme", root.getAttribute("data-theme"));
        setVars(de);
        // The frame never scrolls itself: it grows to fit its content, and only the
        // wrapper around it scrolls sideways, so there's one thin scrollbar at most.
        if (!d.getElementById("no-frame-scroll")) {
          var st = d.createElement("style"); st.id = "no-frame-scroll";
          st.textContent = "html, body { overflow: hidden !important; }";
          d.head.appendChild(st);
        }
        // Only fixed-width examples (the ones with a min-width) grow; responsive charts keep the column width.
        var w = 0, els = fixed ? d.body.querySelectorAll("*") : [];
        if (fixed && els.length < 4000) {
          var pad = parseFloat(d.defaultView.getComputedStyle(d.body).paddingRight) || 0;
          for (var i = 0; i < els.length; i++) { var r = els[i].getBoundingClientRect().right; if (r + pad > w) w = Math.ceil(r + pad); }
        }
        if (w > f.clientWidth) f.style.minWidth = (w + 2) + "px";
        var h = de.scrollHeight;
        if (h) f.style.height = (h + 2) + "px";
      } catch (e) {}
    }
    f.addEventListener("load", function () { fit(); setTimeout(fit, 300); setTimeout(fit, 1200); });
  });
})();

// Side menus: show the thin scrollbar only while scrolling.
(function () {
  document.addEventListener("scroll", function (e) {
    var el = e.target;
    if (!el.classList || !el.matches(".cp-side, .pg-list, .pg-controls, .frame-scroll")) return;
    el.classList.add("is-scrolling");
    clearTimeout(el._sbt);
    el._sbt = setTimeout(function () { el.classList.remove("is-scrolling"); }, 800);
  }, true);
})();
