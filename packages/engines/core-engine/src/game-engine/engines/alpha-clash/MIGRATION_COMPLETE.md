# Alpha Clash Metadata Migration Complete

## Migration Overview

Alpha Clash has been successfully migrated to use the unified card metadata approach via the core context (`ctx.cardMetas`), replacing the previous fragmented patterns using the `AlphaClashCardInstance` type.

## Changes Made

1. **Added `AlphaClashCardMeta` Type**:
   - Created a comprehensive metadata type extending `BaseCardMeta` from the core engine
   - Consolidated all card-specific state (status, damage, counters, etc.) into a single metadata type

2. **Updated Engine Type Parameters**:
   - Added `AlphaClashCardMeta` as a generic type parameter to the `AlphaClashEngine` class
   - Ensured type safety throughout the engine implementation

3. **Created `AlphaClashCoreOperations` Class**:
   - Extended the `CoreOperation` class with Alpha Clash-specific methods
   - Implemented metadata manipulation operations (damage, counters, modifiers, etc.)
   - Added utility methods for common game mechanics

4. **Added Engine Integration**:
   - Created and exposed a `coreOps` property on the `AlphaClashEngine` class
   - Set up initialization of the operations instance

5. **Created Comprehensive Tests**:
   - Added unit tests for all metadata operations
   - Validated key functionality like damage tracking, counters, modifiers, and attachments

## Usage Examples

### Status and Damage

```typescript
// Set card status
coreOps.setCardStatus(cardId, "engaged");

// Apply damage
coreOps.applyDamage(cardId, 3, "clash");

// Remove damage
coreOps.removeDamage(cardId, 2);
```

### Counters

```typescript
// Add counters
coreOps.addCounter(cardId, "charge", 3);

// Remove counters
coreOps.removeCounter(cardId, "charge", 1);
```

### Modifiers

```typescript
// Add a modifier
coreOps.addModifier(cardId, "spell-123", "+2 attack", "until end of turn");

// Remove modifiers from a source
coreOps.removeModifiersBySource(cardId, "spell-123");
```

### Attachments

```typescript
// Attach cards
coreOps.attachCard(weaponId, characterId);

// Detach cards
coreOps.detachCard(weaponId);
```

### Turn Tracking

```typescript
// Mark a card as played
coreOps.markAsPlayed(cardId);

// Reset turn flags
coreOps.resetTurnFlags(playerId);
```

## Benefits of the Migration

1. **Unified API**: Consistent patterns for metadata manipulation across all game engines
2. **Type Safety**: Improved TypeScript type checking for all metadata operations
3. **Reduced Code Duplication**: Eliminated redundant metadata handling code
4. **Improved Debugging**: Centralized metadata storage for easier inspection and troubleshooting
5. **Extensibility**: Easy to add new metadata fields and operations as needed

## Next Steps

Future updates to Alpha Clash engine should continue using the metadata approach:

- Update all `move` functions to use the `coreOps` methods instead of direct state manipulation
- Remove any remaining direct access to card instance properties that are now in metadata
- Enhance the Alpha Clash engine with additional metadata operations as game mechanics evolve 