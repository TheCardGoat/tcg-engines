# Gundam Card Text Parser

A powerful text parsing system for automatically generating Gundam card abilities from text descriptions. The parser analyzes card text and produces the corresponding ability structures for use in the Gundam card game engine.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Usage](#usage)
- [Examples](#examples)
- [Pattern System](#pattern-system)
- [Extending the Parser](#extending-the-parser)
- [Future Improvements](#future-improvements)

## Overview

The Gundam Text Parser transforms natural language card text into structured ability objects that the game engine can execute. It handles various Gundam-specific mechanics:

- **Basic Effects**: Damage, destroy, draw cards, deploy units
- **Unit Targeting**: Enemy units, friendly units, conditional targeting
- **Power Modification**: Unit power boosts and reductions
- **Cost Effects**: Cost modifications for cards and abilities
- **Keyword Abilities**: Repair, Breach, Support, Blocker, etc.
- **Timing**: Turn-based effects, triggered abilities, conditional effects
- **Modal Effects**: "Choose one" style abilities with multiple options

## Key Features

- **Pattern-based Recognition**: Uses regex patterns to identify effect types
- **Gundam-specific Targeting**: Creates proper targeting objects for units, players, and zones
- **Keyword Effect Support**: Extracts and processes Gundam keyword abilities
- **Timing Support**: Recognizes timing triggers like "when", "at the end of turn"
- **Multi-effect Processing**: Handles cards with multiple effects and abilities
- **Extensible Pattern Database**: Easy to add new patterns for future cards

## Architecture

The parser consists of several key components:

1. **Types** (`types.ts`): Type definitions for parser components and results
2. **Parser** (`parser.ts`): Core text processing and clause identification
3. **Patterns** (`patterns.ts`): Pattern database for effect recognition
4. **Target Mapper** (`target-mapper.ts`): Converts text targeting to target objects
5. **Effect Factory** (`effect-factory.ts`): Creates effect objects from parsed data
6. **Ability Builder** (`ability-builder.ts`): Assembles effects into abilities

## Usage

### Basic Usage

```typescript
import { generateAbilitiesFromText } from '../text-parser';

// Simple card text
const abilities = generateAbilitiesFromText("Deal 2 damage to target enemy unit.");
console.log(abilities);

// Complex card text
const complexAbilities = generateAbilitiesFromText(
  "Choose one: Deal 2 damage to target unit or draw a card."
);
```

### Advanced Usage

```typescript
import { parseGundamText } from '../text-parser';

// Get detailed parsing results
const result = parseGundamText("When this unit is destroyed, draw a card.", {
  debug: true,
});

console.log(result.abilities);  // Generated abilities
console.log(result.warnings);   // Any warnings
console.log(result.errors);     // Any errors
console.log(result.clauses);    // Parsed clauses
```

### Configuration

```typescript
import { parseGundamText } from '../text-parser';

const result = parseGundamText("Deal 2 damage to target enemy unit.", {
  debug: true,               // Enable debug logging
  strictMode: true,          // Throw errors on parsing issues
  handleKeywords: true,      // Process keyword effects
});
```

## Examples

### Basic Effects

```typescript
// Damage effect
const damageText = "Deal 3 damage to target enemy unit.";
const damageResult = parseGundamText(damageText);
// Creates a damage effect with amount 3 targeting an enemy unit

// Draw effect
const drawText = "Draw 2 cards.";
const drawResult = parseGundamText(drawText);
// Creates a draw effect with amount 2

// Deploy effect
const deployText = "Deploy a unit from your hand.";
const deployResult = parseGundamText(deployText);
// Creates a deploy effect targeting a unit in hand
```

### Complex Effects

```typescript
// Modal effect
const modalText = "Choose one: Deal 2 damage to target unit or draw a card.";
const modalResult = parseGundamText(modalText);
// Creates a modal effect with two options

// Triggered ability
const triggeredText = "When this unit is deployed, draw a card.";
const triggeredResult = parseGundamText(triggeredText);
// Creates a triggered ability with an on-deploy trigger

// Keyword ability
const keywordText = "<Repair> <Breach>";
const keywordResult = parseGundamText(keywordText);
// Creates abilities for the Repair and Breach keywords
```

## Pattern System

The parser uses a pattern-based system to recognize different types of effects in card text. Patterns are defined as regular expressions with associated extractor functions that convert matched text into structured effect objects.

### Pattern Structure

```typescript
interface EffectPattern {
  pattern: RegExp;           // The regex pattern to match
  type: string;              // The effect type identifier
  priority?: number;         // Higher priority patterns are checked first
  extractor: (match: RegExpMatchArray) => ParsedEffect;  // Function to extract effect data
}
```

### Built-in Patterns

The parser includes patterns for common Gundam card effects:

- **Damage Effects**: `Deal X damage to target unit`
- **Destroy Effects**: `Destroy target unit`
- **Draw Effects**: `Draw X cards`
- **Deploy Effects**: `Deploy a unit from your hand`
- **Power Effects**: `Target unit gets +X power`
- **Cost Effects**: `Target unit costs X less`
- **Keyword Effects**: `<Repair>`, `<Breach>`, `<Support>`, etc.

## Extending the Parser

### Adding New Patterns

You can extend the parser with custom patterns:

```typescript
import { addPattern } from '../text-parser/patterns';

// Add a custom effect pattern
addPattern('boost', {
  pattern: /boost target unit by (\d+)/i,
  type: 'power',
  priority: 10,
  extractor: (match) => ({
    type: 'power',
    amount: parseInt(match[1], 10),
    parameters: {
      targetText: 'target unit',
    }
  })
});
```

### Adding New Target Types

You can extend the target mapping system:

```typescript
import { GUNDAM_TARGET_PATTERNS } from '../text-parser/target-mapper';

// Add a new target pattern
GUNDAM_TARGET_PATTERNS["random enemy unit"] = {
  type: "unit",
  value: 1,
  filters: [
    { filter: "type", value: "unit" },
    { filter: "owner", value: "opponent" },
  ],
  zone: "battlefield",
  random: true  // Custom property
};
```

## Future Improvements

- **Enhanced Modal Parsing**: Better handling of complex modal effects
- **Variable Targets**: Support for X values and variable targeting
- **State-Based Conditionals**: Better handling of game state conditions
- **Performance Optimizations**: Caching and memoization for large batches
- **Validation System**: Comprehensive validation of generated abilities
- **Test Coverage**: Expand test suite with more card examples 