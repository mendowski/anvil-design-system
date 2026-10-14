# VisitCard

Visit card shows one scheduled visit: the date and time, the provider and the care type, with up to three actions. It's built from the Figma "Visit-card-v2" set, which is marked as under development for Anvil 5.7.

## Types

| `type` | Use it for | Looks like |
| --- | --- | --- |
| `upcoming` (default) | A visit later than today. | Date block in `brand-human-care-background-subdued`, time in the eyebrow. |
| `today` | A visit happening today. | Same as upcoming, or the prominent style below. |
| `past` | A visit that already happened. | Date block in `visit-card-background-disabled` with the year, and a gray eyebrow. |
| `custom` | Any other status, such as Requested. | No date block. The eyebrow shows `label`. Up to three actions. |

## Prominent

`prominent` highlights the next visit for Upcoming and Today. It drops the date block, adds a 6px `brand-human-care-stroke` bar on the left, and moves the time into a pill on the right. The eyebrow reads "Today" or "Tomorrow" by default; change it with `label`, such as "Thursday".

- `footerStyle="prominent"` turns the first action into a full-width primary button, for when joining is the main task. The second action stays tertiary underneath.
- Show only one prominent card per screen.

## Content

- `header`: the provider, such as "Dr. Ana Rivera, MD". `description`: the care type.
- `month`, `day`, `year` (year shows on past visits), `time`.
- `icon`: the visit type, such as `video` (default) or `phone`. Pass `iconLabel` ("Video visit") so screen readers hear it. `icon={null}` hides it.
- `canceled`: adds "Canceled" in `text-status-critical` under the care type.
- `actions`: `[{ label, href?, onClick? }]` as small tertiary buttons. Two at most, or three for custom.

## Linking

Pass `href` to make the whole card a link to the visit details. An arrow appears on the right, the hit area covers the card, and the actions stay separately clickable above it. `arrow` shows the arrow without a link.

## Accessibility

- It renders as `<article>` with the provider as an `<h3>`. Change the level with `headingAs`.
- Don't rely on the left bar or date color alone: the eyebrow text says Today, Tomorrow or the status.

## Differences from Figma

- The Figma "Tomorrow" eyebrow is fixed text; here it's the default for a prominent upcoming card and can be changed.
- The card stretches to its container; Figma shows it at 358px.
