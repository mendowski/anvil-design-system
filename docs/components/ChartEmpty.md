# ChartEmpty

Chart empty states replace a chart that has nothing to show: a gray ghost chart with a message card over it. From the Figma "Chart-empty-message" and the ghost charts on the Empty states page.

## Statuses

- **Zero data** (`status="zero"`, default): "No data yet" with the info icon. Use it before someone has logged anything.
- **Data unavailable** (`status="unavailable"`): "Data unavailable" with the cloud-disconnected icon. Use it when data couldn't load.
- Add a `description` that says what to do next, such as "Log your first reading to see your trend."

## Anatomy

- **Ghost chart** (`chart`): `bar`, `line` or `radial`, drawn in `data-viz-data-data-null-subdued`.
- **Message:** up to 300px wide on `background-base` with a `stroke-base` border, 12px corners and the elevation shadow. The title is 14/20 semibold and the description 14/20 in `text-body-subdued`.

BarChart, LineChart and FloatingColumns show this automatically when they have no data, or when you pass `empty={{ status, title, description }}`.

## Accessibility

The message is a `role="status"` region, so it's read when it appears. The ghost chart is hidden from screen readers.
