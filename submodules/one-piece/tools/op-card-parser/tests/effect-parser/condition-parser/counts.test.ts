import { expect, test, describe } from "vite-plus/test";
import { parseInlineCondition } from "../../../src/effect-parser/index.ts";

describe("parseInlineCondition", () => {
  describe("life count conditions", () => {
    test("you have N or less Life cards", () => {
      const result = parseInlineCondition("If you have 2 or less Life cards, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "lifeCount",
        player: "self",
        comparison: "lte",
        value: 2,
      });
    });

    test("your opponent has N or less Life cards", () => {
      const result = parseInlineCondition(
        "If your opponent has 3 or less Life cards, draw 1 card.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "lifeCount",
        player: "opponent",
        comparison: "lte",
        value: 3,
      });
    });
  });

  describe("hand count conditions", () => {
    test("you have N or less cards in your hand", () => {
      const result = parseInlineCondition("If you have 4 or less cards in your hand, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "handCount",
        player: "self",
        comparison: "lte",
        value: 4,
      });
    });

    test("you have N or more cards in your hand", () => {
      const result = parseInlineCondition("If you have 5 or more cards in your hand, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "handCount",
        player: "self",
        comparison: "gte",
        value: 5,
      });
    });
  });

  describe("zone count conditions", () => {
    test("you have N or more cards in your trash", () => {
      const result = parseInlineCondition(
        "If you have 7 or more cards in your trash, draw 1 card.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "zoneCount",
        player: "self",
        zone: "trash",
        comparison: "gte",
        value: 7,
      });
    });

    test("you have N or more Events in your trash", () => {
      const result = parseInlineCondition(
        "If you have 4 or more Events in your trash, draw 2 cards.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "zoneCount",
        player: "self",
        zone: "trash",
        comparison: "gte",
        value: 4,
        filters: [{ filter: "cardCategory", value: "event" }],
      });
    });

    test("you have N or more Characters", () => {
      const result = parseInlineCondition("If you have 3 or more Characters, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "zoneCount",
        player: "self",
        zone: "character",
        comparison: "gte",
        value: 3,
      });
    });

    test("you have N or more rested Characters", () => {
      const result = parseInlineCondition("If you have 2 or more rested Characters, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "zoneCount",
        player: "self",
        zone: "character",
        comparison: "gte",
        value: 2,
        filters: [{ filter: "state", value: "rested" }],
      });
    });

    test("you have N or less cards in your deck", () => {
      const result = parseInlineCondition(
        "If you have 20 or less cards in your deck, draw 1 card.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "zoneCount",
        player: "self",
        zone: "deck",
        comparison: "lte",
        value: 20,
      });
    });
  });

  describe("opponent hand count conditions", () => {
    test("your opponent has N or more cards in their hand", () => {
      const result = parseInlineCondition(
        "If your opponent has 5 or more cards in their hand, draw 1 card.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "handCount",
        player: "opponent",
        comparison: "gte",
        value: 5,
      });
    });

    test("your opponent has N or less cards in their hand", () => {
      const result = parseInlineCondition(
        "If your opponent has 3 or less cards in their hand, draw 1 card.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "handCount",
        player: "opponent",
        comparison: "lte",
        value: 3,
      });
    });
  });

  describe("DON!! field count conditions", () => {
    test("you have N or more DON!! cards on your field", () => {
      const result = parseInlineCondition(
        "If you have 8 or more DON!! cards on your field, draw 2 cards.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "donFieldCount",
        player: "self",
        comparison: "gte",
        value: 8,
      });
    });

    test("you have N DON!! cards on your field (exact)", () => {
      const result = parseInlineCondition("If you have 10 DON!! cards on your field, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "donFieldCount",
        player: "self",
        comparison: "eq",
        value: 10,
      });
    });

    test("you have N or more active DON!! cards", () => {
      const result = parseInlineCondition("If you have 3 or more active DON!! cards, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "donFieldCount",
        player: "self",
        comparison: "gte",
        value: 3,
      });
    });
  });

  describe("DON!! field comparison conditions", () => {
    test("number of DON!! on your field is equal to or less than opponent's", () => {
      const result = parseInlineCondition(
        "If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, draw 1 card.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "donFieldComparison",
        selfComparison: "lte",
      });
    });

    test("your opponent has more DON!! cards on their field than you", () => {
      const result = parseInlineCondition(
        "If your opponent has more DON!! cards on their field than you, draw 1 card.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "donFieldComparison",
        selfComparison: "lt",
      });
    });
  });

  describe("life comparison conditions", () => {
    test("you have less life cards than your opponent", () => {
      const result = parseInlineCondition(
        "If you have less life cards than your opponent, draw 1 card.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "lifeComparison",
        selfComparison: "lt",
      });
    });

    test("the number of your life cards is equal to or less than opponent's", () => {
      const result = parseInlineCondition(
        "If the number of your life cards is equal to or less than the number of your opponent's life cards, draw 1 card.",
      );
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "lifeComparison",
        selfComparison: "lte",
      });
    });
  });
});

describe("parseInlineCondition — compound conditions", () => {
  test("leader multicolored and hand count", () => {
    const result = parseInlineCondition(
      "If your Leader is multicolored and you have 5 or less cards in your hand, draw 2 cards.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "and",
      conditions: [
        { condition: "leaderMulticolored" },
        { condition: "handCount", player: "self", comparison: "lte", value: 5 },
      ],
    });
    expect(result!.remainingText).toBe("draw 2 cards.");
  });

  test("DON field comparison and hand count", () => {
    const result = parseInlineCondition(
      "If the number of DON!! cards on your field is equal to or less than the number on your opponent's field and you have 5 or less cards in your hand, draw 2 cards.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "and",
      conditions: [
        { condition: "donFieldComparison", selfComparison: "lte" },
        { condition: "handCount", player: "self", comparison: "lte", value: 5 },
      ],
    });
  });

  test("leader trait and life count", () => {
    const result = parseInlineCondition(
      "If your Leader has the [Animal Kingdom Pirates] type and you have 10 DON!! cards on your field, K.O. up to 1.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "and",
      conditions: [
        { condition: "leaderTrait", trait: "Animal Kingdom Pirates" },
        { condition: "donFieldCount", player: "self", comparison: "eq", value: 10 },
      ],
    });
  });

  test("leader name and DON field count", () => {
    const result = parseInlineCondition(
      "If your Leader is [Sanji] and you have 4 or more DON!! cards on your field, draw 1 card.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "and",
      conditions: [
        { condition: "leaderName", name: "Sanji" },
        { condition: "donFieldCount", player: "self", comparison: "gte", value: 4 },
      ],
    });
  });

  test("leader multicolored and opponent DON field count", () => {
    const result = parseInlineCondition(
      "If your Leader is multicolored and your opponent has 5 or more DON!! cards on their field, this Character gains [Rush].",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "and",
      conditions: [
        { condition: "leaderMulticolored" },
        { condition: "donFieldCount", player: "opponent", comparison: "gte", value: 5 },
      ],
    });
  });

  test("leader name and DON given", () => {
    const result = parseInlineCondition(
      "If your Leader is [Gol.D.Roger] and you have any DON!! cards given, draw 1 card.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "and",
      conditions: [
        { condition: "leaderName", name: "Gol.D.Roger" },
        { condition: "donGiven", player: "self" },
      ],
    });
  });

  test("leader multicolored and opponent life count", () => {
    const result = parseInlineCondition(
      "If your Leader is multicolored and your opponent has 3 or less Life cards, draw 1 card.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "and",
      conditions: [
        { condition: "leaderMulticolored" },
        { condition: "lifeCount", player: "opponent", comparison: "lte", value: 3 },
      ],
    });
  });

  test("leader trait {braces} and life count", () => {
    const result = parseInlineCondition(
      "If your Leader has the {Egghead} type and you have 2 or more Life cards, add up to 1.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "and",
      conditions: [
        { condition: "leaderTrait", trait: "Egghead" },
        { condition: "lifeCount", player: "self", comparison: "gte", value: 2 },
      ],
    });
  });

  test("leader trait and has card with name", () => {
    const result = parseInlineCondition(
      "If your Leader has the [Shandian Warrior] type and you have a [Kalgara] Character, draw 1 card.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "and",
      conditions: [
        { condition: "leaderTrait", trait: "Shandian Warrior" },
        {
          condition: "hasCard",
          player: "self",
          zone: "character",
          filters: [{ filter: "name", value: "Kalgara" }],
        },
      ],
    });
  });

  test("leader trait and opponent rested cards", () => {
    const result = parseInlineCondition(
      "If your Leader has the [Minks] type and your opponent has 7 or more rested cards, draw 1 card.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "and",
      conditions: [
        { condition: "leaderTrait", trait: "Minks" },
        {
          condition: "zoneCount",
          player: "opponent",
          zone: "field",
          comparison: "gte",
          value: 7,
          filters: [{ filter: "state", value: "rested" }],
        },
      ],
    });
  });

  test("leader trait and replacement condition", () => {
    const result = parseInlineCondition(
      "If your Leader has the [The Seven Warlords of the Sea] type and this Character would be removed from the field by your opponent's effect, you may place 1 card.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "and",
      conditions: [
        { condition: "leaderTrait", trait: "The Seven Warlords of the Sea" },
        {
          condition: "replacement",
          event: "removed",
          targetSelf: true,
          source: "opponentEffect",
        },
      ],
    });
  });
});
