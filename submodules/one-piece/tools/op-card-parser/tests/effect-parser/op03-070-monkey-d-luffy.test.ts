import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP03-070 Monkey.D.Luffy parser regression", () => {
  test("keeps both optional costs and the exact cost-5 Character hand filter", () => {
    expect(
      buildCardEffects(
        "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.) You may trash 1 Character card with a cost of 5 from your hand: This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [
            { cost: "returnDon", amount: 1 },
            {
              cost: "trashFromHand",
              amount: 1,
              filters: [
                { filter: "cardCategory", value: "character" },
                { filter: "cost", comparison: "eq", value: 5 },
              ],
            },
          ],
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "rush",
              duration: "thisTurn",
            },
          ],
          optional: true,
        },
      ],
    });
  });
});
