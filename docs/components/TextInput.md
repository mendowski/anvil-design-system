# TextInput

Text input lets people write or edit a single line of text, with an optional unit, icon and status message.

## When to use

- Short free text: names, emails, numbers with a unit such as weight in lbs.
- Use a select or radio group when the answer comes from a fixed list.

## Anatomy

- **Label** (`label`): 16/20 semibold. It turns red (`form-input-label-text-label-error`) in the error state.
- **Helper** (`helper`): 14/20 in `form-input-label-text-helper`. Use it for format hints, not instructions that must be read.
- **Control:** 44px tall (`form-input-control-height`), 12px padding, `form-input-control-radius` corners, 1px `form-input-control-stroke-default` outline.
- **Unit** (`unit`, `unitPosition`): placeholder-colored text before or after the value, such as `$` or `lbs`.
- **Icon** (`icon`): any Anvil icon name, shown before the text, such as `search`.
- **Inline message** (`message`): appears under the control with a status icon.

## States

| State | What changes |
| --- | --- |
| Hover | Outline becomes 2px `form-input-control-stroke-hover`. |
| Focus | 2px hover outline plus the `focus-ring` halo. |
| Warning | `form-input-control-stroke-warning` outline and a warning message. Use it for unusual but allowed values. |
| Error | `form-input-control-stroke-error` outline, red label, error message. The input gets `aria-invalid`. |
| Disabled | `form-input-control-background-disabled` fill, disabled text. |
| View only (`readOnly`) | `form-input-control-background-view-only` fill and a lock icon. The value can be read and copied but not changed. |

## Writing messages

- Error: say what's needed, such as "Email is required" or "Enter a date like 04/12/1986".
- Warning: say what looks off and what to check.

## Accessibility

- The label is a real `<label>`. The helper and message are linked with `aria-describedby`.
- The placeholder is never a substitute for the label.
