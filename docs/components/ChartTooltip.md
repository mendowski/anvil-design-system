# ChartTooltip

Chart tooltips show exact values for the point being explored. The charts render them for you; use `ChartTooltip` directly for custom charts. From the Figma "Chart-overlay-tooltip" and "Chart-inline-tooltip" ("Chart-tooltip" is deprecated).

## Variants

- **Overlay** (default): `data-viz-tooltip-background-primary` (dark) with white text, 4px corners and a 16×8 beak. `beak` sets the side (`top`, `right`, `bottom`, `left`) and `beakAlign` the position (`center`, `leading`, `trailing`). BarChart and FloatingColumns use it.
- **Inline** (`variant="inline"`): `data-viz-tooltip-background-secondary` (light) with the x-value, a dashed divider in `data-viz-tooltip-stroke`, and the values. LineChart puts it on a track between the title and plot.

## Values

- **Single:** `values={[{ value: "NN", unit: "unit" }]}`.
- **Compound:** two values side by side.
- **Range:** two values with `range`, joined by a dash.
- **Multiple datasets:** up to four values with `label`s. Each gets the dataset's hollow data point (circle, square, triangle, inverted triangle).
- Values are 14/20 semibold and units 12/12. `supplemental` adds a line of extra text.

## ChartSummary

`ChartSummary` is the resting state of the inline track: the value at 18/24 bold, the unit at 14/20 and a 12px label, all in `text-body-subdued`. Use it for a total, average or range.
