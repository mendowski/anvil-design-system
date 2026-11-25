# SelectInput

Select input lets people pick one answer from a list of set options. The list opens in a dropdown menu under the control.

## When to use

- There's a reasonable number of options, and people don't need to search or filter them.
- Only one option can be chosen.
- There isn't room to show every option on the page.

Don't use it when:

- There are many options, or searching would help. Use an advanced select.
- People can pick more than one. Use checkbox inputs or checkbox selection cards.
- Each option needs more than a short description. Use selection cards.

Common uses at Teladoc Health include choosing your location when requesting a visit, describing conditions in a medical history, and picking a time frame for health data, such as the past 14 days or 3 months.

## Anatomy

- **Label** (`label`): 16/20 semibold. It turns red (`form-input-label-text-label-error`) in the error state.
- **Helper** (`helper`): 14/20 in `form-input-label-text-helper`.
- **Control:** the same as text input. 44px tall, 12px padding, `form-input-control-radius` corners, 1px `form-input-control-stroke-default` outline.
- **Placeholder** (`placeholder`): "Select" by default, in `form-input-control-text-placeholder`. Once something is chosen, the answer shows in `form-input-control-text-filled`.
- **Dropdown indicator:** the `arrow-down` icon in `form-input-control-icon-default`. It flips while the menu is open.
- **Inline message** (`message`): appears under the control with a status icon.
- **Dropdown menu (Form-dropdown):** floats `space-100` below the control, over the content below it. `navigation-background-surface` fill, `radius-150` corners, `elevation` shadow, scrolls after about 9 options.
- **Option:** 16/20 label with 12px padding and a `stroke-base` divider. An optional 14/20 description (`description`) sits under the label.
- **Selected option:** `navigation-text-selected` label and a `check` icon on the right.

## Options

`options` takes strings, or objects with `value`, `label` and an optional `description`. Options with and without descriptions can be mixed in one menu.

```jsx
<SelectInput
  label="Time frame"
  options={[
    { value: "14d", label: "Past 14 days" },
    { value: "3m", label: "Past 3 months", description: "Weekly averages" }
  ]}
  defaultValue="14d"
/>
```

## States

| State | What changes |
| --- | --- |
| Hover | Outline becomes 2px `form-input-control-stroke-hover`. |
| Focus | 2px hover outline plus the `focus-ring` halo. |
| Warning | `form-input-control-stroke-warning` outline and a warning message. |
| Error | `form-input-control-stroke-error` outline, red label, error message. The control gets `aria-invalid`. |
| Disabled | `form-input-control-background-disabled` fill, disabled text and icon. |
| View only (`readOnly`) | `form-input-control-background-view-only` fill and a lock icon in place of the arrow. |

Menu options have default, hover (`navigation-background-hover`), pressed (`navigation-form-list-item-background-pressed`) and selected states.

## Interaction

- Click or tap the control to open the menu. Choosing an option updates the control and closes the menu.
- Clicking outside the menu closes it without changing the answer.
- The menu sits over other content. It never pushes the page down.
- **Optional fields** need a way to clear the answer. Set `optional` to add a "Select" item at the top of the menu that returns the control to its placeholder.

## Accessibility

- The control is a `combobox` button that opens a `listbox`. Screen readers announce the label, the current answer and whether the menu is open.
- Keyboard: Down, Up, Enter or Space opens the menu. Home and End open it on the first or last option. Up and Down move through options, Enter or Space chooses one, and Escape closes the menu. Typing a letter jumps to the next option that starts with it.
- A view-only select stays in the tab order. A disabled select is skipped.
- The helper and message are linked with `aria-describedby`. The status icon in the message is decorative.
