import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP07 Event regressions", () => {
  test("OP07-016 keeps both Revolutionary Army power changes and Trigger activation", () => {
    expect(
      buildCardEffects(
        "[Main] Up to 1 of your [Revolutionary Army] type Characters gains +2000 power during this turn. Then, give up to 1 of your opponent's Characters -1000 power during this turn. [Trigger] Activate this card's [Main] effect.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "trait", value: "Revolutionary Army", match: "includes" }],
              },
              value: 2000,
              duration: "thisTurn",
            },
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
              value: -1000,
              duration: "thisTurn",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [{ action: "activateEffect", effectTrigger: "main" }],
        },
      ],
    });
  });

  test("OP07-017 keeps independent Character and Stage K.O. choices", () => {
    expect(
      buildCardEffects(
        "[Main] K.O. up to 1 of your opponent's Characters with 3000 power or less and up to 1 of your opponent's Stages with a cost of 1 or less. [Trigger] Activate this card's [Main] effect.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "power", comparison: "lte", value: 3000 }],
              },
            },
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["stage"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 1 }],
              },
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [{ action: "activateEffect", effectTrigger: "main" }],
        },
      ],
    });
  });

  test("OP07-018 keeps the Revolutionary Army recipient and next-turn duration", () => {
    expect(
      buildCardEffects(
        "[Counter] Up to 1 of your [Revolutionary Army] type Characters gains +2000 power until the end of your next turn. [Trigger] Activate this card's [Counter] effect.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "trait", value: "Revolutionary Army", match: "includes" }],
              },
              value: 2000,
              duration: "untilEndOfYourNextTurn",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [{ action: "activateEffect", effectTrigger: "counter" }],
        },
      ],
    });
  });

  test("OP07-036 keeps its dependent Character-rest payment and follow-up", () => {
    expect(
      buildCardEffects(
        "[Main] Up to 1 of your Leader or Character cards gains +3000 power during this turn. Then, you may rest 1 of your Characters with a cost of 3 or more. If you do, rest up to 1 of your opponent's Characters with a cost of 5 or less. [Trigger] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 3000,
              duration: "thisTurn",
            },
          ],
        },
        {
          trigger: "main",
          costs: [
            {
              cost: "restCards",
              amount: 1,
              filters: [
                { filter: "cardCategory", value: "character" },
                { filter: "cost", comparison: "gte", value: 3 },
              ],
            },
          ],
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 5 }],
              },
            },
          ],
          optional: true,
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 4 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("OP07-056 keeps its qualified return cost and Trigger hand cycle", () => {
    expect(
      buildCardEffects(
        "[Counter] You may return 1 of your Characters with a cost of 2 or more to the owner's hand: Up to 1 of your Leader or Character cards gains +4000 power during this battle. [Trigger] Draw 2 cards and place 2 cards from your hand at the bottom of your deck in any order.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          costs: [
            {
              cost: "returnCharacter",
              amount: 1,
              filters: [{ filter: "cost", comparison: "gte", value: 2 }],
            },
          ],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 4000,
              duration: "thisBattle",
            },
          ],
          optional: true,
        },
        {
          trigger: "trigger",
          actions: [
            { action: "draw", player: "self", amount: 2 },
            {
              action: "returnToDeck",
              target: {
                player: "self",
                zones: ["hand"],
                count: { amount: 2 },
              },
              position: "bottom",
              order: "any",
            },
          ],
        },
      ],
    });
  });

  test("OP07-057 keeps its selected Warlords target and target-scoped unblockable", () => {
    expect(
      buildCardEffects(
        "[Main] Select up to 1 of your [The Seven Warlords of the Sea] type Leader or Character cards and that card gains +2000 power during this turn. Then, if the selected card attacks during this turn, your opponent cannot activate [Blocker]. [Trigger] Draw 1 card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
                filters: [
                  {
                    filter: "trait",
                    value: "The Seven Warlords of the Sea",
                    match: "includes",
                  },
                ],
              },
              value: 2000,
              duration: "thisTurn",
            },
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              keyword: "unblockable",
              duration: "thisTurn",
              previousActionTargets: true,
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [{ action: "draw", player: "self", amount: 1 }],
        },
      ],
    });
  });

  test("OP07-058 keeps both costs, its Leader condition, and either allowed trait", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may trash 1 card from your hand and rest this Stage: If your Leader has the [Kuja Pirates] type, return up to 1 of your [Amazon Lily] or [Kuja Pirates] type Characters to the owner's hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "trashFromHand", amount: 1 }, { cost: "restThisCard" }],
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [
                  {
                    filter: "anyOf",
                    filters: [
                      { filter: "trait", value: "Amazon Lily", match: "includes" },
                      { filter: "trait", value: "Kuja Pirates", match: "includes" },
                    ],
                  },
                ],
              },
              condition: {
                condition: "leaderTrait",
                trait: "Kuja Pirates",
                match: "includes",
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("OP07-075 keeps independent Leader and Character power choices", () => {
    expect(
      buildCardEffects(
        "[Counter] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Give up to 1 each of your opponent's Leader and Character cards -2000 power during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["leader"],
                count: { amount: 1, upTo: true },
              },
              value: -2000,
              duration: "thisTurn",
            },
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
              value: -2000,
              duration: "thisTurn",
            },
          ],
        },
      ],
    });
  });
});
