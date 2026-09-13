# Simulator UI

`@tcg/simulator-ui` contains game-agnostic presentation and interaction primitives. Games retain
their own state, legal actions, labels, zones, and visual composition.

## Simulator viewport layout

Use `SimulatorViewportShell` for every play surface:

- desktop begins at 768px and starts with an expanded, collapsible sidebar;
- phones use game-owned opponent/status and self/action rails with the full sidebar in a drawer;
- short, coarse-pointer landscapes also use the phone layout;
- the shell and tabletop never page-scroll, while explicitly bounded card lanes and sidebar content
  may scroll internally.

Games with deeply nested mobile rail state can render `SimulatorViewportRailPortal` inside the
tabletop to move that game-owned content into the shell rails. `MobilePortraitBoard` supports
`externalRails` for this composition.

## Manual-match statements

`TabletopStatementsPanel` renders the shared statement and activity model from
`@tcg/simulator-contract`. The pure transitions live in `@tcg/simulator-runtime`; games embed the
model and action union in their own opaque state rather than adding it to the realtime protocol.

## Pointer drag and drop

Compose `PointerDragDropSurface`, `PointerDraggable`, and `PointerDroppable`. The shared primitives
own pointer, touch, and keyboard mechanics; games own encoded IDs, legality, reducers, and visuals.
