import { expect, test, describe } from "vite-plus/test";
import { parseEffectText, parseInlineCondition } from "../../src/effect-parser/index.ts";

describe("parseInlineCondition", () => {
  test("returns null for text without If prefix", () => {
    expect(parseInlineCondition("draw 1 card")).toBeNull();
  });

  test("returns null for unparseable condition", () => {
    expect(parseInlineCondition("If some unknown condition, draw 1 card")).toBeNull();
  });

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

  describe("leader multicolored condition", () => {
    test("your Leader is multicolored", () => {
      const result = parseInlineCondition("If your Leader is multicolored, draw 1 card.");
      expect(result).not.toBeNull();
      expect(result!.condition).toEqual({
        condition: "leaderMulticolored",
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

// ── buildCardEffects — inline condition integration ──

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

describe("parseInlineCondition — replacement conditions", () => {
  test("this Character would be K.O.'d (no source)", () => {
    const result = parseInlineCondition(
      "If this Character would be K.O.'d, you may rest your Leader instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "replacement",
      event: "ko",
      targetSelf: true,
    });
  });

  test("this Character would be K.O.'d in battle", () => {
    const result = parseInlineCondition(
      "If this Character would be K.O.'d in battle, you may add 1 card from the top of your Life cards to your hand instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "replacement",
      event: "ko",
      targetSelf: true,
      source: "battle",
    });
  });

  test("this Character would be K.O.'d by your opponent's effect", () => {
    const result = parseInlineCondition(
      "If this Character would be K.O.'d by your opponent's effect, you may rest 2 DON!! cards instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "replacement",
      event: "ko",
      targetSelf: true,
      source: "opponentEffect",
    });
  });

  test("this Character would be K.O.'d by an effect", () => {
    const result = parseInlineCondition(
      "If this Character would be K.O.'d by an effect, you may trash 1 Event card from your hand instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "replacement",
      event: "ko",
      targetSelf: true,
      source: "effect",
    });
  });

  test("this Character would be removed from the field by your opponent's effect", () => {
    const result = parseInlineCondition(
      "If this Character would be removed from the field by your opponent's effect, you may trash 1 card from your hand instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "replacement",
      event: "removed",
      targetSelf: true,
      source: "opponentEffect",
    });
  });

  test("this Character would be rested by your opponent's Character's effect", () => {
    const result = parseInlineCondition(
      "If this Character would be rested by your opponent's Character's effect, you may rest 1 of your other Characters instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "replacement",
      event: "rested",
      targetSelf: true,
      source: "opponentCharacterEffect",
    });
  });

  test("this Character would leave the field", () => {
    const result = parseInlineCondition(
      "If this Character would leave the field, you may trash 1 card from the top of your Life cards instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "replacement",
      event: "leave",
      targetSelf: true,
    });
  });

  test("compound: K.O.'d or removed", () => {
    const result = parseInlineCondition(
      "If this Character would be K.O.'d or would be removed from the field by your opponent's effect, you may trash 1 card instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "replacement", event: "ko", targetSelf: true },
        { condition: "replacement", event: "removed", targetSelf: true, source: "opponentEffect" },
      ],
    });
  });

  test("compound: removed or K.O.'d", () => {
    const result = parseInlineCondition(
      "If this Character would be removed from the field by your opponent's effect or K.O.'d, trash this Character and draw 1 card instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toMatchObject({
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "replacement", event: "removed", targetSelf: true, source: "opponentEffect" },
        { condition: "replacement", event: "ko", targetSelf: true },
      ],
    });
  });

  test("non-self: your rested Character would be K.O.'d", () => {
    const result = parseInlineCondition(
      "If your rested Character would be K.O.'d, you may trash this Character instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "replacement",
      event: "ko",
      targetSelf: false,
    });
  });

  test("non-self: your Character with 5000 power or more would be K.O.'d", () => {
    const result = parseInlineCondition(
      "If your Character with 5000 power or more would be K.O.'d, you may give that Character 1000 power instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "replacement",
      event: "ko",
      targetSelf: false,
    });
  });

  test("non-self: your {trait} type Character would be removed by opponent's effect", () => {
    const result = parseInlineCondition(
      "If your {Supernovas} type Character would be removed from the field by your opponent's effect, you may give your Leader 2000 power instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "replacement",
      event: "removed",
      targetSelf: false,
      source: "opponentEffect",
    });
  });

  test("any of your Characters would be K.O.'d in battle", () => {
    const result = parseInlineCondition(
      "If any of your Characters would be K.O.'d in battle during this turn, you may trash 1 card from your hand instead.",
    );
    expect(result).not.toBeNull();
    expect(result!.condition).toEqual({
      condition: "replacement",
      event: "ko",
      targetSelf: false,
      source: "battle",
    });
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

// ── Grant Keyword action tests ──

describe("parseInlineCondition — When patterns", () => {
  test("When this Character's attack deals damage to opponent's Life", () => {
    const result = parseInlineCondition(
      "When this Character's attack deals damage to your opponent's Life, you may trash 7 cards from the top of your deck.",
    );
    expect(result).toBeDefined();
    expect(result!.condition).toEqual({ condition: "triggerEvent", event: "whenDealsDamage" });
    expect(result!.remainingText).toBe("you may trash 7 cards from the top of your deck.");
  });

  test("When this Character is K.O.'d", () => {
    const result = parseInlineCondition(
      "When this Character is K.O.'d, your opponent returns 2 DON!! cards from their field to their DON!! deck.",
    );
    expect(result).toBeDefined();
    expect(result!.condition).toEqual({ condition: "triggerEvent", event: "onKo" });
  });

  test("When a DON!! card on your field is returned", () => {
    const result = parseInlineCondition(
      "When a DON!! card on your field is returned to your DON!! deck, draw 1 card.",
    );
    expect(result).toBeDefined();
    expect(result!.condition).toEqual({ condition: "triggerEvent", event: "whenDonReturned" });
    expect(result!.remainingText).toBe("draw 1 card.");
  });

  test("When your opponent activates an Event", () => {
    const result = parseInlineCondition(
      "When your opponent activates an Event, your opponent must place 1 card from their hand at the bottom of their deck.",
    );
    expect(result).toBeDefined();
    expect(result!.condition).toEqual({
      condition: "triggerEvent",
      event: "whenOpponentActivatesEvent",
    });
  });

  test("When opponent's Character is returned by your effect", () => {
    const result = parseInlineCondition(
      "When your opponent's Character is returned to the owner's hand by your effect, look at 3 cards from the top of your deck.",
    );
    expect(result).toBeDefined();
    expect(result!.condition).toEqual({ condition: "triggerEvent", event: "whenLeaving" });
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

describe("parseWhenEvent — new entries", () => {
  test("whenCharacterKod: a Character is K.O.'d produces inline condition", () => {
    const result = parseEffectText(
      "[Once Per Turn] When a Character is K.O.'d, draw 1 card and trash 1 card from your hand.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.rawActionText).toMatch(/draw 1 card/i);
  });

  test("whenDonReturned: by your effect variant parses correctly", () => {
    const result = parseEffectText(
      "[Opponent's Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck by your effect, add up to 1 DON!! card from your DON!! deck and rest it.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.conditions).toContainEqual({ condition: "turn", value: "opponent" });
  });

  test("whenTriggerActivates: a [Trigger] activates parses correctly", () => {
    const result = parseEffectText(
      "[Opponent's Turn] When a [Trigger] activates, this Character gains [Blocker] during this turn.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.conditions).toContainEqual({ condition: "turn", value: "opponent" });
  });
});
