# NavList

Prominent nav list is a stack or grid of large, tappable links to the most important destinations, such as programs, services and next steps. Each item is a `NavListItem`, from the Figma "Prominent-nav-list-item" set.

## Usage

```jsx
<NavList label="Next steps" items={[
  { href: "/log", graphic: "icon", icon: "weight", label: "Log your weight", description: "Weekly check-in", arrow: true },
  { href: "/refill", graphic: "icon", icon: "medicine", label: "Refill your prescription", status: "completed" },
]} />
```

- Use it for a handful of key destinations. For long or secondary lists, use a subdued list instead.
- Items sit `space-between-prominent-nav-list` apart (12px on desktop, 8px on mobile). `layout="grid"` puts them in columns of at least 300px.

## Item content

- `label` (required), plus optional `eyebrow`, `description` and `metadata`. Pass `children` to replace the description with custom content.
- `arrow` shows a right arrow, for items that go to another page.

## Graphic

| `graphic` | Looks like |
| --- | --- |
| `none` | Text only. |
| `icon` | A 32px circle in `navigation-list-item-background-graphic-icon-default` with a white filled `icon`. |
| `spot` | A 64px round spot illustration, picked by `spot` (an Anvil illustration name). |

`alignment="full-width"` puts the graphic beside the label only, and lets the description and metadata use the full width underneath.

## States

| State | Look |
| --- | --- |
| Default | `navigation-background-surface`, `stroke-base` border. |
| Hover | `navigation-background-hover` fill, text in `navigation-text-hover`. |
| Focus | Hover plus `focus-ring`. |
| Pressed | `navigation-list-item-background-prominent-pressed`, text in `navigation-text-pressed`, darker icon circle. |
| Completed (`status="completed"`) | `background-neutral` fill, a green check in the graphic. |
| Postponed (`status="postponed"`) | `background-neutral` fill, a gray reload icon in the graphic. |
| Disabled (`disabled`) | Text in `navigation-text-disabled`, gray graphic, not clickable. |

`state` forces hover, focus or pressed for documentation.

## Accessibility

- With `href` an item is a link; with `onClick` it's a button. The list is a `<ul>`; give it a `label` when the page has more than one.
- Completed and postponed are shown by icon and color, so say it in the text too, such as metadata "Completed Oct 2".

## Differences from Figma

- Figma's "Custom content" slot is `children`.
- Disabled spot illustrations are grayed out with a filter instead of separate artwork.
