# PasswordInput

Password input is for entering or creating a password, with a Show/Hide toggle and, when creating, live strength and requirement feedback.

## Modes

- **Sign in** (default): the field and the Show/Hide button. `autocomplete` is `current-password`.
- **Create** (`mode="create"`): adds a three-part strength bar and a requirements list that update as people type. `autocomplete` is `new-password`.

## Strength

- **Very weak:** one of three segments, in `background-status-critical-base`. Shown when fewer than half the requirements are met.
- **Average:** two of three segments, in `background-status-success-base`. Shown when at least half are met.
- **Strong:** the full bar is green, when every requirement is met.

## Requirements

- The default list matches Figma: at least 10 characters, upper and lower case, a number and a symbol, and no name or email.
- Pass `excludeWords` (the person's name, email and so on) to check the last rule.
- Pass `requirements` as `[{ label, test(value) }]` to change the list, or `[{ label, met }]` to control it yourself.
- Met items show a filled `check-circle` in `icon-status-success`. Unmet items show the outline icon in `icon-disabled`.

## States

- **Input and toggle:** they have separate hover and focus states (`state="hover-input"`, `"focus-input"`, `"hover-button"`, `"focus-button"` force them for docs). The toggle text turns `form-input-control-text-hover` on hover.
- **Error:** both parts get the error outline.
- **Disabled:** both parts grey out.
- **View only:** shows the obscured value with a lock icon and no toggle.

## Accessibility

- The toggle is a button with `aria-pressed` and `aria-controls`, labelled "Show password" or "Hide password".
- Strength changes are announced politely (`aria-live`).
- Each requirement includes hidden "met" or "not met" text, so it isn't conveyed by the icon alone.
