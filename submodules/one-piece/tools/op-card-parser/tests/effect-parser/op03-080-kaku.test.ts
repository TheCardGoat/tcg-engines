import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP03-080 Kaku parser regression", () => {
  test("preserves the included CP trait on the ordered trash-to-deck cost", () => {
    expect(
      buildCardEffects(
        '[On Play] You may place 2 cards with a type including "CP" from your trash at the bottom of your deck in any order: K.O. up to 1 of your opponent\'s Characters with a cost of 3 or less.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [
            {
              cost: "returnTrashToDeck",
              amount: 2,
              position: "bottom",
              filters: [{ filter: "trait", value: "CP", match: "includes" }],
            },
          ],
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 3 }],
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });
});
