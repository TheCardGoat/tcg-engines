import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-076/093/094/096/116/117 transformations", () => {
  test("preserves Weakness's direct Counter DON!! cost and Trigger", () => {
    expect(
      buildCardEffects(
        "[Counter] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Up to 1 of your Leader or Character cards gains +1000 power during this turn. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
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
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 1000,
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

  test("preserves King Kong Gun's conditional same-target Double Attack", () => {
    expect(
      buildCardEffects(
        "[Main] Up to 1 of your [Dressrosa] type Characters gains +6000 power during this turn. Then, if you have 15 or more cards in your trash, that card gains [Double Attack] during this turn. (This card deals 2 damage.) [Trigger] Draw 3 cards and trash 2 cards from your hand.",
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
                filters: [{ filter: "trait", value: "Dressrosa", match: "includes" }],
              },
              value: 6000,
              duration: "thisTurn",
            },
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "trait", value: "Dressrosa", match: "includes" }],
              },
              keyword: "doubleAttack",
              duration: "thisTurn",
              previousActionTargets: true,
              condition: {
                condition: "zoneCount",
                player: "self",
                zone: "trash",
                comparison: "gte",
                value: 15,
              },
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            { action: "draw", player: "self", amount: 3 },
            { action: "trashFromHand", player: "self", amount: 2 },
          ],
        },
      ],
    });
  });

  test("preserves Trueno Bastardo's replacement range and Trigger Leader-rest cost", () => {
    expect(
      buildCardEffects(
        "[Main] Choose up to 1 of your opponent's Characters with a cost of 4 or less and K.O. it. If you have 15 or more cards in your trash, choose up to 1 of your opponent's Characters with a cost of 6 or less instead of a Character with a cost of 4 or less. [Trigger] You may rest your Leader: K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          conditions: [
            {
              condition: "zoneCount",
              player: "self",
              zone: "trash",
              comparison: "lt",
              value: 15,
            },
          ],
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 4 }],
              },
            },
          ],
        },
        {
          trigger: "main",
          conditions: [
            {
              condition: "zoneCount",
              player: "self",
              zone: "trash",
              comparison: "gte",
              value: 15,
            },
          ],
          actions: [
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
        },
        {
          trigger: "trigger",
          costs: [
            {
              cost: "restCards",
              amount: 1,
              filters: [{ filter: "cardCategory", value: "leader" }],
            },
          ],
          actions: [
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
          optional: true,
        },
      ],
    });
  });

  test("preserves Corrida Coliseum's conditional permanent Rush: Character grant", () => {
    expect(
      buildCardEffects(
        "If your Leader has the [Dressrosa] type, your [Dressrosa] type Characters can attack Characters on the turn in which they are played.",
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "leaderTrait",
              trait: "Dressrosa",
              match: "includes",
            },
          ],
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all" },
                filters: [{ filter: "trait", value: "Dressrosa", match: "includes" }],
              },
              keyword: "rushCharacter",
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });

  test("preserves Diable Jambe's combined-Life condition", () => {
    expect(
      buildCardEffects(
        "[Counter] Up to 1 of your Leader or Character cards gains +6000 power during this battle. Then, if you and your opponent have a total of 4 or less Life cards, K.O. up to 1 of your opponent's Characters with a cost of 2 or less. [Trigger] Draw 1 card.",
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
              value: 6000,
              duration: "thisBattle",
            },
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
              condition: { condition: "totalLifeCount", comparison: "lte", value: 4 },
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

  test("preserves Heavenly Fire's top-or-bottom opposing Life choice", () => {
    expect(
      buildCardEffects(
        "[Main] Add up to 1 of your opponent's Characters with a cost of 3 or less to the top or bottom of your opponent's Life cards face-up. [Trigger] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 card from your hand to the top of your Life cards.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "addToLife",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 3 }],
              },
              position: "choice",
              faceUp: true,
            },
          ],
        },
        {
          trigger: "trigger",
          costs: [{ cost: "addLifeToHand", amount: 1, position: "choice" }],
          actions: [
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: ["hand"],
                count: { amount: 1, upTo: true },
              },
              position: "top",
            },
          ],
          optional: true,
        },
      ],
    });
  });
});
