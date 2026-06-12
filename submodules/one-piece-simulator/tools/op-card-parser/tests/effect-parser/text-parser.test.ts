import { expect, test, describe } from "vite-plus/test";
import { parseEffectText } from "../../src/effect-parser/index.ts";

describe("parseEffectText", () => {
  test("returns empty result for empty string", () => {
    const result = parseEffectText("");
    expect(result.plainStatements).toEqual([]);
    expect(result.segments).toEqual([]);
  });

  test("returns empty result for whitespace-only string", () => {
    const result = parseEffectText("   ");
    expect(result.plainStatements).toEqual([]);
    expect(result.segments).toEqual([]);
  });
});

describe("simple triggers", () => {
  test("[On Play] extracts trigger and action text", () => {
    const result = parseEffectText("[On Play] Draw 2 cards.");
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["onPlay"]);
    expect(result.segments[0]!.rawActionText).toBe("Draw 2 cards.");
  });

  test("[When Attacking] extracts trigger", () => {
    const result = parseEffectText(
      "[When Attacking] This Character gains +1000 power during this turn.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["whenAttacking"]);
  });

  test("[Counter] extracts trigger", () => {
    const result = parseEffectText(
      "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["counter"]);
  });

  test("[On K.O.] extracts trigger", () => {
    const result = parseEffectText("[On K.O.] Draw 1 card.");
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["onKo"]);
  });

  test("[End of Your Turn] extracts trigger", () => {
    const result = parseEffectText(
      "[End of Your Turn] Add 1 card from the top of your Life cards to your hand.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["endOfYourTurn"]);
  });

  test("[On Your Opponent's Attack] extracts trigger", () => {
    const result = parseEffectText("[On Your Opponent's Attack] Set this Character as active.");
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["onOpponentAttack"]);
  });

  test("[Activate:Main] extracts trigger (no space)", () => {
    const result = parseEffectText("[Activate:Main] Draw 1 card.");
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["activateMain"]);
  });

  test("[Activate: Main] extracts trigger (with space)", () => {
    const result = parseEffectText("[Activate: Main] Draw 1 card.");
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["activateMain"]);
  });

  test("[Main] extracts trigger", () => {
    const result = parseEffectText(
      "[Main] K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["main"]);
  });
});

describe("prefix chains with conditions", () => {
  test("[DON!! x1] [Your Turn] — conditions only, no trigger", () => {
    const result = parseEffectText(
      "[DON!! x1] [Your Turn] All of your Characters gain +1000 power.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.triggers).toEqual([]);
    expect(seg.conditions).toEqual([
      { condition: "donAttached", amount: 1 },
      { condition: "turn", value: "your" },
    ]);
    expect(seg.rawActionText).toBe("All of your Characters gain +1000 power.");
  });

  test("[DON!! x2] [When Attacking] — condition + trigger", () => {
    const result = parseEffectText(
      "[DON!! x2] [When Attacking] K.O. up to 1 of your opponent's Characters.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.triggers).toEqual(["whenAttacking"]);
    expect(seg.conditions).toEqual([{ condition: "donAttached", amount: 2 }]);
  });

  test("[Activate:Main] [Once Per Turn] — trigger + once per turn flag", () => {
    const result = parseEffectText("[Activate:Main] [Once Per Turn] Draw 1 card.");
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.triggers).toEqual(["activateMain"]);
    expect(seg.oncePerTurn).toBe(true);
  });

  test("[Opponent's Turn] condition", () => {
    const result = parseEffectText("[Opponent's Turn] This Character gains +1000 power.");
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.conditions).toEqual([{ condition: "turn", value: "opponent" }]);
  });

  test("[DON!!×1] with unicode multiplication sign", () => {
    const result = parseEffectText("[DON!!×1] [Your Turn] +1000 power.");
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.conditions[0]).toEqual({
      condition: "donAttached",
      amount: 1,
    });
  });

  test("[DON!!x1] without space", () => {
    const result = parseEffectText("[DON!!x1] [When Attacking] Draw 1 card.");
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.conditions).toEqual([{ condition: "donAttached", amount: 1 }]);
  });
});

describe("dual triggers", () => {
  test("[Main] / [Counter] produces two triggers", () => {
    const result = parseEffectText(
      "[Main] / [Counter] You may add 1 card from the top of your Life cards to your hand.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["main", "counter"]);
  });

  test("[On Play] / [On K.O.] produces two triggers", () => {
    const result = parseEffectText(
      "[On Play] / [On K.O.] K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["onPlay", "onKo"]);
  });

  test("[When Attacking] / [On Block] produces two triggers", () => {
    const result = parseEffectText(
      "[When Attacking] / [On Block] Draw 1 card if you have 5 or less cards in your hand.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["whenAttacking", "onBlock"]);
  });

  test("[When Attacking] / [On Block] with [Once Per Turn]", () => {
    const result = parseEffectText(
      "[When Attacking] / [On Block] [Once Per Turn] This Character's base power becomes the same as your opponent's Leader.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.triggers).toEqual(["whenAttacking", "onBlock"]);
    expect(seg.oncePerTurn).toBe(true);
  });
});

describe("cost parsing", () => {
  test("DON!! rest cost (N) before colon", () => {
    const result = parseEffectText(
      "[Activate:Main] [Once Per Turn] (4): Set up to 1 of your Characters as active.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.costs).toEqual([{ type: "restDon", amount: 4 }]);
    expect(seg.rawActionText).toBe("Set up to 1 of your Characters as active.");
  });

  test("DON!! return cost DON!! -5 before colon", () => {
    const result = parseEffectText(
      "[On Play] DON!! -5: K.O. up to 1 of your opponent's Characters with a cost of 6 or less.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.costs).toEqual([{ type: "returnDon", amount: 5 }]);
  });

  test("DON!! return cost DON!! -1 before colon", () => {
    const result = parseEffectText(
      "[On Play] DON!! -1: Add up to 1 Stage card from your trash to your hand.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.costs).toEqual([{ type: "returnDon", amount: 1 }]);
  });

  test("DON!! return cost without minus sign (DON!! 2)", () => {
    const result = parseEffectText("[Activate: Main] [Once Per Turn] DON!! 2: Draw 1 card.");
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.costs).toEqual([{ type: "returnDon", amount: 2 }]);
  });

  test("You may trash from hand cost", () => {
    const result = parseEffectText(
      "[Activate:Main] [Once Per Turn] You may trash 1 card from your hand: Up to 3 of your Characters gain +3000 power.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.costs[0]!.type).toBe("trashFromHand");
    expect(seg.optional).toBe(true);
  });

  test("You may trash this Character cost", () => {
    const result = parseEffectText(
      "[End of Your Turn] You may trash this Character: Set up to 2 of your DON!! cards as active.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.costs[0]!.type).toBe("trashThisCard");
    expect(seg.optional).toBe(true);
    expect(seg.rawActionText).toBe("Set up to 2 of your DON!! cards as active.");
  });
});

describe("multi-segment cards", () => {
  test("newline-separated effects produce multiple segments", () => {
    const result = parseEffectText(
      "[On Play] Draw 1 card.\n[DON!! x1] [When Attacking] This Character gains +2000 power during this turn.",
    );
    expect(result.segments).toHaveLength(2);
    expect(result.segments[0]!.triggers).toEqual(["onPlay"]);
    expect(result.segments[1]!.triggers).toEqual(["whenAttacking"]);
    expect(result.segments[1]!.conditions).toEqual([{ condition: "donAttached", amount: 1 }]);
  });

  test("keyword + effect produces segment only for non-keyword effect", () => {
    const result = parseEffectText(
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Draw 1 card.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["onPlay"]);
    expect(result.segments[0]!.rawActionText).toBe("Draw 1 card.");
  });

  test("[Double Attack] + [Activate:Main] multi-line", () => {
    const result = parseEffectText(
      "[Double Attack] (This card deals 2 damage.)\n[Activate:Main] [Once Per Turn] If your opponent has 3 or less Life cards, give up to 2 rested DON!! cards to 1 of your Characters.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["activateMain"]);
    expect(result.segments[0]!.oncePerTurn).toBe(true);
  });
});

describe("API concatenation without newlines", () => {
  test("splits [Blocker](...)[On K.O.] without newline", () => {
    const result = parseEffectText(
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On K.O.] Draw 1 card.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["onKo"]);
  });

  test("splits [Blocker](...)[On Play]Choose one: without spaces", () => {
    const result = parseEffectText(
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play]Choose one:• Look at all Life cards.• Turn all Life cards face-down.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["onPlay"]);
    expect(result.segments[0]!.choiceItems).toHaveLength(2);
  });

  test("splits [Opponent's Turn]...[Blocker](...)", () => {
    const result = parseEffectText(
      "[Opponent's Turn] This Character gains +1000 power and cannot be K.O.'d by effects.[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.conditions).toEqual([{ condition: "turn", value: "opponent" }]);
  });
});

describe("choose one patterns", () => {
  test("newline-separated bullet items", () => {
    const result = parseEffectText(
      "[On Play] Choose one:\n• Trash up to 1 of your opponent's Characters with a cost of 4 or less.\n• Your opponent places 3 cards from their trash at bottom of their deck in any order.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.choiceItems).toHaveLength(2);
    expect(seg.choiceItems![0]).toContain("Trash up to 1");
    expect(seg.choiceItems![1]).toContain("Your opponent places 3");
  });

  test("space-separated bullet items", () => {
    const result = parseEffectText(
      "[On K.O.] Choose one: • Rest up to 1 of your opponent's DON!! cards. • K.O. up to 1 of your opponent's rested Characters with a cost of 6 or less.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.choiceItems).toHaveLength(2);
  });

  test("choose one with DON!! return cost", () => {
    const result = parseEffectText(
      "[On Play] DON!! -3: Choose one:\n•If your Leader has the {Donquixote Pirates} type, K.O. up to 1.\n•Up to 3 of your opponent's Characters cannot be rested.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.costs).toEqual([{ type: "returnDon", amount: 3 }]);
    expect(seg.choiceItems).toHaveLength(2);
  });
});

describe("plain text before brackets", () => {
  test("plain statement followed by [Activate:Main]", () => {
    const result = parseEffectText(
      "This Leader cannot attack. [Activate:Main] [Once Per Turn] (2): Draw 1 card.",
    );
    expect(result.plainStatements).toEqual(["This Leader cannot attack."]);
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["activateMain"]);
  });

  test("plain text with card name brackets is not a trigger", () => {
    const result = parseEffectText(
      "Also treat this card's name as [Kouzuki Oden] according to the rules.",
    );
    expect(result.plainStatements).toHaveLength(1);
    expect(result.segments).toHaveLength(0);
  });

  test("plain text with cost modifier", () => {
    const result = parseEffectText(
      "This Character gains +4 cost. [Activate: Main] You may rest this Character: Play up to 1 card.",
    );
    expect(result.plainStatements).toEqual(["This Character gains +4 cost."]);
    expect(result.segments).toHaveLength(1);
  });
});

describe("errata handling", () => {
  test("strips errata note from end", () => {
    const result = parseEffectText(
      "[Activate:Main] [Once Per Turn] (4): Set up to 1 of your Characters as active. This card has been officially errata'd.",
    );
    expect(result.errata).toBeDefined();
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.rawActionText).not.toContain("errata");
  });
});

describe("keyword flavor stripping", () => {
  test("strips [Rush] parenthetical explanation", () => {
    const result = parseEffectText(
      "[Rush] (This card can attack on the turn in which it is played.) [When Attacking] Draw 1 card.",
    );
    // [Rush] is a keyword — skipped. [When Attacking] is the real segment.
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["whenAttacking"]);
    expect(result.segments[0]!.rawActionText).toBe("Draw 1 card.");
  });

  test("strips DON!! cost reminder parenthetical", () => {
    const result = parseEffectText(
      "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Draw 1 card.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.costs).toEqual([{ type: "returnDon", amount: 1 }]);
    expect(result.segments[0]!.rawActionText).toBe("Draw 1 card.");
  });

  test("strips DON!! rest cost reminder parenthetical", () => {
    const result = parseEffectText(
      "[Activate:Main] [Once Per Turn] (4) (You may rest the specified number of DON!! cards in your cost area.): Set up to 1 of your Characters as active.",
    );
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.costs).toEqual([{ type: "restDon", amount: 4 }]);
    expect(result.segments[0]!.rawActionText).toBe("Set up to 1 of your Characters as active.");
  });
});

describe("[Trigger] handling", () => {
  test("strips [Trigger] section from text", () => {
    const result = parseEffectText("[On Play] Draw 2 cards.\n[Trigger] Draw 1 card.");
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]!.triggers).toEqual(["onPlay"]);
    expect(result.segments[0]!.rawActionText).toBe("Draw 2 cards.");
  });
});

describe("text with only keywords", () => {
  test("produces no segments for keyword-only text", () => {
    const result = parseEffectText(
      "[Rush] (This card can attack on the turn in which it is played.)",
    );
    expect(result.segments).toHaveLength(0);
  });

  test("produces no segments for [Blocker] only", () => {
    const result = parseEffectText(
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
    );
    expect(result.segments).toHaveLength(0);
  });
});
describe("cost parsing — restCards", () => {
  test("You may rest 1 of your cards", () => {
    const result = parseEffectText("[On K.O.] You may rest 1 of your cards: Draw 1 card.");
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.costs).toEqual([{ type: "restCards", raw: "You may rest 1 of your cards" }]);
    expect(seg.optional).toBe(true);
    expect(seg.rawActionText).toBe("Draw 1 card.");
  });

  test("You may rest 2 of your Characters", () => {
    const result = parseEffectText("[Main] You may rest 2 of your Characters: Draw 2 cards.");
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.costs[0]!.type).toBe("restCards");
    expect(seg.optional).toBe(true);
  });

  test('You may rest 1 of your "Dressrosa" type Leader or Stage cards', () => {
    const result = parseEffectText(
      '[On Play] You may rest 1 of your "Dressrosa" type Leader or Stage cards: K.O. up to 1 of your opponent\'s Characters with a cost of 4 or less.',
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.costs[0]!.type).toBe("restCards");
    expect(seg.optional).toBe(true);
  });
});

describe("turnLifeFaceUp cost", () => {
  test("You may turn 1 card from the top of your Life cards face-up cost", () => {
    const result = parseEffectText(
      "[Activate:Main] [Once Per Turn] You may turn 1 card from the top of your Life cards face-up: K.O. up to 1 of your opponent's Characters with a cost of 0.",
    );
    expect(result.segments).toHaveLength(1);
    const seg = result.segments[0]!;
    expect(seg.costs[0]).toEqual({ type: "turnLifeFaceUp", count: 1 });
    expect(seg.optional).toBe(true);
  });
});
