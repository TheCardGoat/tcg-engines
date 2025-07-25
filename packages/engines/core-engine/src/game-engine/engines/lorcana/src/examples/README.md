# Lorcana Ability Builder

This directory contains tools for parsing card text into structured ability data that can be used by the game engine.

## Overview

The ability builder system transforms raw card text into structured `Ability` objects as defined in `ability-types.ts`. This allows the game engine to programmatically work with card abilities instead of having to manually define each one.

## Key Components

1. **AbilityBuilder** (`../abilities/ability-builder.ts`) - Main class that transforms card text into `Ability` objects.
2. **CardTextParser** (`card-text-parser.ts`) - Basic parser that identifies ability types and components.
3. **Ability Type Mapping** (`ability-type-mapping.ts`) - Helps detect the type of ability from text.
4. **Demo Script** (`demo-ability-builder.ts`) - Demonstrates the ability parser in action.

## How It Works

The system follows these steps to convert card text to structured data:

1. Detect the ability type (activated, triggered, static, keyword, replacement)
2. Parse costs, targets, effects, conditions, and other components
3. Build the complete `Ability` object with appropriate properties

## Usage Examples

Basic usage:

```typescript
import { AbilityBuilder } from "../abilities/ability-builder";

// Parse a single ability
const abilityText = "{E} — Chosen character gets +2 {S} this turn.";
const ability = AbilityBuilder.buildAbility(abilityText);
console.log(ability);

// Parse multiple abilities from a card text
const cardText = "Evasive\nWhenever this character quests, gain 1 lore.";
const abilities = AbilityBuilder.buildAbilities(cardText);
console.log(abilities);
```

## Demo Script

To see the ability parser in action, run:

```
bun src/game-engine/engines/lorcana/src/examples/demo-ability-builder.ts
```

The demo script will parse various example card texts and display the resulting structured ability objects.

## Supported Features

- **Ability Types**: Activated, Triggered, Static, Keyword, Replacement
- **Costs**: Exert, Ink, Banish, Discard, etc.
- **Effects**: Stat Modifications, Draw Cards, Deal Damage, etc.
- **Targets**: Characters, Items, Players, etc.
- **Conditions**: Card presence, Game state checks, etc.
- **Keywords**: Rush, Evasive, Bodyguard, etc.
- **Duration**: This turn, Until leaves play, etc.

## Extending

To extend the ability parser with new functionality:

1. Add new pattern recognition to the extraction methods in `AbilityBuilder`
2. Add support for new ability types in `detectAbilityType` 
3. Update the type definitions in `ability-types.ts` if necessary

## Future Improvements

- Enhanced effect parsing for complex nested effects
- Better support for conditional statements and choices
- Integration with card repository for cross-card references
- Automated validation against game rules 