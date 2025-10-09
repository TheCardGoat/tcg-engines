# Validation Guide

> Type guards and runtime validators for @tcg/core

## Overview

The `@tcg/core/validation` module provides utilities for runtime type validation, type guards, and schema builders. These tools help ensure data integrity, enable type-safe filtering, and support runtime validation of cards, moves, and game states.

## Table of Contents

- [Quick Start](#quick-start)
- [Type Guard Builder](#type-guard-builder)
- [Card Type Guards](#card-type-guards)
- [Validator Builder](#validator-builder)
- [Zod Schema Builders](#zod-schema-builders)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Quick Start

```typescript
import {
  createTypeGuard,
  isCardOfType,
  ValidatorBuilder,
  createValidator,
} from '@tcg/core/validation';

// 1. Type guards for filtering
const isCreature = isCardOfType('creature');
const creatures = cards.filter(isCreature);

// 2. Custom type guards
const isHighCost = createTypeGuard<Card, 'cost', number>('cost', 5);

// 3. Runtime validation
const validator = new ValidatorBuilder<CardData>()
  .required('name', 'Name is required')
  .type('cost', 'number', 'Cost must be a number')
  .min('cost', 0, 'Cost must be non-negative')
  .build();

const result = validator.validate(cardData);
if (!result.success) {
  console.error('Validation errors:', result.errors);
}
```

## Type Guard Builder

Type guards enable type-safe filtering and narrowing in TypeScript.

### Basic Type Guard

```typescript
import { createTypeGuard } from '@tcg/core/validation';

type Card = {
  type: 'creature' | 'spell' | 'artifact';
  name: string;
  cost: number;
};

// Create a type guard that checks card type
const isCreature = createTypeGuard<Card, 'type', 'creature'>('type', 'creature');

const card: Card = { type: 'creature', name: 'Dragon', cost: 5 };

if (isCreature(card)) {
  // TypeScript knows card.type is 'creature' here
  console.log(card.type); // Type: 'creature'
}
```

### Type Guard with Filtering

```typescript
const cards: Card[] = [
  { type: 'creature', name: 'Dragon', cost: 5 },
  { type: 'spell', name: 'Fireball', cost: 3 },
  { type: 'creature', name: 'Goblin', cost: 1 },
];

// Filter array using type guard
const creatures = cards.filter(isCreature);
// creatures has type: Card & { type: 'creature' }[]

// TypeScript knows all elements are creatures
for (const creature of creatures) {
  console.log(creature.type); // Always 'creature'
}
```

### Type Guard for Any Field

```typescript
type ExtendedCard = Card & {
  rarity: 'common' | 'rare' | 'mythic';
  set: string;
};

// Check rarity
const isRare = createTypeGuard<ExtendedCard, 'rarity', 'rare'>('rarity', 'rare');

// Check set
const isBaseSet = createTypeGuard<ExtendedCard, 'set', 'base'>('set', 'base');

// Use in filtering
const rareCards = extendedCards.filter(isRare);
const baseSetCards = extendedCards.filter(isBaseSet);
```

### Complex Value Matching

```typescript
type CardWithAbilities = Card & {
  abilities: string[];
  stats: { power: number; toughness: number };
};

// Type guards work with objects and arrays
const hasFlying = createTypeGuard<CardWithAbilities, 'abilities', string[]>(
  'abilities',
  ['flying']
);

const hasStats = createTypeGuard<CardWithAbilities, 'stats', { power: number; toughness: number }>(
  'stats',
  { power: 2, toughness: 2 }
);
```

## Card Type Guards

Specialized type guards for card filtering and validation.

### isCardOfType

Convenient helper for checking card types:

```typescript
import { isCardOfType } from '@tcg/core/validation';

// Basic usage
const isCreature = isCardOfType('creature');
const isSpell = isCardOfType('spell');
const isArtifact = isCardOfType('artifact');

// Filter arrays
const creatures = cards.filter(isCreature);
const spells = cards.filter(isSpell);

// Type narrowing in conditionals
function processCard(card: Card) {
  if (isCreature(card)) {
    // TypeScript knows card.type is 'creature'
    return procesCreature(card);
  } else if (isSpell(card)) {
    // TypeScript knows card.type is 'spell'
    return processSpell(card);
  }
}
```

### isCardWithField

Check any card field:

```typescript
import { isCardWithField } from '@tcg/core/validation';

type ExtendedCard = Card & {
  rarity: 'common' | 'rare' | 'mythic';
  legendary: boolean;
};

// Check rarity
const isRare = isCardWithField<ExtendedCard, 'rarity', 'rare'>('rarity', 'rare');

// Check if legendary
const isLegendary = isCardWithField<ExtendedCard, 'legendary', true>('legendary', true);

// Use in filters
const rareLegendaries = cards
  .filter(isRare)
  .filter(isLegendary);
```

### Combining Type Guards

#### AND Logic

```typescript
import { combineTypeGuards } from '@tcg/core/validation';

const isCreature = isCardOfType('creature');
const isRare = isCardWithField<ExtendedCard, 'rarity', 'rare'>('rarity', 'rare');
const isLegendary = isCardWithField<ExtendedCard, 'legendary', true>('legendary', true);

// All conditions must pass
const isRareLegendaryCreature = combineTypeGuards([
  isCreature,
  isRare,
  isLegendary,
]);

const rareLegendaryCreatures = cards.filter(isRareLegendaryCreature);
```

#### OR Logic

```typescript
import { combineTypeGuardsOr } from '@tcg/core/validation';

const isCreature = isCardOfType('creature');
const isSpell = isCardOfType('spell');

// Any condition can pass
const isPermanent = combineTypeGuardsOr([isCreature, isSpell]);

const permanents = cards.filter(isPermanent);
```

#### Negation

```typescript
import { negateTypeGuard } from '@tcg/core/validation';

const isCreature = isCardOfType('creature');
const isNotCreature = negateTypeGuard(isCreature);

const nonCreatures = cards.filter(isNotCreature);
```

### Complex Filtering Logic

```typescript
// Build complex filters
const isCheapSpell = combineTypeGuards([
  isCardOfType('spell'),
  createTypeGuard<Card, 'cost', number>('cost', 1), // Can't do <=, use custom
]);

// More complex: low cost creatures or any spell
const isPlayableEarly = combineTypeGuardsOr([
  combineTypeGuards([
    isCardOfType('creature'),
    (card) => card.cost <= 2, // Custom inline type guard
  ]),
  isCardOfType('spell'),
]);

const earlyGameCards = cards.filter(isPlayableEarly);
```

## Validator Builder

Build fluent validation rules for runtime data validation.

### Basic Validation

```typescript
import { ValidatorBuilder } from '@tcg/core/validation';

type CardData = {
  name: string;
  cost: number;
  power?: number;
};

const validator = new ValidatorBuilder<CardData>()
  .required('name', 'Card name is required')
  .type('name', 'string', 'Name must be a string')
  .min('name', 1, 'Name must not be empty')
  .required('cost', 'Cost is required')
  .type('cost', 'number', 'Cost must be a number')
  .min('cost', 0, 'Cost cannot be negative')
  .max('cost', 10, 'Cost cannot exceed 10')
  .build();

// Validate data
const result = validator.validate({
  name: 'Dragon',
  cost: 5,
});

if (result.success) {
  console.log('Valid card:', result.data);
} else {
  console.error('Validation errors:', result.errors);
  // ['Cost cannot be negative', 'Name must not be empty']
}
```

### Validation Methods

#### required()

Validates that a field is present and not empty:

```typescript
validator
  .required('name', 'Name is required')
  .required('cost', 'Cost is required');

// Empty strings fail
validator.validate({ name: '', cost: 0 }); // Fails: "Name is required"

// null/undefined fail
validator.validate({ name: null, cost: 0 }); // Fails: "Name is required"
```

#### type()

Validates that a field is of a specific type:

```typescript
validator
  .type('name', 'string', 'Name must be a string')
  .type('cost', 'number', 'Cost must be a number')
  .type('legendary', 'boolean', 'Legendary must be boolean')
  .type('abilities', 'object', 'Abilities must be object');
```

#### min()

Validates minimum value (numbers) or length (strings):

```typescript
validator
  .min('cost', 0, 'Cost must be non-negative')
  .min('name', 1, 'Name must have at least 1 character')
  .min('power', 1, 'Power must be at least 1');
```

#### max()

Validates maximum value (numbers) or length (strings):

```typescript
validator
  .max('cost', 10, 'Cost cannot exceed 10')
  .max('name', 50, 'Name must be at most 50 characters')
  .max('power', 20, 'Power cannot exceed 20');
```

#### custom()

Add custom validation logic:

```typescript
validator
  .custom('cost', (cost) => cost % 1 === 0, 'Cost must be an integer')
  .custom('name', (name) => name.match(/^[A-Z]/), 'Name must start with capital')
  .custom('power', (power) => power > 0, 'Power must be positive');
```

### Validation Options

```typescript
// Abort on first error
const quickValidator = new ValidatorBuilder<CardData>({
  abortEarly: true,
})
  .required('name', 'Name is required')
  .required('cost', 'Cost is required')
  .build();

// Collect all errors (default)
const thoroughValidator = new ValidatorBuilder<CardData>({
  abortEarly: false,
})
  .required('name', 'Name is required')
  .required('cost', 'Cost is required')
  .build();
```

### Functional Style

```typescript
import { createValidator } from '@tcg/core/validation';

const validator = createValidator<CardData>((builder) =>
  builder
    .required('name', 'Name is required')
    .type('name', 'string', 'Name must be a string')
    .min('cost', 0, 'Cost must be non-negative')
    .custom('cost', (cost) => cost <= 10, 'Cost too high')
);

const result = validator.validate(cardData);
```

### Reusable Validators

```typescript
// Base validator for all cards
function createBaseCardValidator<T extends CardData>() {
  return new ValidatorBuilder<T>()
    .required('name', 'Name is required')
    .type('name', 'string', 'Name must be a string')
    .min('name', 1, 'Name must not be empty')
    .required('cost', 'Cost is required')
    .type('cost', 'number', 'Cost must be a number')
    .min('cost', 0, 'Cost must be non-negative');
}

// Extend for creatures
type CreatureCard = CardData & {
  power: number;
  toughness: number;
};

const creatureValidator = createBaseCardValidator<CreatureCard>()
  .required('power', 'Power is required')
  .type('power', 'number', 'Power must be a number')
  .min('power', 0, 'Power must be non-negative')
  .required('toughness', 'Toughness is required')
  .type('toughness', 'number', 'Toughness must be a number')
  .min('toughness', 0, 'Toughness must be non-negative')
  .build();

// Extend for spells
type SpellCard = CardData & {
  instant: boolean;
};

const spellValidator = createBaseCardValidator<SpellCard>()
  .required('instant', 'Instant flag is required')
  .type('instant', 'boolean', 'Instant must be boolean')
  .build();
```

## Zod Schema Builders

For advanced validation with Zod integration (if using Zod in your project):

```typescript
import {
  createCardSchema,
  extendSchema,
  mergeSchemas,
  createDiscriminatedUnion,
} from '@tcg/core/validation';
import { z } from 'zod';

// Create base card schema
const baseCardSchema = createCardSchema({
  name: z.string().min(1),
  cost: z.number().min(0).max(10),
});

// Extend with additional fields
const creatureSchema = extendSchema(baseCardSchema, {
  type: z.literal('creature'),
  power: z.number().min(0),
  toughness: z.number().min(0),
});

const spellSchema = extendSchema(baseCardSchema, {
  type: z.literal('spell'),
  instant: z.boolean(),
});

// Create discriminated union
const cardSchema = createDiscriminatedUnion('type', [
  creatureSchema,
  spellSchema,
]);

// Validate
const result = cardSchema.safeParse(cardData);
```

## Best Practices

### 1. Use Type Guards for Filtering

```typescript
// GOOD - Type-safe filtering
const creatures = cards.filter(isCardOfType('creature'));
// creatures: Card & { type: 'creature' }[]

// BAD - No type narrowing
const creatures = cards.filter(card => card.type === 'creature');
// creatures: Card[]
```

### 2. Combine Type Guards for Complex Logic

```typescript
// GOOD - Readable and composable
const isPlayable = combineTypeGuards([
  isCardOfType('creature'),
  (card) => card.cost <= availableMana,
  (card) => !card.exhausted,
]);

// BAD - Hard to read nested conditions
const isPlayable = (card: Card) =>
  card.type === 'creature' &&
  card.cost <= availableMana &&
  !card.exhausted;
```

### 3. Validate at Boundaries

```typescript
// Validate data at system boundaries
export function importCard(json: unknown): Card {
  const result = cardValidator.validate(json);

  if (!result.success) {
    throw new Error(`Invalid card: ${result.errors.join(', ')}`);
  }

  return result.data;
}
```

### 4. Create Reusable Validators

```typescript
// Create once, reuse everywhere
const validators = {
  card: createCardValidator(),
  move: createMoveValidator(),
  gameState: createGameStateValidator(),
};

// Use throughout application
export function validateMove(move: unknown) {
  return validators.move.validate(move);
}
```

### 5. Use Custom Validators for Business Logic

```typescript
const validator = new ValidatorBuilder<Card>()
  .required('name', 'Name is required')
  .custom(
    'cost',
    (cost) => cost <= maxCostForRarity(card.rarity),
    'Cost too high for rarity'
  )
  .custom(
    'abilities',
    (abilities) => validateAbilitySynergy(abilities),
    'Abilities conflict with each other'
  )
  .build();
```

### 6. Provide Clear Error Messages

```typescript
// GOOD - Clear, actionable messages
validator
  .required('name', 'Card name is required')
  .min('name', 1, 'Card name must not be empty')
  .max('name', 50, 'Card name must be at most 50 characters');

// BAD - Vague messages
validator
  .required('name', 'Invalid')
  .min('name', 1, 'Error')
  .max('name', 50, 'Too long');
```

## Examples

### Card Filtering Pipeline

```typescript
import {
  isCardOfType,
  isCardWithField,
  combineTypeGuards,
  combineTypeGuardsOr,
} from '@tcg/core/validation';

type GameCard = {
  id: string;
  name: string;
  type: 'creature' | 'spell' | 'artifact';
  cost: number;
  rarity: 'common' | 'rare' | 'mythic';
};

const cards: GameCard[] = [...];

// Find all rare creatures
const rareCreatures = cards.filter(
  combineTypeGuards([
    isCardOfType<GameCard>('creature'),
    isCardWithField<GameCard, 'rarity', 'rare'>('rarity', 'rare'),
  ])
);

// Find all cheap cards (cost 0-2)
const cheapCards = cards.filter((card) => card.cost <= 2);

// Find playable early game cards (cheap creatures or any spell)
const earlyGameCards = cards.filter(
  combineTypeGuardsOr([
    combineTypeGuards([
      isCardOfType<GameCard>('creature'),
      (card) => card.cost <= 2,
    ]),
    isCardOfType<GameCard>('spell'),
  ])
);

// Find high-value targets (rare or mythic creatures with cost 5+)
const highValueTargets = cards.filter(
  combineTypeGuards([
    isCardOfType<GameCard>('creature'),
    (card) => card.cost >= 5,
    combineTypeGuardsOr([
      isCardWithField<GameCard, 'rarity', 'rare'>('rarity', 'rare'),
      isCardWithField<GameCard, 'rarity', 'mythic'>('rarity', 'mythic'),
    ]),
  ])
);
```

### Complete Validation System

```typescript
import { ValidatorBuilder, type Validator } from '@tcg/core/validation';

type CardData = {
  name: string;
  type: 'creature' | 'spell';
  cost: number;
  rarity: 'common' | 'rare';
  text: string;
  power?: number;
  toughness?: number;
};

// Create validators for each card type
const baseValidator = new ValidatorBuilder<CardData>()
  .required('name', 'Name is required')
  .type('name', 'string', 'Name must be a string')
  .min('name', 1, 'Name must not be empty')
  .max('name', 50, 'Name must be at most 50 characters')
  .required('cost', 'Cost is required')
  .type('cost', 'number', 'Cost must be a number')
  .min('cost', 0, 'Cost must be non-negative')
  .max('cost', 10, 'Cost must be at most 10')
  .required('text', 'Card text is required')
  .type('text', 'string', 'Text must be a string')
  .max('text', 200, 'Text must be at most 200 characters');

const creatureValidator = new ValidatorBuilder<CardData>()
  // Include base rules
  .required('name', 'Name is required')
  .type('name', 'string', 'Name must be a string')
  .min('name', 1, 'Name must not be empty')
  .required('cost', 'Cost is required')
  .type('cost', 'number', 'Cost must be a number')
  .min('cost', 0, 'Cost must be non-negative')
  // Add creature-specific rules
  .required('power', 'Creatures must have power')
  .type('power', 'number', 'Power must be a number')
  .min('power', 0, 'Power must be non-negative')
  .required('toughness', 'Creatures must have toughness')
  .type('toughness', 'number', 'Toughness must be a number')
  .min('toughness', 0, 'Toughness must be non-negative')
  .build();

// Validation function with type-specific logic
function validateCard(card: CardData): { valid: boolean; errors: string[] } {
  let validator: Validator<CardData>;

  if (card.type === 'creature') {
    validator = creatureValidator;
  } else {
    validator = baseValidator.build();
  }

  const result = validator.validate(card);

  return {
    valid: result.success,
    errors: result.success ? [] : result.errors,
  };
}

// Usage
const card: CardData = {
  name: 'Dragon',
  type: 'creature',
  cost: 5,
  rarity: 'rare',
  text: 'Flying. When this enters the battlefield, deal 2 damage.',
  power: 4,
  toughness: 4,
};

const validation = validateCard(card);
if (!validation.valid) {
  console.error('Validation failed:', validation.errors);
}
```

## Related Documentation

- [Card Tooling Guide](./card-tooling.md) - Card parsing and generation
- [Testing Utilities Guide](./testing-utilities.md) - Test utilities
- [Examples: Custom Validator](../examples/custom-validator.ts) - Runnable validator example
- [API Reference](../../README.md#validation) - Complete API documentation

## Migration from Custom Validation

```typescript
// OLD (custom validation)
function isValidCard(card: any): boolean {
  return (
    typeof card.name === 'string' &&
    card.name.length > 0 &&
    typeof card.cost === 'number' &&
    card.cost >= 0 &&
    card.cost <= 10
  );
}

// NEW (@tcg/core/validation)
import { ValidatorBuilder } from '@tcg/core/validation';

const validator = new ValidatorBuilder<Card>()
  .required('name', 'Name is required')
  .type('name', 'string', 'Name must be a string')
  .min('name', 1, 'Name must not be empty')
  .required('cost', 'Cost is required')
  .type('cost', 'number', 'Cost must be a number')
  .min('cost', 0, 'Cost must be non-negative')
  .max('cost', 10, 'Cost must be at most 10')
  .build();

const result = validator.validate(card);
// Result includes detailed error messages
```

**Benefits of @tcg/core/validation:**
- Clear error messages
- Fluent, readable API
- Type-safe validation rules
- Composable validators
- No external dependencies (except optional Zod)
- Consistent across all games
