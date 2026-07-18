import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("colored trait costs", () => {
  test("keeps color and included trait as separate hand-trash filters", () => {
    expect(
      buildCardEffects(
        '[On Play] You may trash 2 black "Navy" type cards from your hand: If your Leader has the "Navy" type, draw 3 cards.',
      )?.effects?.[0]?.costs,
    ).toEqual([
      {
        cost: "trashFromHand",
        amount: 2,
        filters: [
          { filter: "color", value: "black" },
          { filter: "trait", value: "Navy", match: "includes" },
        ],
      },
    ]);
  });
});
