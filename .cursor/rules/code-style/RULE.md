---
description: "TypeScript code style and formatting rules. Apply to all TypeScript files."
globs: ["**/*.ts", "**/*.tsx"]
---

# Code Style Rules

## TypeScript Strict Mode

### Required
- No `any` types - use `unknown` if truly unknown
- Strict null checks - handle null/undefined explicitly
- No implicit any - all variables must have types
- No unused variables - remove or prefix with `_`

### Type Patterns
```typescript
// Branded types for IDs
type CardId = string & { readonly brand: unique symbol };

// Discriminated unions
type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

// Type-only imports
import type { CardInstance, GameState } from "@tcg/core";
```

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `card-instance.ts` |
| Types | PascalCase | `CardInstance` |
| Functions | camelCase | `createCard()` |
| Constants | SCREAMING_SNAKE | `MAX_HAND_SIZE` |
| Type params | TPascalCase | `TCustomState` |

## Import Order

1. Type-only imports (`import type`)
2. External packages
3. Internal packages (`@tcg/core`)
4. Relative imports

## Formatting

Handled by Biome:
- 2-space indent
- Double quotes
- Semicolons required
- ES5 trailing commas

Run: `bun run format`

## Reference
Full documentation: `.claude/rules/code-style.md`
