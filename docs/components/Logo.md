# Logo

The Teladoc Health logo, from the Anvil "Logos and marks" page in Figma. Use it in headers, footers and sign-in screens.

## Usage

```jsx
<Logo />                      // 40px tall, accessible name "Teladoc Health"
<Logo height={32} />
<Logo layout="care-by" />
<a href="/" aria-label="Teladoc Health home"><Logo decorative /></a>
```

- **Size:** set `height`; the width follows the artwork's 193:64 proportions. Use 40px in the desktop header and at least 24px anywhere else.
- **Color:** the logo isn't recolored by hand. The wordmark uses `logo-type-plum` and HEALTH plus the "o" ring use `logo-type-aqua`, so it's full color in light themes and white in dark themes.
- **Clear space:** keep at least the height of the "o" ring empty on every side.
- **Accessibility:** the logo has the accessible name "Teladoc Health". Inside a link that already has a label, pass `decorative` so it isn't read twice.
- **In GlobalHeader:** the header shows this logo by default.

## Layouts

| `layout` | Use it for |
| --- | --- |
| `default` | The Teladoc Health logo on its own. |
| `care-by` | "Care by Teladoc Health", for partner and co-branded experiences where Teladoc Health provides the care. |
| `powered-by` | "Powered by Teladoc Health", where a partner's product runs on Teladoc Health. |
| `pavers` | The logo with the paver mark, for brand moments such as covers and splash screens. |

The accessible name follows the layout, such as "Care by Teladoc Health". In the Pavers layout the pavers use the `logo-paver-*` tokens; the plum paver turns white in dark themes.

## Differences from Figma

- Figma swaps light and dark through a hidden utility component; here the colors come from tokens, so every layout follows the page theme.
- The light and dark mode SVGs for every layout are in Assets under Logos.
