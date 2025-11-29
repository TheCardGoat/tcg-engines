# Initial Spec Idea

## User's Initial Description
**Lorcana Ability Text Parser**

## Description
Create a parser that converts raw Lorcana card text (from `.claude/skills/lorcana-rules/references/all-cards-text/all-lorcana-texts.ts`) into type-safe ability objects that match the Lorcana Engine's ability type definitions.

## Context
- The source data contains 1552 unique card ability texts in `allCardsText` array
- The target types are defined in `packages/lorcana-engine/src/cards/abilities/types/`
- Cards are released quarterly, so this parser will facilitate ongoing card data generation
- The parser must produce type-safe output matching `Ability` type from `ability-types.ts`

## Key Type Information
The ability type system includes:
- **KeywordAbility**: Rush, Ward, Evasive, Bodyguard, Support, Reckless, Vanish, Alert (simple), Challenger +X, Resist +X (parameterized), Singer, SingTogether, Boost (value-based), Shift (cost-based)
- **TriggeredAbility**: Has trigger (when/whenever/at), optional condition, and effect
- **ActivatedAbility**: Has cost ({E}, {I}, banish), optional condition, and effect
- **StaticAbility**: Always-active effect with optional condition
- **ReplacementAbility**: Modifies how events happen

## Example Text Patterns from Source
- Simple: "Rush", "Ward", "Evasive"
- Parameterized: "Challenger +{d}", "Resist +{d}"
- Value-based: "Shift {d}", "Singer {d}", "Boost {d}"
- Triggered: "When you play this character, draw 2 cards"
- Activated: "{E} - Draw a card", "{E}, {d} {I} - Deal {d} damage to chosen character"
- Static: "Your characters gain Ward", "HIDDEN AWAY This character can't be challenged"

Note: `{d}` represents a numeric placeholder, `{E}` represents exert symbol, `{I}` represents ink symbol.

Create the spec folder at `agent-os/specs/` with today's date (2025-11-29) and name it appropriately for this parser feature.

Return the path to the created spec folder.

## Metadata
- Date Created: 2025-11-29
- Spec Name: lorcana-ability-text-parser
- Spec Path: /Users/eduardo.moroni/projects/the-card-goat/tcg-engines/agent-os/specs/2025-11-29-lorcana-ability-text-parser
