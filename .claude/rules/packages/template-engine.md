---
paths: packages/template-engine/**/*.ts
---

# Template Engine Rules

## Overview

The template-engine package provides a minimal working example for creating new game engines with @tcg/core. Use this as a starting point and reference when implementing new TCGs.

## Purpose

- **Reference implementation** - Shows correct patterns
- **Minimal example** - No unnecessary complexity
- **Fully tested** - Demonstrates TDD approach
- **Copy-paste friendly** - Easy to duplicate and customize

## Package Structure

```
packages/template-engine/src/
├── game-definition/
│   ├── index.ts           # Main game definition
│   ├── zones.ts           # Zone configurations
│   ├── moves/             # Move handlers
│   └── setup.ts           # Game setup
├── types/
│   └── index.ts           # Game-specific types
├── testing/
│   └── index.ts           # Test utilities
└── index.ts               # Package exports
```

## Creating a New Engine

1. **Copy template-engine:**
   ```bash
   cp -r packages/template-engine packages/my-game-engine
   ```

2. **Update package.json:**
   ```json
   {
     "name": "@tcg/my-game",
     "version": "0.1.0"
   }
   ```

3. **Define custom state:**
   ```typescript
   type MyGameCardState = {
     // Game-specific card properties
   };
   ```

4. **Configure zones:**
   ```typescript
   export const myGameZones: ZoneConfig[] = [
     { id: "deck", type: "hidden", ordered: true },
     { id: "hand", type: "hidden", ordered: false },
     // Add game-specific zones
   ];
   ```

5. **Implement moves:**
   ```typescript
   export const drawCardMove: MoveDefinition = {
     type: "drawCard",
     canMake: (state) => state.deck.length > 0,
     execute: (state) => {
       drawCards(state, state.activePlayer, 1);
     },
   };
   ```

6. **Add win conditions:**
   ```typescript
   export const myWinCondition: WinCondition = {
     check: (state) => {
       // Return { winner: playerId } or null
     },
   };
   ```

## Best Practices

1. **Start simple** - Add complexity only as needed
2. **Follow patterns** - Match template-engine structure
3. **Test first** - Write tests before implementation
4. **Reference lorcana-engine** - For complex patterns

## Related

- Core framework: `packages/core/`
- Complex example: `packages/lorcana-engine/`
- Integration guide: `packages/core/docs/ENGINE_INTEGRATION.md`
