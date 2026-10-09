# Shared opening hand fan

## Reference comparison

- [MTG Arena's official mobile interaction guide](https://magic.wizards.com/en/news/mtg-arena/mtg-arena-state-game-january-2021-01-21) documents a tucked hand, expansion for selection and inspection, and returning focus to the battlefield. Its screenshots show why a compact idle hand matters. This is a historical reference, not a measurement of the current client.
- [Hearthstone gameplay screenshot](https://www.imore.com/hearthstone-ten-tips-hints-and-tricks-building-killer-deck) shows the compact, curved lower-edge hand with exposed card tops and strong overlap. [Blizzard's spectator guide](https://hearthstone.blizzard.com/en-gb/news/16421344/fireside-chat-developer-panel-recap/) describes hover inspection of card text. No claim is made about either game's exact animation durations.

Applied to the shared R3F opening previews: a shallow symmetric downward arc,
roughly one-quarter of each idle card tucked below the table, and a full upright
card raised in place for inspection. Neighbours keep their positions. Fixed
pointer regions prevent the enlarged card from changing which neighbour owns the
pointer. Above the resting hand, the inspected face retains ownership so the
user can move over its text. Leaving the hand, clicking the table, blurring
keyboard focus, or pressing Escape clears inspection. Touch can tap a card to
inspect it. Existing mulligan selection remains separate and unchanged.

The shared `handFanLayout` provides poses and hit testing. `OpeningScene` drives
the existing `DomCardMotion`; there is no second animation loop and no per-frame
React state update. Retargeting uses the existing 200 ms untimed interpolation,
shadow and reduced-motion path. Hover is silent to avoid repeated SFX while
reading. Opening and play sounds remain unchanged.

## Scope and validation

This change applies to Grand Archive and Alpha Clash opening previews. It does
not replace the live match HTML hand or add gameplay drag actions to an opening
fixture. The geometry is exported for other adapters to adopt. Use **Fixture
notes → Preview settled hand** to inspect it directly.

- Fourteen opening tests passed, including hand sizes 1, 3, 7, 10 and 20 at
  widths 360, 800 and 1280; bounds, symmetry and stable hit regions are covered.
- Shared package types, changed-file type-aware lint and standalone build passed.
  The existing shared-chunk size warning remains.
- Browser checks: Grand Archive seven-card and Alpha Clash eight-card hands,
  left-to-right hover, raised-face inspection, keyboard inspection, Escape,
  reduced motion, and a 390x844 narrow viewport. The inspected edge card was
  fully inside the viewport (x 164–374 at width 390).
- Five-second local browser animation-frame sample while moving across the hand:
  301 intervals, 59.99 FPS average, p95 16.9 ms. This is local evidence, not a
  guarantee for other hardware. Video is encoded at 30 FPS; GIF at 10 FPS.
