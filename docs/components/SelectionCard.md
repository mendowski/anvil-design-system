# SelectionCard

Selection card is a radio or checkbox option that needs more than a one-line label, such as a visit type with a short description.

## Usage

- `type="radio"` (default) is for picking one. Give the cards in a set the same `name`, and wrap them in an element with `role="radiogroup"` and a label.
- `type="checkbox"` is for picking any.
- `title` is 16/20 semibold. `description` (or children) is 14/20 and can hold a custom body.
- Stack cards with `space-150` (12px) between them.

## Anatomy

- **Padding:** 24px (`padding-300`) with 16px between content and control.
- **Shape:** `radius-150` corners and a 1px `form-input-control-stroke-default` outline.
- **Control:** 24px, on the right.

## States

| State | What changes |
| --- | --- |
| Hover | Fill `form-input-control-chip-background-hover`, title `form-input-control-chip-text-hover`, control outline 2px. |
| Focus | Hover styles plus `focus-ring`. |
| Selected | Fill `form-input-control-chip-background-selected` and a 2px `form-input-control-chip-stroke-default-selected` outline. Radio shows a 16px dot; checkbox fills. |
| Error | White fill, red outline and control, and an inline message under the card (`message`). |
| Disabled | Grey fill and text. A selected card keeps a 2px grey outline. |
| View only (`readOnly`) | View-only fill, and a lock replaces the control. |

## Accessibility

- Each card is a `<label>` wrapping a visually hidden native input, so arrow keys move between radio cards.
- The error message is linked with `aria-describedby`.
