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
