# Notes for Claude: Pulse / Anvil design system site

This repo is Aida's portfolio rebuild of the Pulse design system (later renamed Anvil), which she co-built at Teladoc Health. It's a static site on GitHub Pages: https://mendowski.github.io/anvil-design-system/

There's no build step. Pages are hand-written HTML that load React 18 from cdnjs and the components from `dist/anvil.js`.

## Working with Aida

- She's a product designer. Keep explanations short and plain, and show her the result (a screenshot or a local preview) before calling something done.
- **Don't commit or push.** She reviews and pushes from GitHub Desktop herself.
- Change only what she asked for. If something else looks off, mention it instead of fixing it.
- If she doesn't like a change, revert it exactly: `git show HEAD:<file> > <file>` for edited files, and delete files that are new.
- Never put large files in the repo. GitHub rejects files over 100MB. The full Pulse documentation PDF (about 200MB, 1,509 pages) lives outside the repo at `~/Documents/GitHub/Anvil Design System.pdf`. Use `pdftotext` on it for source content.

## Naming

- Visible text on the site says **Pulse**, for example "Button · Pulse" and "Pulse (later renamed Anvil)" in the footer.
- Code names stay **Anvil**: `Anvil.Button`, `anvil-` CSS classes, `anvil-tokens.css`, file names and the repo URL. `window.Pulse` and `window.Anvil` are the same object.

## Site structure

| Where | What |
| --- | --- |
| `index.html` | Overview (home) |
| `foundations.html` | Themes, color (with the color browser), typography, spacing, radius |
| `components.html` | Every component in collapsible groups, each with a live example and links to its guideline page |
| `button.html`, `card.html`, `text-input.html` and the like | Component guideline pages. They use `site/doc.css` and `site/doc.js` (Do/Don't tiles, captions and other helpers) |
| `playground.html` and `site/playground.js` | Live props playground. The groups are in `window.ANVIL_GROUPS` in `playground.html` |
| `builder.html`, `site/builder.js` and `site/builder.css` | Screen builder: build full screens and flows from components and layout blocks. It reuses the playground's component controls through `window.ANVIL_PLAYGROUND` (set in `site/playground.js`), so load `playground.js` before `builder.js` |
| `examples/<Component>.html` | Live example pages, shown in iframes on `components.html` |
| `docs/components/*.md`, `docs/assets/*.md` | Guideline text in Markdown |
| `site/site.css`, `site/site.js` | Shared site chrome: top bar, theme switcher, side menus, scrollbars, iframe sizing |
| `tokens/` | `tokens.json` and `anvil-tokens.css` (333 color tokens in 4 themes, scale, type styles) |
| `dist/` | `anvil.js` (components), `anvil.css`, `anvil.d.ts` (props) |
| `colors.html`, `datavis.html`, `assets.html` | Redirects only. Keep them so old links still work |

Top nav: Overview, Foundations, Components, Playground, Screen builder.

## Design rules she has chosen

- **Colors come only from Anvil tokens** (`var(--background-base)`, `var(--text-body-base)` and so on), so every page works in all four themes: `core-light`, `core-dark`, `pli-light` and `pli-dark` (`data-theme` on `<html>`). Check light and dark.
- **Component grouping**, used on Components, Playground and anywhere else components are listed:
  - Action
  - Form
  - Content display
  - Navigation and menus
  - Data viz
  - Icons and illustrations
  - Brand and media

  Components are **alphabetical within each group**.
- **Side menus:**
  - Group names are 14px semibold, in sentence case, with a purple collapse chevron.
  - Items are 14px and indented under their group, with no arrows.
  - Don't add uppercase eyebrow labels above menus.
- **Scrollbars:** 6px, subtle, and hidden until you hover or scroll. Never nest scrolling areas. An example iframe grows to fit its content, and only its wrapper scrolls.
- **Playground controls:** every input, select and picker is 40px tall, with the same chevron.
- Writing: sentence case and plain language.

## Cache busting

CSS, JS and iframe links carry `?v=YYYYMMDDx`. When you change a CSS or JS file, bump its `?v=` in every page that loads it. Otherwise browsers keep showing the old version.

## Previewing

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Before handing back:

- Check desktop at 1440px and a phone at 390px.
- Check light and dark themes.
- Check the browser console for errors.

## Adding a new section or page

1. Copy the closest existing page so the head, top bar, theme script, footer and `site.js` include all match. For example, use `button.html` for a component guideline page, or `foundations.html` for a page with a side menu.
2. Link it from the top nav or the right menu group on every page that lists it, in alphabetical order within its group.
3. Add a row to the table in `README.md`, and to this file if it changes the structure.
