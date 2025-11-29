/**
 * Tests for pattern matching infrastructure
 *
 * @group parser
 * @group patterns
 */

import { classifyAbility } from "../classifier";
import { COST_PATTERNS } from "../patterns/costs";
import { KEYWORD_PATTERNS } from "../patterns/keywords";
import { TRIGGER_PATTERNS } from "../patterns/triggers";

describe("Keyword Patterns", () => {
  describe("Simple Keywords", () => {
    it("should match simple keywords exactly", () => {
      expect(KEYWORD_PATTERNS.simpleKeyword.test("Rush")).toBe(true);
      expect(KEYWORD_PATTERNS.simpleKeyword.test("Ward")).toBe(true);
      expect(KEYWORD_PATTERNS.simpleKeyword.test("Evasive")).toBe(true);
      expect(KEYWORD_PATTERNS.simpleKeyword.test("Bodyguard")).toBe(true);
      expect(KEYWORD_PATTERNS.simpleKeyword.test("Support")).toBe(true);
      expect(KEYWORD_PATTERNS.simpleKeyword.test("Reckless")).toBe(true);
      expect(KEYWORD_PATTERNS.simpleKeyword.test("Vanish")).toBe(true);
      expect(KEYWORD_PATTERNS.simpleKeyword.test("Alert")).toBe(true);
    });

    it("should not match partial keywords", () => {
      expect(KEYWORD_PATTERNS.simpleKeyword.test("Rush ")).toBe(false);
      expect(KEYWORD_PATTERNS.simpleKeyword.test("When you play")).toBe(false);
    });
  });

  describe("Parameterized Keywords", () => {
    it("should match Challenger +N with placeholder", () => {
      const match = "Challenger +{d}".match(KEYWORD_PATTERNS.challenger);
      expect(match).toBeTruthy();
      expect(match?.[1]).toBe("{d}");
    });

    it("should match Challenger +N with resolved number", () => {
      const match = "Challenger +3".match(KEYWORD_PATTERNS.challenger);
      expect(match).toBeTruthy();
      expect(match?.[1]).toBe("3");
    });

    it("should match Resist +N with placeholder", () => {
      const match = "Resist +{d}".match(KEYWORD_PATTERNS.resist);
      expect(match).toBeTruthy();
      expect(match?.[1]).toBe("{d}");
    });

    it("should match Resist +N with resolved number", () => {
      const match = "Resist +2".match(KEYWORD_PATTERNS.resist);
      expect(match).toBeTruthy();
      expect(match?.[1]).toBe("2");
    });
  });

  describe("Value Keywords", () => {
    it("should match Singer N", () => {
      const match = "Singer 5".match(KEYWORD_PATTERNS.singer);
      expect(match).toBeTruthy();
      expect(match?.[1]).toBe("5");
    });

    it("should match Sing Together N", () => {
      const match = "Sing Together 4".match(KEYWORD_PATTERNS.singTogether);
      expect(match).toBeTruthy();
      expect(match?.[1]).toBe("4");
    });

    it("should match Boost N", () => {
      const match = "Boost 3".match(KEYWORD_PATTERNS.boost);
      expect(match).toBeTruthy();
      expect(match?.[1]).toBe("3");
    });
  });

  describe("Shift Keywords", () => {
    it("should match standard Shift N", () => {
      const match = "Shift 5".match(KEYWORD_PATTERNS.shift);
      expect(match).toBeTruthy();
      expect(match?.[1]).toBe("Shift");
      expect(match?.[2]).toBe("5");
    });

    it("should match Puppy Shift N", () => {
      const match = "Puppy Shift 3".match(KEYWORD_PATTERNS.shift);
      expect(match).toBeTruthy();
      expect(match?.[1]).toBe("Puppy Shift");
    });

    it("should match Universal Shift N", () => {
      const match = "Universal Shift 4".match(KEYWORD_PATTERNS.shift);
      expect(match).toBeTruthy();
      expect(match?.[1]).toBe("Universal Shift");
    });

    it("should handle Shift with {d} placeholder", () => {
      const match = "Shift {d}".match(KEYWORD_PATTERNS.shift);
      expect(match).toBeTruthy();
      expect(match?.[2]).toBe("{d}");
    });
  });
});

describe("Trigger Patterns", () => {
  it("should detect 'When' trigger timing", () => {
    expect(TRIGGER_PATTERNS.when.test("When you play this character")).toBe(
      true,
    );
  });

  it("should detect 'Whenever' trigger timing", () => {
    expect(
      TRIGGER_PATTERNS.whenever.test("Whenever this character quests"),
    ).toBe(true);
  });

  it("should detect 'At the start of' trigger timing", () => {
    expect(TRIGGER_PATTERNS.atStart.test("At the start of your turn")).toBe(
      true,
    );
  });

  it("should detect 'At the end of' trigger timing", () => {
    expect(TRIGGER_PATTERNS.atEnd.test("At the end of your turn")).toBe(true);
  });

  it("should detect 'The first time' trigger timing", () => {
    expect(TRIGGER_PATTERNS.firstTime.test("The first time each turn")).toBe(
      true,
    );
  });
});

describe("Cost Patterns", () => {
  it("should match exert cost", () => {
    expect(COST_PATTERNS.exert.test("{E}")).toBe(true);
  });

  it("should match ink cost", () => {
    const match = "2 {I}".match(COST_PATTERNS.ink);
    expect(match).toBeTruthy();
    expect(match?.[1]).toBe("2");
  });

  it("should match combined exert and ink cost", () => {
    expect(COST_PATTERNS.exertAndInk.test("{E}, 2 {I}")).toBe(true);
  });

  it("should match banish self cost", () => {
    expect(COST_PATTERNS.banishSelf.test("Banish this item")).toBe(true);
    expect(COST_PATTERNS.banishSelf.test("Banish this character")).toBe(true);
  });

  it("should detect cost separator patterns", () => {
    expect(COST_PATTERNS.costSeparator.test("{E} - Draw")).toBe(true);
    expect(COST_PATTERNS.costSeparator.test("{E}, 2 {I} - Deal")).toBe(true);
    expect(COST_PATTERNS.costSeparator.test("Banish this item - Gain")).toBe(
      true,
    );
  });
});

describe("classifyAbility", () => {
  it("should classify simple keywords", () => {
    const result = classifyAbility("Rush");
    expect(result.type).toBe("keyword");
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it("should classify parameterized keywords", () => {
    const challenger = classifyAbility("Challenger +3");
    expect(challenger.type).toBe("keyword");

    const resist = classifyAbility("Resist +2");
    expect(resist.type).toBe("keyword");
  });

  it("should classify triggered abilities by trigger word", () => {
    const when = classifyAbility("When you play this character, draw 2 cards.");
    expect(when.type).toBe("triggered");

    const whenever = classifyAbility(
      "Whenever this character quests, gain 1 lore.",
    );
    expect(whenever.type).toBe("triggered");

    const atStart = classifyAbility(
      "At the start of your turn, you may draw a card.",
    );
    expect(atStart.type).toBe("triggered");
  });

  it("should classify activated abilities by cost separator", () => {
    const exert = classifyAbility("{E} - Draw a card.");
    expect(exert.type).toBe("activated");

    const combined = classifyAbility(
      "{E}, 2 {I} - Deal 3 damage to chosen character.",
    );
    expect(combined.type).toBe("activated");

    const banish = classifyAbility("Banish this item - Gain 3 lore.");
    expect(banish.type).toBe("activated");
  });

  it("should classify static abilities as fallback", () => {
    const grant = classifyAbility("Your characters gain Ward.");
    expect(grant.type).toBe("static");

    const modify = classifyAbility("This character gets +2 {S} while damaged.");
    expect(modify.type).toBe("static");
  });

  it("should prioritize keywords over other types", () => {
    const result = classifyAbility("Shift 5");
    expect(result.type).toBe("keyword");
  });
});
