import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("Stage conditional costs", () => {
  test("keeps Fish-Man Island's Shirahoshi activation gate before its Life cost", () => {
    expect(
      buildCardEffects(
        '[Activate: Main] [Once Per Turn] If your Leader is [Shirahoshi], you may turn 1 card from the top of your Life cards face-up: Up to 1 of your "Neptunian", "Fish-Man", or "Merfolk" type Characters gains +1000 power during this turn.',
      )?.effects?.[0],
    ).toMatchObject({
      trigger: "activateMain",
      conditions: [{ condition: "leaderName", name: "Shirahoshi" }],
      costs: [{ cost: "turnLifeFaceUp", count: 1, faceUp: true }],
      optional: true,
      oncePerTurn: true,
    });
  });

  test("keeps Baratie's Stage-to-deck cost before its action-scoped Sanji gate", () => {
    expect(
      buildCardEffects(
        "[Activate: Main] You may place this Stage at the bottom of the owner's deck: If your Leader is [Sanji], look at 3 cards from the top of your deck; reveal up to 1 Event and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Play this card.",
      )?.effects?.[0],
    ).toMatchObject({
      trigger: "activateMain",
      costs: [{ cost: "returnThisToDeck", position: "bottom" }],
      actions: [
        {
          action: "search",
          condition: { condition: "leaderName", name: "Sanji" },
        },
      ],
      optional: true,
    });
  });
});
