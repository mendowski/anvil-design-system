# Checkbox

Checkbox lets people pick any number of options from a short list, or confirm agreement.

## Usage

- Use `Checkbox` for one option and `CheckboxGroup` to give a set of options a label, helper and message.
- `CheckboxGroup` renders a `<fieldset>` with the label as its `<legend>`.
- For one answer from a list, use radio buttons or SelectionCard (radio).
- Labels can include links (pass children). Links use `text-body-link`.

## Anatomy

- **Box:** 24px (`form-input-control-selection-height`) with 4px corners.
- **Row padding:** 8px vertical, 4px horizontal, with 12px between the box and the label (`form-input-control-selection-gap`).
- **Label:** 16/20 regular.
- **Selected:** fills with `form-input-control-checkbox-background-selected`, with a white check.

## States

| State | What changes |
| --- | --- |
| Hover | Box outline becomes 2px `form-input-control-stroke-hover`; label turns `form-input-control-text-hover`. |
| Focus | Hover styles plus a white row background and the `focus-ring` around the whole row. |
| Error | Red outline; a selected box fills with `background-status-critical-base`. The group label turns red and the message appears below. |
| Disabled | `form-input-control-background-disabled` box, grey check, disabled label. |
| View only (`readOnly`) | Selected boxes fill with `form-input-control-checkbox-background-view-only-selected`. Clicks are ignored and the box has `aria-readonly`. |

## Accessibility

- The native checkbox stays in the page, visually hidden, so keyboard and screen readers work as normal.
- The whole row is the click target, so it's at least 40px tall.
