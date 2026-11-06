# RadialChart

Radial chart is a donut that shows a part of a whole, such as 7 of 10 doses logged. It comes from the Figma "Chart-radial" component in Pulse 5: Data Visualization.

## Anatomy

- **Track:** a full ring in `data-viz-axis-radial`.
- **Progress:** an arc from 12 o'clock, clockwise, in `data-viz-data-data-2-base` by default, with round ends edged in `data-viz-stroke-radial` so the end stands out from the track. At 100% it's a full ring.
- **Value:** in the middle, the value at 18/24 bold in the dataset's data-text color (datasets 1–3; others use their base color) and the `unit` at 14/20 in `text-body-subdued`. Add a second line with `value2` and `unit2`.
- **Size:** 140px by default; the ring is 10% of the diameter. Set `size` and `thickness`.

## Data

`percent={70}`, or `value` and `max`. `display` overrides the middle text.

## Accessibility

It renders as `role="img"` with a name such as "Doses this week: 7 of 10 (70%)". Pass `title` or `ariaLabel` for context.
