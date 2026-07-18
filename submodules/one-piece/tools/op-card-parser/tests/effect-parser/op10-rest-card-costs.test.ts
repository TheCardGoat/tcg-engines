import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("OP10 rest-card compound costs", () => {
  test("scopes Mansherry's cost threshold only to the returned Character", () => {
    const effect = buildCardEffects(
      '[On Play] You may rest 1 of your "Dressrosa" type Leader or Stage cards, and return 1 of your "Dressrosa" type Characters with a cost of 4 or more to the owner\'s hand: Return up to 1 of your opponent\'s Characters with a cost of 4 or less to the owner\'s hand.',
    )?.effects?.[0];

    expect(effect?.costs).toEqual([
      {
        cost: "restCards",
        amount: 1,
        filters: [
          { filter: "trait", value: "Dressrosa", match: "includes" },
          {
            filter: "anyOf",
            groups: [
              [{ filter: "cardCategory", value: "leader" }],
              [{ filter: "cardCategory", value: "stage" }],
            ],
          },
        ],
      },
      {
        cost: "returnCharacter",
        amount: 1,
        filters: [
          { filter: "trait", value: "Dressrosa", match: "includes" },
          { filter: "cost", comparison: "gte", value: 4 },
        ],
      },
    ]);
  });

  test("keeps Leo's Leader-or-Stage alternative as one rest payment", () => {
    const effect = buildCardEffects(
      '[On Play] You may rest your Leader or 1 of your Stage cards: If your Leader is [Usopp], look at 5 cards from the top of your deck; reveal up to 2 "Dressrosa" type cards other than [Leo] and add them to your hand. Then, place the rest at the bottom of your deck in any order, and trash 1 card from your hand.',
    )?.effects?.[0];

    expect(effect?.costs).toEqual([
      {
        cost: "restCards",
        amount: 1,
        filters: [
          {
            filter: "anyOf",
            groups: [
              [{ filter: "cardCategory", value: "leader" }],
              [{ filter: "cardCategory", value: "stage" }],
            ],
          },
        ],
      },
    ]);
  });
});
