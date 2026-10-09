# Simulator UI

`@tcg/simulator-ui` contains game-agnostic presentation and interaction primitives. Games retain
their own state, legal actions, labels, zones, and visual composition.

## Tabletop component library

The multi-game app provides `/component-catalog` for live production components
from eight games, excluding Lorcana. Choose a component family, compare games,
or switch Cyberpunk between V1 and V2. Card selectors, fixture selectors, and
state controls expose the permutations supported by each renderer. The V2 scene
uses the live card meshes and card interaction layer; it contains no screenshot.

Start with [the framework and component inventory](docs/tabletop-framework.md).
It maps the Cyberpunk V2 surfaces to shared components, defines the game/renderer
boundary, and sets the interaction and 60 FPS acceptance criteria.

Run `pnpm run storybook` in this package. `Simulator UI/Tabletop Library` demonstrates
dice, controlled selection, counters, and card rows under two game themes. Existing
Card Primitives, Board Layout, and interaction stories cover the other building blocks.

`TabletopDie` displays a resolved numeric or symbolic face. Use `appearance="bare"`
with children for game artwork or glyphs. `TabletopDieButton` adds native button input
with a caller-owned action label, disabled state, and optional selection. These components
do not generate random values or infer legal actions.

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
