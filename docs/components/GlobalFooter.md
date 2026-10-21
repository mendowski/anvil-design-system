# GlobalFooter

Global footer is the tab bar at the bottom of the app. It links to the main sections, such as Home, Programs, Health info, Messages and Account, and looks the same on every platform. In Figma it's "Global-footer", built from ".Tap-nav-items".

## Anatomy

- **Container:** a pill in `navigation-background-surface` with `radius-round` corners, `padding-050` (4px) inside and the `elevation` shadow.
- **Tabs** (`items`): a 20px icon over a label in `utility-3/default` (12/12). Tabs share the width equally.
- **Current tab:** a `navigation-global-header-tap-bar-current` pill, a `navigation-text-current` label in `utility-3/strong` and the filled (active) icon.

## Tab states

| State | Look |
| --- | --- |
| Current | `navigation-global-header-tap-bar-current` fill, `navigation-text-current` semibold, filled icon in `navigation-icon-current`, `aria-current="page"`. |
| Default | Transparent, `navigation-text-default`, outline icon in `navigation-global-header-tap-bar-icons`. |
| Hover | `navigation-background-hover` fill, `navigation-text-hover` label and icon. |
| Focus | Hover plus `focus-ring`. Keyboard focus only. |
| Pressed | `navigation-background-pressed` fill, `navigation-text-pressed` label, `navigation-icon-pressed` icon. |

`state="hover"`, `"focus"` or `"pressed"` forces a state for docs and prototypes.

## How many tabs

- Use 3 to 5 tabs. Figma shows 4.
- With 5 tabs, padding tightens and long labels can wrap to two lines, so they fit a 360px phone.
- Keep labels to one or two short words. The icon helps people scan, but the label carries the meaning.

## Badges

- `badge: 2` shows a count in `background-status-critical-base`, and `badge: true` shows an 8px dot, the same as in Global header.
- Screen readers hear the count as part of the label, such as "Messages, 2 new".

## Placement

- Pin it to the bottom of the screen, 16px from the sides and bottom, and above the device's safe area on phones.
- Add bottom padding to the page so the last content isn't hidden behind it.
- Use it with the signed-in Global header. Leave it out of focused tasks and progress trackers, where people should finish one thing without wandering off.

## Accessibility

- It renders as a `<nav>` labelled "Main". Change the name with `label`.
- Each tab is a link (`href`) or a button (`onClick`), at least 52px tall.
- Icons are decorative. The label is always visible, so tabs never rely on the icon alone.
