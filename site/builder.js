// Pulse screen builder: put real Pulse components and layout blocks together into full screens,
// link screens into a clickable flow, and copy the code.
// Component controls come from the component playground (window.ANVIL_PLAYGROUND, set by site/playground.js).
(function () {
  var h = React.createElement;
  var A = window.Anvil;
  var PG = window.ANVIL_PLAYGROUND;
  var STORIES = PG.stories;
  var LABELS = window.ANVIL_LABELS || {};
  var GROUPS = window.ANVIL_GROUPS || [];
  var STORE = "anvil-builder-v1";

  // ---------- token options
  var SPACE_PX = { "0": 0, "025": 2, "050": 4, "100": 8, "150": 12, "200": 16, "250": 20, "300": 24, "400": 32, "500": 40, "600": 48, "800": 64 };
  var SPACE = Object.keys(SPACE_PX).sort(function (a, b) { return SPACE_PX[a] - SPACE_PX[b]; })
    .map(function (k) { return ["space-" + k, "space-" + k + " · " + SPACE_PX[k] + "px"]; });
  var BG = [["", "None"]].concat(["background-base", "background-surface", "background-subdued", "background-neutral", "background-callout",
    "brand-interactive-primary-subdued", "background-status-branded-subdued", "background-status-info-subdued",
    "background-status-success-subdued", "background-status-warning-subdued", "background-status-critical-subdued"].map(function (t) { return [t, t]; }));
  var RADIUS = [["", "None"], ["radius-050", "radius-050"], ["radius-150", "radius-150"], ["radius-300", "radius-300"], ["radius-menu", "radius-menu"]];
  var BORDER = [["", "None"], ["stroke-subdued", "stroke-subdued"], ["stroke-base", "stroke-base"]];
  var WIDTH = [["", "Full width"], ["var(--layout-width-forms)", "layout-width-forms · 440px"], ["var(--layout-width-universal)", "layout-width-universal · 640px"],
    ["960px", "960px"], ["1120px", "1120px"]];
  var TEXT_STYLES = [["heading-title", "Title"], ["heading-heading-1", "Heading 1"], ["heading-heading-2", "Heading 2"], ["heading-heading-3", "Heading 3"],
    ["heading-heading-4", "Heading 4"], ["heading-eyebrow", "Eyebrow"], ["heading-sections", "Section label"], ["body-default", "Body"],
    ["body-strong", "Body strong"], ["body-italics", "Body italics"], ["body-small-default", "Body small"], ["body-small-strong", "Body small strong"],
    ["data-data-1", "Data 1"], ["data-data-2", "Data 2"], ["data-data-3", "Data 3"]];
  var TEXT_COLORS = [["", "Default for the style"]].concat(["text-body-base", "text-body-subdued", "text-header-serif", "text-header-eyebrow", "text-body-link",
    "text-status-branded", "text-status-info", "text-status-success", "text-status-warning", "text-status-critical", "text-body-inverted"].map(function (t) { return [t, t]; }));
  // Space above and below text: the named spacing tokens. The px shown is the value in the theme the page loaded with.
  var TEXT_SPACE_TOKENS = ["space-after-header", "space-after-section-heading", "space-between-article-tiles", "space-between-body", "space-between-body-small",
    "space-between-button", "space-between-cards", "space-between-carousel-items", "space-between-chips", "space-between-eyebrow-heading",
    "space-between-forms", "space-between-forms-control-input-group", "space-between-heading-1-body", "space-between-heading-2-body",
    "space-between-heading-3-body", "space-between-heading-4-body", "space-between-info-list-item", "space-between-prominent-nav-list",
    "space-between-sections", "space-between-selection-card", "space-between-subdued-nav-list", "space-between-tabs", "space-between-tags"];
  var TEXT_SPACE = [["", "None"]].concat(TEXT_SPACE_TOKENS.map(function (t) {
    var px = ""; try { px = getComputedStyle(document.documentElement).getPropertyValue("--" + t).trim(); } catch (e) {}
    return [t, px ? t + " · " + px : t];
  }));
  var TAGS = { "heading-title": "h1", "heading-heading-1": "h1", "heading-heading-2": "h2", "heading-heading-3": "h3", "heading-heading-4": "h4" };
  // Breakpoints from the Home redesign MVP file in Figma: mobile up to 767px, tablet 768 to 1024px, desktop, and XL at 1440px.
  var DEVICES = {
    xl: { w: 1440, h: 1080, label: "XL", range: "XL screen · 1440px wide" },
    desktop: { w: 1280, h: 800, label: "Desktop", range: "Desktop · 1280px wide (1025px and up)" },
    tablet: { w: 768, h: 1024, label: "Tablet", range: "Tablet · 768px to 1024px" },
    mobile: { w: 390, h: 844, label: "Mobile", range: "Mobile · up to 767px" }
  };
  function isWide(device) { return device === "xl" || device === "desktop"; }
  // Components that size to their content by default. Everything else fills the space it's given.
  var HUG = { Button: 1, Icon: 1, Logo: 1, Connector: 1, RadialChart: 1, Illustration: 1 };

  function sel(label, options, def, opts) { return Object.assign({ type: "select", label: label, options: options, def: def }, opts); }
  function text(label, def) { return { type: "text", label: label, def: def }; }
  function area(label, def) { return { type: "area", label: label, def: def }; }
  function num(label, def, min, max) { return { type: "number", label: label, def: def, min: min, max: max, step: 1 }; }
  function bool(label, def, opts) { return Object.assign({ type: "bool", label: label, def: def }, opts); }
  var isRow = function (a) { return a.direction === "row"; };

  // ---------- layout and text blocks
  var boxControls = {
    padX: sel("Padding left and right", SPACE, "space-0"),
    padY: sel("Padding top and bottom", SPACE, "space-0"),
    maxWidth: sel("Max width", WIDTH, ""),
    bg: sel("Background", BG, ""),
    border: sel("Border", BORDER, ""),
    radius: sel("Corner radius", RADIUS, "")
  };
  var BLOCKS = {
    Stack: {
      label: "Stack", container: true, blurb: "Lines things up in a column or a row, with a token gap between them.",
      controls: Object.assign({
        direction: sel("Direction", [["column", "Vertical"], ["row", "Horizontal"]], "column"),
        gap: sel("Gap", SPACE, "space-200"),
        align: sel("Align items", [["stretch", "Stretch"], ["flex-start", "Start"], ["center", "Center"], ["flex-end", "End"]], "stretch"),
        justify: sel("Justify", [["flex-start", "Start"], ["center", "Center"], ["flex-end", "End"], ["space-between", "Space between"]], "flex-start"),
        wrap: bool("Wrap to the next line", false, { when: isRow })
      }, boxControls)
    },
    Grid: {
      label: "Grid", container: true, blurb: "Equal columns. On screens under 600px wide the columns stack.",
      controls: Object.assign({
        columns: num("Columns", 2, 1, 6),
        gap: sel("Gap", SPACE, "space-250"),
        collapse: bool("Stack on mobile", true)
      }, boxControls)
    },
    Text: {
      label: "Text", blurb: "Headings and body text in Pulse type styles. Double-click it on the canvas to edit the words.",
      controls: {
        text: area("Text", "Text"),
        style: sel("Type style", TEXT_STYLES, "body-default"),
        color: sel("Color", TEXT_COLORS, ""),
        align: sel("Alignment", [["start", "Start"], ["center", "Center"], ["end", "End"]], "start"),
        spaceAbove: sel("Space above", TEXT_SPACE, ""),
        spaceBelow: sel("Space below", TEXT_SPACE, "")
      }
    },
    Divider: { label: "Divider", blurb: "A thin stroke-subdued line between sections.", controls: {} },
    Spacer: { label: "Spacer", blurb: "Extra space, in space tokens.", controls: { size: sel("Size", SPACE, "space-400") } }
  };
  var BUILDER_DEFAULTS = { GlobalHeader: { layout: "auto" } };

  function defaultsOf(type) {
    var spec = BLOCKS[type] || STORIES[type], a = {};
    Object.keys(spec.controls).forEach(function (k) { a[k] = spec.controls[k].def; });
    return Object.assign(a, BUILDER_DEFAULTS[type]);
  }
  function labelOf(type) { return BLOCKS[type] ? BLOCKS[type].label : LABELS[type] || type; }
  function nodeName(n) {
    if (n.type === "Text") {
      var s = TEXT_STYLES.filter(function (t) { return t[0] === n.args.style; })[0];
      return (s ? s[1] : "Text") + ": " + String(n.args.text || "").slice(0, 28);
    }
    if (n.type === "Button") return "Button: " + n.args.children;
    if (n.type === "Stack") return n.args.direction === "row" ? "Row" : "Stack";
    if (n.type === "Grid") return "Grid · " + n.args.columns + " columns";
    return labelOf(n.type);
  }

  // ---------- tree helpers
  var seq = 0;
  function uid() { seq += 1; return "n" + Date.now().toString(36) + seq.toString(36) + Math.floor(Math.random() * 1e4).toString(36); }
  function make(type, over, extra) {
    var n = Object.assign({ id: uid(), type: type, args: Object.assign(defaultsOf(type), over) }, extra);
    if ((BLOCKS[type] || {}).container && !n.children) n.children = [];
    return n;
  }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function reId(n) { n.id = uid(); (n.children || []).forEach(reId); return n; }
  function find(root, id, parent) {
    if (root.id === id) return { node: root, parent: parent || null, index: parent ? parent.children.indexOf(root) : -1 };
    for (var i = 0; i < (root.children || []).length; i++) { var f = find(root.children[i], id, root); if (f) return f; }
    return null;
  }
  function contains(node, id) { return node.id === id || (node.children || []).some(function (c) { return contains(c, id); }); }
  function walk(n, fn, depth, parent) { fn(n, depth || 0, parent); (n.children || []).forEach(function (c) { walk(c, fn, (depth || 0) + 1, n); }); }

  // ---------- starter screens
  function S(over, kids) { return make("Stack", over, { children: kids || [] }); }
  function G(over, kids) { return make("Grid", over, { children: kids || [] }); }
  function T(t, style, over) { return make("Text", Object.assign({ text: t, style: style }, over)); }
  function C(type, over, extra) { return make(type, over, extra); }
  function panel(kids) { return S({ bg: "background-surface", border: "stroke-subdued", radius: "radius-300", padX: "space-300", padY: "space-300" }, kids); }
  function root(kids) { return S({ gap: "space-0", bg: "background-base" }, kids); }
  var TEMPLATES = {
    home: { label: "Home dashboard", blurb: "Header, a greeting, cards and charts", make: function () {
      return root([
        C("GlobalHeader"),
        S({ maxWidth: "1120px", padX: "space-300", padY: "space-500", gap: "space-500" }, [
          S({ gap: "space-100" }, [T("Good morning, Sam", "heading-title"), T("Here's what's next for your care this week.", "body-default", { color: "text-body-subdued" })]),
          G({ columns: 3, gap: "space-250" }, [
            C("VisitCard", { prominent: true }),
            C("Card", { imageType: "spot", spotName: "celebration", secondary: "" }),
            C("NavList", { count: 3 })
          ]),
          S({ gap: "space-200" }, [
            T("Your health", "heading-heading-2"),
            G({ columns: 2, gap: "space-250" }, [panel([C("BarChart")]), panel([C("LineChart")])])
          ])
        ])
      ]);
    } },
    visit: { label: "Choose a visit", blurb: "Progress header, selection cards and a button", make: function () {
      return root([
        C("GlobalHeader", { type: "progress", steps: "Visit type, Time, Insurance, Review", currentStep: 1 }),
        S({ maxWidth: "var(--layout-width-universal)", padX: "space-300", padY: "space-500", gap: "space-400" }, [
          S({ gap: "space-050" }, [T("Step 1 of 4", "heading-eyebrow"), T("What kind of visit works for you?", "heading-heading-1")]),
          S({ gap: "space-150" }, [
            C("SelectionCard", { title: "Video visit", description: "Talk with a provider from home, usually within 10 minutes.", defaultChecked: true }),
            C("SelectionCard", { title: "Phone visit", description: "A provider calls you. No video needed.", defaultChecked: false }),
            C("SelectionCard", { title: "Message a provider", description: "Get a written reply within a few hours.", defaultChecked: false })
          ]),
          S({ direction: "row", justify: "flex-end" }, [C("Button", { children: "Continue", icon: "right", iconName: "arrow-right" })])
        ])
      ]);
    } },
    signin: { label: "Sign in", blurb: "A focused header and a short form", make: function () {
      return root([
        C("GlobalHeader", { type: "focused", loggedIn: false, title: "Sign in" }),
        S({ maxWidth: "var(--layout-width-forms)", padX: "space-300", padY: "space-600", gap: "space-400" }, [
          S({ gap: "space-100" }, [T("Welcome back", "heading-title"), T("Sign in to see your visits and messages.", "body-default", { color: "text-body-subdued" })]),
          S({ gap: "space-250" }, [
            C("TextInput", { label: "Email", helper: "", placeholder: "name@example.com", unit: "", icon: "mail" }),
            C("PasswordInput", { mode: "sign-in" }),
            C("Checkbox", { label: "Keep me signed in", defaultChecked: false })
          ]),
          S({ gap: "space-150", align: "center" }, [
            C("Button", { children: "Sign in", icon: "none" }, { fill: true }),
            C("Button", { children: "Forgot your password?", variant: "tertiary", icon: "none" })
          ])
        ])
      ]);
    } },
    mobile: { label: "Mobile home", blurb: "A nav list and the tab bar, for phones", device: "mobile", make: function () {
      return root([
        C("GlobalHeader", { cta: "" }),
        S({ padX: "space-200", padY: "space-300", gap: "space-300" }, [
          T("Hi, Sam", "heading-heading-1"),
          C("VisitCard", { prominent: true }),
          S({ gap: "space-150" }, [T("Next steps", "heading-heading-3"), C("NavList", { count: 3 })])
        ]),
        S({ gap: "space-0" }, [C("GlobalFooter")])
      ]);
    } },
    blank: { label: "Blank screen", blurb: "Start from nothing", make: function () { return root([]); } }
  };
  var TEMPLATE_ORDER = ["blank", "home", "visit", "signin", "mobile"];

  function newScreen(tpl, name) { return { id: uid(), name: name || TEMPLATES[tpl].label, root: TEMPLATES[tpl].make() }; }
  function starter() { var s = newScreen("home", "Home"); return { version: 1, screens: [s], current: s.id }; }
  function validProject(p) { return p && p.version === 1 && Array.isArray(p.screens) && p.screens.length && p.screens.every(function (s) { return s && s.id && s.root && s.root.children; }); }
  function load() {
    try { var p = JSON.parse(localStorage.getItem(STORE)); if (validProject(p)) return p; } catch (e) {}
    return starter();
  }
  function fromShareHash() {
    var m = /^#project=(.+)$/.exec(location.hash);
    if (!m) return null;
    try { var p = JSON.parse(decodeURIComponent(escape(atob(m[1])))); return validProject(p) ? p : null; } catch (e) { return null; }
  }

  // ---------- styles from args (shared by the canvas and the code)
  function v(t) { return t ? "var(--" + t + ")" : undefined; }
  function boxStyle(n) {
    var a = n.args, s = {};
    if (n.type === "Grid") { s.display = "grid"; s.gridTemplateColumns = "repeat(" + a.columns + ", minmax(0, 1fr))"; }
    else {
      s.display = "flex"; s.flexDirection = a.direction;
      if (a.align !== "stretch") s.alignItems = a.align;
      if (a.justify !== "flex-start") s.justifyContent = a.justify;
      if (a.wrap && isRow(a)) s.flexWrap = "wrap";
    }
    s.gap = v(a.gap);
    if (a.padX !== "space-0" || a.padY !== "space-0") s.padding = v(a.padY) + " " + v(a.padX);
    if (a.maxWidth) { s.maxWidth = a.maxWidth; s.width = "100%"; s.marginLeft = "auto"; s.marginRight = "auto"; s.boxSizing = "border-box"; }
    if (a.bg) s.background = v(a.bg);
    if (a.border) s.border = "1px solid " + v(a.border);
    if (a.radius) s.borderRadius = v(a.radius);
    return s;
  }
  function textStyle(n) {
    var a = n.args, s = { margin: 0 };
    var def = /^heading-(title|heading-1)$/.test(a.style) ? "text-header-serif" : a.style === "heading-eyebrow" ? "text-header-eyebrow" : a.style === "heading-sections" ? "text-header-sections" : "text-body-base";
    s.color = v(a.color || def);
    // Section labels match Figma's heading/sections style: all caps, 2% letter spacing, 1.5 line height.
    if (a.style === "heading-sections") { s.textTransform = "uppercase"; s.letterSpacing = "0.02em"; s.lineHeight = "21px"; }
    if (a.align !== "start") s.textAlign = a.align;
    // Space above and below, as margins in space-between and space-after tokens. Adds to the stack's gap.
    if (a.spaceAbove || a.spaceBelow) s.margin = (a.spaceAbove ? v(a.spaceAbove) : "0") + " 0 " + (a.spaceBelow ? v(a.spaceBelow) : "0");
    return s;
  }
  function fills(n) { return n.fill != null ? n.fill : !HUG[n.type] || (n.type === "Illustration" && n.args.type === "hero"); }
  function itemStyle(n, parent) {
    if (!parent || parent.type !== "Stack") return {};
    if (isRow(parent.args)) return { flex: fills(n) ? "1 1 0" : "0 0 auto", minWidth: 0 };
    if (fills(n) && parent.args.align !== "stretch") return { alignSelf: "stretch" };
    return {};
  }
  // Story args with builder-only tweaks: an automatic header layout follows the device.
  function storyArgs(n, device) {
    var a = n.args;
    if (n.type === "GlobalHeader" && a.layout === "auto") a = Object.assign({}, a, { layout: isWide(device) ? "desktop" : "mobile" });
    return a;
  }

  // ---------- canvas rendering
  var Boundary = (function () {
    function B(p) { React.Component.call(this, p); this.state = { err: null }; }
    B.prototype = Object.create(React.Component.prototype);
    B.getDerivedStateFromError = function (err) { return { err: err }; };
    B.prototype.componentDidUpdate = function (prev) { if (prev.k !== this.props.k && this.state.err) this.setState({ err: null }); };
    B.prototype.render = function () { return this.state.err ? h("div", { className: "sb-broken" }, "This component couldn't render with these settings.") : this.props.children; };
    return B;
  })();

  function renderNode(n, parent, ctx) {
    var edit = ctx.mode === "edit";
    var cls = "sb-node" + (edit && ctx.sel === n.id ? " is-selected" : "") + (n.link ? " has-link" : "");
    var attrs = { key: n.id + (ctx.editing === n.id ? "-edit" : ""), "data-sb-id": n.id, "data-sb-label": nodeName(n), "data-sb-link": n.link || undefined, draggable: edit && parent ? true : undefined };
    var ist = itemStyle(n, parent);
    if (BLOCKS[n.type] && BLOCKS[n.type].container) {
      var kids = n.children.map(function (c) { return renderNode(c, n, ctx); });
      if (!kids.length && edit) kids = h("div", { className: "sb-empty", key: "empty" }, parent ? "Empty " + nodeName(n).toLowerCase() + ". Drag components here." : "Drag components here, or pick them from Add.");
      var gridCls = n.type === "Grid" && n.args.collapse ? " sb-grid--collapse" : "";
      return h("div", Object.assign(attrs, { className: cls + " sb-box" + gridCls + (parent ? "" : " sb-root"), style: Object.assign(boxStyle(n), ist) }), kids);
    }
    if (n.type === "Text") {
      var editing = ctx.editing === n.id;
      return h(TAGS[n.args.style] || "p", Object.assign(attrs, {
        className: cls + " sb-text " + n.args.style + (editing ? " is-editing" : ""), style: Object.assign(textStyle(n), ist),
        contentEditable: editing || undefined, suppressContentEditableWarning: true, draggable: editing ? false : attrs.draggable,
        ref: editing ? function (el) { if (el && document.activeElement !== el) { el.focus(); var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } } : undefined,
        onBlur: editing ? function (e) { ctx.commitText(n.id, e.currentTarget.innerText.replace(/\n+$/, "")); } : undefined,
        onKeyDown: editing ? function (e) {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); }
          if (e.key === "Escape") { e.preventDefault(); e.currentTarget.innerText = n.args.text; e.currentTarget.blur(); }
        } : undefined
      }), n.args.text);
    }
    if (n.type === "Divider") {
      var row = parent && parent.type === "Stack" && isRow(parent.args);
      return h("div", Object.assign(attrs, { className: cls + " sb-divider", style: Object.assign({}, ist, row ? { flex: "0 0 auto", alignSelf: "stretch" } : {}) }),
        h("hr", { style: row ? { border: 0, borderLeft: "1px solid var(--stroke-subdued)", height: "100%", margin: 0 } : { border: 0, borderTop: "1px solid var(--stroke-subdued)", margin: 0 } }));
    }
    if (n.type === "Spacer") {
      var size = v(n.args.size), rowSp = parent && parent.type === "Stack" && isRow(parent.args);
      return h("div", Object.assign(attrs, { className: cls + " sb-spacer", style: Object.assign({}, ist, rowSp ? { width: size, flex: "0 0 auto" } : { height: size }) }));
    }
    var story = STORIES[n.type];
    if (!story || !A[n.type]) return h("div", Object.assign(attrs, { className: cls + " sb-broken" }), "Unknown component " + n.type);
    var args = storyArgs(n, ctx.device), props;
    try { props = story.props(args); } catch (e) { props = null; }
    return h("div", Object.assign(attrs, { className: cls + " sb-leaf" + (fills(n) ? " sb-fill" : ""), style: ist }),
      h(Boundary, { k: JSON.stringify(n.args) }, props ? h(A[n.type], Object.assign({ key: story.key ? story.key(args) : "k" }, props)) : h("div", { className: "sb-broken" }, "Check this component's settings.")));
  }

  // ---------- code
  function pascal(s) { var p = String(s).replace(/[^A-Za-z0-9 ]+/g, " ").trim().split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(""); return /^[A-Z]/.test(p) ? p : "Screen" + p; }
  function styleCode(s) {
    var keys = Object.keys(s).filter(function (k) { return s[k] !== undefined; });
    return "{{ " + keys.map(function (k) { return k + ": " + (typeof s[k] === "number" ? s[k] : JSON.stringify(s[k])); }).join(", ") + " }}";
  }
  function jsxText(t) { return String(t).replace(/[{}<>]/g, function (c) { return '{"' + c + '"}'; }).replace(/\n/g, "<br />"); }
  function indent(str, d) { var pad = new Array(d + 1).join("  "); return str.split("\n").map(function (l) { return pad + l; }).join("\n"); }
  function codeNode(n, parent, d, ctx) {
    var ist = itemStyle(n, parent), out;
    var note = n.link ? indent("{/* On click, go to: " + ctx.screenName(n.link) + " */}", d) + "\n" : "";
    if (BLOCKS[n.type] && BLOCKS[n.type].container) {
      var st = styleCode(Object.assign(boxStyle(n), ist));
      if (!n.children.length) return note + indent("<div style=" + st + " />", d);
      return note + indent("<div style=" + st + ">", d) + "\n" + n.children.map(function (c) { return codeNode(c, n, d + 1, ctx); }).join("\n") + "\n" + indent("</div>", d);
    }
    if (n.type === "Text") {
      var tag = TAGS[n.args.style] || "p";
      return note + indent("<" + tag + ' className="' + n.args.style + '" style=' + styleCode(Object.assign(textStyle(n), ist)) + ">" + jsxText(n.args.text) + "</" + tag + ">", d);
    }
    if (n.type === "Divider") return indent('<hr style={{ border: 0, borderTop: "1px solid var(--stroke-subdued)", margin: 0 }} />', d);
    if (n.type === "Spacer") return indent("<div style={{ " + (parent && isRow(parent.args) ? "width" : "height") + ': "' + v(n.args.size) + '" }} />', d);
    var story = STORIES[n.type], args = storyArgs(n, ctx.device);
    try { out = story.code ? story.code(args) : PG.jsx(n.type, story.props(args)); } catch (e) { out = "<" + n.type + " />"; }
    if (Object.keys(ist).length) return note + indent("<div style=" + styleCode(ist) + ">", d) + "\n" + indent(out, d + 1) + "\n" + indent("</div>", d);
    return note + indent(out, d);
  }
  function screenCode(screen, ctx) {
    var body = codeNode(screen.root, null, 2, ctx);
    var used = {}; body.replace(/<([A-Z]\w*)/g, function (_, n) { used[n] = 1; });
    var names = Object.keys(used).sort();
    return "// " + screen.name + ", built with Pulse components and tokens.\n" +
      "// Load tokens/anvil-tokens.css, dist/anvil.css and dist/anvil.js first (see the README).\n" +
      (names.length ? "const { " + names.join(", ") + " } = Pulse;\n" : "") + "\n" +
      "export function " + pascal(screen.name) + "() {\n  return (\n" + body + "\n  );\n}\n";
  }

  // ---------- controls
  function TokenField(p) {
    var c = p.c, id = "sb-" + p.k;
    if (c.type === "select" && Array.isArray(c.options[0])) {
      return h("div", { className: "pg-field pg-field--select" },
        h("label", { htmlFor: id }, c.label),
        h(A.SelectInput, { id: id, className: "pg-select", value: p.value, onChange: function (val) { p.set(val); },
          options: c.options.map(function (o) { return { value: o[0], label: o[1] }; }) }));
    }
    return h(PG.Field, { k: p.k, c: c, value: p.value, set: p.set });
  }
  function Controls(p) {
    var spec = BLOCKS[p.node.type] || STORIES[p.node.type];
    if (!spec) return null;
    var a = p.node.args;
    return h(React.Fragment, null, Object.keys(spec.controls).map(function (k) {
      var c = spec.controls[k];
      if (c.when && !c.when(a)) return null;
      if (p.node.type === "GlobalHeader" && k === "layout") c = sel("Layout", [["auto", "Follow the device"], ["desktop", "Desktop"], ["mobile", "Mobile"]], "auto");
      return h(TokenField, { key: p.node.id + k, k: p.node.id + "-" + k, c: c, value: a[k] == null ? c.def : a[k], set: function (val) { p.setArg(k, val); } });
    }));
  }

  function Chev() {
    return h("svg", { className: "cp-chev", viewBox: "0 0 16 16", "aria-hidden": "true" }, h("path", { d: "M3.5 6 8 10.5 12.5 6", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" }));
  }

  // ---------- app
  var dragPayload = null;

  // ---------- command box: type what you want, check what the builder understood, then add it.
  // It reads the command with simple rules (no AI), so it works offline and nothing leaves the browser.

  // longest phrases first, so "body small strong" wins over "body"
  var STYLE_WORDS = [
    [/\bbody small strong\b|\bsmall bold\b/, "body-small-strong"], [/\bbody small\b|\bsmall text\b/, "body-small-default"],
    [/\bbody strong\b|\bbold body\b|\bbold text\b/, "body-strong"], [/\bbody italics?\b|\bitalics?\b/, "body-italics"],
    [/\bsection labels?\b|\bheading[- ]sections?\b|\bsections? style\b/, "heading-sections"], [/\beyebrow\b/, "heading-eyebrow"],
    [/\bheading[- ]?1\b|\bh1\b|\bheading one\b/, "heading-heading-1"], [/\bheading[- ]?2\b|\bh2\b|\bheading two\b/, "heading-heading-2"],
    [/\bheading[- ]?3\b|\bh3\b|\bheading three\b/, "heading-heading-3"], [/\bheading[- ]?4\b|\bh4\b|\bheading four\b/, "heading-heading-4"],
    [/\btitle style\b|\bas (?:a )?title\b|\bpage title\b/, "heading-title"],
    [/\bdata[- ]?1\b/, "data-data-1"], [/\bdata[- ]?2\b/, "data-data-2"], [/\bdata[- ]?3\b/, "data-data-3"],
    [/\bbody(?: text)?\b|\bparagraph\b/, "body-default"]
  ];
  var SPACE_KEYS = Object.keys(SPACE_PX);
  function spaceFrom(str) {
    var m = /space[-\s]?(\d{1,3})\b/.exec(str);
    if (m) {
      var k = m[1].length === 2 && m[1] !== "00" ? "0" + m[1] : m[1];
      if (SPACE_PX[k] != null) return "space-" + k;
    }
    m = /(\d{1,3})\s*px\b/.exec(str);
    if (m) {
      var px = Number(m[1]), best = SPACE_KEYS[0];
      SPACE_KEYS.forEach(function (key) { if (Math.abs(SPACE_PX[key] - px) < Math.abs(SPACE_PX[best] - px)) best = key; });
      return "space-" + best;
    }
    return null;
  }
  function textPreview(n) {
    var found = null;
    walk(n, function (c) { if (found) return; if (c.type === "Text" && c.args.text) found = String(c.args.text); else if (c !== n && !BLOCKS[c.type]) found = labelOf(c.type); });
    return found ? (found.length > 28 ? found.slice(0, 27) + "…" : found) : "empty";
  }
  // every place a header can go: the screen itself, then each stack, row and grid in screen order
  function containersOf(screen) {
    var list = [{ id: screen.root.id, label: "The screen (top level)", words: "screen page" }], counts = {};
    walk(screen.root, function (n, depth) {
      if (depth === 0 || !BLOCKS[n.type] || !BLOCKS[n.type].container) return;
      var kind = n.type === "Grid" ? "Grid" : isRow(n.args) ? "Row" : "Stack";
      counts[kind] = (counts[kind] || 0) + 1;
      var pv = textPreview(n);
      list.push({ id: n.id, label: kind + " " + counts[kind] + " · " + pv, words: (kind + " " + counts[kind] + " " + pv).toLowerCase(), kind: kind.toLowerCase(), nth: counts[kind] });
    });
    return list;
  }
  function selectedContainer(screen, selId) {
    if (!selId) return null;
    var f = find(screen.root, selId);
    if (!f) return null;
    if (BLOCKS[f.node.type] && BLOCKS[f.node.type].container) return f.node.id;
    return f.parent ? f.parent.id : null;
  }

  function parseCommand(raw, screen, selId) {
    var out = { text: null, style: null, above: "", below: "", target: null, position: "end", wrap: false, notes: [] };
    var cmd = String(raw || "");
    // 1. words in quotes are the header text, and are left out of everything else
    var q = /["“”']([^"“”']+)["“”']/.exec(cmd);
    if (q) { out.text = q[1].trim(); cmd = cmd.replace(q[0], " "); }
    var low = " " + cmd.toLowerCase().replace(/\s+/g, " ") + " ";
    // 2. type style
    for (var i = 0; i < STYLE_WORDS.length; i++) if (STYLE_WORDS[i][0].test(low)) { out.style = STYLE_WORDS[i][1]; break; }
    if (!out.style) out.style = /\bsection\b/.test(low) ? "heading-sections" : /\b(header|heading|title)\b/.test(low) ? "heading-heading-2" : "heading-sections";
    // 3. space: each clause that names a token or px gets read on its own
    low.split(/,|;|\band\b|\bwith\b|\bplus\b/).forEach(function (part) {
      var tok = spaceFrom(part);
      if (!tok) { if (/\bno space\b/.test(part)) { out.above = ""; out.below = ""; } return; }
      if (/\b(around|both|above and below)\b/.test(part)) { out.above = tok; out.below = tok; }
      else if (/\b(above|before|on top|over|top)\b/.test(part)) out.above = tok;
      else out.below = tok;
    });
    // 4. where it goes
    var list = containersOf(screen), sc = selectedContainer(screen, selId);
    if (/\bnew (stack|group)\b|\bown (stack|group)\b|\bwrap/.test(low)) out.wrap = true;
    var m = /\b(stack|row|grid|group)\s*(\d+)\b/.exec(low);
    if (m) {
      var kind = m[1] === "group" ? "stack" : m[1];
      var hit = list.filter(function (c) { return c.kind === kind && c.nth === Number(m[2]); })[0];
      if (hit) out.target = hit.id; else out.notes.push("There's no " + m[1] + " " + m[2] + " on this screen.");
    }
    if (!out.target && /\b(selected|this) (stack|group|row|grid)\b|\bselected\b/.test(low)) {
      if (sc) out.target = sc; else out.notes.push("Nothing is selected, so it goes on the screen. Click a stack first, or pick one below.");
    }
    if (!out.target && /\b(screen|page|top level)\b/.test(low)) out.target = screen.root.id;
    if (!out.target) {
      // a stack named by the text inside it, such as "to the your health stack"
      var nm = /\b(?:to|in|into|inside|under) the (.+?) (?:stack|group|row|grid)\b/.exec(low);
      if (nm && !/^(selected|this|new)$/.test(nm[1])) {
        var named = list.filter(function (c) { return c.words.indexOf(nm[1].trim()) >= 0; })[0];
        if (named) out.target = named.id; else out.notes.push("Couldn't find a stack with “" + nm[1].trim() + "” in it.");
      }
    }
    if (!out.target) out.target = sc || screen.root.id;
    if (/\b(at the )?(top|start|beginning|first)\b/.test(low.replace(/\bon top\b/, ""))) out.position = "start";
    // 5. header text without quotes: the words after "called", "saying" and the like
    if (!out.text) {
      // the most specific word wins, so "body text saying Hello" gives "Hello"
      var flat = cmd.replace(/\s+/g, " ").trim(), t = null;
      ["called", "named", "titled", "saying", "says", "that reads", "reading", "text"].some(function (kw) {
        t = new RegExp("\\b" + kw + "\\s+(.+?)(?=\\s+(?:to|in|into|inside|with|using|at|as|and)\\b|,|$)", "i").exec(flat);
        return !!t;
      });
      out.text = t ? t[1].trim() : "";
    }
    return out;
  }

  var POSITIONS = [["end", "At the end"], ["start", "At the start"]];
  var SPACE_OR_NONE = [["", "No extra space"]].concat(SPACE.filter(function (s) { return s[0] !== "space-0"; }));
  var EXAMPLES = [
    "Add a section header \"Your health\" to the selected stack with space-300 below",
    "Add \"Upcoming visits\" as heading 2 at the top of stack 1, space-200 above and space-150 below",
    "Add a section label saying Recent activity in a new stack with 24px below"
  ];

  function CommandBar(p) {
    var cs = React.useState(""), cmd = cs[0], setCmd = cs[1];
    var ds = React.useState(null), draft = ds[0], setDraft = ds[1];
    var list = containersOf(p.screen);
    function read(v) {
      setCmd(v);
      setDraft(v.trim() ? parseCommand(v, p.screen, p.selId) : null);
    }
    function set(k, v) { var o = {}; o[k] = v; setDraft(Object.assign({}, draft, o)); }
    function add() {
      if (!draft) return;
      p.onAdd(Object.assign({}, draft, { text: draft.text || "Section header" }));
      setCmd(""); setDraft(null);
    }
    var target = draft && (list.filter(function (c) { return c.id === draft.target; })[0] || list[0]);
    return h("section", { className: "sb-cmd", "aria-label": "Add with a command" },
      h("form", { className: "sb-cmd__row", onSubmit: function (e) { e.preventDefault(); add(); } },
        h(A.TextInput, { id: "sb-cmd-input", className: "sb-cmd__input", label: "Add with a command", value: cmd, autoComplete: "off",
          helper: "Say what to add, where it goes, the type style and any space. Then check the fields below.",
          placeholder: "Add a section header…",
          onChange: function (e) { read(e.target.value); } }),
        h(A.Button, { type: "submit", disabled: !draft }, "Add header")),
      draft
        ? h("div", { className: "sb-cmd__fields", role: "group", "aria-label": "What the builder understood" },
            h("div", { className: "pg-field" }, h("label", { htmlFor: "sb-cmd-text" }, "Header text"),
              h("input", { id: "sb-cmd-text", type: "text", value: draft.text, placeholder: "Section header", onChange: function (e) { set("text", e.target.value); } })),
            h("div", { className: "pg-field" }, h("label", { htmlFor: "sb-cmd-style" }, "Type style"),
              h(A.SelectInput, { id: "sb-cmd-style", className: "pg-select", value: draft.style, onChange: function (v) { set("style", v); },
                options: TEXT_STYLES.map(function (t) { return { value: t[0], label: t[1] }; }) })),
            h("div", { className: "pg-field" }, h("label", { htmlFor: "sb-cmd-above" }, "Space above"),
              h(A.SelectInput, { id: "sb-cmd-above", className: "pg-select", value: draft.above, onChange: function (v) { set("above", v); },
                options: SPACE_OR_NONE.map(function (s) { return { value: s[0], label: s[1] }; }) })),
            h("div", { className: "pg-field" }, h("label", { htmlFor: "sb-cmd-below" }, "Space below"),
              h(A.SelectInput, { id: "sb-cmd-below", className: "pg-select", value: draft.below, onChange: function (v) { set("below", v); },
                options: SPACE_OR_NONE.map(function (s) { return { value: s[0], label: s[1] }; }) })),
            h("div", { className: "pg-field sb-cmd__wide" }, h("label", { htmlFor: "sb-cmd-target" }, "Add to"),
              h(A.SelectInput, { id: "sb-cmd-target", className: "pg-select", value: target.id, onChange: function (v) { set("target", v); },
                options: list.map(function (c) { return { value: c.id, label: c.label }; }) })),
            h("div", { className: "pg-field" }, h("label", { htmlFor: "sb-cmd-pos" }, "Where in it"),
              h(A.SelectInput, { id: "sb-cmd-pos", className: "pg-select", value: draft.position, onChange: function (v) { set("position", v); },
                options: POSITIONS.map(function (s) { return { value: s[0], label: s[1] }; }) })),
            h("div", { className: "pg-field pg-field--bool sb-cmd__wrap" }, h("label", { htmlFor: "sb-cmd-new" }, "In its own new stack"),
              h("button", { id: "sb-cmd-new", type: "button", role: "switch", "aria-checked": draft.wrap ? "true" : "false", className: "pg-switch", onClick: function () { set("wrap", !draft.wrap); } }, h("span", null))),
            draft.notes.length ? h("p", { className: "sb-cmd__note", role: "status" }, draft.notes.join(" ")) : null)
        : h("div", { className: "sb-cmd__examples" }, h("span", null, "Try:"),
            EXAMPLES.map(function (ex) { return h("button", { key: ex, type: "button", onClick: function () { read(ex); } }, ex); })));
  }

  // ---------- keyboard mode: what a keyboard user can reach, in tab order
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
  function focusables(root) {
    if (!root) return [];
    return Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), function (el) {
      if (el.tabIndex < 0 || !el.getClientRects().length) return false;
      var cs = getComputedStyle(el);
      return cs.visibility !== "hidden" && cs.display !== "none";
    });
  }
  var ROLE_NAMES = { a: "Link", button: "Button", select: "Select", textarea: "Text area", combobox: "Select", "switch": "Switch", checkbox: "Checkbox",
    radio: "Radio button", slider: "Slider", tab: "Tab", link: "Link", menuitem: "Menu item", option: "Option" };
  function roleOf(el) {
    var r = el.getAttribute("role"), t = el.tagName.toLowerCase();
    if (r && ROLE_NAMES[r]) return ROLE_NAMES[r];
    if (t === "input") { var ty = (el.type || "text").toLowerCase(); return ty === "range" ? "Slider" : ROLE_NAMES[ty] || "Text field"; }
    return ROLE_NAMES[t] || "Focusable item";
  }
  function nameOf(el) {
    var txt = function (x) { return x ? String(x.textContent || "").replace(/\s+/g, " ").trim() : ""; };
    var n = el.getAttribute("aria-label");
    if (!n && el.getAttribute("aria-labelledby")) n = el.getAttribute("aria-labelledby").split(/\s+/).map(function (id) { return txt(document.getElementById(id)); }).join(" ").trim();
    if (!n && el.id) { var lab = document.querySelector('label[for="' + el.id + '"]'); n = txt(lab); }
    if (!n && el.closest("label")) n = txt(el.closest("label"));
    if (!n && !/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) n = txt(el);
    if (!n) n = el.getAttribute("title") || el.getAttribute("placeholder") || "";
    return n.length > 60 ? n.slice(0, 57) + "…" : n;
  }

  function App() {
    var ps = React.useState(function () { return load(); }), project = ps[0], setProjectRaw = ps[1];
    var ss = React.useState(null), selId = ss[0], setSel = ss[1];
    var es = React.useState(null), editing = es[0], setEditing = es[1];
    var ds = React.useState(function () { var d = window.innerWidth < 720 ? "mobile" : "desktop"; try { return localStorage.getItem(STORE + "-device") || d; } catch (e) { return d; } }), device = ds[0], setDevice = ds[1];
    var ms = React.useState("edit"), mode = ms[0], setMode = ms[1];
    var ts = React.useState("canvas"), tab = ts[0], setTab = ts[1];
    var ls = React.useState("add"), leftTab = ls[0], setLeftTab = ls[1];
    var qs = React.useState(""), q = qs[0], setQ = qs[1];
    var ns = React.useState(false), addOpen = ns[0], setAddOpen = ns[1];
    var cs = React.useState(""), toast = cs[0], setToast = cs[1];
    var drs = React.useState(null), drop = drs[0], setDrop = drs[1];
    var fs = React.useState(1), scale = fs[0], setScale = fs[1];
    var hs = React.useState(0), screenH = hs[0], setScreenH = hs[1];
    var ks = React.useState({ list: [], at: -1 }), kbd = ks[0], setKbd = ks[1];
    var os = React.useState(true), showOrder = os[0], setShowOrder = os[1];
    var keysBtnRef = React.useRef(null);
    var hist = React.useRef({ past: [], future: [] });
    var canvasRef = React.useRef(null), screenRef = React.useRef(null), fileRef = React.useRef(null), hoverRef = React.useRef(null);

    var screen = project.screens.filter(function (s) { return s.id === project.current; })[0] || project.screens[0];
    var dev = DEVICES[device] || DEVICES.desktop;
    var selected = selId ? find(screen.root, selId) : null;
    if (selId && !selected) selected = null;

    var projRef = React.useRef(project);
    projRef.current = project;
    // Changes are worked out from the latest project right away, so several in a row all land.
    function setProject(fn, keepHistory) {
      var old = projRef.current;
      var next = typeof fn === "function" ? fn(clone(old)) : fn;
      if (!next) return;
      if (!keepHistory) { hist.current.past.push(old); if (hist.current.past.length > 80) hist.current.past.shift(); hist.current.future = []; }
      projRef.current = next;
      setProjectRaw(next);
    }
    function editScreen(fn) {
      setProject(function (p) { var s = p.screens.filter(function (x) { return x.id === p.current; })[0] || p.screens[0]; return fn(s, p) === false ? null : p; });
    }
    function undo() { var hh = hist.current; if (!hh.past.length) return; hh.future.push(projRef.current); projRef.current = hh.past.pop(); setProjectRaw(projRef.current); }
    function redo() { var hh = hist.current; if (!hh.future.length) return; hh.past.push(projRef.current); projRef.current = hh.future.pop(); setProjectRaw(projRef.current); }
    function flash(msg) { setToast(msg); clearTimeout(flash.t); flash.t = setTimeout(function () { setToast(""); }, 1800); }

    // share links load once, then the hash is cleared
    React.useEffect(function () {
      var shared = fromShareHash();
      if (shared && window.confirm("Open the shared screens? This replaces the screens saved in this browser.")) { setProject(shared); setSel(null); }
      if (/^#project=/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
    }, []);
    React.useEffect(function () { try { localStorage.setItem(STORE, JSON.stringify(project)); } catch (e) {} }, [project]);
    React.useEffect(function () { try { localStorage.setItem(STORE + "-device", device); } catch (e) {} }, [device]);

    // fit the screen into the canvas
    React.useLayoutEffect(function () {
      var cv = canvasRef.current, sc = screenRef.current;
      if (!cv || !sc) return;
      function fit() {
        var avail = cv.clientWidth - 48;
        setScale(Math.min(1, Math.max(0.2, avail / dev.w)));
        setScreenH(sc.offsetHeight);
      }
      fit();
      var ro = new ResizeObserver(fit); ro.observe(cv); ro.observe(sc);
      return function () { ro.disconnect(); };
    }, [device, tab]);

    // keyboard mode: Tab and Shift+Tab move focus through the screen only, in DOM order, with the real focus ring
    function readFocus() {
      var sc = screenRef.current; if (!sc) return;
      var box = sc.getBoundingClientRect(), k = scale || 1, els = focusables(sc);
      setKbd({
        at: els.indexOf(document.activeElement),
        list: els.map(function (el) {
          var r = el.getBoundingClientRect();
          return { x: Math.max(14 / k, (r.left - box.left) / k), y: Math.max(14 / k, (r.top - box.top) / k), role: roleOf(el), name: nameOf(el) }; // stay inside the screen edge
        })
      });
    }
    function stepFocus(dir) {
      var els = focusables(screenRef.current); if (!els.length) return;
      var i = els.indexOf(document.activeElement);
      var next = i < 0 ? (dir > 0 ? 0 : els.length - 1) : (i + dir + els.length) % els.length;
      els[next].focus();
    }
    React.useEffect(function () {
      if (mode !== "keys" || tab !== "canvas") return;
      function onKeyDown(e) {
        if (e.key === "Tab" && !e.altKey && !e.metaKey && !e.ctrlKey) { e.preventDefault(); stepFocus(e.shiftKey ? -1 : 1); }
        else if (e.key === "Escape" && !e.defaultPrevented && screenRef.current && screenRef.current.contains(document.activeElement)) {
          setMode("preview"); if (keysBtnRef.current) keysBtnRef.current.focus();
        }
      }
      var t = setTimeout(readFocus, 50);
      window.addEventListener("keydown", onKeyDown);
      document.addEventListener("focusin", readFocus);
      window.addEventListener("resize", readFocus);
      return function () { clearTimeout(t); window.removeEventListener("keydown", onKeyDown); document.removeEventListener("focusin", readFocus); window.removeEventListener("resize", readFocus); };
    }, [mode, tab, screen, device, scale]);

    // keyboard shortcuts
    React.useEffect(function () {
      function onKey(e) {
        var t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || !!(t.closest && t.closest(".anvil-select, .pg-picker")));
        var mod = e.metaKey || e.ctrlKey;
        if (mod && e.key.toLowerCase() === "z" && !typing) { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
        if (mod && e.key.toLowerCase() === "y" && !typing) { e.preventDefault(); redo(); return; }
        if (typing || mode !== "edit") return;
        if ((e.key === "Delete" || e.key === "Backspace") && selId) { e.preventDefault(); removeNode(selId); }
        if (mod && e.key.toLowerCase() === "d" && selId) { e.preventDefault(); duplicate(selId); }
        if (e.key === "Escape") setSel(null);
      }
      window.addEventListener("keydown", onKey);
      return function () { window.removeEventListener("keydown", onKey); };
    });

    // ---------- edits
    function insert(node, target) {
      editScreen(function (s) {
        var t = target, parent, index;
        if (!t) {
          var cur = selId && find(s.root, selId);
          if (cur && BLOCKS[cur.node.type] && BLOCKS[cur.node.type].container) t = { parent: cur.node.id, index: cur.node.children.length };
          else if (cur && cur.parent) t = { parent: cur.parent.id, index: cur.index + 1 };
          else t = { parent: s.root.id, index: s.root.children.length };
        }
        parent = find(s.root, t.parent).node; index = t.index;
        parent.children.splice(index, 0, node);
      });
      setSel(node.id);
    }
    function move(id, target) {
      editScreen(function (s) {
        var f = find(s.root, id), dest = find(s.root, target.parent);
        if (!f || !dest || contains(f.node, target.parent)) return false;
        var index = target.index;
        if (f.parent.id === target.parent && f.index < index) index -= 1;
        if (f.parent.id === target.parent && f.index === index) return false;
        f.parent.children.splice(f.index, 1);
        dest.node.children.splice(index, 0, f.node);
      });
    }
    function removeNode(id) {
      editScreen(function (s) { var f = find(s.root, id); if (!f || !f.parent) return false; f.parent.children.splice(f.index, 1); });
      setSel(null);
    }
    function duplicate(id) {
      var copyId = null;
      editScreen(function (s) { var f = find(s.root, id); if (!f || !f.parent) return false; var c = reId(clone(f.node)); copyId = c.id; f.parent.children.splice(f.index + 1, 0, c); });
      if (copyId) setSel(copyId);
    }
    function nudge(id, dir) {
      editScreen(function (s) {
        var f = find(s.root, id); if (!f || !f.parent) return false;
        var j = f.index + dir; if (j < 0 || j >= f.parent.children.length) return false;
        f.parent.children.splice(f.index, 1); f.parent.children.splice(j, 0, f.node);
      });
    }
    function wrapIn(id, type) {
      var wrapId = null;
      editScreen(function (s) {
        var f = find(s.root, id); if (!f || !f.parent) return false;
        var w = make(type, type === "Stack" ? { gap: "space-200" } : {}); w.children = [f.node]; wrapId = w.id;
        f.parent.children.splice(f.index, 1, w);
      });
      if (wrapId) setSel(wrapId);
    }
    // from the command box: a Text in the chosen style, with Spacers for space above and below
    function addFromCommand(d) {
      var newId = null;
      editScreen(function (s) {
        var dest = find(s.root, d.target) || find(s.root, s.root.id);
        var text = make("Text", { text: d.text, style: d.style });
        newId = text.id;
        var nodes = [];
        if (d.above) nodes.push(make("Spacer", { size: d.above }));
        nodes.push(text);
        if (d.below) nodes.push(make("Spacer", { size: d.below }));
        if (d.wrap) { var w = make("Stack", { gap: "space-0" }); w.children = nodes; nodes = [w]; }
        var kids = dest.node.children, at = d.position === "start" ? 0 : kids.length;
        Array.prototype.splice.apply(kids, [at, 0].concat(nodes));
      });
      if (newId) { setSel(newId); setMode("edit"); setTab("canvas"); flash("Added “" + d.text + "”"); }
    }
    function setArg(id, k, val) {
      editScreen(function (s) { var f = find(s.root, id); if (!f) return false; f.node.args[k] = val; });
    }
    function setNode(id, k, val) {
      editScreen(function (s) { var f = find(s.root, id); if (!f) return false; if (val === undefined || val === "") delete f.node[k]; else f.node[k] = val; });
    }
    function commitText(id, t) {
      setEditing(null);
      var f = find(screen.root, id);
      if (f && f.node.args.text !== t) setArg(id, "text", t);
    }

    // ---------- screens
    function goScreen(id) { setProject(function (p) { p.current = id; return p; }, true); setSel(null); setEditing(null); }
    function addScreen(tpl) {
      var s = newScreen(tpl);
      var taken = project.screens.map(function (x) { return x.name; });
      var base = s.name, i = 2; while (taken.indexOf(s.name) >= 0) { s.name = base + " " + i; i++; }
      setProject(function (p) { p.screens.push(s); p.current = s.id; return p; });
      if (TEMPLATES[tpl].device) setDevice(TEMPLATES[tpl].device);
      setSel(null); setAddOpen(false);
    }
    function renameScreen(name) { setProject(function (p) { p.screens.forEach(function (x) { if (x.id === p.current) x.name = name; }); return p; }); }
    function duplicateScreen() {
      setProject(function (p) {
        var src = p.screens.filter(function (x) { return x.id === p.current; })[0];
        var c = clone(src); c.id = uid(); c.name = src.name + " copy"; reId(c.root);
        p.screens.splice(p.screens.indexOf(src) + 1, 0, c); p.current = c.id; return p;
      });
      setSel(null);
    }
    function deleteScreen() {
      if (project.screens.length < 2) return;
      if (!window.confirm('Delete "' + screen.name + '"? You can undo this.')) return;
      setProject(function (p) {
        var i = p.screens.map(function (x) { return x.id; }).indexOf(p.current);
        var gone = p.screens[i].id;
        p.screens.splice(i, 1); p.current = p.screens[Math.max(0, i - 1)].id;
        p.screens.forEach(function (s) { walk(s.root, function (n) { if (n.link === gone) delete n.link; }); });
        return p;
      });
      setSel(null);
    }
    function screenName(id) { var s = project.screens.filter(function (x) { return x.id === id; })[0]; return s ? s.name : "a deleted screen"; }

    // ---------- project files
    function exportJSON() {
      var blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "pulse-screens.json";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    }
    function importJSON(e) {
      var file = e.target.files && e.target.files[0]; e.target.value = "";
      if (!file) return;
      file.text().then(function (t) {
        try { var p = JSON.parse(t); if (!validProject(p)) throw new Error(); setProject(p); setSel(null); flash("Screens imported"); }
        catch (err) { flash("That file isn't a Pulse screens file"); }
      });
    }
    function copyText(t, msg) {
      var done = function () { flash(msg); };
      try { navigator.clipboard.writeText(t).then(done, function () { flash("Couldn't copy. Select the text and copy it instead."); }); } catch (err) { flash("Couldn't copy"); }
    }
    function shareLink() {
      var enc = btoa(unescape(encodeURIComponent(JSON.stringify(project))));
      copyText(location.origin + location.pathname + "#project=" + enc, "Share link copied");
    }
    function startOver() {
      if (!window.confirm("Start over with the example screen? You can undo this.")) return;
      setProject(starter()); setSel(null);
    }

    // ---------- canvas events
    function nodeEl(t) { return t && t.closest ? t.closest("[data-sb-id]") : null; }
    function onCanvasClick(e) {
      if (mode !== "edit") {
        var link = e.target.closest && e.target.closest("[data-sb-link]");
        if (link) { e.preventDefault(); e.stopPropagation(); var to = link.getAttribute("data-sb-link"); if (project.screens.some(function (s) { return s.id === to; })) goScreen(to); }
        else if (e.target.closest && e.target.closest("a[href='#']")) e.preventDefault();
        return;
      }
      if (editing) return;
      e.preventDefault(); e.stopPropagation();
      var el = nodeEl(e.target);
      var id = el && el.getAttribute("data-sb-id");
      setSel(!id || id === screen.root.id ? null : id);
    }
    function onCanvasDbl(e) {
      if (mode !== "edit") return;
      var el = nodeEl(e.target); if (!el) return;
      var f = find(screen.root, el.getAttribute("data-sb-id"));
      if (f && f.node.type === "Text") { setSel(f.node.id); setEditing(f.node.id); }
    }
    function onHover(e) {
      var el = mode === "edit" ? nodeEl(e.target) : null;
      if (hoverRef.current === el) return;
      if (hoverRef.current) hoverRef.current.classList.remove("is-hover");
      hoverRef.current = el; if (el && !el.classList.contains("sb-root")) el.classList.add("is-hover");
    }

    // drag and drop: from the Add list, or to move something already on the screen
    function dropTarget(e) {
      var el = nodeEl(e.target); if (!el) return null;
      var f = find(screen.root, el.getAttribute("data-sb-id")); if (!f) return null;
      var movingId = dragPayload && dragPayload.move;
      if (movingId && contains(find(screen.root, movingId) ? find(screen.root, movingId).node : { id: "" }, f.node.id)) {
        // over the dragged item itself: walk up to its parent
        var mf = find(screen.root, movingId); if (!mf || !mf.parent) return null;
        f = find(screen.root, mf.parent.id); el = canvasRef.current.querySelector('[data-sb-id="' + f.node.id + '"]');
      }
      var isBox = BLOCKS[f.node.type] && BLOCKS[f.node.type].container;
      var r = el.getBoundingClientRect(), x = e.clientX, y = e.clientY;
      var pRow = f.parent && f.parent.type === "Stack" && isRow(f.parent.args);
      var edge = 10;
      var nearEdge = f.parent && (pRow ? (x - r.left < edge || r.right - x < edge) : (y - r.top < edge || r.bottom - y < edge));
      if (isBox && !nearEdge) {
        var row = f.node.type === "Grid" || isRow(f.node.args);
        var kids = Array.prototype.filter.call(el.children, function (c) { return c.hasAttribute("data-sb-id"); });
        var idx = kids.length;
        for (var i = 0; i < kids.length; i++) {
          var cr = kids[i].getBoundingClientRect();
          if (row ? (y < cr.top || (y < cr.bottom && x < cr.left + cr.width / 2)) : y < cr.top + cr.height / 2) { idx = i; break; }
        }
        var line;
        if (!kids.length) line = { box: r };
        else if (idx < kids.length) line = { ref: kids[idx].getBoundingClientRect(), before: true, row: row };
        else line = { ref: kids[kids.length - 1].getBoundingClientRect(), before: false, row: row };
        return { parent: f.node.id, index: idx, line: line };
      }
      if (!f.parent) return null;
      var before = pRow ? x < r.left + r.width / 2 : y < r.top + r.height / 2;
      return { parent: f.parent.id, index: f.index + (before ? 0 : 1), line: { ref: r, before: before, row: pRow } };
    }
    function onDragStart(e) {
      if (mode !== "edit") return;
      var el = nodeEl(e.target); if (!el) return;
      dragPayload = { move: el.getAttribute("data-sb-id") };
      e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", nodeName(find(screen.root, dragPayload.move).node)); } catch (err) {}
      e.stopPropagation();
    }
    function onDragOver(e) {
      if (!dragPayload || mode !== "edit") return;
      var t = dropTarget(e);
      if (!t) { setDrop(null); return; }
      e.preventDefault();
      e.dataTransfer.dropEffect = dragPayload.move ? "move" : "copy";
      var key = t.parent + ":" + t.index;
      if (!drop || drop.key !== key) setDrop({ key: key, t: t });
    }
    function onDrop(e) {
      if (!dragPayload) return;
      e.preventDefault();
      var t = dropTarget(e);
      if (t) {
        if (dragPayload.move) move(dragPayload.move, t);
        else insert(dragPayload.make(), t);
      }
      dragPayload = null; setDrop(null);
    }
    function endDrag() { dragPayload = null; setDrop(null); }

    function dropLine() {
      if (!drop) return null;
      var l = drop.t.line, st;
      if (l.box) st = { left: l.box.left, top: l.box.top, width: l.box.width, height: l.box.height };
      else if (l.row) st = { left: (l.before ? l.ref.left : l.ref.right) - 2, top: l.ref.top, width: 3, height: l.ref.height };
      else st = { left: l.ref.left, top: (l.before ? l.ref.top : l.ref.bottom) - 2, width: l.ref.width, height: 3 };
      return h("div", { className: "sb-dropline" + (l.box ? " sb-dropline--box" : ""), style: st, "aria-hidden": true });
    }

    // ---------- Add list
    var PALETTE = [["Layout and text", [
      { key: "Divider", label: "Divider", make: function () { return make("Divider"); } },
      { key: "Grid", label: "Grid", make: function () { return make("Grid", {}, { children: [] }); } },
      { key: "Heading", label: "Heading", make: function () { return make("Text", { text: "Heading", style: "heading-heading-1" }); } },
      { key: "Row", label: "Row", make: function () { return make("Stack", { direction: "row", align: "center" }); } },
      { key: "Spacer", label: "Spacer", make: function () { return make("Spacer"); } },
      { key: "Stack", label: "Stack", make: function () { return make("Stack"); } },
      { key: "Text", label: "Text", make: function () { return make("Text", { text: "Add your text here." }); } }
    ]]].concat(GROUPS.map(function (g) {
      return [g[0], g[1].filter(function (n) { return STORIES[n]; }).map(function (n) { return { key: n, label: LABELS[n] || n, make: function () { return make(n); } }; })
        .sort(function (a, b) { return a.label.localeCompare(b.label); })];
    }));
    var ql = q.trim().toLowerCase();

    function addList() {
      return h("div", { className: "sb-add" },
        h("input", { type: "search", className: "sb-search", placeholder: "Search components", "aria-label": "Search components", value: q, onChange: function (e) { setQ(e.target.value); } }),
        h("p", { className: "sb-hint" }, "Click to add after the selected item, or drag onto the screen."),
        PALETTE.map(function (g) {
          var items = g[1].filter(function (it) { return !ql || it.label.toLowerCase().indexOf(ql) >= 0; });
          if (!items.length) return null;
          return h("details", { key: g[0], className: "cp-group", open: true },
            h("summary", null, h("span", null, g[0]), h(Chev)),
            items.map(function (it) {
              return h("button", { key: it.key, type: "button", className: "sb-add__item", draggable: true,
                onClick: function () { if (mode !== "edit") setMode("edit"); insert(it.make()); },
                onDragStart: function (e) { dragPayload = { make: it.make }; e.dataTransfer.effectAllowed = "copy"; try { e.dataTransfer.setData("text/plain", it.label); } catch (err) {} },
                onDragEnd: endDrag }, it.label);
            }));
        }));
    }
    function layers() {
      var rows = [];
      walk(screen.root, function (n, depth) {
        rows.push(h("button", { key: n.id, type: "button", className: "sb-layer", style: { paddingLeft: 12 + depth * 14 }, "aria-current": (n.id === selId || (!selId && depth === 0)) ? "true" : undefined,
          onClick: function () { setSel(depth === 0 ? null : n.id); setMode("edit"); } },
          depth === 0 ? screen.name : nodeName(n), n.link ? h("span", { className: "sb-layer__link" }, "→ " + screenName(n.link)) : null));
      });
      return h("div", { className: "sb-layers" }, rows);
    }

    // ---------- inspector
    function inspector() {
      if (!selected) {
        return h(React.Fragment, null,
          h("div", { className: "pg-controls__head" }, h("h2", null, "Screen")),
          h("div", { className: "pg-field" }, h("label", { htmlFor: "sb-name" }, "Name"),
            h("input", { id: "sb-name", type: "text", value: screen.name, onChange: function (e) { renameScreen(e.target.value); } })),
          h("p", { className: "sb-note" }, "These settings style the whole screen. Select something on the screen to change it."),
          h(Controls, { node: screen.root, setArg: function (k, val) { setArg(screen.root.id, k, val); } }),
          h("div", { className: "sb-actions" },
            h("button", { type: "button", onClick: duplicateScreen }, "Duplicate screen"),
            h("button", { type: "button", onClick: deleteScreen, disabled: project.screens.length < 2 }, "Delete screen")),
          h("div", { className: "pg-controls__head sb-sub" }, h("h2", null, "Your screens")),
          h("p", { className: "sb-note" }, "Screens save in this browser. Export them to keep a copy or move them to another computer."),
          h("div", { className: "sb-actions" },
            h("button", { type: "button", onClick: shareLink }, "Copy share link"),
            h("button", { type: "button", onClick: exportJSON }, "Export file"),
            h("button", { type: "button", onClick: function () { fileRef.current.click(); } }, "Import file"),
            h("button", { type: "button", onClick: startOver }, "Start over")),
          h("input", { ref: fileRef, type: "file", accept: "application/json,.json", hidden: true, onChange: importJSON }));
      }
      var n = selected.node, spec = BLOCKS[n.type] || STORIES[n.type] || {};
      var inRow = selected.parent && selected.parent.type === "Stack" && isRow(selected.parent.args);
      var leaf = !(BLOCKS[n.type] && BLOCKS[n.type].container) && n.type !== "Spacer" && n.type !== "Divider";
      var others = project.screens.filter(function (s) { return s.id !== screen.id; });
      return h(React.Fragment, null,
        h("div", { className: "pg-controls__head" }, h("h2", null, labelOf(n.type)),
          h("button", { type: "button", className: "pg-reset", onClick: function () { setSel(null); } }, "Done")),
        spec.blurb ? h("p", { className: "sb-note" }, spec.blurb) : null,
        h("div", { className: "sb-tools", role: "group", "aria-label": "Arrange" },
          h("button", { type: "button", onClick: function () { nudge(n.id, -1); }, disabled: selected.index === 0, title: "Move up or left" }, "Move up"),
          h("button", { type: "button", onClick: function () { nudge(n.id, 1); }, disabled: selected.index === selected.parent.children.length - 1, title: "Move down or right" }, "Move down"),
          h("button", { type: "button", onClick: function () { duplicate(n.id); }, title: "Duplicate (⌘D)" }, "Duplicate"),
          h("button", { type: "button", className: "is-danger", onClick: function () { removeNode(n.id); }, title: "Delete (Delete key)" }, "Delete")),
        h("div", { className: "sb-tools" },
          h("button", { type: "button", onClick: function () { setSel(selected.parent.id === screen.root.id ? null : selected.parent.id); } }, "Select parent"),
          h("button", { type: "button", onClick: function () { wrapIn(n.id, "Stack"); } }, "Wrap in a stack")),
        inRow || n.type === "Button" || HUG[n.type] ? h(TokenField, { k: n.id + "-fill", c: sel("Width", [["fill", "Fill the space"], ["hug", "Fit the content"]], "fill"),
          value: fills(n) ? "fill" : "hug", set: function (val) { setNode(n.id, "fill", val === "fill"); } }) : null,
        h(Controls, { node: n, setArg: function (k, val) { setArg(n.id, k, val); } }),
        leaf ? h(TokenField, { k: n.id + "-link", c: sel("On click in preview, go to", [["", "Nowhere"]].concat(others.map(function (s) { return [s.id, s.name]; })), ""),
          value: n.link && others.some(function (s) { return s.id === n.link; }) ? n.link : "", set: function (val) { setNode(n.id, "link", val); } }) : null,
        leaf && !others.length ? h("p", { className: "sb-note" }, "Add another screen to link to it.") : null);
    }

    // ---------- render
    var ctx = { mode: mode, sel: selId, editing: editing, device: device, commitText: commitText };
    function keysBar() {
      var cur = kbd.at >= 0 ? kbd.list[kbd.at] : null;
      var keep = function (e) { e.preventDefault(); }; // keep focus on the screen when these are clicked
      return h("div", { className: "sb-keys" },
        h("p", { className: "sb-keys__help" }, "Press Tab to move to the next item and Shift+Tab to go back, the way a keyboard user would. Esc stops."),
        h("div", { className: "sb-keys__row" },
          h("p", { className: "sb-keys__now", role: "status" },
            !kbd.list.length ? "Nothing on this screen can take focus."
              : cur ? h(React.Fragment, null, h("strong", null, (kbd.at + 1) + " of " + kbd.list.length), " · " + cur.role + (cur.name ? ": " + cur.name : " (no name)"))
              : kbd.list.length + " items can take focus. Press Tab to start."),
          h("div", { className: "sb-tools sb-tools--inline" },
            h("button", { type: "button", onMouseDown: keep, onClick: function () { stepFocus(-1); }, disabled: !kbd.list.length }, "Previous"),
            h("button", { type: "button", onMouseDown: keep, onClick: function () { stepFocus(1); }, disabled: !kbd.list.length }, "Next")),
          h("div", { className: "pg-field pg-field--bool sb-keys__toggle" }, h("label", { htmlFor: "sb-keys-order" }, "Show focus order"),
            h("button", { id: "sb-keys-order", type: "button", role: "switch", "aria-checked": showOrder ? "true" : "false", className: "pg-switch", onMouseDown: keep, onClick: function () { setShowOrder(!showOrder); } }, h("span", null)))));
    }
    var code = tab === "code" ? screenCode(screen, { device: device, screenName: screenName }) : "";
    var canUndo = hist.current.past.length > 0, canRedo = hist.current.future.length > 0;

    return h("div", { className: "sb" + (mode !== "edit" ? " sb--preview" : "") + (mode === "keys" ? " sb--keys" : "") },
      h("aside", { className: "sb-left", "aria-label": "Add and layers" },
        h("div", { className: "pg-tabs sb-left__tabs", role: "tablist" },
          h("button", { role: "tab", type: "button", "aria-selected": leftTab === "add", onClick: function () { setLeftTab("add"); } }, "Add"),
          h("button", { role: "tab", type: "button", "aria-selected": leftTab === "layers", onClick: function () { setLeftTab("layers"); } }, "Layers")),
        leftTab === "add" ? addList() : layers()),
      h("section", { className: "sb-stage", "aria-label": "Screen" },
        h("div", { className: "sb-bar" },
          h("div", { className: "sb-screens", role: "tablist", "aria-label": "Screens" },
            project.screens.map(function (s) {
              return h("button", { key: s.id, type: "button", role: "tab", className: "sb-screen-tab", "aria-selected": s.id === screen.id, onClick: function () { goScreen(s.id); } }, s.name || "Untitled");
            }),
            h("div", { className: "sb-newwrap" },
              h("button", { type: "button", className: "sb-screen-tab sb-screen-tab--add", "aria-expanded": addOpen, onClick: function () { setAddOpen(!addOpen); } }, "+ Add screen"),
              addOpen ? h("div", { className: "pg-pop sb-tpl" },
                TEMPLATE_ORDER.map(function (k) {
                  return h("button", { key: k, type: "button", onClick: function () { addScreen(k); } }, h("strong", null, TEMPLATES[k].label), h("span", null, TEMPLATES[k].blurb));
                })) : null))),
        h("div", { className: "sb-bar sb-bar--tools" },
          h("div", { className: "sb-tools sb-tools--inline" },
            h("button", { type: "button", onClick: undo, disabled: !canUndo, title: "Undo (⌘Z)" }, "Undo"),
            h("button", { type: "button", onClick: redo, disabled: !canRedo, title: "Redo (⇧⌘Z)" }, "Redo")),
          h("div", { className: "pg-seg", role: "group", "aria-label": "Device" },
            Object.keys(DEVICES).map(function (k) { return h("button", { key: k, type: "button", "aria-pressed": device === k, title: DEVICES[k].range, onClick: function () { setDevice(k); } }, DEVICES[k].label); })),
          h("span", { className: "sb-size" }, dev.range),
          h("div", { className: "pg-seg", role: "group", "aria-label": "Mode" },
            h("button", { type: "button", "aria-pressed": mode === "edit", onClick: function () { setMode("edit"); } }, "Edit"),
            h("button", { type: "button", "aria-pressed": mode === "preview", onClick: function () { setMode("preview"); setSel(null); setEditing(null); setTab("canvas"); } }, "Preview"),
            h("button", { type: "button", ref: keysBtnRef, "aria-pressed": mode === "keys", title: "Move focus through the screen with Tab, like a keyboard user",
              onClick: function () { setMode("keys"); setSel(null); setEditing(null); setTab("canvas"); } }, "Keyboard"))),
        mode === "keys" && tab === "canvas" ? keysBar() : null,
        h("div", { className: "pg-tabs", role: "tablist" },
          h("button", { role: "tab", type: "button", "aria-selected": tab === "canvas", onClick: function () { setTab("canvas"); } }, "Canvas"),
          h("button", { role: "tab", type: "button", "aria-selected": tab === "code", onClick: function () { setTab("code"); setMode("edit"); } }, "Code")),
        tab === "canvas"
          ? h("div", { className: "sb-canvas", ref: canvasRef, onClickCapture: onCanvasClick, onDoubleClick: onCanvasDbl, onMouseOver: onHover,
              onMouseLeave: function () { if (hoverRef.current) hoverRef.current.classList.remove("is-hover"); hoverRef.current = null; },
              onDragStart: onDragStart, onDragOver: onDragOver, onDrop: onDrop, onDragEnd: endDrag,
              onDragLeave: function (e) { if (!canvasRef.current.contains(e.relatedTarget)) setDrop(null); } },
              h("div", { className: "sb-fit", style: { width: dev.w * scale, height: screenH * scale } },
                h("div", { className: "sb-screen", ref: screenRef, style: { width: dev.w, minHeight: dev.h, transform: scale < 1 ? "scale(" + scale + ")" : undefined, "--sb-scale": scale } },
                  renderNode(screen.root, null, ctx),
                  mode === "keys" && showOrder ? h("div", { className: "sb-order", "aria-hidden": "true" }, kbd.list.map(function (it, i) {
                    return h("span", { key: i, className: "sb-order__n" + (i === kbd.at ? " is-current" : ""), style: { left: it.x, top: it.y } }, i + 1);
                  })) : null)),
              mode === "preview" ? h("p", { className: "sb-hint sb-hint--canvas" }, "Preview: components work as they would in the product, and linked items go to their screen.") : null)
          : h("div", { className: "pg-code" }, h("button", { type: "button", className: "pg-copy", onClick: function () { copyText(code, "Code copied"); } }, "Copy"), h("pre", null, h("code", null, code)))),
      h("aside", { className: "pg-controls sb-right", "aria-label": "Properties" }, inspector(),
        mode === "edit" ? h(CommandBar, { screen: screen, selId: selId, onAdd: addFromCommand }) : null),
      dropLine(),
      toast ? h("div", { className: "sb-toast", role: "status" }, toast) : null);
  }

  ReactDOM.createRoot(document.getElementById("builder")).render(h(App));
})();

// Builder panels: show the thin scrollbar only while scrolling.
(function () {
  document.addEventListener("scroll", function (e) {
    var el = e.target;
    if (!el.classList || !el.matches(".sb-left, .sb-canvas")) return;
    el.classList.add("is-scrolling");
    clearTimeout(el._sbt);
    el._sbt = setTimeout(function () { el.classList.remove("is-scrolling"); }, 800);
  }, true);
})();
