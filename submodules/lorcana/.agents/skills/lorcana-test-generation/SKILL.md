---
name: lorcana-test-generation
description: Generate focused Lorcana card-behavior tests with the current multiplayer harness, or a minimal engine repro when a card exposes a runtime gap. Use when creating, repairing, or reviewing Lorcana card and engine tests.
---

# Lorcana Test Generation

Use this skill for test syntax and coverage. The full card lifecycle remains
owned by [`lorcana-cards`](../lorcana-cards/SKILL.md).

## Required Context

1. Read [`memory/schema.md`](memory/schema.md).
2. Read the Guardrails and Promoted Rules in [`memory/bank.md`](memory/bank.md).
3. Read the current card definition, printed text, and active sibling test.
4. Use [`lorcana-find-card`](../lorcana-find-card/SKILL.md) with
   `requireActiveTest: true` to find a small set of current examples.

Load [`references/harness-reference.md`](references/harness-reference.md) only
for the sections needed by the test:

- Imports, fixture fields, mock cards, and harness choice
- Player actions, pending effects, bag triggers, and queries
- Matcher signatures
- Common patterns, pitfalls, and blocker-test placement

## Workflow

1. Translate each printed behavior clause into an observable test claim.
2. Use `LorcanaMultiplayerTestEngine` for gameplay, choices, triggers, songs,
   locations, durations, and cross-turn behavior.
3. Use `LorcanaTestEngine` only for a narrow model or keyword check that needs
   no gameplay flow.
4. Keep setup minimal and deterministic. Set `deck: []` when hidden draws must
   not occur; set `isDrying: false` when a fixture character must act.
5. Prefer semantic player-handle methods and matchers over raw state access.
6. Cover the positive behavior and every rules-relevant negative, timing,
   target, ownership, optional, or duration branch.
7. If the engine cannot express the printed behavior, add a minimal engine or
   simulator repro and fix the owning primitive. Do not replace behavior
   coverage with metadata or `missingImplementation` assertions.
8. Run the targeted test file before any broader gate.

## Minimal Shape

```ts
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { cardUnderTest } from "./card-under-test";

describe("Card Name - Version", () => {
  it("resolves the printed behavior", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cardUnderTest],
      inkwell: cardUnderTest.cost,
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(cardUnderTest)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });
});
```

Use real cards when identity matters and mock cards for generic targets or
engine primitives. Import test APIs from `bun:test` and helpers from
`@tcg/lorcana-engine/testing`.

## Boundaries

- Keep card tests beside card definitions.
- Engine tests use mock cards; `@tcg/lorcana-engine` must not import
  `@tcg/lorcana-cards`.
- Engine plus real-card interactions belong in the simulator test layer.
- Do not copy skipped, TODO, metadata-only, or legacy-commented tests as current
  syntax.
- Preserve the original behavior claim when migrating a legacy regression.

## Verification

From `submodules/lorcana`:

```bash
bun test <path-to-card.test.ts>
```

Run related package checks only after the targeted test passes. Follow the
canonical memory update protocol after substantive reusable discoveries.
