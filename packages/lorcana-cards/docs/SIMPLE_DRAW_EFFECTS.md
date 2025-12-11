# Simple Draw Effects

This document describes the implementation and validation of "Simple Draw Effects" in the Lorcana card generator.

## Definition

A **Simple Draw Effect** is a card ability that *exclusively* draws cards, or consists of valid wrappers (optional, conditional) around a draw effect. Complexity like damaging, banishing, or discarding in the same sequence invalidates the "simple" classification.

### Core Logic

The function `isSimpleDrawEffect` in `parser-validator.ts` determines validity.

**Accepted (**`true`**):**
- **Atomic Draw:** `Draw a card`, `Draw 2 cards`, `Draw {d} cards`.
- **Targeted:** `Each player draws a card`, `Chosen player...`.
- **Triggered:** `When X, draw a card`.
- **Nested/Wrapped:**
    - **Optional:** `You may draw a card`.
    - **Conditional:** `If X, draw a card` (provided the parser handles the condition).
    - **For-Each:** `Draw a card for each X`.
    - **Repeat:** `Draw a card. Repeat this 3 times`.

**Rejected (**`false`**):**
- **Mixtures:** `Draw a card, then discard`.
- **Sequences:** Any sequence is currently rejected to enforce purity, unless the sequence is purely draw-related (which is rare).
- **Choice:** `Choose one: Draw or Discard` is rejected.
- **Complex Conditionals:** `If X, draw a card; else discard`.

## Implementation Details

### Parser
The `effect-parser.ts` produces effects of type `draw`, `optional`, `conditional`, `for-each`, `repeat`.
The validator checks recursively:
- If `type === 'draw'`, it checks that no extra keys exist.
- If `type \in {optional, conditional, for-each, repeat}`, it recurses into the inner `effect` (or `then`/`else` branches).

### Validator
`isParseableCard` uses `isSimpleDrawEffect` to allow Action, Triggered, and Activated abilities ONLY if their effect is a simple draw. This prevents generating cards with complex un-implemented logic while enabling card draw cards.

## Debugging

To verify which cards are accepted:
1. Run `bun packages/lorcana-cards/scripts/generate-cards.ts`.
2. Inspect the output section "Cards with simple draw effects".

## Adding New Patterns

To support new patterns (e.g., specific conditionals):
1. Ensure `parseAbilityText` correctly parses the text into a structured `Ability`.
2. Ensure the resulting `Effect` structure is handled by the recursive checking in `isSimpleDrawEffect`.
3. Add a test case in `simple-draw-effects.test.ts`.
