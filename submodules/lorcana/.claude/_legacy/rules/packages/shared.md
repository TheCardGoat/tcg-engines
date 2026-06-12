---
paths: packages/shared/**/*.ts
---

# Shared Package Rules

## Overview

The shared package contains common utilities and type definitions used across all packages in the monorepo. It should contain only game-agnostic code.

## Guidelines

### What Belongs Here

- **Common utilities** - Generic helper functions
- **Shared types** - Types used by multiple packages
- **Constants** - Project-wide constants
- **Logging utilities** - Shared logging helpers

### What Does NOT Belong Here

- **Game-specific logic** - Goes in game engine packages
- **UI components** - Goes in component-library
- **Core framework code** - Goes in core package

## Structure

```
packages/shared/src/
├── utils/        # Utility functions
├── types/        # Shared type definitions
├── constants/    # Shared constants
└── index.ts      # Package exports
```

## Import Pattern

```typescript
// From other packages
import { someUtility, SomeType } from "@tcg/shared";
```

## Best Practices

1. **Keep it minimal** - Only add truly shared code
2. **No dependencies on game packages** - shared is a leaf dependency
3. **Well-documented** - Export documentation for utilities
4. **Fully tested** - All utilities should have tests
5. **Type-safe** - Use proper TypeScript types

## Example Utility

```typescript
/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param array - The array to shuffle
 * @param rng - Random number generator function
 * @returns A new shuffled array
 */
export function shuffle<T>(array: T[], rng: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

## Related

- Core framework: `packages/core/`
- Type patterns: `agent-os/standards/library/types.md`
