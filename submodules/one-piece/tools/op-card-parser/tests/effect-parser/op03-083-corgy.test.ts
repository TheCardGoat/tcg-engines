import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP03-083 Corgy parser regression", () => {
  test("preserves the looked-card trash bound before remainder ordering", () => {
    expect(
      buildCardEffects(
        "[On Play] Look at 5 cards from the top of your deck and trash up to 2 cards. Then, place the rest at the bottom of your deck in any order.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "rearrangeDeck",
              player: "self",
              count: 5,
              position: "bottom",
              trashUpTo: 2,
            },
          ],
        },
      ],
    });
  });
});
