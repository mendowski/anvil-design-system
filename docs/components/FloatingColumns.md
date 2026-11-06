# FloatingColumns

Floating columns show a range for each category, such as a day's lowest and highest heart rate. Each column floats between its `low` and `high` value instead of rising from the baseline. It comes from the Figma "Floating-columns" component in Pulse 5: Data Visualization.

## Anatomy

- Columns in `data-viz-data-data-2-base` by default (set `color` for another dataset), with rounded ends.
- Up to 12 columns fill their slot. More than 12 become 6px pills, as in the Figma 14- and 24-column versions, and every other x label is dropped past 16.
- The axes, gridlines, goal and empty states work as in BarChart.
- The tooltip shows the range: "64 bpm – 134 bpm".

## Data

`data={[{ x: "Mon", low: 60, high: 110 }, …]}` with an optional `unit`.

## Segmented columns

For data that comes in pieces, such as sleep, give each column `segments` instead of `low` and `high`: `{ x: "Sun", segments: [[2.4, 3.5], [3.7, 3.95], [4.25, 6]] }`.

- Every column gets a light track in `data-viz-data-data-null-subdued` for the window being measured (`track`, such as `[2, 7]`), so days without data still show as empty tracks.
- Segments are `data-viz-data-data-1-base` (aqua) by default, with 4px corners. Short segments, such as a few minutes awake, stay at least 4px tall so they don't disappear.
- The y-axis can show hours (`formatY: t => t + " hr"`) or clock times (`formatY` that turns hours into "4 AM").
- The tooltip is inline by default, like the line chart: the date (`tooltipLabels`), the total and a `note` such as "In bed". `valueFormat="duration"` writes hours as "3 hrs 45 min". Until someone explores the chart, `summary` shows there, such as "4 hours 25 minutes, Average time in bed". `tooltip="overlay"` uses the dark tooltip instead.
- Vertical gridlines are on, and a guide line marks the active day.

## Accessibility

Same as BarChart: a named `<figure>`, a hidden table with Low and High columns, and arrow-key exploring that reads "Mon: 60 to 110 bpm".
