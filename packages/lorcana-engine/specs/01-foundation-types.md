# Specification 1: Foundation & Types

## Source Rules
- Section 1 (Concepts) - Golden Rules 1.2.1-1.2.4
- Section 2 (Deck Building) - Rules 2.1.1.1-2.1.1.4
- Section 6.2 (Card Parts) - Rules 6.2.1-6.2.14

## Overview

This specification covers the foundational types and structures for the Lorcana engine:
- Ink types (6 colors)
- Card types (Character, Action, Item, Location)
- Card anatomy (all card properties)
- Classifications (Hero, Villain, Princess, etc.)
- Keywords (12 keywords with stacking support)
- Deck validation rules

## Implementation Files

- `src/types/ink-types.ts` - Ink color definitions
- `src/types/card-types.ts` - Card type and anatomy
- `src/types/classifications.ts` - Character classifications
- `src/types/keywords.ts` - Keyword definitions
- `src/types/game-state.ts` - Game state types
- `src/types/deck-validation.ts` - Deck validation types
- `src/deck-validation.ts` - Deck validation logic
- `src/card-utils.ts` - Card type guards and utilities

## Types

### Ink Types (Rule 2.1.1.2)

```typescript
type InkType = "amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel";
```

Six ink colors that define card identity and deck building constraints.

### Card Types (Section 6)

```typescript
type CardType = "character" | "action" | "item" | "location";
type ActionSubtype = "song" | null;
```

### Classifications (Rule 6.2.6)

Character classifications including: Alien, Ally, Broom, Captain, Deity, Detective, Dragon, Dreamborn, Entangled, Fairy, Floodborn, Hero, Hyena, Illusion, Inventor, King, Knight, Madrigal, Mentor, Musketeer, Pirate, Prince, Princess, Puppy, Queen, Racer, Robot, Seven Dwarfs, Sorcerer, Storyborn, Tigger, Titan, Villain.

### Keywords (Section 10)

- Simple keywords: Bodyguard, Evasive, Reckless, Rush, Support, Vanish, Ward
- Parameterized keywords: Challenger +X, Resist +X
- Complex keywords: Shift, Singer X, Sing Together X

### Card Definition (Rule 6.2)

All card properties including:
- id, name, version, fullName
- inkType (single or dual)
- cost, inkable (inkwell symbol)
- cardType
- Character-specific: strength, willpower, lore, classifications
- Action-specific: actionSubtype (Song)
- Location-specific: moveCost
- keywords, abilities

### Deck Validation (Rule 2.1)

- Minimum 60 cards (no maximum)
- Maximum 2 ink types
- Maximum 4 copies per full name

## External API

```typescript
// Deck validation
function validateDeck(cards: LorcanaCardDefinition[]): DeckValidationResult;

// Card type guards
function isCharacter(card: LorcanaCardDefinition): boolean;
function isAction(card: LorcanaCardDefinition): boolean;
function isSong(card: LorcanaCardDefinition): boolean;
function isItem(card: LorcanaCardDefinition): boolean;
function isLocation(card: LorcanaCardDefinition): boolean;

// Card queries
function getFullName(card: LorcanaCardDefinition): string;
function hasKeyword(card: LorcanaCardDefinition, keyword: string): boolean;
function getKeywordValue(card: LorcanaCardDefinition, keyword: string): number | null;
```

## Test Cases

### Deck Validation (Rule 2.1)

1. `rejects deck with fewer than 60 cards (Rule 2.1.1.1)` - Deck with 59 cards should fail validation
2. `accepts deck with exactly 60 cards` - Deck with 60 cards should pass
3. `accepts deck with more than 60 cards` - Deck with 70 cards should pass
4. `rejects deck with 3+ ink types (Rule 2.1.1.2)` - Deck with 3 different ink colors should fail
5. `accepts mono-ink deck` - Deck with only 1 ink type should pass
6. `accepts dual-ink deck` - Deck with exactly 2 ink types should pass
7. `rejects deck with 5+ copies of same full name (Rule 2.1.1.3)` - 5 copies of "Elsa - Ice Queen" should fail
8. `accepts 4 copies of same full name` - 4 copies should pass
9. `treats different versions as different cards` - 4x "Elsa - Ice Queen" + 4x "Elsa - Snow Queen" should pass

### Card Type Guards (Section 6)

1. `identifies character by strength and willpower (Rule 6.1.2)` - Card with strength and willpower is character
2. `identifies action by cardType (Rule 6.3.1)` - Card with cardType "action" is action
3. `identifies song by actionSubtype (Rule 6.3.3)` - Action with actionSubtype "song" is song
4. `identifies item by cardType (Rule 6.4.1)` - Card with cardType "item" is item
5. `identifies location by cardType (Rule 6.5.1)` - Card with cardType "location" is location

### Card Anatomy (Rule 6.2)

1. `generates full name from name + version` - "Elsa" + "Ice Queen" = "Elsa - Ice Queen"
2. `handles dual-ink cards (Rule 6.2.3.1)` - Cards with two ink types
3. `handles cards with two names using ampersand (Rule 6.2.4.1)` - "Flotsam & Jetsam" matches both names

### Keywords

1. `detects simple keywords (Bodyguard, Evasive, etc.)` - hasKeyword returns true for present keywords
2. `extracts value from parameterized keywords (Challenger +2)` - getKeywordValue returns 2
3. `handles multiple keywords on same card` - getAllKeywords returns all keywords

## Dependencies

This spec has no dependencies on other specs and should be implemented first.

## Acceptance Criteria

- [ ] All types are exported from `src/types/index.ts`
- [ ] Deck validation correctly enforces all three rules
- [ ] Card type guards work correctly for all card types
- [ ] Keyword detection works for all 12 keywords
- [ ] All test cases pass
