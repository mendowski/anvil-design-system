# MarkdownText

Markdown text renders dynamic content, such as text from a content system or an API, with Pulse type styles. The same Markdown can be shown on web, iOS and Android.

## When to use

- The text comes from somewhere else and can change, such as care plan steps or help articles.
- The content mixes headings, paragraphs, lists and links.

For text you write into a screen, use the Pulse type styles directly.

## Markdown and type styles

| Property | Markdown | Pulse type style |
| --- | --- | --- |
| H1 | `# Heading` | `heading-heading-1` |
| H2 | `## Heading` | `heading-heading-2` |
| H3 | `### Heading` | `heading-heading-3` |
| H4 | `#### Heading` | `heading-heading-4` |
| Body text (default) | Plain text | `body-default` |
| Bold | `**bold text**` | `body-strong` |
| Italics | `*italics text*` | `body-italics` |
| Ordered list | `1. First item` | `body-default` |
| Unordered list | `- First item` | `body-default` |
| Link | `[title](https://www.example.com)` | `body-text-link` |

Bare links such as `https://www.example.com` also become links.

## Spacing

- Headings use the matching `space-between-heading-N-body` token before the text under them.
- Paragraphs and lists use `space-between-body`.
- Padding around the content is up to the team using it.

## Safety

- The component builds React elements and never inserts HTML, so HTML in the Markdown shows as plain text.
- Only `https:`, `http:`, `mailto:`, `tel:` and relative links become links. Anything else shows as plain text.

## Accessibility

- Headings are real `h1` to `h4` elements, so they show up in the page outline. Use `headingOffset` to move them down a level (1 makes `#` an `h2`) when the page already has an `h1`. They keep their look.
- Annotate Markdown text like any other text. The headings and body in one block are one component.
- Write link text that makes sense out of context.
