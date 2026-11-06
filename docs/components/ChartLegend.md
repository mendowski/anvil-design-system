# ChartLegend

Chart legend names the datasets in a chart. The charts add it when there's more than one dataset or a goal; use it directly for custom charts. From the Figma "Chart-legend" and "Chart-legend-item".

## Anatomy

- Items wrap in a row with 16px between them. Labels are 12/12 in `data-viz-label-legend`, 8px from the icon.
- **Data:** an 8px data point in the dataset's base color and shape.
- **Goal line:** a short dashed `data-viz-goal-line`.
- **Goal range:** an 8px square of `data-viz-goal-range` between dashed lines.
- Add the goal item with `goal="line"` or `goal="range"`.

## Dataset colors

Data viz has 12 dataset colors, `data-viz-data-data-1` to `-12`, each with base, hover and subdued values in every theme, plus `data-viz-data-data-null` gray for missing data. Datasets 1–3 also have a `-data-text` color for values set in text.

Use them in this order so charts look alike across the product:

1. Data 2, berry, circle
2. Data 4, green, square
3. Data 1, aqua, triangle
4. Data 8, yellow, inverted triangle

Check contrast: graphics need 3:1 against the background and text 4.5:1. Pair color with shape and labels.
