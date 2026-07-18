import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP03-036/037 East Blue Event parser regressions", () => {
  test("limits Out-of-the-Bag's named-card target to Kuro Leaders and Characters", () => {
    const result = buildCardEffects(
      "[Main] You may rest 1 of your [East Blue] type Characters: Set up to 1 of your [Kuro] cards as active. [Trigger] K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less.",
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "main",
      costs: [
        {
          cost: "restCards",
          amount: 1,
          filters: [
            { filter: "trait", value: "East Blue", match: "includes" },
            { filter: "cardCategory", value: "character" },
          ],
        },
      ],
      actions: [
        {
          action: "setActive",
          target: {
            player: "self",
            zones: ["leader", "character"],
            count: { amount: 1, upTo: true },
            filters: [{ filter: "name", value: "Kuro" }],
          },
        },
      ],
      optional: true,
    });
    expect(result?.effects?.[1]).toMatchObject({ trigger: "trigger", actions: [{ action: "ko" }] });
  });

  test("preserves Tooth Attack's inclusive East Blue Character rest cost", () => {
    const result = buildCardEffects(
      "[Main] You may rest 1 of your [East Blue] type Characters: K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less. [Trigger] Play up to 1 Character card with a cost of 4 or less and a [Trigger] from your hand.",
    );

    expect(result?.effects?.[0]).toMatchObject({
      trigger: "main",
      costs: [
        {
          cost: "restCards",
          amount: 1,
          filters: [
            { filter: "trait", value: "East Blue", match: "includes" },
            { filter: "cardCategory", value: "character" },
          ],
        },
      ],
      actions: [{ action: "ko" }],
      optional: true,
    });
    expect(result?.effects?.[1]).toMatchObject({
      trigger: "trigger",
      actions: [
        {
          action: "play",
          filters: [
            { filter: "hasTrigger", value: true },
            { filter: "cost", comparison: "lte", value: 4 },
            { filter: "cardCategory", value: "character" },
          ],
        },
      ],
    });
  });
});
