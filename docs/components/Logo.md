# Logo

The Teladoc Health logo, from the Anvil "Logos and marks" page in Figma. Use it in headers, footers and sign-in screens.

## Usage

```jsx
<Logo />                      // 40px tall, accessible name "Teladoc Health"
<Logo height={32} />
<a href="/" aria-label="Teladoc Health home"><Logo decorative /></a>
```

- **Size:** set `height`; the width follows the artwork's 193:64 proportions. Use 40px in the desktop header and at least 24px anywhere else.
- **Color:** the logo isn't recolored by hand. The wordmark uses `logo-type-plum` and HEALTH plus the "o" ring use `logo-type-aqua`, so it's full color in light themes and white in dark themes.
- **Clear space:** keep at least the height of the "o" ring empty on every side.
- **Accessibility:** the logo has the accessible name "Teladoc Health". Inside a link that already has a label, pass `decorative` so it isn't read twice.
- **In GlobalHeader:** the header shows this logo by default.

## Differences from Figma

- Only the Default layout is here. The Care by, Powered by and Pavers layouts weren't exported as artwork.
- The light and dark mode SVGs are in Assets under Logos.
