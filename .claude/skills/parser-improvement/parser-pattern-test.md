---
name: parser-pattern-test
description: Write and run comprehensive tests for parser patterns. Follows TDD methodology - tests first, then implementation verification.
---

# Parser Pattern Test Skill

## Purpose

Write comprehensive tests for parser patterns following TDD methodology. Ensures patterns correctly match text and extract parameters.

## Test File Locations

### V1 Pattern Tests

```
packages/lorcana-cards/src/parser/__tests__/
├── patterns.test.ts           # General pattern tests
├── trigger-patterns.test.ts   # Trigger-specific tests
├── effect-parser.test.ts      # Effect parsing tests
├── target-parser.test.ts      # Target parsing tests
├── conditional-effects.test.ts
├── choice-effects.test.ts
└── ...
```

### V2 Pattern Tests

```
packages/lorcana-cards/src/parser/v2/__tests__/
├── patterns.test.ts
├── trigger-patterns.test.ts
├── action-effects.test.ts
└── ...

packages/lorcana-cards/src/parser/v2/effects/atomic/__tests__/
├── draw-effect.test.ts
├── damage-effect.test.ts
├── banish-effect.test.ts
└── ...
```

## TDD Workflow

### Step 1: Write Failing Test First (RED)

```typescript
// packages/lorcana-cards/src/parser/__tests__/opponent-choice.test.ts

import { describe, it, expect } from "bun:test";
import { parseEffect } from "../parsers/effect-parser";

describe("opponent-choice-discard pattern", () => {
  describe("basic patterns", () => {
    it("should parse 'have each opponent choose and discard a card'", () => {
      const text = "have each opponent choose and discard a card";
      const result = parseEffect(text);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("opponent-choice-discard");
      expect(result?.parameters.target).toBe("each-opponent");
      expect(result?.parameters.amount).toBe(1);
    });

    it("should parse 'opponent chooses and discards a card'", () => {
      const text = "opponent chooses and discards a card";
      const result = parseEffect(text);

      expect(result).not.toBeNull();
      expect(result?.type).toBe("opponent-choice-discard");
      expect(result?.parameters.target).toBe("opponent");
    });
  });
});
```

### Step 2: Run Test (Should Fail)

```bash
cd packages/lorcana-cards && bun test opponent-choice

# Expected output: FAIL - pattern not implemented yet
```

### Step 3: Implement Pattern (GREEN)

Add pattern to make test pass (see `parser-pattern-create` skill).

### Step 4: Verify Tests Pass

```bash
cd packages/lorcana-cards && bun test opponent-choice

# Expected output: PASS
```

### Step 5: Refactor if Needed

Improve pattern without breaking tests.

## Test Structure

### Pattern Matching Tests

```typescript
describe("pattern matching", () => {
  const pattern = EFFECT_PATTERNS.opponentChoiceDiscard.pattern;

  it("should match basic text", () => {
    const match = "have each opponent choose and discard a card".match(pattern);
    expect(match).not.toBeNull();
  });

  it("should capture correctly", () => {
    const match = "opponent chooses and discards 2 cards".match(pattern);
    expect(match?.[1]).toBe("2"); // Capture group
  });

  it("should be case insensitive", () => {
    expect("HAVE EACH OPPONENT CHOOSE AND DISCARD A CARD".match(pattern)).not.toBeNull();
  });
});
```

### Extractor Tests

```typescript
describe("extractor function", () => {
  const { pattern, extractor } = EFFECT_PATTERNS.opponentChoiceDiscard;

  it("should extract correct parameters", () => {
    const match = "have each opponent choose and discard a card".match(pattern)!;
    const result = extractor(match);

    expect(result.type).toBe("opponent-choice-discard");
    expect(result.parameters.target).toBe("each-opponent");
    expect(result.parameters.amount).toBe(1);
  });
});
```

### Integration Tests

```typescript
describe("parser integration", () => {
  it("should parse full card text", () => {
    const fullText = "When you play this character, you may have each opponent choose and discard a card.";

    const abilities = parseCardText(fullText);

    expect(abilities).toHaveLength(1);
    expect(abilities[0].type).toBe("triggered");
    expect(abilities[0].trigger).toBe("play-this-character");
    expect(abilities[0].effects[0].type).toBe("opponent-choice-discard");
  });
});
```

## Test Categories

### Positive Tests (Should Match)

```typescript
describe("positive matches", () => {
  const validTexts = [
    "have each opponent choose and discard a card",
    "opponent chooses and discards a card",
    "each opponent chooses and discards 2 cards",
    "Have opponent choose and discard a card."
  ];

  it.each(validTexts)("should match: %s", (text) => {
    const result = parseEffect(text);
    expect(result).not.toBeNull();
    expect(result?.type).toBe("opponent-choice-discard");
  });
});
```

### Negative Tests (Should NOT Match)

```typescript
describe("negative matches", () => {
  const invalidTexts = [
    "discard a card",              // Not opponent choice
    "opponent draws a card",       // Wrong effect
    "choose a character",          // Not discard
    "you choose and discard"       // Wrong target
  ];

  it.each(invalidTexts)("should NOT match: %s", (text) => {
    const result = parseEffect(text);
    expect(result?.type).not.toBe("opponent-choice-discard");
  });
});
```

### Edge Cases

```typescript
describe("edge cases", () => {
  it("should handle singular 'card'", () => {
    const result = parseEffect("opponent chooses and discards a card");
    expect(result?.parameters.amount).toBe(1);
  });

  it("should handle plural 'cards'", () => {
    const result = parseEffect("opponent chooses and discards 2 cards");
    expect(result?.parameters.amount).toBe(2);
  });

  it("should handle word numbers", () => {
    const result = parseEffect("opponent chooses and discards two cards");
    expect(result?.parameters.amount).toBe(2);
  });

  it("should handle with/without punctuation", () => {
    expect(parseEffect("discard a card.")).not.toBeNull();
    expect(parseEffect("discard a card")).not.toBeNull();
  });
});
```

## Test Commands

### Run Specific Test File

```bash
cd packages/lorcana-cards && bun test opponent-choice
```

### Run All Pattern Tests

```bash
cd packages/lorcana-cards && bun test patterns
cd packages/lorcana-cards && bun test parser
```

### Run with Verbose Output

```bash
cd packages/lorcana-cards && bun test --verbose patterns
```

### Run Single Test

```bash
cd packages/lorcana-cards && bun test -t "should parse opponent choice"
```

### Watch Mode

```bash
cd packages/lorcana-cards && bun test --watch patterns
```

## Test File Template

```typescript
import { describe, it, expect, beforeEach } from "bun:test";
import { EFFECT_PATTERNS } from "../patterns/effects";
import { parseEffect } from "../parsers/effect-parser";

describe("new-pattern-name", () => {
  describe("pattern matching", () => {
    const pattern = EFFECT_PATTERNS.newPattern.pattern;

    it("should match basic text", () => {
      expect("basic text".match(pattern)).not.toBeNull();
    });

    it("should be case insensitive", () => {
      expect("BASIC TEXT".match(pattern)).not.toBeNull();
    });
  });

  describe("extractor", () => {
    it("should extract correct parameters", () => {
      const result = parseEffect("basic text");
      expect(result?.type).toBe("expected-type");
      expect(result?.parameters.key).toBe("expected-value");
    });
  });

  describe("variations", () => {
    const validTexts = [
      "variation 1",
      "variation 2",
      "variation 3"
    ];

    it.each(validTexts)("should match: %s", (text) => {
      expect(parseEffect(text)).not.toBeNull();
    });
  });

  describe("edge cases", () => {
    it("should handle edge case 1", () => {
      // Test implementation
    });
  });

  describe("negative cases", () => {
    it("should NOT match unrelated text", () => {
      const result = parseEffect("unrelated text");
      expect(result?.type).not.toBe("expected-type");
    });
  });
});
```

## Output Protocol

Report test results:

```typescript
{
  success: true,
  testFile: "packages/lorcana-cards/src/parser/__tests__/opponent-choice.test.ts",
  testsWritten: 12,
  testsPass: true,
  coverage: {
    patterns: ["opponent-choice-discard"],
    matchTests: 5,
    extractorTests: 3,
    edgeCaseTests: 4
  }
}
```

## Quick Reference

### Test Assertions

```typescript
// Existence
expect(result).not.toBeNull();
expect(result).toBeDefined();

// Equality
expect(result?.type).toBe("expected");
expect(result?.parameters).toEqual({ key: "value" });

// Array
expect(abilities).toHaveLength(1);
expect(abilities).toContain(item);

// Pattern match
expect(text.match(pattern)).not.toBeNull();
```

### Running Tests

```bash
# Specific pattern
bun test pattern-name

# All parser tests
bun test parser

# With coverage
bun test --coverage parser

# Watch mode
bun test --watch pattern-name
```

## Keywords

testing, tdd, patterns, parser, bun-test, assertions, lorcana
