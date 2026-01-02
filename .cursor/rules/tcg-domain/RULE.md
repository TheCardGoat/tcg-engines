---
description: "TCG domain concepts and game logic rules. Apply when working on game-specific code, card implementations, or rule systems."
globs: ["packages/*-engine/**/*.ts", "packages/*-cards/**/*.ts"]
---

# TCG Domain Rules

When working on game engine code, follow these domain concepts:

## Core Terminology

### Players
- **Owner** - Player who brought a card (never changes)
- **Controller** - Player currently controlling (can change via effects)
- **Active Player** - Whose turn it is

### Cards
- **Card Definition** - Static data (id, name, cost, abilities)
- **Card Instance** - Runtime state (zone, tapped, damage)

### Zones
Common: Deck, Hand, Play Area, Discard, Exile
Game-specific: Inkwell (Lorcana)

## Ability Types

1. **Keyword** - Named abilities (Evasive, Rush, Ward)
2. **Triggered** - "When X happens, do Y"
3. **Activated** - Player choice with cost
4. **Static** - Always in effect

## Implementation Patterns

### Use Core Zone Operations
```typescript
// Good
moveCard(state, { from: 'hand', to: 'field', cardId });

// Bad - manual manipulation
state.hand.splice(index, 1);
state.field.push(card);
```

### Branded Types
```typescript
type CardId = string & { readonly brand: unique symbol };
type PlayerId = string & { readonly brand: unique symbol };
```

## Reference
Full documentation: `.claude/rules/domain-concepts.md`
