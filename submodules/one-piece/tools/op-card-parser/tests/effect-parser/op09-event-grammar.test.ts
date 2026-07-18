import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("OP09 Event parser grammar", () => {
  test("trashes the same number from deck as the preceding optional hand trash", () => {
    expect(
      buildCardEffects(
        "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, trash up to 2 cards from your hand. Trash the same number of cards from the top of your deck as you did from your hand. [Trigger] Draw 1 card.",
      )?.effects,
    ).toEqual([
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
            },
            value: 3000,
            duration: "thisBattle",
          },
          { action: "trashFromHand", player: "self", amount: 2, upTo: true },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 0,
            amountFromPreviousActionTargets: true,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ]);
  });
});
