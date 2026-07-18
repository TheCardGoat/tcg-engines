import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP05 Event and Stage regressions", () => {
  test("OP05-038 keeps the optional trash payment dependent from the Counter bonus", () => {
    expect(
      buildCardEffects(
        "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, you may trash 1 card from your hand. If you do, set up to 3 of your DON!! cards as active. [Trigger] Rest up to 1 of your opponent's Leader or Character cards with a cost of 3 or less.",
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
              value: 4000,
              duration: "thisBattle",
            },
          ],
        },
        {
          trigger: "counter",
          costs: [{ cost: "trashFromHand", amount: 1 }],
          actions: [
            {
              action: "setActive",
              target: {
                player: "self",
                zones: ["costArea"],
                count: { amount: 3, upTo: true },
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
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 3 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("OP05-040 keeps both-player Refresh prevention and mandatory End of Turn cleanup", () => {
    expect(
      buildCardEffects(
        "If your Leader is [Donquixote Doflamingo], all Characters with a cost of 5 or less do not become active in your and your opponent's Refresh Phases. [End of Your Turn] If you have 10 DON!! cards on your field, K.O. all rested Characters with a cost of 5 or less. Then, trash this Stage.",
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [{ condition: "leaderName", name: "Donquixote Doflamingo" }],
          actions: [
            {
              action: "freeze",
              target: {
                player: "both",
                zones: ["character"],
                count: { amount: "all" },
                filters: [{ filter: "cost", comparison: "lte", value: 5 }],
              },
            },
          ],
        },
      ],
      effects: [
        {
          trigger: "endOfYourTurn",
          conditions: [
            {
              condition: "donFieldCount",
              player: "self",
              comparison: "eq",
              value: 10,
            },
          ],
          actions: [
            {
              action: "ko",
              target: {
                player: "both",
                zones: ["character"],
                count: { amount: "all" },
                filters: [
                  { filter: "state", value: "rested" },
                  { filter: "cost", comparison: "lte", value: 5 },
                ],
              },
            },
            { action: "trashThisCard" },
          ],
        },
      ],
    });
  });

  test("OP05-094 keeps its next-Refresh freeze as an independent Then action", () => {
    expect(
      buildCardEffects(
        "[Main] Give up to 1 of your opponent's Characters -3 cost during this turn. Then, up to 1 of your opponent's Characters with a cost of 0 will not become active in the next Refresh Phase. [Trigger] Draw 2 cards and trash 1 card from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "modifyCost",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
              value: -3,
              duration: "thisTurn",
            },
            {
              action: "freeze",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "eq", value: 0 }],
              },
            },
          ],
        },
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

  test("OP05-057 keeps either-field movement and owner destinations", () => {
    expect(
      buildCardEffects(
        "[Main] Up to 1 of your Leader or Character cards gains +3000 power during this turn. Then, place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck. [Trigger] Return up to 1 Character with a cost of 3 or less to the owner's hand.",
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
              action: "returnToDeck",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
              position: "bottom",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 3 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("OP05-058 keeps owner-deck movement for both players before each trashes to 5", () => {
    expect(
      buildCardEffects(
        "[Main] Place all Characters with a cost of 3 or less at the bottom of the owner's deck. Then, you and your opponent trash cards from your hands until you each have 5 cards in your hands. [Trigger] Place all Characters with a cost of 2 or less at the bottom of the owner's deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "both",
                zones: ["character"],
                count: { amount: "all" },
                filters: [{ filter: "cost", comparison: "lte", value: 3 }],
              },
              position: "bottom",
            },
            { action: "trashFromHand", player: "self", amount: 0, untilHandSize: 5 },
            { action: "trashFromHand", player: "opponent", amount: 0, untilHandSize: 5 },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "both",
                zones: ["character"],
                count: { amount: "all" },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
              position: "bottom",
            },
          ],
        },
      ],
    });
  });

  test("OP05-059 scopes the multicolored condition to the draw before Then", () => {
    expect(
      buildCardEffects(
        "[Main] If your Leader is multicolored, draw 1 card. Then, return up to 1 Character with a cost of 5 or less to the owner's hand. [Trigger] If your Leader is multicolored, draw 2 cards.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "draw",
              player: "self",
              amount: 1,
              condition: { condition: "leaderMulticolored" },
            },
            {
              action: "returnToHand",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 5 }],
              },
            },
          ],
        },
        {
          trigger: "trigger",
          conditions: [{ condition: "leaderMulticolored" }],
          actions: [{ action: "draw", player: "self", amount: 2 }],
        },
      ],
    });
  });

  test("OP05-076 preserves all three inclusive search traits", () => {
    expect(
      buildCardEffects(
        "[Main] Look at 3 cards from the top of your deck; reveal up to 1 [Straw Hat Crew], [Kid Pirates], or [Heart Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Activate this card's [Main] effect.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "search",
              lookCount: 3,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [
                {
                  filter: "anyOf",
                  filters: [
                    { filter: "trait", value: "Straw Hat Crew", match: "includes" },
                    { filter: "trait", value: "Kid Pirates", match: "includes" },
                    { filter: "trait", value: "Heart Pirates", match: "includes" },
                  ],
                },
              ],
              revealDestination: "hand",
              remainderPosition: "bottom",
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

  test.each([
    [
      "OP05-077",
      "[Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Give up to 1 of your opponent's Characters -5000 power during this turn. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
      "opponent",
      undefined,
      -5000,
    ],
    [
      "OP05-078",
      "[Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Up to 1 of your [Kid Pirates] type Leader or Character cards gains +5000 power during this turn. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
      "self",
      [{ filter: "trait", value: "Kid Pirates", match: "includes" }],
      5000,
    ],
  ] as const)("%s keeps DON!! -1 as a direct Main cost", (_id, text, player, filters, value) => {
    expect(buildCardEffects(text)).toEqual({
      effects: [
        {
          trigger: "main",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player,
                zones: player === "self" ? ["leader", "character"] : ["character"],
                count: { amount: 1, upTo: true },
                ...(filters ? { filters: [...filters] } : {}),
              },
              value,
              duration: "thisTurn",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "addDon",
              count: { amount: 1, upTo: true },
              state: "active",
            },
          ],
        },
      ],
    });
  });

  test("OP05-097 uses inclusive Celestial Dragons matching with its printed boundaries", () => {
    expect(
      buildCardEffects(
        "[Your Turn] The cost of playing [Celestial Dragons] type Character cards with a cost of 2 or more from your hand will be reduced by 1.",
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [{ condition: "turn", value: "your" }],
          actions: [
            {
              action: "modifyCost",
              target: {
                player: "self",
                zones: ["hand"],
                count: { amount: "all" },
                filters: [
                  { filter: "trait", value: "Celestial Dragons", match: "includes" },
                  { filter: "cardCategory", value: "character" },
                  { filter: "cost", comparison: "gte", value: 2 },
                ],
              },
              value: -1,
            },
          ],
        },
      ],
    });
  });

  test("OP05-096 keeps all three choices before the independent conditional draw", () => {
    expect(
      buildCardEffects(
        "[Main] Choose one: • K.O. up to 1 of your opponent's Characters with a cost of 1 or less. • Return up to 1 of your opponent's Characters with a cost of 1 or less to the owner's hand. • Place up to 1 of your opponent's Characters with a cost of 1 or less at the top or bottom of their Life cards face-up. Then, if you have a [Celestial Dragons] type Character, draw 1 card. [Trigger] K.O. up to 1 of your opponent's Characters with a cost of 6 or less, or return it to the owner's hand.",
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
                      filters: [{ filter: "cost", comparison: "lte", value: 1 }],
                    },
                  },
                ],
                [
                  {
                    action: "returnToHand",
                    target: {
                      player: "opponent",
                      zones: ["character"],
                      count: { amount: 1, upTo: true },
                      filters: [{ filter: "cost", comparison: "lte", value: 1 }],
                    },
                  },
                ],
                [
                  {
                    action: "addToLife",
                    target: {
                      player: "opponent",
                      zones: ["character"],
                      count: { amount: 1, upTo: true },
                      filters: [{ filter: "cost", comparison: "lte", value: 1 }],
                    },
                    position: "choice",
                    faceUp: true,
                  },
                ],
              ],
            },
            {
              action: "draw",
              player: "self",
              amount: 1,
              condition: {
                condition: "hasCard",
                player: "self",
                zone: "character",
                filters: [{ filter: "trait", value: "Celestial Dragons", match: "includes" }],
              },
            },
          ],
        },
        {
          trigger: "trigger",
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
                      filters: [{ filter: "cost", comparison: "lte", value: 6 }],
                    },
                  },
                ],
                [
                  {
                    action: "returnToHand",
                    target: {
                      player: "opponent",
                      zones: ["character"],
                      count: { amount: 1, upTo: true },
                      filters: [{ filter: "cost", comparison: "lte", value: 6 }],
                    },
                  },
                ],
              ],
            },
          ],
        },
      ],
    });
  });
});
