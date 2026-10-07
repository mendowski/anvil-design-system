// Anvil Playground: pick a component, change its props with the controls, copy the code.
(function () {
  var h = React.createElement;
  var A = window.Anvil;
  var noop = function () {};
  var ICONS = (A.Icon.names || []).slice().sort();
  var SPOT = A.Illustration.names.spot.slice().sort();
  var HERO = A.Illustration.names.hero.slice().sort();

  // ---------- control helpers
  function text(label, def, opts) { return Object.assign({ type: "text", label: label, def: def }, opts); }
  function area(label, def) { return { type: "area", label: label, def: def }; }
  function sel(label, options, def, opts) { return Object.assign({ type: "select", label: label, options: options, def: def }, opts); }
  function bool(label, def, opts) { return Object.assign({ type: "bool", label: label, def: !!def }, opts); }
  function num(label, def, min, max, step, opts) { return Object.assign({ type: "number", label: label, def: def, min: min, max: max, step: step || 1 }, opts); }
  function icon(label, def, opts) { return Object.assign({ type: "icon", label: label, def: def }, opts); }
  function illo(label, def, kindKey, opts) { return Object.assign({ type: "illo", label: label, def: def, kind: kindKey }, opts); }
  var none = function (v) { return v && v !== "none" ? v : undefined; };

  // ---------- stories: controls + how they turn into props
  var STORIES = {
    Button: {
      blurb: "Buttons start actions, in three levels of emphasis.",
      controls: {
        children: text("Label", "Schedule a visit"),
        variant: sel("Variant", ["primary", "secondary", "tertiary"], "primary"),
        icon: sel("Icon position", ["none", "left", "right"], "left"),
        iconName: icon("Icon", "calendar", { when: function (a) { return a.icon !== "none"; } }),
        destructive: bool("Destructive", false),
        size: sel("Size", ["default", "small"], "default", { when: function (a) { return a.variant === "tertiary"; }, note: "Tertiary only" }),
        loading: bool("Loading", false),
        disabled: bool("Disabled", false),
        state: sel("Force state", ["none", "hover", "focus", "pressed"], "none")
      },
      props: function (a) {
        return { variant: a.variant, icon: a.icon, iconName: a.icon !== "none" ? a.iconName : undefined, destructive: a.destructive || undefined,
          size: a.variant === "tertiary" && a.size !== "default" ? a.size : undefined, loading: a.loading || undefined, disabled: a.disabled || undefined,
          state: none(a.state), children: a.children };
      }
    },
    Card: {
      blurb: "Cards group related content and actions. Resize the canvas to see the mobile layout under 480px.",
      canvas: { maxWidth: 560 },
      controls: {
        eyebrow: text("Eyebrow", "Next step"),
        header: text("Header", "Your next dose"),
        body: area("Content", "Wednesday, Oct 8. Log your weight before you inject."),
        imageType: sel("Image", ["none", "hero", "spot", "avatar"], "hero"),
        heroName: illo("Hero illustration", "anytime", "hero", { when: function (a) { return a.imageType === "hero"; } }),
        spotName: illo("Spot illustration", "celebration", "spot", { when: function (a) { return a.imageType === "spot" || a.imageType === "avatar"; } }),
        headerAction: bool("More-options button", false),
        primary: text("Primary button", "Log weight"),
        secondary: text("Second button", "Remind me later"),
        secondaryVariant: sel("Second button style", ["secondary", "tertiary"], "tertiary", { when: function (a) { return !!a.secondary; } }),
        footerStyle: sel("Footer style", ["default", "filled"], "default")
      },
      props: function (a) {
        var image;
        if (a.imageType === "hero") image = { type: "hero", src: A.Illustration.url("hero", a.heroName) };
        else if (a.imageType !== "none") image = { type: a.imageType, src: A.Illustration.url("spot", a.spotName) };
        var footer = [];
        if (a.primary) footer.push(h(A.Button, { key: "p" }, a.primary));
        if (a.secondary) footer.push(h(A.Button, { key: "s", variant: a.secondaryVariant }, a.secondary));
        return { eyebrow: a.eyebrow || undefined, header: a.header || undefined, image: image,
          headerAction: a.headerAction ? h(A.IconButton, { icon: "ellipsis", label: "More options", className: "anvil-icon-btn--brand" }) : undefined,
          children: a.body ? h("p", null, a.body) : undefined, footer: footer.length ? footer : undefined,
          footerStyle: a.footerStyle !== "default" ? a.footerStyle : undefined };
      },
      code: function (a) {
        var img = a.imageType === "none" ? null : a.imageType === "hero"
          ? '{ type: "hero", src: Anvil.Illustration.url("hero", "' + a.heroName + '") }'
          : '{ type: "' + a.imageType + '", src: Anvil.Illustration.url("spot", "' + a.spotName + '") }';
        var lines = ["<Card"];
        if (a.eyebrow) lines.push('  eyebrow="' + a.eyebrow + '"');
        if (a.header) lines.push('  header="' + a.header + '"');
        if (img) lines.push("  image={" + img + "}");
        if (a.headerAction) lines.push('  headerAction={<IconButton icon="ellipsis" label="More options" />}');
        if (a.footerStyle !== "default") lines.push('  footerStyle="' + a.footerStyle + '"');
        var btns = [];
        if (a.primary) btns.push("<Button>" + a.primary + "</Button>");
        if (a.secondary) btns.push('<Button variant="' + a.secondaryVariant + '">' + a.secondary + "</Button>");
        if (btns.length) lines.push("  footer={<>" + btns.join("") + "</>}");
        lines.push(">");
        if (a.body) lines.push("  <p>" + a.body + "</p>");
        lines.push("</Card>");
        return lines.join("\n");
      }
    },
    TextInput: {
      blurb: "Text input lets people enter a single line of text.",
      canvas: { maxWidth: 440 },
      controls: {
        label: text("Label", "Weight"), helper: text("Helper", "Use your morning weight."),
        placeholder: text("Placeholder", "0"), defaultValue: text("Value", ""),
        unit: text("Unit", "lbs"), unitPosition: sel("Unit position", ["after", "before"], "after", { when: function (a) { return !!a.unit; } }),
        icon: icon("Leading icon", "none", { allowNone: true }),
        status: sel("Status", ["none", "warning", "error"], "none"),
        message: text("Message", "Enter a weight between 50 and 700 lbs.", { when: function (a) { return a.status !== "none"; } }),
        disabled: bool("Disabled", false), readOnly: bool("Read only", false),
        state: sel("Force state", ["none", "hover", "focus"], "none")
      },
      props: function (a) {
        return { label: a.label, helper: a.helper || undefined, placeholder: a.placeholder || undefined, defaultValue: a.defaultValue || undefined,
          unit: a.unit || undefined, unitPosition: a.unit && a.unitPosition !== "after" ? a.unitPosition : undefined, icon: none(a.icon),
          status: none(a.status), message: a.status !== "none" ? a.message : undefined, disabled: a.disabled || undefined,
          readOnly: a.readOnly || undefined, state: none(a.state) };
      },
      key: function (a) { return a.defaultValue; }
    },
    PasswordInput: {
      blurb: "Password input for signing in and creating a password.",
      canvas: { maxWidth: 440 },
      controls: {
        label: text("Label", "Password"), mode: sel("Mode", ["sign-in", "create"], "create"),
        helper: text("Helper", ""), status: sel("Status", ["none", "error"], "none"),
        message: text("Message", "Enter your password.", { when: function (a) { return a.status !== "none"; } }),
        defaultVisible: bool("Start visible", false), disabled: bool("Disabled", false)
      },
      props: function (a) {
        return { label: a.label, mode: a.mode !== "sign-in" ? a.mode : undefined, helper: a.helper || undefined, status: none(a.status),
          message: a.status !== "none" ? a.message : undefined, defaultVisible: a.defaultVisible || undefined, disabled: a.disabled || undefined };
      },
      key: function (a) { return a.mode + a.defaultVisible; }
    },
    Checkbox: {
      blurb: "Checkboxes let people pick any number of options.",
      controls: {
        label: text("Label", "Send me appointment reminders"), defaultChecked: bool("Checked", true),
        error: bool("Error", false), disabled: bool("Disabled", false), readOnly: bool("Read only", false),
        state: sel("Force state", ["none", "hover", "focus"], "none")
      },
      props: function (a) {
        return { label: a.label, defaultChecked: a.defaultChecked || undefined, error: a.error || undefined, disabled: a.disabled || undefined,
          readOnly: a.readOnly || undefined, state: none(a.state) };
      },
      key: function (a) { return String(a.defaultChecked); }
    },
    SelectionCard: {
      blurb: "Selection cards are large, tappable choices with a title and description.",
      canvas: { maxWidth: 440 },
      controls: {
        type: sel("Type", ["radio", "checkbox"], "radio"), title: text("Title", "Video visit"),
        description: area("Description", "Talk with a provider from home, usually within 10 minutes."),
        defaultChecked: bool("Selected", true), error: bool("Error", false),
        message: text("Error message", "Choose a visit type.", { when: function (a) { return a.error; } }),
        disabled: bool("Disabled", false), state: sel("Force state", ["none", "hover", "focus"], "none")
      },
      props: function (a) {
        return { type: a.type !== "radio" ? a.type : undefined, title: a.title, description: a.description || undefined, name: "pg",
          defaultChecked: a.defaultChecked || undefined, error: a.error || undefined, message: a.error ? a.message : undefined,
          disabled: a.disabled || undefined, state: none(a.state) };
      },
      key: function (a) { return a.type + a.defaultChecked; }
    },
    Slider: {
      blurb: "Sliders pick a value or a range from a scale.",
      canvas: { maxWidth: 440 },
      controls: {
        label: text("Label", "Goal weight"), helper: text("Helper", ""),
        min: num("Min", 100, 0, 1000), max: num("Max", 300, 1, 1000), step: num("Step", 5, 1, 100),
        range: bool("Range (two handles)", false), direction: sel("Fill direction", ["ltr", "rtl"], "ltr"),
        suffix: text("Value suffix", " lbs"), showValue: bool("Show value", true), showRange: bool("Show min and max", true),
        disabled: bool("Disabled", false)
      },
      props: function (a) {
        var mid = Math.round((a.min + (a.max - a.min) / 2) / a.step) * a.step;
        return { label: a.label, helper: a.helper || undefined, min: a.min, max: a.max, step: a.step, range: a.range || undefined,
          direction: a.direction !== "ltr" ? a.direction : undefined,
          defaultValue: a.range ? [a.min + (a.max - a.min) / 4, a.max - (a.max - a.min) / 4].map(function (v) { return Math.round(v / a.step) * a.step; }) : mid,
          formatValue: a.suffix ? function (v) { return v + a.suffix; } : undefined,
          showValue: a.showValue, showRange: a.showRange, disabled: a.disabled || undefined };
      },
      key: function (a) { return [a.min, a.max, a.step, a.range].join(); },
      code: function (a) {
        var p = ['label="' + a.label + '"', "min={" + a.min + "}", "max={" + a.max + "}", "step={" + a.step + "}"];
        if (a.range) p.push("range");
        if (a.direction !== "ltr") p.push('direction="' + a.direction + '"');
        if (a.suffix) p.push('formatValue={v => v + "' + a.suffix + '"}');
        if (!a.showValue) p.push("showValue={false}");
        if (!a.showRange) p.push("showRange={false}");
        if (a.disabled) p.push("disabled");
        return "<Slider\n  " + p.join("\n  ") + "\n/>";
      }
    },
    GlobalHeader: {
      blurb: "The global header for signed-in pages, focused tasks and multi-step flows. The desktop layout is wide, so the canvas scrolls sideways.",
      canvas: { minWidth: function (a) { return a.layout === "desktop" ? 1080 : undefined; } },
      controls: {
        type: sel("Type", ["default", "focused", "progress"], "default"),
        logoHeight: num("Logo height", 40, 24, 64, 4, { when: function (a) { return a.type !== "progress"; } }),
        layout: sel("Layout", ["auto", "desktop", "mobile"], "desktop"),
        nav: text("Nav links (comma separated)", "Visits, Health log, Learning", { when: function (a) { return a.type === "default"; } }),
        current: num("Current nav link", 1, 0, 6, 1, { when: function (a) { return a.type === "default"; } }),
        cta: text("Button label", "Get care", { when: function (a) { return a.type === "default"; } }),
        language: text("Language", "English", { when: function (a) { return a.type === "default"; } }),
        title: text("Mobile title", "Book a visit", { when: function (a) { return a.type === "focused"; } }),
        steps: text("Steps (comma separated)", "Your health, Medications, Insurance, Review", { when: function (a) { return a.type === "progress"; } }),
        currentStep: num("Current step", 2, 1, 8, 1, { when: function (a) { return a.type === "progress"; } })
      },
      props: function (a) {
        var list = function (s) { return s.split(",").map(function (x) { return x.trim(); }).filter(Boolean); };
        var p = { type: a.type !== "default" ? a.type : undefined, layout: a.layout !== "auto" ? a.layout : undefined, logoHeight: a.logoHeight !== 40 ? a.logoHeight : undefined };
        if (a.type === "default") {
          p.nav = list(a.nav).map(function (l, i) { return { label: l, href: "#", current: i === a.current - 1 }; });
          p.utilities = [{ label: "Profile", icon: "profile", href: "#" }, { label: "Messages", icon: "mail", badge: 2, href: "#" }];
          p.language = a.language || undefined;
          p.cta = a.cta ? { label: a.cta } : undefined;
        } else {
          p.onBack = noop; p.onClose = noop;
          if (a.type === "focused") p.title = a.title;
          if (a.type === "progress") { p.steps = list(a.steps); p.currentStep = Math.min(a.currentStep, p.steps.length) - 1; }
        }
        return p;
      }
    },
    Logo: {
      blurb: "The Teladoc Health logo. It turns white in dark themes; try the Theme menu at the top.",
      controls: {
        height: num("Height", 64, 24, 160, 4),
        title: text("Accessible name", "Teladoc Health"),
        decorative: bool("Decorative (inside a labelled link)", false)
      },
      props: function (a) { return { height: a.height !== 40 ? a.height : undefined, title: a.title !== "Teladoc Health" && !a.decorative ? a.title : undefined, decorative: a.decorative || undefined }; }
    },
    Illustration: {
      blurb: "Spot and hero illustrations in their frames.",
      controls: {
        type: sel("Type", ["spot", "hero"], "spot"),
        spotName: illo("Spot illustration", "celebration", "spot", { when: function (a) { return a.type === "spot"; } }),
        heroName: illo("Hero illustration", "anytime", "hero", { when: function (a) { return a.type === "hero"; } }),
        spotBg: sel("Background", A.Illustration.backgrounds.spot.concat(["none"]), "purple-subdued", { when: function (a) { return a.type === "spot"; } }),
        heroBg: sel("Background", A.Illustration.backgrounds.hero.concat(["none"]), "purple-subdued", { when: function (a) { return a.type === "hero"; } }),
        placement: sel("Placement", ["round", "fill"], "round"),
        size: num("Size (spot)", 120, 32, 240, 8)
      },
      props: function (a) {
        if (a.type === "hero") return { type: "hero", name: a.heroName, background: a.heroBg, placement: a.placement, style: { maxWidth: 560 } };
        return { name: a.spotName, background: a.spotBg, placement: a.placement, size: a.size };
      }
    },
    Icon: {
      blurb: "Icons follow the text color and come in outline and filled styles.",
      controls: {
        name: icon("Icon", "heart-pulse"), variant: sel("Style", ["default", "active"], "default"),
        size: num("Size", 32, 12, 96, 4), color: sel("Color", ["inherit", "var(--icon-base)", "var(--brand-interactive-primary-base)", "var(--icon-status-success)", "var(--icon-status-critical)"], "inherit")
      },
      props: function (a) { return { name: a.name, variant: a.variant !== "default" ? a.variant : undefined, size: a.size, color: a.color !== "inherit" ? a.color : undefined }; }
    }
  };

  // ---------- JSX code generator (default)
  function jsx(name, p) {
    var attrs = [], kids = null;
    Object.keys(p).forEach(function (k) {
      var v = p[k];
      if (v === undefined || v === null) return;
      if (k === "children") { kids = typeof v === "string" ? v : null; return; }
      if (typeof v === "string") attrs.push(k + '="' + v + '"');
      else if (v === true) attrs.push(k);
      else if (typeof v === "number" || typeof v === "boolean") attrs.push(k + "={" + v + "}");
      else if (typeof v === "function") attrs.push(k + "={() => {}}");
      else attrs.push(k + "={" + JSON.stringify(v).replace(/"(\w+)":/g, "$1: ") + "}");
    });
    var open = "<" + name + (attrs.length ? (attrs.join(" ").length > 50 ? "\n  " + attrs.join("\n  ") + "\n" : " " + attrs.join(" ")) : "");
    return kids != null ? open + ">" + kids + "</" + name + ">" : open + (attrs.join(" ").length > 50 ? "/>" : " />");
  }

  // ---------- UI
  function defaults(story) { var a = {}; Object.keys(story.controls).forEach(function (k) { a[k] = story.controls[k].def; }); return a; }
  var names = Object.keys(STORIES);
  function fromHash() { var n = location.hash.slice(1); return STORIES[n] ? n : "Button"; }

  function Field(props) {
    var c = props.c, v = props.value, set = props.set, id = "pg-" + props.k;
    var input;
    if (c.type === "text") input = h("input", { id: id, type: "text", value: v, onChange: function (e) { set(e.target.value); } });
    else if (c.type === "area") input = h("textarea", { id: id, rows: 3, value: v, onChange: function (e) { set(e.target.value); } });
    else if (c.type === "number") input = h("input", { id: id, type: "number", value: v, min: c.min, max: c.max, step: c.step, onChange: function (e) { var n = Number(e.target.value); if (!isNaN(n)) set(n); } });
    else if (c.type === "bool") input = h("button", { id: id, type: "button", role: "switch", "aria-checked": v ? "true" : "false", className: "pg-switch", onClick: function () { set(!v); } }, h("span", null));
    else if (c.type === "select") input = h("select", { id: id, value: v, onChange: function (e) { set(e.target.value); } }, c.options.map(function (o) { return h("option", { key: o, value: o }, o); }));
    else if (c.type === "icon") input = h(IconPicker, { id: id, value: v, set: set, allowNone: c.allowNone });
    else if (c.type === "illo") input = h(IlloPicker, { id: id, value: v, set: set, kind: c.kind });
    return h("div", { className: "pg-field pg-field--" + c.type },
      h("label", { htmlFor: id }, c.label, c.note ? h("small", null, c.note) : null), input);
  }

  function IconPicker(p) {
    var st = React.useState(false), open = st[0], setOpen = st[1];
    var qs = React.useState(""), q = qs[0], setQ = qs[1];
    var list = ICONS.filter(function (n) { return !q || n.indexOf(q.toLowerCase()) >= 0; });
    return h("div", { className: "pg-picker" },
      h("button", { id: p.id, type: "button", className: "pg-picker__btn", "aria-expanded": open, onClick: function () { setOpen(!open); } },
        p.value && p.value !== "none" ? h(A.Icon, { name: p.value, size: 16 }) : null, h("span", null, p.value), h("span", { className: "pg-caret", "aria-hidden": true })),
      open ? h("div", { className: "pg-pop" },
        h("input", { type: "search", placeholder: "Search " + ICONS.length + " icons", value: q, autoFocus: true, "aria-label": "Search icons", onChange: function (e) { setQ(e.target.value); } }),
        h("div", { className: "pg-grid pg-grid--icons" },
          (p.allowNone ? [h("button", { key: "none", type: "button", className: "pg-cell" + (p.value === "none" ? " is-on" : ""), title: "No icon", onClick: function () { p.set("none"); setOpen(false); } }, "None")] : []).concat(
          list.map(function (n) {
            return h("button", { key: n, type: "button", title: n, "aria-label": n, className: "pg-cell" + (n === p.value ? " is-on" : ""), onClick: function () { p.set(n); setOpen(false); } }, h(A.Icon, { name: n, size: 20 }));
          })))) : null);
  }

  function IlloPicker(p) {
    var st = React.useState(false), open = st[0], setOpen = st[1];
    var qs = React.useState(""), q = qs[0], setQ = qs[1];
    var all = p.kind === "hero" ? HERO : SPOT;
    var list = all.filter(function (n) { return !q || n.indexOf(q.toLowerCase()) >= 0; });
    return h("div", { className: "pg-picker" },
      h("button", { id: p.id, type: "button", className: "pg-picker__btn", "aria-expanded": open, onClick: function () { setOpen(!open); } },
        h("img", { src: A.Illustration.url(p.kind, p.value), alt: "", className: "pg-thumb pg-thumb--" + p.kind }), h("span", null, p.value), h("span", { className: "pg-caret", "aria-hidden": true })),
      open ? h("div", { className: "pg-pop" },
        h("input", { type: "search", placeholder: "Search " + all.length + " illustrations", value: q, autoFocus: true, "aria-label": "Search illustrations", onChange: function (e) { setQ(e.target.value); } }),
        h("div", { className: "pg-grid pg-grid--" + p.kind },
          list.map(function (n) {
            return h("button", { key: n, type: "button", title: n, "aria-label": n, className: "pg-cell" + (n === p.value ? " is-on" : ""), onClick: function () { p.set(n); setOpen(false); } },
              h("img", { src: A.Illustration.url(p.kind, n), alt: "", loading: "lazy" }));
          }))) : null);
  }

  function App() {
    var ns = React.useState(fromHash()), name = ns[0], setName = ns[1];
    var story = STORIES[name];
    var as = React.useState(function () { return defaults(story); }), args = as[0], setArgs = as[1];
    var ws = React.useState("full"), width = ws[0], setWidth = ws[1];
    var ts = React.useState("canvas"), tab = ts[0], setTab = ts[1];
    var cs = React.useState(false), copied = cs[0], setCopied = cs[1];

    React.useEffect(function () {
      function on() { var n = fromHash(); setName(n); setArgs(defaults(STORIES[n])); setWidth("full"); }
      window.addEventListener("hashchange", on);
      return function () { window.removeEventListener("hashchange", on); };
    }, []);

    var props = story.props(args);
    var code = story.code ? story.code(args) : jsx(name, props);
    var widths = { full: "100%", "768": "768px", "375": "375px" };
    var canvasStyle = { width: widths[width] };
    var inner = { maxWidth: story.canvas && story.canvas.maxWidth && width === "full" ? story.canvas.maxWidth : undefined,
      minWidth: story.canvas && story.canvas.minWidth ? story.canvas.minWidth(args) : undefined };
    if (inner.minWidth) canvasStyle = { width: "auto", maxWidth: "none" };

    function setArg(k, v) { setArgs(function (o) { var n = Object.assign({}, o); n[k] = v; return n; }); }
    function copy() {
      var done = function () { setCopied(true); setTimeout(function () { setCopied(false); }, 1400); };
      try { navigator.clipboard.writeText(code).then(done, done); } catch (e) { done(); }
    }

    return h("div", { className: "pg" },
      h("nav", { className: "pg-list", "aria-label": "Components" },
        h("p", { className: "eyebrow" }, "Components"),
        names.map(function (n) { return h("a", { key: n, href: "#" + n, "aria-current": n === name ? "page" : undefined }, n.replace(/(?!^)([A-Z])/g, " $1")); })),
      h("section", { className: "pg-stage", "aria-label": "Preview" },
        h("div", { className: "pg-stage__bar" },
          h("div", null, h("h1", { className: "pg-title" }, name.replace(/(?!^)([A-Z])/g, " $1")), h("p", { className: "pg-blurb" }, story.blurb)),
          h("div", { className: "pg-seg", role: "group", "aria-label": "Canvas width" },
            [["full", "Fluid"], ["768", "Tablet"], ["375", "Mobile"]].map(function (w) {
              return h("button", { key: w[0], type: "button", "aria-pressed": width === w[0], onClick: function () { setWidth(w[0]); } }, w[1]);
            }))),
        h("div", { className: "pg-tabs", role: "tablist" },
          h("button", { role: "tab", type: "button", "aria-selected": tab === "canvas", onClick: function () { setTab("canvas"); } }, "Canvas"),
          h("button", { role: "tab", type: "button", "aria-selected": tab === "code", onClick: function () { setTab("code"); } }, "Code")),
        tab === "canvas"
          ? h("div", { className: inner.minWidth ? "pg-canvas pg-canvas--wide" : "pg-canvas" }, h("div", { className: "pg-frame", style: canvasStyle },
              h("div", { className: "pg-frame__inner", style: inner },
                h(A[name], Object.assign({ key: story.key ? story.key(args) : "k" }, props)))))
          : h("div", { className: "pg-code" }, h("button", { type: "button", className: "pg-copy", onClick: copy }, copied ? "Copied" : "Copy"), h("pre", null, h("code", null, code)))),
      h("aside", { className: "pg-controls", "aria-label": "Controls" },
        h("div", { className: "pg-controls__head" }, h("h2", null, "Controls"),
          h("button", { type: "button", className: "pg-reset", onClick: function () { setArgs(defaults(story)); } }, "Reset")),
        Object.keys(story.controls).map(function (k) {
          var c = story.controls[k];
          if (c.when && !c.when(args)) return null;
          return h(Field, { key: name + k, k: k, c: c, value: args[k], set: function (v) { setArg(k, v); } });
        })));
  }

  ReactDOM.createRoot(document.getElementById("playground")).render(h(App));
})();
