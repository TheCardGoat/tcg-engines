# Shared simulator counters

The counter family lives in `@tcg/simulator-presentation`. Games supply meaning,
values, labels, visibility and placement. Counters do not change game state.

## Components

- `CounterBadge` from `@tcg/simulator-presentation/counters`: passive DOM display
  with an accessible label. `size` sets its height in CSS pixels.
- `CounterToken` from `@tcg/simulator-presentation/three`: WebGL display. Use
  `orientation="screen"` to keep its face upright as the parent card turns.
  `minScreenSize` sets a minimum face height in CSS pixels on small boards.
- `CounterTransferMotion`: uses the same named-token artwork during transfers.

Both renderers share `paintCounter`. Supported visual roles are `damage`,
`health`, `shield`, `energy`, `bonus` and `neutral`. Each has a distinct symbol
and color. `round` emphasizes the number; `named` adds a short game-supplied label.
Use `color` to apply a game-specific accent. Symbols are UI artwork, not official
card-game icons.

```tsx
<CounterBadge kind="damage" label="Damage" count={12} size={36} />
<CounterToken
  kind="damage"
  label="Damage"
  count={12}
  variant="round"
  orientation="screen"
  minScreenSize={28}
  position={[0.3, -0.43, 0.07]}
/>
```

Zero is a valid display value. The caller decides when a counter is absent.
Keep hidden card data out of both visual and accessible labels. WebGL callers
must expose the same value through the board's accessible DOM. Alpha Clash
uses its player-status region for this.

## Reference review

- Gundam uses a round, labeled damage badge with a large number and minimum size.
- Lorcana centers its damage indicator and scales it with card size.
- Naruto separates damage and power-bonus chips.
- Alpha Clash previously used a flat red rectangle that rotated with the card.

The shared family combines strong number contrast, distinct type symbols,
a dark rim, and optional screen-facing orientation. Alpha Clash damage is the
first round-token board integration. Existing named Alpha Clash counters and
counter transfers also use the shared artwork. Other games retain their current
board renderers; they can adopt this family without a rules or protocol change.

## Visual checks

Open `/component-catalog?game=alpha-clash` and use the shared counter section.
Check zero, one-, two- and three-digit values, the 24/32/44 px samples, and
0/90/180 degree orientations. The catalog uses display-only values. Native
Alpha Clash combat provides the separate integration check.
