# Move Enumeration Guide

**@tcg/core** provides a comprehensive move enumeration system that enables AI agents and UI components to discover all available moves with their valid parameters at any game state.

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [Defining Enumerators](#defining-enumerators)
5. [Using enumerateMoves()](#using-enumeratemoves)
6. [AI Agent Integration](#ai-agent-integration)
7. [UI Component Integration](#ui-component-integration)
8. [Advanced Patterns](#advanced-patterns)
9. [Best Practices](#best-practices)
10. [API Reference](#api-reference)

---

## Overview

### What is Move Enumeration?

Move enumeration is the process of discovering all possible moves a player can make, along with their valid parameter combinations. This is essential for:

- **AI Agents**: Need to explore all possible moves to make intelligent decisions
- **UI Components**: Need to show available actions with proper parameters
- **Game Analysis**: Need to explore game trees and possibilities
- **Testing & Debugging**: Need to verify move availability

### How It Works

1. Game developers define **enumerator functions** in move definitions
2. Enumerators generate all possible parameter combinations for a move
3. The engine validates each combination against move conditions
4. Results include move validity, parameters, and optional metadata

---

## Quick Start

### 1. Define an Enumerator

Add an `enumerator` field to your move definition:

```typescript
import { type MoveDefinition } from '@tcg/core';

type PlayCardParams = { cardId: string };

const playCardMove: MoveDefinition<GameState, PlayCardParams> = {
  id: 'play-card',
  name: 'Play Card',
  description: 'Play a card from your hand',
  
  // Enumerator: Generate all possible parameters
  enumerator: (state, context) => {
    // Get all cards in player's hand
    const handCards = context.zones.getCardsInZone('hand', context.playerId);
    
    // Return array of parameter objects
    return handCards.map(cardId => ({ cardId }));
  },
  
  condition: (state, context) => {
    // Validate the move
    const player = state.players.find(p => p.id === context.playerId);
    return player?.mana >= getCardCost(context.params.cardId);
  },
  
  reducer: (draft, context) => {
    // Execute the move
    playCard(draft, context.params.cardId);
  }
};
```

### 2. Enumerate Moves

Use the `enumerateMoves()` method:

```typescript
// Get all valid moves for a player
const moves = engine.enumerateMoves(playerId, {
  validOnly: true,
  includeMetadata: true
});

// Display and execute
for (const move of moves) {
  console.log(`${move.metadata?.displayName}: ${JSON.stringify(move.params)}`);
  
  if (move.isValid) {
    // Can execute this move
    engine.executeMove(move.moveId, {
      playerId: move.playerId,
      params: move.params
    });
  }
}
```

---

## Core Concepts

### EnumeratedMove

The result of enumeration - represents a single move with parameters:

```typescript
type EnumeratedMove<TParams> = {
  moveId: string;              // Move identifier
  playerId: PlayerId;          // Player who can execute
  params: TParams;             // Fully populated parameters
  isValid: boolean;            // Whether move passed condition
  validationError?: {          // If invalid, why?
    reason: string;
    errorCode: string;
    context?: Record<string, unknown>;
  };
  metadata?: {                 // Optional UI/AI metadata
    displayName?: string;
    description?: string;
    category?: string;
    [key: string]: unknown;
  };
};
```

### MoveEnumerator

Function that generates parameter combinations:

```typescript
type MoveEnumerator<TGameState, TParams> = (
  state: TGameState,
  context: MoveEnumerationContext
) => TParams[];
```

### MoveEnumerationContext

Context provided to enumerators:

```typescript
type MoveEnumerationContext = {
  playerId: PlayerId;
  zones: ZoneOperations;        // Query card locations
  cards: CardOperations;        // Query card state
  game: GameOperations;         // Game-level state
  registry?: CardRegistry;      // Static card definitions
  flow?: {                      // Turn/phase information
    currentPhase?: string;
    turn: number;
    currentPlayer?: PlayerId;
  };
  rng: SeededRNG;              // Deterministic randomness
};
```

---

## Defining Enumerators

### Simple Card Selection

Enumerate all cards in a zone:

```typescript
const playCardMove: MoveDefinition<GameState, PlayCardParams> = {
  id: 'play-card',
  name: 'Play Card',
  
  enumerator: (state, context) => {
    // Get all cards in hand
    const handCards = context.zones.getCardsInZone('hand', context.playerId);
    
    // Return one parameter set per card
    return handCards.map(cardId => ({ cardId }));
  },
  
  condition: (state, context) => {
    return canPlayCard(state, context.params.cardId);
  },
  
  reducer: (draft, context) => {
    playCard(draft, context.params.cardId);
  }
};
```

### Multiple Parameters

Enumerate attacker-target combinations:

```typescript
type AttackParams = {
  attackerId: string;
  targetId: string;
};

const attackMove: MoveDefinition<GameState, AttackParams> = {
  id: 'attack',
  name: 'Attack',
  
  enumerator: (state, context) => {
    const results: AttackParams[] = [];
    
    // Get all friendly creatures that can attack
    const attackers = context.zones.getCardsInZone('field', context.playerId);
    
    // Get all valid targets (opponent creatures)
    const opponents = state.players.filter(p => p.id !== context.playerId);
    
    for (const attackerId of attackers) {
      // Check if this creature can attack
      const attacker = context.cards.getCardMeta(attackerId);
      if (attacker.tapped || attacker.summoningSickness) {
        continue;
      }
      
      // Enumerate all possible targets
      for (const opponent of opponents) {
        const targets = context.zones.getCardsInZone('field', opponent.id);
        
        for (const targetId of targets) {
          results.push({ attackerId, targetId });
        }
        
        // Can also attack player directly
        results.push({ 
          attackerId,
          targetId: opponent.id as string 
        });
      }
    }
    
    return results;
  },
  
  condition: (state, context) => {
    return isValidAttack(state, context.params);
  },
  
  reducer: (draft, context) => {
    executeAttack(draft, context.params);
  }
};
```

### Numeric Parameters

Enumerate different amounts:

```typescript
type DiscardParams = {
  count: number;
};

const discardMove: MoveDefinition<GameState, DiscardParams> = {
  id: 'discard',
  name: 'Discard Cards',
  
  enumerator: (state, context) => {
    const player = state.players.find(p => p.id === context.playerId);
    if (!player) return [];
    
    const handSize = player.hand.length;
    const maxDiscard = handSize;
    
    // Generate options for discarding 1 to maxDiscard cards
    const results: DiscardParams[] = [];
    for (let count = 1; count <= maxDiscard; count++) {
      results.push({ count });
    }
    
    return results;
  },
  
  condition: (state, context) => {
    const player = state.players.find(p => p.id === context.playerId);
    return (player?.hand.length ?? 0) >= context.params.count;
  },
  
  reducer: (draft, context) => {
    discardCards(draft, context.playerId, context.params.count);
  }
};
```

### Mode Selection

Enumerate different modes/options:

```typescript
type ModalSpellParams = {
  mode: 'draw' | 'damage' | 'heal';
  target?: string;
};

const modalSpellMove: MoveDefinition<GameState, ModalSpellParams> = {
  id: 'modal-spell',
  name: 'Cast Modal Spell',
  
  enumerator: (state, context) => {
    const results: ModalSpellParams[] = [];
    
    // Mode 1: Draw cards (no target needed)
    results.push({ mode: 'draw' });
    
    // Mode 2: Deal damage (needs target)
    const damageTargets = getAllValidDamageTargets(state, context);
    for (const target of damageTargets) {
      results.push({ mode: 'damage', target });
    }
    
    // Mode 3: Heal (needs target)
    const healTargets = getAllValidHealTargets(state, context);
    for (const target of healTargets) {
      results.push({ mode: 'heal', target });
    }
    
    return results;
  },
  
  condition: (state, context) => {
    return canCastSpell(state, context.params);
  },
  
  reducer: (draft, context) => {
    castModalSpell(draft, context.params);
  }
};
```

### Moves Without Parameters

For moves with no parameters, return a single empty object:

```typescript
type PassTurnParams = Record<string, never>;

const passTurnMove: MoveDefinition<GameState, PassTurnParams> = {
  id: 'pass-turn',
  name: 'Pass Turn',
  
  enumerator: () => [{}],  // Single empty parameter set
  
  condition: (state, context) => {
    return context.flow?.currentPlayer === context.playerId;
  },
  
  reducer: (draft, context) => {
    context.flow?.endTurn();
  }
};
```

---

## Using enumerateMoves()

### Basic Usage

```typescript
// Get all moves (valid and invalid)
const allMoves = engine.enumerateMoves(playerId);

// Get only valid moves
const validMoves = engine.enumerateMoves(playerId, {
  validOnly: true
});

// Get moves with metadata
const movesWithMeta = engine.enumerateMoves(playerId, {
  includeMetadata: true
});
```

### Filtering Options

```typescript
// Filter to specific move types
const attackMoves = engine.enumerateMoves(playerId, {
  moveIds: ['attack', 'special-attack'],
  validOnly: true
});

// Limit results per move
const limitedMoves = engine.enumerateMoves(playerId, {
  maxPerMove: 10,  // Max 10 parameter combinations per move
  validOnly: true
});
```

### Handling Results

```typescript
const moves = engine.enumerateMoves(playerId, {
  validOnly: true,
  includeMetadata: true
});

for (const move of moves) {
  // Access move information
  console.log(`Move: ${move.moveId}`);
  console.log(`  Name: ${move.metadata?.displayName}`);
  console.log(`  Description: ${move.metadata?.description}`);
  console.log(`  Params:`, move.params);
  console.log(`  Valid: ${move.isValid}`);
  
  // Execute if desired
  if (move.isValid) {
    const result = engine.executeMove(move.moveId, {
      playerId: move.playerId,
      params: move.params
    });
    
    if (result.success) {
      console.log('Move executed successfully!');
    }
  }
}
```

### Error Handling

```typescript
const moves = engine.enumerateMoves(playerId, {
  validOnly: false  // Include invalid moves
});

for (const move of moves) {
  if (!move.isValid && move.validationError) {
    console.log(`${move.moveId} failed:`);
    console.log(`  Reason: ${move.validationError.reason}`);
    console.log(`  Code: ${move.validationError.errorCode}`);
    console.log(`  Context:`, move.validationError.context);
  }
}
```

---

## AI Agent Integration

### Simple Random AI

```typescript
function randomAI(engine: RuleEngine, playerId: PlayerId) {
  // Get all valid moves
  const moves = engine.enumerateMoves(playerId, {
    validOnly: true
  });
  
  if (moves.length === 0) {
    console.log('No valid moves available');
    return;
  }
  
  // Pick a random move
  const randomIndex = Math.floor(Math.random() * moves.length);
  const selectedMove = moves[randomIndex];
  
  // Execute it
  if (selectedMove) {
    engine.executeMove(selectedMove.moveId, {
      playerId: selectedMove.playerId,
      params: selectedMove.params
    });
  }
}
```

### Greedy AI with Scoring

```typescript
function greedyAI(engine: RuleEngine, playerId: PlayerId) {
  const moves = engine.enumerateMoves(playerId, {
    validOnly: true
  });
  
  if (moves.length === 0) return;
  
  // Score each move
  const scoredMoves = moves.map(move => ({
    move,
    score: evaluateMove(engine.getState(), move)
  }));
  
  // Sort by score (descending)
  scoredMoves.sort((a, b) => b.score - a.score);
  
  // Execute best move
  const bestMove = scoredMoves[0]?.move;
  if (bestMove) {
    engine.executeMove(bestMove.moveId, {
      playerId: bestMove.playerId,
      params: bestMove.params
    });
  }
}

function evaluateMove(state: GameState, move: EnumeratedMove): number {
  // Custom scoring logic
  let score = 0;
  
  if (move.moveId === 'attack') {
    score += 10;  // Aggressive strategy
  } else if (move.moveId === 'playCard') {
    score += 5;   // Building board
  }
  
  return score;
}
```

### Minimax AI (with depth limit)

```typescript
function minimaxAI(
  engine: RuleEngine,
  playerId: PlayerId,
  depth: number = 2
): void {
  const moves = engine.enumerateMoves(playerId, {
    validOnly: true
  });
  
  let bestMove: EnumeratedMove | null = null;
  let bestScore = -Infinity;
  
  for (const move of moves) {
    // Simulate move
    const result = engine.executeMove(move.moveId, {
      playerId: move.playerId,
      params: move.params
    });
    
    if (!result.success) continue;
    
    // Evaluate resulting state
    const score = minimax(engine, playerId, depth - 1, false);
    
    // Undo move
    engine.undo();
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  // Execute best move
  if (bestMove) {
    engine.executeMove(bestMove.moveId, {
      playerId: bestMove.playerId,
      params: bestMove.params
    });
  }
}

function minimax(
  engine: RuleEngine,
  playerId: PlayerId,
  depth: number,
  isMaximizing: boolean
): number {
  if (depth === 0) {
    return evaluateState(engine.getState(), playerId);
  }
  
  const moves = engine.enumerateMoves(playerId, {
    validOnly: true
  });
  
  if (moves.length === 0) {
    return evaluateState(engine.getState(), playerId);
  }
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of moves) {
      engine.executeMove(move.moveId, {
        playerId: move.playerId,
        params: move.params
      });
      const score = minimax(engine, getNextPlayer(engine), depth - 1, false);
      engine.undo();
      maxScore = Math.max(maxScore, score);
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      engine.executeMove(move.moveId, {
        playerId: move.playerId,
        params: move.params
      });
      const score = minimax(engine, getNextPlayer(engine), depth - 1, true);
      engine.undo();
      minScore = Math.min(minScore, score);
    }
    return minScore;
  }
}
```

---

## UI Component Integration

### React Hook

```typescript
import { useState, useEffect } from 'react';
import type { RuleEngine, EnumeratedMove, PlayerId } from '@tcg/core';

function useAvailableMoves(engine: RuleEngine, playerId: PlayerId) {
  const [moves, setMoves] = useState<EnumeratedMove[]>([]);
  
  useEffect(() => {
    const enumeratedMoves = engine.enumerateMoves(playerId, {
      validOnly: true,
      includeMetadata: true
    });
    
    setMoves(enumeratedMoves);
  }, [engine, playerId]);
  
  return moves;
}

// Usage in component
function GameBoard({ engine, playerId }: Props) {
  const availableMoves = useAvailableMoves(engine, playerId);
  
  return (
    <div>
      <h2>Available Actions</h2>
      {availableMoves.map((move, idx) => (
        <button
          key={idx}
          onClick={() => {
            engine.executeMove(move.moveId, {
              playerId: move.playerId,
              params: move.params
            });
          }}
        >
          {move.metadata?.displayName || move.moveId}
        </button>
      ))}
    </div>
  );
}
```

### Grouped Action Menu

```typescript
function ActionMenu({ engine, playerId }: Props) {
  const moves = engine.enumerateMoves(playerId, {
    validOnly: true,
    includeMetadata: true
  });
  
  // Group moves by category
  const grouped = moves.reduce((acc, move) => {
    const category = move.metadata?.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(move);
    return acc;
  }, {} as Record<string, EnumeratedMove[]>);
  
  return (
    <div className="action-menu">
      {Object.entries(grouped).map(([category, categoryMoves]) => (
        <div key={category} className="action-group">
          <h3>{category}</h3>
          {categoryMoves.map((move, idx) => (
            <ActionButton key={idx} move={move} engine={engine} />
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Card Play UI

```typescript
function HandDisplay({ engine, playerId }: Props) {
  const moves = engine.enumerateMoves(playerId, {
    moveIds: ['playCard'],
    validOnly: true,
    includeMetadata: true
  });
  
  return (
    <div className="hand">
      {moves.map((move, idx) => {
        const cardId = move.params.cardId;
        
        return (
          <CardDisplay
            key={idx}
            cardId={cardId}
            playable={move.isValid}
            onClick={() => {
              engine.executeMove(move.moveId, {
                playerId: move.playerId,
                params: move.params
              });
            }}
          />
        );
      })}
    </div>
  );
}
```

---

## Advanced Patterns

### Conditional Enumeration

Only enumerate when conditions are met:

```typescript
enumerator: (state, context) => {
  // Check if it's player's turn
  if (context.flow?.currentPlayer !== context.playerId) {
    return [];  // No moves available
  }
  
  // Check if player has resources
  const player = state.players.find(p => p.id === context.playerId);
  if (!player || player.mana === 0) {
    return [];
  }
  
  // Enumerate normally
  return enumerateCards(state, context);
}
```

### Progressive Enumeration

Enumerate in stages for complex moves:

```typescript
enumerator: (state, context) => {
  const results: ComplexParams[] = [];
  
  // Stage 1: Choose card to play
  const handCards = context.zones.getCardsInZone('hand', context.playerId);
  
  for (const cardId of handCards) {
    const card = context.registry?.getCard(cardId);
    
    // Stage 2: Choose mode (if modal card)
    const modes = card?.modes || ['default'];
    
    for (const mode of modes) {
      // Stage 3: Choose targets (if needed)
      if (requiresTargets(card, mode)) {
        const targets = getValidTargets(state, context, cardId, mode);
        
        for (const target of targets) {
          results.push({ cardId, mode, target });
        }
      } else {
        results.push({ cardId, mode });
      }
    }
  }
  
  return results;
}
```

### Caching Enumerations

For expensive enumerations, consider caching:

```typescript
// In your game logic
const enumerationCache = new Map<string, EnumeratedMove[]>();

function getCachedEnumeration(
  engine: RuleEngine,
  playerId: PlayerId
): EnumeratedMove[] {
  const stateHash = hashGameState(engine.getState());
  const cacheKey = `${playerId}-${stateHash}`;
  
  if (enumerationCache.has(cacheKey)) {
    return enumerationCache.get(cacheKey)!;
  }
  
  const moves = engine.enumerateMoves(playerId, {
    validOnly: true
  });
  
  enumerationCache.set(cacheKey, moves);
  return moves;
}
```

---

## Best Practices

### 1. Keep Enumerators Fast

Enumerators are called frequently. Optimize for speed:

```typescript
// ❌ Bad: Inefficient nested loops
enumerator: (state, context) => {
  const results = [];
  for (const card1 of getAllCards(state)) {
    for (const card2 of getAllCards(state)) {
      for (const card3 of getAllCards(state)) {
        results.push({ card1, card2, card3 });
      }
    }
  }
  return results;  // Potentially huge!
}

// ✅ Good: Efficient enumeration
enumerator: (state, context) => {
  // Only enumerate cards in relevant zones
  const handCards = context.zones.getCardsInZone('hand', context.playerId);
  
  // Early filtering
  return handCards
    .filter(cardId => isPlayable(cardId))
    .map(cardId => ({ cardId }));
}
```

### 2. Return Empty Array for No Moves

Always return an array (never null/undefined):

```typescript
// ✅ Good
enumerator: (state, context) => {
  if (!canAct(state, context.playerId)) {
    return [];  // Empty array
  }
  
  return enumerateActions(state, context);
}
```

### 3. Use Context Operations

Leverage provided operations instead of manual state traversal:

```typescript
// ❌ Bad: Manual state traversal
enumerator: (state, context) => {
  const cards = [];
  for (const zone of state.zones) {
    if (zone.owner === context.playerId) {
      cards.push(...zone.cards);
    }
  }
  return cards.map(c => ({ cardId: c }));
}

// ✅ Good: Use context.zones
enumerator: (state, context) => {
  const cards = context.zones.getCardsInZone('hand', context.playerId);
  return cards.map(cardId => ({ cardId }));
}
```

### 4. Validate in Conditions

Don't filter in enumerators - let conditions do validation:

```typescript
// ❌ Bad: Filtering in enumerator
enumerator: (state, context) => {
  const player = state.players.find(p => p.id === context.playerId);
  const handCards = player?.hand || [];
  
  // Filtering valid cards here
  return handCards
    .filter(cardId => canAffordCard(state, cardId))
    .map(cardId => ({ cardId }));
}

// ✅ Good: Enumerate all, validate in condition
enumerator: (state, context) => {
  const handCards = context.zones.getCardsInZone('hand', context.playerId);
  return handCards.map(cardId => ({ cardId }));
},

condition: (state, context) => {
  return canAffordCard(state, context.params.cardId);
}
```

### 5. Provide Meaningful Metadata

Help UI/AI with rich metadata:

```typescript
const move: MoveDefinition<GameState, Params> = {
  id: 'powerful-ability',
  name: 'Devastating Strike',
  description: 'Deal massive damage to target',
  
  metadata: {
    category: 'combat',
    tags: ['aggressive', 'high-impact'],
    priority: 10,  // High priority for AI
    cost: { mana: 5 },
    icon: 'sword-strike.png'
  },
  
  enumerator: (state, context) => {
    // ...
  }
};
```

---

## API Reference

### RuleEngine.enumerateMoves()

```typescript
enumerateMoves(
  playerId: PlayerId,
  options?: MoveEnumerationOptions
): EnumeratedMove<any>[]
```

**Parameters:**
- `playerId`: Player to enumerate moves for
- `options`: Optional configuration

**Options:**
- `validOnly?: boolean` - Only return valid moves (default: false)
- `includeMetadata?: boolean` - Include metadata in results (default: false)
- `moveIds?: string[]` - Filter to specific move IDs (default: all)
- `maxPerMove?: number` - Limit results per move (default: unlimited)

**Returns:** Array of `EnumeratedMove` objects

---

## Migration Guide

### From getValidMoves()

If you're using the old `getValidMoves()` API:

```typescript
// Old API
const validMoves = engine.getValidMoves(playerId);
// Returns: string[] (just move IDs)

// New API
const enumeratedMoves = engine.enumerateMoves(playerId, {
  validOnly: true
});
// Returns: EnumeratedMove[] (with parameters)
```

The old API is still supported but doesn't provide parameter information. Use `enumerateMoves()` for full functionality.

---

## Further Reading

- [Move System Guide](./move-system.md)
- [Testing Utilities](./testing-utilities.md)
- [AI Integration Examples](../examples/ai-integration.ts)
- [UI Integration Examples](../examples/ui-integration.tsx)

---

**Happy enumerating! 🎮**

