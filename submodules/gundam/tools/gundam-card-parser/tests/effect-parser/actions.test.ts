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
  test("Place 1 EX Resource produces placeResource with EX type active state", () => {
    const [effect] = parseEffect("【Deploy】 Place 1 EX Resource.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "placeResource", resourceType: "EX", state: "active" },
    });
  });

  test("Place 1 rested Resource produces placeResource with normal type rested state", () => {
    const [effect] = parseEffect("【Deploy】 Place 1 rested Resource.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "placeResource", resourceType: "normal", state: "rested" },
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
});

// ── Pair pilot ─────────────────────────────────────────────────────────────────

describe("pairPilot", () => {
  test("Pair 1 Pilot card from your hand with this Unit", () => {
    const [effect] = parseEffect("【Deploy】 Pair 1 Pilot card from your hand with this Unit.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "pairPilot", target: { cardType: "pilot", count: 1 } },
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
      action: { action: "dealDamageAll", amount: 2, target: { owner: "opponent" } },
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
    expect(effect.directives[0]).toMatchObject({ action: { action: "setActive" } });
  });
});

describe("returnToHand", () => {
  test("Return it to its owner's hand produces returnToHand", () => {
    const [effect] = parseEffect("【Main】②：Return it to its owner's hand.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "returnToHand" } });
  });
});

describe("destroy", () => {
  test("Destroy it produces destroy action", () => {
    const [effect] = parseEffect("【Main】②：Destroy it.");
    expect(effect.directives[0]).toMatchObject({ action: { action: "destroy" } });
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
});

// ── Stat modifier ──────────────────────────────────────────────────────────────

describe("statModifier", () => {
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

// ── Prevent effects ────────────────────────────────────────────────────────────

describe("preventStatReduction", () => {
  test("AP can't be reduced by enemy effects", () => {
    const [effect] = parseEffect("This Unit's AP can't be reduced by enemy effects.");
    expect(effect.directives[0]).toMatchObject({
      action: { action: "preventStatReduction", stat: "ap", target: { owner: "self" } },
    });
  });
});

describe("preventDamage", () => {
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
});

describe("preventDamageToZone", () => {
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
        zone: "shieldArea",
        unitFilter: { attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }] },
      },
    });
  });
});

describe("reduceNextDamage", () => {
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

  test("conditional received damage reduction keeps the condition branch populated", () => {
    const [effect] = parseEffect(
      "【Once per Turn】If you have a (CB) Pilot in play, when this Unit receives damage from an enemy, reduce it by 1.",
    );
    expect(effect.directives[0]).toMatchObject({
      condition: {
        type: "cardInZone",
        owner: "friendly",
        zone: "battleArea",
        cardType: "pilot",
        hasTrait: "cb",
      },
      thenDirectives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 1,
            target: { owner: "self" },
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
        conditions: [{ type: "isTurn", whose: "friendly" }],
      },
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

describe("preventDestruction", () => {
  test("friendly Units can't be destroyed by enemy effects", () => {
    const [effect] = parseEffect(
      "【Main】/【Action】During this turn, friendly Units can't be destroyed by enemy effects.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "preventDestruction",
        target: { owner: "friendly", cardType: "unit", count: "all" },
        source: "enemy",
        cause: "effect",
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

  test("It may choose an active enemy Unit that is Lv.2 or lower as its attack target", () => {
    const [effect] = parseEffect(
      "This Unit may choose an active enemy Unit that is Lv.2 or lower as its attack target.",
    );
    expect(effect.directives[0]).toMatchObject({
      action: {
        action: "chooseAttackTarget",
        attackTarget: {
          attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
        },
      },
    });
  });
});

// ── Look at top deck ───────────────────────────────────────────────────────────

describe("lookAtTopDeck", () => {
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

  test("Look at top 3 cards defaults to chooseTop return", () => {
    // A reveal clause in a separate sentence is split off and not captured by the look step.
    // tutorFilter is therefore not produced by the current parser for split-sentence text.
    const [effect] = parseEffect(
      "【When Paired】 Look at the top 3 cards of your deck. You may reveal 1 Unit card among them and add it to your hand.",
    );
    const lookStep = effect.directives.find(
      (s) => "action" in s && (s as any).action.action === "lookAtTopDeck",
    );
    expect(lookStep).toMatchObject({
      action: { action: "lookAtTopDeck", count: 3, return: "chooseTop" },
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
});

// ── Target filter details ──────────────────────────────────────────────────────

describe("target filters on actions", () => {
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
