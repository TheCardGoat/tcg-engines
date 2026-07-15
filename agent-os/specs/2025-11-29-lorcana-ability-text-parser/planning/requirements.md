# Requirements - Lorcana Ability Text Parser

## Overview

Create a parser that converts raw Lorcana card ability text into type-safe `Ability` objects matching the Lorcana Engine's type definitions.

## Source Data

- **Input file**: `.claude/skills/lorcana-rules/references/all-cards-text/all-lorcana-texts.ts`
- **Total unique texts**: 1552
- **Release cadence**: Cards released quarterly - parser facilitates ongoing data generation

## Target Types

Located in `packages/lorcana-engine/src/cards/abilities/types/`:
- `ability-types.ts` - Main ability union types
- `effect-types.ts` - Effect types
- `trigger-types.ts` - Trigger types
- `condition-types.ts` - Condition types
- `target-types.ts` - Target types
- `cost-types.ts` - Cost types

---

## Requirements Q&A

### 1. Parser Architecture

**Question**: Should the parser be rule-based/deterministic or LLM-based with hybrid approach for ambiguous cases?

**Answer**: **Deterministic** - Rule-based pattern matching, no LLM involvement.

---

### 2. Output Format

**Question**: Should the parser output include a confidence score or parsing status (e.g., 'parsed', 'partial', 'unrecognized') for tracking coverage?

**Answer**: **No confidence scores** - Just the JSON representation of the `Ability` object, also containing its `name` and `text` fields.

**Clarification**: Basic success/failure status and warnings are acceptable for error handling purposes, but no numeric confidence scores.

---

### 3. Error Handling

**Question**: Should we have strict mode (throws on unparseable text) vs lenient mode (returns fallback or logs warnings)?

**Answer**: **Lenient mode** - Returns fallback or logs warnings for bulk processing. No throwing on parse failures.

---

### 4. Testing Strategy

**Question**: Given 1552 unique texts, what testing approach should we use?

**Answer**:
- Write unit tests for each **pattern category** (keywords, triggered, activated, static)
- Create a **coverage report** showing parse success rate
- Test **representative examples** per pattern, NOT individual tests for all 1552

---

### 5. Input Format Support

**Question**: Should the parser accept placeholder format (`{d}`, `{E}`, `{I}`), resolved format (actual numbers), or both?

**Answer**: **Both formats** - Support both placeholder tokens and resolved values.

---

### 6. Scope Boundaries

**Question**: What should be out of scope?

**Answer**: The following are **out of scope**:
- Full card definitions (stats, costs, classifications)
- Reverse parser (Ability to text)
- Card-specific name handling (recognizing "Elsa", "Flotsam" as character names)

---

## Visual Assets

**Status**: No visual assets provided.

---

## Summary Table

| Aspect | Decision |
|--------|----------|
| **Architecture** | Deterministic/rule-based parser |
| **Output** | JSON `Ability` object with `name` and `text` fields |
| **Error Handling** | Lenient mode (fallback/warnings for bulk processing) |
| **Testing** | Unit tests per pattern category + coverage report |
| **Input Format** | Both placeholder and resolved formats |
| **Out of Scope** | Full card definitions, reverse parser, card-specific name handling |

---

## Date

Requirements gathered: 2025-11-29
