# Error Handling Patterns

## Core Principles

1. **Never throw in core logic** - Use Result types instead
2. **Validate at boundaries** - Check inputs at API/user boundaries
3. **Fail fast with context** - Include helpful error messages
4. **Type guards for safety** - Runtime type checking

## Result Types

Use discriminated unions for fallible operations:

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Usage
function parseCard(input: unknown): Result<CardDefinition, ValidationError> {
  const result = cardSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: new ValidationError(result.error) };
  }
  return { success: true, data: result.data };
}

// Handling
const result = parseCard(input);
if (!result.success) {
  logger.error("Failed to parse card", { error: result.error });
  return;
}
const card = result.data; // TypeScript knows this is CardDefinition
```

## Zod Validation

Use Zod schemas for runtime validation:

```typescript
import { z } from "zod";

// Define schema
const CardDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  cost: z.number().int().min(0),
  text: z.string().optional(),
});

// Safe parsing (preferred)
const result = CardDefinitionSchema.safeParse(input);
if (!result.success) {
  // Handle validation error
  console.error(result.error.format());
}

// Strict parsing (throws on invalid)
const card = CardDefinitionSchema.parse(input); // Throws if invalid
```

## Type Guards

Create type guards for runtime type checking:

```typescript
// Type guard function
function isCharacterCard(card: CardInstance): card is CharacterCard {
  return card.cardType === "character";
}

// Type guard builder (from @tcg/core)
import { createTypeGuard } from "@tcg/core/validation";

const isValidMove = createTypeGuard<MoveDefinition>((value) => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.type === "string" &&
    typeof value.execute === "function"
  );
});
```

## Error Messages

Provide context-rich error messages:

```typescript
// Good - includes context
throw new Error(
  `Cannot move card ${cardId} from ${fromZone} to ${toZone}: card not found in source zone`
);

// Bad - no context
throw new Error("Card not found");
```

## Validation Boundaries

Validate at these points:
- **User input** - Move requests, game setup
- **External APIs** - Card data imports, network messages
- **Configuration** - Game definitions, zone configs

```typescript
// Validate move request from user
function validateMoveRequest(request: unknown): Result<MoveRequest> {
  const schema = z.object({
    type: z.string(),
    playerId: z.string(),
    params: z.record(z.unknown()),
  });

  const result = schema.safeParse(request);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  return { success: true, data: result.data as MoveRequest };
}
```

## Logging Errors

Use structured logging for errors:

```typescript
import { logger } from "@tcg/core/logging";

try {
  executeMove(move);
} catch (error) {
  logger.error("Move execution failed", {
    move: move.type,
    playerId: move.playerId,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
}
```

## Move Validation

Moves should validate before execution:

```typescript
const move: MoveDefinition = {
  type: "playCard",

  // Check if move is legal
  canMake: (state, params) => {
    if (!params.cardId) return false;
    const card = getCard(state, params.cardId);
    if (!card) return false;
    if (card.zone !== "hand") return false;
    return hasEnoughResources(state, card.cost);
  },

  // Execute only if canMake returns true
  execute: (state, params) => {
    // Safe to assume validation passed
    moveCard(state, params.cardId, "hand", "play");
  },
};
```

## Common Patterns

### Assertion Functions
```typescript
function assertCardExists(
  state: GameState,
  cardId: CardId
): asserts cardId is CardId {
  const card = state.cards.get(cardId);
  if (!card) {
    throw new Error(`Card ${cardId} not found in game state`);
  }
}
```

### Optional Chaining for Safety
```typescript
const cardName = state.cards.get(cardId)?.definition?.name ?? "Unknown";
```

## Reference

Full standards: `agent-os/standards/global/error-handling.md`
