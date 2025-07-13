# EnumerableMove Best Practices

This document provides guidelines and examples for creating and using EnumerableMove objects in the TCG Engine.

## Overview

EnumerableMove is the preferred interface for defining game moves in the TCG Engine. It provides a structured way to implement move execution, constraints, target selection, and metadata.

## Key Components

An EnumerableMove consists of several key components:

1. **execute**: Core move logic that performs the actual game state changes
2. **getConstraints**: Rules that determine when the move is available
3. **getTargetSpecs**: Defines what parameters the move requires and how to select them
4. **getPriority**: Optional method to determine move ordering in UI
5. **metadata**: Additional information for UI and organization

## Creating Moves

### Basic Structure

```typescript
const myMove = createEnumerableMove({
  execute: (context, ...args) => {
    // Implementation
    return updatedGameState;
  },
  getConstraints: (context) => [
    // Constraints
  ],
  getTargetSpecs: (context) => [
    // Target specifications
  ],
  getPriority: () => 50,
  metadata: {
    category: "basic",
    description: "Description of what the move does",
  },
});
```

### Game-Specific Helpers

For game-specific implementations, use the provided helper functions:

```typescript
// For Lorcana
import { createLorcanaMove } from "./helpers";

export const myLorcanaMove = createLorcanaMove({
  // Move definition
});
```

## Implementing Constraints

Constraints determine when a move is available:

```typescript
getConstraints: (context) => {
  const { G, ctx, playerID } = context;
  
  return [
    {
      id: "active-player",
      check: () => ctx.currentPlayer === playerID,
      failureReason: "You can only perform this action on your turn",
      messageKey: "moves.errors.not_active_player",
      context: { currentPlayer: ctx.currentPlayer },
    },
    {
      id: "phase-check",
      check: () => ctx.currentPhase === "mainPhase",
      failureReason: "This action can only be performed during the main phase",
      messageKey: "moves.errors.wrong_phase",
      context: { currentPhase: ctx.currentPhase },
    },
    // Additional constraints
  ];
}
```

## Defining Target Specifications

Target specs define what parameters the move needs:

```typescript
getTargetSpecs: (context) => {
  const { playerID } = context;
  
  return [
    {
      id: "primary-target",
      parameterIndex: 0,
      required: true,
      targetType: "card",
      cardFilter: {
        zone: "play",
        owner: playerID,
      },
      description: "Select a card to target",
      messageKey: "moves.targets.select_card",
      // Phase 3 features
      exclusivityGroup: "main-selection",
      renderHint: "highlight-primary",
    },
    {
      id: "secondary-target",
      parameterIndex: 1,
      required: false,
      targetType: "player",
      description: "Select a player (optional)",
      messageKey: "moves.targets.select_player",
      // Phase 3 features
      dependsOn: ["primary-target"], // This target depends on the first one
    },
  ];
}
```

## Advanced Features (Phase 3)

### Target Dependencies

When one target selection depends on another:

```typescript
{
  id: "affected-cards",
  parameterIndex: 1,
  required: true,
  targetType: "card",
  cardFilter: {
    // Filter that may depend on the first selection
  },
  description: "Select cards affected by the ability",
  messageKey: "moves.targets.select_affected_cards",
  dependsOn: ["ability-card"], // This target depends on the first selection
}
```

### Exclusivity Groups

When targets must be mutually exclusive:

```typescript
{
  id: "attacker",
  parameterIndex: 0,
  required: true,
  targetType: "card",
  cardFilter: {
    zone: "play",
    owner: playerID,
  },
  description: "Select attacker",
  messageKey: "moves.targets.select_attacker",
  exclusivityGroup: "combat-selection", // Cards in this group can't be selected twice
},
{
  id: "defender",
  parameterIndex: 1,
  required: true,
  targetType: "card",
  cardFilter: {
    zone: "play",
    owner: opponentID,
  },
  description: "Select defender",
  messageKey: "moves.targets.select_defender",
  exclusivityGroup: "combat-selection", // Ensures same card can't be both attacker and defender
}
```

### Render Hints

To indicate how targets should be highlighted in UI:

```typescript
{
  id: "card-to-discard",
  parameterIndex: 0,
  required: true,
  targetType: "card",
  cardFilter: {
    zone: "hand",
    owner: playerID,
  },
  description: "Select a card to discard",
  messageKey: "moves.targets.select_discard",
  renderHint: "highlight-discard", // UI hint for styling
}
```

### Rich Metadata

```typescript
metadata: {
  category: "combat",
  description: "Attack an opponent's character with your character",
  displayName: "Attack",
  iconKey: "sword",
  phase: "combatPhase",
  frequency: "repeatable",
  importance: "core",
}
```

## Best Practices

1. **Separate Concerns**: Keep execution logic, constraints, and target specifications clearly separated
2. **Use Type-Safe Helpers**: Leverage game-specific helper functions for proper typing
3. **Clear Error Messages**: Provide descriptive error messages and messageKeys for localization
4. **Consistent IDs**: Use consistent naming conventions for constraint and target IDs
5. **Test Both Success and Failure Cases**: Ensure constraints and validations work correctly
6. **Document Complexity**: Add JSDoc comments for complex moves
7. **UI Considerations**: Include metadata and renderHints to improve user experience

## Example: Put a Card into the Inkwell (Lorcana)

```typescript
export const putACardIntoTheInkwellMove = createLorcanaMove({
  execute: (context, cardId) => {
    // Implementation details
  },
  getConstraints: (context) => [
    // Constraint rules
  ],
  getTargetSpecs: (context) => [
    {
      id: "card-to-ink",
      parameterIndex: 0,
      required: true,
      targetType: "card",
      cardFilter: {
        zone: "hand",
        owner: context.playerID,
      },
      description: "Select a card to put into the inkwell",
      messageKey: "moves.ink_card.targets.card_to_ink",
      exclusivityGroup: "inkwell-selection",
      renderHint: "highlight-inkwell",
    },
  ],
  getPriority: () => 50,
  metadata: {
    category: "resource",
    description: "Place a card with inkwell symbol into your inkwell",
    displayName: "Ink a Card",
    iconKey: "inkwell",
    phase: "mainPhase",
    frequency: "oncePerTurn",
    importance: "core",
  },
});
``` 