import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP09-036 through OP09-089 shared parser regressions", () => {
  test("OP09-036 keeps DON!! and Character targets in one rest selection", () => {
    expect(
      buildCardEffects(
        "[On Play] If you have 2 or more rested Characters, rest up to 1 of your opponent's DON!! cards or Characters with a cost of 6 or less.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["costArea", "character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 6 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("OP09-044 keeps Land of Wano or included Whitebeard Pirates as alternatives", () => {
    expect(
      buildCardEffects(
        '[When Attacking] Look at 5 cards from the top of your deck; reveal up to 1 "Land of Wano" type card or card with a type including "Whitebeard Pirates" and add it to your hand. Then, place the rest at the bottom of your deck in any order and trash 1 card from your hand.',
      )?.effects?.[0]?.actions,
    ).toMatchObject([
      {
        action: "search",
        revealFilters: [
          {
            filter: "anyOf",
            filters: [
              { filter: "trait", value: "Land of Wano", match: "includes" },
              { filter: "trait", value: "Whitebeard Pirates", match: "includes" },
            ],
          },
        ],
      },
      { action: "trashFromHand", player: "self", amount: 1 },
    ]);
  });

  test("OP09-046 keeps the shared cost outside Cross Guild or Baroque Works alternatives", () => {
    expect(
      buildCardEffects(
        '[On Play] Play up to 1 "Cross Guild" type Character card or Character card with a type including "Baroque Works" with a cost of 5 or less from your hand.',
      )?.effects?.[0]?.actions?.[0],
    ).toMatchObject({
      action: "play",
      count: { amount: 1, upTo: true },
      filters: [
        { filter: "cost", comparison: "lte", value: 5 },
        {
          filter: "anyOf",
          filters: [
            {
              filter: "allOf",
              filters: [
                { filter: "trait", value: "Cross Guild", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
            {
              filter: "allOf",
              filters: [
                { filter: "trait", value: "Baroque Works", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
        },
      ],
    });
  });

  test("OP09-051 keeps the conditional self-return after the opponent return", () => {
    expect(
      buildCardEffects(
        "[On Play] Place up to 1 of your opponent's Characters at the bottom of the owner's deck. Then, if you do not have 5 Characters with a cost of 5 or more, place this Character at the bottom of the owner's deck.",
      )?.effects?.[0]?.actions,
    ).toEqual([
      {
        action: "returnToDeck",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
        },
        position: "bottom",
      },
      {
        action: "returnToDeck",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
        position: "bottom",
        condition: {
          condition: "zoneCount",
          player: "self",
          zone: "character",
          comparison: "lt",
          value: 5,
          filters: [{ filter: "cost", comparison: "gte", value: 5 }],
        },
      },
    ]);
  });

  test("OP09-056 keeps exclusion outside Cross Guild or Baroque Works alternatives", () => {
    expect(
      buildCardEffects(
        '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 "Cross Guild" type card or card with a type including "Baroque Works" other than [Mr.3(Galdino)] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
      )?.effects?.[0]?.actions?.[0],
    ).toMatchObject({
      action: "search",
      revealFilters: [
        { filter: "excludeName", value: "Mr.3(Galdino)" },
        {
          filter: "anyOf",
          filters: [
            { filter: "trait", value: "Cross Guild", match: "includes" },
            { filter: "trait", value: "Baroque Works", match: "includes" },
          ],
        },
      ],
    });
  });

  test("OP09-084 keeps the three temporary keywords as a choice instead of static keywords", () => {
    expect(
      buildCardEffects(
        '[Activate: Main] [Once Per Turn] If your Leader has the "Blackbeard Pirates" type, this Character gains [Double Attack], [Banish] or [Blocker] until the end of your opponent\'s next turn.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          conditions: [
            {
              condition: "leaderTrait",
              trait: "Blackbeard Pirates",
              match: "includes",
            },
          ],
          actions: [
            {
              action: "choice",
              options: [
                [
                  {
                    action: "grantKeyword",
                    target: {
                      player: "self",
                      zones: ["character"],
                      count: { amount: 1 },
                      self: true,
                    },
                    keyword: "doubleAttack",
                    duration: "untilEndOfOpponentNextTurn",
                  },
                ],
                [
                  {
                    action: "grantKeyword",
                    target: {
                      player: "self",
                      zones: ["character"],
                      count: { amount: 1 },
                      self: true,
                    },
                    keyword: "banish",
                    duration: "untilEndOfOpponentNextTurn",
                  },
                ],
                [
                  {
                    action: "grantKeyword",
                    target: {
                      player: "self",
                      zones: ["character"],
                      count: { amount: 1 },
                      self: true,
                    },
                    keyword: "blocker",
                    duration: "untilEndOfOpponentNextTurn",
                  },
                ],
              ],
            },
          ],
          oncePerTurn: true,
        },
      ],
    });
  });

  test("OP09-089 normalizes an en dash as a negative cost modifier", () => {
    expect(
      buildCardEffects(
        '[Activate: Main] You may trash 1 card from your hand and trash this Character: If your Leader has the "Blackbeard Pirates" type, draw 1 card. Then, give up to 1 of your opponent\'s Characters –2 cost during this turn.',
      )?.effects?.[0],
    ).toMatchObject({
      trigger: "activateMain",
      costs: [{ cost: "trashFromHand", amount: 1 }, { cost: "trashThisCard" }],
      actions: [
        {
          action: "draw",
          player: "self",
          amount: 1,
          condition: {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
            match: "includes",
          },
        },
        {
          action: "modifyCost",
          value: -2,
          duration: "thisTurn",
        },
      ],
      optional: true,
    });
  });
});
