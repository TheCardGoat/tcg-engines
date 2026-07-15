---
name: gundam-test-generation
description: Author and review Gundam TCG card-behavior tests with the canonical GundamTestEngine pattern. Use whenever creating or modifying a card test under packages/cards/src/cards, including tests scaffolded during card implementation.
---

# Gundam Test Generation

This skill owns Gundam card-test syntax and behavior coverage. Card
implementation orchestration remains with the local `implement-card` workflow.

## Required Context

1. Read the Gundam rules glossary and
   [`gundam-tcg-rules`](../gundam-tcg-rules/SKILL.md).
2. Read the card definition, printed text, and active sibling test.
3. Inspect the closest current behavior test for the same card type.
4. Load only the needed sections of
   [`references/house-style.md`](references/house-style.md):
   - File layout and imports
   - Mandatory coverage
   - Engine helpers and error codes
   - A matching current syntax example

## Workflow

1. Create one outer `describe` for the card and one inner `describe` for each
   printed ability.
2. Write present-tense tests for observable behavior, not card-data shape.
3. Use `GundamTestEngine` and helpers exported by `@tcg/gundam-engine`; do not
   deep-import test internals or recreate an existing helper.
4. Cover every applicable branch: happy path, source-card destination, timing,
   cost, target filters, ownership, and no-legal-target behavior.
5. Use exact runtime error codes with `expectFailure`.
6. Drive gameplay through public player actions. Prefer named queries and
   expect helpers over `engine.getG()` or raw state.
7. If the engine cannot execute the printed behavior, add or fix the engine
   primitive first. Do not substitute a structural `card.effects` assertion.
8. Run the targeted test before package or workspace checks.

## Minimal Shape

```ts
import { describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { cardUnderTest } from "./card-under-test.ts";

describe("Card Name (CARD-NUMBER)", () => {
  describe("Printed ability text", () => {
    it("resolves the observable behavior", () => {
      const engine = GundamTestEngine.create({
        hand: [cardUnderTest],
        resourceArea: activeResources(cardUnderTest.cost),
      });

      expectSuccess(engine.asPlayer(PLAYER_ONE).playCommand(cardUnderTest));
      expect(engine.asPlayer(PLAYER_ONE).getHand()).toHaveLength(0);
    });
  });
});
```

Adapt the player action to the card type. Keep fixtures deterministic and use
mock cards only when printed identity is irrelevant.

## Boundaries

- Import test APIs from `vite-plus/test` and engine helpers from
  `@tcg/gundam-engine`.
- Import the card under test from its sibling definition.
- Test each printed timing separately.
- Do not pad coverage to a numeric target or add metadata snapshots.
- Add a one-line explanation only when a coverage branch is genuinely not
  applicable.

## Verification

From `submodules/gundam`:

```bash
vp test packages/cards/src/cards/<set>/<type>/<file>.test.ts --run
```

Then run `vp test packages/cards --run`. If engine behavior changed, also run
`vp test packages/engine --run` and `vp check`.
