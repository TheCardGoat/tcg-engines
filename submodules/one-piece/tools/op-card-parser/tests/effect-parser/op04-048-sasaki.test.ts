import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-048 Sasaki", () => {
  test("parses the hand return, shuffle, and equal redraw as one atomic action", () => {
    expect(
      buildCardEffects(
        "[On Play] Return all cards in your hand to your deck and shuffle your deck. Then, draw cards equal to the number you returned to your deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [{ action: "redrawHand", player: "self", drawCount: "returned" }],
        },
      ],
    });
  });
});
