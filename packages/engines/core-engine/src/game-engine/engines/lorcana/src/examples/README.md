# Lorcana Card Text Analyzer

This folder contains utilities for analyzing and categorizing card text abilities for the Lorcana game engine.

## Overview

The purpose of these utilities is to parse raw card text into structured ability data that can be used by the game engine. This includes:

1. Identifying ability types (activated, triggered, static, keyword, replacement)
2. Extracting keywords from card texts
3. Detecting properties like costs, targets, conditions, and durations
4. Mapping examples of different ability patterns
5. Providing tools for analysis and categorization

## Files

- **`card-texts.ts`**: Collection of raw card text examples from Lorcana cards
- **`ability-type-examples.ts`**: Examples of different ability types
- **`ability-type-mapping.ts`**: Mapping of card texts to ability types with detection algorithm
- **`card-text-parser.ts`**: Utility class for parsing card text into ability data
- **`analyze-card-text.ts`**: Functions to analyze and categorize card texts
- **`effect-type-mapping.ts`**: Mapping of effect types to card text snippets
- **`effect-condition-mapping.ts`**: Mapping of condition types to card text
- **`trigger-timing-mapping.ts`**: Mapping of trigger timings to card text
- **`cost-type-examples.ts`**: Examples of different cost types
- **`target-selector-examples.ts`**: Examples of target selection patterns
- **`keyword-value-examples.ts`**: Examples of keywords with values
- **`duration-pattern-examples.ts`**: Examples of effect duration patterns
- **`player-reference-examples.ts`**: Examples of player references
- **`generate-ability-mapping.ts`**: Script to generate JSON mapping files
- **`test-ability-mapping.ts`**: Test script for ability mapping
- **`test-card-text-parser.ts`**: Test script for the CardTextParser class

## Generated Output

Running the `generate-ability-mapping.ts` script will create the following files in the `output` directory:

- **`ability-mapping.json`**: Complete mapping of all card texts to their ability types
- **`summary.json`**: Statistical summary of the ability types
- **`by-type/activated.json`**: Card texts categorized as activated abilities
- **`by-type/triggered.json`**: Card texts categorized as triggered abilities
- **`by-type/static.json`**: Card texts categorized as static abilities
- **`by-type/keyword.json`**: Card texts categorized as keyword abilities
- **`by-type/replacement.json`**: Card texts categorized as replacement effects
- **`by-type/unknown.json`**: Card texts that couldn't be categorized

## Usage

### Basic Usage

```typescript
import { CardTextParser } from './card-text-parser';

// Parse a card text
const cardText = "Whenever this character quests, gain 1 lore.";
const parsedAbility = CardTextParser.parseAbility(cardText);
console.log(parsedAbility);
// Output: {
//   text: "Whenever this character quests, gain 1 lore.",
//   abilityType: "triggered",
//   hasCost: false,
//   hasTarget: false,
//   hasCondition: false,
//   hasDuration: false
// }

// Check ability type
console.log(CardTextParser.isTriggeredAbility(cardText)); // true

// Extract keywords
const keywordText = "Rush\nEvasive\nResist +2";
const keywords = CardTextParser.extractKeywords(keywordText);
console.log(keywords); // ["Rush", "Evasive", "Resist +2"]
```

### Working with Complex Card Texts

```typescript
import { CardTextParser } from './card-text-parser';

// Parse a complex card text with multiple abilities
const complexText = "Evasive (Only characters with Evasive can challenge this character.)\nWhen you play this character, gain 1 lore.";
const abilities = CardTextParser.parseCardText(complexText);
console.log(abilities);
// Output: [
//   {
//     text: "Evasive (Only characters with Evasive can challenge this character.)",
//     abilityType: "keyword",
//     hasCost: false,
//     hasTarget: false,
//     hasCondition: false,
//     hasDuration: false
//   },
//   {
//     text: "When you play this character, gain 1 lore.",
//     abilityType: "triggered",
//     hasCost: false,
//     hasTarget: false,
//     hasCondition: false,
//     hasDuration: false
//   }
// ]
```

## Ability Type Distribution

From analyzing 2,471 card texts:

- Activated abilities: 313 (13%)
- Triggered abilities: 976 (39%)
- Static abilities: 745 (30%)
- Keyword abilities: 95 (4%)
- Replacement abilities: 2 (0%)
- Uncategorized: 340 (14%)

## Future Enhancements

- Improve detection of uncategorized texts
- Add support for more specific ability properties
- Integrate with the game engine for automated ability parsing
- Develop automated test cases for new card texts 