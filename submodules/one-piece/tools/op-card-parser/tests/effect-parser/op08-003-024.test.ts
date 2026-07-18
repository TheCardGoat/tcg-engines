import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP08-003 through OP08-024 parser regressions", () => {
  test("preserves the rested play state on OP08-007's deck search", () => {
    const generated = buildCardEffects(
      "[Your Turn] [On Play]/[When Attacking] Look at 5 cards from the top of your deck and play up to 1 {Animal} type Character card with 4000 power or less rested. Then, place the rest at the bottom of your deck in any order.",
    );

    expect(generated?.effects).toHaveLength(2);
    for (const effect of generated?.effects ?? []) {
      expect(effect.actions).toMatchObject([
        {
          action: "search",
          lookCount: 5,
          revealDestination: "character",
          playState: "rested",
          remainderPosition: "bottom",
          revealFilters: expect.arrayContaining([
            { filter: "power", comparison: "lte", value: 4000 },
          ]),
        },
      ]);
    }
  });
});
