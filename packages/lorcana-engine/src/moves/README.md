# Moves

This directory contains all move handlers for Lorcana - the functions that execute player actions and update game state.

## Structure

### Core Move Files

- **`play-card.ts`** - Play a card from hand to play zone
- **`quest.ts`** - Quest with a character to gain lore
- **`challenge.ts`** - Challenge an opponent's character
- **`ink-card.ts`** - Put a card into the inkwell
- **`pass-turn.ts`** - Pass priority or end turn
- **`activate-ability.ts`** - Activate a card's ability
- **`shift.ts`** - Shift a character onto another
- **`sing.ts`** - Use Singer ability to play songs
- **`move-character.ts`** - Move character to/from location
- **`index.ts`** - Move registry and exports

### Validators Directory

- **`validators/`** - Move validation logic
  - `play-card-validator.ts` - Validate play card moves
  - `quest-validator.ts` - Validate quest moves
  - `challenge-validator.ts` - Validate challenge moves
  - etc.

## Purpose

Moves are the primary way players interact with the game. Each move handler:

1. **Validates** the move is legal in current state
2. **Updates** game state immutably via Immer
3. **Triggers** any resulting effects or abilities
4. **Returns** success/failure result

## Move Structure

Each move follows this pattern:

```typescript
import type { Move, MoveContext } from "@tcg/core";
import type { LorcanaState } from "../types";

export const playCardMove: Move<LorcanaState> = {
  id: "playCard",
  
  // Validate move is legal
  validate: (state: LorcanaState, context: MoveContext) => {
    const { playerId, params } = context;
    const { cardId, targetZone } = params;
    
    // Validation logic
    if (!isValidPlayCardMove(state, playerId, cardId)) {
      return {
        valid: false,
        error: "Cannot play this card",
        errorCode: "INVALID_PLAY",
      };
    }
    
    return { valid: true };
  },
  
  // Execute move (state is Immer draft, mutate freely)
  execute: (state: LorcanaState, context: MoveContext) => {
    const { playerId, params } = context;
    const { cardId } = params;
    
    // Move card from hand to play
    moveCard(state, cardId, "hand", "play");
    
    // Deduct ink cost
    deductInk(state, playerId, getCardCost(state, cardId));
    
    // Mark card as played this turn
    state.cards[cardId].playedThisTurn = true;
    
    // Trigger "when played" abilities
    triggerPlayedAbilities(state, cardId);
  },
};
```

## Validation Pattern

Validation ensures moves are legal before execution:

```typescript
// Separate validator functions for reusability
export const isValidPlayCardMove = (
  state: LorcanaState,
  playerId: PlayerId,
  cardId: CardId
): boolean => {
  // Check it's player's turn
  if (state.currentPlayer !== playerId) return false;
  
  // Check card is in hand
  if (!isCardInZone(state, cardId, "hand", playerId)) return false;
  
  // Check player has enough ink
  const cost = getCardCost(state, cardId);
  const availableInk = getAvailableInk(state, playerId);
  if (availableInk < cost) return false;
  
  // Check phase allows playing cards
  if (!isMainPhase(state)) return false;
  
  return true;
};
```

## Execution Pattern

Execution updates state using Immer's draft:

```typescript
// State is Immer draft - mutate directly
execute: (state, context) => {
  const { playerId, params } = context;
  
  // Direct mutations work with Immer
  state.zones.hand[playerId] = state.zones.hand[playerId].filter(
    id => id !== params.cardId
  );
  state.zones.play[playerId].push(params.cardId);
  
  // Update card metadata
  state.cards[params.cardId].zone = "play";
  state.cards[params.cardId].playedThisTurn = true;
  
  // Update game state
  state.lorcana.ink[playerId] -= params.cost;
}
```

## Move Registry

All moves registered in `index.ts`:

```typescript
import { playCardMove } from "./play-card";
import { questMove } from "./quest";
import { challengeMove } from "./challenge";
// ... other imports

export const lorcanaMoves = {
  playCard: playCardMove,
  quest: questMove,
  challenge: challengeMove,
  inkCard: inkCardMove,
  passTurn: passTurnMove,
  activateAbility: activateAbilityMove,
  shift: shiftMove,
  sing: singMove,
  moveCharacter: moveCharacterMove,
};

export type LorcanaMoves = typeof lorcanaMoves;
```

## Testing Moves

Each move has comprehensive behavior tests:

```typescript
describe("Play Card Move", () => {
  it("plays character from hand to play zone", () => {
    const engine = createTestEngine();
    engine.executeMove("playCard", {
      playerId: "player1",
      params: { cardId: "card-1" },
    });
    
    const state = engine.getState();
    expect(state.zones.play.player1).toContain("card-1");
    expect(state.zones.hand.player1).not.toContain("card-1");
  });
  
  it("deducts ink cost when playing card", () => {
    // Test implementation
  });
  
  it("rejects playing card without enough ink", () => {
    // Test implementation
  });
});
```

## References

- See `@packages/core/ENGINE_INTEGRATION.md` for move system details
- See `@packages/core/src/moves/` for base move types

