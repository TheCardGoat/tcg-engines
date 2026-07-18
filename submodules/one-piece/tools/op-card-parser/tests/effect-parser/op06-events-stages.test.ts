import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP06 Event and Stage regressions", () => {
  test("OP06-018 keeps the independent conditional power recipient", () => {
    expect(
      buildCardEffects(
        "[Main] Up to 1 of your Leader or Character cards gains +3000 power during this turn. Then, if your opponent has a Character with 7000 power or more, up to 1 of your Leader or Character cards gains +1000 power during this turn. [Trigger] K.O. up to 1 of your opponent's Characters with 5000 power or less.",
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
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 1000,
              duration: "thisTurn",
              condition: {
                condition: "hasCard",
                player: "opponent",
                zone: "character",
                filters: [{ filter: "power", comparison: "gte", value: 7000 }],
              },
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "power", comparison: "lte", value: 5000 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("OP06-038 keeps the rested-card condition on the same Counter recipient", () => {
    expect(
      buildCardEffects(
        "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 8 or more rested cards, that card gains an additional +2000 power during this battle. [Trigger] K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less.",
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
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 2000,
              duration: "thisBattle",
            },
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 2000,
              duration: "thisBattle",
              previousActionTargets: true,
              condition: {
                condition: "restedCardCount",
                player: "self",
                comparison: "gte",
                value: 8,
              },
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [
                  { filter: "state", value: "rested" },
                  { filter: "cost", comparison: "lte", value: 3 },
                ],
              },
            },
          ],
        },
      ],
    });
  });

  test("OP06-057 keeps reveal, exact-cost play, and top-or-bottom cleanup together", () => {
    expect(
      buildCardEffects(
        "[Main] Up to 1 of your Leader or Character cards gains +1000 power during this turn. Then, reveal 1 card from the top of your deck, play up to 1 Character card with a cost of 2, and place the rest at the top or bottom of your deck. [Trigger] Play up to 1 Character card with a cost of 2 from your hand.",
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
              value: 1000,
              duration: "thisTurn",
            },
            {
              action: "revealTopDeckCard",
              player: "self",
              conditional: {
                filters: [
                  { filter: "cardCategory", value: "character" },
                  { filter: "cost", comparison: "eq", value: 2 },
                ],
                actions: [
                  {
                    action: "play",
                    source: { player: "self", zone: "deck" },
                    count: { amount: 1, upTo: true },
                    filters: [
                      { filter: "cardCategory", value: "character" },
                      { filter: "cost", comparison: "eq", value: 2 },
                    ],
                    topOnly: true,
                  },
                ],
              },
              finalPosition: "choice",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "eq", value: 2 },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
        },
      ],
    });
  });

  test("OP06-058 keeps owner-deck movement from either field", () => {
    expect(
      buildCardEffects(
        "[Main] Place up to 2 Characters with a cost of 6 or less at the bottom of the owner's deck in any order. [Trigger] Place up to 1 Character with a cost of 5 or less at the bottom of the owner's deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 2, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 6 }],
              },
              position: "bottom",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 5 }],
              },
              position: "bottom",
            },
          ],
        },
      ],
    });
  });

  test("OP06-095 keeps the optional self-K.O. and scales from successful K.O.s", () => {
    expect(
      buildCardEffects(
        "[Main] / [Counter] Your Leader gains +1000 power during this turn. Then, you may K.O. any number of your [Thriller Bark Pirates] type Characters with a cost of 2 or less. Your Leader gains an additional +1000 power during this turn for every Character K.O.'d. [Trigger] Draw 2 cards and trash 1 card from your hand.",
      ),
    ).toEqual({
      effects: [
        ...(["main", "counter"] as const).map((trigger) => ({
          trigger,
          actions: [
            {
              action: "modifyPower",
              target: { player: "self", zones: ["leader"], count: { amount: 1 } },
              value: 1000,
              duration: "thisTurn",
            },
            {
              action: "ko",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all", upTo: true },
                filters: [
                  { filter: "trait", value: "Thriller Bark Pirates", match: "includes" },
                  { filter: "cost", comparison: "lte", value: 2 },
                ],
              },
            },
            {
              action: "modifyPower",
              target: { player: "self", zones: ["leader"], count: { amount: 1 } },
              value: 0,
              valuePerPreviousActionTarget: 1000,
              duration: "thisTurn",
            },
          ],
        })),
        {
          trigger: "trigger",
          actions: [
            { action: "draw", player: "self", amount: 2 },
            { action: "trashFromHand", player: "self", amount: 1 },
          ],
        },
      ],
    });
  });

  test("OP06-115 keeps the exact zero-Life gate and mandatory hand trash", () => {
    expect(
      buildCardEffects(
        "[Trigger] If you have 0 Life cards, you may add up to 1 card from the top of your deck to the top of your Life cards. Then, trash 1 card from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "trigger",
          conditions: [{ condition: "lifeCount", player: "self", comparison: "eq", value: 0 }],
          actions: [
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: ["deck"],
                count: { amount: 1, upTo: true },
              },
              position: "top",
            },
            { action: "trashFromHand", player: "self", amount: 1 },
          ],
        },
      ],
    });
  });

  test("OP06-116 keeps the shared post-choice Life continuation", () => {
    expect(
      buildCardEffects(
        "[Main] Choose one:\n• K.O. up to 1 of your opponent's Characters with a cost of 5 or less.\n• If your opponent has 1 Life card, deal 1 damage to your opponent.\nThen, add 1 card from the top of your Life cards to your hand.\n[Trigger] Draw 1 cards.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "choice",
              options: [
                [
                  {
                    action: "ko",
                    target: {
                      player: "opponent",
                      zones: ["character"],
                      count: { amount: 1, upTo: true },
                      filters: [{ filter: "cost", comparison: "lte", value: 5 }],
                    },
                  },
                ],
                [
                  {
                    action: "dealDamage",
                    player: "opponent",
                    amount: 1,
                    condition: {
                      condition: "lifeCount",
                      player: "opponent",
                      comparison: "eq",
                      value: 1,
                    },
                  },
                ],
              ],
            },
            {
              action: "removeFromLife",
              player: "self",
              count: { amount: 1 },
              destination: "hand",
              position: "top",
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

  test("OP06-117 keeps the Stage and named Enel rest costs", () => {
    expect(
      buildCardEffects(
        "[Activate:Main][Once Per Turn] You may rest this card and 1 of your [Enel] cards: K.O. all of your opponent's Characters with a cost of 2 or less.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            { cost: "restThisCard" },
            {
              cost: "restCards",
              amount: 1,
              filters: [{ filter: "name", value: "Enel" }],
            },
          ],
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: "all" },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
            },
          ],
          optional: true,
          oncePerTurn: true,
        },
      ],
    });
  });
});
