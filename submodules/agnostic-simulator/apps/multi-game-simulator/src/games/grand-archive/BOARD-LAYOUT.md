# Grand Archive board layout

The default `GrandArchiveBoard` uses the React Three Fiber `board-renderer` and shared `@tcg/simulator-presentation/three` components. Fixtures, practice, and hosted matches use the same tabletop entry point. The duplicate DOM board and separate ThreeBoard wrapper have been removed.

The scene owns card geometry, card backs, selection rims, movement, table materials, and target links. `grand-archive-theme.css` positions DOM controls against scene coordinates. The engine and interaction adapter remain the only source of legal actions and results.

DOM controls provide keyboard card selection, counter inspection, legal card actions, lineage, private-zone counts, combat steps, Pass, and Undo. Each seat has a collapsed zones menu for inspection and field overflow. Deck reveals are sorted for inspection and do not imply deck order. Hidden cards do not receive face textures.

Wide and compact Cambria compositions share one renderer. Preserve the Hearthstone-style direction: illustrated table borders and corner environments, raised card frames, centered champions, opposing field rows, fanned hands, and an integrated resource/action rail. Layout improvements must work within this dimensional scene. Cards keep their source image proportions; accessible counter seals follow their scene positions. Reduced motion snaps card poses; idle scenes use demand rendering. Browser checks are required for both compositions after layout changes.
