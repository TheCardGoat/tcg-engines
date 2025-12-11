# Specification 2: Zones & Card States

## Source Rules
- Section 8 (Zones) - Rules 8.1-8.7
- Section 5 (Card States) - Rules 5.1.1-5.1.7

## Overview

This specification covers:
- Five zone types with distinct visibility and ordering rules
- Card states (ready/exerted, damaged/undamaged)
- Drying system (summoning sickness)
- Stack relationships (for Shift)

## Implementation Files

- `src/zones/zone-config.ts` - Zone configuration and types
- `src/zones/zone-queries.ts` - Zone query functions
- `src/zones/zone-mutations.ts` - Zone manipulation functions
- `src/types/card-state.ts` - Card state types
- `src/card-state.ts` - Card state query and mutation functions

## Types

### Zone Configuration

```typescript
type ZoneId = "deck" | "hand" | "play" | "inkwell" | "discard";

interface ZoneConfig {
  id: ZoneId;
  visibility: "public" | "private" | "hidden_identity";
  ordered: boolean;
  faceDown: boolean;
  maxSize?: number;
}

const LORCANA_ZONES: Record<ZoneId, ZoneConfig> = {
  deck: { id: "deck", visibility: "private", ordered: true, faceDown: true },
  hand: { id: "hand", visibility: "private", ordered: false, faceDown: false },
  play: { id: "play", visibility: "public", ordered: false, faceDown: false },
  inkwell: { id: "inkwell", visibility: "hidden_identity", ordered: false, faceDown: true },
  discard: { id: "discard", visibility: "public", ordered: false, faceDown: false },
};
```

### Card States (Rule 5.1)

```typescript
type CardState = "ready" | "exerted";

interface CardInstanceState {
  cardId: CardId;
  state: CardState;           // Rule 5.1.1-5.1.2
  damage: number;             // Rule 5.1.3-5.1.4
  isDrying: boolean;          // Summoning sickness
  stackPosition?: {           // Rule 5.1.5-5.1.7
    isUnder: boolean;
    topCardId?: CardId;
    cardsUnderneath?: CardId[];
  };
  atLocationId?: CardId;      // For characters at locations
}
```

### Zone Movement

```typescript
interface ZoneMovement {
  cardId: CardId;
  from: ZoneId;
  to: ZoneId;
  position?: "top" | "bottom" | "shuffle";
}
```

## External API

```typescript
// Zone queries
function getCardsInZone(state: GameState, zoneId: ZoneId, playerId: PlayerId): CardId[];
function getZoneSize(state: GameState, zoneId: ZoneId, playerId: PlayerId): number;
function isZoneEmpty(state: GameState, zoneId: ZoneId, playerId: PlayerId): boolean;
function getCardZone(state: GameState, cardId: CardId): ZoneId | null;

// Card state queries
function isReady(state: GameState, cardId: CardId): boolean;
function isExerted(state: GameState, cardId: CardId): boolean;
function isDrying(state: GameState, cardId: CardId): boolean;
function isDry(state: GameState, cardId: CardId): boolean;
function isDamaged(state: GameState, cardId: CardId): boolean;
function getDamage(state: GameState, cardId: CardId): number;

// Stack queries (Rule 5.1.5-5.1.7)
function isInStack(state: GameState, cardId: CardId): boolean;
function isTopOfStack(state: GameState, cardId: CardId): boolean;
function isUnderCard(state: GameState, cardId: CardId): boolean;
function getStackCards(state: GameState, topCardId: CardId): CardId[];
function getTopOfStack(state: GameState, cardId: CardId): CardId;

// Card state mutations
function exertCard(state: GameState, cardId: CardId): GameState;
function readyCard(state: GameState, cardId: CardId): GameState;
function addDamage(state: GameState, cardId: CardId, amount: number): GameState;
function removeDamage(state: GameState, cardId: CardId, amount: number): GameState;
function setDrying(state: GameState, cardId: CardId, isDrying: boolean): GameState;

// Zone mutations
function moveCard(state: GameState, movement: ZoneMovement): GameState;
function moveToTop(state: GameState, cardId: CardId, zoneId: ZoneId): GameState;
function moveToBottom(state: GameState, cardId: CardId, zoneId: ZoneId): GameState;
function shuffleZone(state: GameState, zoneId: ZoneId, playerId: PlayerId): GameState;
```

## Test Cases

### Zone Visibility (Rule 8.1)

1. `deck is private - only owner can see contents (Rule 8.2)` - Deck cards hidden from opponent
2. `hand is private - only owner can see contents (Rule 8.3)` - Hand cards hidden from opponent
3. `play is public - all players see cards (Rule 8.4)` - Play zone visible to all
4. `inkwell count is public, card identity is hidden (Rule 8.5)` - Count visible, cards facedown
5. `discard is public - all players see all cards (Rule 8.6)` - Discard fully visible

### Zone Ordering

1. `deck is ordered - has top and bottom (Rule 8.2)` - Deck maintains card order
2. `drawing takes from top of deck` - Draw removes from top
3. `adding to deck can specify top or bottom (Rule 8.2.x)` - Position can be specified

### Card States (Rule 5.1)

1. `cards enter play ready (Rule 5.1.1)` - New cards start ready
2. `exerting turns card sideways (Rule 5.1.2)` - Exert changes state
3. `exerted cards can use abilities without exert cost` - State doesn't prevent non-exert abilities
4. `exerted cards cannot quest or challenge` - State prevents certain actions
5. `damaged cards have 1+ damage counters (Rule 5.1.3)` - Damage tracking
6. `undamaged cards have 0 damage (Rule 5.1.4)` - Default damage state

### Drying State

1. `characters are drying when they enter play` - Summoning sickness
2. `drying characters cannot quest` - Quest restriction
3. `drying characters cannot challenge` - Challenge restriction
4. `drying characters cannot use exert abilities` - Ability restriction
5. `characters become dry at Set step of owner's next turn` - Drying ends timing

### Stacks (Rule 5.1.5-5.1.7)

1. `shifting creates a stack` - Shift creates stack relationship
2. `only top card can be chosen/targeted (Rule 5.1.5)` - Target restriction
3. `top card doesn't gain text of cards under (Rule 5.1.6)` - No ability inheritance
4. `when top card leaves, all cards in stack leave (Rule 5.1.7)` - Stack leaves together
5. `cards are no longer in stack after leaving play` - Stack dissolves on zone change

### Zone Movements

1. `tracks card movement from hand to play` - Play from hand
2. `tracks card movement from play to discard (banish)` - Banishment
3. `tracks card movement from hand to inkwell` - Ink a card
4. `tracks card movement from deck to hand (draw)` - Drawing

## Dependencies

- Depends on Spec 1: Foundation & Types (for CardId, PlayerId types)

## Acceptance Criteria

- [ ] All zone configurations match Lorcana rules
- [ ] Card state queries work correctly
- [ ] Stack relationship tracking works for Shift
- [ ] Drying state is tracked and cleared correctly
- [ ] Zone movements update state correctly
- [ ] All test cases pass
