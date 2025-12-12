---
paths: packages/lorcana-engine/**/*.ts
---

# Lorcana Engine Rules

## Overview

The lorcana-engine package implements Disney Lorcana TCG using the @tcg/core framework. It defines Lorcana-specific zones, moves, phases, and win conditions.

## Package Structure

```
packages/lorcana-engine/src/
├── cards/abilities/        # Ability type definitions
├── engine/                 # LorcanaEngine wrapper
├── game-definition/        # Game definition and config
│   ├── flow/              # Turn structure
│   ├── moves/             # Move handlers
│   │   ├── core/          # Challenge, quest, play-card
│   │   ├── setup/         # Game setup moves
│   │   ├── resources/     # Inkwell moves
│   │   └── abilities/     # Ability activation
│   ├── setup/             # Game initialization
│   ├── trackers/          # State tracking
│   ├── win-conditions/    # Lore victory
│   └── zones/             # Zone configurations
├── operations/            # Lorcana-specific operations
├── targeting/             # Targeting DSL
├── testing/               # Test utilities
├── types/                 # Lorcana types
├── validators/            # Move validators
└── zones/                 # Zone helpers
```

## Lorcana-Specific Concepts

### Ink System
- Cards can be placed into the **inkwell** as resources
- Inkable cards have `inkable: true`
- Ink is spent to play cards

### Zones

| Zone | Description |
|------|-------------|
| `deck` | Draw pile (60 cards) |
| `hand` | Cards in hand |
| `play` | Characters in play |
| `inkwell` | Ink resources |
| `discard` | Discarded cards |

### Card States

```typescript
type LorcanaCardState = {
  damage: number;        // Damage taken
  canQuest: boolean;     // Can quest this turn
  exerted: boolean;      // Tapped/exhausted
};
```

## Core Moves

### Play Card
Play a card from hand by paying ink cost:
- Check ink in inkwell >= card cost
- Move card to play zone
- Character cannot quest/challenge same turn (unless Rush)

### Quest
Exert a character to gain lore:
- Character must be ready (not exerted)
- Character must be able to quest
- Gain lore equal to character's lore value

### Challenge
Exert a character to attack an opponent's exerted character:
- Your character must be ready
- Target must be exerted
- Both deal damage equal to strength
- Characters at or above willpower are banished

### Put Card Into Inkwell
Add a card to inkwell as resource:
- Card must be in hand
- Card must be inkable
- Once per turn limit

## Turn Flow

```
Ready Phase → Set Phase → Draw Phase → Main Phase → End Phase
```

1. **Ready Phase**: Ready all exerted cards
2. **Set Phase**: First player skips draw on turn 1
3. **Draw Phase**: Draw one card
4. **Main Phase**: Play cards, quest, challenge
5. **End Phase**: End of turn triggers

## Win Condition

**Lore Victory**: First player to reach 20 lore wins.

```typescript
const loreVictory: WinCondition = {
  check: (state) => {
    for (const player of state.players) {
      if (player.lore >= 20) {
        return { winner: player.id };
      }
    }
    return null;
  },
};
```

## Testing

Use LorcanaTestEngine for Lorcana-specific tests:

```typescript
import { LorcanaTestEngine } from "@tcg/lorcana/testing";

const engine = new LorcanaTestEngine()
  .withPlayer("player1", { deck: testDeck })
  .withPlayer("player2", { deck: testDeck })
  .build();
```

## Extending

When adding new moves or abilities:
1. Define in appropriate `moves/` subdirectory
2. Add to move registry in `game-definition/index.ts`
3. Write tests following TDD
4. Update type definitions if needed

## Related

- Card definitions: `packages/lorcana-cards/`
- Ability patterns: `.claude/skills/lorcana-cards/`
