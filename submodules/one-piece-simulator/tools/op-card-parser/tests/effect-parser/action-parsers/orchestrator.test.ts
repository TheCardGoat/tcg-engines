import { expect, test, describe } from "vite-plus/test";
import { parseActions, parseEffectText } from "../../../src/effect-parser/index.ts";

describe("parseActions", () => {
  describe("non-draw/rest/ko actions stay unparsed", () => {
    test("returns full text as unparsed for unknown actions", () => {
      const result = parseActions("Look at the top 5 cards of your deck");
      expect(result.parsed).toEqual([]);
      expect(result.unparsed).toBe("Look at the top 5 cards of your deck");
    });

    test("returns empty for empty input", () => {
      const result = parseActions("");
      expect(result.parsed).toEqual([]);
      expect(result.unparsed).toBe("");
    });
  });

  describe("real card integration", () => {
    test("EB01-023 Edward Weevil: '[On Play] Draw 1 card.'", () => {
      const effectText = "[On Play] Draw 1 card.";
      const parsed = parseEffectText(effectText);
      expect(parsed.segments).toHaveLength(1);
      const seg = parsed.segments[0]!;
      const actions = parseActions(seg.rawActionText);
      expect(actions.parsed).toEqual([{ action: "draw", player: "self", amount: 1 }]);
      expect(actions.unparsed).toBe("");
    });

    test("OP13-041 Izo: '[On Play] Draw 2 cards.'", () => {
      const parsed = parseEffectText("[On Play] Draw 2 cards.");
      const actions = parseActions(parsed.segments[0]!.rawActionText);
      expect(actions.parsed).toEqual([{ action: "draw", player: "self", amount: 2 }]);
      expect(actions.unparsed).toBe("");
    });

    test("OP13-093 Morgans: compound draw + trash", () => {
      const effectText =
        "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Draw 2 cards and trash 2 cards from your hand.";
      const parsed = parseEffectText(effectText);
      // Blocker is skipped as keyword-only, [On Play] is the segment
      expect(parsed.segments).toHaveLength(1);
      const actions = parseActions(parsed.segments[0]!.rawActionText);
      expect(actions.parsed).toHaveLength(2);
      expect(actions.parsed[0]).toEqual({ action: "draw", player: "self", amount: 2 });
      expect(actions.parsed[1]).toEqual({ action: "trashFromHand", player: "self", amount: 2 });
      expect(actions.unparsed).toBe("");
    });

    test("OP14EB04-051 Hatchan: '[DON!! x2] [On K.O.] Draw 1 card.'", () => {
      const parsed = parseEffectText("[DON!! x2] [On K.O.] Draw 1 card.");
      expect(parsed.segments).toHaveLength(1);
      const seg = parsed.segments[0]!;
      expect(seg.triggers).toEqual(["onKo"]);
      expect(seg.conditions).toEqual([{ condition: "donAttached", amount: 2 }]);
      const actions = parseActions(seg.rawActionText);
      expect(actions.parsed).toEqual([{ action: "draw", player: "self", amount: 1 }]);
      expect(actions.unparsed).toBe("");
    });

    test("OP13-054 Yamato: draw with preceding condition", () => {
      const parsed = parseEffectText(
        "[On Play] If you have 3 or less Life cards, draw 2 cards. Then, give up to 1 rested DON!! card to your Leader.",
      );
      expect(parsed.segments).toHaveLength(1);
      const actions = parseActions(parsed.segments[0]!.rawActionText);
      // ". Then, " split produces two clauses:
      // 1. "If you have 3 or less Life cards, draw 2 cards" — unparsed (if prefix)
      // 2. "give up to 1 rested DON!! card to your Leader" — parsed as giveDon
      expect(actions.parsed).toHaveLength(1);
      expect(actions.parsed[0]).toMatchObject({ action: "giveDon" });
      expect(actions.unparsed).toContain("draw 2 cards");
    });
  });

  describe("clause splitting", () => {
    test("does not split 'and' inside non-action context", () => {
      const result = parseActions("your Leader and 1 Character gain +1000 power");
      expect(result.parsed).toEqual([]);
      // Should NOT split at "and" since "1 Character" isn't a known action verb
      expect(result.unparsed).toBe("your Leader and 1 Character gain +1000 power");
    });

    test("splits 'and draw' correctly", () => {
      const result = parseActions("rest up to 1 of your opponent's Characters and draw 1 card");
      expect(result.parsed).toHaveLength(2);
      expect(result.parsed[0]).toMatchObject({ action: "rest" });
      expect(result.parsed[1]).toEqual({ action: "draw", player: "self", amount: 1 });
      expect(result.unparsed).toBe("");
    });
  });
});

describe("splitActionClauses — up to fix", () => {
  test("splits 'draw and up to' compound", () => {
    const result = parseActions(
      "Draw 2 cards and up to 1 of your Leader or Character cards gains +4000 power during this battle",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "draw", amount: 2 });
    expect(result.parsed[1]).toMatchObject({ action: "modifyPower", value: 4000 });
  });

  test("splits 'ko and up to' compound", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with a cost of 3 or less and up to 1 of your Characters gains +2000 power during this turn",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "ko" });
    expect(result.parsed[1]).toMatchObject({ action: "modifyPower", value: 2000 });
  });

  test("does not split 'and rest it' (AddDon pattern)", () => {
    const result = parseActions("Add up to 1 DON!! card from your DON!! deck and rest it");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "addDon" });
  });

  test("does not split 'and set it as active' (AddDon pattern)", () => {
    const result = parseActions("Add up to 1 DON!! card from your DON!! deck and set it as active");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "addDon" });
  });
});

describe("parseActions — [Trigger] suffix stripping", () => {
  test("strips '. [Trigger]' suffix from action text", () => {
    const result = parseActions(
      "Give up to 1 of your opponent's Leader or Character cards -2000 power during this turn. [Trigger] Activate this card's [Counter] effect",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "modifyPower",
      value: -2000,
      duration: "thisTurn",
    });
  });

  test("strips '. [Trigger]' after addDon", () => {
    const result = parseActions(
      "Add up to 1 DON!! card from your DON!! deck and rest it. [Trigger] Play this card",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "addDon", state: "rested" });
  });

  test("does not strip [Trigger] mid-sentence (filter context)", () => {
    const result = parseActions(
      "Play up to 1 Character card with a cost of 4 or less and a [Trigger] from your hand",
    );
    expect(result.parsed).toHaveLength(1);
    const filters = (result.parsed[0] as { filters: unknown[] }).filters;
    expect(filters).toContainEqual({ filter: "hasTrigger", value: true });
  });
});

describe("parseActions — sentence splitting", () => {
  test("K.O. then This Character gains keyword", () => {
    const result = parseActions(
      "K.O. up to 1 of your opponent's Characters with a cost of 6 or less. This Character gains [Rush] during this turn.",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "ko" });
    expect(result.parsed[1]).toMatchObject({
      action: "grantKeyword",
      keyword: "rush",
      duration: "thisTurn",
    });
  });
});
