/**
 * Direct tests for parseTargetFilter — focuses on branches that are
 * awkward to reach through the public parseEffect API.
 */
import { describe, expect, test } from "vite-plus/test";
import { parseTargetFilter } from "../../scripts/effect-parser/target-filter.ts";

describe("parseTargetFilter — trait-OR group re-scan fallbacks", () => {
  test("keeps a chosen Unit's paired Pilot trait separate from the Unit's own traits", () => {
    expect(parseTargetFilter("1 of your Units paired with a (Super Soldier) Pilot")).toEqual({
      owner: "friendly",
      cardType: "unit",
      count: 1,
      attributeFilters: [
        { attribute: "pairedPilotTrait", comparison: "includes", value: "super soldier" },
      ],
    });
  });

  test("two usable traits → OR disjunction", () => {
    const tf = parseTargetFilter("1 friendly (Neo Zeon)/(Zeon) Unit");
    expect(tf.attributeFilters).toEqual([
      {
        attribute: "or",
        filters: [
          { attribute: "trait", comparison: "includes", value: "neo zeon" },
          { attribute: "trait", comparison: "includes", value: "zeon" },
        ],
      },
    ]);
  });

  test("trait-group regex matches but re-scan yields a single trait → plain trait predicate", () => {
    // The trait-group regex fires on the "(X)/(Y)" shape, but the AP/HP
    // guard during re-scan discards "AP3", leaving only one usable trait.
    // The parser should fall back to a single-trait predicate rather than
    // emitting nothing.
    const tf = parseTargetFilter("1 friendly (Zeon)/(AP3) Unit");
    expect(tf.attributeFilters).toEqual([
      { attribute: "trait", comparison: "includes", value: "zeon" },
    ]);
  });
});

describe("parseTargetFilter — player ownership", () => {
  test("treats a Unit belonging to another player as an opponent target", () => {
    const filter = parseTargetFilter("1 rested Unit belonging to another player");
    expect(filter).toMatchObject({
      owner: "opponent",
      cardType: "unit",
      state: "rested",
      count: 1,
    });
    expect(filter).not.toHaveProperty("excludeSource");
  });
});

describe("parseTargetFilter — damage state", () => {
  test("does not collapse undamaged into the damaged substring", () => {
    expect(parseTargetFilter("1 undamaged enemy Unit")).toMatchObject({
      owner: "opponent",
      cardType: "unit",
      state: "undamaged",
      count: 1,
    });
  });
});

describe("parseTargetFilter — negative keyword predicates", () => {
  test('"without <Breach>" requires the target to lack Breach', () => {
    expect(parseTargetFilter("1 of your (MF) Units without <Breach>")).toMatchObject({
      owner: "friendly",
      cardType: "unit",
      lacksKeyword: "Breach",
    });
  });
});

describe("parseTargetFilter — combat role", () => {
  test("recognizes the Unit currently being attacked", () => {
    expect(parseTargetFilter("1 other Unit that is being attacked")).toMatchObject({
      owner: "any",
      cardType: "unit",
      excludeSource: true,
      isBeingAttacked: true,
      count: 1,
    });
  });
});

describe("parseTargetFilter — exact level and another", () => {
  test("retains an exact level and excludes the source for another friendly Unit", () => {
    expect(parseTargetFilter("another friendly (G Generation) Unit that is Lv.3")).toMatchObject({
      owner: "friendly",
      cardType: "unit",
      excludeSource: true,
      attributeFilters: expect.arrayContaining([
        { attribute: "trait", comparison: "includes", value: "g generation" },
        { attribute: "level", comparison: "eq", value: 3 },
      ]),
    });
  });
});

describe("parseTargetFilter — surviving HP threshold", () => {
  test("treats a Unit with 1 HP as an eligible 1-or-less HP target", () => {
    expect(parseTargetFilter("1 enemy Unit with 1 HP")).toMatchObject({
      owner: "opponent",
      cardType: "unit",
      count: 1,
      attributeFilters: [{ attribute: "hp", comparison: "lte", value: 1 }],
    });
  });
});

describe("parseTargetFilter — color", () => {
  test("keeps a color qualifier on a friendly Unit target", () => {
    expect(parseTargetFilter("1 of your green Units")).toMatchObject({
      owner: "friendly",
      cardType: "unit",
      count: 1,
      attributeFilters: [{ attribute: "color", comparison: "eq", value: "green" }],
    });
  });

  test("does not treat the White Base Team trait as a white color qualifier", () => {
    expect(parseTargetFilter("all your (White Base Team) Units")).toMatchObject({
      owner: "friendly",
      cardType: "unit",
      count: "all",
      attributeFilters: [{ attribute: "trait", comparison: "includes", value: "white base team" }],
    });
  });
});

describe('parseTargetFilter — "battling [descriptor]" clause', () => {
  test('"battling this Unit" → isBattling opponentMatches source', () => {
    const tf = parseTargetFilter("the enemy Unit battling this Unit");
    expect(tf.owner).toBe("opponent");
    expect(tf.cardType).toBe("unit");
    expect(tf.isBattling).toEqual({ opponentMatches: { owner: "self", cardType: "unit" } });
  });

  test('"battling this card" also emits an opponentMatches source filter', () => {
    const tf = parseTargetFilter("the enemy Unit battling this card");
    expect(tf.isBattling).toEqual({ opponentMatches: { owner: "self" } });
  });

  test('"battling a friendly Unit with <Blocker>" → opponentMatches sub-filter', () => {
    const tf = parseTargetFilter(
      "1 enemy Unit with 4 or less HP battling a friendly Unit with <Blocker>",
    );
    expect(tf.owner).toBe("opponent");
    expect(tf.cardType).toBe("unit");
    expect(tf.count).toBe(1);
    // Outer filter must not absorb the sub-clause's keyword.
    expect(tf.hasKeyword).toBeUndefined();
    expect(tf.attributeFilters).toEqual([{ attribute: "hp", comparison: "lte", value: 4 }]);
    expect(tf.isBattling).toEqual({
      opponentMatches: {
        owner: "friendly",
        cardType: "unit",
        hasKeyword: "Blocker",
      },
    });
  });

  test('"battling an enemy Unit that is Lv.2 or lower" → opponentMatches with level lte', () => {
    const tf = parseTargetFilter("this Unit is battling an enemy Unit that is Lv.2 or lower");
    expect(tf.owner).toBe("self");
    // Outer filter must not absorb the sub-clause's Lv. predicate.
    expect(tf.attributeFilters).toBeUndefined();
    expect(tf.isBattling).toEqual({
      opponentMatches: {
        owner: "opponent",
        cardType: "unit",
        attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
      },
    });
  });

  test('plural "battling enemy Units" → no isBattling emission (ambiguous set form)', () => {
    const tf = parseTargetFilter("1 friendly Unit battling enemy Units");
    expect(tf.isBattling).toBeUndefined();
  });

  test('no "battling" phrase → isBattling untouched', () => {
    const tf = parseTargetFilter("1 rested enemy Unit with 5 or less HP");
    expect(tf.isBattling).toBeUndefined();
  });

  test("does not treat trailing keyword reminder text as a trait predicate", () => {
    expect(
      parseTargetFilter(
        "the enemy Unit battling this Unit (While this Unit is attacking, it deals damage first.)",
      ),
    ).toMatchObject({
      owner: "opponent",
      cardType: "unit",
      isBattling: { opponentMatches: { owner: "self", cardType: "unit" } },
    });
  });

  test("other than Link Units excludes Link Units without excluding the source", () => {
    const target = parseTargetFilter("enemy Units other than Link Units");
    expect(target).toMatchObject({ owner: "opponent", cardType: "unit", isLinkUnit: false });
    expect(target.excludeSource).toBeUndefined();
  });

  test("retains a destroyed-effect requirement inside a battling opponent filter", () => {
    expect(
      parseTargetFilter("this Unit is battling an enemy Unit with a 【Destroyed】 effect"),
    ).toMatchObject({
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
    });
  });

  test("parses lowest HP and unpaired-Pilot target restrictions", () => {
    expect(parseTargetFilter("1 enemy Unit with the lowest HP")).toMatchObject({
      owner: "opponent",
      cardType: "unit",
      count: 1,
      lowest: "hp",
    });
    expect(parseTargetFilter("1 active enemy Unit that has no Pilot paired with it")).toMatchObject(
      {
        owner: "opponent",
        cardType: "unit",
        state: "active",
        attributeFilters: [{ attribute: "paired", comparison: "eq", value: false }],
      },
    );
  });

  test("distinguishes a paired Pilot target from a paired Unit target", () => {
    expect(parseTargetFilter("1 Pilot paired with an enemy Unit that is Lv.5 or lower")).toEqual({
      owner: "opponent",
      cardType: "pilot",
      count: 1,
      attributeFilters: [{ attribute: "pairedUnitLevel", comparison: "lte", value: 5 }],
    });
    expect(parseTargetFilter("all Units paired with a Pilot")).toMatchObject({
      owner: "any",
      cardType: "unit",
      count: "all",
      attributeFilters: [{ attribute: "paired", comparison: "eq", value: true }],
    });
  });

  test("keeps alternative numeric restrictions as a disjunction", () => {
    expect(
      parseTargetFilter("1 enemy Unit that is Lv.1 or lower or has 1 or less AP"),
    ).toMatchObject({
      attributeFilters: [
        {
          attribute: "or",
          filters: [
            { attribute: "ap", comparison: "lte", value: 1 },
            { attribute: "level", comparison: "lte", value: 1 },
          ],
        },
      ],
    });
  });
});

describe("parseTargetFilter — source-stat sentinels (this Unit's AP/HP/Lv.)", () => {
  test("Lv. equal to or lower than this Unit → SourceStatRef level lte", () => {
    const tf = parseTargetFilter("1 enemy Unit whose Lv. is equal to or lower than this Unit");
    expect(tf.attributeFilters).toContainEqual({
      attribute: "level",
      comparison: "lte",
      value: { ref: "source", stat: "level" },
    });
  });

  test("AP higher than this Unit's AP → SourceStatRef ap gt", () => {
    const tf = parseTargetFilter("1 enemy Unit whose AP is higher than this Unit's AP");
    expect(tf.attributeFilters).toContainEqual({
      attribute: "ap",
      comparison: "gt",
      value: { ref: "source", stat: "ap" },
    });
  });

  test("AP equal to or less than this Unit → SourceStatRef ap lte", () => {
    const tf = parseTargetFilter("1 active enemy Unit with AP equal to or less than this Unit");
    expect(tf.attributeFilters).toContainEqual({
      attribute: "ap",
      comparison: "lte",
      value: { ref: "source", stat: "ap" },
    });
  });

  test("HP equal to or lower than this Unit → SourceStatRef hp lte", () => {
    const tf = parseTargetFilter("1 enemy Unit whose HP is equal to or lower than this Unit");
    expect(tf.attributeFilters).toContainEqual({
      attribute: "hp",
      comparison: "lte",
      value: { ref: "source", stat: "hp" },
    });
  });
});

describe("parseTargetFilter — printed card-type unions", () => {
  test("keeps Units/Bases as a Unit-or-Base target union", () => {
    expect(parseTargetFilter("1 of your (AEUG) Units/Bases")).toMatchObject({
      owner: "friendly",
      cardType: ["unit", "base"],
      count: 1,
      attributeFilters: [{ attribute: "trait", comparison: "includes", value: "aeug" }],
    });
  });

  test("keeps a color before a parenthesized trait as a target restriction", () => {
    expect(parseTargetFilter("all friendly green (Earth Federation) Units")).toMatchObject({
      owner: "friendly",
      cardType: "unit",
      count: "all",
      attributeFilters: expect.arrayContaining([
        { attribute: "color", comparison: "eq", value: "green" },
        { attribute: "trait", comparison: "includes", value: "earth federation" },
      ]),
    });
  });
});
