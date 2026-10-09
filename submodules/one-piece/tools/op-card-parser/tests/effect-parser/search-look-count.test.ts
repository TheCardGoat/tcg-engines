import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("search look-count choices", () => {
  test("preserves Curly Dadan's optional inspection count independently of its optional reveal", () => {
    const parsed = buildCardEffects(
      "[On Play] Look at up to 5 cards from the top of your deck; reveal up to 1 red Character with a cost of 1 and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );
    expect(parsed).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "search",
              lookCount: 5,
              lookCountUpTo: true,
              revealCount: { amount: 1, upTo: true },
              revealFilters: expect.arrayContaining([
                { filter: "cost", comparison: "eq", value: 1 },
                { filter: "color", value: "red" },
                { filter: "cardCategory", value: "character" },
              ]),
              remainderPosition: "bottom",
            },
          ],
        },
      ],
    });
  });

  test("an up-to reveal does not make an exact inspection count optional", () => {
    const parsed = buildCardEffects(
      "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 red Character with a cost of 1 and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    );
    const action = parsed?.effects?.[0]?.actions[0];
    expect(action).toMatchObject({ action: "search", lookCount: 5 });
    expect(action).not.toHaveProperty("lookCountUpTo");
  });
});
