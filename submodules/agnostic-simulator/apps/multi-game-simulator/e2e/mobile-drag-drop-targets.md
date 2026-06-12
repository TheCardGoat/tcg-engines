# Mobile Drag And Drop Targets

This document lists the drag sources and droppable targets available in the
mobile board UI. It is intended as a QA handoff for writing e2e tests.

The drop contract is shared with desktop through `mapDropToAction` in
`apps/multi-game-simulator/src/games/cyberpunk/engine/dropMapping.ts`. Mobile should expose the same target
zone ids where the same game action is expected.

## Naming

`p-*` means the side rendered at the bottom of the board: the human-controlled
seat. It does not always mean engine player P1.

`opp-*` means the side rendered at the top of the board: the rival seat.

All drops dispatch on behalf of the current `humanSide`. The engine permission
state is the source of truth for whether a drop is legal.

## Drag Sources

| Source            | Zone id   | DOM hooks                                                   | Notes                                                           |
| ----------------- | --------- | ----------------------------------------------------------- | --------------------------------------------------------------- |
| Player hand card  | `p-hand`  | `data-testid="card"`, `data-zone="p-hand"`, `data-card-id`  | Used for playing cards and selling cards.                       |
| Player field unit | `p-field` | `data-testid="card"`, `data-zone="p-field"`, `data-card-id` | Used for attacking rival units or attacking the rival directly. |

Opponent hand cards are currently rendered face-down in mobile and are not a
drop source.

## Droppable Targets

| Use case                      | Source    | Target                           | Target type | Expected action | Legal only when                                            |
| ----------------------------- | --------- | -------------------------------- | ----------- | --------------- | ---------------------------------------------------------- |
| Play a non-Gear card          | `p-hand`  | `p-field`                        | Zone        | `playCard`      | Source card has legal `playCard`.                          |
| Attach Gear                   | `p-hand`  | Friendly field card in `p-field` | Card        | `playCard`      | Source card is `cardType="gear"` and has legal `playCard`. |
| Sell a card                   | `p-hand`  | `p-eddies`                       | Zone        | `sellCard`      | Source card has legal `sellCard`.                          |
| Attack a rival unit           | `p-field` | Rival field card in `opp-field`  | Card        | `attackUnit`    | Source and target form a legal `attackUnit` pair.          |
| Attack rival directly / steal | `p-field` | `opp-pinfo`                      | Zone        | `attackRival`   | Source card has legal `attackRival`.                       |

## Mobile Target Surfaces

### Player Field: `p-field`

Surface: the whole active player field area.

Component path:
`apps/multi-game-simulator/src/games/cyberpunk/components/GameBoard/FieldZone.tsx`

Expected QA checks:

- Drag a legal hand Unit or Program onto the player field.
- Expected dispatch/effect: card leaves hand and resolves `playCard`.
- Drag an illegal hand card onto the field.
- Expected effect: no state change.

Useful selectors:

- Field zone: `[data-testid="field-zone"][data-side="<human side>"]`
- Hand card source: `[data-zone="p-hand"][data-card-id="<card id>"]`

### Friendly Field Card: `p-field` Card Target

Surface: an individual friendly Unit in the player field.

Component path:
`apps/multi-game-simulator/src/games/cyberpunk/components/GameBoard/Card.tsx`

Expected QA checks:

- Drag a legal Gear card from hand onto a friendly Unit.
- Expected dispatch/effect: `playCard` resolves for the Gear.
- Drag a non-Gear card onto a friendly Unit.
- Expected effect: no state change.

Useful selectors:

- Friendly field card: `[data-zone="p-field"][data-card-id="<target unit id>"]`
- Source Gear: `[data-zone="p-hand"][data-card-type="gear"]`

### Eddies Helper: `p-eddies`

Surface: the player Eddies helper chip in the bottom-left helper cluster.

Component path:
`apps/multi-game-simulator/src/games/cyberpunk/components/GameBoard/MobileBoard.tsx`

Expected QA checks:

- Drag a legal sellable card from hand.
- The Eddies chip should enlarge and show `Drop to sell`, `+1 Eddie`, and
  `data-drop-ready="sellCard"`.
- Drop the card on the Eddies chip.
- Expected dispatch/effect: `sellCard`; card leaves hand and becomes an Eddie.
- Drag a hand card that cannot legally be sold.
- Expected visual: no enlarged sell target and no `data-drop-ready`.
- Drop an illegal card on Eddies.
- Expected effect: no state change.

Useful selectors:

- Eddies target: `[data-drop-zone="p-eddies"]`
- Sell-ready state: `[data-drop-zone="p-eddies"][data-drop-ready="sellCard"]`

### Rival Field Card: `opp-field` Card Target

Surface: an individual rival Unit in the rival field.

Component path:
`apps/multi-game-simulator/src/games/cyberpunk/components/GameBoard/Card.tsx`

Expected QA checks:

- During attack phase, drag a legal ready attacker onto a legal spent rival
  Unit.
- Expected dispatch/effect: `attackUnit`.
- Drag an attacker onto a rival Unit that is not a legal target.
- Expected effect: no state change.

Useful selectors:

- Attacker source: `[data-zone="p-field"][data-card-id="<attacker id>"]`
- Rival target: `[data-zone="opp-field"][data-card-id="<defender id>"]`
- Valid drop hint on target cards may expose `data-drop-hint="attackUnit"`.

### Rival Direct Attack / Steal Target: `opp-pinfo`

Surface: the rival Gig half of the center row on mobile. This maps to the
desktop rival info target.

Component path:
`apps/multi-game-simulator/src/games/cyberpunk/components/GameBoard/MobileBoard.tsx`

Expected QA checks:

- During attack phase, drag a legal direct attacker from player field.
- The rival direct target should become visible with `Steal` / `Rival Gigs`
  copy and `data-active="true"`.
- Drop the attacker on the rival direct target.
- Expected dispatch/effect: `attackRival`, followed by the normal steal flow.
- Drag a field card that cannot legally attack the rival directly.
- Expected visual: direct target remains inactive.
- Drop an illegal card on the target.
- Expected effect: no state change.

Useful selectors:

- Direct target: `[data-drop-zone="opp-pinfo"]`
- Active state: `[data-drop-zone="opp-pinfo"][data-active="true"]`
- Source attacker: `[data-zone="p-field"][data-card-id="<attacker id>"]`

## Non-Targets On Mobile

These zones may have visual UI, but they are not currently mapped to a mobile
drop action:

- `p-deck`, `opp-deck`
- `p-trash`, `opp-trash`
- `p-legends`, `opp-legends`
- `p-fixer`, `opp-fixer`
- `opp-hand`
- `opp-eddies`

If a test drops a card on these surfaces, expected behavior is no state change
unless a future task explicitly adds a mapping.

## Adapter Coverage

The pure adapter tests live in:

`apps/multi-game-simulator/src/games/cyberpunk/engine/__tests__/dropMapping.test.ts`

They currently cover:

- `p-hand` to `p-eddies` -> `sellCard`
- `p-hand` to `p-field` -> `playCard`
- `p-field` to `opp-pinfo` -> `attackRival`

QA e2e tests should complement these by verifying the rendered mobile surfaces,
drag gestures, visual target states, and resulting board changes.
