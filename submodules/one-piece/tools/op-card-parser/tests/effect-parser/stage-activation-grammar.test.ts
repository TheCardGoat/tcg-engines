import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("Stage activation grammar", () => {
  test("makes a permanent self Leader modifier non-selective", () => {
    expect(
      buildCardEffects(
        "[Your Turn] If you have 19 or more cards in your trash, your Leader gains +1000 power.",
      )?.permanentEffects?.[0],
    ).toMatchObject({
      actions: [
        {
          action: "modifyPower",
          target: { player: "self", zones: ["leader"], count: { amount: "all" } },
          value: 1000,
          duration: "permanent",
        },
      ],
    });
  });

  test("keeps a Stage-rest plus DON!!-rest cost and a live DON!! play ceiling", () => {
    expect(
      buildCardEffects(
        '[Activate: Main] You may rest this card and 3 of your DON!! cards: Play up to 1 black "Five Elders" type Character card with a cost equal to or less than the number of DON!! cards on your field from your hand.',
      )?.effects?.[0],
    ).toEqual({
      trigger: "activateMain",
      costs: [{ cost: "restThisCard" }, { cost: "restDon", amount: 3 }],
      actions: [
        {
          action: "play",
          source: { player: "self", zone: "hand" },
          count: { amount: 1, upTo: true },
          filters: [
            { filter: "dynamicCost", comparison: "lte", source: "selfDonCount" },
            { filter: "color", value: "black" },
            { filter: "trait", value: "Five Elders", match: "includes" },
            { filter: "cardCategory", value: "character" },
          ],
        },
      ],
      optional: true,
    });
  });

  test("parses an owned trait Leader-or-Character power target", () => {
    expect(
      buildCardEffects(
        "[Activate: Main] You may rest this Stage: Up to 1 {Straw Hat Crew} type Leader or Character card on your field gains +1000 power during this turn.",
      )?.effects?.[0],
    ).toEqual({
      trigger: "activateMain",
      costs: [{ cost: "restThisCard" }],
      actions: [
        {
          action: "modifyPower",
          target: {
            player: "self",
            zones: ["leader", "character"],
            count: { amount: 1, upTo: true },
            filters: [{ filter: "trait", value: "Straw Hat Crew", match: "includes" }],
          },
          value: 1000,
          duration: "thisTurn",
        },
      ],
      optional: true,
    });
  });
});
