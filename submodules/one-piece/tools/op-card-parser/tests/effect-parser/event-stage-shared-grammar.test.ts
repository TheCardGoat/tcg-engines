import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("Event and Stage shared parser grammar", () => {
  test("keeps a revealed top-card play and top-or-bottom fallback after Counter power", () => {
    expect(
      buildCardEffects(
        '[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, reveal 1 card from the top of your deck and play up to 1 Character card with a type including "Whitebeard Pirates" and a cost of 3 or less. Then, place the rest at the top or bottom of your deck.',
      )?.effects,
    ).toEqual([
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
            },
            value: 3000,
            duration: "thisBattle",
          },
          {
            action: "revealTopDeckCard",
            player: "self",
            conditional: {
              filters: [
                { filter: "cost", comparison: "lte", value: 3 },
                { filter: "trait", value: "Whitebeard Pirates", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
              actions: [
                {
                  action: "play",
                  source: { player: "self", zone: "deck" },
                  count: { amount: 1, upTo: true },
                  filters: [
                    { filter: "cost", comparison: "lte", value: 3 },
                    { filter: "trait", value: "Whitebeard Pirates", match: "includes" },
                    { filter: "cardCategory", value: "character" },
                  ],
                  topOnly: true,
                },
              ],
            },
            finalPosition: "choice",
          },
        ],
      },
    ]);
  });

  test("keeps a paid compound DON!! and only-trait condition on its action", () => {
    const main = buildCardEffects(
      '[Main] You may rest 1 of your DON!! cards: If the number of DON!! cards on your field is equal to or less than the number on your opponent\'s field and you only have Characters with a type including "GERMA", add up to 2 DON!! cards from your DON!! deck and rest them.',
    )?.effects?.[0];

    expect(main).toEqual({
      trigger: "main",
      costs: [{ cost: "restDon", amount: 1 }],
      actions: [
        {
          action: "addDon",
          count: { amount: 2, upTo: true },
          state: "rested",
          condition: {
            condition: "compound",
            operator: "and",
            conditions: [
              { condition: "donFieldComparison", selfComparison: "lte" },
              {
                condition: "zoneCount",
                player: "self",
                zone: "character",
                comparison: "eq",
                value: 0,
                filters: [
                  {
                    filter: "trait",
                    value: "GERMA",
                    match: "includes",
                    negate: true,
                  },
                ],
              },
            ],
          },
        },
      ],
      optional: true,
    });
  });

  test("keeps ownership, trait, category, and cost filters for a trash play", () => {
    const effects = buildCardEffects(
      "[Counter] If you have 2 or less Life cards, up to 1 of your Leader or Character cards gains +3000 power during this battle. [Trigger] Play up to 1 of your [Egghead] type Character cards with a cost of 5 or less from your trash.",
    )?.effects;

    expect(effects?.find((block) => block.trigger === "trigger")?.actions).toEqual([
      {
        action: "play",
        source: { player: "self", zone: "trash" },
        count: { amount: 1, upTo: true },
        filters: [
          { filter: "cost", comparison: "lte", value: 5 },
          { filter: "trait", value: "Egghead", match: "includes" },
          { filter: "cardCategory", value: "character" },
        ],
      },
    ]);
  });
});
