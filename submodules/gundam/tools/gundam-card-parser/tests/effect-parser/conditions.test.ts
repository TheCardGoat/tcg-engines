/**
 * Tests for condition parsing within if-clauses and while-conditions.
 * Each test exercises parseCondition through the public parseEffect API.
 */
import { describe, expect, test } from "vite-plus/test";
import { parseEffect } from "../../scripts/parseEffect.ts";

// Helper: extract the first ConditionalBranch from an effect's steps
function firstBranch(text: string) {
  const [effect] = parseEffect(text);
  return effect.directives.find((s) => "condition" in s);
}

describe("self-state conditions", () => {
  test("while this is damaged → selfIsDamaged", () => {
    const [effect] = parseEffect("While this is damaged, it gets AP+1.");
    expect(effect.activation.conditions).toEqual([{ type: "selfIsDamaged" }]);
    expect(effect.directives[0]).toMatchObject({
      action: { action: "statModifier", target: { owner: "self" } },
    });
  });

  test("if this Unit is damaged → selfIsDamaged", () => {
    const branch = firstBranch("【Deploy】 If this Unit is damaged, draw 1.");
    expect(branch).toMatchObject({ condition: { type: "selfIsDamaged" } });
  });

  test("if it is attacking → selfIsAttacking", () => {
    const branch = firstBranch("【Attack】 If it is attacking, draw 1.");
    expect(branch).toMatchObject({ condition: { type: "selfIsAttacking" } });
  });

  test("if this Unit is attacking → selfIsAttacking", () => {
    const branch = firstBranch("【Attack】 If this Unit is attacking, draw 1.");
    expect(branch).toMatchObject({ condition: { type: "selfIsAttacking" } });
  });

  test("if it is attacking an enemy Unit → isAttackingUnit", () => {
    const branch = firstBranch("【Attack】 If it is attacking an enemy Unit, draw 1.");
    expect(branch).toMatchObject({ condition: { type: "isAttackingUnit" } });
  });
});

describe("selfStat conditions", () => {
  test("if this Unit has 5 or more AP → selfStat gte", () => {
    const branch = firstBranch("【Deploy】 If this Unit has 5 or more AP, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "selfStat", stat: "ap", comparison: "gte", value: 5 },
    });
  });

  test("if this Unit has 3 or less HP → selfStat lte", () => {
    const branch = firstBranch("【Deploy】 If this Unit has 3 or less HP, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "selfStat", stat: "hp", comparison: "lte", value: 3 },
    });
  });

  test("if this Unit has 4 or fewer HP → selfStat lte", () => {
    const branch = firstBranch("【Deploy】 If this Unit has 4 or fewer HP, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "selfStat", stat: "hp", comparison: "lte", value: 4 },
    });
  });

  test("while this Unit has 1 HP → selfStat eq", () => {
    const [effect] = parseEffect("While this Unit has 1 HP, it gains <Repair 3>.");
    expect(effect.activation.conditions).toEqual([
      { type: "selfStat", stat: "hp", comparison: "eq", value: 1 },
    ]);
  });
});

describe("selfHasKeyword conditions", () => {
  test("if this Unit has <Repair> → selfHasKeyword Repair", () => {
    const branch = firstBranch("【Deploy】 If this Unit has <Repair>, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "selfHasKeyword", keyword: "Repair" },
    });
  });

  test("if this Unit has <Breach> → selfHasKeyword Breach", () => {
    const branch = firstBranch("【Deploy】 If this Unit has <Breach>, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "selfHasKeyword", keyword: "Breach" },
    });
  });
});

describe("selfHasTrait conditions", () => {
  test("if this Unit is (Zeon) → selfHasTrait with lowercase trait", () => {
    // Via While condition; trait value is lowercased by the parser
    const [effect] = parseEffect("While this Unit is (Zeon), it gets AP+1 this turn.");
    expect(effect.activation.conditions).toMatchObject([{ type: "selfHasTrait", trait: "zeon" }]);
  });

  test("paired-Pilot wording 'this is a (CB) Unit' → selfHasTrait", () => {
    const [effect] = parseEffect("While this is a (CB) Unit, draw 1.");
    expect(effect.activation.conditions).toEqual([{ type: "selfHasTrait", trait: "cb" }]);
  });
});

describe("selfIsColor conditions", () => {
  test("if this Unit is blue → selfIsColor Blue", () => {
    const [effect] = parseEffect("While this Unit is blue, it gets AP+1 this turn.");
    expect(effect.activation.conditions).toMatchObject([{ type: "selfIsColor", color: "blue" }]);
  });

  test("if this Unit is red → selfIsColor Red", () => {
    const [effect] = parseEffect("While this Unit is red, it gets AP+1 this turn.");
    expect(effect.activation.conditions).toMatchObject([{ type: "selfIsColor", color: "red" }]);
  });
});

describe("isTurn conditions", () => {
  test("if it is your turn → isTurn friendly", () => {
    const branch = firstBranch("【Deploy】 If it is your turn, draw 1.");
    expect(branch).toMatchObject({ condition: { type: "isTurn", whose: "friendly" } });
  });

  test("if it is your opponent's turn → isTurn opponent", () => {
    const branch = firstBranch("【Deploy】 If it is your opponent's turn, draw 1.");
    expect(branch).toMatchObject({ condition: { type: "isTurn", whose: "opponent" } });
  });
});

describe("playerLevel conditions", () => {
  test("while you are Lv.7 or higher → playerLevel gte 7", () => {
    // playerLevel in if-clauses is unreliable because the regex (.*?)[,.] stops at the dot
    // in "Lv.7". Use While conditions instead where the regex stops at comma.
    const [effect] = parseEffect("While you are Lv.7 or higher, this Unit gets AP+1 this turn.");
    expect(effect.activation.conditions).toMatchObject([
      { type: "playerLevel", comparison: "gte", value: 7 },
    ]);
  });

  test("while you are Lv.3 or lower → playerLevel lte 3", () => {
    const [effect] = parseEffect("While you are Lv.3 or lower, this Unit gets AP+1 this turn.");
    expect(effect.activation.conditions).toMatchObject([
      { type: "playerLevel", comparison: "lte", value: 3 },
    ]);
  });
});

describe("unitCount conditions", () => {
  test("while your opponent has an EX Resource → opponent resource-area condition", () => {
    const [effect] = parseEffect(
      "While your opponent has an EX Resource, this Unit can't receive battle damage from enemy Units that are Lv.5 or lower.",
    );
    expect(effect.activation.conditions).toContainEqual({
      type: "cardInZone",
      owner: "opponent",
      zone: "resourceArea",
      cardType: "resource",
      hasName: "EX Resource",
      comparison: "gte",
      count: 1,
    });
  });

  test("if you have a named Lv.5 Unit in play → cardInZone with name and level filters", () => {
    const [effect] = parseEffect(
      '【Activate·Main】②：If you have a Unit with "Gundam Aerial" in its card name that is Lv.5 or higher in play, deploy 1 [Gundnode]((Quiet Zero)·AP2·HP2·<Breach 1>) Unit token.',
    );
    expect(effect.activation.conditions).toEqual([
      {
        type: "cardInZone",
        owner: "friendly",
        zone: "battleArea",
        cardType: "unit",
        comparison: "gte",
        count: 1,
        attributeFilters: [
          { attribute: "name", comparison: "includes", value: "Gundam Aerial" },
          { attribute: "level", comparison: "gte", value: 5 },
        ],
      },
    ]);
  });

  test("if there are 6 or more rested Units in play → unitCount across all players", () => {
    const branch = firstBranch("【Main】 If there are 6 or more rested Units in play, draw 2.");
    expect(branch).toMatchObject({
      condition: {
        type: "unitCount",
        owner: "any",
        comparison: "gte",
        count: 6,
        state: "rested",
      },
    });
  });

  test("no Earth Alliance Unit tokens in play → trait token count eq 0", () => {
    const branch = firstBranch(
      "【Burst】If you have no (Earth Alliance) Unit tokens in play, draw 1.",
    );
    expect(branch).toMatchObject({
      condition: {
        type: "unitCount",
        owner: "friendly",
        comparison: "eq",
        count: 0,
        hasTrait: "earth alliance",
        isToken: true,
      },
    });
  });

  test("if you have no Units in play → unitCount eq 0", () => {
    const branch = firstBranch("【Deploy】 If you have no Units in play, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "unitCount", owner: "friendly", comparison: "eq", count: 0 },
    });
  });

  test("if you have 2 or more Units in play → unitCount gte 2", () => {
    const branch = firstBranch("【Deploy】 If you have 2 or more Units in play, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "unitCount", owner: "friendly", comparison: "gte", count: 2 },
    });
  });

  test("if you have 0 Units in play → unitCount eq 0", () => {
    const branch = firstBranch("【Deploy】 If you have 0 Units in play, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "unitCount", owner: "friendly", comparison: "eq", count: 0 },
    });
  });

  test("if you have 2 or more (Earth Federation) Units in play → unitCount with trait", () => {
    const branch = firstBranch(
      "【Deploy】 If you have 2 or more (Earth Federation) Units in play, draw 1.",
    );
    expect(branch).toMatchObject({
      condition: {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 2,
        hasTrait: "earth federation",
      },
    });
  });

  test("if you have another Link Unit in play → unitCount excludeSelf isLinkUnit", () => {
    const branch = firstBranch("【Deploy】 If you have another Link Unit in play, draw 1.");
    expect(branch).toMatchObject({
      condition: {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        excludeSelf: true,
        isLinkUnit: true,
      },
    });
  });

  test("if you have an AEUG Link Unit in play → trait count requires a Link Unit", () => {
    const [effect] = parseEffect(
      "【Destroyed】If you have an (AEUG) Link Unit in play, choose 1 enemy Unit. Rest it.",
    );

    expect(effect.activation.conditions).toEqual([
      {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        hasTrait: "aeug",
        isLinkUnit: true,
      },
    ]);
  });

  test("if you have another (Gundam) Unit in play → unitCount excludeSelf with trait", () => {
    const branch = firstBranch("【Deploy】 If you have another (Gundam) Unit in play, draw 1.");
    expect(branch).toMatchObject({
      condition: {
        type: "unitCount",
        excludeSelf: true,
        hasTrait: "gundam",
      },
    });
  });

  test("while you have another Unit with High-Maneuver → keyword count excluding self", () => {
    const [effect] = parseEffect(
      "While you have another Unit with <High-Maneuver> in play, this Unit gets AP+1.",
    );
    expect(effect.activation.conditions).toEqual([
      {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        excludeSelf: true,
        hasKeyword: "HighManeuver",
      },
    ]);
  });

  test("while you have a Unit token in play → friendly token count", () => {
    const [effect] = parseEffect("While you have a Unit token in play, this Unit gets AP+1.");
    expect(effect.activation.conditions).toEqual([
      {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        isToken: true,
      },
    ]);
  });

  test("while another friendly Zeon Link Unit is in play → qualified count excluding self", () => {
    const [effect] = parseEffect(
      "While another friendly (Zeon) Link Unit is in play, this Unit gains <Breach 5>.",
    );
    expect(effect.activation.conditions).toEqual([
      {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        excludeSelf: true,
        hasTrait: "zeon",
        isLinkUnit: true,
      },
    ]);
  });

  test("while a rested enemy Unit is in play → opponent rested count", () => {
    const [effect] = parseEffect(
      "While a rested enemy Unit is in play, this Unit gains <Suppression>.",
    );
    expect(effect.activation.conditions).toEqual([
      {
        type: "unitCount",
        owner: "opponent",
        comparison: "gte",
        count: 1,
        state: "rested",
      },
    ]);
  });

  test("while you have a rested trait Unit in play → friendly rested trait count", () => {
    const [effect] = parseEffect(
      "While you have a rested (Zeon) Unit in play, this Base can't receive battle damage from enemy Units that are Lv.4 or lower.",
      "base",
    );
    expect(effect.activation.conditions).toEqual([
      {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        hasTrait: "zeon",
        state: "rested",
      },
    ]);
  });

  test("if an enemy CB Unit is in play → opponent trait count", () => {
    const [effect] = parseEffect(
      "【Burst】If an enemy (CB) Unit is in play, add this card to your hand.",
    );
    expect(effect.activation.conditions).toEqual([
      {
        type: "cardInZone",
        owner: "opponent",
        zone: "battleArea",
        cardType: "unit",
        comparison: "gte",
        count: 1,
        hasTrait: "cb",
      },
    ]);
  });

  test("if 2 or more enemy Units are in play → unitCount opponent", () => {
    const branch = firstBranch("【Deploy】 If 2 or more enemy Units are in play, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "unitCount", owner: "opponent", comparison: "gte", count: 2 },
    });
  });

  test("if you have 2 or more (Zeon)/(Neo Zeon) Units in play → unitCount with hasTrait array", () => {
    const branch = firstBranch(
      "【Deploy】 If you have 2 or more (Zeon)/(Neo Zeon) Units in play, draw 1.",
    );
    expect(branch).toMatchObject({
      condition: {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 2,
        hasTrait: ["zeon", "neo zeon"],
      },
    });
  });

  test("if you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play → excludeSelf + hasTrait array", () => {
    const branch = firstBranch(
      "【When Paired】 If you have 2 or more other (Gjallarhorn)/(Tekkadan) Units in play, draw 1.",
    );
    expect(branch).toMatchObject({
      condition: {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 2,
        hasTrait: ["gjallarhorn", "tekkadan"],
        excludeSelf: true,
      },
    });
  });
});

describe("cardInZone conditions", () => {
  test("if there are 3 or more Command cards in your trash → cardInZone Command", () => {
    const branch = firstBranch(
      "【Deploy】 If there are 3 or more Command cards in your trash, draw 1.",
    );
    expect(branch).toMatchObject({
      condition: {
        type: "cardInZone",
        owner: "friendly",
        zone: "trash",
        cardType: "command",
        comparison: "gte",
        count: 3,
      },
    });
  });

  test("if there are 10 or more (Zeon)/(Neo Zeon) Unit cards in your trash → cardInZone with hasTrait array + cardType", () => {
    const branch = firstBranch(
      "【Deploy】 If there are 10 or more (Zeon)/(Neo Zeon) Unit cards in your trash, draw 1.",
    );
    expect(branch).toMatchObject({
      condition: {
        type: "cardInZone",
        owner: "friendly",
        zone: "trash",
        cardType: "unit",
        comparison: "gte",
        count: 10,
        hasTrait: ["zeon", "neo zeon"],
      },
    });
  });

  test("if there are 3 or more (Teiwaz)/(Tekkadan) cards in your trash → cardInZone with hasTrait array, no cardType", () => {
    const branch = firstBranch(
      "【When Paired】 If there are 3 or more (Teiwaz)/(Tekkadan) cards in your trash, draw 1.",
    );
    expect(branch).toMatchObject({
      condition: {
        type: "cardInZone",
        owner: "friendly",
        zone: "trash",
        comparison: "gte",
        count: 3,
        hasTrait: ["teiwaz", "tekkadan"],
      },
    });
  });

  test('a card with "Name" in its card name is in your trash → cardInZone with hasName', () => {
    const branch = firstBranch(
      '【Deploy】 If a card with "Corsica Base" in its card name is in your trash, draw 1.',
    );
    expect(branch).toMatchObject({
      condition: {
        type: "cardInZone",
        owner: "friendly",
        zone: "trash",
        comparison: "gte",
        count: 1,
        hasName: "Corsica Base",
      },
    });
  });
});

describe("cardInZone in-play conditions", () => {
  test("if you have no EX Resources → zero friendly EX Resources", () => {
    const [effect] = parseEffect(
      "【During Link】【Destroyed】If you have no EX Resources, place 1 EX Resource.",
    );
    expect(effect.activation.conditions).toEqual([
      { type: "duringLink" },
      {
        type: "cardInZone",
        owner: "friendly",
        zone: "resourceArea",
        cardType: "resource",
        hasName: "EX Resource",
        comparison: "eq",
        count: 0,
      },
    ]);
  });

  test("while you have a (CB) Pilot in play → battleArea pilot trait condition", () => {
    const [effect] = parseEffect(
      "During your turn, while you have a (CB) Pilot in play, this Unit gets AP+2.",
    );
    expect(effect.activation.conditions).toMatchObject([
      { type: "isTurn", whose: "friendly" },
      {
        type: "cardInZone",
        owner: "friendly",
        zone: "battleArea",
        cardType: "pilot",
        comparison: "gte",
        count: 1,
        hasTrait: "cb",
      },
    ]);
  });

  test("while you have a red Super Soldier Pilot in play → color and trait condition", () => {
    const [effect] = parseEffect(
      "While you have a red (Super Soldier) Pilot in play, this Unit gains <First Strike>.",
    );
    expect(effect.activation.conditions).toEqual([
      {
        type: "cardInZone",
        owner: "friendly",
        zone: "battleArea",
        cardType: "pilot",
        hasTrait: "super soldier",
        hasColor: "red",
        comparison: "gte",
        count: 1,
      },
    ]);
  });
});

describe("handCount conditions", () => {
  test("if your opponent has 3 or more cards in their hand → handCount opponent gte 3", () => {
    const branch = firstBranch(
      "【Deploy】 If your opponent has 3 or more cards in their hand, draw 1.",
    );
    expect(branch).toMatchObject({
      condition: { type: "handCount", owner: "opponent", comparison: "gte", count: 3 },
    });
  });

  test("if you have 4 or less cards in your hand → handCount friendly lte 4", () => {
    const branch = firstBranch("【Deploy】 If you have 4 or less cards in your hand, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "handCount", owner: "friendly", comparison: "lte", count: 4 },
    });
  });

  test("while you have a non-blue Newtype Pilot in play keeps its color exclusion", () => {
    const [effect] = parseEffect(
      "While you have a non-blue (Newtype) Pilot in play, this card in your hand gets cost -2.",
    );
    expect(effect.activation.conditions).toEqual([
      {
        type: "cardInZone",
        owner: "friendly",
        zone: "battleArea",
        cardType: "pilot",
        hasTrait: "newtype",
        attributeFilters: [{ attribute: "color", comparison: "neq", value: "blue" }],
        comparison: "gte",
        count: 1,
      },
    ]);
  });
});

describe("friendlyBaseInPlay conditions", () => {
  test("if a friendly white Base is in play → friendlyBaseInPlay White", () => {
    const branch = firstBranch("【Deploy】 If a friendly white Base is in play, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "friendlyBaseInPlay", color: "white" },
    });
  });

  test("if a friendly Base is in play (no color) → friendlyBaseInPlay", () => {
    const branch = firstBranch("【Deploy】 If a friendly Base is in play, draw 1.");
    expect(branch).toMatchObject({
      condition: { type: "friendlyBaseInPlay" },
    });
  });

  test("while there is a friendly white Base in play → friendlyBaseInPlay White", () => {
    const [effect] = parseEffect(
      "While there is a friendly white Base in play, this Unit gets AP+2.",
    );
    expect(effect.activation.conditions).toEqual([{ type: "friendlyBaseInPlay", color: "white" }]);
  });

  test("while no enemy Base is in play → opponent Base count zero", () => {
    const [effect] = parseEffect("While no enemy Base is in play, this Unit gets AP+1.");
    expect(effect.activation.conditions).toEqual([
      {
        type: "cardInZone",
        owner: "opponent",
        zone: "baseSection",
        cardType: "base",
        comparison: "eq",
        count: 0,
      },
    ]);
  });
});

describe("compound and conditions", () => {
  test("if this Unit has 5 or more AP and this Unit is damaged → and condition", () => {
    const branch = firstBranch(
      "【Deploy】 If this Unit has 5 or more AP and this Unit is damaged, draw 1.",
    );
    expect(branch).toMatchObject({
      condition: {
        type: "and",
        conditions: [
          { type: "selfStat", stat: "ap", comparison: "gte", value: 5 },
          { type: "selfIsDamaged" },
        ],
      },
    });
  });
});
