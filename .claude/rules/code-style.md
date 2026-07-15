# Code Style Guidelines

## TypeScript Standards

### Strict Mode Requirements
- **No `any` types** - Use `unknown` if type is truly unknown
- **Strict null checks** - Handle null/undefined explicitly
- **No implicit any** - All variables must have explicit or inferred types
- **No unused variables** - Remove or prefix with `_` if intentionally unused

### Type Patterns

```typescript
// Use branded types for domain identifiers
type CardId = string & { readonly brand: unique symbol };
type PlayerId = string & { readonly brand: unique symbol };
type ZoneId = string & { readonly brand: unique symbol };

// Use discriminated unions for variants
type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

// Use type-only imports
import type { CardInstance, GameState } from "@tcg/core";
```

### Generic Patterns
- Apply appropriate generic constraints
- Prefer `TCustomState` naming for game-specific extensions
- Use `Record<string, never>` for empty custom state

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `card-instance.ts` |
| Types/Interfaces | PascalCase | `CardInstance` |
| Functions | camelCase | `createCard()` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_HAND_SIZE` |
| Type parameters | TPascalCase | `TCustomState` |
| Test files | `*.test.ts` or `*.spec.ts` | `card-instance.test.ts` |

## Import Patterns

```typescript
// 1. Type-only imports first (use `import type`)
import type { CardId, PlayerId, ZoneId } from "../types";

// 2. External packages
import { produce } from "immer";

// 3. Internal packages
import { RuleEngine } from "@tcg/core";

// 4. Relative imports
import { createCard } from "./card-factory";
```

### Barrel Exports
- Export public APIs through `index.ts` files
- Use `export type` for type-only exports

```typescript
// index.ts
export type { CardInstance, CardDefinition } from "./cards";
export { createCard, getCardById } from "./cards";
```

## Oxc Formatting

Oxc formatter (via `oxfmt`) handles all formatting automatically:
- **Indent**: 2 spaces
- **Quotes**: Double quotes (`"string"`)
- **Semicolons**: Required
- **Trailing commas**: ES5 style

Run formatting: `bun run format`

## Code Quality Rules

### Functions
- Keep functions small and focused on a single task
- Prefer pure functions (no side effects)
- Use descriptive names that reveal intent

### Immutability
- All state changes must go through Immer
- Never mutate state directly
- Return new objects/arrays instead of mutating

```typescript
// Good - using Immer
const newState = produce(state, (draft) => {
  draft.cards.push(newCard);
});

// Bad - direct mutation
state.cards.push(newCard);
```

### Dead Code
- Remove unused code, don't comment it out
- Remove unused imports (oxlint enforces this)
- No backward compatibility shims unless explicitly required

## Documentation

### JSDoc for Public APIs
```typescript
/**
 * Creates a new card instance
 * @param definition - The card definition to instantiate
 * @param owner - The player who owns this card
 * @returns A new CardInstance
 */
export function createCard(
  definition: CardDefinition,
  owner: PlayerId
): CardInstance {
  // ...
}
```

### Comments
- Use comments to explain "why", not "what"
- Keep comments concise and up-to-date
- Don't add comments for self-explanatory code

## Reference

Full coding standards: `agent-os/standards/global/coding-style.md`
