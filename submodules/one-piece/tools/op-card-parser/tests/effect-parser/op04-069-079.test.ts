import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-069 through OP04-081 parser regressions", () => {
  test("binds Mr.2's power copy to the attacker and plays the physical Trigger card", () => {
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

  test("keeps Mr.3's opponent-attack DON!! cost optional and once per turn", () => {
    expect(
      buildCardEffects(
        "[On Your Opponent's Attack] [Once Per Turn] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Give up to 1 of your opponent's Characters -1000 power during this turn.",
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
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
              value: -1000,
              duration: "thisTurn",
            },
          ],
          optional: true,
          oncePerTurn: true,
        },
      ],
    });
  });

  test("keeps Mr.4's battle Blocker and power grant behind its optional DON!! cost", () => {
    expect(
      buildCardEffects(
        "[On Your Opponent's Attack] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): This Character gains [Blocker] and +1000 power during this battle. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onOpponentAttack",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "blocker",
              duration: "thisBattle",
            },
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              value: 1000,
              duration: "thisBattle",
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("keeps Mr.13 & Ms.Friday's two distinct trash costs and physical Trigger play", () => {
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
          actions: [
            {
              action: "addDon",
              count: { amount: 1, upTo: true },
              state: "active",
            },
          ],
          optional: true,
        },
        {
          trigger: "trigger",
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });

  test("keeps Oimo & Kashii's legacy NULL sentinel effectless", () => {
    expect(buildCardEffects("NULL")).toBeUndefined();
  });

  test("keeps Orlumbus's ordered mandatory actions and inclusive Dressrosa target", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] [Once Per Turn] Give up to 1 of your opponent's Characters -4 cost during this turn and trash 2 cards from the top of your deck. Then, K.O. 1 of your [Dressrosa] type Characters.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "modifyCost",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
              value: -4,
              duration: "thisTurn",
            },
            { action: "trashFromDeck", player: "self", amount: 2 },
            {
              action: "ko",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                filters: [{ filter: "trait", value: "Dressrosa", match: "includes" }],
              },
            },
          ],
          oncePerTurn: true,
        },
      ],
    });
  });

  test("keeps Gyats's included-Dressrosa active-attack grant", () => {
    expect(
      buildCardEffects(
        "[On Play] Up to 1 of your [Dressrosa] type Characters can also attack active Characters during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "canAttackActive",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "trait", value: "Dressrosa", match: "includes" }],
              },
              duration: "thisTurn",
            },
          ],
        },
      ],
    });
  });

  test("keeps Cavendish's Leader-rest cost before K.O. and mandatory deck trash", () => {
    expect(
      buildCardEffects(
        "[DON!! x1] This Character can also attack active Characters. [When Attacking] You may rest your Leader: K.O. up to 1 of your opponent's Characters with a cost of 1 or less. Then, trash 2 cards from the top of your deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenAttacking",
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
                filters: [{ filter: "cost", comparison: "lte", value: 1 }],
              },
            },
            { action: "trashFromDeck", player: "self", amount: 2 },
          ],
          optional: true,
        },
      ],
      permanentEffects: [
        {
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "canAttackActive",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });
});
