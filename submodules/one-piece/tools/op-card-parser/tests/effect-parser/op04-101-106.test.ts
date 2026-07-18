import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-101 through OP04-106 transformations", () => {
  test("preserves Carmel's turn-scoped draw and physical Trigger play before K.O.", () => {
    expect(
      buildCardEffects(
        "[Your Turn] [On Play] Draw 1 card. [Trigger] Play this card. Then, K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "turn", value: "your" }],
          actions: [{ action: "draw", player: "self", amount: 1 }],
        },
        {
          trigger: "trigger",
          actions: [
            { action: "playThisCard" },
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("preserves both Kin'emon costs and its once-per-turn ready action", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] [Once Per Turn] (1) (You may rest the specified number of DON!! cards in your cost area.) You may add 1 card from the top or bottom of your Life cards to your hand: Set this Character as active.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            { cost: "restDon", amount: 1 },
            { cost: "addLifeToHand", amount: 1, position: "choice" },
          ],
          actions: [
            {
              action: "setActive",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
            },
          ],
          optional: true,
          oncePerTurn: true,
        },
      ],
    });
  });

  test("preserves Hiyori's inclusive Wano buff and physical Trigger play", () => {
    expect(
      buildCardEffects(
        "[On Play] Up to 1 of your [Land of Wano] type Leader or Character cards gains +1000 power during this turn. [Trigger] Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "trait", value: "Land of Wano", match: "includes" }],
              },
              value: 1000,
              duration: "thisTurn",
            },
          ],
        },
        { trigger: "trigger", actions: [{ action: "playThisCard" }] },
      ],
    });
  });

  test("preserves Sanji's Blocker and filtered optional Trigger play cost", () => {
    expect(
      buildCardEffects(
        "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Trigger] You may trash 1 card from your hand: Play this card.",
      ),
    ).toEqual({
      keywords: ["blocker"],
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

  test("preserves Amande's Trigger-card hand cost and once-per-turn rest", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] [Once Per Turn] You may trash 1 card with a [Trigger] from your hand: Rest up to 1 of your opponent's Characters with a cost of 2 or less.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            {
              cost: "trashFromHand",
              amount: 1,
              filters: [{ filter: "hasTrigger", value: true }],
            },
          ],
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
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

  test("preserves Bavarois's conditional permanent power and physical Trigger play", () => {
    expect(
      buildCardEffects(
        "[DON!! x1] If you have less Life cards than your opponent, this Character gains +1000 power. [Trigger] You may trash 1 card from your hand: Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "trigger",
          costs: [{ cost: "trashFromHand", amount: 1 }],
          actions: [{ action: "playThisCard" }],
          optional: true,
        },
      ],
      permanentEffects: [
        {
          conditions: [
            { condition: "donAttached", amount: 1 },
            { condition: "lifeComparison", selfComparison: "lt" },
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
});
