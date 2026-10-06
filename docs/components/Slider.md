# Slider

Slider lets people pick a value, or a range of values, by dragging along a track.

## Types

- **Left to right** (default): fills from the minimum up to the handle.
- **Right to left** (`direction="rtl"`): fills from the handle to the maximum. Use it when lower is the goal.
- **Range** (`range`, value `[low, high]`): two handles with the fill between them. Clicking the track moves the nearest handle.

## Anatomy

- **Value above the handle:** 16/20 semibold, formatted with `formatValue`, such as `v => v + " lbs"`.
- **Track:** 8px tall, `form-input-control-background-disabled` with a 1px `form-input-control-stroke-default` outline.
- **Fill:** `form-input-control-background-default-interactive`.
- **Handle:** 24px, with a 2px white border and a 44px tap target.
- **Min and max:** shown under the track in helper color. Turn them off with `showRange={false}`.
- **Gap:** 24px between the labels and the slider (`form-input-slider-gap`).

## States

| State | What changes |
| --- | --- |
| Hover | Handle turns `form-input-control-background-hover-interactive`. |
| Focus | Hover color plus `focus-ring` on the handle (keyboard only). |
| Pressed | Handle grows to 32px (`form-input-slider-handle-height-pressed`) while dragging. |
| Disabled | Fill and handle turn `form-input-control-slider-background-active-disabled`. |

## Accessibility

- Each handle is a native range input, so arrow keys, Page Up/Down and Home/End work.
- Screen readers hear the formatted value (`aria-valuetext`). Range handles are named "Minimum" and "Maximum".
- Always pair a slider with a label. When the exact value matters, offer a text input as well.
