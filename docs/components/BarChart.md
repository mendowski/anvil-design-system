# BarChart

Bar chart compares values across categories, such as steps per day or doses per week. Bars rise from the baseline, with an optional goal line or goal range. It comes from the Figma "Chart-bar" and "Bar-chart" components in Pulse 5: Data Visualization.

## Anatomy

- **Title** (optional): `title` at 18/24 semibold and `subtitle` at 14/20 in `text-body-subdued`.
- **Plot:** bars in `data-viz-data-data-2-base` (berry) by default, with 4px top corners. Gridlines use `data-viz-axis-gridline` and the baseline `data-viz-axis-baseline`.
- **Axes:** x labels under the baseline and y labels on the right, both 12px in `data-viz-label-axis-label`. Set `yAxis="left"` or `"none"` to move or hide the y labels. The active column's x label turns `data-viz-label-axis-active` and semibold.
- **Goal** (optional): `goal={6}` draws a dashed `data-viz-goal-line` with a green "GOAL" pill on the right. `goal={[5, 7]}` draws a `data-viz-goal-range` band. Change the pill text with `goalLabel`, or move it with `goalPosition="left"`.
- **Tooltip:** hover, tap or arrow-key to a column. The bar turns its dataset's `-hover` color and a dark overlay tooltip shows the x-value and value. When there isn't room above, the tooltip moves beside the bar.
- **Legend:** shown with more than one dataset.

## Data

- One dataset: `data={[4.2, 6.8, 5.1]}` with `categories={["Mon", "Tue", "Wed"]}`. A second label row goes in `categories={[{ label: "1", sublabel: "A" }]}`.
- Up to four datasets: `series={[{ label: "Taken", values: [...] }, { label: "Missed", values: [...] }]}`. They sit side by side in each column, in datasets 2, 4, 1 and 8 (berry, green, aqua, yellow) unless you set `color`.
- `unit` follows each value in the tooltip, such as "k steps".
- The y-axis rounds up to a clean number above the data and goal. Set `yMax` and `yStep` to fix it.
- 12 columns or more use a 4px gap; fewer use 8px.

## Empty states

With no data, or with `empty`, a ghost bar chart shows with a message: "No data yet" (`status: "zero"`) or "Data unavailable" (`status: "unavailable"`). Add a `description`. See ChartEmpty.

## Accessibility

- It renders as a `<figure>` named by its title, with a visually hidden table of every value for screen readers.
- The plot is one tab stop. Arrow keys, Home and End move between columns, Escape clears, and each change is announced.
- Don't rely on color alone: label datasets in the legend and keep the unit in the tooltip.
