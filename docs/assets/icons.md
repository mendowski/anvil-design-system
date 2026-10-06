# Icons

Icons are the 172 glyphs from the Anvil Figma Icons page. They're drawn on a 16px grid. Each one is here as an SVG file: `name.svg` is the default (outline) style and `name-active.svg` the filled style.

## Using icons in code

- Render one with `<Anvil.Icon name="calendar" />`. The component draws the same artwork inline, so it follows the text color. `Anvil.Icon.names` lists every name.
- Names are the Figma names in lowercase with hyphens: `Health-insights` is `health-insights`, and `Camera_AI` is `camera-ai`.
- **Size:** 16px is the default and matches the Figma components. Use 24px for standalone navigation or empty-state icons. Stick to multiples of 8 so the strokes stay crisp.
- **Color:** icons use `currentColor`, so they take the text color around them. Inside a Button they follow its state colors automatically. For a standalone icon, use `icon-base` and the other `icon-*` tokens.
- **Card logos** (`card-visa`, `card-mastercard`, `card-american-express`, `card-unknown`, `card-cvc`, `card-empty`) keep their own colors and are wider than tall (28 × 18).

## Default and active

Most icons have two variants. Use `default` (outline) normally, and `active` (filled) to show a selected state, such as the current tab in navigation. `sort` has `default`, `up` and `down`.

## Accessibility

- Icons next to a text label are decorative and hidden from screen readers, which is the default.
- An icon that stands alone as a control needs a `title`, such as `<Icon name="close" title="Close" />`. Better still, put it inside a button that has an accessible label.
- Don't rely on an icon alone to convey status. Pair status icons (`alert`, `error`, `check-circle`) with text.

## Categories

- **Health:** blood-sugar, blood-pressure, glucose, weight, steps, heart-pulse, medicine, stethoscope, lab, behavioral-health, primary-care, body-composition, sleep
- **Care and visits:** calendar, past-visits, video, phone, chat, headset, doctor-bag, insurance, emergency-contact
- **Mood:** mood-joy, mood-happy, mood-neutral, mood-unhappy, mood-terrible
- **Actions:** plus, edit, trash, copy, share, download, upload, search, filter, close
- **Navigation:** arrow-*, line-arrow-*, caret-down, menu, home, external-link
- **Status:** alert, alert-triangle, error, info, check, check-circle

## The SVG files

- The files here use a single ink, `icon-base` (#0F1213). In code, prefer `Anvil.Icon`, which uses `currentColor` instead so icons take the color of the text around them.
- Card logos keep their brand colors.
- `wifi` has `-connected` and `-disconnected` files, and `sort` has `-up` and `-down`.
