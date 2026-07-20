/**
 * Tests for multi-segment effect text: cards with multiple 【Keyword】 blocks
 * that produce multiple CardEffect entries.
 */
import { describe, expect, test } from "vite-plus/test";
import { parseEffect } from "../../scripts/parseEffect.ts";

describe("multi-segment effects", () => {
  test("During Pair keyword and following friendly-turn shield trigger remain separate", () => {
    const effects = parseEffect(
      "【During Pair】This Unit gains <High-Maneuver>.\n(This Unit can't be blocked.)\nDuring your turn, when this Unit destroys an enemy shield area card with battle damage, choose 1 enemy Unit. Deal 2 damage to it.",
    );
    expect(effects).toHaveLength(2);
    expect(effects[0]).toMatchObject({
      type: "constant",
      activation: { conditions: [{ type: "duringPair" }] },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
    });
    expect(effects[1]).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["onShieldAreaCardDestroyByBattle"],
        conditions: [{ type: "isTurn", whose: "friendly" }, { type: "eventCardIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
    });
  });

  test("Activate Main Support reminder is represented only as a printed keyword", () => {
    expect(
      parseEffect(
        "【Activate·Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
      ),
    ).toEqual([]);
  });

  test("two timing blocks produce two CardEffect entries", () => {
    const effects = parseEffect("【Deploy】 Draw 1.\n【Main】②：Discard 1.");
    expect(effects).toHaveLength(2);
    expect(effects[0].activation.timing).toEqual(["deploy"]);
    expect(effects[1].activation.timing).toEqual(["main"]);
  });

  test("Burst + Main block produces Triggered then Command", () => {
    const effects = parseEffect(
      "【Burst】 Add this card to your hand.\n【Main】②：Deploy 1 Unit card from your hand.",
    );
    expect(effects).toHaveLength(2);
    expect(effects[0].type).toBe("triggered");
    expect(effects[0].activation.timing).toContain("burst");
    expect(effects[1].type).toBe("command");
  });

  test("standalone keyword followed by timing block drops the keyword and keeps the timing effect", () => {
    // <Blocker> is a printed card keyword — it belongs in card.keywordEffects,
    // not in the effects array. parseEffect must drop the standalone segment.
    const effects = parseEffect("<Blocker>\n【Deploy】 Draw 1.");
    expect(effects).toHaveLength(1);
    expect(effects[0].type).toBe("triggered");
    expect(effects[0].activation.timing).toEqual(["deploy"]);
  });

  test("While condition followed by timing block produces two effects", () => {
    const effects = parseEffect(
      "While this Unit is damaged, it gets AP+1 this turn.\n【Deploy】 Draw 1.",
    );
    expect(effects).toHaveLength(2);
    expect(effects[0].type).toBe("constant");
    expect(effects[1].type).toBe("triggered");
  });

  test("three timing blocks produce three CardEffect entries", () => {
    const effects = parseEffect("【Burst】 Draw 1.\n【Deploy】 Draw 1.\n【Main】②：Discard 1.");
    expect(effects).toHaveLength(3);
  });

  test("Activate + During Pair block produces Activated + Constant", () => {
    const effects = parseEffect(
      "【Activate·Main】Rest this Base：Draw 1.\n【During Pair】 It gets AP+1 this turn.",
    );
    expect(effects).toHaveLength(2);
    expect(effects[0].type).toBe("activated");
    expect(effects[1].type).toBe("constant");
  });

  test("HTML br tags are treated as segment separators", () => {
    const effects = parseEffect("【Deploy】 Draw 1.<br>【Main】②：Discard 1.");
    expect(effects).toHaveLength(2);
  });

  test("each effect preserves its sourceText", () => {
    const effects = parseEffect("【Deploy】 Draw 1.\n【Main】②：Discard 1.");
    expect(effects[0].sourceText).toContain("Deploy");
    expect(effects[1].sourceText).toContain("Main");
  });
});

describe("multi-step single segment", () => {
  test("conditional token alternatives become a choose-one directive", () => {
    const [effect] = parseEffect(
      "【Main】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Sword Strike Gundam]((Earth Alliance)·AP4·HP2·<Blocker>) or 1 [Launcher Strike Gundam]((Earth Alliance)·AP2·HP4·<Blocker>) Unit token.",
    );
    expect(effect.directives[0]).toMatchObject({
      condition: {
        type: "unitCount",
        owner: "friendly",
        comparison: "eq",
        count: 0,
        hasTrait: "earth alliance",
        isToken: true,
      },
      thenDirectives: [
        {
          kind: "chooseOne",
          options: [
            {
              label: "Sword Strike Gundam",
              directives: [
                {
                  action: {
                    action: "deployToken",
                    token: { name: "Sword Strike Gundam", ap: 4, hp: 2 },
                  },
                },
              ],
            },
            {
              label: "Launcher Strike Gundam",
              directives: [
                {
                  action: {
                    action: "deployToken",
                    token: { name: "Launcher Strike Gundam", ap: 2, hp: 4 },
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("only the High-Maneuver half of a combined Attack effect is Link-qualified", () => {
    const [effect] = parseEffect(
      "【Attack】During this turn, this Unit gets AP+1 and, if it is a Link Unit, it gains <High-Maneuver>. (This Unit can't be blocked.)",
    );
    expect(effect.directives).toEqual([
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: 1,
          duration: "thisTurn",
          target: { owner: "self", cardType: "unit" },
        },
      },
      {
        action: {
          action: "grantKeyword",
          keyword: "HighManeuver",
          duration: "thisTurn",
          target: { owner: "self", cardType: "unit", isLinkUnit: true },
        },
      },
    ]);
  });

  test("White Base token text becomes a complete three-way unit-count branch", () => {
    const [effect] = parseEffect(
      "【Activate·Main】Rest this Base：Deploy 1 [Gundam]((White Base Team)·AP3·HP3) Unit token if you have no Units in play, deploy 1 [Guncannon]((White Base Team)·AP2·HP3) Unit token if you have only 1 Unit in play, or deploy 1 [Guntank]((White Base Team)·AP2·HP4) Unit token if you have 2 or more Units in play.",
    );

    const zeroUnits = effect.directives[0];
    expect(zeroUnits).toMatchObject({
      condition: { type: "unitCount", owner: "friendly", comparison: "eq", count: 0 },
      thenDirectives: [
        { action: { action: "deployToken", token: { name: "Gundam", ap: 3, hp: 3 } } },
      ],
    });

    const oneUnit = (zeroUnits as { elseDirectives: unknown[] }).elseDirectives[0];
    expect(oneUnit).toMatchObject({
      condition: { type: "unitCount", owner: "friendly", comparison: "eq", count: 1 },
      thenDirectives: [
        { action: { action: "deployToken", token: { name: "Guncannon", ap: 2, hp: 3 } } },
      ],
    });

    const twoOrMore = (oneUnit as { elseDirectives: unknown[] }).elseDirectives[0];
    expect(twoOrMore).toMatchObject({
      condition: { type: "unitCount", owner: "friendly", comparison: "gte", count: 2 },
      thenDirectives: [
        { action: { action: "deployToken", token: { name: "Guntank", ap: 2, hp: 4 } } },
      ],
    });
  });

  test("Draw then Discard in one segment produces two steps", () => {
    const [effect] = parseEffect("【Deploy】 Draw 2. Discard 1.");
    expect(effect.directives).toHaveLength(2);
    expect(effect.directives[0]).toMatchObject({ action: { action: "draw", count: 2 } });
    expect(effect.directives[1]).toMatchObject({ action: { action: "discard", count: 1 } });
  });

  test("Choose + action produce the action with target applied", () => {
    const [effect] = parseEffect("【Main】②：Choose 1 enemy Unit. Rest it.");
    const restStep = effect.directives.find(
      (s) => "action" in s && (s as any).action.action === "rest",
    );
    expect(restStep).toBeDefined();
    expect(restStep).toMatchObject({
      action: { action: "rest", target: { owner: "opponent" } },
    });
  });

  test("'instead' clause merges with previous conditional into nested if/else", () => {
    const [effect] = parseEffect(
      '【Deploy】 Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 [Tallgeese]((OZ)·AP4·HP2) Unit token. If it is your turn and a card with "Corsica Base" in its card name is in your trash, deploy 2 [Leo]((OZ)·AP1·HP1) Unit tokens instead.',
    );
    expect(effect.directives).toHaveLength(2);
    expect(effect.directives[0]).toMatchObject({ action: { action: "addShieldToHand", count: 1 } });
    // Outer condition: isTurn friendly
    const outerBranch = effect.directives[1];
    expect(outerBranch).toMatchObject({
      condition: { type: "isTurn", whose: "friendly" },
    });
    // Inner condition: cardInZone with hasName
    const innerBranch = (outerBranch as { thenDirectives: unknown[] }).thenDirectives[0];
    expect(innerBranch).toMatchObject({
      condition: {
        type: "cardInZone",
        owner: "friendly",
        zone: "trash",
        hasName: "Corsica Base",
      },
    });
    // thenSteps: deploy 2 Leo tokens
    expect((innerBranch as { thenDirectives: unknown[] }).thenDirectives[0]).toMatchObject({
      action: {
        action: "deployToken",
        token: { name: "Leo", traits: ["oz"], ap: 1, hp: 1 },
        count: 2,
      },
    });
    // elseDirectives: deploy 1 Tallgeese token
    expect((innerBranch as { elseDirectives: unknown[] }).elseDirectives[0]).toMatchObject({
      action: { action: "deployToken", token: { name: "Tallgeese", traits: ["oz"], ap: 4, hp: 2 } },
    });
  });

  test("Once per Turn link observer grants the keyword to the exact event card", () => {
    const effects = parseEffect(
      "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n【Once per Turn】When a friendly (Clan) Unit links, it gains <Breach 3> during this turn.",
    );
    expect(effects).toHaveLength(3);
    expect(effects[2]).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
        conditions: [
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "clan" }],
            },
          },
        ],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "grantKeywordEventCard",
            keyword: "Breach",
            keywordValue: 3,
            duration: "thisTurn",
          },
        },
      ],
    });
  });

  test("ST07-009 preserves the 7-card instead branch and temporary duration", () => {
    const effects = parseEffect(
      "【Burst】Add this card to your hand.\n【Attack】This Unit gets AP+1 during this turn. If there are 7 or more (CB) cards in your trash, all your (CB) Units get AP+1 instead.",
      "pilot",
    );
    expect(effects[1]).toMatchObject({
      activation: { timing: ["attack"] },
      directives: [
        {
          condition: {
            type: "cardInZone",
            zone: "trash",
            comparison: "gte",
            count: 7,
            hasTrait: "cb",
          },
          thenDirectives: [
            {
              action: {
                action: "statModifier",
                duration: "thisTurn",
                target: { owner: "friendly", cardType: "unit" },
              },
            },
          ],
          elseDirectives: [
            {
              action: {
                action: "statModifier",
                duration: "thisTurn",
                target: { owner: "self", cardType: "unit" },
              },
            },
          ],
        },
      ],
    });
  });

  test("ST07-010 promotes paired-host trait gates and keeps the turn branch", () => {
    const effects = parseEffect(
      "【Burst】Add this card to your hand.\n【Destroyed】If it is your opponent's turn and this is a (CB) Unit, draw 1.",
      "pilot",
    );
    expect(effects[1]).toMatchObject({
      activation: {
        timing: ["destroyed"],
        conditions: [{ type: "duringPair" }, { type: "selfHasTrait", trait: "cb" }],
      },
      directives: [
        {
          condition: { type: "isTurn", whose: "opponent" },
          thenDirectives: [{ action: { action: "draw", count: 1 } }],
        },
      ],
    });
  });

  test("ST07-011 grants the exact paired Unit a bounded attack-target permission", () => {
    const effects = parseEffect(
      "【Burst】Add this card to your hand.\n【When Paired】If this is a (CB) Unit, it may choose an active enemy Unit whose Lv. is equal to or lower than this Unit as its attack target during this turn.",
      "pilot",
    );
    expect(effects[1]).toMatchObject({
      activation: {
        timing: ["whenPaired"],
        conditions: [{ type: "duringPair" }, { type: "selfHasTrait", trait: "cb" }],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: { owner: "self", cardType: "unit" },
            attackTarget: { owner: "opponent", cardType: "unit", state: "active" },
            duration: "thisTurn",
          },
        },
      ],
    });
  });

  test("ST06-007 applies attack-target permission to the selected other Clan Unit", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 of your other (Clan) Units. During this turn, it may choose an active enemy Unit with 3 or less AP as its attack target.",
      "unit",
    );
    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "chooseAttackTarget",
          unit: {
            owner: "friendly",
            cardType: "unit",
            count: 1,
            excludeSource: true,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "clan" }],
          },
          attackTarget: { owner: "opponent", cardType: "unit", state: "active" },
          duration: "thisTurn",
        },
      },
    ]);
  });

  test("ST06-009 parses the conditional single-card Clan tutor", () => {
    const effects = parseEffect(
      "【Burst】Add this card to your hand.\n【When Linked】Look at the top card of your deck. If it is a (Clan) card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.",
      "pilot",
    );
    expect(effects[1]).toMatchObject({
      activation: { timing: ["whenLinked"] },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 1,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "clan" }],
            },
          },
        },
      ],
    });
  });

  test("ST06-010 keeps the Link gate and top-or-bottom deck routing", () => {
    const effects = parseEffect(
      "【Burst】Add this card to your hand.\n【During Link】【Attack】If you have a (Clan) Unit in play, look at the top card of your deck. Return it to the top or bottom of your deck.",
      "pilot",
    );
    expect(effects[1]).toMatchObject({
      activation: { timing: ["attack"], conditions: [{ type: "duringLink" }] },
      directives: [
        {
          condition: { type: "unitCount", hasTrait: "clan", comparison: "gte", count: 1 },
          thenDirectives: [
            { action: { action: "lookAtTopDeck", count: 1, return: "topAndBottom" } },
          ],
        },
      ],
    });
  });

  test("ST06-012 parses the mixed Unit/Pilot Clan tutor and random bottom", () => {
    const [effect] = parseEffect(
      "【Main】Look at the top 3 cards of your deck. You may reveal 1 (Clan) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
      "command",
    );
    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "lookAtTopDeck",
          count: 3,
          return: "chooseTop",
          randomizeRemainingToBottom: true,
          tutorFilter: {
            owner: "friendly",
            count: 1,
            cardType: ["unit", "pilot"],
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "clan" }],
          },
        },
      },
    ]);
  });

  test("ST08-004 promotes the enemy-Unit attack gate and preserves the chosen target", () => {
    const [effect] = parseEffect(
      "【Attack】If this Unit is attacking an enemy Unit, choose 1 enemy Unit. Deal 1 damage to it.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: { timing: ["attack"], conditions: [{ type: "isAttackingUnit" }] },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
    });
  });

  test("ST08-006 keeps the hand-to-bottom cost inside the direct-attack branch", () => {
    const [effect] = parseEffect(
      "【During Pair】【Attack】【Once per Turn】If this Unit is attacking the enemy player, reveal 1 (Earth Federation) Unit card from your hand. Return it to the bottom of your deck. If you do, draw 2.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringPair" }],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          condition: { type: "isAttackingPlayer" },
          thenDirectives: [
            {
              action: {
                action: "returnToDeck",
                position: "bottom",
                target: {
                  owner: "friendly",
                  zone: "hand",
                  cardType: "unit",
                  count: 1,
                },
              },
            },
            { action: { action: "draw", count: 2 }, dependsOnPrevious: true },
          ],
        },
      ],
    });
  });

  test("ST08-009 applies next-start ready suppression to the selected rested Unit", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 rested enemy Unit that is Lv.2 or lower. It won' t be set as active during the start phase of your opponent' s next turn.",
      "unit",
    );
    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "preventActive",
          target: {
            owner: "opponent",
            cardType: "unit",
            count: 1,
            state: "rested",
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
          },
        },
      },
    ]);
  });

  test("ST08-010 grants the chosen friendly Mafty Unit exact attack-target permission", () => {
    const effects = parseEffect(
      "【Burst】Add this card to your hand.\n【When Paired】If this is a (Mafty) Unit, choose 1 of your (Mafty) Units. During this turn, it may choose a damaged active enemy Unit as its attack target.",
      "pilot",
    );
    expect(effects[1]).toMatchObject({
      activation: {
        timing: ["whenPaired"],
        conditions: [{ type: "duringPair" }, { type: "selfHasTrait", trait: "mafty" }],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: { owner: "friendly", cardType: "unit", count: 1 },
            attackTarget: { owner: "opponent", cardType: "unit", state: ["damaged", "active"] },
            duration: "thisTurn",
          },
        },
      ],
    });
  });

  test("ST08-011 splits the draw observer from Burst and qualifies its linked blue Unit", () => {
    const effects = parseEffect(
      "【Burst】Add this card to your hand.\nWhen you draw with an effect, if this is a blue Unit, it gains <High-Maneuver> during this turn.\n(This Unit can't be blocked.)",
      "pilot",
    );
    expect(effects).toHaveLength(2);
    expect(effects[1]).toMatchObject({
      activation: {
        timing: ["onDrawByEffect"],
        conditions: [{ type: "eventPlayerIsSelf" }, { type: "linkedUnitHasColor", color: "blue" }],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "HighManeuver",
            duration: "thisTurn",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
    });
  });

  test("ST08-013 preserves the linked-Mafty 2-damage instead branch and original target", () => {
    const [effect] = parseEffect(
      "【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it. If a friendly (Mafty) Link Unit is in play, deal 2 damage instead.",
      "command",
    );
    expect(effect.directives).toMatchObject([
      {
        condition: {
          type: "unitCount",
          hasTrait: "mafty",
          isLinkUnit: true,
          comparison: "gte",
          count: 1,
        },
        thenDirectives: [
          {
            action: {
              action: "dealDamage",
              amount: 2,
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        elseDirectives: [
          {
            action: {
              action: "dealDamage",
              amount: 1,
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
      },
    ]);
  });

  test("ST07-012 requires a friendly CB Link Unit for battle-damage prevention", () => {
    const effects = parseEffect(
      "【Burst】Add this card to your hand.\nDuring your turn, while you have a (CB) Link Unit in play, this Unit can't receive battle damage from enemy Units with 3 or less AP.",
      "pilot",
    );
    expect(effects[1]).toMatchObject({
      activation: {
        conditions: [
          { type: "isTurn", whose: "friendly" },
          { type: "unitCount", hasTrait: "cb", isLinkUnit: true, comparison: "gte", count: 1 },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            damageType: "battle",
            target: { owner: "self" },
            unitFilter: { owner: "opponent", cardType: "unit" },
          },
        },
      ],
    });
  });

  test("ST07-015 parses the rested-CB gate and non-token Lv3 source filter", () => {
    const effects = parseEffect(
      "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\nWhile a rested friendly (CB) Unit is in play, this Base can't receive damage from enemy Units that are Lv.3 or lower, other than Unit tokens.",
      "base",
    );
    expect(effects[2]).toMatchObject({
      activation: {
        conditions: [
          { type: "unitCount", hasTrait: "cb", state: "rested", comparison: "gte", count: 1 },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: { owner: "self" },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              isToken: false,
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 3 }],
            },
          },
        },
      ],
    });
  });

  test("ST08-001 parses dynamic hand reductions and highest-level damage targeting", () => {
    const effects = parseEffect(
      "While you have no Units that are Lv.6 or higher in play, this card in your hand gets Lv. -1 and cost -1 for each enemy Unit in play.\n【When Paired】Choose 1 enemy Unit with the highest Lv. Deal 3 damage to it.",
      "unit",
    );
    expect(effects[0]).toMatchObject({
      activation: {
        conditions: [
          {
            type: "cardInZone",
            zone: "battleArea",
            cardType: "unit",
            comparison: "eq",
            count: 0,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "levelReductionByCount",
            amountPerMatch: 1,
            countFilter: { owner: "opponent", cardType: "unit", zone: "battleArea" },
            target: { owner: "self", cardType: "unit", zone: "hand" },
          },
        },
        {
          action: {
            action: "costReductionByCount",
            amountPerMatch: 1,
            countFilter: { owner: "opponent", cardType: "unit", zone: "battleArea" },
            target: { owner: "self", cardType: "unit", zone: "hand" },
          },
        },
      ],
    });
    expect(effects[1]).toMatchObject({
      activation: { timing: ["whenPaired"] },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 3,
            target: { owner: "opponent", cardType: "unit", count: 1, highest: "level" },
          },
        },
      ],
    });
  });

  test("ST09-002 preserves the Minerva Squad filter and Force Impulse name exclusion", () => {
    const [effect] = parseEffect(
      '【Destroyed】Choose 1 (Minerva Squad) Unit card without "Force Impulse Gundam" in its card name from your trash. Add it to your hand.',
      "unit",
    );
    const directive = effect.directives[0];
    expect(directive).toMatchObject({
      action: {
        action: "addFromTrash",
        target: { owner: "friendly", cardType: "unit", zone: "trash", count: 1 },
      },
    });
    if (!("action" in directive) || directive.action.action !== "addFromTrash") {
      throw new Error("Expected addFromTrash directive");
    }
    expect(directive.action.target.attributeFilters).toEqual(
      expect.arrayContaining([
        { attribute: "trait", comparison: "includes", value: "minerva squad" },
        { attribute: "name", comparison: "excludes", value: "Force Impulse Gundam" },
      ]),
    );
  });

  test("ST09-003 retains the purple-card trash threshold", () => {
    const [effect] = parseEffect(
      "【When Linked】If there are 5 or more purple cards in your trash, deal 2 damage to all Units with 5 or less AP.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["whenLinked"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 5,
            hasColor: "purple",
          },
        ],
      },
      directives: [{ action: { action: "dealDamageAll", amount: 2 } }],
    });
  });

  test("ST09-004 retains the friendly-Base gate on Suppression", () => {
    const [effect] = parseEffect(
      "While a friendly Base in play, this Unit gains <Suppression>.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: { conditions: [{ type: "friendlyBaseInPlay" }] },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Suppression",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
    });
  });

  test("ST09-006 promotes deploy-from-trash and keeps the chosen enemy Lv3 target", () => {
    const [effect] = parseEffect(
      "【Deploy】If you deploy this Unit from your trash, choose 1 enemy Unit that is Lv.3 or lower. Destroy it.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "deployedFromZone", zone: "trash" }],
      },
      directives: [
        {
          action: {
            action: "destroy",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 3 }],
            },
          },
        },
      ],
    });
  });

  test("ST09-001 parses both activation costs and the bounded Impulse trash deploy", () => {
    const [effect] = parseEffect(
      '【Activate·Main】②, return this Unit to the bottom of its owner\'s deck：Choose 1 Unit card with "Impulse Gundam" in its card name that is Lv.4 or higher from your trash. Deploy it.',
      "unit",
    );
    expect(effect).toMatchObject({
      type: "activated",
      activation: { timing: ["activate:main"] },
      cost: { payResources: 2, returnSelfToDeck: "bottom" },
      directives: [
        {
          action: {
            action: "deploy",
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "trash",
              count: 1,
              attributeFilters: [
                { attribute: "name", comparison: "includes", value: "Impulse Gundam" },
                { attribute: "level", comparison: "gte", value: 4 },
              ],
            },
          },
        },
      ],
    });
  });

  test("ST09-010 keeps the remaining-card-to-trash routing inside the turn branch", () => {
    const effects = parseEffect(
      "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, look at the top 2 cards of your deck and return 1 to the top. Place the remaining card into your trash.",
      "base",
    );
    expect(effects[1]).toMatchObject({
      activation: { timing: ["deploy"] },
      directives: [
        { action: { action: "addShieldToHand", count: 1 } },
        {
          condition: { type: "isTurn", whose: "friendly" },
          thenDirectives: [
            {
              action: {
                action: "lookAtTopDeck",
                count: 2,
                return: "chooseTop",
                remainingDestination: "trash",
              },
            },
          ],
        },
      ],
    });
  });
});
