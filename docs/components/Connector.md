# Connector

The Connector is a key Teladoc Health brand element, from the Figma "Teladoc-Health-connector" on the Logos and marks page. It can pair with the paver system, but use it purposefully.

## When to use it

- **To direct attention:** a subtle element that leads the eye to a message.
- **As a watermark:** a quiet brand reinforcement repeated across a multi-slide social post or a video.
- **To introduce app elements,** such as the icon on a push notification.

Don't use it as a logo replacement, a bullet, or decoration on every screen.

## Usage

```jsx
<Connector />                 // 64px, decorative
<Connector size={32} />
<Connector title="Teladoc Health" />   // when it stands alone and carries meaning
```

- **Size:** `size` sets the width and height; the mark is square. 64px is the Figma default.
- **Color and theme:** the halves use `logo-connector-plum` and `logo-connector-aqua`. In dark themes the plum half turns `#6C4DF4`, and the dark artwork is drawn slightly differently (slimmer halves), so the component switches shape as well as color. Force one with `mode="light"` or `mode="dark"`.
- **Accessibility:** it's decorative by default and hidden from screen readers. Pass `title` when the mark alone identifies the brand.

## Differences from Figma

- Figma swaps light and dark through a hidden utility component; here the component reads the page theme.
- The light and dark SVGs are in Assets under Logos.
