# Lorcana Engine – Agent Guide

## How to add a condition

1. Add the interface to the `Condition` union in
   [`condition-types.ts`](../lorcana-types/src/abilities/condition-types.ts).
2. Add a `case "<type>":` branch to the switch in
   [`evaluateCondition`](src/rules/condition-evaluator.ts).
3. Add `"<type>"` to `CONDITION_VARIANT_TYPES` at the top of that same file.
4. Create `src/rules/conditions/__tests__/<type>.test.ts` using the template
   below (or start from one of the `.todo`-stubbed files that already exist).

## How to add a target

1. Add the selector or reference to the Lorcana DSL in
   [`lorcana-target-dsl.ts`](../lorcana-types/src/targeting/lorcana-target-dsl.ts)
   (selectors extend `TargetDSL`, references extend `LorcanaTargetReference`).
2. Teach the resolver in
   [`src/targeting/runtime/`](src/targeting/runtime) — most new variants plug
   into the selector dispatcher and the normalization layer in
   [`targeting/shared.ts`](../lorcana-types/src/targeting/shared.ts).
3. Add `"<type>"` to `TARGET_VARIANT_TYPES` in
   [`src/targeting/variants/index.ts`](src/targeting/variants/index.ts).
4. Create `src/targeting/variants/__tests__/<type>.test.ts`.

## How to add an effect

1. Define the effect's interface under
   [`effect-types/`](../lorcana-types/src/abilities/effect-types) and re-export it from
   the barrel.
2. Create `src/runtime-moves/resolution/action-effects/<type>-effect.ts`
   exporting `is<Type>Effect` and `resolve<Type>Effect`.
3. Register both the discriminator (in
   `ACTION_EFFECT_RESOLVER_TYPES`) **and** the resolver (in the
   `actionEffectResolvers` map) inside
   [`composed-effect-resolver.ts`](src/runtime-moves/resolution/action-effects/composed-effect-resolver.ts).
4. Create `src/runtime-moves/resolution/action-effects/__tests__/<type>.test.ts`.

## Canonical per-variant test template

```ts
import { describe, expect, it } from "bun:test";
import { createCardPlayed, createTestContext, PLAYER_ONE } from "../../../testing/unit-harness";
import { resolveMyEffect } from "../my-effect";
import type { MyEffect } from "@tcg/lorcana-types";

describe("my-effect", () => {
  it("applies the primary happy-path mutation", () => {
    const ctx = createTestContext({ lore: { [PLAYER_ONE]: 0 } });
    const effect: MyEffect = { type: "my-effect" /* ... */ };

    resolveMyEffect(ctx, createCardPlayed({ cardId: "src", playerId: PLAYER_ONE }), effect, {
      /* resolved inputs */
    });

    expect(ctx.G.lore[PLAYER_ONE]).toBe(/* expected */);
  });

  it.todo("edge case: describe what you still need to cover");
});
```
