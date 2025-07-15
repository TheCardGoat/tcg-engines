// Unit tests for timing and duration pattern recognition

import {
  areEffectsDependent,
  CONDITIONAL_PATTERNS,
  DURATION_PATTERNS,
  extractEffectsWithTimingAndTargets,
  parseTimingAndDuration,
  shouldResolveEffectsIndividually,
  TIMING_PATTERNS,
} from "../patterns";

describe("DURATION_PATTERNS", () => {
  it("should match 'this turn'", () => {
    expect(DURATION_PATTERNS.thisTurn.test("this turn")).toBe(true);
    expect(DURATION_PATTERNS.thisTurn.test("This Turn")).toBe(true);
    expect(DURATION_PATTERNS.thisTurn.test("gets +2 {S} this turn")).toBe(true);
  });

  it("should match 'until end of turn'", () => {
    expect(DURATION_PATTERNS.untilEndOfTurn.test("until end of turn")).toBe(
      true,
    );
    expect(DURATION_PATTERNS.untilEndOfTurn.test("until the end of turn")).toBe(
      true,
    );
    expect(DURATION_PATTERNS.untilEndOfTurn.test("until end of the turn")).toBe(
      true,
    );
    expect(
      DURATION_PATTERNS.untilEndOfTurn.test("until the end of the turn"),
    ).toBe(true);
  });

  it("should match 'permanently'", () => {
    expect(DURATION_PATTERNS.permanently.test("permanently")).toBe(true);
    expect(DURATION_PATTERNS.permanently.test("Permanently")).toBe(true);
  });

  it("should match 'next turn'", () => {
    expect(DURATION_PATTERNS.nextTurn.test("next turn")).toBe(true);
    expect(DURATION_PATTERNS.nextTurn.test("Next Turn")).toBe(true);
  });
});

describe("TIMING_PATTERNS", () => {
  describe("Triggered timing patterns", () => {
    it("should match 'at the end of turn'", () => {
      expect(TIMING_PATTERNS.endOfTurn.test("at the end of your turn")).toBe(
        true,
      );
      expect(TIMING_PATTERNS.endOfTurn.test("at the end of the turn")).toBe(
        true,
      );
    });

    it("should match 'at the beginning of turn'", () => {
      expect(
        TIMING_PATTERNS.beginningOfTurn.test("at the beginning of your turn"),
      ).toBe(true);
      expect(
        TIMING_PATTERNS.beginningOfTurn.test("at the beginning of the turn"),
      ).toBe(true);
    });

    it("should match specific turn timing", () => {
      expect(
        TIMING_PATTERNS.endOfYourTurn.test("at the end of your turn"),
      ).toBe(true);
      expect(
        TIMING_PATTERNS.beginningOfYourTurn.test(
          "at the beginning of your turn",
        ),
      ).toBe(true);
    });
  });

  describe("Immediate timing patterns", () => {
    it("should match 'immediately'", () => {
      expect(TIMING_PATTERNS.immediately.test("immediately")).toBe(true);
      expect(TIMING_PATTERNS.immediately.test("Immediately")).toBe(true);
    });

    it("should match 'now'", () => {
      expect(TIMING_PATTERNS.now.test("now")).toBe(true);
      expect(TIMING_PATTERNS.now.test("Now")).toBe(true);
    });
  });

  describe("Conditional timing patterns", () => {
    it("should match conditional keywords", () => {
      expect(TIMING_PATTERNS.when.test("when")).toBe(true);
      expect(TIMING_PATTERNS.whenever.test("whenever")).toBe(true);
      expect(TIMING_PATTERNS.if.test("if")).toBe(true);
      expect(TIMING_PATTERNS.then.test("then")).toBe(true);
    });
  });

  describe("Sequence timing patterns", () => {
    it("should match sequence keywords", () => {
      expect(TIMING_PATTERNS.first.test("first")).toBe(true);
      expect(TIMING_PATTERNS.after.test("after")).toBe(true);
      expect(TIMING_PATTERNS.before.test("before")).toBe(true);
    });
  });
});

describe("CONDITIONAL_PATTERNS", () => {
  describe("If-then patterns", () => {
    it("should match 'if...then' pattern", () => {
      const pattern = CONDITIONAL_PATTERNS.ifThen;
      if (!pattern) {
        fail("ifThen pattern is undefined");
        return;
      }
      const match =
        "if you have 5 or more cards in hand, then draw a card".match(pattern);
      expect(match).not.toBeNull();
      if (match) {
        expect(match[1]).toBe("you have 5 or more cards in hand");
        expect(match[2]).toBe("draw a card");
      }
    });

    it("should match 'if...then' without comma", () => {
      const pattern = CONDITIONAL_PATTERNS.ifThen;
      if (!pattern) {
        fail("ifThen pattern is undefined");
        return;
      }
      const match = "if this is damaged then banish it".match(pattern);
      expect(match).not.toBeNull();
      if (match) {
        expect(match[1]).toBe("this is damaged");
        expect(match[2]).toBe("banish it");
      }
    });
  });

  describe("When patterns", () => {
    it("should match 'when' pattern", () => {
      const pattern = CONDITIONAL_PATTERNS.when;
      if (!pattern) {
        fail("when pattern is undefined");
        return;
      }
      const match = "when this enters play, draw a card".match(pattern);
      expect(match).not.toBeNull();
      if (match) {
        expect(match[1]).toBe("this enters play");
        expect(match[2]).toBe("draw a card");
      }
    });

    it("should match 'whenever' pattern", () => {
      const pattern = CONDITIONAL_PATTERNS.whenever;
      if (!pattern) {
        fail("whenever pattern is undefined");
        return;
      }
      const match = "whenever you play a character, gain 1 lore".match(pattern);
      expect(match).not.toBeNull();
      if (match) {
        expect(match[1]).toBe("you play a character");
        expect(match[2]).toBe("gain 1 lore");
      }
    });
  });

  describe("Then patterns", () => {
    it("should match simple 'then' pattern", () => {
      const pattern = CONDITIONAL_PATTERNS.then;
      if (!pattern) {
        fail("then pattern is undefined");
        return;
      }
      const match = "draw a card then banish chosen character".match(pattern);
      expect(match).not.toBeNull();
      if (match) {
        expect(match[1]).toBe("draw a card");
        expect(match[2]).toBe("banish chosen character");
      }
    });
  });

  describe("Choose patterns", () => {
    it("should match 'choose one' pattern", () => {
      const pattern = CONDITIONAL_PATTERNS.chooseOne;
      if (!pattern) {
        fail("chooseOne pattern is undefined");
        return;
      }
      const match = "choose one: draw a card or deal 2 damage".match(pattern);
      expect(match).not.toBeNull();
      if (match) {
        expect(match[1]).toBe("draw a card or deal 2 damage");
      }
    });

    it("should match general 'choose' pattern", () => {
      const pattern = CONDITIONAL_PATTERNS.choose;
      if (!pattern) {
        fail("choose pattern is undefined");
        return;
      }
      const match =
        "choose two: draw a card; deal damage; banish character".match(pattern);
      expect(match).not.toBeNull();
      if (match) {
        expect(match[1]).toBe("draw a card; deal damage; banish character");
      }
    });
  });

  describe("May patterns", () => {
    it("should match 'may' pattern", () => {
      const pattern = CONDITIONAL_PATTERNS.may;
      if (!pattern) {
        fail("may pattern is undefined");
        return;
      }
      const match = "may draw a card".match(pattern);
      expect(match).not.toBeNull();
      if (match) {
        expect(match[1]).toBe("draw a card");
      }
    });
  });
});

describe("parseTimingAndDuration", () => {
  it("should parse duration patterns", () => {
    const testCases = [
      { text: "gets +2 {S} this turn", expectedDuration: "turn" },
      { text: "until end of turn", expectedDuration: "turn" },
      { text: "permanently gains", expectedDuration: "permanent" },
      { text: "next turn draw", expectedDuration: "next-turn" },
    ];

    for (const testCase of testCases) {
      const result = parseTimingAndDuration(testCase.text);
      expect(result.duration).toBe(testCase.expectedDuration);
    }
  });

  it("should parse timing patterns", () => {
    const testCases = [
      {
        text: "at the end of your turn",
        expectedTiming: "end-of-turn",
        expectedTriggered: true,
      },
      {
        text: "at the beginning of your turn",
        expectedTiming: "beginning-of-turn",
        expectedTriggered: true,
      },
      {
        text: "when this enters play",
        expectedTiming: "when",
        expectedTriggered: true,
      },
      {
        text: "whenever you play",
        expectedTiming: "whenever",
        expectedTriggered: true,
      },
      {
        text: "immediately draw",
        expectedTiming: "immediate",
        expectedTriggered: false,
      },
    ];

    for (const testCase of testCases) {
      const result = parseTimingAndDuration(testCase.text);
      expect(result.timing).toBe(testCase.expectedTiming);
      expect(result.isTriggered).toBe(testCase.expectedTriggered);
    }
  });

  it("should parse conditional patterns", () => {
    const testCases = [
      {
        text: "if you have 5 cards, then draw a card",
        expectedConditional: true,
        expectedType: "ifThen",
        expectedCondition: "you have 5 cards",
        expectedConsequence: "draw a card",
      },
      {
        text: "when this enters play, gain 1 lore",
        expectedConditional: true,
        expectedType: "when",
        expectedCondition: "this enters play",
        expectedConsequence: "gain 1 lore",
      },
      {
        text: "draw a card then banish chosen character",
        expectedConditional: true,
        expectedType: "then",
        expectedCondition: "draw a card",
        expectedConsequence: "banish chosen character",
      },
      {
        text: "choose one: draw or damage",
        expectedConditional: true,
        expectedType: "chooseOne",
        expectedCondition: null,
        expectedConsequence: "draw or damage",
      },
    ];

    for (const testCase of testCases) {
      const result = parseTimingAndDuration(testCase.text);
      expect(result.isConditional).toBe(testCase.expectedConditional);
      expect(result.conditionalType).toBe(testCase.expectedType);
      expect(result.condition).toBe(testCase.expectedCondition);
      expect(result.consequence).toBe(testCase.expectedConsequence);
    }
  });

  it("should handle text with no timing patterns", () => {
    const result = parseTimingAndDuration("draw a card");

    expect(result.duration).toBeNull();
    expect(result.timing).toBeNull();
    expect(result.isTriggered).toBe(false);
    expect(result.isConditional).toBe(false);
    expect(result.conditionalType).toBeNull();
    expect(result.condition).toBeNull();
    expect(result.consequence).toBeNull();
    expect(result.originalText).toBe("draw a card");
  });

  it("should handle complex text with multiple patterns", () => {
    const result = parseTimingAndDuration(
      "when this enters play, chosen character gets +2 {S} this turn",
    );

    expect(result.duration).toBe("turn");
    expect(result.timing).toBe("when");
    expect(result.isTriggered).toBe(true);
    expect(result.isConditional).toBe(true);
    expect(result.conditionalType).toBe("when");
    expect(result.condition).toBe("this enters play");
    expect(result.consequence).toBe("chosen character gets +2 {s} this turn");
  });
});

describe("extractEffectsWithTimingAndTargets", () => {
  it("should extract effect with timing information", () => {
    const effects = extractEffectsWithTimingAndTargets(
      "draw a card. chosen character gets +2 {S} this turn",
    );

    expect(effects).toHaveLength(2);

    // First effect (draw) should inherit timing from overall text
    const firstEffect = effects[0];
    if (firstEffect) {
      expect(firstEffect.type).toBe("draw");
      expect(firstEffect.timingInfo?.duration).toBe("turn");
      expect(firstEffect.timingInfo?.timing).toBeNull();
    }

    // Second effect should have duration from overall text
    const secondEffect = effects[1];
    if (secondEffect) {
      expect(secondEffect.type).toBe("attribute"); // This should be an attribute effect
      expect(secondEffect.timingInfo?.duration).toBe("turn");
    }
  });

  it("should extract conditional effects", () => {
    const effects = extractEffectsWithTimingAndTargets(
      "draw a card then banish chosen character",
    );

    expect(effects).toHaveLength(2);

    const firstEffect = effects[0];
    if (firstEffect) {
      expect(firstEffect.type).toBe("draw");
      // Both effects should have conditional timing information
      expect(firstEffect.timingInfo?.isConditional).toBe(true);
      expect(firstEffect.timingInfo?.conditionalType).toBe("then");
    }

    const secondEffect = effects[1];
    if (secondEffect) {
      expect(secondEffect.type).toBe("banish");
      expect(secondEffect.timingInfo?.isConditional).toBe(true);
      expect(secondEffect.timingInfo?.conditionalType).toBe("then");
    }
  });

  it("should handle triggered abilities", () => {
    const effects = extractEffectsWithTimingAndTargets(
      "at the end of your turn, banish chosen character",
    );

    expect(effects).toHaveLength(1);

    const firstEffect = effects[0];
    if (firstEffect) {
      expect(firstEffect.type).toBe("banish");
      expect(firstEffect.timingInfo?.timing).toBe("end-of-turn");
      expect(firstEffect.timingInfo?.isTriggered).toBe(true);
    }
  });

  it("should apply duration to effects", () => {
    const effects = extractEffectsWithTimingAndTargets(
      "deal 2 damage to chosen character. they get -1 {S} this turn",
    );

    expect(effects).toHaveLength(1); // Only damage effect will match current patterns

    const firstEffect = effects[0];
    if (firstEffect) {
      expect(firstEffect.type).toBe("damage");
      expect(firstEffect.amount).toBe(2);
      expect(firstEffect.timingInfo?.duration).toBe("turn");
      expect(firstEffect.duration).toBe("turn"); // Should be applied to effect
    }
  });

  it("should handle empty text", () => {
    const effects = extractEffectsWithTimingAndTargets("");
    expect(effects).toEqual([]);
  });

  it("should handle text with no matching patterns", () => {
    const effects = extractEffectsWithTimingAndTargets("unknown effect text");
    expect(effects).toEqual([]);
  });
});

describe("shouldResolveEffectsIndividually", () => {
  it("should return true for conditional effects", () => {
    const testCases = [
      "if you have 5 cards, then draw a card",
      "draw a card then banish chosen character",
      "choose one: draw or damage",
      "when this enters play, gain lore",
    ];

    for (const testCase of testCases) {
      expect(shouldResolveEffectsIndividually(testCase)).toBe(true);
    }
  });

  it("should return false for simple effects", () => {
    const testCases = [
      "draw a card",
      "deal 2 damage to chosen character",
      "banish chosen character",
      "draw a card. deal damage", // No conditional words
    ];

    for (const testCase of testCases) {
      expect(shouldResolveEffectsIndividually(testCase)).toBe(false);
    }
  });
});

describe("areEffectsDependent", () => {
  it("should return true for dependent effects", () => {
    const testCases = [
      "draw a card then banish chosen character",
      "first draw a card, then deal damage",
      "deal damage after drawing",
    ];

    for (const testCase of testCases) {
      expect(areEffectsDependent(testCase)).toBe(true);
    }
  });

  it("should return false for independent effects", () => {
    const testCases = [
      "draw a card",
      "deal 2 damage to chosen character",
      "draw a card. banish chosen character", // No sequential words
      "when this enters play, gain lore", // Triggered but not sequential
    ];

    for (const testCase of testCases) {
      expect(areEffectsDependent(testCase)).toBe(false);
    }
  });
});

describe("Integration tests", () => {
  it("should handle complex card text", () => {
    const cardText =
      "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.";
    const effects = extractEffectsWithTimingAndTargets(cardText);

    expect(effects.length).toBeGreaterThan(0);

    // Should detect that effects resolve individually due to timing
    expect(shouldResolveEffectsIndividually(cardText)).toBe(false); // No conditional keywords in this text

    // Should detect dependencies
    expect(areEffectsDependent(cardText)).toBe(false); // No sequential keywords
  });

  it("should handle modal effects", () => {
    const cardText =
      "Choose one: Draw 2 cards or deal 3 damage to chosen character";
    const timingInfo = parseTimingAndDuration(cardText);

    expect(timingInfo.isConditional).toBe(true);
    expect(timingInfo.conditionalType).toBe("chooseOne");
    expect(shouldResolveEffectsIndividually(cardText)).toBe(true);
  });

  it("should handle triggered abilities", () => {
    const cardText = "When this character enters play, draw a card";
    const timingInfo = parseTimingAndDuration(cardText);

    expect(timingInfo.isTriggered).toBe(true);
    expect(timingInfo.timing).toBe("when");
    expect(timingInfo.isConditional).toBe(true);
  });
});
