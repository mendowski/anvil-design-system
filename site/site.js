// Theme switcher: sets data-theme on <html> and on every example frame.
(function () {
  var sel = document.getElementById("site-theme");
  var root = document.documentElement;
  function apply(t) {
    root.setAttribute("data-theme", t);
    document.querySelectorAll("iframe[data-example]").forEach(function (f) {
      try { f.contentDocument.documentElement.setAttribute("data-theme", t); } catch (e) {}
    });
  }
  if (sel) {
    sel.value = root.getAttribute("data-theme") || "core-light";
    sel.addEventListener("change", function () {
      apply(sel.value);
      try { localStorage.setItem("anvil-site-theme", sel.value); } catch (e) {}
    });
  }
  // size example frames to their content
  document.querySelectorAll("iframe[data-example]").forEach(function (f) {
    var fixed = !!f.style.minWidth;
    function fit() {
      try {
        var d = f.contentDocument, de = d.documentElement;
        de.setAttribute("data-theme", root.getAttribute("data-theme"));
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
