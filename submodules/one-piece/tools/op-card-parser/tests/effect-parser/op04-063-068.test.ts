import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-063 through OP04-073 parser regressions", () => {
  test("keeps Franky's Water Seven gate after its optional DON!! cost", () => {
    expect(
      buildCardEffects(
        "[On Your Opponent's Attack] [Once Per Turn] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [Water Seven] type, up to 1 of your Leader or Character cards gains +1000 power during this battle.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onOpponentAttack",
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
              duration: "thisBattle",
              condition: {
                condition: "leaderTrait",
                trait: "Water Seven",
                match: "includes",
              },
            },
          ],
          optional: true,
          oncePerTurn: true,
        },
      ],
    });
  });

  test("keeps Ms. All Sunday's post-add DON!! threshold and physical-card Trigger", () => {
    expect(
      buildCardEffects(
        "[On Play] Add up to 1 DON!! card from your DON!! deck and rest it. Then, if you have 6 or more DON!! cards on your field, draw 1 card. [Trigger] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            { action: "addDon", count: { amount: 1, upTo: true }, state: "rested" },
            {
              action: "draw",
              player: "self",
              amount: 1,
              condition: {
                condition: "donFieldCount",
                player: "self",
                comparison: "gte",
                value: 6,
              },
            },
          ],
        },
        {
          trigger: "trigger",
          costs: [{ cost: "returnDon", amount: 2 }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });

  test("keeps Miss.Goldenweek's inclusive Leader gate and physical-card Trigger", () => {
    expect(
      buildCardEffects(
        "[On Play] If your Leader's type includes \"Baroque Works\", up to 1 of your opponent's Characters with a cost of 5 or less cannot attack until the start of your next turn. [Trigger] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "leaderTrait", trait: "Baroque Works", match: "includes" }],
          actions: [
            {
              action: "cannotAttack",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 5 }],
              },
              duration: "untilStartOfNextTurn",
            },
          ],
        },
        {
          trigger: "trigger",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });

  test("keeps Miss.Valentine's inclusive search without a same-name exclusion", () => {
    expect(
      buildCardEffects(
        '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 card with a type including "Baroque Works" and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.',
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
              revealFilters: [{ filter: "trait", value: "Baroque Works", match: "includes" }],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
        {
          trigger: "trigger",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });

  test.each([
    [
      "Miss.MerryChristmas",
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Trigger] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
      { keywords: ["blocker"] },
    ],
  ])("keeps %s's keyword and physical-card Trigger", (_name, text, metadata) => {
    expect(buildCardEffects(text)).toEqual({
      ...metadata,
      effects: [
        {
          trigger: "trigger",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });

  test("keeps Yokozuna's Blocker and optional opponent-attack bounce", () => {
    expect(
      buildCardEffects(
        "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Your Opponent's Attack] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Return up to 1 of your opponent's Characters with a cost of 2 or less to the owner's hand.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onOpponentAttack",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("binds Mr.2's copied base power to the attacking opponent card", () => {
    expect(
      buildCardEffects(
        "[On Your Opponent's Attack] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): This Character's base power becomes the same as the power of your opponent's attacking Leader or Character during this turn. [Trigger] DON!! -1: Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onOpponentAttack",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [
            {
              action: "copyPower",
              target: {
                player: "opponent",
                zones: ["leader", "character"],
                count: { amount: 1 },
              },
              duration: "thisTurn",
              triggerEventAttacker: true,
            },
          ],
          optional: true,
        },
        {
          trigger: "trigger",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });

  test("keeps Mr.13 & Ms.Friday's two distinct Character trash costs", () => {
    expect(
      buildCardEffects(
        '[Activate:Main] You may trash this Character and 1 of your Characters with a type including "Baroque Works": Add up to 1 DON!! card from your DON!! deck and set it as active. [Trigger] Play this card.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            { cost: "trashThisCard" },
            {
              cost: "trashCharacter",
              amount: 1,
              filters: [
                { filter: "excludeSelf" },
                { filter: "trait", value: "Baroque Works", match: "includes" },
              ],
            },
          ],
          actions: [{ action: "addDon", count: { amount: 1, upTo: true }, state: "active" }],
          optional: true,
        },
        {
          trigger: "trigger",
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });
});
