import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP03-094/098 parser regressions", () => {
  test("preserves Air Door's CP, cost, and Character filters before trashing the remainder", () => {
    const result = buildCardEffects(
      '[Main] If your Leader\'s type includes "CP", look at 5 cards from the top of your deck; play up to 1 Character card with a type including "CP" and a cost of 5 or less. Then, trash the rest. [Trigger] Play up to 1 black Character card with a cost of 3 or less from your trash.',
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "main",
      conditions: [{ condition: "leaderTrait", trait: "CP", match: "includes" }],
      actions: [
        {
          action: "search",
          lookCount: 5,
          revealFilters: [
            { filter: "trait", value: "CP", match: "includes" },
            { filter: "cost", comparison: "lte", value: 5 },
            { filter: "cardCategory", value: "character" },
          ],
          revealDestination: "character",
          remainderPosition: "trash",
        },
      ],
    });
    expect(result?.effects?.[1]).toMatchObject({
      trigger: "trigger",
      actions: [{ action: "play", source: { player: "self", zone: "trash" } }],
    });
  });

  test("scopes Enies Lobby's CP condition to its post-cost modifier", () => {
    const result = buildCardEffects(
      "[Activate:Main] You may rest this Stage: If your Leader's type includes \"CP\", give up to 1 of your opponent's Characters -2 cost during this turn. [Trigger] Play this card.",
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "activateMain",
      costs: [{ cost: "restThisCard" }],
      actions: [
        {
          action: "modifyCost",
          value: -2,
          duration: "thisTurn",
          condition: {
            condition: "leaderTrait",
            trait: "CP",
            match: "includes",
          },
        },
      ],
      optional: true,
    });
    expect(result?.effects?.[0]?.conditions).toBeUndefined();
    expect(result?.effects?.[1]).toMatchObject({
      trigger: "trigger",
      actions: [{ action: "playThisCard" }],
    });
  });
});
