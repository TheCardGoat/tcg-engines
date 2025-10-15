# Initial Context - Move Enumeration System

## Current State Analysis

### Existing Move System
The current `@tcg/core` package has a robust move execution system with:

1. **Move Definition** (`packages/core/src/moves/move-system.ts`):
   - Type-safe move definitions with `MoveDefinition<TGameState, TParams>`
   - Move conditions for validation
   - Move reducers for state updates
   - Full TypeScript type safety

2. **RuleEngine Integration** (`packages/core/src/engine/rule-engine.ts`):
   - `executeMove()` - Execute a move with typed parameters
   - `canExecuteMove()` - Check if a move is valid
   - `getValidMoves()` - Basic move enumeration (returns move IDs only)

3. **Current Limitations**:
   - `getValidMoves()` only returns move IDs without parameter information
   - No parameter enumeration or discovery
   - AI agents must guess valid parameters
   - UI components can't build intelligent interfaces showing all possible actions
   - Empty params `{}` used for checking moves, which fails for moves requiring parameters

### Gap Analysis

**What's Missing:**
1. Parameter enumeration - discovering valid parameter combinations
2. Move introspection - understanding what parameters a move accepts
3. Target enumeration - finding valid targets for moves
4. Context-aware move generation - considering game state when enumerating
5. Rich move metadata for UI/AI consumption

**Use Cases:**
1. **AI Agents**: Need to enumerate all possible moves with valid parameters
2. **UI Components**: Need to build dynamic action menus, buttons, and selections
3. **Game Analysis**: Need to explore game trees and possibilities
4. **Debugging**: Need to inspect what moves are available at any state

## References

### Current API
```typescript
// Current limited API
engine.getValidMoves(playerId: PlayerId): string[]
engine.canExecuteMove(moveId: string, context: MoveContextInput): boolean
```

### Desired API (to be defined in spec)
```typescript
// Example of what we want (details TBD)
engine.enumerateMoves(playerId: PlayerId): EnumeratedMove[]
engine.enumerateParameters(moveId: string, playerId: PlayerId): ParameterOptions[]
```

## Key Considerations

1. **Type Safety**: Must maintain full TypeScript type safety
2. **Flexibility**: Different games have different parameter types and validation
4. **Integration**: Must work seamlessly with existing RuleEngine
5. **Extensibility**: Games should be able to provide custom enumeration logic
6. **Documentation**: Must be well-documented with examples for AI and UI use cases

## Related Systems

- Move System: Core move execution and validation
- Targeting System: Target definition and validation
- Card Filtering: Query system for finding valid cards
- Zone Operations: Card locations and availability
- Flow Management: Turn/phase context for moves

## Date Created
2025-10-15

