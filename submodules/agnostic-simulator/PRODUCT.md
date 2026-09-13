# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Players use the TCG Online simulator to play rules-driven trading card game
matches on phones and desktop browsers. On phones, they play in portrait
orientation with touch input and need the same game actions and information
available on desktop.

## Product Purpose

The simulator presents live, practice, replay, and test matches through shared
browser infrastructure while preserving each game's native zones, terminology,
rules state, prompts, and legal actions.

## Positioning

One game-agnostic simulator shell supports multiple TCGs through normalized
contracts and game-owned projections, allowing shared interaction patterns
without flattening game-specific rules or vocabulary.

## Operating Context

Players continually inspect public board state, hidden-zone counts, current
priority, legal actions, prompts, and game history. Public targeting happens
directly on highlighted board objects. Choices involving hidden or dense zones
such as deck, pitch, graveyard, and banished cards use a focused modal
selection flow.

## Capabilities and Constraints

- Mobile simulator layouts support portrait orientation only. Landscape phone
  use falls back to the desktop layout.
- Shared simulator contracts and UI remain game-agnostic. Game-native zones,
  labels, rules state, and visual composition come from the game surface or
  adapter.
- Mobile must retain complete gameplay functionality with touch-sized
  interactions.
- Dynamic game states must avoid moving the surrounding board unexpectedly.
- Public target candidates remain visible and directly selectable. Hidden or
  dense zone selection uses the existing modal interaction pattern.

## Evidence on Hand

- Shared portrait-board composition:
  `packages/simulator-ui/src/components/MobilePortraitBoard.tsx`
- Shared viewport rails and mobile panel:
  `packages/simulator-ui/src/components/SimulatorViewportShell.tsx`
- Shared public-target presentation:
  `packages/simulator-ui/src/components/TargetingOverlay.tsx`
- Shared focused interaction flow:
  `packages/simulator-ui/src/components/InteractionResolutionPrompt.tsx`
- Flesh and Blood browser surface:
  `apps/multi-game-simulator/src/games/flesh-and-blood/`

## Product Principles

- Rules state and legal actions remain understandable without prior knowledge
  of the simulator UI.
- Mobile adaptation changes information hierarchy, not game capability.
- Stable board geometry protects player orientation during frequent state
  changes.
- Shared interaction patterns stay game-agnostic while each game owns its
  native visual composition.
- Hidden information remains protected while public state remains directly
  inspectable.
