# Specification 4: Core Moves - Inkwell & Play

## Source Rules
- Section 4.3.3 (Inkwell) - Rules 4.3.3-4.3.3.3
- Section 4.3.4 (Play a Card) - Rules 4.3.4-4.3.4.10

## Overview

This specification covers:
- Putting cards into the inkwell
- Playing cards from hand
- Cost calculation and payment
- Alternate costs (Shift, Singer, Sing Together)

## Implementation Files

- `src/moves/inkwell.ts` - Inkwell move logic
- `src/moves/play-card.ts` - Play card move logic
- `src/moves/cost-calculation.ts` - Cost calculation utilities
- `src/moves/payment.ts` - Payment methods (ink, shift, singer)
- `src/moves/move-validation.ts` - Move validation utilities

## Types

### Inkwell Move

```typescript
interface PutIntoInkwellMove {
  type: "putIntoInkwell";
  cardId: CardId;
}
```

### Play Card Move

```typescript
interface PlayCardMove {
  type: "playCard";
  cardId: CardId;
  paymentMethod: PaymentMethod;
}

type PaymentMethod =
  | { type: "ink" }
  | { type: "shift"; targetCardId: CardId }
  | { type: "singer"; singerCardId: CardId }
  | { type: "singTogether"; singerCardIds: CardId[] };
```

### Cost Calculation

```typescript
interface CostCalculation {
  baseCost: number;
  increases: CostModifier[];
  reductions: CostModifier[];
  totalCost: number;
}

interface CostModifier {
  source: CardId | "effect";
  amount: number;
  reason: string;
}
```

### Ink Payment

```typescript
interface InkPayment {
  inkCardsToExert: CardId[];
  totalInk: number;
}
```

### Move Validation

```typescript
interface MoveValidationResult {
  valid: boolean;
  errors?: MoveValidationError[];
}

type MoveValidationError =
  | { type: "ALREADY_INKED_THIS_TURN" }
  | { type: "CARD_NOT_INKABLE" }
  | { type: "INSUFFICIENT_INK"; required: number; available: number }
  | { type: "INVALID_SHIFT_TARGET"; reason: string }
  | { type: "INVALID_SINGER"; reason: string }
  | { type: "NOT_IN_HAND" }
  | { type: "NOT_YOUR_TURN" }
  | { type: "NOT_MAIN_PHASE" };
```

## External API

```typescript
// Inkwell
function canPutIntoInkwell(game: LorcanaGame, cardId: CardId): MoveValidationResult;
function putIntoInkwell(game: LorcanaGame, cardId: CardId): void;
function getInkwellCount(game: LorcanaGame, playerId: PlayerId): number;

// Play Card
function canPlayCard(game: LorcanaGame, cardId: CardId, payment?: PaymentMethod): MoveValidationResult;
function playCard(game: LorcanaGame, move: PlayCardMove): void;
function getPlayableCards(game: LorcanaGame, playerId: PlayerId): CardId[];

// Cost calculation
function calculateCost(game: LorcanaGame, cardId: CardId, payment: PaymentMethod): CostCalculation;
function getAvailableInk(game: LorcanaGame, playerId: PlayerId): number;
function getReadyInkCards(game: LorcanaGame, playerId: PlayerId): CardId[];

// Shift helpers
function canShiftOnto(game: LorcanaGame, shiftingCard: CardId, targetCard: CardId): boolean;
function getValidShiftTargets(game: LorcanaGame, cardId: CardId): CardId[];
function hasShift(card: LorcanaCardDefinition): boolean;
function getShiftCost(card: LorcanaCardDefinition): number | null;
function getShiftTargetName(card: LorcanaCardDefinition): string | null;

// Singer helpers
function canSingSong(game: LorcanaGame, singerId: CardId, songId: CardId): boolean;
function getValidSingers(game: LorcanaGame, songId: CardId): CardId[];
function canSingTogether(game: LorcanaGame, singerIds: CardId[], songId: CardId): boolean;
function getSingerValue(card: LorcanaCardDefinition): number | null;
function getSingTogetherValue(card: LorcanaCardDefinition): number | null;
```

## Test Cases

### Put into Inkwell (Rule 4.3.3)

1. `allows putting inkable card into inkwell` - Basic ink
2. `rejects non-inkable cards (Rule 4.3.3.2)` - Inkwell symbol required
3. `limits to once per turn (Rule 4.3.3)` - Once per turn
4. `resets ink limit at start of turn` - Turn reset
5. `places card facedown and ready (Rule 4.3.3.2)` - Card state
6. `triggers 'when put into inkwell' abilities` - Trigger abilities
7. `requires card to be in hand` - Hand requirement

### Play Card - Basic (Rule 4.3.4)

1. `requires card to be in hand (Rule 4.3.4.1)` - Hand requirement
2. `requires revealing the card (Rule 4.3.4.2)` - Reveal step
3. `calculates correct total cost (Rule 4.3.4.4)` - Cost calculation
4. `applies cost increases then reductions (Rule 4.3.4.4)` - Modifier order
5. `exerts ink cards equal to cost (Rule 4.3.4.5)` - Payment
6. `rejects play with insufficient ink` - Insufficient resources

### Play Card - By Type

1. `characters enter play zone (Rule 4.3.4.6)` - Character destination
2. `items enter play zone (Rule 4.3.4.6)` - Item destination
3. `locations enter play zone (Rule 4.3.4.6)` - Location destination
4. `actions resolve then go to discard (Rule 4.3.4.7)` - Action flow
5. `characters enter play drying (summoning sickness)` - Drying state

### Shift (Rule 10.8)

1. `allows playing on character with matching name` - Name match
2. `requires target character to be in play` - Target in play
3. `pays shift cost instead of ink cost` - Alternate cost
4. `creates stack with shifted card on top` - Stack creation
5. `shifted character is ready regardless of underneath (Rule 10.8.x)` - Ready state
6. `damage carries over from underneath character (Rule 10.8.x)` - Damage transfer
7. `rejects shift if no valid targets` - No valid targets

### Singer (Rule 10.9)

1. `allows singing songs by exerting singer` - Basic singing
2. `singer must have Singer value >= song cost` - Value requirement
3. `singer must be dry to sing` - Dry requirement
4. `exerts singer as alternate cost` - Exert payment
5. `song resolves and goes to discard` - Song resolution

### Sing Together (Rule 10.10)

1. `allows multiple characters to sing together` - Multi-singer
2. `combined Sing Together values must >= song cost` - Combined value
3. `all singers must be dry` - All dry requirement
4. `exerts all participating singers` - All exerted
5. `triggers 'when exerted' abilities for each singer` - Exert triggers

### For Free (Rule 4.3.4.10)

1. `'for free' ignores ink cost` - No ink required
2. `'for free' still requires other costs` - Other costs apply
3. `'for free' still follows play steps` - Normal sequence

## Dependencies

- Depends on Spec 1: Foundation & Types
- Depends on Spec 2: Zones & Card States
- Depends on Spec 3: Turn Structure & Flow

## Acceptance Criteria

- [ ] Inkwell move works with proper validation
- [ ] Play card move works for all card types
- [ ] Cost calculation handles modifiers correctly
- [ ] Shift creates proper stack relationships
- [ ] Singer and Sing Together work as alternate costs
- [ ] All test cases pass
