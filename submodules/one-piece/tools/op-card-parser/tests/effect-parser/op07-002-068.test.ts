import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP07-002 through OP07-068 parser regressions", () => {
  test("maps resting a Character by your effect to its dedicated trigger", () => {
    const generated = buildCardEffects(
      "[Your Turn] [Once Per Turn] If a Character is rested by your effect, draw 1 card and trash 1 card from your hand.",
    );

    expect(generated?.effects?.[0]).toMatchObject({
      trigger: "whenCharacterRestedByEffect",
      oncePerTurn: true,
      actions: [
        { action: "draw", player: "self", amount: 1 },
        { action: "trashFromHand", player: "self", amount: 1 },
      ],
    });
  });

  test("keeps Doflamingo's conditional top-card play and bottom-deck fallback", () => {
    const generated = buildCardEffects(
      "[Activate:Main] [Once Per Turn] (2) (You may rest the specified number of DON!! cards in your cost area.): Reveal 1 card from the top of your deck. If that card is a [The Seven Warlords of the Sea] type Character card with a cost of 4 or less, you may play that card rested. Then, place the rest at the bottom of your deck.",
    );

    expect(generated?.effects?.[0]).toMatchObject({
      trigger: "activateMain",
      costs: [{ cost: "restDon", amount: 2 }],
      oncePerTurn: true,
      actions: [
        {
          action: "revealTopDeckCard",
          finalPosition: "bottom",
          conditional: {
            filters: expect.arrayContaining([
              {
                filter: "trait",
                value: "The Seven Warlords of the Sea",
                match: "includes",
              },
              { filter: "cardCategory", value: "character" },
              { filter: "cost", comparison: "lte", value: 4 },
            ]),
            actions: [
              expect.objectContaining({
                action: "play",
                source: { player: "self", zone: "deck" },
                count: { amount: 1, upTo: true },
                topOnly: true,
                playState: "rested",
              }),
            ],
          },
        },
      ],
    });
  });

  test("maps Caribou's rested-DON threshold as a permanent power condition", () => {
    const generated = buildCardEffects(
      "If you have 6 or more rested DON!! cards, this Character gains +1000 power. [Blocker]",
    );

    expect(generated).toMatchObject({
      keywords: ["blocker"],
      permanentEffects: [
        {
          conditions: [
            {
              condition: "donFieldCount",
              player: "self",
              comparison: "gte",
              value: 6,
              state: "rested",
            },
          ],
          actions: [{ action: "modifyPower", value: 1000, duration: "permanent" }],
        },
      ],
    });
  });

  test("keeps alternative Character traits as an inclusive OR count", () => {
    const generated = buildCardEffects(
      "[On Play] If you have 2 or more {Amazon Lily} or {Kuja Pirates} type Characters on your field, draw 1 card.",
    );

    expect(generated?.effects?.[0]?.conditions).toEqual([
      {
        condition: "zoneCount",
        player: "self",
        zone: "character",
        comparison: "gte",
        value: 2,
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
    ]);
  });

  test("keeps Ace's hand-card order before its shared top-or-bottom choice", () => {
    const generated = buildCardEffects(
      "[On Play] Draw 2 cards and place 2 cards from your hand at the top or bottom of your deck in any order.",
    );

    expect(generated?.effects?.[0]?.actions).toEqual([
      { action: "draw", player: "self", amount: 2 },
      {
        action: "returnToDeck",
        target: {
          player: "self",
          zones: ["hand"],
          count: { amount: 2 },
        },
        position: "any",
        order: "any",
      },
    ]);
  });

  test("keeps Sanji's conditional relative cost reduction in hand", () => {
    const generated = buildCardEffects(
      "If the number of DON!! cards on your field is at least 2 less than the number on your opponent's field, give this card in your hand -3 cost. [Blocker]",
    );

    expect(generated).toEqual({
      keywords: ["blocker"],
      permanentEffects: [
        {
          conditions: [
            {
              condition: "donFieldComparison",
              selfComparison: "lte",
              difference: 2,
            },
          ],
          actions: [
            {
              action: "modifyCost",
              target: {
                player: "self",
                zones: ["hand"],
                count: { amount: 1 },
                self: true,
              },
              value: -3,
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });
});
