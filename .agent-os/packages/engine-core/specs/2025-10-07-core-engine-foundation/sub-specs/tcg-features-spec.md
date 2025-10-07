# TCG-Specific Features Specification

This document details the first-class TCG features that make `@tcg/core` a specialized framework for trading card games.

## 1. Zone Management System

### Overview

Zones are fundamental to all TCGs - they represent distinct areas where cards exist (deck, hand, play area, graveyard, etc.). The framework must provide comprehensive zone management as a core feature.

### Zone Types

```typescript
type ZoneVisibility = 'public' | 'private' | 'secret';

type ZoneConfig = {
  id: string;
  name: string;
  visibility: ZoneVisibility;
  owner?: PlayerId; // undefined for shared zones
  ordered: boolean; // does order matter? (deck yes, play area maybe not)
  faceUp: boolean; // are cards face-up by default?
  maxSize?: number; // deck size limit, hand size limit, etc.
};

// Common TCG zones
type StandardZones = {
  deck: Zone;
  hand: Zone;
  play: Zone;
  graveyard: Zone;
  exile: Zone;
  // Games can add custom zones (sideboard, command zone, etc.)
};
```

**Visibility Types:**
- **public**: All players can see all cards (e.g., play area, graveyard)
- **private**: Owner can see cards, opponents see count (e.g., hand)
- **secret**: No one can see cards, only count (e.g., deck, face-down cards)

### Zone Operations

```typescript
type ZoneOperations = {
  // Move cards between zones
  moveCard(cardId: CardId, fromZone: ZoneId, toZone: ZoneId, position?: number): void;
  moveCards(cardIds: CardId[], fromZone: ZoneId, toZone: ZoneId): void;
  
  // Draw cards from deck to hand
  draw(playerId: PlayerId, count: number): CardId[];
  
  // Shuffle zone (typically deck)
  shuffle(zoneId: ZoneId, seed?: string): void;
  
  // Search zone for cards
  search(zoneId: ZoneId, filter: CardFilter): Card[];
  
  // Look at top N cards
  peek(zoneId: ZoneId, count: number): Card[];
  
  // Mill (move from deck to graveyard)
  mill(playerId: PlayerId, count: number): CardId[];
  
  // Reveal cards (make temporarily visible)
  reveal(cardIds: CardId[], duration?: 'permanent' | 'until-end-of-turn'): void;
  
  // Zone queries
  getZoneSize(zoneId: ZoneId): number;
  getCardsInZone(zoneId: ZoneId): Card[];
  getTopCard(zoneId: ZoneId): Card | undefined;
  getBottomCard(zoneId: ZoneId): Card | undefined;
};
```

### Zone State Integration

```typescript
type GameStateWithZones<TCustomZones = {}> = {
  zones: StandardZones & TCustomZones;
  zoneConfigs: Record<string, ZoneConfig>;
  // ... other game state
};

// Zones are part of immutable state
const initialState: GameState = produce(baseState, (draft) => {
  // Initialize zones
  draft.zones.deck = createZone({ 
    id: 'deck', 
    visibility: 'secret',
    ordered: true,
    faceUp: false 
  });
  
  draft.zones.hand = createZone({ 
    id: 'hand', 
    visibility: 'private',
    ordered: false,
    faceUp: true 
  });
  
  // Add cards to deck
  draft.zones.deck.cards = shuffleCards(allCards, seed);
});
```

### Example Usage

```typescript
// In a move reducer
moves: {
  drawCard: {
    move: (state, { playerId }) => {
      const card = state.zones.deck.cards.shift(); // Remove from deck
      if (card) {
        state.zones.hand.cards.push(card); // Add to hand
      }
    },
    condition: (state, { playerId }) => {
      return state.zones.deck.cards.length > 0;
    }
  },
  
  playCard: {
    move: (state, { playerId, cardId }) => {
      const cardIndex = state.zones.hand.cards.findIndex(c => c.id === cardId);
      const card = state.zones.hand.cards.splice(cardIndex, 1)[0];
      state.zones.play.cards.push(card);
      card.zone = 'play';
    }
  }
}
```

---

## 2. Card State Management

### Card Instance Model

```typescript
type CardInstance = {
  // Identity
  id: CardId; // unique instance ID
  definitionId: string; // references card definition
  owner: PlayerId;
  controller: PlayerId; // can differ from owner
  
  // Location
  zone: ZoneId;
  position?: number; // position within zone if ordered
  
  // State flags
  tapped: boolean;
  flipped: boolean; // face-up/face-down
  revealed: boolean; // temporarily visible to all
  phased: boolean; // phased out (not in play but not in another zone)
  
  // Modifications
  counters: Record<string, number>; // +1/+1 counters, loyalty, etc.
  attachments: CardId[]; // attached cards (auras, equipment)
  attachedTo?: CardId; // what this card is attached to
  
  // Temporary modifications
  modifiers: Modifier[]; // temporary stat changes, abilities
  
  // Metadata
  summoningSick?: boolean;
  damageTaken?: number;
  markedForDeath?: boolean;
  
  // Custom game-specific properties
  [key: string]: unknown;
};

type Modifier = {
  id: string;
  type: 'stat' | 'ability' | 'type' | 'keyword';
  value: unknown;
  duration: 'permanent' | 'until-end-of-turn' | 'while-condition';
  condition?: (state: GameState) => boolean;
  source: CardId; // what card created this modifier
};
```

### Card Operations

```typescript
type CardOperations = {
  // State changes
  tap(cardId: CardId): void;
  untap(cardId: CardId): void;
  flip(cardId: CardId): void; // flip face-up/face-down
  reveal(cardId: CardId): void;
  hide(cardId: CardId): void;
  
  // Counters
  addCounter(cardId: CardId, counterType: string, amount: number): void;
  removeCounter(cardId: CardId, counterType: string, amount: number): void;
  getCounters(cardId: CardId, counterType: string): number;
  
  // Attachments
  attach(sourceId: CardId, targetId: CardId): void;
  detach(sourceId: CardId): void;
  
  // Modifiers
  addModifier(cardId: CardId, modifier: Modifier): void;
  removeModifier(cardId: CardId, modifierId: string): void;
  getModifiers(cardId: CardId): Modifier[];
  
  // Damage
  dealDamage(cardId: CardId, amount: number): void;
  healDamage(cardId: CardId, amount: number): void;
  
  // Queries
  getCard(cardId: CardId): CardInstance | undefined;
  isCardTapped(cardId: CardId): boolean;
  isCardInZone(cardId: CardId, zoneId: ZoneId): boolean;
};
```

---

## 3. Card Filtering DSL

### Overview

A declarative query language for selecting cards based on properties, zones, and game state. Essential for implementing card effects like "all creatures with power > 5".

### Filter Syntax

```typescript
type CardFilter = {
  // Zone filtering
  zone?: ZoneId | ZoneId[];
  owner?: PlayerId | PlayerId[];
  controller?: PlayerId | PlayerId[];
  
  // Card properties (from definition)
  type?: string | string[];
  subtype?: string | string[];
  name?: string | RegExp;
  cost?: NumberFilter;
  
  // Game-specific properties
  power?: NumberFilter;
  toughness?: NumberFilter;
  loyalty?: NumberFilter;
  
  // State filtering
  tapped?: boolean;
  revealed?: boolean;
  hasCounters?: string; // has any of this counter type
  
  // Composite filters
  and?: CardFilter[];
  or?: CardFilter[];
  not?: CardFilter;
  
  // Custom predicates
  where?: (card: CardInstance, state: GameState) => boolean;
};

type NumberFilter = 
  | number // exact match
  | { eq: number } // equal
  | { gte: number } // greater than or equal
  | { lte: number } // less than or equal
  | { gt: number } // greater than
  | { lt: number } // less than
  | { between: [number, number] }; // range
```

### Usage Examples

```typescript
// All creatures with power >= 5
const filter1: CardFilter = {
  zone: 'play',
  type: 'creature',
  power: { gte: 5 }
};

// All tapped permanents you control
const filter2: CardFilter = {
  zone: 'play',
  controller: myPlayerId,
  tapped: true
};

// All cards in hand or graveyard
const filter3: CardFilter = {
  zone: ['hand', 'graveyard'],
  owner: myPlayerId
};

// Complex: creatures with power > toughness
const filter4: CardFilter = {
  type: 'creature',
  where: (card, state) => {
    const definition = getCardDefinition(card.definitionId);
    return definition.power > definition.toughness;
  }
};

// Using the DSL
const cards = selectCards(state, filter1);
const count = countCards(state, filter2);
const exists = anyCard(state, filter3);
```

### Builder API

```typescript
// Fluent builder for complex queries
const cards = CardQuery.from(state)
  .inZone('play')
  .ofType('creature')
  .where(card => card.power > 5)
  .controlledBy(playerId)
  .tapped(false)
  .execute();

// Reusable filters
const untappedCreatures = CardQuery.define()
  .ofType('creature')
  .tapped(false);

const myCreatures = untappedCreatures
  .controlledBy(myPlayerId)
  .execute(state);
```

---

## 4. AI Move Enumeration

### Overview

APIs for enumerating all valid moves and legal targets at any game state, enabling AI opponents and move suggestion systems.

### Move Enumeration

```typescript
type EnumeratedMove = {
  name: string; // move name
  args: Record<string, unknown>; // move arguments
  playerId: PlayerId;
  targets?: CardId[]; // required targets
  priority: number; // move priority/rank (for AI heuristics)
  evaluation?: number; // heuristic score (if AI eval enabled)
};

type MoveEnumerator = {
  // Get all valid moves for a player
  enumerateValidMoves(state: GameState, playerId: PlayerId): EnumeratedMove[];
  
  // Get valid targets for a specific move
  enumerateValidTargets(
    state: GameState, 
    moveName: string, 
    partialArgs: Record<string, unknown>
  ): CardId[];
  
  // Check if specific move+args is valid
  isValidMove(state: GameState, move: EnumeratedMove): boolean;
  
  // Get move count (without generating all)
  countValidMoves(state: GameState, playerId: PlayerId): number;
};
```

### Target Enumeration

```typescript
// In move definition, specify target requirements
moves: {
  dealDamage: {
    targets: {
      creature: {
        filter: { zone: 'play', type: 'creature' },
        count: 1, // exactly 1 target
        required: true
      }
    },
    move: (state, { targetId, damage }) => {
      const card = state.cards[targetId];
      card.damageTaken += damage;
    }
  },
  
  multiTarget: {
    targets: {
      creatures: {
        filter: { zone: 'play', type: 'creature' },
        count: { min: 1, max: 3 }, // 1-3 targets
        required: true
      }
    },
    move: (state, { targetIds }) => {
      for (const id of targetIds) {
        // apply effect to each
      }
    }
  }
};

// Enumerator automatically generates all valid target combinations
const moves = enumerator.enumerateValidMoves(state, playerId);
// Returns:
// [
//   { name: 'dealDamage', args: { targetId: 'card-1', damage: 3 } },
//   { name: 'dealDamage', args: { targetId: 'card-2', damage: 3 } },
//   { name: 'multiTarget', args: { targetIds: ['card-1'] } },
//   { name: 'multiTarget', args: { targetIds: ['card-1', 'card-2'] } },
//   // ... all valid combinations
// ]
```

### AI Integration

```typescript
// Simple AI using move enumeration
class SimpleAI {
  selectMove(state: GameState, playerId: PlayerId): EnumeratedMove {
    const validMoves = enumerator.enumerateValidMoves(state, playerId);
    
    // Random AI: pick random move
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }
}

// Heuristic AI using evaluation
class HeuristicAI {
  selectMove(state: GameState, playerId: PlayerId): EnumeratedMove {
    const validMoves = enumerator.enumerateValidMoves(state, playerId);
    
    // Score each move
    const scoredMoves = validMoves.map(move => ({
      move,
      score: this.evaluateMove(state, move)
    }));
    
    // Pick best move
    return scoredMoves.sort((a, b) => b.score - a.score)[0].move;
  }
  
  private evaluateMove(state: GameState, move: EnumeratedMove): number {
    // Game-specific heuristics
    // E.g., prefer playing high-power creatures, dealing damage to opponent, etc.
    return 0;
  }
}
```

---

## 5. Seeded RNG System

### Overview

Deterministic random number generation using seeds, ensuring replay consistency and enabling reproducible testing.

### RNG API

```typescript
type SeededRNG = {
  // Get current seed
  getSeed(): string;
  
  // Set seed (for replay)
  setSeed(seed: string): void;
  
  // Generate random number [0, 1)
  random(): number;
  
  // Generate random integer [min, max)
  randomInt(min: number, max: number): number;
  
  // Pick random element from array
  pick<T>(array: T[]): T;
  
  // Shuffle array (Fisher-Yates with seed)
  shuffle<T>(array: T[]): T[];
  
  // Roll dice
  rollDice(sides: number): number;
  
  // Flip coin
  flipCoin(): 'heads' | 'tails';
  
  // Create child RNG (for sub-operations)
  createChild(): SeededRNG;
};
```

### Integration with Moves

```typescript
// RNG is provided to move reducers via context
moves: {
  shuffleDeck: {
    move: (state, _, { rng }) => {
      state.zones.deck.cards = rng.shuffle(state.zones.deck.cards);
    }
  },
  
  rollDice: {
    move: (state, { playerId }, { rng }) => {
      const roll = rng.rollDice(6);
      state.players[playerId].lastRoll = roll;
      
      if (roll >= 4) {
        // success
      }
    }
  },
  
  drawRandomCard: {
    move: (state, { playerId }, { rng }) => {
      const card = rng.pick(state.zones.deck.cards);
      // move card to hand
    }
  }
};

// Move execution includes RNG context
type MoveContext = {
  rng: SeededRNG;
  timestamp: number;
  playerId: PlayerId;
};
```

### Seeding Strategy

```typescript
// Game initialization with seed
const game = new RuleEngine(definition, {
  seed: 'game-12345-seed', // deterministic replay
});

// Auto-generate seed if not provided
const game2 = new RuleEngine(definition); 
// seed = nanoid() or timestamp-based

// Get seed for replay
const seed = game.getSeed();

// Replay with same seed produces identical results
const replay = new RuleEngine(definition, { seed });
replay.replay(actionLog); // identical state
```

### Testing with Seeds

```typescript
describe('Deck shuffling', () => {
  it('produces same order with same seed', () => {
    const game1 = new RuleEngine(definition, { seed: 'test-seed-1' });
    game1.executeMove({ name: 'shuffleDeck' });
    
    const game2 = new RuleEngine(definition, { seed: 'test-seed-1' });
    game2.executeMove({ name: 'shuffleDeck' });
    
    expect(game1.getState().zones.deck.cards).toEqual(
      game2.getState().zones.deck.cards
    );
  });
  
  it('produces different order with different seed', () => {
    const game1 = new RuleEngine(definition, { seed: 'seed-1' });
    game1.executeMove({ name: 'shuffleDeck' });
    
    const game2 = new RuleEngine(definition, { seed: 'seed-2' });
    game2.executeMove({ name: 'shuffleDeck' });
    
    expect(game1.getState().zones.deck.cards).not.toEqual(
      game2.getState().zones.deck.cards
    );
  });
});
```

---

## 6. XState Flow Management

### Overview

Using XState for turn/phase/step orchestration provides:
- Visualizable state machines
- Guard conditions for transitions
- Actions on enter/exit
- Hierarchical states (nested phases/steps)
- Built-in history and replay

### Flow Definition with XState

```typescript
import { createMachine, assign } from 'xstate';

type FlowContext = {
  currentPlayer: PlayerId;
  turnNumber: number;
  phaseData: Record<string, unknown>;
};

type FlowEvent =
  | { type: 'NEXT_PHASE' }
  | { type: 'PASS_PRIORITY' }
  | { type: 'EXECUTE_MOVE'; move: Move }
  | { type: 'END_TURN' };

const gameMachine = createMachine<FlowContext, FlowEvent>({
  id: 'tcg-game',
  initial: 'setup',
  context: {
    currentPlayer: 'player1',
    turnNumber: 1,
    phaseData: {}
  },
  states: {
    setup: {
      on: {
        NEXT_PHASE: 'gameplay'
      }
    },
    gameplay: {
      initial: 'turnStart',
      states: {
        turnStart: {
          entry: 'onTurnStart',
          on: {
            NEXT_PHASE: 'draw'
          }
        },
        draw: {
          entry: 'onDrawPhaseStart',
          on: {
            NEXT_PHASE: {
              target: 'main1',
              guard: 'hasDrawnCard'
            }
          }
        },
        main1: {
          entry: 'onMain1Start',
          on: {
            EXECUTE_MOVE: {
              actions: 'executeMove'
            },
            NEXT_PHASE: 'combat'
          }
        },
        combat: {
          initial: 'declareAttackers',
          states: {
            declareAttackers: {
              on: {
                NEXT_PHASE: {
                  target: 'declareBlockers',
                  guard: 'attackersDeclared'
                }
              }
            },
            declareBlockers: {
              on: {
                NEXT_PHASE: 'damage'
              }
            },
            damage: {
              entry: 'resolveCombatDamage',
              on: {
                NEXT_PHASE: '#tcg-game.gameplay.main2'
              }
            }
          }
        },
        main2: {
          on: {
            NEXT_PHASE: 'end'
          }
        },
        end: {
          entry: 'onTurnEnd',
          on: {
            NEXT_PHASE: {
              target: 'turnStart',
              actions: 'nextPlayer'
            }
          }
        }
      }
    },
    gameOver: {
      type: 'final'
    }
  }
}, {
  actions: {
    onTurnStart: assign((context) => ({
      turnNumber: context.turnNumber + 1
    })),
    executeMove: (context, event) => {
      if (event.type === 'EXECUTE_MOVE') {
        // Execute move through engine
      }
    },
    nextPlayer: assign((context) => ({
      currentPlayer: getNextPlayer(context.currentPlayer)
    }))
  },
  guards: {
    hasDrawnCard: (context) => {
      // Check if player has drawn
      return true;
    },
    attackersDeclared: (context) => {
      // Check if attackers were declared
      return true;
    }
  }
});
```

### Integration with Engine

```typescript
type GameDefinition<TState, TMoves> = {
  // ... other properties
  
  // XState machine for flow
  flowMachine: StateMachine<FlowContext, FlowEvent>;
  
  // Map game state to flow context
  getFlowContext: (state: TState) => FlowContext;
  
  // Map flow context back to game state
  applyFlowContext: (state: Draft<TState>, context: FlowContext) => void;
};

// Engine manages both game state and flow state
class RuleEngine<TState, TMoves> {
  private gameState: TState;
  private flowService: ActorRef<FlowEvent>;
  
  constructor(definition: GameDefinition<TState, TMoves>) {
    this.flowService = interpret(definition.flowMachine).start();
    
    // Sync flow transitions to game state
    this.flowService.subscribe((state) => {
      this.onFlowTransition(state);
    });
  }
  
  executeMove(move: Move<TMoves>): MoveResult {
    // Execute move on game state
    const result = this.applyMove(move);
    
    // Send event to flow machine
    this.flowService.send({ type: 'EXECUTE_MOVE', move });
    
    return result;
  }
  
  nextPhase(): void {
    this.flowService.send({ type: 'NEXT_PHASE' });
  }
}
```

### Benefits of XState

1. **Visualization**: Generate state diagrams automatically
2. **Type Safety**: Full TypeScript support with context and events
3. **Testing**: Easy to test state transitions in isolation
4. **History**: Built-in state history for debugging
5. **Hierarchical**: Nested states for complex flows (sub-phases, sub-steps)
6. **Deterministic**: Same events always produce same transitions

---

## Summary

These six features form the foundation of a comprehensive TCG framework:

1. **Zone Management** - Cards live in zones, zones have visibility rules
2. **Card State** - Cards have rich state (tapped, counters, modifiers)
3. **Card Filtering DSL** - Query cards declaratively
4. **AI Move Enumeration** - Generate all valid moves for AI
5. **Seeded RNG** - Deterministic randomness for replay
6. **XState Flow** - Visualizable, type-safe turn orchestration

Together, these features enable developers to build any TCG without reinventing core infrastructure.

