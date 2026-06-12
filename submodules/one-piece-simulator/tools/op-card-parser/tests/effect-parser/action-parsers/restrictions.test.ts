import { expect, test, describe } from "vite-plus/test";
import { parseActions } from "../../../src/effect-parser/index.ts";

describe("parseActions — canAttackActive", () => {
  test("This Character can also attack active Characters", () => {
    const result = parseActions("This Character can also attack your opponent's active Characters");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "canAttackActive",
        target: {
          player: "self",
          zones: ["character"],
          count: { amount: 1 },
          self: true,
        },
        duration: "permanent",
      },
    ]);
  });

  test("This Leader can also attack active Characters", () => {
    const result = parseActions("This Leader can also attack your opponent's active Characters");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "canAttackActive",
        target: {
          player: "self",
          zones: ["leader"],
          count: { amount: 1 },
          self: true,
        },
        duration: "permanent",
      },
    ]);
  });
});

describe("parseActions — cannotActivate", () => {
  test("opponent cannot activate [Blocker] during this battle", () => {
    const result = parseActions("Your opponent cannot activate [Blocker] during this battle");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotActivate",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: "all" },
        },
        keyword: "blocker",
        duration: "thisBattle",
      },
    ]);
  });

  test("opponent cannot activate [Blocker] during this turn", () => {
    const result = parseActions("Your opponent cannot activate [Blocker] during this turn");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotActivate",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: "all" },
        },
        keyword: "blocker",
        duration: "thisTurn",
      },
    ]);
  });

  test("opponent cannot activate [Blocker] of Character with cost filter", () => {
    const result = parseActions(
      "your opponent cannot activate the [Blocker] of any Character with a cost of 5 or less during this battle",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotActivate",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: "all" },
          filters: [{ filter: "cost", comparison: "lte", value: 5 }],
        },
        keyword: "blocker",
        duration: "thisBattle",
      },
    ]);
  });

  test("opponent cannot activate [Blocker] Character with power filter", () => {
    const result = parseActions(
      "Your opponent cannot activate a [Blocker] Character that has 2000 or less power during this battle",
    );
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "cannotActivate",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: "all" },
          filters: [{ filter: "power", comparison: "lte", value: 2000 }],
        },
        keyword: "blocker",
        duration: "thisBattle",
      },
    ]);
  });
});

describe("parseActions — negateEffects", () => {
  test("negate effect of target during this turn", () => {
    const result = parseActions(
      "Negate the effect of up to 1 of your opponent's Leader or Character cards during this turn.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "negateEffects",
      target: {
        player: "opponent",
        zones: ["leader", "character"],
        count: { amount: 1, upTo: true },
      },
      duration: "thisTurn",
    });
  });

  test("negate effect without explicit duration defaults to thisTurn", () => {
    const result = parseActions("Negate the effects of up to 1 of your opponent's Characters.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "negateEffects",
      duration: "thisTurn",
    });
  });

  test("negate and give power — compound clause", () => {
    const result = parseActions(
      "Negate the effect of up to 1 of your opponent's Leader or Character cards and give that card 4000 power during this turn.",
    );
    expect(result.parsed.length).toBeGreaterThanOrEqual(1);
    expect(result.parsed[0]).toMatchObject({ action: "negateEffects" });
  });
});

describe("parseActions — cannotAttack", () => {
  test("target cannot attack until end of opponent's next turn", () => {
    const result = parseActions(
      "Up to 1 of your opponent's rested Leader cannot attack until the end of your opponent's next turn.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "cannotAttack",
      target: {
        player: "opponent",
        zones: ["leader"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "state", value: "rested" }],
      },
      duration: "untilEndOfOpponentNextTurn",
    });
  });

  test("target cannot attack during this turn", () => {
    const result = parseActions(
      "Up to 1 of your opponent's Characters cannot attack during this turn.",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "cannotAttack",
      duration: "thisTurn",
    });
  });
});

describe("cannotBeRemoved action", () => {
  test("this Character cannot be removed from the field by opponent's effects", () => {
    const result = parseActions(
      "this Character cannot be removed from the field by your opponent's effects",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "cannotBeRemoved",
      bySource: "opponentEffect",
      duration: "permanent",
    });
    expect(result.unparsed).toBe("");
  });

  test("this Character cannot be removed from the field by your effects", () => {
    const result = parseActions("this Character cannot be removed from the field by your effects");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "cannotBeRemoved",
      bySource: "ownEffect",
      duration: "permanent",
    });
  });
});
