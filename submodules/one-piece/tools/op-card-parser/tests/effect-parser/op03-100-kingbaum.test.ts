import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP03-100 Kingbaum parser regression", () => {
  test("preserves the selectable top-or-bottom Life-trash cost before playing itself", () => {
    expect(
      buildCardEffects(
        "[Trigger] You may trash 1 card from the top or bottom of your Life cards: Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "trigger",
          costs: [{ cost: "trashLife", amount: 1, position: "choice" }],
          actions: [{ action: "playThisCard" }],
          optional: true,
        },
      ],
    });
  });
});
