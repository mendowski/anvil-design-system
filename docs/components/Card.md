# Card

Cards group related content, such as text, media and actions, into one container. They can be arranged in stacks, columns or grids.

## Anatomy

- **Container:** `background-surface`, a 1px `stroke-base` border and `radius-150` corners.
- **Image** (`image`): optional, one of three types.
  - `hero`: a full-width 2:1 image on top.
  - `spot` or `avatar`: a circle that bleeds off the top-right corner.
  - Pass `{ type, src, alt }` for a photo, or `{ type, node }` for an illustration.
- **Header:** optional `eyebrow` (12/20) and `header` (20/26 semibold on desktop, 18/24 on mobile). `headerAction` puts a control, such as an icon button, on the right.
- **Main content** (children): body text at 16/26, with 12px (`space-150`) between blocks.
- **Footer** (`footer`): buttons.
  - Default: buttons sit in a row.
  - `footerStyle="filled"`: stacks them on a `background-subdued` band.
- **Spacing:** 24px (`padding-300`) on every side.

## Responsive

The card reacts to its own width, not the window's. Under 480px:

- Footer buttons stack and fill the width.
- The header drops to 18/24.
- Spot and avatar circles shrink.

## Usage

- Use no more than one primary button per card.
- Keep the header short. The body can wrap.
- Spot and avatar images need room: the header and first body block get extra right padding automatically.

## Accessibility

- Cards render as `<section>`. Set `headerAs` to keep the heading levels in order on the page (the default is `h3`).
- Images need `alt` text unless they're decorative.
