/**
 * Direct tests for parseTargetFilter — focuses on branches that are
 * awkward to reach through the public parseEffect API.
 */
import { describe, expect, test } from "vite-plus/test";
import { parseTargetFilter } from "../../scripts/effect-parser/target-filter.ts";

describe("parseTargetFilter — trait-OR group re-scan fallbacks", () => {
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

describe('parseTargetFilter — "battling [descriptor]" clause', () => {
  test('"battling this Unit" → isBattling: true', () => {
    const tf = parseTargetFilter("the enemy Unit battling this Unit");
    expect(tf.owner).toBe("opponent");
    expect(tf.cardType).toBe("unit");
    expect(tf.isBattling).toBe(true);
  });

  test('"battling this card" also emits isBattling: true', () => {
    const tf = parseTargetFilter("the enemy Unit battling this card");
    expect(tf.isBattling).toBe(true);
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

  test("HP equal to or lower than this Unit → SourceStatRef hp lte", () => {
    const tf = parseTargetFilter("1 enemy Unit whose HP is equal to or lower than this Unit");
    expect(tf.attributeFilters).toContainEqual({
      attribute: "hp",
      comparison: "lte",
      value: { ref: "source", stat: "hp" },
    });
  });
});
