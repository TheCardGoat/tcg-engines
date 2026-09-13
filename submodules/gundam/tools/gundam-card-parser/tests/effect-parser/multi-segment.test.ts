/**
 * Tests for multi-segment effect text: cards with multiple 【Keyword】 blocks
 * that produce multiple CardEffect entries.
 */
import { describe, expect, test } from "vite-plus/test";
import { parseEffect } from "../../scripts/parseEffect.ts";

describe("multi-segment effects", () => {
  test("gates an optional hand-Pilot pairing on a friendly Base condition", () => {
    const [effect] = parseEffect(
      "【Deploy】If a friendly white Base is in play, you may pair 1 (AEUG) Pilot card from your hand with this Unit.",
      "unit",
    );

    expect(effect).toMatchObject({
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "friendlyBaseInPlay", color: "white" }],
      },
      directives: [
        {
          action: {
            action: "pairPilot",
            target: {
              owner: "friendly",
              zone: "hand",
              cardType: "pilot",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "aeug" }],
            },
          },
          optional: true,
        },
      ],
    });
  });

  test("parses a named host's pairing-cost override as a continuous substitution", () => {
    const [effect] = parseEffect(
      'When playing this card from your hand and pairing it with a Unit with "Gundam NT-1" in its card name, play this card as if it has 0 cost.',
      "pilot",
    );

    expect(effect).toEqual({
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "pairingCostOverride",
            cost: 0,
            unit: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                { attribute: "name", comparison: "includes", value: "Gundam NT-1" },
              ],
            },
          },
        },
      ],
      sourceText:
        'When playing this card from your hand and pairing it with a Unit with "Gundam NT-1" in its card name, play this card as if it has 0 cost.',
    });
  });

  test("separates a Burst from a following untimed self-stat effect", () => {
    const effects = parseEffect(
      "【Burst】Add this card to your hand.\nIncrease this Unit's AP by an amount equal to the number of (Cyclops Team) Pilot cards/Command cards with unique names in your trash.",
      "pilot",
    );

    expect(effects).toHaveLength(2);
    expect(effects[0]).toMatchObject({
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "addSelfToHand" } }],
    });
    expect(effects[1]).toMatchObject({
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "statModifierByUniqueNameCount",
            stat: "ap",
            amountPerUniqueName: 1,
          },
        },
      ],
    });
  });

  test("separates Burst from an untimed rested-unit conditional keyword", () => {
    const effects = parseEffect(
      "【Burst】Add this card to your hand.\nIf there are 2 or more other rested Units in play, this Unit gains <Repair 2>.",
      "pilot",
    );

    expect(effects).toHaveLength(2);
    expect(effects[1]).toMatchObject({
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "any",
            count: 2,
            state: "rested",
            excludeSelf: true,
          },
        ],
      },
      directives: [{ action: { action: "grantKeyword", keyword: "Repair", keywordValue: 2 } }],
    });
  });

  test("separates Burst from a named-unit continuous bonus without double-buffing its host", () => {
    const effects = parseEffect(
      '【Burst】Add this card to your hand.\nThis Unit and all your Units with "Gundam Lfrith" or "Gundnode" in their card name get AP+1.',
      "pilot",
    );

    expect(effects).toHaveLength(2);
    expect(effects[1]).toMatchObject({
      type: "constant",
      directives: [
        { action: { action: "statModifier", target: { owner: "self", cardType: "unit" } } },
        {
          action: {
            action: "statModifier",
            target: {
              owner: "friendly",
              excludeSource: true,
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "name", comparison: "includes", value: "Gundam Lfrith" },
                    { attribute: "name", comparison: "includes", value: "Gundnode" },
                  ],
                },
              ],
            },
          },
        },
      ],
    });
  });

  test("separates an opponent-turn once-per-turn observer from a preceding Deploy effect", () => {
    const effects = parseEffect(
      "【Deploy】Add 1 of your Shields to your hand.\n【Once per Turn】During your opponent's turn, when one of your Units is rested by one of your opponent's effects, choose 1 enemy Unit. Deal 1 damage to it.",
      "base",
    );

    expect(effects).toHaveLength(2);
    expect(effects[1]).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["onRestedByEnemyEffect"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          { type: "isTurn", whose: "opponent" },
          { type: "eventPlayerIsOpponent" },
          { type: "eventCardMatches", target: { owner: "friendly", cardType: "unit" } },
        ],
      },
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

  test("lifts a linked Pilot's qualified Unit trait into its constant activation", () => {
    const [effect] = parseEffect(
      "【During Link】If this is an (AGE System) Unit, it gets AP+1 and <Breach 1>.",
    );

    expect(effect).toMatchObject({
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }, { type: "linkedUnitHasTrait", trait: "age system" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            target: { owner: "self", cardType: "unit" },
          },
        },
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 1,
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
    });
  });

  test("uses the chosen Unit's trait to gate a following draw", () => {
    const [effect] = parseEffect(
      "【When Linked】Choose 1 of your other Units. It gains <Repair 2> during this turn. Then, if it is a (Jupitris) Unit, draw 1. (At the end of your turn, this Unit recovers the specified number of HP.)",
      "pilot",
    );

    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "grantKeyword",
          keyword: "Repair",
          keywordValue: 2,
          duration: "thisTurn",
          target: {
            owner: "friendly",
            cardType: "unit",
            excludeSource: true,
            count: 1,
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
            excludeSource: true,
            count: 1,
            attributeFilters: [{ attribute: "trait", comparison: "includes", value: "jupitris" }],
          },
        },
      },
    ]);
  });

  test("keeps a battling opponent predicate on a conditional self keyword grant", () => {
    const [effect] = parseEffect(
      "During your turn, while this Unit is battling an enemy Unit with a 【Destroyed】 effect, it gains <First Strike>.",
    );
    expect(effect).toMatchObject({
      type: "constant",
      activation: { conditions: [{ type: "isTurn", whose: "friendly" }] },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            target: {
              owner: "self",
              cardType: "unit",
              isBattling: {
                opponentMatches: {
                  owner: "opponent",
                  cardType: "unit",
                  attributeFilters: [
                    { attribute: "effectTiming", comparison: "includes", value: "destroyed" },
                  ],
                },
              },
            },
          },
        },
      ],
    });
  });

  test("keeps destroy-self separate from the chosen enemy damage target", () => {
    const [effect] = parseEffect(
      "【Activate･Main】Rest this Unit：Destroy this and choose 1 enemy Unit that is Lv.5 or lower. Deal 1 damage to it.",
    );
    expect(effect.directives).toMatchObject([
      { action: { action: "destroy", target: { owner: "self", cardType: "unit", count: 1 } } },
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

  test("parses observer triggers for deployment, EX Resources, and Command activation", () => {
    const [deployment] = parseEffect(
      "When another friendly (G Generation) Unit that is Lv.3 is deployed, this Unit gains <Breach 1> during this turn.",
    );
    const [exResource] = parseEffect(
      "When you place an EX Resource, choose 1 of your (AGE System) Units. It gains <High-Maneuver> during this turn.",
    );
    const [command] = parseEffect(
      "When you activate a Command's 【Main】/【Action】 effect, choose 1 enemy Unit. It gets AP-2 during this turn.",
    );

    expect(deployment).toMatchObject({
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [{ action: { action: "grantKeyword", keyword: "Breach", keywordValue: 1 } }],
    });
    expect(exResource.activation).toMatchObject({
      timing: ["onExResourcePlaced"],
      conditions: [{ type: "eventPlayerIsSelf" }],
    });
    expect(command.activation).toMatchObject({
      timing: ["onCommandEffectActivated"],
      conditions: [{ type: "eventPlayerIsSelf" }],
    });
  });

  test("keeps the controller and friendly Unit gates on paid Unit-effect observers", () => {
    const [effect] = parseEffect(
      "【Once per Turn】During your turn, when you pay ① or more for a friendly Unit's effect, this Base recovers 2 HP.",
    );

    expect(effect.activation).toEqual({
      timing: ["onUnitEffectCostPaid"],
      conditions: [
        { type: "isTurn", whose: "friendly" },
        { type: "eventPlayerIsSelf" },
        {
          type: "eventCardMatches",
          target: { owner: "friendly", cardType: "unit" },
        },
      ],
      restrictions: [{ type: "oncePerTurn" }],
    });
  });

  test("deduplicates end-of-turn observers after the first qualifying Unit-effect payment", () => {
    const [effect] = parseEffect(
      "【During Link】At the end of a turn where you have paid ① or more for one of your other (Militia)/(Dianna Counter) Units' effects, choose 1 of your (Militia) Units. Set it as active.",
    );

    expect(effect.activation).toEqual({
      timing: ["onUnitEffectCostPaid"],
      restrictions: [{ type: "oncePerTurn" }],
      conditions: [
        { type: "duringLink" },
        {
          type: "eventCardMatches",
          target: {
            owner: "friendly",
            cardType: "unit",
            excludeSource: true,
            attributeFilters: [
              {
                attribute: "or",
                filters: [
                  { attribute: "trait", comparison: "includes", value: "militia" },
                  {
                    attribute: "trait",
                    comparison: "includes",
                    value: "dianna counter",
                  },
                ],
              },
            ],
          },
        },
      ],
    });
  });

  test("requires the full optional trash-exile payment before offering a dependent rest", () => {
    const [effect] = parseEffect(
      "【Deploy】You may choose 2 (Titans) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit that is Lv.4 or lower. Rest it.",
    );

    expect(effect.activation).toEqual({
      timing: ["deploy"],
      conditions: [
        {
          type: "cardInZone",
          owner: "friendly",
          zone: "trash",
          comparison: "gte",
          count: 2,
          hasTrait: "titans",
        },
      ],
    });
    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "exile",
          target: { owner: "friendly", zone: "trash", count: 2 },
        },
        optional: true,
      },
      {
        action: {
          action: "rest",
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
        dependsOnPrevious: true,
      },
    ]);
  });

  test("parses another Unit attacking an enemy Unit as an event-source Breach grant", () => {
    const [effect] = parseEffect(
      "【Once per Turn】When another Unit attacks an enemy Unit, if this Unit is rested, the attacking Unit gains <Breach 2> during this battle.",
    );

    expect(effect).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          { type: "eventSourceMatches", target: { owner: "friendly", excludeSource: true } },
          { type: "eventAttackTargetsUnit" },
          { type: "selfIsRested" },
        ],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "grantKeywordEventSource",
            keyword: "Breach",
            keywordValue: 2,
            duration: "thisBattle",
          },
        },
      ],
    });
  });

  test("binds battle-damage destruction to the source Unit and damaged enemy", () => {
    const [effect] = parseEffect(
      "When this Unit deals battle damage to an enemy Unit that is Lv.5 or lower, if you have a (CB) Pilot in play, destroy that enemy Unit.",
    );

    expect(effect).toMatchObject({
      activation: {
        timing: ["onBattleDamageDealtToUnit"],
        conditions: [
          { type: "eventSourceIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
            },
          },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "pilot",
            hasTrait: "cb",
          },
        ],
      },
      directives: [{ action: { action: "destroyEventCard" } }],
    });
  });

  test("binds a friendly trait battle-damage return to the damaged enemy", () => {
    const [effect] = parseEffect(
      "【Once per Turn】During your turn, when your (Triple Ship Alliance) Unit deals battle damage to an enemy Unit, you may return the enemy Unit to its owner's hand.",
      "unit",
    );

    expect(effect).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["onBattleDamageDealtToUnit"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          {
            type: "eventSourceMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "triple ship alliance" },
              ],
            },
          },
          { type: "eventCardMatches", target: { owner: "opponent", cardType: "unit" } },
        ],
      },
      directives: [{ optional: true, action: { action: "returnEventCardToHand" } }],
    });
  });

  test("Development headers parse their optional exile and dependent effect", () => {
    const [effect] = parseEffect(
      "【Deploy・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\r\n■Choose 1 enemy Unit with 4 or less HP. Rest it.",
    );

    expect(effect).toMatchObject({
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 2,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
            },
          },
          optional: true,
        },
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 4 }],
            },
          },
          dependsOnPrevious: true,
        },
      ],
    });
  });

  test("parses a destroyed card's self-exile into a dependent named Base deployment", () => {
    const [effect] = parseEffect(
      '【Destroyed】You may exile this card in your trash from the game. If you do, you may deploy 1 Base card with "Presidential Office" in its card name from your hand.',
    );

    expect(effect.directives).toMatchObject([
      { action: { action: "exileSelf" }, optional: true },
      {
        action: {
          action: "deploy",
          target: {
            owner: "friendly",
            cardType: "base",
            zone: "hand",
            count: 1,
            attributeFilters: [
              { attribute: "name", comparison: "includes", value: "Presidential Office" },
            ],
          },
        },
        optional: true,
        dependsOnPrevious: true,
      },
    ]);
  });

  test("parses the named-friendly Unit count into a rested-deployment replacement", () => {
    const [effect] = parseEffect(
      'Count up the number of your Units with "Gundam Lfrith"/"Gundnode" in their card name, plus this Unit. All enemy Units whose Lv. is equal to or lower than that number are deployed rested.',
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "deployRestedByFriendlyNameCount",
          names: ["Gundam Lfrith", "Gundnode"],
          target: { owner: "opponent", cardType: "unit", isToken: false, count: "all" },
        },
      },
    ]);
  });

  test("parses battle-damage prevention against a battling enemy Blocker", () => {
    const [effect] = parseEffect(
      "During your turn, while this Unit is battling an enemy Unit with <Blocker>, this Unit can't receive battle damage.",
    );

    expect(effect).toMatchObject({
      type: "constant",
      activation: { conditions: [{ type: "isTurn", whose: "friendly" }] },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: { owner: "self", cardType: "unit" },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              hasKeyword: "Blocker",
              isBattling: true,
            },
            damageType: "battle",
          },
        },
      ],
    });
  });

  test("keeps the blocking enemy Unit's level limit on battle-damage prevention", () => {
    const [effect] = parseEffect(
      "When this Unit is blocked by an enemy Unit that is Lv.4 or lower, it can't receive battle damage during this battle.",
      "pilot",
    );

    expect(effect).toMatchObject({
      activation: { timing: ["onBlocked"], conditions: [{ type: "eventCardIsSelf" }] },
      directives: [
        {
          action: {
            action: "preventDamage",
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
            },
          },
        },
      ],
    });
  });

  test("returns damage to the bounded enemy Unit that dealt battle damage to this Base", () => {
    const [effect] = parseEffect(
      "When this Base receives battle damage from an enemy Unit with 3 or less AP, deal 1 damage to that Unit.",
      "base",
    );

    expect(effect).toMatchObject({
      activation: { timing: ["onBattleDamageReceived"], conditions: [{ type: "eventCardIsSelf" }] },
      directives: [
        {
          action: {
            action: "dealDamageEventSource",
            amount: 1,
            sourceFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 3 }],
            },
          },
        },
      ],
    });
  });

  test("grants an attack-time keyword only while battling a damaged enemy Unit", () => {
    const [effect] = parseEffect(
      "【Attack】If you are attacking a damaged enemy Unit, this Unit gains <Breach 3> during this battle. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
      "unit",
    );

    expect(effect).toMatchObject({
      type: "constant",
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 3,
            duration: "thisBattle",
            target: {
              owner: "self",
              cardType: "unit",
              isBattling: {
                opponentMatches: { owner: "opponent", cardType: "unit", state: "damaged" },
              },
            },
          },
        },
      ],
    });
  });

  test("adds a trash gate and keyword-bearing active enemy filter to a paired attack option", () => {
    const [effect] = parseEffect(
      "【During Pair･(Vulture) Pilot】If there are 7 or more cards in your trash, this Unit may choose an active enemy Unit with a keyword effect as its attack target.",
      "unit",
    );
    expect(effect).toMatchObject({
      type: "constant",
      activation: {
        conditions: [
          { type: "duringPair" },
          { type: "cardInZone", owner: "friendly", zone: "trash", comparison: "gte", count: 7 },
        ],
        qualification: { attribute: "trait", comparison: "includes", value: "vulture" },
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: { owner: "self", cardType: "unit", count: 1 },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              hasAnyKeyword: true,
            },
          },
        },
      ],
    });
  });

  test("parses a self-destruction cost and the battling enemy Base or Shield target", () => {
    const [effect] = parseEffect(
      "【Activate･Action】Destroy this Unit：Choose 1 enemy Base/enemy Shield this Unit is battling. Deal 6 damage to it.",
    );

    expect(effect).toEqual({
      type: "activated",
      activation: { timing: ["activate:action"] },
      cost: { destroySelf: true },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 6,
            target: {
              owner: "opponent",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "zone", comparison: "eq", value: "baseSection" },
                    { attribute: "zone", comparison: "eq", value: "shieldArea" },
                  ],
                },
              ],
              isBattling: true,
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Action】Destroy this Unit：Choose 1 enemy Base/enemy Shield this Unit is battling. Deal 6 damage to it.",
    });
  });

  test("parses one opponent-owned return choice per enemy player", () => {
    const [effect] = parseEffect(
      "【Deploy】Choose 1 Unit with 4 or less HP belonging to each enemy player. Return them to their owners' hands.",
    );
    expect(effect.directives).toMatchObject([
      {
        action: {
          action: "queueEffectForPlayers",
          scope: "opponents",
          effect: {
            directives: [
              {
                action: {
                  action: "returnToHand",
                  target: { owner: "friendly", cardType: "unit", count: 1 },
                },
              },
            ],
          },
        },
      },
    ]);
  });

  test("Development can draw then discard once per opposing player", () => {
    const [effect] = parseEffect(
      "【Deploy・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n■Draw a number of cards equal to the number of enemy players. Then, discard the same number of cards you drew with this effect.",
    );

    expect(effect.directives).toEqual([
      expect.objectContaining({ action: expect.objectContaining({ action: "exile" }) }),
      {
        action: { action: "drawThenDiscardByOpponentCount" },
        dependsOnPrevious: true,
      },
    ]);
  });

  test("one chosen Unit receives both recovery and the printed AP modifier", () => {
    const [effect] = parseEffect(
      "【Main】/【Action】Choose 1 (G Generation) Unit that is Lv.5 or higher. It recovers 2 HP and gets AP+2 during this turn.",
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "recoverHP",
          amount: 2,
          target: expect.objectContaining({ cardType: "unit", count: 1 }),
        },
      },
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: 2,
          duration: "thisTurn",
          target: expect.objectContaining({ cardType: "unit", count: 1 }),
        },
      },
    ]);
  });

  test("a card-in-play condition gates the action on the chosen enemy Unit", () => {
    const [effect] = parseEffect(
      "【Action】If a friendly (G Generation) Unit is in play, choose 1 enemy Unit. It gets AP-3 during this battle.",
    );

    expect(effect).toMatchObject({
      activation: {
        timing: ["action"],
        conditions: [{ type: "unitCount", owner: "friendly", hasTrait: "g generation" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -3,
            duration: "thisBattle",
            target: expect.objectContaining({ owner: "opponent", cardType: "unit", count: 1 }),
          },
        },
      ],
    });
  });

  test("draws before a named-trash conditional follow-up", () => {
    const [effect] = parseEffect(
      '【Main】Draw 1. Then, if there are 2 or more cards with "A Healthy Curiosity" in their card name in your trash, choose 1 enemy Unit with 4 or less HP. Rest it.',
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "draw", count: 1 },
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            cardType: "command",
            comparison: "gte",
            count: 2,
            hasName: "A Healthy Curiosity",
          },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "rest",
                  target: {
                    owner: "opponent",
                    cardType: "unit",
                    count: 1,
                    attributeFilters: [{ attribute: "hp", comparison: "lte", value: 4 }],
                  },
                },
              },
            ],
            sourceText: "Choose 1 enemy Unit with 4 or less HP. Rest it.",
          },
        },
      },
    ]);
  });

  test("broadens a damage target when enough named cards are in trash", () => {
    const [effect] = parseEffect(
      '【Main】/【Action】Choose 1 enemy Unit that is Lv.4 or lower. Deal 3 damage to it. If there are 2 or more cards with "Improved Technique" in their card name in your trash, choose 1 enemy Unit instead.',
    );

    expect(effect).toMatchObject({
      type: "command",
      activation: { timing: ["main", "action"] },
      directives: [
        {
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            cardType: "command",
            comparison: "gte",
            count: 2,
            hasName: "Improved Technique",
          },
          thenDirectives: [
            { action: { action: "dealDamage", amount: 3, target: { owner: "opponent" } } },
          ],
          elseDirectives: [
            {
              action: {
                action: "dealDamage",
                amount: 3,
                target: {
                  owner: "opponent",
                  attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
                },
              },
            },
          ],
        },
      ],
    });
  });

  test("gates an optional friendly Blocker grant behind the named-trash condition", () => {
    const [effect] = parseEffect(
      '【Action】Choose 1 rested enemy Unit that is Lv.4 or lower. Return it to its owner\'s hand. Then, if there are 2 or more cards with "Awakened Potential" in their card name in your trash, you may choose 1 friendly Unit. It gains <Blocker> during this turn.',
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "returnToHand",
          target: {
            owner: "opponent",
            cardType: "unit",
            state: "rested",
            count: 1,
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
          },
        },
      },
      {
        condition: {
          type: "cardInZone",
          owner: "friendly",
          zone: "trash",
          cardType: "command",
          comparison: "gte",
          count: 2,
          hasName: "Awakened Potential",
        },
        thenDirectives: [
          {
            action: {
              action: "grantKeyword",
              keyword: "Blocker",
              duration: "thisTurn",
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
            optional: true,
          },
        ],
      },
    ]);
  });

  test("parses optional named-Pilot pairing from hand", () => {
    const [effect] = parseEffect(
      '【Deploy】You may pair 1 Pilot card with "Ali al-Saachez" in its card name from your hand with this Unit.',
    );

    expect(effect.directives).toEqual([
      {
        action: {
          action: "pairPilot",
          target: {
            owner: "friendly",
            cardType: "pilot",
            zone: "hand",
            count: 1,
            attributeFilters: [
              { attribute: "name", comparison: "includes", value: "Ali al-Saachez" },
            ],
          },
        },
        optional: true,
      },
    ]);
  });

  test("a Command can declare a typed discard-for-level-and-cost substitution", () => {
    const effects = parseEffect(
      "When playing this card from your hand, you may discard 1 (G Generation) Unit card. If you do, play this card as if it has 2 Lv. and cost.\n【Main】Draw 2.",
    );

    expect(effects[0]).toEqual({
      type: "substitution",
      activation: {},
      directives: [
        {
          action: {
            action: "playCostSubstitution",
            level: 2,
            cost: 2,
            discardTarget: expect.objectContaining({
              owner: "friendly",
              zone: "hand",
              cardType: "unit",
              count: 1,
            }),
          },
        },
      ],
      sourceText:
        "When playing this card from your hand, you may discard 1 (G Generation) Unit card. If you do, play this card as if it has 2 Lv. and cost.",
    });
    expect(effects[1]?.directives).toEqual([{ action: { action: "draw", count: 2 } }]);
  });

  test("a Unit can declare an optional Link-Unit destruction substitution", () => {
    const [effect] = parseEffect(
      'When playing this card from your hand, you may destroy 1 of your Link Units with "Unicorn Mode" in its card name that is Lv.5. If you do, play this card as if it has 0 Lv. and cost.',
    );

    expect(effect).toEqual({
      type: "substitution",
      activation: {},
      directives: [
        {
          action: {
            action: "deployCostSubstitution",
            level: 0,
            cost: 0,
            destroyTarget: {
              owner: "friendly",
              zone: "battleArea",
              cardType: "unit",
              count: 1,
              isLinkUnit: true,
              attributeFilters: [
                { attribute: "name", comparison: "includes", value: "Unicorn Mode" },
                { attribute: "level", comparison: "eq", value: 5 },
              ],
            },
          },
          optional: true,
        },
      ],
      sourceText:
        'When playing this card from your hand, you may destroy 1 of your Link Units with "Unicorn Mode" in its card name that is Lv.5. If you do, play this card as if it has 0 Lv. and cost.',
    });
  });

  test("an optional chosen cost target makes its following action optional", () => {
    const [effect] = parseEffect(
      "【Deploy】You may choose 1 of your other active (Earth Alliance) Units. Rest it. If you do, choose 1 rested enemy Unit. Deal 2 damage to it.",
    );

    expect(effect.directives[0]).toMatchObject({
      action: { action: "rest", target: { owner: "friendly", cardType: "unit", count: 1 } },
      optional: true,
    });
    expect(effect.directives[1]).toMatchObject({
      action: { action: "dealDamage", amount: 2, target: { owner: "opponent" } },
      dependsOnPrevious: true,
    });
  });

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
  test("keeps leading enemy-count token deployments in their mutually exclusive branches", () => {
    const [effect] = parseEffect(
      "【Main】If 1 to 4 enemy Units are in play, deploy 1 [Scout]((Test)·AP2·HP2) Unit token. If 5 or more are in play, deploy 1 [Vanguard]((Test)·AP4·HP4) Unit token.",
      "command",
    );

    expect(effect.directives).toMatchObject([
      {
        condition: {
          type: "and",
          conditions: [
            { type: "unitCount", owner: "opponent", comparison: "gte", count: 1 },
            { type: "unitCount", owner: "opponent", comparison: "lte", count: 4 },
          ],
        },
        thenDirectives: [
          { action: { action: "deployToken", token: { name: "Scout", ap: 2, hp: 2 } } },
        ],
      },
      {
        condition: { type: "unitCount", owner: "opponent", comparison: "gte", count: 5 },
        thenDirectives: [
          { action: { action: "deployToken", token: { name: "Vanguard", ap: 4, hp: 4 } } },
        ],
      },
    ]);
  });

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
      action: { action: "deployToken", token: { name: "Guntank", ap: 2, hp: 4 } },
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
    expect(effects[2]).not.toMatchObject({
      directives: [{ action: { unitFilter: { excludeSource: true } } }],
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
        conditions: [{ type: "linkedUnitHasTrait", trait: "cb" }],
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

  test("a linked attack can return chosen trash cards before readying itself", () => {
    const [effect] = parseEffect(
      "【During Link】【Attack】Choose 12 cards from your trash. Return them to their owner's deck and shuffle it. If you do, set this Unit as active. It gains <First Strike> during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.)",
      "unit",
    );

    expect(effect).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          { type: "duringLink" },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 12,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "returnToDeck",
            position: "bottom",
            shuffle: true,
            target: { owner: "friendly", zone: "trash", count: 12 },
          },
        },
        {
          action: { action: "setActive", target: { owner: "self", cardType: "unit" } },
          dependsOnPrevious: true,
        },
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "thisTurn",
            target: { owner: "self", cardType: "unit" },
          },
          dependsOnPrevious: true,
        },
      ],
    });
  });

  test("a friendly-turn battle constant retains the opposing Unit's level filter", () => {
    const [effect] = parseEffect(
      "During your turn, while this Unit is battling an enemy Unit that is Lv.2 or lower, it gains <First Strike>.",
      "unit",
    );
    expect(effect).toMatchObject({
      type: "constant",
      activation: { conditions: [{ type: "isTurn", whose: "friendly" }] },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            target: {
              owner: "self",
              cardType: "unit",
              isBattling: {
                opponentMatches: {
                  owner: "opponent",
                  cardType: "unit",
                  attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
                },
              },
            },
          },
        },
      ],
    });
  });

  test("a paired attack grants this-turn deployment attack permission to a chosen token", () => {
    const [effect] = parseEffect(
      "【During Pair】【Attack】Choose 1 of your (Triple Ship Alliance) Unit tokens. It may attack on the turn it is deployed.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringPair" }, { type: "eventSourceIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "allowAttackDeployedThisTurn",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              isToken: true,
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "triple ship alliance" },
              ],
            },
          },
        },
      ],
    });
  });

  test("an attacking Unit can draw when it destroys an enemy Link Unit", () => {
    const [effect] = parseEffect(
      "【Once per Turn】 When an enemy Link Unit is destroyed with damage while this Unit is attacking, draw 1.",
      "pilot",
    );
    expect(effect).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["onEnemyLinkUnitDestroyed"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [{ type: "selfIsAttacking" }],
      },
      directives: [{ action: { action: "draw", count: 1 } }],
    });
  });

  test("an action activation can recover this Unit when a low-AP enemy is present", () => {
    const [effect] = parseEffect(
      "【Activate･Action】【Once per Turn】If an enemy Unit with 1 or less AP is in play, this Unit recovers 1 HP.",
      "pilot",
    );
    expect(effect).toMatchObject({
      type: "activated",
      activation: {
        timing: ["activate:action"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "battleArea",
            cardType: "unit",
            comparison: "gte",
            count: 1,
            attributeFilters: [{ attribute: "ap", comparison: "lte", value: 1 }],
          },
        ],
      },
      directives: [
        { action: { action: "recoverHP", amount: 1, target: { owner: "self", cardType: "unit" } } },
      ],
    });
  });

  test("an action activation gates a choice on a trait-card trash threshold", () => {
    const [effect] = parseEffect(
      "【During Link】【Activate･Action】【Once per Turn】If there are 6 or more (Gjallarhorn) cards in your trash, choose 1 enemy Unit battling this Unit. It gets AP-3 during this battle.",
      "unit",
    );

    expect(effect).toMatchObject({
      type: "activated",
      activation: {
        timing: ["activate:action"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          { type: "duringLink" },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 6,
            hasTrait: "gjallarhorn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            target: {
              owner: "opponent",
              cardType: "unit",
              isBattling: { opponentMatches: { owner: "self", cardType: "unit" } },
              count: 1,
            },
          },
        },
      ],
    });
  });

  test("a Main command can rest independent friendly and enemy Unit targets", () => {
    const [effect] = parseEffect(
      "【Main】Choose 1 active friendly (Earth Federation) Unit and 1 active enemy Unit. Rest them.",
      "command",
    );
    expect(effect).toMatchObject({
      type: "command",
      activation: { timing: ["main"] },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "earth federation" },
              ],
            },
          },
        },
        {
          action: {
            action: "rest",
            target: { owner: "opponent", cardType: "unit", state: "active", count: 1 },
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
        conditions: [{ type: "linkedUnitHasTrait", trait: "mafty" }],
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

  test("keeps the friendly trait effect source on a self-recovery Destroyed trigger", () => {
    const [effect] = parseEffect(
      "【Destroyed】If this Unit is destroyed by one of your (Neo Zeon) card's effects, add it from your trash to your hand.",
      "unit",
    );

    expect(effect).toEqual({
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [
          {
            type: "eventSourceMatches",
            target: {
              owner: "friendly",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "neo zeon" }],
            },
          },
        ],
      },
      directives: [
        { action: { action: "addFromTrash", target: { owner: "self", zone: "trash" } } },
      ],
      sourceText:
        "【Destroyed】If this Unit is destroyed by one of your (Neo Zeon) card's effects, add it from your trash to your hand.",
    });
  });

  test("queues an enemy player's discard only at the printed hand threshold", () => {
    const [effect] = parseEffect(
      "【When Paired･(Phantom Pain) Pilot】Choose 1 enemy player with 4 or more cards in their hand. They discard 1.",
      "unit",
    );

    expect(effect).toEqual({
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: { attribute: "trait", comparison: "includes", value: "phantom pain" },
        conditions: [{ type: "handCount", owner: "opponent", comparison: "gte", count: 4 }],
      },
      directives: [
        {
          action: {
            action: "queueEffectForOpponent",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [{ action: { action: "discard", count: 1 } }],
              sourceText: "Choose 1 card from your hand to discard.",
            },
          },
        },
      ],
      sourceText:
        "【When Paired·(Phantom Pain) Pilot】Choose 1 enemy player with 4 or more cards in their hand. They discard 1.",
    });
  });

  test("queues a Base rest before choosing the eligible enemy Unit for an AP reduction", () => {
    const [effect] = parseEffect(
      "【Attack】Choose 1 active friendly Base. Rest it. If you do, choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this battle.",
      "unit",
    );

    expect(effect).toMatchObject({
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "battleArea",
            cardType: "unit",
            comparison: "gte",
            count: 1,
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "resolveThenQueue",
            first: {
              action: "rest",
              target: { owner: "friendly", cardType: "base", state: "active", count: 1 },
            },
            followUp: {
              directives: [
                {
                  action: {
                    action: "statModifier",
                    stat: "ap",
                    amount: -2,
                    duration: "thisBattle",
                  },
                },
              ],
            },
          },
        },
      ],
    });
  });

  test("queues an optional other-Unit destruction before dealing damage to an eligible enemy", () => {
    const [effect] = parseEffect(
      "【During Pair】【Attack】You may choose 1 of your other Units. Destroy it. If you do, choose 1 enemy Unit that is Lv.4 or lower. Deal 2 damage to it.",
      "unit",
    );

    expect(effect).toMatchObject({
      activation: {
        timing: ["attack"],
        conditions: [
          { type: "duringPair" },
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "battleArea",
            cardType: "unit",
            comparison: "gte",
            count: 1,
            attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
          },
        ],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "resolveThenQueue",
            first: {
              action: "destroy",
              target: { owner: "friendly", cardType: "unit", count: 1, excludeSource: true },
            },
            followUp: {
              directives: [
                {
                  action: {
                    action: "dealDamage",
                    amount: 2,
                    target: {
                      owner: "opponent",
                      cardType: "unit",
                      count: 1,
                      attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
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

  test("queues an optional discard before its deck tutor and requires a card in Deck", () => {
    const [effect] = parseEffect(
      "【When Paired】You may discard 1. If you do, look at the top 3 cards of your deck. You may reveal 1 (Vulture) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
      "pilot",
    );

    expect(effect).toMatchObject({
      activation: {
        timing: ["whenPaired"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "deck",
            comparison: "gte",
            count: 1,
          },
        ],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "resolveThenQueue",
            first: { action: "discard", count: 1 },
            followUp: {
              directives: [
                {
                  action: {
                    action: "lookAtTopDeck",
                    count: 3,
                    return: "chooseTop",
                    randomizeRemainingToBottom: true,
                    tutorFilter: {
                      owner: "friendly",
                      cardType: "unit",
                      attributeFilters: [
                        { attribute: "trait", comparison: "includes", value: "vulture" },
                      ],
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

  test("queues a trash exile before the enemy Unit it enables", () => {
    const [effect] = parseEffect(
      "【Activate･Main】Choose 3 (Tekkadan)/(Teiwaz) Unit cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit. Deal 2 damage to it.",
      "unit",
    );

    expect(effect).toMatchObject({
      activation: {
        timing: ["activate:main"],
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "battleArea",
            cardType: "unit",
            comparison: "gte",
            count: 1,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "resolveThenQueue",
            first: {
              action: "exile",
              target: {
                owner: "friendly",
                zone: "trash",
                cardType: "unit",
                count: 3,
              },
            },
            followUp: {
              directives: [
                {
                  action: {
                    action: "dealDamage",
                    amount: 2,
                    target: { owner: "opponent", cardType: "unit", count: 1 },
                  },
                },
              ],
            },
          },
        },
      ],
    });
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

  test("promotes a deploy-from-trash gate for an unconditional draw", () => {
    const [effect] = parseEffect(
      "【Deploy】If you deploy this Unit from your trash, draw 1.",
      "unit",
    );

    expect(effect).toMatchObject({
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "deployedFromZone", zone: "trash" }],
      },
      directives: [{ action: { action: "draw", count: 1 } }],
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

  test("parses an end-of-turn mass rest and the count of Units it actually rested", () => {
    const [effect] = parseEffect(
      "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\nAt the end of your turn, if this Unit is rested, rest all Units. If this effect rested 3 or more Units, draw 1.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: { timing: ["endOfTurn"], conditions: [{ type: "selfIsRested" }] },
      directives: [
        { action: { action: "rest", target: { owner: "any", cardType: "unit", count: "all" } } },
        { action: { action: "drawIfTargetMatches", count: 1, target: { count: 3 } } },
      ],
    });
  });

  test("parses a conditional hand-deployment level and cost override", () => {
    const [effect] = parseEffect(
      "When playing this card from your hand, if 3 or more enemy Units are in play, play it as if it has 3 Lv. and cost.",
      "unit",
    );
    expect(effect).toMatchObject({
      type: "substitution",
      directives: [
        {
          action: {
            action: "deployCostOverride",
            level: 3,
            cost: 3,
            condition: { type: "unitCount", owner: "opponent", comparison: "gte", count: 3 },
          },
        },
      ],
    });
  });

  test("parses an alternative Pilot trait qualification", () => {
    const [effect] = parseEffect(
      "【When Paired･(Cyber-Newtype)/(Newtype) Pilot】Choose 1 to 2 enemy Units. Deal 1 damage to them.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "or",
          filters: [
            { attribute: "trait", comparison: "includes", value: "cyber-newtype" },
            { attribute: "trait", comparison: "includes", value: "newtype" },
          ],
        },
      },
    });
  });

  test("parses an enemy-shield-count gate before a target choice", () => {
    const [effect] = parseEffect(
      "【Deploy】If there are 3 or less enemy Shields, choose 1 enemy Unit with 5 or less AP. Deal 2 damage to it.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "shieldArea",
            comparison: "lte",
            count: 3,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 5 }],
            },
          },
        },
      ],
    });
  });

  test("preserves independent choices for all enemy players", () => {
    const [effect] = parseEffect(
      "【Deploy】All enemy players each choose 1 of their active Units. Rest them.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: { timing: ["deploy"] },
      directives: [
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "opponents",
            effect: {
              directives: [
                {
                  action: {
                    action: "rest",
                    target: { owner: "friendly", cardType: "unit", state: "active", count: 1 },
                  },
                },
              ],
            },
          },
        },
      ],
    });
  });

  test("parses the two-enemy-player gate and largest-opponent-board target", () => {
    const [effect] = parseEffect(
      "【Deploy】If there are 2 or more enemy players, choose 1 Unit belonging to an enemy player with the most Units. Return it to its owner's hand.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "enemyPlayerCount", comparison: "gte", count: 2 }],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: { owner: "any", cardType: "unit", ownerHasMostUnits: true, count: 1 },
          },
        },
      ],
    });
  });

  test("parses battle destruction draws for both the destroyed Unit owner and destroyer", () => {
    const [effect] = parseEffect(
      "【Destroyed】If this Unit is destroyed with battle damage, you and the player who destroyed this Unit draw 1.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["destroyed"],
        conditions: [{ type: "eventDamageType", damageType: "battle" }],
      },
      directives: [
        { action: { action: "draw", count: 1 } },
        { action: { action: "drawEventDestroyer", count: 1 } },
      ],
    });
  });

  test("parses a generic EX Resource exile trigger with optional temporary enemy-damage reduction", () => {
    const [effect] = parseEffect(
      "When one of your EX Resources is exiled from the game, you may choose 1 of your Units. During this turn, when it receives enemy damage, reduce it by 3.",
      "unit",
    );
    expect(effect).toMatchObject({
      activation: {
        timing: ["onExResourceExiled"],
        conditions: [{ type: "eventPlayerIsSelf" }],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "reduceNextDamage",
            amount: 3,
            duration: "thisTurn",
            source: "enemy",
            target: { owner: "friendly", cardType: "unit", count: 1 },
          },
        },
      ],
    });
  });
});
