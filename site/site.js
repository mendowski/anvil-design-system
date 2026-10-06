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
    function fit() {
      try {
        f.contentDocument.documentElement.setAttribute("data-theme", root.getAttribute("data-theme"));
        var h = f.contentDocument.documentElement.scrollHeight;
        if (h) f.style.height = h + "px";
      } catch (e) {}
    }
    f.addEventListener("load", function () { fit(); setTimeout(fit, 300); setTimeout(fit, 1200); });
  });
})();
