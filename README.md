# Anvil design system

Anvil (formerly Pulse) is the design system that brought Teladoc Health, Livongo and myStrength under one foundation for web, iOS and Android. This repo holds its tokens, React components and assets, rebuilt from the Anvil Figma library for interactive portfolio prototypes.

**Live site:** https://mendowski.github.io/anvil-design-system/ — overview, live components, colors, icons and illustrations.

## What's here

| File or folder | What it is |
| --- | --- |
| `index.html`, `components.html`, `colors.html`, `assets.html` | The design system site |
| `tokens/tokens.json` | Every token: 331 color tokens in four themes plus 109 primitives, scale (space, form input, layout, spacing, radius), shadows and 30 text styles |
| `tokens/anvil-tokens.css` | The same tokens as CSS custom properties, theme blocks, `@font-face` rules and a class per text style |
| `dist/anvil.js` | The React components as one script. It sets `window.Anvil` |
| `dist/anvil.css` | Component styles |
| `dist/anvil.d.ts` | Component props, for reference |
| `fonts/` | Reckless Neue Bold and Effra Italic. Lexend Deca loads from Google Fonts |
| `assets/icons/` | 339 SVG icons (default and `-active` versions) |
| `assets/illustrations/` | 76 spot and 68 hero illustrations as SVG |
| `examples/` | One live example page per component |
| `docs/` | Guidelines for each component and asset group |

## Use it in a prototype

Add this to the `<head>` of an HTML page. `BASE` is `https://mendowski.github.io/anvil-design-system`, or a relative path when the prototype lives in this repo.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;500;600;700&display=swap">
<link rel="stylesheet" href="BASE/tokens/anvil-tokens.css">
<link rel="stylesheet" href="BASE/dist/anvil.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script src="BASE/dist/anvil.js"></script>
```

Then render components:

```html
<html data-theme="core-light">
...
<div id="app"></div>
<script>
  const h = React.createElement;
  ReactDOM.createRoot(document.getElementById("app")).render(
    h(Anvil.Button, { variant: "primary" }, "Schedule a visit")
  );
</script>
```

## Themes

Set `data-theme` on `<html>` to `core-light` (the default), `core-dark`, `pli-light` or `pli-dark`. Every color token switches with it.

## Components

Button, TextInput, PasswordInput, Checkbox (with CheckboxGroup), SelectionCard, Slider, Card, GlobalHeader, Illustration and Icon. Each one's guidelines are in `docs/components/`.

`Anvil.Illustration` loads its artwork from `assets/illustrations/`, found from where `anvil.js` is loaded. If you move `dist/` away from `assets/`, set `window.ANVIL_ASSET_BASE = "https://mendowski.github.io/anvil-design-system/assets/"` before loading `anvil.js`.

## Source

Built from the Anvil Components Figma file and its linked color and illustration libraries, exported with a custom Figma plugin. The working copy of this design system is a Claude design system artifact; this repo is a snapshot of it.
