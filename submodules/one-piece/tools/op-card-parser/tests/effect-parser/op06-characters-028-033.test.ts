import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP06 Character parser regressions for OP06-028 through OP06-033", () => {
  test("OP06-033 keeps every official alternative-cost route", () => {
    expect(
      buildCardEffects(
        '[On Play] You may trash 1 "Fish-Man" type card from your hand or 1 [The Ark Noah] from your hand or field: K.O. up to 1 of your opponent\'s rested Characters.',
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          costs: [
            {
              cost: "trashCard",
              amount: 1,
              options: [
                {
                  zones: ["hand"],
                  filters: [{ filter: "trait", value: "Fish-Man", match: "includes" }],
                },
                {
                  zones: ["hand", "stage"],
                  filters: [{ filter: "name", value: "The Ark Noah" }],
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
