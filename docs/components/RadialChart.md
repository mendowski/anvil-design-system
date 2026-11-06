# RadialChart

Radial chart is a donut that shows a part of a whole, such as 7 of 10 doses logged. It comes from the Figma "Chart-radial" component in Pulse 5: Data Visualization.

## Anatomy

- **Track:** a full ring in `data-viz-axis-radial`.
- **Progress:** an arc from 12 o'clock, clockwise, in `data-viz-data-data-2-base` by default, with round ends edged in `data-viz-stroke-radial` so the end stands out from the track. At 100% it's a full ring.
- **Value:** in the middle, the value at 18/24 bold in the dataset's data-text color (datasets 1–3; others use their base color) and the `unit` at 14/20 in `text-body-subdued`. Add a second line with `value2` and `unit2`.
- **Size:** 140px by default; the ring is 10% of the diameter. Set `size` and `thickness`.

## Small radial

For tight spaces, such as a list row or a card header, use `variant="small"`: a 48px ring, about 5px thick, with a fraction in the middle in `utility-3/strong` (12/12 semibold) and `text-body-subdued`. From the Figma "radial-number" components.

- `value` and `max` write the fraction, such as `value={3} max={4}` for "3/4". `display` overrides it.
- `status` colors the arc for the meaning, not the dataset:
  - `"critical"`: `stroke-status-critical` (red), for little progress, such as 1/4.
  - `"warning"`: `stroke-status-warning` (yellow-brown), for partway, such as 3/4.
  - `"success"`: `stroke-status-success` (green), for done, such as 1/1.
- Without `status`, the arc uses the dataset `color`, as in the large chart.
- The small version has no unit or second value. Put the label next to it in text, such as "Doses this week".
- Don't rely on the color alone to carry the status: the fraction and the nearby label say it too, and the accessible name ends with the status, such as "3 of 4 (75%), warning".

## Data

`percent={70}`, or `value` and `max`. `display` overrides the middle text.

## Accessibility

It renders as `role="img"` with a name such as "Doses this week: 7 of 10 (70%)". Pass `title` or `ariaLabel` for context.
