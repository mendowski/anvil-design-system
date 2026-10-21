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

## Signed in or out, web or native

The Figma component has three properties besides type: **Platform** (Native, Web mobile, Web desktop), **Logged in** (Yes, No) and **Scrolled** (mobile only).

| | Default | Focused task | Progress tracker |
| --- | --- | --- | --- |
| Signed in, web | Desktop: logo, nav, utilities, language, CTA. Mobile: utility icons, language, CTA, **no logo** | Back, logo (mobile: page title), Close | Back, steps, Exit |
| Signed out, web | Logo, country, language (mobile too: this is the only mobile header with the logo) | Back, logo (mobile: page title), language | Back, steps (no Exit) |
| Signed in, native | Utility icons, CTA (no language) | Back, page title, Close | Back, step label, Close |
| Signed out, native | none | Back, page title | Back, step label |

- Set `loggedIn={false}` for signed-out pages. Nav, utilities and the CTA are hidden, `country` shows, and Close/Exit are removed.
- Set `platform="native"` for the iOS and Android apps. The language menu is removed.
- The logo appears on mobile only in the signed-out default header. Signed-in mobile headers use the space for utilities and the CTA.

## Scrolled

On mobile, pass `scrolled` once the page scrolls (for example, after 8px). The header gets shorter, icons and the CTA get smaller, count badges turn into dots, and the progress tracker keeps only "Step N of N". Desktop has no scrolled version.

## Progress value

`valueType="percentage"` swaps the step text for "NN% completed": on desktop the current step label sits on the left and the percentage on the right, and on mobile the percentage replaces "Step N of N".

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
- Not part of this component: the tab bar at the bottom of the app is GlobalFooter (Figma "Global-footer").
