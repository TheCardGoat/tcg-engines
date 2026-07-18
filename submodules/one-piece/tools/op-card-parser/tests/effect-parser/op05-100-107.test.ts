import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP05-100 through OP05-107 parser regressions", () => {
  test("OP05-100 keeps Rush and negates Enel's self leave-field replacement around Luffy", () => {
    expect(
      buildCardEffects(
        "[Rush] [Once Per Turn] If this Character would leave the field, you may trash 1 card from the top of your Life cards instead. If there is a [Monkey.D.Luffy] Character, this effect is negated.",
      ),
    ).toEqual({
      keywords: ["rush"],
      replacementEffects: [
        {
          replacedEvent: "leaveField",
          eventFilter: { targetSelf: true },
          conditions: [
            {
              condition: "compound",
              operator: "and",
              conditions: [
                {
                  condition: "notHasCard",
                  player: "self",
                  zone: "character",
                  filters: [{ filter: "name", value: "Monkey.D.Luffy" }],
                },
                {
                  condition: "notHasCard",
                  player: "opponent",
                  zone: "character",
                  filters: [{ filter: "name", value: "Monkey.D.Luffy" }],
                },
              ],
            },
          ],
          replacementAction: {
            action: "removeFromLife",
            player: "self",
            count: { amount: 1 },
            destination: "trash",
          },
          oncePerTurn: true,
        },
      ],
    });
  });

  test("OP05-101 keeps Ohm's Life-count permanent and On Play Holly sequence", () => {
    expect(
      buildCardEffects(
        "If you have 2 or less Life cards, this Character gains +1000 power. [On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Holly] and add it to your hand. Then, place the rest at the bottom of your deck in any order and play up to 1 [Holly] from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "search",
              lookCount: 5,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [{ filter: "name", value: "Holly" }],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [{ filter: "name", value: "Holly" }],
            },
          ],
        },
      ],
      permanentEffects: [
        {
          conditions: [
            {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 2,
            },
          ],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              value: 1000,
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });

  test("OP05-105 emits Satori's optional hand-trash cost and physical Trigger play", () => {
    expect(
      buildCardEffects("[Trigger] You may trash 1 card from your hand: Play this card."),
    ).toEqual({
      effects: [
        {
          trigger: "trigger",
          costs: [{ cost: "trashFromHand", amount: 1 }],
          actions: [{ action: "playThisCard" }],
          optional: true,
        },
      ],
    });
  });

  test("OP05-106 uses inclusive Sky Island search and physical Trigger play", () => {
    expect(
      buildCardEffects(
        "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Sky Island] type card other than [Shura] and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "search",
              lookCount: 5,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [
                { filter: "excludeName", value: "Shura" },
                { filter: "trait", value: "Sky Island", match: "includes" },
              ],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });

  test("OP05-107 maps Life-to-hand timing without treating it as battle damage", () => {
    expect(
      buildCardEffects(
        "[Your Turn][Once Per Turn] When a card is added to your hand from your Life, this Character gains +2000 power during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenLifeAddedToHand",
          conditions: [{ condition: "turn", value: "your" }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              value: 2000,
              duration: "thisTurn",
            },
          ],
          oncePerTurn: true,
        },
      ],
    });
  });
});
