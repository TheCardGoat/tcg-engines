# Inline card references

`@tcg/simulator-presentation/card-reference` exports `CardReference` and
`ReferencedCard`. Pass a viewer-authorized instance ID, name, artwork, aspect
ratio, and optional identity markers. Each marker has a readable label and an
optional color. The game owns the meaning: color, faction, affiliation, element,
or pitch. The component has no game registry imports.

The default preview opens on hover or keyboard focus. A click pins it; a second
click, Escape, Close preview, or an outside click closes it. Hover previews remain
open when the pointer moves onto the preview. The inline name uses an underline
and a preview indicator, so interaction does not depend on color alone.

Games with an existing preview controller can pass `previewMode="external"`
and their own mouse, focus, click, and keyboard handlers. Flesh and Blood history
uses this mode to preserve its printed pitch variants and pinned preview.

Prompt context uses explicit protocol references (`contextParts` and option
`entity`), rather than parsing names. Resolve these through the seated viewer's
card map. If a referenced card is not authorized, show neutral text; never look
it up in a game registry to recover hidden information. Previewing a card and
selecting it for an effect are separate actions.
