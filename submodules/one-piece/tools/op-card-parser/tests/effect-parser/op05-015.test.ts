import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP05-015 Belo Betty parser regression", () => {
  test("searches top five with inclusive Revolutionary Army matching and same-name exclusion", () => {
    expect(
      buildCardEffects(
        "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Revolutionary Army] type card other than [Belo Betty] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "search",
              lookCount: 5,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [
                { filter: "excludeName", value: "Belo Betty" },
                { filter: "trait", value: "Revolutionary Army", match: "includes" },
              ],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
      ],
    });
  });
});
