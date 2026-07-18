import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP05-112 fast-lane parser regression", () => {
  test("keeps Blocker and an included Sky Island cost-1 Character play", () => {
    expect(
      buildCardEffects(
        "[Blocker] [On K.O.] Play up to 1 [Sky Island] type Character card with a cost of 1 from your hand.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onKo",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "eq", value: 1 },
                { filter: "trait", value: "Sky Island", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
        },
      ],
    });
  });
});
