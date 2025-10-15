# Move Enumeration System - Specification

**Spec ID**: 2025-10-15-move-enumeration-system  
**Status**: 🟡 Requirements Gathered  
**Target Package**: `packages/core`  
**Breaking Changes**: Yes (acceptable)

---

## 1. Executive Summary

This specification defines a comprehensive move enumeration system for `@tcg/core` that enables AI agents and UI components to discover all available moves and their valid parameters at any game state. The system will be integrated directly into `RuleEngine` and allow game developers to explicitly define parameter enumeration logic per move.

### Key Objectives
- ✅ Enable discovery of all valid moves with their parameter combinations
- ✅ Support explicit parameter enumeration defined by game developers
- ✅ Integrate seamlessly with existing RuleEngine and move system
- ✅ Maintain type safety and developer ergonomics
- ✅ Support various parameter types: card IDs, targets, numeric values, enums

---

## 2. Requirements

### 2.1 Functional Requirements

**FR-1: Move Enumeration API**
- RuleEngine MUST provide an `enumerateMoves()` method
- Method MUST return a comprehensive list of all valid moves with their parameters
- Each enumerated move MUST include moveId, parameter values, and validation status

**FR-2: Explicit Parameter Enumeration**
- Game developers MUST be able to define custom enumeration logic per move
- Enumeration logic MUST be defined in the `MoveDefinition`
- If no enumeration logic provided, move SHOULD still appear in results (with indication that parameters needed)

**FR-3: Parameter Type Support**
- System MUST support enumerating:
  - Card IDs (from zones, hand, field, etc.)
  - Target selections (single, multiple, optional) - leverage existing target DSL
  - Numeric values (amounts, costs, etc.)
  - Enum/string choices (modes, options)

**FR-4: Type Safety**
- Enumeration SHOULD infer types from move definitions where possible
- TypeScript types SHOULD guide parameter structure
- Type mismatches SHOULD be caught at compile time

**FR-5: Integration with RuleEngine**
- Enumeration MUST extend `RuleEngine` directly (new method)
- Enumeration MUST use existing move condition system for validation
- Enumeration MUST respect game state and player context

### 2.2 Non-Functional Requirements

**NFR-1: Simplicity**
- API MUST be simple and intuitive for game developers
- Workflow: Define moves → enumeration works automatically (if enumerator provided)

**NFR-2: Performance**
- Performance NOT a primary concern (games have limited move sets)
- No caching/memoization required initially

**NFR-3: Extensibility**
- Design MUST allow future enhancements (AI heuristics, UI metadata, etc.)
- Breaking changes acceptable in current phase

**NFR-4: Documentation**
- Comprehensive examples for common use cases
- Clear migration guide from existing `getValidMoves()`

---

## 3. Technical Design

### 3.1 Core Types

```typescript
/**
 * Enumerated Move Result
 * 
 * Represents a single valid move with all its parameter values
 */
export type EnumeratedMove<TParams = any> = {
  /** Move identifier */
  moveId: string;
  
  /** Player who can execute this move */
  playerId: PlayerId;
  
  /** Fully populated parameters for this move */
  params: TParams;
  
  /** Optional source card for this move */
  sourceCardId?: CardId;
  
  /** Optional targets for this move */
  targets?: string[][];
  
  /** Whether this move is currently valid (passed condition check) */
  isValid: boolean;
  
  /** If not valid, reason for failure */
  validationError?: {
    reason: string;
    errorCode: string;
    context?: Record<string, unknown>;
  };
  
  /** Optional metadata for UI/AI consumption */
  metadata?: {
    displayName?: string;
    description?: string;
    category?: string;
    priority?: number;
    [key: string]: unknown;
  };
};

/**
 * Move Enumerator Function
 * 
 * Game-provided function that generates all possible parameter combinations
 * for a given move. Returns an array of parameter objects.
 * 
 * @template TGameState - Game state type
 * @template TParams - Move-specific parameter type
 * @template TCardMeta - Card metadata type
 * @template TCardDefinition - Card definition type
 * 
 * @param state - Current game state
 * @param context - Enumeration context with player, operations, etc.
 * @returns Array of possible parameter combinations
 */
export type MoveEnumerator<
  TGameState,
  TParams = any,
  TCardMeta = any,
  TCardDefinition = any,
> = (
  state: TGameState,
  context: MoveEnumerationContext<TCardMeta, TCardDefinition>,
) => TParams[];

/**
 * Enumeration Context
 * 
 * Provided to enumerator functions, contains all information needed
 * to discover valid parameters
 */
export type MoveEnumerationContext<
  TCardMeta = any,
  TCardDefinition = any,
> = {
  /** Player to enumerate moves for */
  playerId: PlayerId;
  
  /** Zone operations for querying card locations */
  zones: ZoneOperations;
  
  /** Card operations for querying card state */
  cards: CardOperations<TCardMeta>;
  
  /** Game operations for game-level state */
  game: GameOperations;
  
  /** Card registry for static card definitions */
  registry?: CardRegistry<TCardDefinition>;
  
  /** Flow state (turn, phase, segment) */
  flow?: {
    currentPhase?: string;
    currentSegment?: string;
    turn: number;
    currentPlayer?: PlayerId;
    isFirstTurn: boolean;
  };
  
  /** RNG for deterministic enumeration if needed */
  rng: SeededRNG;
};

/**
 * Move Enumeration Options
 * 
 * Configuration for enumeration behavior
 */
export type MoveEnumerationOptions = {
  /** Only return valid moves (passed condition check) */
  validOnly?: boolean;
  
  /** Include metadata in results */
  includeMetadata?: boolean;
  
  /** Filter to specific move IDs */
  moveIds?: string[];
  
  /** Maximum number of results per move (optional limit) */
  maxPerMove?: number;
};
```

### 3.2 Extended MoveDefinition

```typescript
/**
 * Move Definition (Extended)
 * 
 * Adds optional enumerator field to existing MoveDefinition
 */
export type MoveDefinition<
  TGameState,
  TParams = any,
  TCardMeta = any,
  TCardDefinition = any,
> = {
  id: string;
  name: string;
  description?: string;
  condition?: MoveCondition<TGameState, TParams, TCardMeta, TCardDefinition>;
  reducer: MoveReducer<TGameState, TParams, TCardMeta, TCardDefinition>;
  
  /**
   * Parameter enumerator (NEW)
   * 
   * Optional function to generate all valid parameter combinations.
   * If not provided, move will still appear in enumeration results
   * but will indicate that parameters are required.
   */
  enumerator?: MoveEnumerator<TGameState, TParams, TCardMeta, TCardDefinition>;
  
  metadata?: {
    category?: string;
    tags?: string[];
    [key: string]: unknown;
  };
};
```

### 3.3 RuleEngine Extension

```typescript
/**
 * RuleEngine (Extended)
 * 
 * Add new enumerateMoves method
 */
export class RuleEngine<
  TState,
  TMoves extends Record<string, any>,
  TCardDefinition = any,
  TCardMeta = any,
> {
  // ... existing methods ...
  
  /**
   * Enumerate all valid moves with parameters
   * 
   * Discovers all possible moves for a given player by invoking
   * each move's enumerator function (if provided). Each enumerated
   * parameter set is then validated against the move's condition.
   * 
   * @param playerId - Player to enumerate moves for
   * @param options - Optional configuration for enumeration
   * @returns Array of enumerated moves with parameters
   * 
   * @example
   * ```typescript
   * const moves = engine.enumerateMoves(playerId, {
   *   validOnly: true,  // Only return moves that pass condition
   *   includeMetadata: true
   * });
   * 
   * for (const move of moves) {
   *   console.log(`${move.moveId}:`, move.params);
   *   if (move.isValid) {
   *     // Can execute this move
   *     engine.executeMove(move.moveId, {
   *       playerId: move.playerId,
   *       params: move.params,
   *       targets: move.targets
   *     });
   *   }
   * }
   * ```
   */
  enumerateMoves(
    playerId: PlayerId,
    options?: MoveEnumerationOptions
  ): EnumeratedMove<any>[];
}
```

### 3.4 Implementation Algorithm

```typescript
// Pseudocode for enumerateMoves implementation
enumerateMoves(playerId: PlayerId, options?: MoveEnumerationOptions): EnumeratedMove[] {
  const results: EnumeratedMove[] = [];
  const validOnly = options?.validOnly ?? false;
  const includeMetadata = options?.includeMetadata ?? false;
  const moveIdsFilter = options?.moveIds;
  const maxPerMove = options?.maxPerMove;
  
  // Build enumeration context (similar to move execution context)
  const context = this.buildEnumerationContext(playerId);
  
  // Iterate through all moves
  for (const [moveId, moveDef] of Object.entries(this.gameDefinition.moves)) {
    // Filter by moveIds if specified
    if (moveIdsFilter && !moveIdsFilter.includes(moveId)) {
      continue;
    }
    
    // If move has no enumerator, add a placeholder result
    if (!moveDef.enumerator) {
      if (!validOnly) {
        results.push({
          moveId,
          playerId,
          params: {} as any,
          isValid: false,
          validationError: {
            reason: 'Move requires parameters but no enumerator provided',
            errorCode: 'NO_ENUMERATOR'
          }
        });
      }
      continue;
    }
    
    // Invoke enumerator to get parameter combinations
    const paramCombinations = moveDef.enumerator(this.currentState, context);
    
    // Limit results per move if specified
    const limitedCombinations = maxPerMove 
      ? paramCombinations.slice(0, maxPerMove)
      : paramCombinations;
    
    // Validate each parameter combination
    for (const params of limitedCombinations) {
      const contextInput: MoveContextInput = {
        playerId,
        params,
      };
      
      // Check if this move is valid
      const conditionResult = this.checkMoveCondition(moveId, contextInput);
      
      const enumeratedMove: EnumeratedMove = {
        moveId,
        playerId,
        params,
        isValid: conditionResult.success,
      };
      
      // Add validation error if failed
      if (!conditionResult.success) {
        enumeratedMove.validationError = {
          reason: conditionResult.error,
          errorCode: conditionResult.errorCode,
          context: conditionResult.errorContext,
        };
      }
      
      // Add metadata if requested
      if (includeMetadata && moveDef.metadata) {
        enumeratedMove.metadata = {
          displayName: moveDef.name,
          description: moveDef.description,
          ...moveDef.metadata,
        };
      }
      
      // Add to results (filter by validOnly)
      if (!validOnly || enumeratedMove.isValid) {
        results.push(enumeratedMove);
      }
    }
  }
  
  return results;
}

private buildEnumerationContext(playerId: PlayerId): MoveEnumerationContext {
  const zoneOps = createZoneOperations(this.internalState, this.logger.child('zones'));
  const cardOps = createCardOperations(this.internalState, this.logger.child('cards'));
  const gameOps = createGameOperations(this.internalState, this.logger.child('game'));
  
  const flowState = this.flowManager ? {
    currentPhase: this.flowManager.getCurrentPhase(),
    currentSegment: this.flowManager.getCurrentSegment(),
    turn: this.flowManager.getTurnNumber(),
    currentPlayer: this.flowManager.getCurrentPlayer() as PlayerId,
    isFirstTurn: this.flowManager.isFirstTurn(),
  } : undefined;
  
  return {
    playerId,
    zones: zoneOps,
    cards: cardOps,
    game: gameOps,
    registry: this.cardRegistry,
    flow: flowState,
    rng: this.rng,
  };
}
```

---

## 4. Usage Examples

### 4.1 Example: Simple Card Play Move

```typescript
type PlayCardParams = {
  cardId: CardId;
  alternativeCost?: AlternativeCost;
};

const playCardMove: MoveDefinition<GameState, PlayCardParams> = {
  id: 'play-card',
  name: 'Play Card',
  description: 'Play a card from your hand',
  
  // Enumerator: Generate all possible card plays from hand
  enumerator: (state, context) => {
    const results: PlayCardParams[] = [];
    
    // Get all cards in player's hand
    const handCards = context.zones.getCardsInZone('hand', context.playerId);
    
    // For each card, create a parameter combination
    for (const cardId of handCards) {
      // Basic play (no alternative cost)
      results.push({ cardId });
      
      // If card has alternative costs, add those options
      const cardDef = context.registry?.getCard(cardId);
      if (cardDef?.alternativeCosts) {
        for (const altCost of cardDef.alternativeCosts) {
          results.push({ cardId, alternativeCost: altCost });
        }
      }
    }
    
    return results;
  },
  
  condition: (state, context) => {
    const { cardId, alternativeCost } = context.params;
    const player = state.players[context.playerId];
    
    // Check if card is in hand
    if (!context.zones.getCardsInZone('hand', context.playerId).includes(cardId)) {
      return {
        reason: 'Card not in hand',
        errorCode: 'CARD_NOT_IN_HAND',
      };
    }
    
    // Check if player can afford the cost
    const cardDef = context.registry?.getCard(cardId);
    const cost = alternativeCost ? alternativeCost.cost : cardDef?.cost ?? 0;
    
    if (player.mana < cost) {
      return {
        reason: `Not enough mana. Required: ${cost}, Available: ${player.mana}`,
        errorCode: 'INSUFFICIENT_MANA',
        context: { required: cost, available: player.mana },
      };
    }
    
    return true;
  },
  
  reducer: (draft, context) => {
    // ... implementation ...
  },
};
```

### 4.2 Example: Attack Move with Targets

```typescript
type AttackParams = {
  attackerId: CardId;
  targetId: CardId;
};

const attackMove: MoveDefinition<GameState, AttackParams> = {
  id: 'attack',
  name: 'Attack',
  description: 'Attack with a creature',
  
  enumerator: (state, context) => {
    const results: AttackParams[] = [];
    
    // Get all friendly creatures in play
    const friendlyCreatures = context.zones.getCardsInZone('field', context.playerId);
    
    // Get all opponent creatures in play
    const opponents = state.players.filter(p => p.id !== context.playerId);
    
    for (const attackerId of friendlyCreatures) {
      const attacker = context.cards.getCardMeta(attackerId);
      
      // Skip if creature can't attack (tapped, summoning sickness, etc.)
      if (attacker.tapped || attacker.summoningSickness) {
        continue;
      }
      
      // Can attack opponent creatures
      for (const opponent of opponents) {
        const opponentCreatures = context.zones.getCardsInZone('field', opponent.id);
        
        for (const targetId of opponentCreatures) {
          results.push({ attackerId, targetId });
        }
        
        // Can also attack player directly (if no taunt creatures)
        const hasTaunt = opponentCreatures.some(id => {
          const card = context.cards.getCardMeta(id);
          return card.hasTaunt;
        });
        
        if (!hasTaunt) {
          results.push({
            attackerId,
            targetId: opponent.id as CardId, // Player as target
          });
        }
      }
    }
    
    return results;
  },
  
  condition: (state, context) => {
    // Validate attack is legal
    // ... implementation ...
    return true;
  },
  
  reducer: (draft, context) => {
    // Execute attack
    // ... implementation ...
  },
};
```

### 4.3 Example: Pass Turn (No Parameters)

```typescript
type PassTurnParams = Record<string, never>; // Empty params

const passTurnMove: MoveDefinition<GameState, PassTurnParams> = {
  id: 'pass-turn',
  name: 'Pass Turn',
  description: 'End your turn',
  
  // Enumerator returns single empty params object
  enumerator: (state, context) => {
    return [{}];
  },
  
  condition: (state, context) => {
    // Check if it's player's turn
    return context.flow?.currentPlayer === context.playerId;
  },
  
  reducer: (draft, context) => {
    // End turn logic handled by flow manager
    context.flow?.endTurn();
  },
};
```

### 4.4 Example: UI Integration

```typescript
// UI Component using enumeration
function GameBoard({ engine, playerId }: Props) {
  const [availableMoves, setAvailableMoves] = useState<EnumeratedMove[]>([]);
  
  useEffect(() => {
    // Enumerate all valid moves for current player
    const moves = engine.enumerateMoves(playerId, {
      validOnly: true,  // Only show valid moves
      includeMetadata: true,
    });
    
    setAvailableMoves(moves);
  }, [engine, playerId]);
  
  return (
    <div>
      <h2>Available Actions</h2>
      {availableMoves.map((move, idx) => (
        <button
          key={idx}
          onClick={() => {
            engine.executeMove(move.moveId, {
              playerId: move.playerId,
              params: move.params,
              targets: move.targets,
            });
          }}
        >
          {move.metadata?.displayName || move.moveId}
          {/* Show parameter details */}
          {move.params.cardId && <CardPreview cardId={move.params.cardId} />}
        </button>
      ))}
    </div>
  );
}
```

### 4.5 Example: Simple AI Agent

```typescript
// Simple AI using enumeration
function simpleAI(engine: RuleEngine, playerId: PlayerId) {
  // Get all valid moves
  const moves = engine.enumerateMoves(playerId, {
    validOnly: true,
  });
  
  if (moves.length === 0) {
    console.log('No valid moves available');
    return;
  }
  
  // Pick a random move (naive strategy)
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  
  // Execute it
  engine.executeMove(randomMove.moveId, {
    playerId: randomMove.playerId,
    params: randomMove.params,
    targets: randomMove.targets,
  });
}
```

---

## 5. Implementation Tasks

### Phase 1: Core Types & Interfaces (Foundation)
- [ ] **Task 1.1**: Define `EnumeratedMove<TParams>` type
- [ ] **Task 1.2**: Define `MoveEnumerator<>` function type
- [ ] **Task 1.3**: Define `MoveEnumerationContext<>` type
- [ ] **Task 1.4**: Define `MoveEnumerationOptions` type
- [ ] **Task 1.5**: Update `MoveDefinition` to include optional `enumerator` field
- [ ] **Task 1.6**: Update type exports in `src/index.ts`

### Phase 2: RuleEngine Integration
- [ ] **Task 2.1**: Implement `buildEnumerationContext()` private method in RuleEngine
- [ ] **Task 2.2**: Implement `enumerateMoves()` public method in RuleEngine
- [ ] **Task 2.3**: Add proper error handling for enumerator failures
- [ ] **Task 2.4**: Add logging for enumeration process (DEBUG level)
- [ ] **Task 2.5**: Add telemetry events for enumeration (optional)

### Phase 3: Testing
- [ ] **Task 3.1**: Write unit tests for `enumerateMoves()` with various scenarios
- [ ] **Task 3.2**: Test with moves without enumerators
- [ ] **Task 3.3**: Test with moves with simple parameter enumerators
- [ ] **Task 3.4**: Test with moves with complex parameter enumerators (targets, etc.)
- [ ] **Task 3.5**: Test validation filtering (validOnly option)
- [ ] **Task 3.6**: Test metadata inclusion
- [ ] **Task 3.7**: Test performance with large parameter spaces

### Phase 4: Documentation & Examples
- [ ] **Task 4.1**: Update README.md with enumeration examples
- [ ] **Task 4.2**: Create guide: "Move Enumeration for AI Agents"
- [ ] **Task 4.3**: Create guide: "Move Enumeration for UI Components"
- [ ] **Task 4.4**: Add API documentation with JSDoc comments
- [ ] **Task 4.5**: Create migration guide from `getValidMoves()`
- [ ] **Task 4.6**: Add examples to `docs/examples/` directory

### Phase 5: Integration Testing
- [ ] **Task 5.1**: Update gundam-engine with enumerators
- [ ] **Task 5.2**: Update lorcana-engine with enumerators
- [ ] **Task 5.3**: Create example game demonstrating all parameter types
- [ ] **Task 5.4**: Validate with real UI components
- [ ] **Task 5.5**: Validate with simple AI agent

---

## 6. Testing Strategy

### 6.1 Unit Tests

**Test Suite: Move Enumeration**
- Test enumerating moves with no enumerator defined
- Test enumerating moves with empty parameter enumerator
- Test enumerating moves with single parameter combination
- Test enumerating moves with multiple parameter combinations
- Test validation filtering (validOnly: true/false)
- Test metadata inclusion (includeMetadata: true/false)
- Test moveIds filtering
- Test maxPerMove limiting

**Test Suite: Parameter Types**
- Test card ID enumeration from zones
- Test target enumeration with target DSL
- Test numeric value enumeration
- Test enum/string choice enumeration
- Test complex nested parameter structures

**Test Suite: Error Handling**
- Test enumerator throwing exception
- Test enumerator returning invalid parameters
- Test condition failing for enumerated parameters
- Test empty enumeration results

### 6.2 Integration Tests

**Test Suite: RuleEngine Integration**
- Test enumeration with flow state (turn, phase)
- Test enumeration with zone operations
- Test enumeration with card operations
- Test enumeration with card registry
- Test enumeration changes after state updates

**Test Suite: Real Game Scenarios**
- Test enumeration in opening hand
- Test enumeration in mid-game complex state
- Test enumeration at game end conditions
- Test enumeration for different players simultaneously

---

## 7. Documentation Plan

### 7.1 API Documentation
- JSDoc comments for all new types and methods
- Code examples in documentation comments
- Link to guides and examples

### 7.2 Guides
1. **"Getting Started with Move Enumeration"**
   - Basic concepts
   - Simple examples
   - Common patterns

2. **"Move Enumeration for AI Agents"**
   - Enumerating all moves
   - Implementing simple AI
   - Performance considerations

3. **"Move Enumeration for UI Components"**
   - Building action menus
   - Displaying move options
   - React/Vue integration patterns

4. **"Advanced Parameter Enumeration"**
   - Complex parameter types
   - Conditional enumeration
   - Target integration
   - Custom validation

### 7.3 Migration Guide
- From `getValidMoves()` to `enumerateMoves()`
- Breaking changes and how to adapt
- Gradual migration strategy

---

## 8. Success Criteria

### 8.1 Functionality
- ✅ `enumerateMoves()` returns all valid moves with parameters
- ✅ Enumerators can be defined per move
- ✅ Validation filtering works correctly
- ✅ All parameter types supported (cards, targets, numbers, enums)
- ✅ Integration with existing RuleEngine is seamless

### 8.2 Developer Experience
- ✅ API is intuitive and easy to use
- ✅ TypeScript types provide good inference
- ✅ Documentation is clear and comprehensive
- ✅ Examples cover common use cases

### 8.3 Testing
- ✅ Unit test coverage > 90%
- ✅ Integration tests pass for all scenarios
- ✅ Real game implementations working (gundam, lorcana)

### 8.4 Performance
- ✅ Enumeration completes in reasonable time (< 1 second for typical game states)
- ✅ No memory leaks or excessive allocations

---

## 9. Open Questions & Future Work

### 9.1 Open Questions
- ❓ Should enumerators be async to support expensive computations?
- ❓ Should we provide helper utilities for common enumeration patterns?
- ❓ Should we support progressive/lazy enumeration for huge move spaces?
- ❓ Should we cache enumeration results between state updates?

### 9.2 Future Enhancements
- 🔮 AI heuristic scoring for enumerated moves
- 🔮 Move categorization and grouping
- 🔮 UI metadata (icons, colors, priorities)
- 🔮 Move history analysis and recommendations
- 🔮 Search tree integration for game analysis
- 🔮 Move pruning strategies for AI
- 🔮 Multi-step move sequences
- 🔮 Conditional parameter enumeration

---

## 10. Dependencies & Risks

### 10.1 Dependencies
- No new external dependencies
- Relies on existing: Immer, TypeScript, testing framework

### 10.2 Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Enumerators generate too many combinations | High | Medium | Add maxPerMove limiting, documentation on best practices |
| Type inference doesn't work well | Medium | Low | Fallback to explicit typing, improve types iteratively |
| Integration breaks existing functionality | High | Low | Comprehensive testing, backward compatibility checks |
| Performance issues in complex games | Medium | Low | Performance testing, optimization if needed |
| Difficult to write enumerators for complex moves | Medium | Medium | Provide helper utilities, good examples, clear guides |

---

## 11. Timeline Estimate

**Total: 2-3 weeks**

- **Week 1**: Core implementation (Types, RuleEngine extension, basic testing)
- **Week 2**: Advanced testing, documentation, examples
- **Week 3**: Integration with real games, polish, feedback iteration

---

## 12. Approval & Sign-off

**Specification Author**: AI Assistant  
**Date**: 2025-10-15  
**Status**: ✅ Ready for Implementation

**Reviewed By**: [Pending]  
**Approved By**: [Pending]  

---

## Appendix A: Type Reference

See [Technical Design](#31-core-types) section for complete type definitions.

## Appendix B: Example Repository

TBD - Create example game demonstrating all enumeration patterns

---

**End of Specification**

