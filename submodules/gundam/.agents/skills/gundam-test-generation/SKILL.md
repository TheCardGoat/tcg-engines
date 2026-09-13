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
2. Turn each test into a behavioral sensor:
   - reach the printed timing and prerequisites through legal public moves;
   - answer every visible optional, modal, target, or deck-look prompt;
   - assert the exact public result, filter boundary, value, and destination;
   - include a negative that would pass if the ability never activated.
     Merely deploying, pairing, or playing a card is not ability coverage unless
     that move itself resolves the printed Deploy, Pair, Burst, or setup ability.
3. Use `GundamTestEngine` and helpers exported by `@tcg/gundam-engine`; do not
   deep-import test internals or recreate an existing helper.
4. Cover every applicable branch: happy path, source-card destination, timing,
   cost, target filters, ownership, and no-legal-target behavior.
5. Identify who makes every decision. Resolve opponent-controlled choices with
   the opponent's player facade and prove the source controller cannot answer
   for them when that boundary matters.
6. Stage effects when an earlier choice changes later legal candidates. Use the
   queue/prompt protocol rather than precommitting a card that is not legal
   until a draw, recovery, discard, rest, deploy, or controller handoff finishes.
7. Use exact runtime error codes with `expectFailure`.
8. Drive gameplay through public player actions. Prefer named queries and
   expect helpers over `engine.getG()` or raw state.
9. Treat hidden information as hidden. Assert Shield/Deck counts, revealed
   destinations, and visible prompts; never capture face-down Shield identities
   or ordered Deck identities. "First Shield" effects must resolve
   automatically rather than publish a hidden target selection.
10. If the engine cannot execute the printed behavior, add or fix the engine
    primitive first. Do not substitute a structural `card.effects` assertion.
11. Run the targeted test before package or workspace checks. For generated or
    bulk-edited fixtures, deliberately mutate a representative printed value or
    gate, prove the test fails for the intended reason, then restore it.

## Generated Fixture Audit

Treat a generator as scaffolding, never as proof. Before accepting each
generated sibling test:

- map the test to a specific `effects[]` or `keywordEffects[]` behavior;
- replace generic deploy/play/pair smoke assertions with a real move sequence;
- verify exact target eligibility and at least one exclusion;
- throw when an expected prompt is absent; never conditionally return;
- keep behavior-bearing cards visible to the fixture gate instead of
  allowlisting them as "manual later" work.

If a generator cannot infer the semantic fixture, it must leave the test
missing and report that manual behavior coverage is required. It must not emit
a passing setup-only test.

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

- Build 1v1 fixtures with `PLAYER_ONE` and `PLAYER_TWO`. Do not add
  battle-royale or team requirements from comprehensive-rules section 12
  unless the user explicitly requests multiplayer support.
- Treat "each enemy player" as the single opponent in this runtime, while
  still asserting that the printed player owns every choice they must make.
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
vp test packages/cards/src/cards/<set>/<type>/<file>.test.ts
```

Then run the PR-added fixture list or `vp test packages/cards`. If engine
behavior changed, run `vp test`, `vp check`, and `pnpm check:harness`. Report
focused proof separately from full-suite and harness results.
