---
name: lorcana-test-generation
description: Generate basic happy-path tests for Lorcana card abilities. Tests verify ability structure only - NO property validation tests. Use when implementing or updating card tests. Effects are tested separately in the engine.
---

# Lorcana Test Generation

Generate test files for Lorcana card definitions.

## When to Use

- User requests to generate tests for a card
- After card migration is complete
- User wants to update existing tests
- User asks to test a specific ability

## Process

### Input

**Card File**: Path to card definition (e.g., `src/cards/001/characters/007-heihei-boat-snack.ts`)

### Workflow

1. **Read Card Definition**
   - Load card file from `src/cards/001/`
   - Extract abilities array
   - Identify ability types

2. **Generate Tests**
   - For each ability: generate appropriate test based on type
   - Use direct card import (not LorcanaTestEngine wrapper)
   - Test ability structure, not behavior

3. **Write Test File**
   - Create at same location as card: `{file}.test.ts`
   - Use `describe`/`it` from `bun:test`

## ⚠️ IMPORTANT: Test Ability Structure, Not Behavior

**DO NOT use LorcanaTestEngine.getCardModel()** - it doesn't expose the abilities array.

**DO import the card directly**:
```typescript
import { cardName } from "./xxx-card-name";
```

**DO test ability structure directly**:
```typescript
expect(cardName.abilities).toHaveLength(1);
expect(ability.type).toBe("triggered");
```

## Test Templates by Ability Type

### 1. Vanilla Card (No Abilities)
```typescript
import { describe, expect, it } from "bun:test";
import { cardName } from "./xxx-card-name";

describe("Card - Version", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(cardName.vanilla).toBe(true);
    expect(cardName.abilities).toBeUndefined();
  });
});
```

### 2. Keyword Ability
```typescript
import { describe, expect, it } from "bun:test";
import { cardName } from "./xxx-card-name";

describe("Card - Version", () => {
  it("has [Keyword] keyword", () => {
    expect(cardName.abilities).toHaveLength(1);
    const ability = cardName.abilities[0];

    expect(ability.type).toBe("keyword");
    expect(ability.keyword).toBe("[Keyword]");
  });
});
```

### 3. Triggered Ability (When You Play)
```typescript
import { describe, expect, it } from "bun:test";
import { cardName } from "./xxx-card-name";

describe("Card - Version", () => {
  it("has triggered ability when played", () => {
    expect(cardName.abilities).toHaveLength(1);
    const ability = cardName.abilities[0];

    expect(ability.type).toBe("triggered");
    expect(ability.name).toBe("[ABILITY NAME]");

    // Verify trigger
    expect(ability.trigger).toMatchObject({
      event: "play",
      timing: "when",
      on: "SELF",
    });

    // Verify effect
    expect(ability.effect?.type).toBe("[effect-type]");
  });
});
```

### 4. Triggered + Conditional
```typescript
import { describe, expect, it } from "bun:test";
import { cardName } from "./xxx-card-name";

describe("Card - Version", () => {
  it("has conditional triggered ability when played", () => {
    expect(cardName.abilities).toHaveLength(1);
    const ability = cardName.abilities[0];

    expect(ability.type).toBe("triggered");
    expect(ability.trigger).toMatchObject({
      event: "play",
      timing: "when",
      on: "SELF",
    });

    // Verify condition
    expect(ability.condition).toMatchObject({
      type: "zone-count",
      zone: "play",
      comparison: {
        operator: ">=",
        value: 3,
        excludeSelf: true,
      },
    });

    // Verify effect is optional
    expect(ability.effect?.type).toBe("optional");
  });
});
```

### 5. Triggered + Named Character Condition
```typescript
import { describe, expect, it } from "bun:test";
import { cardName } from "./xxx-card-name";

describe("Card - Version", () => {
  it("has triggered ability with named character condition", () => {
    expect(cardName.abilities).toHaveLength(1);
    const ability = cardName.abilities[0];

    expect(ability.type).toBe("triggered");

    // Verify condition checks for specific character
    expect(ability.condition).toMatchObject({
      type: "has-named-character",
      name: "[CharacterName]",
      controller: "you",
    });

    // Verify effect
    expect(ability.effect?.type).toBe("restriction");
    expect(ability.effect?.restriction).toBe("[restriction-type]");
    expect(ability.effect?.duration).toBe("[duration]");
  });
});
```

### 6. Static Ability with Condition
```typescript
import { describe, expect, it } from "bun:test";
import { cardName } from "./xxx-card-name";

describe("Card - Version", () => {
  it("has static cost reduction ability with condition", () => {
    expect(cardName.abilities).toHaveLength(1);
    const ability = cardName.abilities[0];

    expect(ability.type).toBe("static");
    expect(ability.name).toBe("[ABILITY NAME]");

    // Verify effect
    expect(ability.effect?.type).toBe("cost-reduction");
    expect(ability.effect?.amount).toBe(1);
    expect(ability.effect?.cardType).toBe("character");

    // Verify condition
    expect(ability.condition?.type).toBe("has-named-character");
    expect(ability.condition?.name).toBe("[CharacterName]");
  });
});
```

### 7. Static Restriction Ability
```typescript
import { describe, expect, it } from "bun:test";
import { cardName } from "./xxx-card-name";

describe("Card - Version", () => {
  it("has VOICELESS restriction ability", () => {
    expect(cardName.abilities).toHaveLength(1);
    const ability = cardName.abilities[0];

    expect(ability.type).toBe("static");
    expect(ability.name).toBe("VOICELESS");

    // Verify effect is a restriction
    expect(ability.effect?.type).toBe("restriction");
    expect(ability.effect?.restriction).toBe("cant-sing");
    expect(ability.effect?.target).toBe("SELF");
  });
});
```

### 8. Action Card (One-time Effect)
```typescript
import { describe, expect, it } from "bun:test";
import { cardName } from "./xxx-card-name";

describe("Action Name!", () => {
  it("has stat debuff action ability", () => {
    expect(cardName.abilities).toHaveLength(1);
    const ability = cardName.abilities[0];

    expect(ability.type).toBe("action");

    // Verify effect
    expect(ability.effect?.type).toBe("modify-stat");
    expect(ability.effect?.stat).toBe("strength");
    expect(ability.effect?.modifier).toBe(-2);
    expect(ability.effect?.duration).toBe("this-turn");

    // Verify target
    expect(ability.effect?.target).toMatchObject({
      selector: "chosen",
      count: 1,
      cardTypes: ["character"],
    });
  });
});
```

### 9. Multiple Abilities (Keyword + Triggered)
```typescript
import { describe, expect, it } from "bun:test";
import { cardName } from "./xxx-card-name";

describe("Card - Version", () => {
  it("has Rush keyword and triggered ability", () => {
    expect(cardName.abilities).toHaveLength(2);

    // Verify Rush keyword
    const rushAbility = cardName.abilities[0];
    expect(rushAbility.type).toBe("keyword");
    expect(rushAbility.keyword).toBe("Rush");

    // Verify triggered ability
    const triggeredAbility = cardName.abilities[1];
    expect(triggeredAbility.type).toBe("triggered");
    expect(triggeredAbility.name).toBe("[ABILITY NAME]");
    expect(triggeredAbility.trigger).toMatchObject({
      event: "play",
      timing: "when",
      on: "SELF",
    });
  });
});
```

## What NOT to Test

**Do NOT test property values** (cost, strength, willpower, lore, cardNumber, etc.) - these are data, not behavior.

**Do NOT test gameplay behavior** (questing, challenging, drawing, etc.) - these are tested in the engine.

**DO test ability structure** - type, name, trigger, condition, effect structure.

## Test File Structure

```typescript
import { describe, expect, it } from "bun:test";
import { cardName } from "./xxx-card-name";

describe("Card Full Name", () => {
  it("has [ability description]", () => {
    // Import card directly
    // Test ability structure
  });
});
```

## Output Format

```
Test Generation Complete
========================
Card: [Name] - [Version]
File: src/cards/001/characters/xxx-name.test.ts

Tests Generated: X
- Keywords: Y
- Triggered: Z
- Static: W
- Action: V

Run Tests: bun test src/cards/001/characters/xxx-name.test.ts
```

## Example Session

```
> write-card-test 007-heihei-boat-snack

Reading card: src/cards/001/characters/007-heihei-boat-snack.ts
Found 1 ability

[Ability 1/1: Keyword - Support]
Test: hasSupport() verification

Generate test? (yes/no/customize) yes

✓ Test file created
File: src/cards/001/characters/007-heihei-boat-snack.test.ts

Run: bun test src/cards/001/characters/007-heihei-boat-snack.test.ts
```

## Completion Report

```
Test Generation: Complete
========================
File: src/cards/001/characters/xxx-name.test.ts
Tests: X generated

Next Steps:
- Run: bun test src/cards/001/characters/xxx-name.test.ts
- Verify all tests pass
- Commit changes
```
