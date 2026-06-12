import { expect, test, describe } from "vite-plus/test";
import { parseTarget } from "../../src/effect-parser/index.ts";

describe("parseTarget", () => {
  test("parses self-reference: 'this Character'", () => {
    const target = parseTarget("this Character");
    expect(target).toEqual({
      player: "self",
      zones: ["character"],
      count: { amount: 1 },
      self: true,
    });
  });

  test("parses self-reference: 'this Leader'", () => {
    const target = parseTarget("this Leader");
    expect(target).toEqual({
      player: "self",
      zones: ["leader"],
      count: { amount: 1 },
      self: true,
    });
  });

  test("parses simple opponent character target", () => {
    const target = parseTarget("up to 1 of your opponent's Characters");
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 1, upTo: true },
    });
  });

  test("parses count without 'up to'", () => {
    const target = parseTarget("1 of your opponent's Characters");
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 1 },
    });
  });

  test("parses 'your' as self player", () => {
    const target = parseTarget("up to 1 of your Characters");
    expect(target).toEqual({
      player: "self",
      zones: ["character"],
      count: { amount: 1, upTo: true },
    });
  });

  test("parses cost filter: 'with a cost of 5 or less'", () => {
    const target = parseTarget("up to 1 of your opponent's Characters with a cost of 5 or less");
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "cost", comparison: "lte", value: 5 }],
    });
  });

  test("parses exact cost filter: 'with a cost of 0'", () => {
    const target = parseTarget("up to 1 of your opponent's Characters with a cost of 0");
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "cost", comparison: "eq", value: 0 }],
    });
  });

  test("parses base cost filter", () => {
    const target = parseTarget(
      "up to 1 of your opponent's Characters with a base cost of 6 or less",
    );
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "baseCost", comparison: "lte", value: 6 }],
    });
  });

  test("parses base power filter: 'with 7000 base power or less'", () => {
    const target = parseTarget(
      "up to 1 of your opponent's Characters with 7000 base power or less",
    );
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "basePower", comparison: "lte", value: 7000 }],
    });
  });

  test("parses multiple zones: 'Leader or Character cards'", () => {
    const target = parseTarget("up to 1 of your opponent's Leader or Character cards");
    expect(target).toEqual({
      player: "opponent",
      zones: ["leader", "character"],
      count: { amount: 1, upTo: true },
    });
  });

  test("parses DON!! cards zone", () => {
    const target = parseTarget("up to 1 of your opponent's DON!! cards");
    expect(target).toEqual({
      player: "opponent",
      zones: ["costArea"],
      count: { amount: 1, upTo: true },
    });
  });

  test("parses mixed zones: 'DON!! cards or Characters'", () => {
    const target = parseTarget(
      "up to 1 of your opponent's DON!! cards or Characters with a cost of 3 or less",
    );
    expect(target).toEqual({
      player: "opponent",
      zones: ["costArea", "character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "cost", comparison: "lte", value: 3 }],
    });
  });

  test("parses generic 'cards'", () => {
    const target = parseTarget("up to 2 of your opponent's cards");
    expect(target).toEqual({
      player: "opponent",
      zones: ["leader", "character", "stage", "costArea"],
      count: { amount: 2, upTo: true },
    });
  });

  test("parses 'a total of' as regular count with multiple zones", () => {
    const target = parseTarget("up to a total of 2 of your opponent's Characters or DON!! cards");
    expect(target).toEqual({
      player: "opponent",
      zones: ["character", "costArea"],
      count: { amount: 2, upTo: true },
    });
  });

  test("parses higher count", () => {
    const target = parseTarget("up to 2 of your opponent's Characters with a cost of 2 or less");
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 2, upTo: true },
      filters: [{ filter: "cost", comparison: "lte", value: 2 }],
    });
  });

  test("returns null for empty string", () => {
    expect(parseTarget("")).toBeNull();
  });

  test("returns null for unrecognized text", () => {
    expect(parseTarget("something random")).toBeNull();
  });

  test("name filter: [Spandam] Characters", () => {
    const target = parseTarget("up to 1 of your [Spandam] Characters");
    expect(target).toEqual({
      player: "self",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "name", value: "Spandam" }],
    });
  });

  test("trait filter: {SWORD} type Leader or Character cards", () => {
    const target = parseTarget("up to 1 of your {SWORD} type Leader or Character cards");
    expect(target).toEqual({
      player: "self",
      zones: ["leader", "character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "trait", value: "SWORD" }],
    });
  });

  test("color filter: red Characters with a cost of 1", () => {
    const target = parseTarget("up to 1 of your red Characters with a cost of 1");
    expect(target).toEqual({
      player: "self",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [
        { filter: "color", value: "red" },
        { filter: "cost", comparison: "eq", value: 1 },
      ],
    });
  });

  test("comma-separated traits: [A], [B], or [C] type Characters", () => {
    const target = parseTarget("up to 1 of your [Amazon Lily] or [Kuja Pirates] type Characters");
    expect(target).toEqual({
      player: "self",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [
        { filter: "trait", value: "Amazon Lily" },
        { filter: "trait", value: "Kuja Pirates" },
      ],
    });
  });

  test('quoted trait: "Cross Guild" type cards', () => {
    const target = parseTarget('up to 1 of your "Cross Guild" type cards');
    expect(target).toEqual({
      player: "self",
      zones: ["leader", "character", "stage", "costArea"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "trait", value: "Cross Guild" }],
    });
  });
});

describe("parseTarget — state filters", () => {
  test("parses 'rested Characters'", () => {
    const target = parseTarget(
      "up to 1 of your opponent's rested Characters with a cost of 4 or less",
    );
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [
        { filter: "state", value: "rested" },
        { filter: "cost", comparison: "lte", value: 4 },
      ],
    });
  });

  test("parses 'active Characters'", () => {
    const target = parseTarget("up to 1 of your opponent's active Characters");
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "state", value: "active" }],
    });
  });

  test("parses rested Characters without additional filters", () => {
    const target = parseTarget("up to 1 of your opponent's rested Characters");
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "state", value: "rested" }],
    });
  });
});

describe("parseTarget — alternate base power format", () => {
  test("parses 'with a base power of 6000 or less'", () => {
    const target = parseTarget(
      "up to 1 of your opponent's Characters with a base power of 6000 or less",
    );
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "basePower", comparison: "lte", value: 6000 }],
    });
  });

  test("parses 'with a base power of 3000' (exact)", () => {
    const target = parseTarget("up to 1 of your opponent's Characters with a base power of 3000");
    expect(target).toEqual({
      player: "opponent",
      zones: ["character"],
      count: { amount: 1, upTo: true },
      filters: [{ filter: "basePower", comparison: "eq", value: 3000 }],
    });
  });
});
