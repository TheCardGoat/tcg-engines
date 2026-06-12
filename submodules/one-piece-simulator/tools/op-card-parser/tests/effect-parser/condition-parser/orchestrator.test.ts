import { expect, test, describe } from "vite-plus/test";
import { parseInlineCondition, parseEffectText } from "../../../src/effect-parser/index.ts";

describe("parseInlineCondition", () => {
  test("returns null for text without If prefix", () => {
    expect(parseInlineCondition("draw 1 card")).toBeNull();
  });

  test("returns null for unparseable condition", () => {
    expect(parseInlineCondition("If some unknown condition, draw 1 card")).toBeNull();
  });
});

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
