import { expect, test, describe } from "vite-plus/test";
import { parseInlineCondition } from "../../../src/effect-parser/index.ts";

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
