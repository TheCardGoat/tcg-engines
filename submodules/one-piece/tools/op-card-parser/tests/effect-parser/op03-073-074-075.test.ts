import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP03-073/074/075 parser regressions", () => {
  test("keeps Hull Dismantler Slash's Leader gate after its direct Main DON!! cost", () => {
    const result = buildCardEffects(
      "[Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [Water Seven] type, K.O. up to 1 of your opponent's Characters with a cost of 2 or less. [Trigger] Activate this card's [Main] effect.",
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "main",
      costs: [{ cost: "returnDon", amount: 1 }],
      actions: [
        {
          action: "ko",
          condition: {
            condition: "leaderTrait",
            trait: "Water Seven",
            match: "includes",
          },
        },
      ],
    });
    expect(result?.effects?.[1]).toMatchObject({
      trigger: "trigger",
      actions: [{ action: "activateEffect", effectTrigger: "main" }],
    });
  });

  test("preserves Top Knot's direct DON!! cost on its Main block", () => {
    const result = buildCardEffects(
      "[Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Place up to 1 of your opponent's Characters with a cost of 4 or less at the bottom of the owner's deck. [Trigger] Activate this card's [Main] effect.",
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "main",
      costs: [{ cost: "returnDon", amount: 1 }],
      actions: [{ action: "returnToDeck", position: "bottom" }],
    });
    expect(result?.effects?.[1]).toMatchObject({
      trigger: "trigger",
      actions: [{ action: "activateEffect", effectTrigger: "main" }],
    });
  });

  test("scopes Galley-La Company's Iceburg condition to its post-cost DON!! action", () => {
    const result = buildCardEffects(
      "[Activate:Main] You may rest this Stage: If your Leader is [Iceburg], add up to 1 DON!! card from your DON!! deck and rest it.",
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "activateMain",
      costs: [{ cost: "restThisCard" }],
      actions: [
        {
          action: "addDon",
          state: "rested",
          condition: { condition: "leaderName", name: "Iceburg" },
        },
      ],
      optional: true,
    });
    expect(result?.effects?.[0]?.conditions).toBeUndefined();
  });
});
