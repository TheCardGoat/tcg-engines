import { expect, test, describe } from "vite-plus/test";
import { parseInlineCondition } from "../../../src/effect-parser/index.ts";

describe("parseInlineCondition", () => {
  describe("card state conditions", () => {
    test("this Character has N power or more", () => {
      const result = parseInlineCondition("If this Character has 5000 power or more, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "cardState",
        target: "this",
        property: "power",
        comparison: "gte",
        value: 5000,
      });
    });

    test("this Character has N power or less", () => {
      const result = parseInlineCondition(
        "If this Character has 3000 power or less, rest 1 of your DON!! cards.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "cardState",
        target: "this",
        property: "power",
        comparison: "lte",
        value: 3000,
      });
    });

    test("this Character is rested", () => {
      const result = parseInlineCondition("If this Character is rested, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "cardState",
        target: "this",
        property: "state",
        comparison: "eq",
        value: "rested",
      });
    });

    test("this Character is active", () => {
      const result = parseInlineCondition("If this Character is active, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "cardState",
        target: "this",
        property: "state",
        comparison: "eq",
        value: "active",
      });
    });
  });

  describe("DON!! given condition", () => {
    test("you have any DON!! cards given", () => {
      const result = parseInlineCondition("If you have any DON!! cards given, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "donGiven",
        player: "self",
      });
    });
  });

  describe("has card conditions", () => {
    test("your opponent has a Character with a cost of 0", () => {
      const result = parseInlineCondition(
        "If your opponent has a Character with a cost of 0, draw 1 card.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "hasCard",
        player: "opponent",
        zone: "character",
        filters: [{ filter: "cost", comparison: "eq", value: 0 }],
      });
    });

    test("you have a Character with a cost of 8 or more", () => {
      const result = parseInlineCondition(
        "If you have a Character with a cost of 8 or more, draw 1 card.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "hasCard",
        player: "self",
        zone: "character",
        filters: [{ filter: "cost", comparison: "gte", value: 8 }],
      });
    });
  });
});

describe("parseInlineCondition — played this turn", () => {
  test("this Character was played on this turn", () => {
    const result = parseInlineCondition(
      "If this Character was played on this turn, trash up to 1 of your opponent's Characters.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({ condition: "playedThisTurn" });
  });

  test("this Character has played on this turn", () => {
    const result = parseInlineCondition(
      "If this Character has played on this turn, set your Leader as active.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({ condition: "playedThisTurn" });
  });
});

describe("parseInlineCondition — exists on field", () => {
  test("there is a Character with a cost of 0", () => {
    const result = parseInlineCondition(
      "If there is a Character with a cost of 0, this Character gains +2000 power during this battle.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "existsOnField",
      zone: "character",
      filters: [{ filter: "cost", comparison: "eq", value: 0 }],
    });
  });

  test("there is a Character with a cost of 8 or more", () => {
    const result = parseInlineCondition(
      "If there is a Character with a cost of 8 or more, draw 1 card.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "existsOnField",
      zone: "character",
      filters: [{ filter: "cost", comparison: "gte", value: 8 }],
    });
  });

  test("there is a Character with a cost of 5 or more", () => {
    const result = parseInlineCondition(
      "If there is a Character with a cost of 5 or more, set up to 3 DON!! cards as active.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "existsOnField",
      zone: "character",
      filters: [{ filter: "cost", comparison: "gte", value: 5 }],
    });
  });

  test("there is a Character with 8000 power or more", () => {
    const result = parseInlineCondition(
      "If there is a Character with 8000 power or more, up to 1 of your Leader or Character cards gains +4000 power during this battle.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "existsOnField",
      zone: "character",
      filters: [{ filter: "power", comparison: "gte", value: 8000 }],
    });
  });
});

describe("parseInlineCondition — face-up life", () => {
  test("you have a face-up Life card", () => {
    const result = parseInlineCondition(
      "If you have a face-up Life card, play up to 1 [Sabo] with a cost of 2 from your hand.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({ condition: "faceUpLife", player: "self" });
  });
});

describe("parseInlineCondition — additional simple conditions", () => {
  test("opponent DON field count", () => {
    const result = parseInlineCondition(
      "If your opponent has 6 or more DON!! cards on their field, your opponent returns 1 DON!! card.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "donFieldCount",
      player: "opponent",
      comparison: "gte",
      value: 6,
    });
  });

  test("opponent rested cards count", () => {
    const result = parseInlineCondition(
      "If your opponent has 7 or more rested cards, this Character gains [Rush].",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "zoneCount",
      player: "opponent",
      zone: "field",
      comparison: "gte",
      value: 7,
      filters: [{ filter: "state", value: "rested" }],
    });
  });

  test("has card with name: you have a [Kalgara] Character", () => {
    const result = parseInlineCondition("If you have a [Kalgara] Character, draw 1 card.");
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [{ filter: "name", value: "Kalgara" }],
    });
  });

  test('leader name with quotes: your Leader is "Shirahoshi"', () => {
    const result = parseInlineCondition(
      'If your Leader is "Shirahoshi", up to 1 of your cards gains +2000 power.',
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "leaderName",
      name: "Shirahoshi",
    });
  });

  test("opponent has Character with base power", () => {
    const result = parseInlineCondition(
      "If your opponent has a Character with a base power of 6000 or more, this Character cannot be K.O.'d in battle.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "hasCard",
      player: "opponent",
      zone: "character",
      filters: [{ filter: "basePower", comparison: "gte", value: 6000 }],
    });
  });
});

describe("parseSingleCondition — new patterns", () => {
  test("compound DON!! count: 0 or 3 or more", () => {
    const result = parseInlineCondition(
      "If you have 0 or 3 or more DON!! cards on your field, add up to 1 DON!! card from your DON!! deck and set it as active.",
    );
    expect(result).toBeDefined();
    expect(result!.condition).toEqual({
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "donFieldCount", player: "self", comparison: "eq", value: 0 },
        { condition: "donFieldCount", player: "self", comparison: "gte", value: 3 },
      ],
    });
  });

  test("has card with trait and cost", () => {
    const result = parseInlineCondition(
      'If you have a "Land of Wano" type Character with a cost of 5 or more, this Leader gains +1000 power until the start of your next turn.',
    );
    expect(result).toBeDefined();
    expect(result!.condition).toEqual({
      condition: "hasCard",
      player: "self",
      zone: "character",
      filters: [
        { filter: "trait", value: "Land of Wano" },
        { filter: "cost", comparison: "gte", value: 5 },
      ],
    });
  });

  test("not has card with base power", () => {
    const result = parseInlineCondition(
      "If you have no Characters with 6000 base power or more, this Character gains +4000 power.",
    );
    expect(result).toBeDefined();
    expect(result!.condition).toEqual({
      condition: "notHasCard",
      player: "self",
      zone: "character",
      filters: [{ filter: "basePower", comparison: "gte", value: 6000 }],
    });
  });

  test("this Character is rested (condition)", () => {
    const result = parseInlineCondition(
      "If this Character is rested, your active Characters with a base cost of 5 cannot be K.O.'d by effects.",
    );
    expect(result).toBeDefined();
    expect(result!.condition).toEqual({
      condition: "cardState",
      target: "this",
      property: "state",
      comparison: "eq",
      value: "rested",
    });
  });
});
