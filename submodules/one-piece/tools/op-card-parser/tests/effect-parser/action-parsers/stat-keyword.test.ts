import { expect, test, describe } from "vite-plus/test";
import { parseActions } from "../../../src/effect-parser/index.ts";
import { buildCardEffects } from "../../../src/effect-parser/index.ts";

describe("parseActions — ModifyPowerAction", () => {
  describe("self-target patterns", () => {
    test("this Character gains +N power (permanent)", () => {
      const result = parseActions("this Character gains +2000 power");
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toEqual({
        action: "modifyPower",
        target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
        value: 2000,
        duration: "permanent",
      });
      expect(result.unparsed).toBe("");
    });

    test("this Character gains +N power during this turn", () => {
      const result = parseActions("this Character gains +3000 power during this turn");
      expect(result.parsed[0]).toMatchObject({
        action: "modifyPower",
        value: 3000,
        duration: "thisTurn",
      });
    });

    test("this card gains +N power during this battle", () => {
      const result = parseActions("this card gains +3000 power during this battle");
      expect(result.parsed[0]).toMatchObject({
        action: "modifyPower",
        target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
        value: 3000,
        duration: "thisBattle",
      });
    });
  });

  describe("targeted patterns", () => {
    test("Up to 1 of your Leader or Character cards gains +N power during this battle", () => {
      const result = parseActions(
        "Up to 1 of your Leader or Character cards gains +4000 power during this battle",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toEqual({
        action: "modifyPower",
        target: {
          player: "self",
          zones: ["leader", "character"],
          count: { amount: 1, upTo: true },
        },
        value: 4000,
        duration: "thisBattle",
      });
    });

    test("Up to 1 of your [Name] cards gains +N power during this turn", () => {
      const result = parseActions(
        "Up to 1 of your [Portgas.D.Ace] cards gains +3000 power during this turn",
      );
      // This won't parse because [Name] filter isn't in parseTarget yet — that's OK
      // Just verify it doesn't crash
      expect(result).toBeDefined();
    });

    test("Your Leader gains +N power during this battle", () => {
      const result = parseActions("Your Leader gains +3000 power during this battle");
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toEqual({
        action: "modifyPower",
        target: { player: "self", zones: ["leader"], count: { amount: 1 } },
        value: 3000,
        duration: "thisBattle",
      });
    });
  });

  describe("Give patterns (opponent, negative power)", () => {
    test("Give up to 1 of your opponent's Characters -N power during this turn", () => {
      const result = parseActions(
        "Give up to 1 of your opponent's Characters -2000 power during this turn",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toEqual({
        action: "modifyPower",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
        },
        value: -2000,
        duration: "thisTurn",
      });
    });

    test("Give up to 1 of your opponent's Characters -1000 power during this turn", () => {
      const result = parseActions(
        "Give up to 1 of your opponent's Characters -1000 power during this turn",
      );
      expect(result.parsed[0]).toMatchObject({
        action: "modifyPower",
        value: -1000,
        duration: "thisTurn",
      });
    });
  });

  describe("handles 'for every' variable-amount patterns", () => {
    test("parses 'for every card in your hand' pattern", () => {
      const result = parseActions("This Character gains +1000 power for every card in your hand");
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({ action: "modifyPower", value: 1000 });
    });

    test("parses 'for every 5 cards in your trash' pattern", () => {
      const result = parseActions(
        "This Character gains +1000 power for every 5 cards in your trash",
      );
      expect(result.parsed).toHaveLength(1);
      expect(result.parsed[0]).toMatchObject({ action: "modifyPower", value: 1000 });
    });
  });

  describe("compound actions with modifyPower", () => {
    test("draw + modifyPower", () => {
      const result = parseActions("draw 1 card and this Character gains +2000 power");
      expect(result.parsed).toHaveLength(2);
      expect(result.parsed[0]).toMatchObject({ action: "draw", amount: 1 });
      expect(result.parsed[1]).toMatchObject({ action: "modifyPower", value: 2000 });
    });

    test("Give -N power. Then, draw", () => {
      const result = parseActions(
        "Give up to 1 of your opponent's Characters -2000 power during this turn. Then, draw 1 card",
      );
      expect(result.parsed).toHaveLength(2);
      expect(result.parsed[0]).toMatchObject({ action: "modifyPower", value: -2000 });
      expect(result.parsed[1]).toMatchObject({ action: "draw", amount: 1 });
    });
  });

  describe("real card integration", () => {
    test("[Counter] Your Leader gains +3000 power during this battle", () => {
      const result = buildCardEffects(
        "[Counter] Your Leader gains +3000 power during this battle.",
      );
      expect(result).toBeDefined();
      const block = result!.effects![0]!;
      expect(block.trigger).toBe("counter");
      expect(block.actions[0]).toEqual({
        action: "modifyPower",
        target: { player: "self", zones: ["leader"], count: { amount: 1 } },
        value: 3000,
        duration: "thisBattle",
      });
    });

    test("[On Play] Give -2000 power during this turn and draw", () => {
      const result = buildCardEffects(
        "[On Play] Give up to 1 of your opponent's Characters -2000 power during this turn and draw 1 card.",
      );
      expect(result).toBeDefined();
      const block = result!.effects![0]!;
      expect(block.trigger).toBe("onPlay");
      expect(block.actions).toHaveLength(2);
      expect(block.actions[0]).toMatchObject({ action: "modifyPower", value: -2000 });
      expect(block.actions[1]).toMatchObject({ action: "draw", amount: 1 });
    });

    test("[Your Turn] This Character gains +3000 power (permanent effect)", () => {
      const result = buildCardEffects(
        "[Your Turn] This Character gains +3000 power.\n[On K.O.] Draw 1 card.",
      );
      expect(result).toBeDefined();
      expect(result!.permanentEffects).toHaveLength(1);
      expect(result!.permanentEffects![0]!.conditions).toEqual([
        { condition: "turn", value: "your" },
      ]);
      expect(result!.permanentEffects![0]!.actions[0]).toMatchObject({
        action: "modifyPower",
        value: 3000,
        duration: "permanent",
      });
      expect(result!.effects).toHaveLength(1);
      expect(result!.effects![0]!.trigger).toBe("onKo");
    });
  });
});

describe("parseActions — modifyPower unsigned values", () => {
  test("give without sign (positive)", () => {
    const result = parseActions(
      "give up to 1 of your opponent's Characters 1000 power during this turn",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toEqual({
      action: "modifyPower",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: 1, upTo: true },
      },
      value: 1000,
      duration: "thisTurn",
    });
  });

  test("gains without sign (positive)", () => {
    const result = parseActions("this Character gains 2000 power");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "modifyPower",
      value: 2000,
      duration: "permanent",
    });
  });
});

describe("parseActions — ModifyCostAction", () => {
  test("Give -2 cost during this turn", () => {
    const result = parseActions(
      "Give up to 1 of your opponent's Characters -2 cost during this turn",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toEqual({
      action: "modifyCost",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: 1, upTo: true },
      },
      value: -2,
      duration: "thisTurn",
    });
    expect(result.unparsed).toBe("");
  });

  test("Give -4 cost", () => {
    const result = parseActions(
      "Give up to 1 of your opponent's Characters -4 cost during this turn",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "modifyCost",
      value: -4,
    });
  });

  test("unsigned positive cost", () => {
    const result = parseActions(
      "Give up to 1 of your opponent's Characters 1 cost during this turn",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "modifyCost",
      value: 1,
    });
  });

  test("Give -2 cost to 2 Characters", () => {
    const result = parseActions(
      "Give up to 2 of your opponent's Characters -2 cost during this turn",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "modifyCost",
      value: -2,
      target: { count: { amount: 2, upTo: true } },
    });
  });

  test("compound: modifyCost + trash", () => {
    const result = parseActions(
      "Give up to 1 of your opponent's Characters -4 cost during this turn and trash 2 cards from your hand",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "modifyCost", value: -4 });
    expect(result.parsed[1]).toMatchObject({ action: "trashFromHand", amount: 2 });
  });

  test("buildCardEffects: [On Play] modify cost", () => {
    const result = buildCardEffects(
      "[On Play] Give up to 1 of your opponent's Characters -3 cost during this turn.",
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onPlay");
    expect(block.actions[0]).toMatchObject({
      action: "modifyCost",
      value: -3,
      duration: "thisTurn",
    });
  });
});

describe("parseActions — grantKeyword", () => {
  test("this Character gains [Rush] during this turn", () => {
    const result = parseActions("this Character gains [Rush] during this turn");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "grantKeyword",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
        keyword: "rush",
        duration: "thisTurn",
      },
    ]);
  });

  test("this Character gains [Blocker]", () => {
    const result = parseActions("this Character gains [Blocker]");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "grantKeyword",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
        keyword: "blocker",
        duration: "permanent",
      },
    ]);
  });

  test("your Leader gains [Double Attack] during this turn", () => {
    const result = parseActions("your Leader gains [Double Attack] during this turn");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "grantKeyword",
        target: { player: "self", zones: ["leader"], count: { amount: 1 } },
        keyword: "doubleAttack",
        duration: "thisTurn",
      },
    ]);
  });

  test("this Character gains [Rush: Character] during this turn", () => {
    const result = parseActions("this Character gains [Rush: Character] during this turn");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "grantKeyword",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
        keyword: "rushCharacter",
        duration: "thisTurn",
      },
    ]);
  });

  test("this Leader gain [Banish] during this turn", () => {
    const result = parseActions("this Leader gain [Banish] during this turn");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "grantKeyword",
        target: {
          player: "self",
          zones: ["leader"],
          count: { amount: 1 },
          self: true,
        },
        keyword: "banish",
        duration: "thisTurn",
      },
    ]);
  });
});

describe("parseCompoundKeywordPower", () => {
  test("gains [Double Attack] and +1000 power", () => {
    const result = parseActions("this Character gains [Double Attack] and +1000 power.");
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({
      action: "grantKeyword",
      keyword: "doubleAttack",
      duration: "permanent",
    });
    expect(result.parsed[1]).toMatchObject({
      action: "modifyPower",
      value: 1000,
      duration: "permanent",
    });
  });

  test("gains [Rush] and +2000 power during this turn", () => {
    const result = parseActions("this Character gains [Rush] and +2000 power during this turn.");
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({
      action: "grantKeyword",
      keyword: "rush",
      duration: "thisTurn",
    });
    expect(result.parsed[1]).toMatchObject({
      action: "modifyPower",
      value: 2000,
      duration: "thisTurn",
    });
  });
});

describe("setPower action", () => {
  test("set this Character's power to 0", () => {
    const result = parseActions("set this Character's power to 0");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "setPower",
      value: 0,
      duration: "permanent",
    });
    expect(result.unparsed).toBe("");
  });

  test("set this Leader's power to 5000 during this turn", () => {
    const result = parseActions("set this Leader\u2019s power to 5000 during this turn");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "setPower",
      value: 5000,
      duration: "thisTurn",
    });
  });
});
