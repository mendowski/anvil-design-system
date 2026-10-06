# Illustration

Illustration is the frame for Anvil artwork: a spot illustration for small moments and way-finding, or a hero illustration for onboarding and big moments.

## Types

- **Spot** (`type="spot"`, default): 72px. Use it at small scale in a larger layout, such as a card, an empty state or a success message, where it speaks to one point.
  - `placement="round"` (default) is a circle.
  - `placement="fill"` is a square.
- **Hero** (`type="hero"`): full width at 2:1 (320 × 160 in Figma). Use it for stories that combine people and objects, mostly in onboarding flows and overlays.
  - `placement="fill"` (default) has square corners.
  - `placement="round"` uses `radius-150`.

## Backgrounds

| Type | Backgrounds |
| --- | --- |
| Spot | `purple`, `purple-subdued` (default), `aqua`, `aqua-subdued`, `green`, `green-subdued`, `berry`, `berry-subdued`, `neutral-0` to `neutral-3`, or `none` |
| Hero | the `-subdued` colors and `neutral-0` to `neutral-3`, or `none` (default) |

They map to the `illustration-spot-background-*` and `illustration-hero-background-*` color tokens. Pick a background that contrasts with the artwork's main color. Subdued backgrounds suit most art; the full-strength spot colors are for bold moments such as celebrations.

## Artwork

- Pass `name` to use Anvil artwork, such as `name="celebration"` or, for a hero, `name="anytime"`. The names match the Spot illustrations and Hero illustrations assets.
- Or pass `src` for any image, or inline SVG as children.
- Until artwork is added, a placeholder icon shows (`icon` changes it).
- Artwork keeps its own colors. Don't recolor illustrations.

## Accessibility

- Most illustrations are decorative: leave `alt` empty so screen readers skip them.
- When the art carries meaning that the text around it doesn't, describe it in `alt`.

## Artwork available

- 76 spot illustrations at 72 × 72, and 68 hero illustrations at 320 × 160. They were exported from the illustration library and live in Assets.
