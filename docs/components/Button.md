# Button

Buttons start actions, in three levels of emphasis: primary, secondary and tertiary, each with a destructive version.

## Choosing a variant

- **Primary** marks the most important action on a page. Use one per view where you can.
- **Secondary** is for important actions that sit alongside a primary one, like "Continue" and "Cancel" in a confirmation modal. Also use it when many actions on a screen have the same priority.
- **Tertiary** looks like a text link but is a standalone action, not a link inside a block of copy. Use it for lower-priority actions. It's the only variant with a small size.
- **Destructive** (`destructive`) is for actions that delete data or can't be undone. Pair a destructive primary button with a plain secondary "Cancel".

## States

| State | What changes |
| --- | --- |
| Hover | Primary turns to a light tint (`button-primary-background-hover`) with dark text. Secondary fills with the tint and darkens its outline. Tertiary underlines. |
| Focus | Same as hover, plus the `focus-ring` shadow: a 2px white gap and a 4px purple halo. Tertiary gets a white background and the wider `focus-ring-tertiary`. Shown only for keyboard focus (`:focus-visible`). |
| Pressed | Primary fills with `button-primary-background-pressed`. Secondary and tertiary darken their text and outline. |
| Disabled | Every variant goes to `background-disabled` with `text-body-disabled` text. Tertiary keeps a transparent background. |
| Loading | Looks disabled, adds a spinner and sets `aria-busy`. The spinner replaces the icon, or sits on the right when there's no icon. |

## Layout

- **Shape:** primary and secondary are pills (`radius-200`).
- **Desktop size:** `button-min-height` 48px, with `button-vertical-padding` 14px and `button-horizontal-padding` 32px.
- **Mobile size (under 600px):** 44px tall with 12px / 24px padding, so the touch target stays at least 44px.
- **Icons:** 16px (`height-icon-200`), with `space-100` (8px) between icon and label.
- **Labels:** Lexend Deca Medium, 16/20. Small tertiary buttons use 14/20.
- **Tertiary** has no padding or minimum height. Give it room in the layout so the tap area reaches 44px on touch screens.

## What you provide

- A short verb-phrase label, such as "Book a visit" or "Save changes".
- Optionally, an icon: `iconName` takes any Anvil icon name (see the Icons assets), and the default is `plus`. For custom art, pass a 16px SVG drawn with `currentColor` as `iconNode`.
- `href` when the button navigates, so it renders as a link.

## Accessibility

- Labels must make sense on their own. Avoid "Click here".
- A loading button is disabled, so it can't be submitted twice.
- Disabled buttons can't be focused. If people need to know why an action is unavailable, say so in nearby text.
- Disabled text (`#716775` on `#ececee`) has 4.5:1 contrast.
- The primary hover and focus state (`#542f9b` on `#ededff`) has 8:1 contrast.

## Differences from Figma

- **Spinner:** Figma's loading spinner uses the Teladoc Health connector mark. Here it's a plain ring until that artwork is added.
- **Platform:** iOS uses a native spinner in Figma (the Platform collection). This web version always uses the ring.
- **Themes:** button colors switch with all four themes (Core UI Light and Dark, PLI Light and Dark).
