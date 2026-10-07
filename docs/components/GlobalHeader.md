# GlobalHeader

Global header is the top bar of every screen: main navigation in the app, a focused header for single tasks, and a progress tracker for multi-step flows.

## Types

- **Default** (`type="default"`): logo, main `nav`, `utilities` (icon + label, with optional `badge`), `language`, and a primary `cta`.
  - Desktop: 76px tall, content up to 1280px wide.
  - Mobile: icon buttons and the CTA.
- **Focused task** (`type="focused"`): Back, the logo (or the page `title` on mobile) and Close. Use it when people should finish one task without wandering off.
- **Progress tracker** (`type="progress"`): Back, the `steps` with the `currentStep` in bold, a 4px progress bar in `progress-tracker-active`, and Exit.
  - On mobile: the current step label and "Step N of N".
  - Pass `progress` (0 to 1) to set the fill yourself.

## Responsive

The header reacts to its own width. Under 768px it switches to the mobile layout. `layout="desktop"` or `"mobile"` forces one.

## Nav items

| State | Look |
| --- | --- |
| Default | `navigation-text-default`, transparent. |
| Hover | `navigation-background-hover` fill, `navigation-text-hover`. |
| Focus | Hover plus `focus-ring`. |
| Current | `navigation-background-hover` fill, `navigation-text-current` semibold, filled icon, `aria-current="page"`. |

## Badges

- `badge: 2` shows a count in `background-status-critical-base`.
- `badge: true` shows an 8px dot.
- Screen readers hear the count as part of the label, such as "Messages, 2 new".

## Logo

- By default the header shows the Teladoc Health logo (`Anvil.Logo`) at 40px tall, linking to `href` with the accessible name "Teladoc Health home". Change the name with `label`.
- To use a different logo, pass it as `logo` (an `<img>`, an SVG or another component).

## Accessibility

- It renders as `<header>`, and the main links are in a `<nav>` labelled "Main".
- Mobile icon buttons are 44px with labels.
- Hide Back or Close by passing `onBack={null}` or `onClose={null}`.
