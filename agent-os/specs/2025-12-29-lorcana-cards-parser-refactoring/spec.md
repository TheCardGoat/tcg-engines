# Specification: Lorcana Cards Parser Refactoring

## Executive Summary

This specification defines a comprehensive refactoring of the lorcana-cards parser from a monolithic regex-based architecture to a modular grammar-based system using Chevrotain. The new parser (v2) will replace the existing implementation in a single PR, removing all legacy code and improving maintainability, extensibility, and correctness.

**Core Objective:** Transform a 1,265-line monolithic parser with 70+ if/else branches and 50+ regex patterns into a modular, declarative grammar-based system where each effect type is isolated in its own file (~50-100 lines).

**Key Metrics:**
- **Readability:** Each effect type in its own file (~50-100 lines each)
- **Extensibility:** Adding new effect = create one file + register it
- **Coverage:** 80% automated parsing, 20% manual overrides acceptable
- **Test Coverage:** 95%+ on v2 parser code
- **Deployment:** Single PR with complete v1 removal (no deprecation period)

## Problem Statement

### Current Architecture Pain Points

The existing parser (`packages/lorcana-cards/src/parser/`) suffers from several architectural limitations:

**1. Monolithic Effect Parser (1,265 lines)**
- Single `parseAtomicEffect()` function with 70+ if/else branches
- Total of 134 if statements scattered across effect-parser.ts
- Extremely difficult to understand control flow
- High cyclomatic complexity makes testing difficult
- Adding new effects requires modifying a massive function

**2. Regex Pattern Proliferation (494 lines)**
- 50+ regex patterns spread across `patterns/effects.ts`
- Patterns overlap and conflict
- No clear precedence rules
- Difficult to debug pattern matching
- Regex maintenance is error-prone

**3. Manual Override Burden (2,803 lines)**
- Large manual override file for edge cases
- No clear separation between parser failures and genuine edge cases
- Difficult to identify which cards need overrides vs parser bugs

**4. Poor Extensibility**
- Adding a new effect type touches multiple files
- No clear plugin architecture
- Risk of breaking existing parsers when adding new ones
- Tight coupling between effect types

**5. Limited Debugging Capability**
- No structured logging
- Difficult to trace why parsing failed
- No clear error messages for malformed ability text
- Hard to identify which pattern matched or why none matched

### Quantitative Current State

| Metric | Value |
|--------|-------|
| effect-parser.ts lines | 1,265 |
| if statements in effect-parser.ts | 134 |
| if/else branches in parseAtomicEffect() | 70+ |
| patterns/effects.ts lines | 494 |
| manual-overrides.ts lines | 2,803 |
| Total regex patterns | 50+ |
| Files touched to add new effect | 3-5 |

### Impact on Development

- **New developers:** 2-3 days to understand parser architecture
- **Adding new effect:** 2-4 hours (requires understanding entire parser)
- **Debugging parser failure:** 1-2 hours (no structured logging)
- **Maintenance cost:** High (tight coupling, poor separation of concerns)

## Proposed Solution

### High-Level Architecture

Replace the regex-based parser with a **grammar-based parser using Chevrotain** organized into four distinct layers:

```
┌─────────────────────────────────────────────────────┐
│                 Ability Text Input                   │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│              1. Lexer Layer (Chevrotain)             │
│         Tokenize: keywords, numbers, symbols         │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│            2. Grammar Layer (Chevrotain)             │
│    Define rules: ability, trigger, effect, target   │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│           3. AST Visitor Layer (Visitor)             │
│         Transform CST → Typed Ability objects        │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│         4. Effect Registry (Modular Parsers)         │
│    Plugin-style parsers: one file per effect type   │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│              Typed Effect Objects Output             │
└─────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

**Decision 1: Chevrotain with Visitor Pattern**
- Use Chevrotain for lexing and parsing (TypeScript-native, performant)
- Implement visitor pattern for CST→AST transformation
- Rationale: Cleaner separation of concerns, easier testing

**Decision 2: Single PR with Complete v1 Removal**
- No side-by-side existence or feature flags
- Complete removal of legacy parser in same PR as v2 introduction
- Rationale: Simpler mental model, no maintenance burden of dual parsers

**Decision 3: 80/20 Rule**
- Target 80% automated parsing, 20% manual overrides acceptable
- Don't over-engineer grammar for rare edge cases
- Rationale: Balance between parser complexity and coverage

**Decision 4: Explicit Effect Registration**
- Effect parsers registered explicitly in index file
- No auto-discovery via directory scanning
- Rationale: Better tree-shaking, type safety, clear dependencies

**Decision 5: Registration Order for Precedence**
- Effect parsers match in registration order (no priority system)
- More specific parsers registered before generic ones
- Rationale: Simpler implementation, explicit control

**Decision 6: Comprehensive Logging Infrastructure**
- Structured logging throughout parser pipeline
- Debug mode for deep troubleshooting
- Rationale: Simplifies debugging during development and production

**Decision 7: 95%+ Coverage Target for v2 Code Only**
- Test coverage target applies only to new v2 parser code
- End-to-end card parsing tests separate from parser unit coverage
- Rationale: Focus on parser correctness, not overall system coverage

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Parser Framework | Chevrotain | 11.0.3+ | Lexing and parsing |
| Logging | TBD (pino or winston) | Latest stable | Structured logging |
| Testing | Bun test | 1.3.3+ | Unit and integration tests |
| Language | TypeScript | 5.8.3+ | Strict mode |

## Technical Design

### Directory Structure

```
packages/lorcana-cards/src/parser/
├── v2/                              # New parser implementation
│   ├── lexer/
│   │   ├── tokens.ts                # Token definitions
│   │   ├── lexer.ts                 # Chevrotain lexer instance
│   │   └── index.ts                 # Exports
│   ├── grammar/
│   │   ├── ability-grammar.ts       # Top-level ability rules
│   │   ├── trigger-grammar.ts       # Trigger phrase rules
│   │   ├── effect-grammar.ts        # Effect phrase rules
│   │   ├── target-grammar.ts        # Target clause rules
│   │   ├── condition-grammar.ts     # Condition clause rules
│   │   └── index.ts                 # Parser class + exports
│   ├── visitors/
│   │   ├── base-visitor.ts          # Base CST visitor
│   │   ├── ability-visitor.ts       # Ability AST construction
│   │   ├── effect-visitor.ts        # Effect AST construction
│   │   └── index.ts                 # Exports
│   ├── effects/
│   │   ├── atomic/
│   │   │   ├── draw-effect.ts       # Draw card effects
│   │   │   ├── discard-effect.ts    # Discard effects
│   │   │   ├── damage-effect.ts     # Damage effects
│   │   │   ├── lore-effect.ts       # Lore gain/loss
│   │   │   ├── exert-effect.ts      # Exert/ready effects
│   │   │   ├── banish-effect.ts     # Banish/return effects
│   │   │   ├── stat-mod-effect.ts   # Stat modifications
│   │   │   ├── keyword-effect.ts    # Keyword grants
│   │   │   ├── play-effect.ts       # Play card effects
│   │   │   ├── reveal-effect.ts     # Reveal effects
│   │   │   ├── search-effect.ts     # Search/look effects
│   │   │   ├── inkwell-effect.ts    # Inkwell effects
│   │   │   ├── location-effect.ts   # Location movement
│   │   │   └── index.ts             # Registry + exports
│   │   ├── composite/
│   │   │   ├── sequence-effect.ts   # Sequential effects
│   │   │   ├── choice-effect.ts     # Choice effects
│   │   │   ├── optional-effect.ts   # Optional effects
│   │   │   ├── for-each-effect.ts   # For-each loops
│   │   │   ├── conditional-effect.ts# Conditional effects
│   │   │   ├── repeat-effect.ts     # Repeat effects
│   │   │   └── index.ts             # Registry + exports
│   │   └── index.ts                 # Main effect registry
│   ├── logging/
│   │   ├── logger.ts                # Logger configuration
│   │   ├── context.ts               # Logging context types
│   │   └── index.ts                 # Exports
│   ├── types.ts                     # Internal v2 types
│   └── index.ts                     # Main v2 parser export
├── manual-overrides.ts              # Keep existing (migrate format if needed)
├── numeric-extractor.ts             # Keep existing (may reuse)
├── preprocessor.ts                  # Keep existing (may reuse)
├── classifier.ts                    # Keep existing
└── index.ts                         # Update to use v2 parser
```

### Layer 1: Lexer (Token Definitions)

**File:** `v2/lexer/tokens.ts`

Define token vocabulary for Lorcana ability text:

```typescript
import type { TokenType } from "chevrotain";
import { createToken, Lexer } from "chevrotain";

// Keywords
export const When = createToken({ name: "When", pattern: /when/i });
export const Whenever = createToken({ name: "Whenever", pattern: /whenever/i });
export const At = createToken({ name: "At", pattern: /at/i });
export const During = createToken({ name: "During", pattern: /during/i });
export const Draw = createToken({ name: "Draw", pattern: /draw/i });
export const Discard = createToken({ name: "Discard", pattern: /discard/i });
export const Deal = createToken({ name: "Deal", pattern: /deal/i });
export const Damage = createToken({ name: "Damage", pattern: /damage/i });
export const Gain = createToken({ name: "Gain", pattern: /gain/i });
export const Lose = createToken({ name: "Lose", pattern: /lose/i });
export const Exert = createToken({ name: "Exert", pattern: /exert/i });
export const Ready = createToken({ name: "Ready", pattern: /ready/i });
export const Banish = createToken({ name: "Banish", pattern: /banish/i });
export const Return = createToken({ name: "Return", pattern: /return/i });
export const Play = createToken({ name: "Play", pattern: /play/i });
export const Character = createToken({ name: "Character", pattern: /character/i });
export const Item = createToken({ name: "Item", pattern: /item/i });
export const Location = createToken({ name: "Location", pattern: /location/i });
export const Card = createToken({ name: "Card", pattern: /card/i });
export const Choose = createToken({ name: "Choose", pattern: /choose/i });
export const Your = createToken({ name: "Your", pattern: /your/i });
export const Opponent = createToken({ name: "Opponent", pattern: /opponent/i });
export const Each = createToken({ name: "Each", pattern: /each/i });
export const All = createToken({ name: "All", pattern: /all/i });
export const Another = createToken({ name: "Another", pattern: /another/i });
export const Other = createToken({ name: "Other", pattern: /other/i });
export const This = createToken({ name: "This", pattern: /this/i });

// Symbols
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Period = createToken({ name: "Period", pattern: /\./ });
export const Dash = createToken({ name: "Dash", pattern: /-/ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });

// Literals
export const Number = createToken({ name: "Number", pattern: /\d+/ });
export const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]+/ });

// Whitespace (skipped)
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// Token array (order matters!)
export const allTokens: TokenType[] = [
  WhiteSpace,
  // Keywords (must come before Identifier)
  When, Whenever, At, During,
  Draw, Discard, Deal, Damage,
  Gain, Lose, Exert, Ready,
  Banish, Return, Play,
  Character, Item, Location, Card,
  Choose, Your, Opponent,
  Each, All, Another, Other, This,
  // Symbols
  Comma, Period, Dash, Colon,
  // Literals
  Number, Identifier,
];
```

**File:** `v2/lexer/lexer.ts`

```typescript
import { Lexer } from "chevrotain";
import { allTokens } from "./tokens";

export const LorcanaLexer = new Lexer(allTokens);
```

### Layer 2: Grammar (Parser Rules)

**File:** `v2/grammar/ability-grammar.ts`

Define top-level grammar rules:

```typescript
import { CstParser } from "chevrotain";
import { allTokens, When, Whenever, /* ... */ } from "../lexer/tokens";

export class LorcanaAbilityParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  // Top-level ability rule
  ability = this.RULE("ability", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.triggeredAbility) },
      { ALT: () => this.SUBRULE(this.activatedAbility) },
      { ALT: () => this.SUBRULE(this.staticAbility) },
      { ALT: () => this.SUBRULE(this.keywordAbility) },
    ]);
  });

  // Triggered ability: "When/Whenever <trigger>, <effect>"
  triggeredAbility = this.RULE("triggeredAbility", () => {
    this.SUBRULE(this.triggerPhrase);
    this.CONSUME(Comma);
    this.SUBRULE(this.effectPhrase);
  });

  // Trigger phrase
  triggerPhrase = this.RULE("triggerPhrase", () => {
    this.OR([
      { ALT: () => this.CONSUME(When) },
      { ALT: () => this.CONSUME(Whenever) },
    ]);
    this.SUBRULE(this.triggerEvent);
  });

  // Effect phrase (delegates to effect grammar)
  effectPhrase = this.RULE("effectPhrase", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.atomicEffect) },
      { ALT: () => this.SUBRULE(this.compositeEffect) },
    ]);
  });

  // Atomic effect (delegates to specific effect rules)
  atomicEffect = this.RULE("atomicEffect", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.drawEffect) },
      { ALT: () => this.SUBRULE(this.discardEffect) },
      { ALT: () => this.SUBRULE(this.damageEffect) },
      // ... more effect types
    ]);
  });

  // Draw effect: "draw <number> card(s)"
  drawEffect = this.RULE("drawEffect", () => {
    this.CONSUME(Draw);
    this.CONSUME(Number);
    this.CONSUME(Card);
    this.OPTION(() => this.CONSUME(Identifier)); // "cards"
  });

  // ... more rules
}
```

### Layer 3: Visitor (CST → AST)

**File:** `v2/visitors/ability-visitor.ts`

```typescript
import type { CstNode } from "chevrotain";
import { LorcanaAbilityParser } from "../grammar";
import type { Ability, Effect } from "@tcg/lorcana";
import { logger } from "../logging";

const parser = new LorcanaAbilityParser();
const BaseVisitor = parser.getBaseCstVisitorConstructor();

export class AbilityVisitor extends BaseVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  ability(ctx: CstNode): Ability {
    logger.debug("Visiting ability node", { ctx });

    if (ctx.triggeredAbility) {
      return this.visit(ctx.triggeredAbility);
    }
    if (ctx.activatedAbility) {
      return this.visit(ctx.activatedAbility);
    }
    if (ctx.staticAbility) {
      return this.visit(ctx.staticAbility);
    }
    if (ctx.keywordAbility) {
      return this.visit(ctx.keywordAbility);
    }

    throw new Error("Unknown ability type");
  }

  triggeredAbility(ctx: CstNode): Ability {
    logger.debug("Visiting triggered ability", { ctx });

    const trigger = this.visit(ctx.triggerPhrase);
    const effect = this.visit(ctx.effectPhrase);

    return {
      type: "triggered",
      trigger,
      effect,
    };
  }

  drawEffect(ctx: CstNode): Effect {
    logger.debug("Visiting draw effect", { ctx });

    const amount = Number.parseInt(ctx.Number[0].image, 10);

    return {
      type: "draw",
      amount,
    };
  }

  // ... more visitor methods
}
```

### Layer 4: Effect Registry

**File:** `v2/effects/atomic/draw-effect.ts`

Individual effect parser (50-100 lines each):

```typescript
import type { CstNode } from "chevrotain";
import type { Effect } from "@tcg/lorcana";
import { logger } from "../../logging";
import { extractNumber } from "../../../numeric-extractor";

export interface EffectParser {
  /**
   * Pattern that this parser handles.
   * Can be a regex or grammar rule name.
   */
  pattern: RegExp | string;

  /**
   * Parse the effect from CST node or text.
   */
  parse: (input: CstNode | string) => Effect | null;

  /**
   * Optional description for debugging.
   */
  description?: string;
}

export const drawEffectParser: EffectParser = {
  pattern: /draw (\d+) cards?/i,
  description: "Parses draw card effects",

  parse: (input: CstNode | string): Effect | null => {
    logger.debug("Attempting to parse draw effect", { input });

    if (typeof input === "string") {
      const match = input.match(/draw (\d+) cards?/i);
      if (!match) {
        logger.debug("Draw effect pattern did not match");
        return null;
      }

      const amount = extractNumber(match[1]);
      if (amount === null) {
        logger.warn("Failed to extract number from draw effect", { match });
        return null;
      }

      logger.info("Parsed draw effect", { amount });
      return {
        type: "draw",
        amount,
      };
    }

    // Handle CstNode if coming from grammar
    // ... CST parsing logic
    return null;
  },
};
```

**File:** `v2/effects/atomic/index.ts`

Explicit effect registration:

```typescript
import type { EffectParser } from "./draw-effect";
import { drawEffectParser } from "./draw-effect";
import { discardEffectParser } from "./discard-effect";
import { damageEffectParser } from "./damage-effect";
import { loreEffectParser } from "./lore-effect";
// ... import all effect parsers

/**
 * Registry of atomic effect parsers.
 * Order matters - more specific parsers should come first.
 */
export const atomicEffectParsers: EffectParser[] = [
  // Order by specificity (most specific first)
  drawEffectParser,
  discardEffectParser,
  damageEffectParser,
  loreEffectParser,
  exertEffectParser,
  banishEffectParser,
  statModEffectParser,
  keywordEffectParser,
  playEffectParser,
  revealEffectParser,
  searchEffectParser,
  inkwellEffectParser,
  locationEffectParser,
  // Add new parsers here
];

/**
 * Parse an atomic effect by trying each registered parser in order.
 */
export function parseAtomicEffect(input: string): Effect | null {
  for (const parser of atomicEffectParsers) {
    const result = parser.parse(input);
    if (result !== null) {
      return result;
    }
  }
  return null;
}
```

### Logging Infrastructure

**File:** `v2/logging/logger.ts`

```typescript
/**
 * Logging infrastructure for v2 parser.
 * Provides structured logging with context.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  cardName?: string;
  abilityText?: string;
  stage?: string;
  parser?: string;
  reason?: string;
  [key: string]: unknown;
}

class ParserLogger {
  private level: LogLevel = "info";
  private enabled = true;

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log("error", message, context);
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.enabled) return;
    if (!this.shouldLog(level)) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };

    // Use console for now, can be replaced with pino/winston later
    const logFn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    logFn(JSON.stringify(logEntry));
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    const currentIndex = levels.indexOf(this.level);
    const messageIndex = levels.indexOf(level);
    return messageIndex >= currentIndex;
  }
}

export const logger = new ParserLogger();

// Configure based on environment
if (process.env.PARSER_DEBUG === "true") {
  logger.setLevel("debug");
}
```

### Composite Effects

**File:** `v2/effects/composite/sequence-effect.ts`

```typescript
import type { Effect } from "@tcg/lorcana";
import { logger } from "../../logging";
import { parseAtomicEffect } from "../atomic";

/**
 * Parses sequence effects: "Do X, then Y, then Z"
 */
export function parseSequenceEffect(text: string): Effect | null {
  logger.debug("Attempting to parse sequence effect", { text });

  // Split on common sequence separators
  const separators = [", then ", ". Then ", ", and then "];
  let steps: string[] = [];

  for (const separator of separators) {
    if (text.toLowerCase().includes(separator.toLowerCase())) {
      steps = text.split(new RegExp(separator, "i"));
      break;
    }
  }

  if (steps.length < 2) {
    logger.debug("No sequence pattern found");
    return null;
  }

  const effects: Effect[] = [];
  for (const step of steps) {
    const effect = parseAtomicEffect(step.trim());
    if (effect) {
      effects.push(effect);
    } else {
      logger.warn("Failed to parse sequence step", { step });
    }
  }

  if (effects.length === 0) {
    logger.warn("Sequence parsing produced no effects");
    return null;
  }

  logger.info("Parsed sequence effect", { stepCount: effects.length });
  return {
    type: "sequence",
    effects,
  };
}
```

### Main Parser Entry Point

**File:** `v2/index.ts`

```typescript
import { LorcanaLexer } from "./lexer";
import { LorcanaAbilityParser } from "./grammar";
import { AbilityVisitor } from "./visitors";
import { parseAtomicEffect } from "./effects/atomic";
import type { Ability } from "@tcg/lorcana";
import { logger } from "./logging";

export class LorcanaParserV2 {
  private lexer = LorcanaLexer;
  private parser = new LorcanaAbilityParser();
  private visitor = new AbilityVisitor();

  /**
   * Parse ability text into typed Ability objects.
   */
  parseAbility(text: string): Ability | null {
    logger.info("Parsing ability", { text });

    try {
      // Lexing
      const lexResult = this.lexer.tokenize(text);
      if (lexResult.errors.length > 0) {
        logger.error("Lexing failed", {
          text,
          errors: lexResult.errors,
        });
        return null;
      }

      // Parsing
      this.parser.input = lexResult.tokens;
      const cst = this.parser.ability();
      if (this.parser.errors.length > 0) {
        logger.error("Parsing failed", {
          text,
          errors: this.parser.errors,
        });
        return null;
      }

      // Visiting
      const ability = this.visitor.visit(cst);
      logger.info("Successfully parsed ability", { ability });
      return ability;

    } catch (error) {
      logger.error("Unexpected error during parsing", {
        text,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }
}

export const parserV2 = new LorcanaParserV2();
```

## API Design

### Public Interfaces

**Main Parser API:**

```typescript
import type { Ability } from "@tcg/lorcana";

export class LorcanaParserV2 {
  /**
   * Parse ability text into a typed Ability object.
   * Returns null if parsing fails.
   */
  parseAbility(text: string): Ability | null;

  /**
   * Enable debug logging for troubleshooting.
   */
  enableDebugLogging(): void;

  /**
   * Disable debug logging.
   */
  disableDebugLogging(): void;
}
```

**Effect Parser Interface:**

```typescript
export interface EffectParser {
  /**
   * Pattern that this parser handles.
   * Used for documentation and potential optimizations.
   */
  pattern: RegExp | string;

  /**
   * Parse the effect from input.
   * Returns null if this parser cannot handle the input.
   */
  parse: (input: CstNode | string) => Effect | null;

  /**
   * Optional description for debugging and documentation.
   */
  description?: string;
}
```

**Logger API:**

```typescript
export interface LogContext {
  cardName?: string;
  abilityText?: string;
  stage?: string;
  parser?: string;
  reason?: string;
  [key: string]: unknown;
}

export class ParserLogger {
  setLevel(level: "debug" | "info" | "warn" | "error"): void;
  enable(): void;
  disable(): void;
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}
```

### Integration Points

**1. Card Generation Script**

```typescript
// scripts/generate-cards.ts
import { parserV2 } from "../src/parser/v2";

// Replace:
// import { parseAbility } from "../src/parser";
// With:
// const ability = parserV2.parseAbility(abilityText);
```

**2. Manual Overrides**

```typescript
// src/parser/manual-overrides.ts
// Keep existing structure, may need format updates for v2 compatibility
export const manualOverrides: Record<string, Ability> = {
  "card-id-123": {
    // Override ability definition
  },
};
```

**3. Main Parser Export**

```typescript
// src/parser/index.ts
export { parserV2 as parser } from "./v2";
export { logger } from "./v2/logging";

// For backward compatibility during migration (if needed):
// export { parserV2 as parseAbility };
```

## Testing Strategy

### Test Coverage Target

**95%+ coverage on v2 parser code:**
- Lexer (token recognition)
- Grammar (rule matching)
- Visitors (CST→AST transformation)
- Effect parsers (all atomic and composite)
- Logger (all log levels and contexts)

**NOT required for 95% coverage:**
- End-to-end card parsing tests
- Manual override logic
- Integration with card generation scripts

### Test Levels

**1. Unit Tests - Lexer**

```typescript
// v2/lexer/__tests__/lexer.test.ts
import { describe, it, expect } from "bun:test";
import { LorcanaLexer } from "../lexer";
import { Draw, Number, Card } from "../tokens";

describe("LorcanaLexer", () => {
  it("tokenizes draw effect correctly", () => {
    const result = LorcanaLexer.tokenize("draw 2 cards");

    expect(result.errors).toHaveLength(0);
    expect(result.tokens).toHaveLength(3);
    expect(result.tokens[0].tokenType).toBe(Draw);
    expect(result.tokens[1].tokenType).toBe(Number);
    expect(result.tokens[2].tokenType).toBe(Card);
  });

  it("handles case-insensitive keywords", () => {
    const result = LorcanaLexer.tokenize("DRAW 2 CARDS");
    expect(result.errors).toHaveLength(0);
  });
});
```

**2. Unit Tests - Grammar**

```typescript
// v2/grammar/__tests__/ability-grammar.test.ts
import { describe, it, expect } from "bun:test";
import { LorcanaAbilityParser } from "../ability-grammar";
import { LorcanaLexer } from "../../lexer";

describe("LorcanaAbilityParser", () => {
  const parser = new LorcanaAbilityParser();

  it("parses triggered ability", () => {
    const text = "When you play this character, draw 2 cards.";
    const lexResult = LorcanaLexer.tokenize(text);
    parser.input = lexResult.tokens;

    const cst = parser.ability();

    expect(parser.errors).toHaveLength(0);
    expect(cst).toBeDefined();
    expect(cst.children.triggeredAbility).toBeDefined();
  });

  it("parses draw effect grammar", () => {
    const text = "draw 2 cards";
    const lexResult = LorcanaLexer.tokenize(text);
    parser.input = lexResult.tokens;

    const cst = parser.drawEffect();

    expect(parser.errors).toHaveLength(0);
    expect(cst).toBeDefined();
  });
});
```

**3. Unit Tests - Effect Parsers**

```typescript
// v2/effects/atomic/__tests__/draw-effect.test.ts
import { describe, it, expect } from "bun:test";
import { drawEffectParser } from "../draw-effect";

describe("drawEffectParser", () => {
  it("parses simple draw effect", () => {
    const result = drawEffectParser.parse("draw 2 cards");

    expect(result).toEqual({
      type: "draw",
      amount: 2,
    });
  });

  it("handles singular 'card'", () => {
    const result = drawEffectParser.parse("draw 1 card");

    expect(result).toEqual({
      type: "draw",
      amount: 1,
    });
  });

  it("returns null for non-matching input", () => {
    const result = drawEffectParser.parse("discard 2 cards");
    expect(result).toBeNull();
  });

  it("handles case insensitivity", () => {
    const result = drawEffectParser.parse("DRAW 3 CARDS");
    expect(result).not.toBeNull();
  });
});
```

**4. Integration Tests - Composite Effects**

```typescript
// v2/effects/composite/__tests__/sequence-effect.test.ts
import { describe, it, expect } from "bun:test";
import { parseSequenceEffect } from "../sequence-effect";

describe("parseSequenceEffect", () => {
  it("parses two-step sequence", () => {
    const text = "draw 2 cards, then discard 1 card";
    const result = parseSequenceEffect(text);

    expect(result).toEqual({
      type: "sequence",
      effects: [
        { type: "draw", amount: 2 },
        { type: "discard", amount: 1 },
      ],
    });
  });

  it("parses three-step sequence", () => {
    const text = "draw 1 card, then discard 1 card, then gain 1 lore";
    const result = parseSequenceEffect(text);

    expect(result?.type).toBe("sequence");
    expect(result?.effects).toHaveLength(3);
  });

  it("returns null for non-sequence text", () => {
    const result = parseSequenceEffect("draw 2 cards");
    expect(result).toBeNull();
  });
});
```

**5. Integration Tests - Full Parser**

```typescript
// v2/__tests__/parser-integration.test.ts
import { describe, it, expect } from "bun:test";
import { parserV2 } from "../index";

describe("LorcanaParserV2 - Integration", () => {
  it("parses complete triggered ability", () => {
    const text = "When you play this character, draw 2 cards.";
    const result = parserV2.parseAbility(text);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("triggered");
  });

  it("handles parsing failure gracefully", () => {
    const text = "invalid ability text ###";
    const result = parserV2.parseAbility(text);

    expect(result).toBeNull();
  });

  it("logs errors for malformed input", () => {
    // Test with debug logging enabled
    parserV2.enableDebugLogging();
    const text = "when you play";
    parserV2.parseAbility(text);
    parserV2.disableDebugLogging();

    // Assert logging occurred (may need mock/spy)
  });
});
```

**6. Regression Tests - Real Cards**

```typescript
// v2/__tests__/real-cards.test.ts
import { describe, it, expect } from "bun:test";
import { parserV2 } from "../index";

describe("Real Card Parsing", () => {
  it("parses Mickey Mouse - Brave Little Tailor", () => {
    const text = "Evasive (Only characters with Evasive can challenge this character.)";
    const result = parserV2.parseAbility(text);

    expect(result?.type).toBe("keyword");
  });

  it("parses Elsa - Snow Queen", () => {
    const text = "When you play this character, deal 2 damage to chosen character.";
    const result = parserV2.parseAbility(text);

    expect(result?.type).toBe("triggered");
    // Add more specific assertions
  });

  // Add 10-20 real card examples covering common patterns
});
```

### Test Organization

```
v2/
├── lexer/
│   └── __tests__/
│       └── lexer.test.ts
├── grammar/
│   └── __tests__/
│       ├── ability-grammar.test.ts
│       ├── trigger-grammar.test.ts
│       └── effect-grammar.test.ts
├── visitors/
│   └── __tests__/
│       └── ability-visitor.test.ts
├── effects/
│   ├── atomic/
│   │   └── __tests__/
│   │       ├── draw-effect.test.ts
│   │       ├── discard-effect.test.ts
│   │       ├── damage-effect.test.ts
│   │       └── ... (one per effect type)
│   └── composite/
│       └── __tests__/
│           ├── sequence-effect.test.ts
│           ├── choice-effect.test.ts
│           └── ... (one per composite type)
├── logging/
│   └── __tests__/
│       └── logger.test.ts
└── __tests__/
    ├── parser-integration.test.ts
    └── real-cards.test.ts
```

### TDD Workflow

1. **Write failing test** - Define expected behavior
2. **Implement parser** - Write minimal code to pass test
3. **Refactor** - Clean up while keeping tests green
4. **Run coverage** - Ensure 95%+ target maintained

```bash
# Run tests with coverage
bun test --coverage

# Run tests in watch mode during development
bun test --watch

# Run only v2 parser tests
bun test v2/
```

## Implementation Phases

The implementation is organized into 7 phases but will be delivered as a **single PR** with complete v1 removal.

### Phase 1: Foundation & Core Grammar (Combined)

**Duration:** 2-3 days

**Goal:** Set up Chevrotain infrastructure and basic grammar

**Tasks:**
1. Add `chevrotain` dependency to package.json
2. Create `v2/` directory structure
3. Implement token definitions (`v2/lexer/tokens.ts`)
4. Create lexer instance (`v2/lexer/lexer.ts`)
5. Define basic grammar rules (`v2/grammar/ability-grammar.ts`)
6. Implement base visitor class (`v2/visitors/base-visitor.ts`)
7. Set up logging infrastructure (`v2/logging/`)
8. Write tests for lexer and basic grammar (95%+ coverage)

**Acceptance Criteria:**
- Lexer tokenizes common Lorcana keywords
- Basic grammar recognizes ability structure
- Visitor pattern infrastructure works
- Logging system operational
- All tests pass with 95%+ coverage

**Files Created:**
- `v2/lexer/tokens.ts`
- `v2/lexer/lexer.ts`
- `v2/lexer/index.ts`
- `v2/grammar/ability-grammar.ts`
- `v2/grammar/index.ts`
- `v2/visitors/base-visitor.ts`
- `v2/visitors/ability-visitor.ts`
- `v2/visitors/index.ts`
- `v2/logging/logger.ts`
- `v2/logging/context.ts`
- `v2/logging/index.ts`
- `v2/types.ts`
- `v2/index.ts`

### Phase 2: Effect Registry Pattern

**Duration:** 2-3 days

**Goal:** Create modular effect parser architecture

**Tasks:**
1. Define `EffectParser` interface
2. Create effects registry with explicit registration
3. Create `v2/effects/atomic/` directory
4. Implement 5-10 common atomic effect parsers:
   - Draw effects
   - Discard effects
   - Damage effects
   - Lore effects
   - Exert/ready effects
5. Wire registry to main parser
6. Add logging to all effect parsers
7. Write unit tests for each parser (95%+ coverage)

**Acceptance Criteria:**
- Effect parser interface defined
- Registry supports explicit registration
- 5-10 atomic effect parsers working
- Tests cover all implemented parsers
- Registration order works correctly

**Files Created:**
- `v2/effects/atomic/draw-effect.ts`
- `v2/effects/atomic/discard-effect.ts`
- `v2/effects/atomic/damage-effect.ts`
- `v2/effects/atomic/lore-effect.ts`
- `v2/effects/atomic/exert-effect.ts`
- `v2/effects/atomic/banish-effect.ts`
- `v2/effects/atomic/stat-mod-effect.ts`
- `v2/effects/atomic/keyword-effect.ts`
- `v2/effects/atomic/index.ts`

### Phase 3: Composite Effects

**Duration:** 2-3 days

**Goal:** Support complex effect structures

**Tasks:**
1. Implement sequence effect parser
2. Implement choice effect parser
3. Implement optional effect parser
4. Implement for-each effect parser
5. Implement conditional effect parser
6. Implement repeat effect parser
7. Add logging for composite parsing
8. Write integration tests (95%+ coverage)

**Acceptance Criteria:**
- All composite effect types supported
- Recursive parsing of nested effects works
- Integration tests cover real card patterns
- Logging traces composite effect parsing

**Files Created:**
- `v2/effects/composite/sequence-effect.ts`
- `v2/effects/composite/choice-effect.ts`
- `v2/effects/composite/optional-effect.ts`
- `v2/effects/composite/for-each-effect.ts`
- `v2/effects/composite/conditional-effect.ts`
- `v2/effects/composite/repeat-effect.ts`
- `v2/effects/composite/index.ts`

### Phase 4: Targets & Conditions

**Duration:** 2-3 days

**Goal:** Parse target and condition clauses

**Tasks:**
1. Define target grammar rules in `v2/grammar/target-grammar.ts`
2. Implement target parsers for:
   - Characters
   - Items
   - Locations
   - Players
   - Cards
3. Define condition grammar rules in `v2/grammar/condition-grammar.ts`
4. Implement condition parsers
5. Integrate targets/conditions into effect parsers
6. Add comprehensive logging
7. Write tests for all target/condition types (95%+ coverage)

**Acceptance Criteria:**
- Target parsing works for all card types
- Condition parsing handles common patterns
- Integration with effect parsers successful
- Tests cover edge cases

**Files Created:**
- `v2/grammar/target-grammar.ts`
- `v2/grammar/condition-grammar.ts`
- `v2/visitors/target-visitor.ts`
- `v2/visitors/condition-visitor.ts`

### Phase 5: Remaining Effect Types

**Duration:** 3-4 days

**Goal:** Cover all Lorcana effect types

**Tasks:**
1. Audit v1 parser to identify all effect types
2. Create effect parser for each remaining type:
   - Play card effects
   - Reveal effects
   - Search/look effects
   - Inkwell effects
   - Location movement effects
   - Return effects
   - Stat modifications
   - Keyword grants
3. Register all new parsers
4. Add comprehensive logging
5. Write tests for each parser (95%+ coverage)
6. Validate against real card data

**Acceptance Criteria:**
- 100% of parseable effect types covered
- All parsers registered in correct order
- Comprehensive test coverage
- Real card validation passes

**Files Created:**
- `v2/effects/atomic/play-effect.ts`
- `v2/effects/atomic/reveal-effect.ts`
- `v2/effects/atomic/search-effect.ts`
- `v2/effects/atomic/inkwell-effect.ts`
- `v2/effects/atomic/location-effect.ts`
- `v2/effects/atomic/return-effect.ts`
- Updated `v2/effects/atomic/index.ts`

### Phase 6: Integration & Migration

**Duration:** 2-3 days

**Goal:** Wire v2 parser and migrate from v1

**Tasks:**
1. Update `src/parser/index.ts` to export v2 parser
2. Update card generation script to use v2
3. Migrate manual overrides to v2 format (if needed)
4. Run card generation for all sets
5. Fix any parsing errors discovered
6. Validate output matches expected structures
7. Update downstream code if needed
8. Update documentation

**Acceptance Criteria:**
- v2 parser fully integrated
- Card generation produces valid output
- Manual overrides working
- All existing tests pass
- Documentation updated

**Files Modified:**
- `src/parser/index.ts`
- `scripts/generate-cards.ts`
- `src/parser/manual-overrides.ts` (potentially)
- `README.md`

### Phase 7: Cleanup

**Duration:** 1-2 days

**Goal:** Remove v1 parser and finalize

**Tasks:**
1. **Delete v1 parser files entirely:**
   - `src/parser/parsers/effect-parser.ts`
   - `src/parser/parsers/triggered-parser.ts`
   - `src/parser/parsers/activated-parser.ts`
   - `src/parser/parsers/static-parser.ts`
   - `src/parser/parsers/keyword-parser.ts`
   - `src/parser/parsers/condition-parser.ts`
   - `src/parser/parsers/target-parser.ts`
   - `src/parser/parsers/action-parser.ts`
   - `src/parser/parsers/replacement-parser.ts`
   - `src/parser/patterns/effects.ts`
   - `src/parser/patterns/conditions.ts`
   - `src/parser/patterns/triggers.ts`
   - `src/parser/patterns/targets.ts`
   - `src/parser/patterns/keywords.ts`
   - `src/parser/patterns/costs.ts`
   - All v1 test files
2. Remove v1-specific imports and references
3. Optimize effect parser registration order
4. Write grammar documentation
5. Create developer guide for adding new effects
6. Final test suite run
7. Code review and polish

**Acceptance Criteria:**
- No v1 parser code remains
- All imports/references updated
- Grammar documented
- Developer guide complete
- Final coverage report shows 95%+
- Codebase clean and ready for merge

**Files Deleted:**
- `src/parser/parsers/` (entire directory)
- `src/parser/patterns/` (entire directory)
- All v1 test files

**Documentation Created:**
- `v2/GRAMMAR.md` - Grammar specification
- `v2/DEVELOPER_GUIDE.md` - Adding new effects guide

## Success Criteria

### Quantitative Metrics

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| Automated parsing rate | 80%+ | Count cards parsed vs manual overrides |
| Test coverage (v2 code) | 95%+ | Bun coverage report |
| Effect parser file size | 50-100 lines | Check file line counts |
| Parsing accuracy | 100% | Compare output to expected abilities |
| Performance | Equal or better than v1 | Parse 1000 cards, compare times |

### Qualitative Goals

**Readability:**
- New developer can understand effect parser in <5 minutes
- Code review feedback is positive
- No nested if/else branches beyond 2 levels

**Extensibility:**
- Adding new effect requires only 1 file + 1 line in index
- No modification to core grammar for atomic effects
- Clear plugin architecture

**Maintainability:**
- Each effect isolated in own file
- Clear separation of concerns
- Minimal coupling between parsers

**Developer Experience:**
- Logging provides actionable debugging information
- Error messages are clear and context-rich
- Adding new effect takes <1 hour

### Validation Checklist

- [ ] 95%+ test coverage on v2 parser code
- [ ] 80%+ of cards parsed automatically (max 20% manual overrides)
- [ ] All effect parsers 50-100 lines each
- [ ] Card generation produces valid output for all sets
- [ ] No regression in parsing accuracy
- [ ] Performance equal or better than v1
- [ ] Grammar documentation complete
- [ ] Developer guide published
- [ ] All v1 parser code deleted
- [ ] Code review approved
- [ ] CI pipeline passes

## Risks and Mitigations

### Risk 1: Chevrotain Learning Curve

**Likelihood:** Medium
**Impact:** Medium (delays implementation)

**Mitigation:**
- Follow official Chevrotain tutorials closely
- Start with simple grammar and iterate
- Allocate extra time in Phase 1 for learning
- Consult Chevrotain documentation and examples
- Consider pair programming for initial setup

### Risk 2: Incomplete Grammar Coverage

**Likelihood:** High
**Impact:** Low (acceptable due to 80/20 rule)

**Mitigation:**
- Accept 80/20 rule: 80% automated, 20% manual acceptable
- Maintain robust manual override system
- Prioritize common card patterns over rare edge cases
- Document which patterns are not covered
- Revisit grammar in future iterations

### Risk 3: Breaking Changes to Downstream Code

**Likelihood:** Low
**Impact:** High (blocks deployment)

**Mitigation:**
- Ensure v2 outputs same Effect types as v1
- Comprehensive integration testing
- Validate against all card sets before merging
- Test card generation pipeline thoroughly
- Manual review of generated card files

### Risk 4: Test Coverage Gaps

**Likelihood:** Medium
**Impact:** Medium (hidden bugs)

**Mitigation:**
- Follow TDD approach: write tests first
- Track coverage continuously during development
- Automated coverage reporting in CI
- Code review focuses on test quality
- Integration tests for real card patterns

### Risk 5: Performance Regression

**Likelihood:** Low
**Impact:** Low (Chevrotain is performant)

**Mitigation:**
- Chevrotain designed for performance
- Profile if issues arise (not in initial scope)
- Cache lexer/parser instances
- Optimize effect parser registration order
- Benchmark against v1 if concerns arise

### Risk 6: Logging Overhead

**Likelihood:** Low
**Impact:** Low (controllable)

**Mitigation:**
- Logging disabled by default in production
- Use structured logging (JSON) for efficiency
- Log level configurable via environment variable
- No synchronous I/O in hot paths
- Profile logging impact if needed

### Risk 7: Scope Creep

**Likelihood:** Medium
**Impact:** Medium (delays delivery)

**Mitigation:**
- Stick to defined phases
- Accept 80/20 rule - don't perfect every edge case
- Defer non-critical features to future iterations
- Regular check-ins against success criteria
- Clear definition of "done" for each phase

### Risk 8: Manual Override Migration Issues

**Likelihood:** Low
**Impact:** Medium (data loss risk)

**Mitigation:**
- Preserve manual override file structure if possible
- Test override system thoroughly
- Validate all overridden cards still work
- Document any format changes required
- Backup current overrides before migration

## Dependencies and Timeline

### External Dependencies

| Dependency | Version | Purpose | Risk |
|------------|---------|---------|------|
| chevrotain | 11.0.3+ | Lexer and parser framework | Low - stable library |
| @tcg/lorcana | workspace | Effect type definitions | None - internal |
| Bun | 1.3.3+ | Test runner | None - already in use |

### Internal Dependencies

**Blockers:**
- None identified

**Concurrent Work:**
- Parser development can proceed independently
- No blocking dependencies on other features

**Downstream Impacts:**
- Card generation pipeline will use v2 parser
- Any code depending on parser output must be validated
- Documentation must be updated

### Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Foundation & Core Grammar | 2-3 days | None |
| Phase 2: Effect Registry | 2-3 days | Phase 1 |
| Phase 3: Composite Effects | 2-3 days | Phase 2 |
| Phase 4: Targets & Conditions | 2-3 days | Phase 3 |
| Phase 5: Remaining Effects | 3-4 days | Phase 4 |
| Phase 6: Integration & Migration | 2-3 days | Phase 5 |
| Phase 7: Cleanup | 1-2 days | Phase 6 |
| **Total** | **15-21 days** | Sequential |

**Note:** All phases delivered in single PR.

### Delivery Milestones

**Milestone 1:** Foundation Complete (Day 3)
- Lexer and basic grammar working
- Logging infrastructure operational
- Tests passing

**Milestone 2:** Core Parsers Complete (Day 9)
- Atomic and composite effect parsers implemented
- Effect registry functional
- 50%+ of effect types covered

**Milestone 3:** Full Coverage (Day 15)
- All effect types implemented
- Targets and conditions working
- 95%+ test coverage achieved

**Milestone 4:** Production Ready (Day 21)
- v1 parser removed
- Documentation complete
- Ready for merge

## Appendix

### Glossary

| Term | Definition |
|------|------------|
| **CST** | Concrete Syntax Tree - parse tree from Chevrotain |
| **AST** | Abstract Syntax Tree - simplified typed representation |
| **Effect Parser** | Modular parser handling one effect type |
| **Atomic Effect** | Single indivisible effect (draw, damage, etc.) |
| **Composite Effect** | Effect containing other effects (sequence, choice, etc.) |
| **Chevrotain** | TypeScript parser toolkit using embedded DSL |
| **Visitor Pattern** | Design pattern for traversing tree structures |
| **Manual Override** | Hard-coded ability definition for edge cases |

### References

**Chevrotain Documentation:**
- Tutorial: https://chevrotain.io/docs/tutorial/step0_introduction.html
- API Docs: https://chevrotain.io/documentation/
- Examples: https://github.com/Chevrotain/chevrotain/tree/master/examples

**Project Documentation:**
- CLAUDE.md: `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/CLAUDE.md`
- Coding Standards: `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/agent-os/standards/`
- Lorcana Rules: `/Users/eduardo.moroni/projects/the-card-goat/tcg-engines/.claude/rules/packages/lorcana-cards.md`

### Example Cards for Testing

**Simple Keyword:**
- Mickey Mouse - Brave Little Tailor: "Evasive"

**Simple Triggered:**
- Elsa - Snow Queen: "When you play this character, deal 2 damage to chosen character."

**Complex Sequence:**
- Aladdin - Prince Ali: "When you play this character, draw 2 cards, then discard 1 card."

**Choice Effect:**
- Maleficent - Monstrous Dragon: "Choose one: Deal 3 damage to chosen character; or deal 1 damage to each opposing character."

**Conditional Effect:**
- Gaston - Arrogant Hunter: "When you play this character, if you have another character in play, gain 2 lore."

**For-Each Effect:**
- Merlin - Crab: "When you play this character, gain 1 lore for each character you have in play."

### Related Specifications

- None (greenfield refactoring)

### Future Enhancements (Out of Scope)

1. **Auto-discovery of effect parsers** via directory scanning
2. **Performance profiling tools** for parser optimization
3. **Visual grammar debugging tools** (parse tree visualizer)
4. **Parser configuration UI** for non-developers
5. **Multi-TCG support** (extend to other games)
6. **AI-assisted parser generation** for new card types
7. **Parser analytics** (track most common failures)

---

**Document Version:** 1.0
**Date:** 2025-12-29
**Author:** Claude (Spec Writer Agent)
**Status:** Ready for Implementation
