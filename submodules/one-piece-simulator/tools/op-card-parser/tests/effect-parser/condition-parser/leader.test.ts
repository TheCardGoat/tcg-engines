import { expect, test, describe } from "vite-plus/test";
import { parseInlineCondition } from "../../../src/effect-parser/index.ts";

describe("parseInlineCondition", () => {
  describe("leader trait conditions", () => {
    test('your Leader has the "X" type', () => {
      const result = parseInlineCondition(
        'If your Leader has the "Revolutionary Army" type, draw 1 card.',
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "leaderTrait",
        trait: "Revolutionary Army",
      });
      expect(result!.remainingText).toBe("draw 1 card.");
    });

    test("your Leader has the [X] type", () => {
      const result = parseInlineCondition(
        "If your Leader has the [Water Seven] type, K.O. up to 1 of your opponent's Characters.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "leaderTrait",
        trait: "Water Seven",
      });
    });

    test("your Leader has the {X} type", () => {
      const result = parseInlineCondition(
        "If your Leader has the {Donquixote Pirates} type, draw 2 cards.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "leaderTrait",
        trait: "Donquixote Pirates",
      });
    });

    test('your Leader\'s type includes "X"', () => {
      const result = parseInlineCondition(
        'If your Leader\'s type includes "Baroque Works", draw 1 card.',
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "leaderTrait",
        trait: "Baroque Works",
      });
    });
  });

  describe("leader name conditions", () => {
    test("your Leader is [X]", () => {
      const result = parseInlineCondition("If your Leader is [Shirahoshi], draw 2 cards.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "leaderName",
        name: "Shirahoshi",
      });
      expect(result!.remainingText).toBe("draw 2 cards.");
    });
  });

  describe("leader multicolored condition", () => {
    test("your Leader is multicolored", () => {
      const result = parseInlineCondition("If your Leader is multicolored, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "leaderMulticolored",
      });
    });
  });
});

describe("parseInlineCondition — multi-trait leader condition", () => {
  test("your Leader has the {Fish-Man} or {Merfolk} type", () => {
    const result = parseInlineCondition(
      "If your Leader has the {Fish-Man} or {Merfolk} type, play up to 1 green Character card with a cost of 6 or less from your hand.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "leaderTrait", trait: "Fish-Man" },
        { condition: "leaderTrait", trait: "Merfolk" },
      ],
    });
  });

  test("your Leader has the [X] or [Y] type", () => {
    const result = parseInlineCondition(
      "If your Leader has the [Shandian Warrior] or [Skypiea] type, draw 1 card.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "leaderTrait", trait: "Shandian Warrior" },
        { condition: "leaderTrait", trait: "Skypiea" },
      ],
    });
  });

  test("single trait still works", () => {
    const result = parseInlineCondition(
      "If your Leader has the {Donquixote Pirates} type, draw 2 cards.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "leaderTrait",
      trait: "Donquixote Pirates",
    });
  });
});
