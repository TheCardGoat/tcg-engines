/**
 * Tests for action parsing: every action type the parser recognises,
 * exercised through the public parseEffect API.
 */
import { describe, expect, test } from "vite-plus/test";
import { parseEffect } from "../../scripts/parseEffect.ts";

// ── Draw / Discard ─────────────────────────────────────────────────────────────

describe("draw", () => {
  test("Draw 1 produces draw action with count 1", () => {
    const [effect] = parseEffect("【Deploy】 Draw 1.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "draw", count: 1 } });
  });

  test("Draw 2 produces draw action with count 2", () => {
    const [effect] = parseEffect("【Deploy】 Draw 2.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "draw", count: 2 } });
  });

  test("Draw 3 produces draw action with count 3", () => {
    const [effect] = parseEffect("【Attack】 Draw 3.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "draw", count: 3 } });
  });

  test("Draw 1 then discard 1 is a single staged drawThenDiscard action", () => {
    const [effect] = parseEffect("【Deploy】Draw 1. Then, discard 1.");
    expect(effect.directives).toMatchObject([
      { action: { action: "drawThenDiscard", drawCount: 1, discardCount: 1 } },
    ]);
  });

  test("Draw 1 with an If-you-do discard remains a single staged drawThenDiscard action", () => {
    const [effect] = parseEffect(
      "【When Linked】If this is an (AEUG) Unit, draw 1. If you do, discard 1.",
      "pilot",
    );
    expect(effect.activation).toMatchObject({
      timing: ["whenLinked"],
      conditions: [{ type: "linkedUnitHasTrait", trait: "aeug" }],
    });
    expect(effect.directives).toEqual([
      { action: { action: "drawThenDiscard", drawCount: 1, discardCount: 1 } },
    ]);
  });

  test("When Linked accepts alternative linked-Unit traits", () => {
    const [effect] = parseEffect(
      "【When Linked】If this is an (Orb)/(Triple Ship Alliance) Unit, draw 1.",
      "pilot",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["whenLinked"],
        conditions: [{ type: "linkedUnitHasTrait", trait: ["orb", "triple ship alliance"] }],
      },
      directives: [{ action: { action: "draw", count: 1 } }],
    });
  });

  test("lifts a leading card-zone condition while preserving a draw-then-discard action", () => {
    const [effect] = parseEffect(
      "【Deploy】If there are 4 or more (Gjallarhorn) cards in your trash, draw 2. If you do, discard 2.",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 4,
            hasTrait: "gjallarhorn",
          },
        ],
      },
      directives: [{ action: { action: "drawThenDiscard", drawCount: 2, discardCount: 2 } }],
    });
  });

  test("keeps a Unit-count condition around a draw-then-discard action", () => {
    const [effect] = parseEffect(
      "【Deploy】If you have another (Triple Ship Alliance) Unit in play, draw 1. Then, discard 1.",
    );

    expect(effect).toMatchObject({
      activation: { timing: ["deploy"] },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "triple ship alliance",
          },
          thenDirectives: [
            { action: { action: "drawThenDiscard", drawCount: 1, discardCount: 1 } },
          ],
        },
      ],
    });
  });

  test("lifts a leading triggered Unit-count condition for an EX Resource placement", () => {
    const [effect] = parseEffect(
      "【Destroyed】During your turn, if you have another (Dawn of Fold) Unit in play, place 1 EX Resource.",
    );

    expect(effect).toMatchObject({
      activation: {
        timing: ["destroyed"],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "dawn of fold",
          },
        ],
      },
      directives: [{ action: { action: "placeExResource", state: "active" } }],
    });
  });

  test("lifts a leading triggered another-Unit condition for token deployment", () => {
    const [effect] = parseEffect(
      "【Destroyed】If another friendly (League Militaire) Unit is in play, deploy 1 [Parts]((League Militaire)·AP1·HP1) Unit token.",
    );

    expect(effect).toMatchObject({
      activation: {
        timing: ["destroyed"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "league militaire",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: { name: "Parts", traits: ["league militaire"], ap: 1, hp: 1 },
          },
        },
      ],
    });
  });

  test("keeps a turn-and-trait token deployment after a preceding action conditional", () => {
    const [effect] = parseEffect(
      "【Deploy】Add 1 of your Shields to your hand. Then, during your turn, if a friendly (League Militaire) Unit is in play, deploy 1 [Parts]((League Militaire)·AP1·HP1) Unit token.",
      "base",
    );

    expect(effect.directives).toMatchObject([
      { action: { action: "addShieldToHand", count: 1 } },
      {
        condition: {
          type: "and",
          conditions: [
            { type: "isTurn", whose: "friendly" },
            {
              type: "unitCount",
              owner: "friendly",
              comparison: "gte",
              count: 1,
              hasTrait: "league militaire",
            },
          ],
        },
        thenDirectives: [
          {
            action: {
              action: "deployToken",
              token: { name: "Parts", traits: ["league militaire"], ap: 1, hp: 1 },
            },
          },
        ],
      },
    ]);
  });
});

describe("opponent-turn token constants", () => {
  test("parses an all-friendly token AP modifier", () => {
    const [effect] = parseEffect("All friendly Unit tokens get AP+1 during your opponent's turn.");

    expect(effect).toEqual({
      type: "constant",
      activation: { conditions: [{ type: "isTurn", whose: "opponent" }] },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: { owner: "friendly", cardType: "unit", count: "all", isToken: true },
          },
        },
      ],
      sourceText: "All friendly Unit tokens get AP+1 during your opponent's turn.",
    });
  });
});

describe("linked turn-scoped self modifiers", () => {
  test("keeps a trailing controller-turn condition on a During Link AP bonus", () => {
    const [effect] = parseEffect("【During Link】This Unit gets AP+2 during your turn.");

    expect(effect).toMatchObject({
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }, { type: "isTurn", whose: "friendly" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
    });
  });
});

describe("qualified discards", () => {
  test("keeps printed color, trait, type, and Hand-zone restrictions", () => {
    const [effect] = parseEffect(
      "【Deploy】You may discard 1 green (Earth Federation) Unit card. If you do, place 1 EX Resource.",
    );
    expect(effect.directives[0]).toMatchObject({
      optional: true,
      action: {
        action: "discard",
        count: 1,
        filter: {
          owner: "friendly",
          zone: "hand",
          cardType: "unit",
          count: 1,
          attributeFilters: [
            { attribute: "color", comparison: "eq", value: "green" },
            { attribute: "trait", comparison: "includes", value: "earth federation" },
          ],
        },
      },
    });
  });

  test("keeps a later Lv.-qualified Then branch conditional", () => {
    const [effect] = parseEffect(
      "【Deploy】Place 1 EX Resource. Then, if you are Lv.7 or higher, draw 1.",
    );
    expect(effect.directives).toEqual([
      { action: { action: "placeExResource", state: "active" } },
      {
        condition: { type: "playerLevel", comparison: "gte", value: 7 },
        thenDirectives: [{ action: { action: "draw", count: 1 } }],
      },
    ]);
  });
});

describe("staged Shield follow-ups", () => {
  test("queues a later target choice after adding a Shield to hand", () => {
    const [effect] = parseEffect(
      "【Deploy】Add 1 of your Shields to your hand. Then, choose 1 rested enemy Unit that is Lv.4 or lower. Deal 1 damage to it.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "addShieldToHand", count: 1 },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "dealDamage",
                  amount: 1,
                  target: {
                    owner: "opponent",
                    cardType: "unit",
                    state: "rested",
                    attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
                    count: 1,
                  },
                },
              },
            ],
            sourceText:
              "Then, choose 1 rested enemy Unit that is Lv.4 or lower. Deal 1 damage to it.",
          },
        },
      },
    ]);
  });
});

describe("conditional target broadening", () => {
  test("uses the larger rest range only while the printed trait Link Unit is in play", () => {
    const [effect] = parseEffect(
      "【Main】Choose 1 enemy Unit with 3 or less HP. Rest it. If a friendly (Jupitris) Link Unit is in play, choose 1 to 2 enemy Units with 3 or less HP instead.",
      "command",
    );

    expect(effect.directives).toEqual([
      {
        condition: {
          type: "unitCount",
          owner: "friendly",
          comparison: "gte",
          count: 1,
          hasTrait: "jupitris",
          isLinkUnit: true,
        },
        thenDirectives: [
          {
            action: {
              action: "rest",
              target: {
                owner: "opponent",
                cardType: "unit",
                count: { min: 1, max: 2 },
                attributeFilters: [{ attribute: "hp", comparison: "lte", value: 3 }],
              },
            },
          },
        ],
        elseDirectives: [
          {
            action: {
              action: "rest",
              target: {
                owner: "opponent",
                cardType: "unit",
                count: 1,
                attributeFilters: [{ attribute: "hp", comparison: "lte", value: 3 }],
              },
            },
          },
        ],
      },
    ]);
  });

  test("broadens an active enemy destruction target at the printed trash threshold", () => {
    const [effect] = parseEffect(
      "【Action】Choose 1 active enemy Unit that is Lv.2 or lower. Destroy it. If there are 10 or more cards in your trash, choose 1 active enemy Unit that is Lv.4 or lower instead.",
      "command",
    );

    expect(effect.directives).toEqual([
      {
        condition: {
          type: "cardInZone",
          owner: "friendly",
          zone: "trash",
          comparison: "gte",
          count: 10,
        },
        thenDirectives: [
          {
            action: {
              action: "destroy",
              target: {
                owner: "opponent",
                cardType: "unit",
                state: "active",
                count: 1,
                attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
              },
            },
          },
        ],
        elseDirectives: [
          {
            action: {
              action: "destroy",
              target: {
                owner: "opponent",
                cardType: "unit",
                state: "active",
                count: 1,
                attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
              },
            },
          },
        ],
      },
    ]);
  });
});

describe("chosen-card stat references", () => {
  test("keeps the rested friendly Unit as the level reference for later damage", () => {
    const [effect] = parseEffect(
      "【Main】Choose 1 active friendly Unit. Rest it. If you do, choose 1 enemy Unit whose Lv. is equal to or lower than the Unit rested with this ability. Deal 3 damage to it.",
      "command",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "restThenDamageByChosenUnitLevel",
          amount: 3,
          referenceTarget: {
            owner: "friendly",
            cardType: "unit",
            state: "active",
            count: 1,
          },
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ]);
  });

  test("keeps an optional traited rest and all-enemy damage as one staged action", () => {
    const [effect] = parseEffect(
      "【When Paired】You may choose 1 of your other active (MF) Units. Rest it. If you do, deal 2 damage to all enemy Units whose Lv. is equal to or lower than that Unit.",
      "unit",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "restThenDamageByChosenUnitLevel",
          amount: 2,
          referenceTarget: {
            owner: "friendly",
            cardType: "unit",
            excludeSource: true,
            state: "active",
            count: 1,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "mf" }],
          },
          target: { owner: "opponent", cardType: "unit", count: "all" },
        },
        optional: true,
      },
    ]);
  });
});

describe("paired Pilot qualifiers", () => {
  test("broadens the same chosen Unit's battle-damage prevention at the printed level", () => {
    const [effect] = parseEffect(
      "【Action】Choose 1 friendly Unit paired with an (X-Rounder) Pilot. It can't receive battle damage from enemy Units with 2 or less AP during this battle. If you are Lv.7 or higher, it can't receive battle damage from enemy Units with 5 or less AP instead.",
      "command",
    );

    const target = {
      owner: "friendly",
      cardType: "unit",
      count: 1,
      attributeFilters: [
        { attribute: "pairedPilotTrait", comparison: "includes", value: "x-rounder" },
      ],
    };
    expect(effect.directives).toEqual([
      {
        action: {
          action: "preventDamage",
          damageType: "battle",
          duration: "thisBattle",
          target,
          unitFilter: {
            owner: "opponent",
            cardType: "unit",
            attributeFilters: [{ attribute: "ap", comparison: "lte", value: 2 }],
          },
        },
      },
      {
        condition: { type: "playerLevel", comparison: "gte", value: 7 },
        thenDirectives: [
          {
            action: {
              action: "preventDamage",
              damageType: "battle",
              duration: "thisBattle",
              target,
              unitFilter: {
                owner: "opponent",
                cardType: "unit",
                attributeFilters: [{ attribute: "ap", comparison: "lte", value: 5 }],
              },
            },
          },
        ],
      },
    ]);
  });
});

describe("damage-dependent draws", () => {
  test("draws only when the damage from the chosen-target action destroys the Unit", () => {
    const [effect] = parseEffect(
      "【When Paired】Choose 1 rested enemy Unit. Deal 1 damage to it. When this effect destroys an enemy Unit, draw 1.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "dealDamageThenDrawIfDestroyed",
          amount: 1,
          target: { owner: "opponent", cardType: "unit", state: "rested", count: 1 },
          drawCount: 1,
        },
      },
    ]);
  });
});

describe("self stat modifiers by card count", () => {
  test("scales this Unit's AP by each rested friendly trait Unit", () => {
    const [effect] = parseEffect(
      "【During Link】This Unit gets AP+2 for each of your rested (CB) Units.",
      "unit",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "statModifierByCount",
          countFilter: {
            owner: "friendly",
            cardType: "unit",
            state: "rested",
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "cb" }],
          },
          stat: "ap",
          amountPerMatch: 2,
          duration: "permanent",
          target: { owner: "self", cardType: "unit" },
        },
      },
    ]);
  });
});

describe("paired Pilot attack permissions", () => {
  test("grants a this-turn active-enemy attack target to the chosen paired Unit", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 of your Units paired with a (Super Soldier) Pilot. During this turn, it may choose an active enemy Unit that is Lv.4 or lower as its attack target.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "chooseAttackTarget",
          unit: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            attributeFilters: [
              { attribute: "pairedPilotTrait", comparison: "includes", value: "super soldier" },
            ],
          },
          attackTarget: {
            owner: "opponent",
            cardType: "unit",
            state: "active",
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
          },
          duration: "thisTurn",
        },
      },
    ]);
  });
});

describe("staged trash recovery", () => {
  test("keeps recovery and a dependent discard atomic so the recovered card is eligible", () => {
    const [effect] = parseEffect(
      "【Deploy】You may choose 1 (X-Rounder) card from your trash and add it to your hand. If you do, discard 1.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "addFromTrashThenDiscard",
          target: {
            owner: "friendly",
            zone: "trash",
            count: 1,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "x-rounder" }],
          },
          discardCount: 1,
        },
        optional: true,
      },
    ]);
  });

  test("queues a mandatory discard after a chosen trash recovery", () => {
    const [effect] = parseEffect(
      "【Destroyed】Choose 1 green (Earth Federation) Pilot card from your trash. Add it to your hand. If you do, discard 1.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "resolveThenQueue",
          first: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "pilot",
              zone: "trash",
              count: 1,
              attributeFilters: [
                { attribute: "color", comparison: "eq", value: "green" },
                { attribute: "trait", comparison: "includes", value: "earth federation" },
              ],
            },
          },
          followUp: {
            type: "triggered",
            activation: {},
            directives: [{ action: { action: "discard", count: 1 } }],
            sourceText: "Then, discard 1.",
          },
        },
      },
    ]);
  });

  test("queues a discard after returning a paired Pilot to the updated hand", () => {
    const [effect] = parseEffect(
      "【During Link】【Destroyed】Return this Unit's paired Pilot to its owner's hand. Then, discard 1.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "returnPairedPilotToHand" },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [{ action: { action: "discard", count: 1 } }],
            sourceText: "Then, discard 1.",
          },
        },
      },
    ]);
  });

  test("queues a follow-up target after an optional trash exile", () => {
    const [effect] = parseEffect(
      "【Attack】You may choose 1 (Vagan) card from your trash. Exile it from the game. If you do, choose 1 of your (Vagan) Units. It gets AP+2 during this turn.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "resolveThenQueue",
          first: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "vagan" }],
            },
          },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "statModifier",
                  stat: "ap",
                  amount: 2,
                  duration: "thisTurn",
                  target: {
                    owner: "friendly",
                    cardType: "unit",
                    count: 1,
                    attributeFilters: [
                      { attribute: "trait", comparison: "includes", value: "vagan" },
                    ],
                  },
                },
              },
            ],
            sourceText: "If you do, choose 1 of your (Vagan) Units. It gets AP+2 during this turn.",
          },
        },
        optional: true,
      },
    ]);
  });

  test("queues a dependent trash retrieval after an optional trash exile", () => {
    const [effect] = parseEffect(
      "【Deploy】You may choose 2 (MF) Unit cards from your trash. Exile them from the game. If you do, choose 1 (Special Move) Command card from your trash. Add it to your hand.",
    );
    expect(effect.directives).toMatchObject([
      {
        optional: true,
        action: {
          action: "resolveThenQueue",
          first: {
            action: "exile",
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "trash",
              count: 2,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "mf" }],
            },
          },
          followUp: {
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "addFromTrash",
                  target: {
                    owner: "friendly",
                    cardType: "command",
                    zone: "trash",
                    count: 1,
                    attributeFilters: [
                      { attribute: "trait", comparison: "includes", value: "special move" },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    ]);
  });

  test("queues enemy damage after resting the required active friendly Units", () => {
    const [effect] = parseEffect(
      "【Main】Choose 2 of your active Units. Rest them. If you do, choose 1 enemy Unit. Deal 3 damage to it.",
      "command",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "resolveThenQueue",
          first: {
            action: "rest",
            target: { owner: "friendly", cardType: "unit", state: "active", count: 2 },
          },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "dealDamage",
                  amount: 3,
                  target: { owner: "opponent", cardType: "unit", count: 1 },
                },
              },
            ],
            sourceText: "If you do, choose 1 enemy Unit. Deal 3 damage to it.",
          },
        },
      },
    ]);
  });
});

describe("mixed-owner target groups", () => {
  test("keeps a friendly Base and an enemy low-HP Unit as distinct rest targets", () => {
    const [effect] = parseEffect(
      "【Action】Choose 1 friendly Base and 1 enemy Unit with 3 or less HP. Rest them.",
      "command",
    );

    expect(effect.directives).toEqual([
      { action: { action: "rest", target: { owner: "friendly", cardType: "base", count: 1 } } },
      {
        action: {
          action: "rest",
          target: {
            owner: "opponent",
            cardType: "unit",
            count: 1,
            attributeFilters: [{ attribute: "hp", comparison: "lte", value: 3 }],
          },
        },
      },
    ]);
  });

  test("keeps both target filters when the enemy Unit has a level restriction", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 of your active (League Militaire) Units and 1 enemy Unit that is Lv.3 or lower. Rest them.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "rest",
          target: {
            owner: "friendly",
            cardType: "unit",
            state: "active",
            count: 1,
            attributeFilters: [
              { attribute: "trait", comparison: "includes", value: "league militaire" },
            ],
          },
        },
      },
      {
        action: {
          action: "rest",
          target: {
            owner: "opponent",
            cardType: "unit",
            state: "active",
            count: 1,
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 3 }],
          },
        },
      },
    ]);
  });

  test("keeps a friendly Blocker and an enemy level-limited Unit as separate rest targets", () => {
    const [effect] = parseEffect(
      "【When Paired】Choose 1 active friendly Unit with <Blocker> and 1 enemy Unit that is Lv.4 or lower. Rest them.",
      "pilot",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "rest",
          target: {
            owner: "friendly",
            cardType: "unit",
            state: "active",
            hasKeyword: "Blocker",
            count: 1,
          },
        },
      },
      {
        action: {
          action: "rest",
          target: {
            owner: "opponent",
            cardType: "unit",
            state: "active",
            count: 1,
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
          },
        },
      },
    ]);
  });

  test("keeps each target group and optionality when resting a friendly and enemy Unit", () => {
    const [effect] = parseEffect(
      "【Deploy】You may choose 1 active friendly blue (G Generation) Unit and 1 enemy Unit. Rest them.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "rest",
          target: {
            owner: "friendly",
            cardType: "unit",
            state: "active",
            attributeFilters: [
              { attribute: "color", comparison: "eq", value: "blue" },
              { attribute: "trait", comparison: "includes", value: "g generation" },
            ],
            count: 1,
          },
        },
        optional: true,
      },
      {
        action: {
          action: "rest",
          target: { owner: "opponent", cardType: "unit", state: "active", count: 1 },
        },
        sharesTargetChoiceWithPrevious: true,
      },
    ]);
  });

  test("keeps those groups after a preceding Shield return", () => {
    const [effect] = parseEffect(
      "【Deploy】Add 1 of your Shields to your hand. Then, you may choose 1 active friendly blue (G Generation) Unit and 1 enemy Unit. Rest them.",
    );

    expect(effect.directives).toMatchObject([
      { action: { action: "addShieldToHand", count: 1 } },
      {
        optional: true,
        action: {
          action: "rest",
          target: expect.objectContaining({ owner: "friendly", cardType: "unit", state: "active" }),
        },
      },
      {
        sharesTargetChoiceWithPrevious: true,
        action: {
          action: "rest",
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ]);
  });
});

describe("opponent-controlled optional draws", () => {
  test("queues the enemy player's optional draw before the controller's conditional draw", () => {
    const [effect] = parseEffect(
      "【Attack】【Once per Turn】Choose 1 enemy player. They may draw 1. If they draw with this effect, draw 1.",
      "pilot",
    );

    expect(effect).toMatchObject({
      type: "triggered",
      activation: { timing: ["attack"], restrictions: [{ type: "oncePerTurn" }] },
      directives: [
        {
          action: {
            action: "queueEffectForOpponent",
            effect: {
              directives: [
                { optional: true, action: { action: "draw", count: 1 } },
                {
                  dependsOnPrevious: true,
                  action: {
                    action: "queueEffectForOpponent",
                    effect: { directives: [{ action: { action: "draw", count: 1 } }] },
                  },
                },
              ],
            },
          },
        },
      ],
    });
  });
});

describe("command preconditions", () => {
  test("lifts a leading Link-Unit requirement before an enemy choice into command activation", () => {
    const [effect] = parseEffect(
      "【Main】/【Action】If a friendly (Teiwaz) Link Unit is in play, choose 1 enemy Unit with 2 or less AP. Destroy it.",
      "command",
    );

    expect(effect).toMatchObject({
      type: "command",
      activation: {
        timing: ["main", "action"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "teiwaz",
            isLinkUnit: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 2 }],
            },
          },
        },
      ],
    });
  });
});

describe("standalone damage prevention", () => {
  test("splits a Base's continuous enemy-effect-damage prevention from its Deploy text", () => {
    const effects = parseEffect(
      "【Deploy】Add 1 of your Shields to your hand.\nThis Base can’t receive enemy effect damage.",
      "base",
    );

    expect(effects).toEqual([
      {
        type: "triggered",
        activation: { timing: ["deploy"] },
        directives: [{ action: { action: "addShieldToHand", count: 1 } }],
        sourceText: "【Deploy】Add 1 of your Shields to your hand.",
      },
      {
        type: "constant",
        activation: {},
        directives: [
          {
            action: {
              action: "preventDamage",
              target: { owner: "self", cardType: "base" },
              damageType: "effect",
              source: "enemy",
              duration: "permanent",
            },
          },
        ],
        sourceText: "This Base can’t receive enemy effect damage.",
      },
    ]);
  });
});

describe("damaged level-qualified keyword grants", () => {
  test("keeps the damaged condition and self level threshold on a keyword grant", () => {
    const [effect] = parseEffect(
      "【Attack】If this Unit is damaged and Lv.5 or lower, it gains <High-Maneuver> during this battle. (This Unit can't be blocked.)",
      "pilot",
    );

    expect(effect.directives).toEqual([
      {
        condition: { type: "selfIsDamaged" },
        thenDirectives: [
          {
            action: {
              action: "grantKeyword",
              keyword: "HighManeuver",
              duration: "thisBattle",
              target: {
                owner: "self",
                cardType: "unit",
                attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
              },
            },
          },
        ],
      },
    ]);
  });
});

describe("mixed-owner simultaneous damage", () => {
  test("keeps one of your Units and one enemy Unit as separate required groups", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "dealDamage",
          amount: 1,
          target: { owner: "friendly", cardType: "unit", count: 1 },
        },
      },
      {
        action: {
          action: "dealDamage",
          amount: 1,
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ]);
  });

  test("keeps one friendly trait target and one enemy target as separate required groups", () => {
    const [effect] = parseEffect(
      "【Main】/【Action】Choose 1 friendly (Vagan) Unit and 1 enemy Unit. Deal 2 damage to them.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "dealDamage",
          amount: 2,
          target: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "vagan" }],
          },
        },
      },
      {
        action: {
          action: "dealDamage",
          amount: 2,
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ]);
  });
});

describe("multi-output printed constructions", () => {
  test("deploys both rested token specifications joined by and", () => {
    const [effect] = parseEffect(
      "【Main】Deploy 1 rested [Alpha]((Clan)·AP3·HP2) Unit token and 1 rested [Beta]((Clan)·AP2·HP3) Unit token.",
    );

    expect(effect.directives).toHaveLength(2);
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "deployToken",
        token: { name: "Alpha", ap: 3, hp: 2, deployState: "rested" },
      },
    });
    expect(effect.directives[1]).toMatchObject({
      action: {
        action: "deployToken",
        token: { name: "Beta", ap: 2, hp: 3, deployState: "rested" },
      },
    });
  });

  test("keeps optional enemy damage and dependent self damage", () => {
    const [effect] = parseEffect(
      "【During Pair】【Attack】You may choose 1 enemy Unit. Deal 2 damage to it and this Unit.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "dealDamage",
          amount: 2,
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
        optional: true,
      },
      {
        action: {
          action: "dealDamage",
          amount: 2,
          target: { owner: "self", cardType: "unit" },
        },
        dependsOnPrevious: true,
      },
    ]);
  });

  test("counts named trash cards for a turn stat reduction", () => {
    const [effect] = parseEffect(
      '【Deploy】Choose 1 enemy Unit that is Lv.6 or lower. During this turn, reduce its AP by an amount equal to the number of Unit cards with "Gundam Virtue" in their card names in your trash.',
    );

    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "statModifierByCount",
        stat: "ap",
        amountPerMatch: -1,
        duration: "thisTurn",
        countFilter: {
          owner: "friendly",
          cardType: "unit",
          zone: "trash",
          attributeFilters: [{ attribute: "name", comparison: "includes", value: "Gundam Virtue" }],
        },
      },
    });
  });

  test("counts trait-qualified trash cards for a signed turn stat modifier", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 enemy Unit. For each (AEUG) Unit card in your trash, it gets AP-1 during this turn.",
    );

    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "statModifierByCount",
        stat: "ap",
        amountPerMatch: -1,
        duration: "thisTurn",
        countFilter: {
          owner: "friendly",
          cardType: "unit",
          zone: "trash",
          attributeFilters: [{ attribute: "trait", comparison: "includes", value: "aeug" }],
        },
        target: { owner: "opponent", cardType: "unit", count: 1 },
      },
    });
  });

  test("keeps the optional named Unit keyword follow-up after resting an enemy", () => {
    const [effect] = parseEffect(
      '【Main】/【Action】Choose 1 enemy Unit with 4 or less HP. Rest it. Then, you may choose 1 of your Units with "Shining Gundam" in its card name. It gets <First Strike> during this turn.',
    );

    expect(effect.directives).toHaveLength(2);
    expect(effect.directives[1]).toMatchObject({
      action: {
        action: "grantKeyword",
        keyword: "FirstStrike",
        duration: "thisTurn",
        target: {
          owner: "friendly",
          cardType: "unit",
          count: { min: 0, max: 1 },
          attributeFilters: [
            { attribute: "name", comparison: "includes", value: "Shining Gundam" },
          ],
        },
      },
    });
  });
});

describe("discard", () => {
  test("Discard 1 produces discard action with count 1", () => {
    const [effect] = parseEffect("【Main】②：Discard 1.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "discard", count: 1 } });
  });

  test("Discard 2 produces discard action with count 2", () => {
    const [effect] = parseEffect("【Main】②：Discard 2.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "discard", count: 2 } });
  });
});

// ── Self actions ───────────────────────────────────────────────────────────────

describe("addSelfToHand", () => {
  test("Add this card to your hand produces addSelfToHand", () => {
    const [effect] = parseEffect("【Burst】 Add this card to your hand.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "addSelfToHand" } });
  });
});

describe("deploySelf", () => {
  test("Deploy this card produces deploySelf", () => {
    const [effect] = parseEffect("【Burst】 Deploy this card.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "deploySelf" } });
  });

  test("conditionally deploys a Burst Pilot as a Unit with printed AP and HP", () => {
    const [effect] = parseEffect(
      "【Burst】Add this card to your hand. If there are 3 or more (MF) cards in your trash, you may deploy it as an (AP3・HP3) Unit instead. (Don't treat it as a Pilot.)",
      "pilot",
    );

    expect(effect.directives).toEqual([
      { action: { action: "addSelfToHand" } },
      {
        condition: {
          type: "cardInZone",
          owner: "friendly",
          zone: "trash",
          comparison: "gte",
          count: 3,
          hasTrait: "mf",
        },
        thenDirectives: [
          {
            action: { action: "deploySelfAsUnit", ap: 3, hp: 3 },
            optional: true,
          },
        ],
      },
    ]);
  });
});

describe("paired-card routing", () => {
  test("returns the paired card to the top of its owner's deck", () => {
    const [effect] = parseEffect(
      "【During Link】【Destroyed】You may return the card paired with this Unit to the top of its owner's deck.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: { action: "returnPairedCardToDeck", position: "top" },
      optional: true,
    });
  });

  test("pairs a resolved Pilot Command from trash with a matching Unit", () => {
    const [effect] = parseEffect(
      "【Main】After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "pairPilot",
          target: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "mf" }],
          },
        },
        optional: true,
      },
    ]);
  });

  test("retains a colored paired Pilot qualifier behind an attack condition", () => {
    const [effect] = parseEffect(
      "【During Link】【Attack】If you are attacking an enemy Unit, you may return a blue Pilot paired with this Unit to its owner's hand.",
    );
    expect(effect.activation).toEqual({
      timing: ["attack"],
      conditions: [
        { type: "duringLink" },
        { type: "isAttackingUnit" },
        { type: "selfPairedPilotHasColor", color: "blue" },
      ],
    });
    expect(effect.directives).toEqual([
      {
        condition: { type: "isAttackingUnit" },
        thenDirectives: [
          { action: { action: "returnPairedPilotToHand", color: "blue" }, optional: true },
        ],
      },
    ]);
  });
});

describe("optional resource payment", () => {
  test("preserves the payment dependency before the follow-up", () => {
    const [effect] = parseEffect("【Attack】You may pay ①. If you do, draw 1. Then, discard 1.");
    expect(effect.directives).toEqual([
      { action: { action: "payResources", count: 1 }, optional: true },
      {
        action: { action: "drawThenDiscard", drawCount: 1, discardCount: 1 },
        dependsOnPrevious: true,
      },
    ]);
  });
});

describe("optional selected trash deployment", () => {
  test("keeps the optionality when a chosen trash Unit is paid for and deployed", () => {
    const [effect] = parseEffect(
      "【When Linked】You may choose 1 (Vagan) Unit card that is Lv.2 or lower from your trash. Pay its cost to deploy it.",
      "pilot",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "deployFromTrash",
          payCost: true,
          target: {
            owner: "friendly",
            cardType: "unit",
            zone: "trash",
            count: 1,
            attributeFilters: [
              { attribute: "level", comparison: "lte", value: 2 },
              { attribute: "trait", comparison: "includes", value: "vagan" },
            ],
          },
        },
        optional: true,
      },
    ]);
  });
});

describe("self Base actions", () => {
  test("rests this Base before a dependent follow-up", () => {
    const [effect] = parseEffect(
      "During your turn, when one of your friendly (Tekkadan)/(Teiwaz) Units receives effect damage, you may rest this Base. If you do, place the top card of your deck into your trash.",
    );
    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "rest",
          target: { owner: "self", cardType: "base", state: "active", count: 1 },
        },
        optional: true,
      },
      { action: { action: "millDeck", count: 1 }, dependsOnPrevious: true },
    ]);
  });
});

describe("rest-target activation costs", () => {
  test("keeps resource and filtered rest costs out of the effect directives", () => {
    const [effect] = parseEffect(
      "【Activate･Main】【Once per Turn】①, rest 1 friendly (CB) Unit：Choose 1 enemy Unit that is Lv.5 or lower. Deal 1 damage to it.",
    );
    expect(effect.cost).toEqual({
      payResources: 1,
      restTarget: {
        owner: "friendly",
        cardType: "unit",
        state: "active",
        count: 1,
        attributeFilters: [{ attribute: "trait", comparison: "includes", value: "cb" }],
      },
    });
    expect(effect.directives).toEqual([
      {
        action: {
          action: "dealDamage",
          amount: 1,
          target: {
            owner: "opponent",
            cardType: "unit",
            count: 1,
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
          },
        },
      },
    ]);
  });
});

describe("exile-from-trash activation costs", () => {
  test("preserves the filtered exile cost before the selected effect", () => {
    const [effect] = parseEffect(
      "【Activate･Main】【Once per Turn】Exile 1 Command card from your trash：Choose 1 enemy Unit. It gets AP-1 during this turn.",
    );
    expect(effect.cost).toEqual({
      exileFromTrash: { owner: "friendly", zone: "trash", cardType: "command", count: 1 },
    });
    expect(effect.directives).toEqual([
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: -1,
          duration: "thisTurn",
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ]);
  });

  test("recognizes the optional printed 'from the game' wording as part of the exile cost", () => {
    const [effect] = parseEffect(
      "【Activate･Main】【Once per Turn】Exile 2 Command cards from your trash from the game：Choose 1 damaged enemy Unit that is Lv.7 or lower. Rest it. It won't be set as active during the start phase of your opponent's next turn.",
    );

    expect(effect.cost).toEqual({
      exileFromTrash: { owner: "friendly", zone: "trash", cardType: "command", count: 2 },
    });
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "rest",
        target: { owner: "opponent", cardType: "unit", state: "damaged", count: 1 },
      },
    });
    expect(effect.directives[1]).toMatchObject({
      action: { action: "preventActive" },
      dependsOnPrevious: true,
      sharesTargetChoiceWithPrevious: true,
    });
  });

  test("preserves a trait-filtered generic card exile cost", () => {
    const [effect] = parseEffect(
      "【Activate･Main】【Once per Turn】Exile 3 (Titans) cards from your trash：This Unit gains <Breach 4> during this turn.",
    );

    expect(effect.cost).toEqual({
      exileFromTrash: {
        owner: "friendly",
        zone: "trash",
        count: 3,
        attributeFilters: [{ attribute: "trait", comparison: "includes", value: "titans" }],
      },
    });
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "grantKeyword",
        target: { owner: "self", cardType: "unit" },
      },
    });
  });

  test("preserves a color-filtered generic card exile cost", () => {
    const [effect] = parseEffect(
      "【During Link】【Activate･Main】Exile 3 blue cards from your trash：Set this Unit as active.",
    );

    expect(effect.cost).toEqual({
      exileFromTrash: {
        owner: "friendly",
        zone: "trash",
        count: 3,
        attributeFilters: [{ attribute: "color", comparison: "eq", value: "blue" }],
      },
    });
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "setActive",
        target: { owner: "self", cardType: "unit" },
      },
    });
  });
});

describe("enemy-player hand-count conditions", () => {
  test("keeps the conditional self modifier separate from its enemy-player gate", () => {
    const [effect] = parseEffect(
      "【Attack】If an enemy player has 6 or more cards in their hand, this Unit gets AP+2 during this turn.",
    );
    expect(effect.activation.conditions).toEqual([
      { type: "handCount", owner: "opponent", comparison: "gte", count: 6 },
    ]);
    expect(effect.directives).toEqual([
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: 2,
          duration: "thisTurn",
          target: { owner: "self", cardType: "unit" },
        },
      },
    ]);
  });

  test("keeps an activated set-active sequence behind its enemy-player hand-count gate", () => {
    const [effect] = parseEffect(
      "【Activate･Main】【Once per Turn】If your opponent has 8 or more cards in their hand, set this Unit as active. It can't attack during this turn.",
    );

    expect(effect.activation).toEqual({
      timing: ["activate:main"],
      conditions: [{ type: "handCount", owner: "opponent", comparison: "gte", count: 8 }],
      restrictions: [{ type: "oncePerTurn" }],
    });
    expect(effect.directives).toEqual([
      { action: { action: "setActive", target: { owner: "self", cardType: "unit" } } },
      {
        action: {
          action: "cantAttack",
          duration: "thisTurn",
          target: { owner: "self" },
        },
      },
    ]);
  });
});

describe("Support-use triggers", () => {
  test("preserves the paired-Pilot and supported-Unit gates", () => {
    const [effect] = parseEffect(
      "【During Pair･(Coordinator) Pilot】【Once per Turn】When you use this Unit's <Support> to increase a (ZAFT) Unit's AP, set this Unit as active.",
    );

    expect(effect).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["onSupportUsed"],
        conditions: [
          { type: "duringPair" },
          { type: "selfPairedPilotHasTrait", trait: "coordinator" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "zaft" }],
            },
          },
        ],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        { action: { action: "setActive", target: { owner: "self", cardType: "unit" } } },
      ],
    });
  });
});

describe("ready-and-restrict follow-ups", () => {
  test("keeps two filtered trash choices distinct before readying the source Unit", () => {
    const [effect] = parseEffect(
      "【Activate･Main】Choose 1 (Superpower Bloc) card and 1 (UN) card from your trash. Exile them from the game. If you do, set this Unit as active. It can't attack during this turn.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "exile",
          target: {
            owner: "friendly",
            zone: "trash",
            count: 1,
            attributeFilters: [
              { attribute: "trait", comparison: "includes", value: "superpower bloc" },
            ],
          },
        },
      },
      {
        action: {
          action: "exile",
          target: {
            owner: "friendly",
            zone: "trash",
            count: 1,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "un" }],
          },
        },
        dependsOnPrevious: true,
        sharesTargetChoiceWithPrevious: true,
      },
      {
        action: {
          action: "setActive",
          target: { owner: "self", cardType: "unit" },
        },
        dependsOnPrevious: true,
      },
      {
        action: {
          action: "cantAttack",
          duration: "thisTurn",
          target: { owner: "self", cardType: "unit" },
        },
        dependsOnPrevious: true,
      },
    ]);
  });

  test("reuses a newly active selected Unit without retaining its rested filter", () => {
    const [effect] = parseEffect(
      "【Activate･Main】【Once per Turn】①：Choose 1 of your rested white Units with <Blocker>. Set it as active. It can't attack during this turn.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "setActive",
          target: {
            owner: "friendly",
            cardType: "unit",
            state: "rested",
            hasKeyword: "Blocker",
            count: 1,
            attributeFilters: [{ attribute: "color", comparison: "eq", value: "white" }],
          },
        },
      },
      {
        action: {
          action: "cantAttack",
          duration: "thisTurn",
          target: {
            owner: "friendly",
            cardType: "unit",
            hasKeyword: "Blocker",
            count: 1,
            attributeFilters: [{ attribute: "color", comparison: "eq", value: "white" }],
          },
        },
        dependsOnPrevious: true,
        sharesTargetChoiceWithPrevious: true,
      },
    ]);
  });
});

describe("costed activated conditions", () => {
  test("keeps an after-cost Base condition in the resolution branch", () => {
    const [effect] = parseEffect(
      "【Activate･Main】Rest this Base：If a friendly (Academy) Unit is in play, choose 1 enemy Unit. It gets AP-1 during this turn.",
    );

    expect(effect).toMatchObject({
      type: "activated",
      activation: {
        timing: ["activate:main"],
      },
      cost: { restSelf: true },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "academy",
          },
          thenDirectives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: -1,
                duration: "thisTurn",
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
        },
      ],
    });
  });
});
describe("replacement target thresholds", () => {
  test("uses the Link-Unit threshold instead of the ordinary HP threshold", () => {
    const [effect] = parseEffect(
      "【Main】Choose 1 enemy Unit with 2 or less HP. Return it to its owner's hand. If you have a Link Unit in play, choose 1 enemy Unit with 4 or less HP instead.",
    );

    expect(effect.directives).toEqual([
      {
        condition: {
          type: "unitCount",
          owner: "friendly",
          comparison: "gte",
          count: 1,
          isLinkUnit: true,
        },
        thenDirectives: [
          {
            action: {
              action: "returnToHand",
              target: {
                owner: "opponent",
                cardType: "unit",
                count: 1,
                attributeFilters: [{ attribute: "hp", comparison: "lte", value: 4 }],
              },
            },
          },
        ],
        elseDirectives: [
          {
            action: {
              action: "returnToHand",
              target: {
                owner: "opponent",
                cardType: "unit",
                count: 1,
                attributeFilters: [{ attribute: "hp", comparison: "lte", value: 2 }],
              },
            },
          },
        ],
      },
    ]);
  });
});

describe("add-Shield queued follow-ups", () => {
  test("queues an enemy rest after returning a Shield", () => {
    const [effect] = parseEffect(
      "【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Rest it.",
    );

    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "addShieldToHand", count: 1 },
          followUp: {
            directives: [
              {
                action: {
                  action: "rest",
                  target: {
                    owner: "opponent",
                    cardType: "unit",
                    count: 1,
                    attributeFilters: [{ attribute: "hp", comparison: "lte", value: 3 }],
                  },
                },
              },
            ],
          },
        },
      },
    ]);
  });

  test("queues the optional turn-gated deploy after returning a Shield", () => {
    const [effect] = parseEffect(
      "【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, you may deploy 1 (Zeon) Unit card that is Lv.4 or lower from your hand.",
    );

    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "resolveThenQueue",
        first: { action: "addShieldToHand", count: 1 },
        followUp: {
          directives: [
            {
              condition: { type: "isTurn", whose: "friendly" },
              thenDirectives: [
                {
                  optional: true,
                  action: {
                    action: "deploy",
                    target: expect.objectContaining({ zone: "hand", cardType: "unit", count: 1 }),
                  },
                },
              ],
            },
          ],
        },
      },
    });
  });

  test("queues a condition-gated enemy Unit action after returning a Shield", () => {
    const [effect] = parseEffect(
      "【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn and a friendly (Teiwaz) Link Unit is in play, choose 1 enemy Unit with 2 or less AP. Destroy it.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "addShieldToHand", count: 1 },
          condition: {
            type: "and",
            conditions: [
              { type: "isTurn", whose: "friendly" },
              {
                type: "unitCount",
                owner: "friendly",
                comparison: "gte",
                count: 1,
                hasTrait: "teiwaz",
                isLinkUnit: true,
              },
            ],
          },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "destroy",
                  target: {
                    owner: "opponent",
                    cardType: "unit",
                    count: 1,
                    attributeFilters: [{ attribute: "ap", comparison: "lte", value: 2 }],
                  },
                },
              },
            ],
            sourceText: "Choose 1 enemy Unit with 2 or less AP. Destroy it.",
          },
        },
      },
    ]);
  });

  test("queues a turn-gated color discard and its dependent draw after returning a Shield", () => {
    const [effect] = parseEffect(
      "【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, you may discard 1 red card. If you do, draw 1.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "addShieldToHand", count: 1 },
          condition: { type: "isTurn", whose: "friendly" },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "discard",
                  count: 1,
                  filter: {
                    owner: "friendly",
                    zone: "hand",
                    count: 1,
                    attributeFilters: [{ attribute: "color", comparison: "eq", value: "red" }],
                  },
                },
                optional: true,
              },
              { action: { action: "draw", count: 1 }, dependsOnPrevious: true },
            ],
            sourceText: "You may discard 1 red card. If you do, draw 1.",
          },
        },
      },
    ]);
  });
});

describe("self effect-damage prevention", () => {
  test("keeps 'this Unit' as the protected target even when the source is an enemy Unit", () => {
    const [effect] = parseEffect(
      "During your opponent's turn, this Unit can't receive effect damage from enemy Units that are Lv.5 or lower.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "preventDamage",
          target: { owner: "self", cardType: "unit" },
          unitFilter: {
            owner: "opponent",
            cardType: "unit",
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
          },
          damageType: "effect",
          source: "enemy",
          duration: "permanent",
        },
      },
    ]);
  });
});

describe("top-deck tutor constraints", () => {
  test("retains an exact revealed card level alongside its trait and type", () => {
    const [effect] = parseEffect(
      "【Deploy】Look at the top 3 cards of your deck. You may reveal 1 (G Generation) Unit card that is Lv.3 among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "lookAtTopDeck",
        count: 3,
        tutorFilter: {
          owner: "friendly",
          cardType: "unit",
          count: 1,
          attributeFilters: [
            { attribute: "trait", comparison: "includes", value: "g generation" },
            { attribute: "level", comparison: "eq", value: 3 },
          ],
        },
      },
    });
  });

  test("retains an upper level bound on a revealed trait tutor", () => {
    const [effect] = parseEffect(
      "【Deploy】Look at the top 5 cards of your deck. You may reveal 1 (Celestial Being) Unit card that is Lv.5 or lower among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "lookAtTopDeck",
        count: 5,
        tutorFilter: {
          owner: "friendly",
          cardType: "unit",
          count: 1,
          attributeFilters: [
            { attribute: "trait", comparison: "includes", value: "celestial being" },
            { attribute: "level", comparison: "lte", value: 5 },
          ],
        },
      },
    });
  });

  test("keeps alternative traits and the Unit type on a conditional top-card tutor", () => {
    const [effect] = parseEffect(
      "【Deploy】Look at the top card of your deck. If it is a (Zeon)/(Neo Zeon) Unit card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "lookAtTopDeck",
        count: 1,
        tutorFilter: {
          owner: "friendly",
          cardType: "unit",
          count: 1,
          attributeFilters: [
            {
              attribute: "or",
              filters: [
                { attribute: "trait", comparison: "includes", value: "zeon" },
                { attribute: "trait", comparison: "includes", value: "neo zeon" },
              ],
            },
          ],
        },
      },
    });
  });

  test("keeps Unit and Pilot alternatives on a multi-trait revealed tutor", () => {
    const [effect] = parseEffect(
      "【Main】Look at the top 5 cards of your deck. You may reveal 1 (Operation Meteor)/(G Team) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
      "command",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "lookAtTopDeck",
        count: 5,
        tutorFilter: {
          owner: "friendly",
          count: 1,
          cardType: ["unit", "pilot"],
          attributeFilters: [
            {
              attribute: "or",
              filters: [
                { attribute: "trait", comparison: "includes", value: "operation meteor" },
                { attribute: "trait", comparison: "includes", value: "g team" },
              ],
            },
          ],
        },
      },
    });
  });
});

describe("EX Resource recipients", () => {
  test("preserves the all-player recipient scope", () => {
    const [effect] = parseEffect("【Deploy】All players place 1 EX Resource.");
    expect(effect.directives).toEqual([
      { action: { action: "placeExResource", state: "active", recipients: "all" } },
    ]);
  });
});

describe("other friendly exact-level modifiers", () => {
  test("keeps the friendly, other, trait, and exact-level constraints", () => {
    const [effect] = parseEffect(
      "During your turn, all other (G Generation) Units that are Lv.3 get AP+1.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: 1,
          duration: "permanent",
          target: {
            owner: "friendly",
            cardType: "unit",
            count: "all",
            excludeSource: true,
            attributeFilters: [
              { attribute: "trait", comparison: "includes", value: "g generation" },
              { attribute: "level", comparison: "eq", value: 3 },
            ],
          },
        },
      },
    ]);
  });
});

describe("trait-and-keyword in-play conditions", () => {
  test("requires both the named friendly trait and keyword", () => {
    const [effect] = parseEffect(
      "While a friendly (G Generation) Unit with <Blocker> is in play, this Unit gains <Suppression>.",
    );
    expect(effect.activation.conditions).toEqual([
      {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        hasTrait: "g generation",
        hasKeyword: "Blocker",
      },
    ]);
  });
});

describe("rested-self conditions", () => {
  test("keeps a rested source Unit as the gate for a constant effect", () => {
    const [effect] = parseEffect("While this Unit is rested, all Units gain <Blocker>.");
    expect(effect.activation.conditions).toEqual([{ type: "selfIsRested" }]);
  });
});

describe("top-deck routing", () => {
  test("preserves a top-or-trash choice", () => {
    const [effect] = parseEffect(
      "【Deploy】Look at the top card of your deck. Return it to the top of your deck or place it into your trash.",
    );
    expect(effect.directives).toEqual([
      { action: { action: "lookAtTopDeck", count: 1, return: "topOrTrash" } },
    ]);
  });
});

describe("EX-payment alternate effects", () => {
  test("uses the alternate damage reduction amount", () => {
    const [effect] = parseEffect(
      "【Main】Choose 1 friendly (Academy) Unit. During this turn, reduce the next damage it receives by 2. If you use an EX Resource to play this card, reduce by 4 instead.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "reduceNextDamage",
          amount: 2,
          exResourceAmount: 4,
          duration: "thisTurn",
          target: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "academy" }],
          },
        },
      },
    ]);
  });
});

describe("end-of-turn trigger", () => {
  test("keeps a qualified optional self-destruction as an end-of-turn trigger", () => {
    const [effect] = parseEffect(
      "【During Pair･(G Generation) Pilot】At the end of your turn, you may destroy this Unit.",
    );
    expect(effect).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["endOfTurn"],
        conditions: [{ type: "duringPair" }],
        qualification: { attribute: "trait", comparison: "includes", value: "g generation" },
      },
      directives: [
        {
          action: { action: "destroy", target: { owner: "self", cardType: "unit" } },
          optional: true,
        },
      ],
    });
  });
});

// ── Burst + activateTiming ──────────────────────────────────────────────────────

describe("activateTiming", () => {
  test("Burst: Activate this card's 【Main】 produces activateTiming short-circuit", () => {
    const [effect] = parseEffect("【Burst】 Activate this card's 【Main】.");
    expect(effect.type).toBe("triggered");
    expect(effect.activation.timing).toEqual(["burst"]);
    expect(effect.directives[0]).toMatchObject({
      action: { action: "activateTiming", timing: "main" },
    });
  });
});

// ── Shield ─────────────────────────────────────────────────────────────────────

describe("addShieldToHand", () => {
  test("Add 1 of your Shields to your hand", () => {
    const [effect] = parseEffect("【Burst】 Add 1 of your Shields to your hand.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "addShieldToHand", count: 1 } });
  });

  test("Add 2 of your Shields to your hand", () => {
    const [effect] = parseEffect("【Deploy】 Add 2 of your Shields to your hand.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "addShieldToHand", count: 2 } });
  });
});

// ── Resources ──────────────────────────────────────────────────────────────────

describe("placeResource", () => {
  test("Place 1 EX Resource produces the dedicated EX-token action", () => {
    const [effect] = parseEffect("【Deploy】 Place 1 EX Resource.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "placeExResource", state: "active" },
    });
  });

  test("Place 1 rested Resource produces the normal Resource-deck action", () => {
    const [effect] = parseEffect("【Deploy】 Place 1 rested Resource.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "placeResource", state: "rested" },
    });
  });

  test("keeps targetless modal options immediate while staging a selected-card option", () => {
    const [effect] = parseEffect(
      "【Main】When playing this card, choose 1 of the following effects and activate it: ■Place 1 rested Resource. ■Choose 1 Pilot card that is Lv.5 or higher from your trash. Add it to your hand.",
      "command",
    );
    expect(effect.directives[0]).toMatchObject({
      kind: "chooseOne",
      options: [
        {
          label: "Place 1 rested Resource.",
          directives: [{ action: { action: "placeResource", state: "rested" } }],
        },
        {
          label: "Choose 1 Pilot card that is Lv.5 or higher from your trash. Add it to your hand.",
          directives: [
            {
              action: {
                action: "resolveThenQueue",
                followUp: {
                  directives: [{ action: { action: "addFromTrash" } }],
                },
              },
            },
          ],
        },
      ],
    });
  });

  test("stages an optional trait-trash exile before destroying an eligible enemy Unit or Base", () => {
    const [effect] = parseEffect(
      "【During Pair】【Attack】If you are attacking the enemy player, you may choose 7 (Vulture) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit/Base that is Lv.8 or lower. Destroy it.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["attack"],
        conditions: [
          { type: "duringPair" },
          { type: "isAttackingPlayer" },
          {
            type: "or",
            conditions: [
              {
                zone: "battleArea",
                cardType: "unit",
                attributeFilters: [{ attribute: "level", value: 8 }],
              },
              {
                zone: "baseSection",
                cardType: "base",
                attributeFilters: [{ attribute: "level", value: 8 }],
              },
            ],
          },
        ],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "resolveThenQueue",
            first: { action: "exile", target: { zone: "trash", count: 7 } },
            followUp: {
              directives: [
                { action: { action: "destroy", target: { cardType: ["unit", "base"] } } },
              ],
            },
          },
        },
      ],
    });
  });

  test("copies the printed keyword list from a selected Unit in trash", () => {
    const [effect] = parseEffect(
      "【Activate･Main】【Once per Turn】①：Choose 1 Unit card with <Repair>/<Breach>/<Blocker> from your trash. During this turn, this Unit gets AP+1 and all <Repair>/<Breach>/<Blocker> on that Unit card.",
      "unit",
    );
    expect(effect).toMatchObject({
      type: "activated",
      activation: { timing: ["activate:main"], restrictions: [{ type: "oncePerTurn" }] },
      cost: { payResources: 1 },
      directives: [
        { action: { action: "statModifier", stat: "ap", amount: 1, target: { owner: "self" } } },
        {
          action: {
            action: "copyKeywordEffects",
            duration: "thisTurn",
            source: {
              zone: "trash",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "keyword", value: "Repair" },
                    { attribute: "keyword", value: "Breach" },
                    { attribute: "keyword", value: "Blocker" },
                  ],
                },
              ],
            },
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
    });
  });

  test("tracks chosen Units through a this-turn battle-destruction draw trigger", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 to 2 of your Units. During this turn, when they destroy an enemy card with battle damage, draw 1.",
      "unit",
    );
    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "createDelayedTrigger",
          duration: "thisTurn",
          eventType: "attackerDestroyedDefender",
          additionalEventTypes: ["shieldAreaCardDestroyedByBattle"],
          eventDamageType: "battle",
          oncePerSimultaneousGroup: true,
          eventSourceFilter: { owner: "friendly", cardType: "unit", count: { min: 1, max: 2 } },
          effect: { directives: [{ action: { action: "draw", count: 1 } }] },
        },
      },
    ]);
  });

  test("stages an optional discard before returning a lowest-level enemy Unit", () => {
    const [effect] = parseEffect(
      "【During Pair】【Attack】You may discard 2. If you do, choose 1 enemy Unit with the lowest Lv. Return it to the bottom of its owner's deck.",
      "unit",
    );
    expect(effect.directives).toMatchObject([
      {
        optional: true,
        action: {
          action: "resolveThenQueue",
          first: { action: "discard", count: 2 },
          followUp: {
            directives: [
              {
                action: { action: "returnToDeck", position: "bottom", target: { lowest: "level" } },
              },
            ],
          },
        },
      },
    ]);
  });

  test("hands an enemy discard-or-deploy choice to the correct controller", () => {
    const [effect] = parseEffect(
      "【During Pair】【Once per Turn】When this Unit destroys an enemy shield area card with battle damage, that enemy player may discard 1. If they don't discard with this effect, you may deploy 1 (Phantom Pain) Unit card that is Lv.4 or lower from your hand.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["onShieldAreaCardDestroyByBattle"],
        conditions: [{ type: "duringPair" }, { type: "eventCardIsSelf" }],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "queueEffectForOpponent",
            effect: {
              directives: [
                {
                  condition: { type: "handCount", owner: "friendly", count: 1 },
                  thenDirectives: [
                    {
                      kind: "chooseOne",
                      options: [
                        { label: "Discard 1 card" },
                        {
                          label: "Do not discard",
                          directives: [
                            {
                              action: {
                                action: "queueEffectForOpponent",
                                effect: {
                                  directives: [
                                    {
                                      optional: true,
                                      action: {
                                        action: "deploy",
                                        target: { owner: "friendly", zone: "hand" },
                                      },
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    });
  });

  test("grants a chosen Unit a temporary linked destruction trigger", () => {
    const [effect] = parseEffect(
      "【Action】Choose 1 friendly (Shrike Team) Unit. It gains the following effect during this turn: ■【During Link】【Destroyed】Choose 1 friendly (League Militaire) Unit. Set it as active.",
      "command",
    );
    expect(effect).toMatchObject({
      type: "command",
      activation: { timing: ["action"] },
      directives: [
        {
          action: {
            action: "createDelayedTrigger",
            duration: "thisTurn",
            eventType: "unitDestroyed",
            target: { attributeFilters: [{ attribute: "trait", value: "shrike team" }] },
            eventCardFilter: { isLinkUnit: true },
            effect: {
              directives: [
                {
                  action: {
                    action: "setActive",
                    target: {
                      attributeFilters: [{ attribute: "trait", value: "league militaire" }],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });
  });

  test("mills and draws only when a milled card has the printed trait", () => {
    const [effect] = parseEffect(
      "【When Paired】Place the top 2 cards of your deck into your trash. If you place a (CB) card with this effect, draw 1.",
      "unit",
    );
    expect(effect.directives).toEqual([
      { action: { action: "millDeckThenDrawIfTrait", count: 2, trait: "cb", drawCount: 1 } },
    ]);
  });

  test("readies a Resource at end of turn after a trash-trait threshold", () => {
    const [effect] = parseEffect(
      "At the end of your turn, if there are 7 or more (CB) cards in your trash, choose 1 of your Resources. Set it as active.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["endOfTurn"],
        conditions: [{ type: "cardInZone", zone: "trash", count: 7, hasTrait: "cb" }],
      },
      directives: [{ action: { action: "setActive", target: { zone: "resourceArea", count: 1 } } }],
    });
  });
});

// ── Deploy from hand ───────────────────────────────────────────────────────────

describe("deploy from hand", () => {
  test("Deploy 1 Unit card from your hand", () => {
    const [effect] = parseEffect("【Deploy】 Deploy 1 Unit card from your hand.");
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "deploy",
        target: { owner: "friendly", cardType: "unit", count: 1, zone: "hand" },
      },
    });
  });

  test("Deploy 2 Unit cards from your hand sets count:2 and zone:hand", () => {
    const [effect] = parseEffect("【Main】 Deploy 2 Unit cards from your hand.");
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "deploy",
        target: { owner: "friendly", cardType: "unit", count: 2, zone: "hand" },
      },
    });
  });

  test("Deploy 1 Pilot card from your hand", () => {
    const [effect] = parseEffect("【Main】②：Deploy 1 Pilot card from your hand.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "deploy", target: { cardType: "pilot" } },
    });
  });

  test("Deploy 1 (ZAFT) Unit card from your hand includes trait filter", () => {
    const [effect] = parseEffect("【Deploy】 Deploy 1 (ZAFT) Unit card from your hand.");
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "deploy",
        target: {
          cardType: "unit",
          // trait value is lowercased by the parser
          attributeFilters: [{ attribute: "trait", comparison: "includes", value: "zaft" }],
        },
      },
    });
  });

  test("Deploy 1 Unit card that is Lv.3 or lower from your hand includes level filter", () => {
    const [effect] = parseEffect(
      "【Deploy】 Deploy 1 Unit card that is Lv.3 or lower from your hand.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "deploy",
        target: {
          attributeFilters: [{ attribute: "level", comparison: "lte", value: 3 }],
        },
      },
    });
  });

  test("Deploy 1 (Neo Zeon)/(Zeon) Unit card — trait-OR group emits OR disjunction", () => {
    const [effect] = parseEffect(
      "【When Paired】 You may deploy 1 (Neo Zeon)/(Zeon) Unit card that is Lv.4 or lower from your hand.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "deploy",
        target: {
          cardType: "unit",
          attributeFilters: [
            {
              attribute: "or",
              filters: [
                { attribute: "trait", comparison: "includes", value: "neo zeon" },
                { attribute: "trait", comparison: "includes", value: "zeon" },
              ],
            },
            { attribute: "level", comparison: "lte", value: 4 },
          ],
        },
      },
    });
  });
});

// ── Deploy from trash ──────────────────────────────────────────────────────────

describe("deployFromTrash", () => {
  test("Deploy 1 Unit card from your trash", () => {
    const [effect] = parseEffect("【Main】②：Deploy 1 Unit card from your trash.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "deployFromTrash", payCost: false },
    });
  });

  test("Deploy 1 Unit card that is Lv.3 or lower from your trash", () => {
    const [effect] = parseEffect(
      "【Main】②：Deploy 1 Unit card that is Lv.3 or lower from your trash.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: { action: "deployFromTrash", levelAtMost: 3 },
    });
  });
});

// ── Deploy token ───────────────────────────────────────────────────────────────

describe("deployToken", () => {
  test("Deploy a basic token produces deployToken with full spec including traits/ap/hp", () => {
    const [effect] = parseEffect(
      "【Deploy】 Deploy 1 [Gundam]((White Base Team)·AP3·HP3) Unit token.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "deployToken",
        token: {
          name: "Gundam",
          traits: ["white base team"],
          ap: 3,
          hp: 3,
          deployState: "active",
        },
      },
    });
  });

  test("Rested token has deployState rested", () => {
    const [effect] = parseEffect(
      "【Deploy】 Deploy 1 rested [Zaku II]((Zeon)·AP3·HP1) Unit token.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "deployToken",
        token: { name: "Zaku II", traits: ["zeon"], ap: 3, hp: 1, deployState: "rested" },
      },
    });
  });

  test("Deploy multiple tokens sets count", () => {
    const [effect] = parseEffect("【Deploy】 Deploy 2 [Leo]((OZ)·AP1·HP1) Unit tokens.");
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "deployToken",
        token: { name: "Leo", traits: ["oz"], ap: 1, hp: 1, deployState: "active" },
        count: 2,
      },
    });
  });

  test("preserves an inline token restriction against targeting the enemy player", () => {
    const [effect] = parseEffect(
      "【When Paired】Deploy 1 [Parts]((League Militaire)·AP1·HP1·This Unit can't choose the enemy player as its attack target) Unit token.",
    );

    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "deployToken",
        token: {
          name: "Parts",
          traits: ["league militaire"],
          ap: 1,
          hp: 1,
          cantTargetPlayer: true,
          deployState: "active",
        },
      },
    });
  });
});

// ── Pair pilot ─────────────────────────────────────────────────────────────────

describe("pairPilot", () => {
  test("Pair 1 Pilot card from your hand with this Unit", () => {
    const [effect] = parseEffect("【Deploy】 Pair 1 Pilot card from your hand with this Unit.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "pairPilot", target: { cardType: "pilot", zone: "hand", count: 1 } },
    });
  });

  test("Pair 1 (Earth Federation) Pilot card from your hand includes trait filter", () => {
    const [effect] = parseEffect(
      "【Deploy】 Pair 1 (Earth Federation) Pilot card from your hand with this Unit.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "pairPilot",
        target: {
          cardType: "pilot",
          zone: "hand",
          attributeFilters: [
            { attribute: "trait", comparison: "includes", value: "earth federation" },
          ],
        },
      },
    });
  });
});

// ── Damage ─────────────────────────────────────────────────────────────────────

describe("dealDamage", () => {
  test("Deal 1 damage to it", () => {
    const [effect] = parseEffect("【Attack】 Deal 1 damage to it.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "dealDamage", amount: 1 } });
  });

  test("Deal 3 damage to it", () => {
    const [effect] = parseEffect("【Attack】 Deal 3 damage to it.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "dealDamage", amount: 3 } });
  });

  test("Deal 2 damage to all enemy Units", () => {
    const [effect] = parseEffect("【Main】②：Deal 2 damage to all enemy Units.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "dealDamageAll", amount: 2, target: { owner: "opponent", count: "all" } },
    });
  });

  test("All players draw retains the all-player scope", () => {
    const [effect] = parseEffect("【Destroyed】All players draw 1.", "base");
    expect(effect).toMatchObject({
      activation: { timing: ["destroyed"] },
      directives: [{ action: { action: "drawAll", count: 1 } }],
    });
  });
});

describe("recoverHP", () => {
  test("It Recovers 2 HP", () => {
    const [effect] = parseEffect("【Deploy】 It Recovers 2 HP.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "recoverHP", amount: 2 } });
  });

  test("It Recovers 1 HP", () => {
    const [effect] = parseEffect("【Deploy】 It Recovers 1 HP.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "recoverHP", amount: 1 } });
  });
});

// ── Board manipulation ─────────────────────────────────────────────────────────

describe("rest", () => {
  test("Rest it produces rest action", () => {
    const [effect] = parseEffect("【Main】②：Choose 1 enemy Unit. Rest it.");
    const restStep = effect.directives.find(
      (s) => "action" in s && (s as any).action.action === "rest",
    );
    expect(restStep).toMatchObject({ action: { action: "rest" } });
  });

  test("Rest this Unit produces rest action targeting self", () => {
    const [effect] = parseEffect("【Deploy】 Rest this Unit.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "rest" } });
  });
});

describe("setActive", () => {
  test("Set it as active produces setActive action", () => {
    const [effect] = parseEffect("【Deploy】 Set it as active.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "setActive" } });
  });

  test("Set this Unit as active produces setActive action", () => {
    const [effect] = parseEffect("【Deploy】 Set this Unit as active.");
    expect(effect.directives[0]).toEqual({
      action: { action: "setActive", target: { owner: "self", cardType: "unit" } },
    });
  });

  test("Choose one of your Resources targets the friendly Resource Area", () => {
    const [effect] = parseEffect("【Attack】Choose 1 of your Resources. Set it as active.");

    expect(effect.directives[0]).toEqual({
      action: {
        action: "setActive",
        target: {
          owner: "friendly",
          cardType: "resource",
          zone: "resourceArea",
          count: 1,
        },
      },
    });
  });
});

describe("returnToHand", () => {
  test("Return it to its owner's hand produces returnToHand", () => {
    const [effect] = parseEffect("【Main】②：Return it to its owner's hand.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "returnToHand" } });
  });

  test("curly owner apostrophe also produces returnToHand", () => {
    const [effect] = parseEffect("【Main】Choose 1 enemy Unit. Return it to its owner’s hand.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "returnToHand", target: { owner: "opponent", cardType: "unit" } },
    });
  });
});

describe("destroy", () => {
  test("Destroy it produces destroy action", () => {
    const [effect] = parseEffect("【Main】②：Destroy it.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "destroy" } });
  });

  test("Destroy all preserves aggregate target cardinality", () => {
    const [effect] = parseEffect("【Main】Destroy all Units that are Lv.4 or lower.");
    expect(effect.directives[0]).toEqual({
      action: {
        action: "destroy",
        target: {
          owner: "any",
          cardType: "unit",
          count: "all",
          attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
        },
      },
    });
  });
});

describe("exile", () => {
  test("Exile it from the game produces exile action", () => {
    const [effect] = parseEffect("【Main】②：Exile it from the game.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "exile" } });
  });
});

// ── Grant keyword ──────────────────────────────────────────────────────────────

describe("grantKeyword", () => {
  test("It gains <Blocker> this turn produces grantKeyword thisTurn", () => {
    const [effect] = parseEffect("【Deploy】 It gains <Blocker> this turn.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "grantKeyword", keyword: "Blocker", duration: "thisTurn" },
    });
  });

  test("activating a trait Command's Main or Action filters the observed Command", () => {
    const [effect] = parseEffect(
      "When you activate a (Special Move) Command's 【Main】/【Action】, this Unit gains <Suppression> during this turn.",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["onCommandEffectActivated"],
        conditions: [
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "command",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "special move" },
              ],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Suppression",
            duration: "thisTurn",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
    });
  });

  test("It gains <Breach 3> this turn includes keywordValue 3", () => {
    const [effect] = parseEffect("【Deploy】 It gains <Breach 3> this turn.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "grantKeyword", keyword: "Breach", keywordValue: 3, duration: "thisTurn" },
    });
  });

  test("This Unit gains <FirstStrike> during this battle", () => {
    const [effect] = parseEffect("【Attack】 This Unit gains <First Strike> during this battle.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "grantKeyword", keyword: "FirstStrike", duration: "thisBattle" },
    });
  });

  test("This Unit gains <Blocker> while linked", () => {
    const [effect] = parseEffect("【When Linked】 This Unit gains <Blocker> while linked.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "grantKeyword", keyword: "Blocker", duration: "whileLinked" },
    });
  });

  test("Choose a friendly trait Link Unit that gains a keyword keeps its target qualification", () => {
    const [effect] = parseEffect(
      "【Attack】Choose 1 of your (Phantom Pain) Linked Units. It gains <High-Maneuver> during this turn.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "grantKeyword",
        keyword: "HighManeuver",
        duration: "thisTurn",
        target: {
          owner: "friendly",
          cardType: "unit",
          count: 1,
          isLinkUnit: true,
          attributeFilters: [{ attribute: "trait", comparison: "includes", value: "phantom pain" }],
        },
      },
    });
  });
});

describe("grantTrait", () => {
  test("During Link trait grants last only while linked", () => {
    const [effect] = parseEffect("【During Link】All your Units gain (Neo Zeon).");
    expect(effect.directives).toEqual([
      {
        action: {
          action: "grantTrait",
          trait: "neo zeon",
          duration: "whileLinked",
          target: { owner: "friendly", cardType: "unit", count: "all" },
        },
      },
    ]);
  });
});

// ── Stat modifier ──────────────────────────────────────────────────────────────

describe("statModifier", () => {
  test("this gets a stat modifier even when a preceding condition names friendly Units", () => {
    const [effect] = parseEffect("While you have another (Titans) Unit in play, this gets AP+1.");
    expect(effect.directives).toMatchObject([
      { action: { action: "statModifier", stat: "ap", amount: 1, target: { owner: "self" } } },
    ]);
  });

  test("It gets AP+2 this turn", () => {
    const [effect] = parseEffect("【Deploy】 It gets AP+2 this turn.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "statModifier", stat: "ap", amount: 2, duration: "thisTurn" },
    });
  });

  test("It gets HP-1 this turn", () => {
    const [effect] = parseEffect("【Deploy】 It gets HP-1 this turn.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "statModifier", stat: "hp", amount: -1, duration: "thisTurn" },
    });
  });

  test("It gets AP+3 during this battle", () => {
    const [effect] = parseEffect("【Attack】 It gets AP+3 during this battle.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "statModifier", stat: "ap", amount: 3, duration: "thisBattle" },
    });
  });

  test("It gets cost -1 this turn", () => {
    const [effect] = parseEffect("【Main】 This card in your hand gets cost -1 this turn.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "statModifier", stat: "cost", amount: -1, duration: "thisTurn" },
    });
  });

  test("Multi-stat: it gets AP+1 and HP+1 produces two statModifier steps", () => {
    const [effect] = parseEffect("【Deploy】 It gets AP+1 and HP+1 this turn.");
    const statSteps = effect.directives.filter(
      (s) => "action" in s && (s as any).action.action === "statModifier",
    );
    expect(statSteps).toHaveLength(2);
    expect(statSteps[0]).toMatchObject({ action: { stat: "ap", amount: 1 } });
    expect(statSteps[1]).toMatchObject({ action: { stat: "hp", amount: 1 } });
  });

  test("Stat+keyword combo: it gets AP+1 and <Blocker> this turn produces both steps", () => {
    const [effect] = parseEffect("【Deploy】 It gets AP+1 and <Blocker> this turn.");
    const statSteps = effect.directives.filter(
      (s) => "action" in s && (s as any).action.action === "statModifier",
    );
    const kwSteps = effect.directives.filter(
      (s) => "action" in s && (s as any).action.action === "grantKeyword",
    );
    expect(statSteps).toHaveLength(1);
    expect(kwSteps).toHaveLength(1);
    expect(statSteps[0]).toMatchObject({ action: { stat: "ap", amount: 1 } });
    expect(kwSteps[0]).toMatchObject({ action: { keyword: "Blocker" } });
  });
});

describe("self cost reduction", () => {
  test("preserves whether the source card is in hand or trash", () => {
    const [handEffect] = parseEffect("This card in your hand gets cost -1.");
    const [trashEffect] = parseEffect("This card in your trash gets cost -1.");
    expect(handEffect.directives).toMatchObject([
      { action: { action: "costReduction", amount: 1, target: { owner: "self", zone: "hand" } } },
    ]);
    expect(trashEffect.directives).toMatchObject([
      { action: { action: "costReduction", amount: 1, target: { owner: "self", zone: "trash" } } },
    ]);
  });
});

// ── Prevent effects ────────────────────────────────────────────────────────────

describe("preventStatReduction", () => {
  test("AP can't be reduced by enemy effects", () => {
    const [effect] = parseEffect("This Unit's AP can't be reduced by enemy effects.");
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "preventStatReduction",
        stat: "ap",
        target: { owner: "self" },
        source: "enemy",
      },
    });
  });
});

describe("preventDamage", () => {
  test("keeps enemy-Unit effect-damage prevention scoped to Unit sources", () => {
    const [effect] = parseEffect(
      "【Action】Choose 1 friendly Unit paired with a (Newtype) Pilot. It can't receive effect damage from enemy Units during this turn.",
      "command",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "preventDamage",
          damageType: "effect",
          sourceCardType: "unit",
          unitFilter: { owner: "opponent", cardType: "unit" },
          duration: "thisTurn",
          target: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            attributeFilters: [
              { attribute: "pairedPilotTrait", comparison: "includes", value: "newtype" },
            ],
          },
        },
      },
    ]);
  });

  test("Can't receive battle damage from enemy Units with 3 or less AP", () => {
    const [effect] = parseEffect(
      "This Unit can't receive battle damage from enemy Units with 3 or less AP.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "preventDamage",
        target: { owner: "self" },
        unitFilter: { attributeFilters: [{ attribute: "ap", comparison: "lte", value: 3 }] },
      },
    });
  });

  test("chosen friendly Unit is protected from low-AP enemy battle damage for this battle", () => {
    const [effect] = parseEffect(
      "【Action】Choose 1 friendly Unit. It can't receive battle damage from enemy Units with 2 or less AP during this battle.\n【Pilot】[Ramba Ral]",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "preventDamage",
          damageType: "battle",
          duration: "thisBattle",
          target: { owner: "friendly", cardType: "unit", count: 1 },
          unitFilter: {
            owner: "opponent",
            cardType: "unit",
            attributeFilters: [{ attribute: "ap", comparison: "lte", value: 2 }],
          },
        },
      },
    ]);
  });
});

describe("damage to the first opponent Shield card", () => {
  test("uses the hidden-information-safe first-Shield primitive", () => {
    const [effect] = parseEffect(
      "【Attack】Deal 5 damage to the first card in your opponent's shield area.",
    );

    expect(effect.directives).toEqual([
      { action: { action: "dealDamageToFirstOpponentShield", amount: 5 } },
    ]);
  });
});

describe("ready then cannot attack", () => {
  test("keeps a chosen rested Unit's attack restriction as a dependent shared choice", () => {
    const [effect] = parseEffect(
      "【Attack】Choose 1 of your rested (Preventer) Link Units. Set it as active. It can't attack during this turn.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "setActive",
          target: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            state: "rested",
            isLinkUnit: true,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "preventer" }],
          },
        },
      },
      {
        action: {
          action: "cantAttack",
          duration: "thisTurn",
          target: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            isLinkUnit: true,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "preventer" }],
          },
        },
        dependsOnPrevious: true,
        sharesTargetChoiceWithPrevious: true,
      },
    ]);
  });
});

describe("preventDamageToZone", () => {
  test("Friendly Shields means only face-down Shields, not the Base section", () => {
    const [effect] = parseEffect(
      "While this Unit is rested, friendly Shields can't receive battle damage from enemy Units.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "preventDamageToZone",
        protectedArea: { kind: "zone", zone: "shieldArea" },
        unitFilter: { owner: "opponent", cardType: "unit" },
      },
    });
  });

  test("Shield area cards can't receive damage from enemy Units that are Lv.4 or lower", () => {
    // preventDamageToZone is only reachable inside a timing block
    const [effect] = parseEffect(
      "【Action】During this battle, your shield area cards can't receive damage from enemy Units that are Lv.4 or lower.",
    );
    const dmgZoneStep = effect.directives.find(
      (s) => "action" in s && (s as any).action.action === "preventDamageToZone",
    );
    expect(dmgZoneStep).toMatchObject({
      action: {
        action: "preventDamageToZone",
        protectedArea: { kind: "shieldArea" },
        unitFilter: { attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }] },
      },
    });
  });
});

describe("activated history conditions", () => {
  test("parses a Base that deploys after a friendly Unit is destroyed by a friendly trait effect", () => {
    const [effect] = parseEffect(
      "【Activate･Main】Rest this Base：If one of your Units has been destroyed by one of your (Neo Zeon) card's effects during this turn, deploy 1 (Neo Zeon) Unit card that is Lv.3 or lower from your hand.",
    );
    expect(effect).toMatchObject({
      type: "activated",
      activation: {
        timing: ["activate:main"],
        conditions: [{ type: "friendlyUnitDestroyedByFriendlyTraitThisTurn", trait: "neo zeon" }],
      },
      cost: { restSelf: true },
      directives: [
        {
          action: {
            action: "deploy",
            target: {
              owner: "friendly",
              zone: "hand",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "neo zeon" },
                { attribute: "level", comparison: "lte", value: 3 },
              ],
            },
          },
        },
      ],
    });
  });
});

describe("reduceNextDamage", () => {
  test("parses friendly traited Unit-token enemy-effect damage reduction as a constant", () => {
    const [effect] = parseEffect(
      "When one of your (League Militaire) Unit tokens receives enemy effect damage, reduce it by 1.",
    );
    expect(effect).toMatchObject({
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              isToken: true,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "league militaire" },
              ],
            },
            damageType: "effect",
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
    });
  });

  test("free-standing received effect damage reduction produces a constant modifier", () => {
    const [effect] = parseEffect(
      "When this Unit receives effect damage from an enemy, reduce it by 3.",
    );
    expect(effect).toMatchObject({
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 3,
            target: { owner: "self" },
            damageType: "effect",
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
    });
  });

  test("a leading Pilot condition gates received-damage reduction as a constant", () => {
    const [effect] = parseEffect(
      "【Once per Turn】If you have a (CB) Pilot in play, when this Unit receives damage from an enemy, reduce it by 1.",
    );
    expect(effect).toMatchObject({
      type: "constant",
      activation: {
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "pilot",
            hasTrait: "cb",
            comparison: "gte",
            count: 1,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 1,
            target: { owner: "self", cardType: "unit" },
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
    });
  });
});

describe("during turn when-clause parsing", () => {
  test("during your turn with a destroy-by-battle when-clause is triggered", () => {
    const [effect] = parseEffect(
      "During your turn, when this Unit destroys an enemy Unit with battle damage, draw 1.",
    );
    expect(effect).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["onDestroyByBattle"],
        conditions: [{ type: "isTurn", whose: "friendly" }, { type: "eventCardIsSelf" }],
      },
    });
  });

  test("a qualified friendly Unit that destroys in battle can recover itself", () => {
    const [effect] = parseEffect(
      "During your turn, when a friendly (CB) Unit that is Lv.6 or higher destroys an enemy Unit with battle damage, that friendly Unit may recover 2 HP.",
    );

    expect(effect).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["onDestroyByBattle"],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                { attribute: "level", comparison: "gte", value: 6 },
                { attribute: "trait", comparison: "includes", value: "cb" },
              ],
            },
          },
        ],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "recoverHPEventCard",
            amount: 2,
            sourceFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                { attribute: "level", comparison: "gte", value: 6 },
                { attribute: "trait", comparison: "includes", value: "cb" },
              ],
            },
          },
        },
      ],
    });
  });
});

// ── Can't attack / targetPlayer ────────────────────────────────────────────────

describe("cantAttack", () => {
  test("It can't attack this turn", () => {
    const [effect] = parseEffect("【Deploy】 It can't attack during this turn.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "cantAttack", duration: "thisTurn" },
    });
  });
});

describe("cantTargetPlayer", () => {
  test("This Unit can't choose the enemy player as its attack target", () => {
    const [effect] = parseEffect("This Unit can't choose the enemy player as its attack target.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "cantTargetPlayer", whose: "opponent" },
    });
  });
});

describe("restrictUnit", () => {
  test("This Unit can't be paired with a Pilot", () => {
    const [effect] = parseEffect("This Unit can't be paired with a Pilot.");
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "restrictUnit",
        target: { owner: "self", cardType: "unit" },
        restrictions: ["cannotPairPilot"],
      },
    });
  });

  test("This Unit can't be set as active or paired with a Pilot", () => {
    const [effect] = parseEffect("This Unit can't be set as active or paired with a Pilot.");
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "restrictUnit",
        restrictions: ["cannotSetActive", "cannotPairPilot"],
      },
    });
  });
});

describe("preventDestroy", () => {
  test("friendly Units can't be destroyed by enemy effects", () => {
    const [effect] = parseEffect(
      "【Main】/【Action】During this turn, friendly Units can't be destroyed by enemy effects.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "preventDestroy",
        target: { owner: "friendly", cardType: "unit", count: "all" },
        source: "enemy",
        duration: "thisTurn",
      },
    });
  });
});

// ── Choose attack target ───────────────────────────────────────────────────────

describe("chooseAttackTarget", () => {
  test("It may choose an active enemy Unit with qualifier as its attack target", () => {
    // The parser requires at least one qualifier word between 'Unit' and 'as its attack target'
    const [effect] = parseEffect(
      "【When Linked】 It may choose an active enemy Unit with 5 or less AP as its attack target.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "chooseAttackTarget",
        attackTarget: { owner: "opponent", state: "active" },
      },
    });
  });

  test("This Unit may choose an active enemy Unit that is Lv.2 or lower as its attack target", () => {
    const [effect] = parseEffect(
      "This Unit may choose an active enemy Unit that is Lv.2 or lower as its attack target.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "chooseAttackTarget",
        unit: { owner: "self", cardType: "unit" },
        attackTarget: {
          owner: "opponent",
          state: "active",
          attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
        },
        duration: "permanent",
      },
    });
  });
});

// ── Look at top deck ───────────────────────────────────────────────────────────

describe("lookAtTopDeck", () => {
  test("routes remaining looked-at cards to the bottom when explicitly printed", () => {
    const [effect] = parseEffect(
      "【Main】Look at the top 3 cards of your deck and return 1 to the top. Return the remaining cards to the bottom of your deck.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "lookAtTopDeck",
          count: 3,
          return: "chooseTop",
          remainingDestination: "bottom",
        },
      },
    ]);
  });

  test("Look at top 2 cards and return 1 to top and 1 to bottom (inline)", () => {
    // The return clause must be inline (not after a sentence split) for topAndBottom to work
    const [effect] = parseEffect(
      "【Deploy】 Add 1 of your Shields to your hand. Then, look at the top 2 cards of your deck and return 1 to the top and 1 to the bottom.",
    );
    const lookStep = effect.directives.find(
      (s) => "action" in s && (s as any).action.action === "lookAtTopDeck",
    );
    expect(lookStep).toMatchObject({
      action: { action: "lookAtTopDeck", count: 2, return: "topAndBottom" },
    });
  });

  test("split-sentence top-deck tutor includes its Unit filter", () => {
    const [effect] = parseEffect(
      "【When Paired】 Look at the top 3 cards of your deck. You may reveal 1 Unit card among them and add it to your hand.",
    );
    const lookStep = effect.directives.find(
      (s) => "action" in s && (s as any).action.action === "lookAtTopDeck",
    );
    expect(lookStep).toMatchObject({
      action: {
        action: "lookAtTopDeck",
        count: 3,
        return: "chooseTop",
        tutorFilter: { owner: "friendly", cardType: "unit", count: 1 },
      },
    });
  });

  test("split-sentence colored trait Pilot tutor preserves every printed filter", () => {
    const [effect] = parseEffect(
      "【Deploy】Look at the top 5 cards of your deck. You may reveal 1 green (Zeon) Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "lookAtTopDeck",
          count: 5,
          return: "chooseTop",
          randomizeRemainingToBottom: true,
          tutorFilter: {
            owner: "friendly",
            count: 1,
            cardType: "pilot",
            attributeFilters: [
              { attribute: "color", comparison: "eq", value: "green" },
              { attribute: "trait", comparison: "includes", value: "zeon" },
            ],
          },
        },
      },
    ]);
  });

  test("split-sentence colored trait Unit or named-card tutor preserves both branches", () => {
    const [effect] = parseEffect(
      '【When Linked】Look at the top 3 cards of your deck. You may reveal 1 green (Earth Federation) Unit card/1 card with "AGE Device" in its card name among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.',
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "lookAtTopDeck",
          count: 3,
          return: "chooseTop",
          randomizeRemainingToBottom: true,
          tutorFilter: {
            owner: "friendly",
            count: 1,
            attributeFilters: [
              {
                attribute: "or",
                filters: [
                  {
                    attribute: "and",
                    filters: [
                      { attribute: "cardType", comparison: "eq", value: "unit" },
                      { attribute: "color", comparison: "eq", value: "green" },
                      {
                        attribute: "trait",
                        comparison: "includes",
                        value: "earth federation",
                      },
                    ],
                  },
                  { attribute: "name", comparison: "includes", value: "AGE Device" },
                ],
              },
            ],
          },
        },
      },
    ]);
  });

  test("split-sentence Zeon OR Neo Zeon tutor preserves random-bottom routing", () => {
    const [effect] = parseEffect(
      "【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Zeon)/(Neo Zeon) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "lookAtTopDeck",
          count: 3,
          return: "chooseTop",
          randomizeRemainingToBottom: true,
          tutorFilter: {
            owner: "friendly",
            count: 1,
            cardType: "unit",
            attributeFilters: [
              {
                attribute: "or",
                filters: [
                  { attribute: "trait", comparison: "includes", value: "zeon" },
                  { attribute: "trait", comparison: "includes", value: "neo zeon" },
                ],
              },
            ],
          },
        },
      },
    ]);
  });
});

describe("optional actions", () => {
  test("You may deploy marks the deploy directive optional", () => {
    const [effect] = parseEffect(
      "【When Paired】You may deploy 1 (Neo Zeon)/(Zeon) Unit card that is Lv.4 or lower from your hand.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: { action: "deploy" },
      optional: true,
    });
  });
});

describe("millDeck", () => {
  test("Place the top 2 cards of your deck into your trash", () => {
    const [effect] = parseEffect(
      "【Destroyed】 Place the top 2 cards of your deck into your trash.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: { action: "millDeck", count: 2, owner: "self" },
    });
  });
});

describe("unparsedText fallback", () => {
  test("unsupported clauses are preserved as structured text", () => {
    const [effect] = parseEffect("【Deploy】 Sing an unsupported song.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "unparsedText", text: "Sing an unsupported song." },
    });
  });
});

// ── Add from trash ─────────────────────────────────────────────────────────────

describe("addFromTrash", () => {
  test("Add it from your trash to your hand", () => {
    // The regex requires "it/them" or a typed "N (Trait) CardType card" form
    const [effect] = parseEffect("【Deploy】 Add it from your trash to your hand.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "addFromTrash" } });
  });

  test("Add 1 Unit card from your trash to your hand", () => {
    const [effect] = parseEffect("【Main】②：Add 1 Unit card from your trash to your hand.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "addFromTrash" } });
  });

  test("propagates a chosen trash target into a following add-it sentence", () => {
    const [effect] = parseEffect(
      "【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, choose 1 (Tekkadan) Unit card that is Lv.2 or lower from your trash. Add it to your hand.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "addFromTrash",
        target: {
          owner: "friendly",
          cardType: "unit",
          zone: "trash",
          count: 1,
          attributeFilters: [
            { attribute: "level", comparison: "lte", value: 2 },
            { attribute: "trait", comparison: "includes", value: "tekkadan" },
          ],
        },
      },
    });
  });
});

describe("attack redirection and prevent-active continuations", () => {
  test("changes an attack target to the chosen rested friendly trait Unit", () => {
    const [effect] = parseEffect(
      "【Action】Choose 1 rested friendly (CB) Unit. Change the attack target of the battling enemy Unit to it.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "changeAttackTarget",
        target: {
          owner: "friendly",
          cardType: "unit",
          state: "rested",
          count: 1,
          attributeFilters: [{ attribute: "trait", comparison: "includes", value: "cb" }],
        },
      },
    });
  });

  test("prevents the chosen rested enemy from becoming active", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 rested enemy Unit that is Lv.2 or lower. It won' t be set as active during the start phase of your opponent' s next turn.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "preventActive",
        target: {
          owner: "opponent",
          cardType: "unit",
          state: "rested",
          count: 1,
          attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
        },
      },
    });
  });
});

describe("chosen-target continuation", () => {
  test("reuses one chosen friendly Unit for damage and a later stat modifier", () => {
    const [effect] = parseEffect(
      "【Main】/【Action】Choose 1 of your Units. Deal 1 damage to it. It gets AP+3 during this turn.",
    );
    expect(effect.directives).toHaveLength(2);
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "dealDamage",
        target: { owner: "friendly", cardType: "unit", count: 1 },
      },
    });
    expect(effect.directives[1]).toMatchObject({
      action: {
        action: "statModifier",
        target: { owner: "friendly", cardType: "unit", count: 1 },
      },
    });
  });

  test("keeps the other-Unit exclusion on every chosen-target continuation", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 of your other Units. Deal 1 damage to it. It gets AP+1 during this turn.",
    );
    expect(effect.directives).toHaveLength(2);
    for (const directive of effect.directives) {
      expect(directive).toMatchObject({
        action: {
          target: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            excludeSource: true,
          },
        },
      });
    }
  });

  test("promotes a leading unit-count gate and applies its chosen enemy target", () => {
    const [effect] = parseEffect(
      "【When Paired】If you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play, choose 1 enemy Unit with 3 or less HP. Rest it.",
    );
    expect(effect.activation.conditions).toEqual([
      {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 2,
        hasTrait: ["gjallarhorn", "tekkadan"],
        excludeSelf: true,
      },
    ]);
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "rest",
        target: {
          owner: "opponent",
          cardType: "unit",
          count: 1,
          attributeFilters: [{ attribute: "hp", comparison: "lte", value: 3 }],
        },
      },
    });
  });

  test("parses another-friendly trait gates for self keyword and enemy damage effects", () => {
    const [keywordEffect] = parseEffect(
      "【When Linked】If another friendly (Clan) Unit is in play, this gains <First Strike> during this turn.",
    );
    expect(keywordEffect.activation.conditions).toEqual([
      {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        hasTrait: "clan",
        excludeSelf: true,
      },
    ]);
    expect(keywordEffect.directives[0]).toMatchObject({
      action: {
        action: "grantKeyword",
        keyword: "FirstStrike",
        target: { owner: "self", cardType: "unit" },
      },
    });

    const [damageEffect] = parseEffect(
      "【Deploy】If another friendly (Clan) Unit is in play, choose 1 enemy Unit. Deal 1 damage to it.",
    );
    expect(damageEffect.activation.conditions).toEqual(keywordEffect.activation.conditions);
    expect(damageEffect.directives[0]).toMatchObject({
      action: {
        action: "dealDamage",
        amount: 1,
        target: { owner: "opponent", cardType: "unit", count: 1 },
      },
    });
  });
});

// ── Target filter details ──────────────────────────────────────────────────────

describe("target filters on actions", () => {
  test("returns selected Units to their owners' hands", () => {
    const [effect] = parseEffect(
      "【Action】Choose 1 to 2 enemy Units with 2 or less HP. Return them to their owners' hands.",
    );
    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "returnToHand",
          target: { owner: "opponent", cardType: "unit", count: { min: 1, max: 2 } },
        },
      },
    ]);
  });

  test("deploys a selected eligible Unit from trash after paying its cost", () => {
    const [effect] = parseEffect(
      "【Main】Choose 1 Unit card that is Lv.5 or lower from your trash. Pay its cost to deploy it.",
    );
    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "deployFromTrash",
          payCost: true,
          target: { owner: "friendly", cardType: "unit", zone: "trash", count: 1 },
        },
      },
    ]);
  });

  test("redirects an attack to the selected friendly Unit", () => {
    const [effect] = parseEffect(
      "【Action】Choose 1 friendly rested (Academy) Unit. Change a battling enemy Unit's attack target to it.",
    );
    expect(effect.directives).toMatchObject([
      { action: { action: "changeAttackTarget", target: { owner: "friendly", state: "rested" } } },
    ]);
  });

  test("forces every enemy Unit to attack the selected Unit this turn", () => {
    const [effect] = parseEffect(
      "【Action】Choose 1 of your rested Units. During this turn, all enemy Units must choose that Unit as their attack target when attacking.",
    );
    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "forceAttackTarget",
          unit: { owner: "opponent", count: "all" },
          attackTarget: { owner: "friendly", state: "rested", count: 1 },
          duration: "thisTurn",
        },
      },
    ]);
  });

  test("lets a selected token attack on the turn it was deployed", () => {
    const [effect] = parseEffect(
      "【During Pair】【Attack】Choose 1 of your (Triple Ship Alliance) Unit tokens. It may attack on the turn it is deployed.",
    );
    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "allowAttackDeployedThisTurn",
          duration: "thisTurn",
          target: { owner: "friendly", cardType: "unit", isToken: true, count: 1 },
        },
      },
    ]);
  });

  test("limits deploy-turn attack permission to a rested enemy Unit", () => {
    const [effect] = parseEffect(
      "On the turn this Unit is deployed, it may choose a rested enemy Unit as its attack target and attack it.",
    );
    expect(effect).toEqual({
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [
        {
          action: {
            action: "allowAttackDeployedThisTurn",
            duration: "thisTurn",
            target: { owner: "self", cardType: "unit" },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
            },
          },
        },
      ],
      sourceText:
        "On the turn this Unit is deployed, it may choose a rested enemy Unit as its attack target and attack it.",
    });
  });

  test("reduces a card's hand level and cost at an enemy trash threshold", () => {
    const [effect] = parseEffect(
      "While an enemy player has 7 or more cards in their trash, this card in your hand gets Lv. -3 and cost -3.",
    );
    const selfInHand = {
      owner: "self",
      zone: "hand",
      cardType: "unit",
    } as const;
    expect(effect).toEqual({
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "trash",
            comparison: "gte",
            count: 7,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "levelReductionByCount",
            amountPerMatch: 3,
            countFilter: selfInHand,
            target: selfInHand,
          },
        },
        {
          action: {
            action: "costReductionByCount",
            amountPerMatch: 3,
            countFilter: selfInHand,
            target: selfInHand,
          },
        },
      ],
      sourceText:
        "While an enemy player has 7 or more cards in their trash, this card in your hand gets Lv. -3 and cost -3.",
    });
  });

  test("grants AP and HP only at an enemy trash threshold", () => {
    const [effect] = parseEffect(
      "While an enemy player has 7 or more cards in their trash, this Unit gets AP+1 and HP+1.",
      "pilot",
    );
    expect(effect).toMatchObject({
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "trash",
            comparison: "gte",
            count: 7,
          },
        ],
      },
      directives: [
        { action: { action: "statModifier", stat: "ap", amount: 1, duration: "permanent" } },
        { action: { action: "statModifier", stat: "hp", amount: 1, duration: "permanent" } },
      ],
    });
  });

  test("redirects battle damage from the source Unit to the selected Unit", () => {
    const [effect] = parseEffect(
      "【During Link】【Attack】You may choose 1 of your (Academy) Units. During this battle, battle damage this Unit would receive is dealt to that Unit instead.",
    );
    expect(effect.directives).toMatchObject([
      {
        optional: true,
        action: {
          action: "redirectBattleDamage",
          target: { owner: "self" },
          redirectTo: { owner: "friendly", cardType: "unit", count: 1 },
          duration: "thisBattle",
        },
      },
    ]);
  });

  test("enemy unit target has opponent owner", () => {
    const [effect] = parseEffect("【Main】②：Choose 1 enemy Unit. Rest it.");
    const restStep = effect.directives.find(
      (s) => "action" in s && (s as any).action.action === "rest",
    );
    expect(restStep).toMatchObject({
      action: { action: "rest", target: { owner: "opponent" } },
    });
  });

  test("rested enemy unit target has state rested", () => {
    const [effect] = parseEffect(
      "【Main】②：Choose 1 rested enemy Unit. Return it to its owner's hand.",
    );
    const returnStep = effect.directives.find(
      (s) => "action" in s && (s as any).action.action === "returnToHand",
    );
    expect(returnStep).toMatchObject({
      action: { action: "returnToHand", target: { state: "rested", owner: "opponent" } },
    });
  });

  test("enemy Unit with 5 or less HP attribute filter", () => {
    const [effect] = parseEffect("【Main】②：Choose 1 enemy Unit with 5 or less HP. Destroy it.");
    const destroyStep = effect.directives.find(
      (s) => "action" in s && (s as any).action.action === "destroy",
    );
    expect(destroyStep).toMatchObject({
      action: {
        action: "destroy",
        target: {
          attributeFilters: [{ attribute: "hp", comparison: "lte", value: 5 }],
        },
      },
    });
  });

  test("enemy Unit with 3 or more AP attribute filter", () => {
    const [effect] = parseEffect("【Main】②：Choose 1 enemy Unit with 3 or more AP. Rest it.");
    const restStep = effect.directives.find(
      (s) => "action" in s && (s as any).action.action === "rest",
    );
    expect(restStep).toMatchObject({
      action: {
        target: {
          attributeFilters: [{ attribute: "ap", comparison: "gte", value: 3 }],
        },
      },
    });
  });

  test("Deal damage to all enemy Units targets opponent units", () => {
    // dealDamageAll parses target from text after "all", which is "enemy Units" → owner: opponent
    const [effect] = parseEffect("【Main】②：Deal 2 damage to all enemy Units.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "dealDamageAll", target: { owner: "opponent", cardType: "unit" } },
    });
  });
});

// ── "If you do" inter-directive dependency ─────────────────────────────────────

describe("if you do", () => {
  test("emits dependsOnPrevious: true on the directive following an 'If you do' connective", () => {
    // Zedas-shape text (stripped of the "You may" — the parser does not
    // yet emit `optional: true` from card text, so this test covers just
    // the dependency flag produced by the "If you do" rule).
    const [effect] = parseEffect(
      "【Attack】Choose 1 of your other Units. Destroy it. If you do, choose 1 enemy Unit that is Lv.4 or lower. Deal 2 damage to it.",
    );
    // First directive: destroy (predecessor).
    expect(effect.directives[0]).toMatchObject({
      action: { action: "destroy" },
    });
    // Second directive: dealDamage tagged with the dependency flag.
    expect(effect.directives[1]).toMatchObject({
      action: { action: "dealDamage", amount: 2 },
      dependsOnPrevious: true,
    });
  });
});

describe("EX-payment alternate target counts", () => {
  test("uses the alternate selected-Unit count for an attack-target effect", () => {
    const [effect] = parseEffect(
      "【Main】Choose 1 friendly (Academy) Unit. During this turn, it may choose an active enemy Unit with 5 or less AP as its attack target. If you use an EX Resource to play this card, choose 1 to 2 friendly (Academy) Units instead.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "chooseAttackTarget",
          unit: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "academy" }],
          },
          exResourceUnitCount: { min: 1, max: 2 },
          attackTarget: {
            owner: "opponent",
            cardType: "unit",
            state: "active",
            attributeFilters: [{ attribute: "ap", comparison: "lte", value: 5 }],
          },
          duration: "thisTurn",
        },
      },
    ]);
  });
});

describe("mill-dependent follow-ups", () => {
  test("mills then queues damage only if a matching trait was milled", () => {
    const [effect] = parseEffect(
      "【When Linked】Place the top card of your deck into your trash. If you placed a (Zeon)/(Clan) card with this effect, choose 1 enemy Unit. Deal 1 damage to it.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "millDeckThenDamageIfTrait",
          count: 1,
          owner: "self",
          traits: ["Zeon", "Clan"],
          damage: 1,
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ]);
  });

  test("mills then queues a stat modifier only if a matching trait was milled", () => {
    const [effect] = parseEffect(
      "【When Paired】Place the top 2 cards of your deck into your trash. If you placed a (Vagan) card with this effect, choose 1 enemy Unit. It gets AP-2 during this turn.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "millDeckThenStatModifierIfTrait",
          count: 2,
          owner: "self",
          traits: "vagan",
          stat: "ap",
          amount: -2,
          duration: "thisTurn",
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ]);
  });

  test("mills then queues a stat modifier only if a high-level card was milled", () => {
    const [effect] = parseEffect(
      "【Attack】Place the top card of your deck into your trash. If you placed a card that is Lv.3 or higher with this effect, choose 1 enemy Unit. It gets AP-2 during this battle.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "millDeckThenStatModifierIfLevel",
          count: 1,
          owner: "self",
          minLevel: 3,
          stat: "ap",
          amount: -2,
          duration: "thisBattle",
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ]);
  });
});

describe("delayed battle-destruction triggers", () => {
  test("registers a this-turn trigger with the printed attacker trait", () => {
    const [effect] = parseEffect(
      "【Deploy】During this turn, when one of your (Earth Federation) Units destroys an enemy Unit with battle damage, choose 1 enemy Unit with 5 or less HP. Rest it.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "createDelayedTrigger",
          duration: "thisTurn",
          eventType: "attackerDestroyedDefender",
          eventCardFilter: {
            owner: "friendly",
            cardType: "unit",
            attributeFilters: [
              { attribute: "trait", comparison: "includes", value: "earth federation" },
            ],
          },
          effect: {
            type: "triggered",
            activation: { timing: ["onDestroyByBattle"] },
            directives: [
              {
                action: {
                  action: "rest",
                  target: {
                    owner: "opponent",
                    cardType: "unit",
                    state: "active",
                    count: 1,
                    attributeFilters: [{ attribute: "hp", comparison: "lte", value: 5 }],
                  },
                },
              },
            ],
            sourceText:
              "During this turn, when one of your (Earth Federation) Units destroys an enemy Unit with battle damage, choose 1 enemy Unit with 5 or less HP. Rest it.",
          },
        },
      },
    ]);
  });

  test("keeps the ready-and-cannot-attack effect on the same chosen Unit", () => {
    const [effect] = parseEffect(
      "【Main】During this turn, if a friendly (Superpower Bloc)/(UN) Unit destroys an enemy Unit with battle damage, choose 1 rested friendly (Superpower Bloc)/(UN) Unit. Set it as active. It can't attack during this turn.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "createDelayedTrigger",
        eventType: "attackerDestroyedDefender",
        effect: {
          directives: [
            {
              action: {
                action: "setActive",
                cantAttackDuration: "thisTurn",
                target: {
                  owner: "friendly",
                  cardType: "unit",
                  state: "rested",
                  count: 1,
                },
              },
            },
          ],
        },
      },
    });
  });
});

describe("dynamic keyword values", () => {
  test("scales Repair by the printed friendly token count", () => {
    const [effect] = parseEffect(
      "This Unit gains the same number of <Repair 1> as the number of (Calamity War) Unit tokens you have in play.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "grantKeyword",
          keyword: "Repair",
          keywordValue: 1,
          countFilter: {
            owner: "friendly",
            zone: "battleArea",
            cardType: "unit",
            isToken: true,
            attributeFilters: [
              { attribute: "trait", comparison: "includes", value: "calamity war" },
            ],
          },
          duration: "permanent",
          target: { owner: "self", cardType: "unit" },
        },
      },
    ]);
  });
});

describe("battle-damage redirection", () => {
  test("keeps the chosen Unit as the protected target when redirecting to this Unit", () => {
    const [effect] = parseEffect(
      "【When Linked】Choose 1 of your (Minerva Squad) Units. During this turn, battle damage it would receive is dealt to this Unit instead.",
      "pilot",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "redirectBattleDamage",
          target: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            attributeFilters: [
              { attribute: "trait", comparison: "includes", value: "minerva squad" },
            ],
          },
          redirectTo: { owner: "self", cardType: "unit" },
          duration: "thisTurn",
        },
      },
    ]);
  });
});

describe("keyword-sensitive damage", () => {
  test("uses the chosen target's keyword to replace damage", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 enemy Unit. Deal 1 damage to it. If it has <Repair>, deal 3 damage instead.",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "dealDamageByTargetKeyword",
          amount: 1,
          keyword: "Repair",
          keywordAmount: 3,
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ]);
  });
});

describe("hand cost reduction", () => {
  test("promotes a leading trash-count gate for a hand-only cost reduction", () => {
    const [effect] = parseEffect(
      "If there are 8 or more (Neo Zeon) cards in your trash, this card in your hand gets cost -4.",
    );

    expect(effect).toMatchObject({
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 8,
            hasTrait: "neo zeon",
          },
        ],
      },
      directives: [
        { action: { action: "costReduction", amount: 4, target: { owner: "self", zone: "hand" } } },
      ],
    });
  });

  test("parses this card in hand gets cost -N as costReduction", () => {
    const [effect] = parseEffect(
      "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.",
    );

    expect(effect.directives).toEqual([
      { action: { action: "costReduction", amount: 1, target: { owner: "self", zone: "hand" } } },
    ]);
  });
});

describe("first opponent shield destruction", () => {
  test("uses the hidden-information-safe first-shield primitive", () => {
    const [effect] = parseEffect(
      "【Main】Choose 1 enemy player. Destroy the first 2 cards in that player's shield area.",
    );

    expect(effect.directives).toEqual([
      { action: { action: "destroyTopOpponentShields", count: 2 } },
    ]);
  });
});

describe("selected Unit paired-Pilot condition", () => {
  test("checks the selected Unit's paired Pilot before drawing", () => {
    const [effect] = parseEffect(
      "【Action】Choose 1 friendly (Academy) Unit. It recovers 2 HP. Then, if it is paired with a Pilot that is Lv.3 or lower, draw 1.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "recoverHP",
          amount: 2,
          target: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "academy" }],
          },
        },
      },
      {
        action: {
          action: "drawIfTargetMatches",
          count: 1,
          target: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            attributeFilters: [
              { attribute: "trait", comparison: "includes", value: "academy" },
              { attribute: "pairedPilotLevel", comparison: "lte", value: 3 },
            ],
          },
        },
      },
    ]);
  });
});

describe("mill then trait-count damage", () => {
  test("defers the AP-bounded damage target until after milling", () => {
    const [effect] = parseEffect(
      "【Main】Place the top 2 cards of your deck into your trash. If you do, choose 1 enemy Unit with 4 or less AP. Deal an amount of damage equal to the number of (Minerva Squad) cards placed with this effect to that enemy Unit.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "millDeckThenDamageByTraitCount",
          count: 2,
          owner: "self",
          traits: "minerva squad",
          target: {
            owner: "opponent",
            cardType: "unit",
            count: 1,
            attributeFilters: [{ attribute: "ap", comparison: "lte", value: 4 }],
          },
        },
      },
    ]);
  });
});

describe("chosen attacker delayed battle-damage trigger", () => {
  test("destroys only an enemy Unit within the printed level bound", () => {
    const [effect] = parseEffect(
      "【Main】Choose 1 of your Units. When it deals battle damage to an enemy Unit that is Lv.5 or lower during this turn, destroy that enemy Unit.",
    );

    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "createDelayedTrigger",
          duration: "thisTurn",
          eventType: "battleDamageDealtToUnit",
          eventSourceFilter: { owner: "friendly", cardType: "unit", count: 1 },
          eventCardFilter: {
            owner: "opponent",
            cardType: "unit",
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
          },
          effect: {
            activation: { timing: ["onBattleDamageDealtToUnit"] },
            directives: [{ action: { action: "destroyEventCard" } }],
          },
        },
      },
    ]);
  });
});

describe("chosen trait delayed battle draw", () => {
  test("preserves the selected attacker and resolution-time hand gate", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 of your (Mafty) Units. When it destroys an enemy Unit with battle damage during this turn, if you have 3 or less cards in your hand, draw 1.",
    );

    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "createDelayedTrigger",
          duration: "thisTurn",
          eventType: "attackerDestroyedDefender",
          eventSourceFilter: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "mafty" }],
          },
          effect: {
            activation: {
              timing: ["onDestroyByBattle"],
              conditions: [{ type: "handCount", owner: "friendly", comparison: "lte", count: 3 }],
            },
            directives: [{ action: { action: "draw", count: 1 } }],
          },
        },
      },
    ]);
  });
});

describe("damage-step-only battle", () => {
  test("stages a chosen enemy Unit battle without attack, block, or action steps", () => {
    const [effect] = parseEffect(
      "【When Paired】Choose 1 enemy Unit. Begin a battle between this Unit and it and only perform the damage step.",
      "unit",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "beginDamageStepBattle",
          target: { owner: "opponent", cardType: "unit", zone: "battleArea", count: 1 },
        },
      },
    ]);
  });

  test("stages the battle after an optional trait-trash exile succeeds", () => {
    const [effect] = parseEffect(
      "【When Paired】You may choose 3 (Londo Bell) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit. Begin a battle between this Unit and it and only perform the damage step.",
      "unit",
    );

    expect(effect.directives).toMatchObject([
      {
        optional: true,
        action: {
          action: "resolveThenQueue",
          first: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 3,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "londo bell" },
              ],
            },
          },
          followUp: {
            directives: [
              {
                action: {
                  action: "beginDamageStepBattle",
                  target: { owner: "opponent", cardType: "unit", zone: "battleArea", count: 1 },
                },
              },
            ],
          },
        },
      },
    ]);
  });
});
