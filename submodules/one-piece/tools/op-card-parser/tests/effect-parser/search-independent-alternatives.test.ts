import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

test("OP12-017 requires red for either Event or cost-3-or-more Character per its FAQ", () => {
  const result = buildCardEffects(
    "[Main] You may give 1 active DON!! card to 1 of your [Silvers Rayleigh]: Look at 4 cards from the top of your deck; reveal up to 1 red Event or up to 1 Character card with a cost of 3 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  );
  expect(result?.effects?.[0]?.actions).toEqual([
    {
      action: "search",
      lookCount: 4,
      source: { player: "self", zone: "deck" },
      revealCount: { amount: 1, upTo: true },
      revealDestination: "hand",
      remainderPosition: "bottom",
      revealFilters: [
        { filter: "color", value: "red" },
        {
          filter: "anyOf",
          filters: [
            { filter: "cardCategory", value: "event" },
            {
              filter: "allOf",
              filters: [
                { filter: "cardCategory", value: "character" },
                { filter: "cost", comparison: "gte", value: 3 },
              ],
            },
          ],
        },
      ],
    },
  ]);
});
