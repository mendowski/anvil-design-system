# LineChart

Line chart shows trends and change over time for one to four datasets, such as weight or blood glucose by day. It comes from the Figma "Line-chart" component in Pulse 5: Data Visualization.

## Anatomy

- **Title** (optional) at 18/24 semibold, with an optional `subtitle`.
- **Summary or inline tooltip:** a track between the title and the plot. Until someone explores the chart it shows `summary`, such as `{ value: "126", unit: "mg/dL", label: "Average" }` (also a compound value, or a range with `range: true`). While exploring, the light inline tooltip (`data-viz-tooltip-background-secondary`) slides along the track to the active point with the x-value, a dashed divider and each value.
- **Plot:** horizontal and vertical gridlines, the baseline, and y labels on the right. A thin guide line marks the active x position.
- **Lines:** 1.5px lines in datasets 2, 4, 1 and 8 (berry, green, aqua, yellow). Each dataset has its own node shape, circle, square, triangle and inverted triangle, so lines can be told apart without color. Active nodes are hollow, with a 2px ring in the dataset's `-hover` color.
- **Goal** (optional): a dashed goal line or a goal range band, as in BarChart.
- **Legend:** shown with more than one line or a goal.

## Options

- `curve="curved"` draws smooth curves; the default is straight segments.
- `nodes={false}` hides the data points.
- `tooltip="overlay"` uses the dark overlay tooltip over the plot instead of the inline one; `tooltip={false}` turns exploring off.
- `null` values leave a gap in a line.

## Accessibility

- A `<figure>` named by its title, with a hidden data table.
- The plot is one tab stop. Arrow keys move between x positions and the values are announced.
- With several lines, the node shapes and legend carry meaning beyond color.
