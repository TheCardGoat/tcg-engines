// Unit tests for target recognition patterns

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import {
  convertToEffectTarget,
  extractEffectsWithTargets,
  matchPatternWithTargets,
  OWNER_PATTERNS,
  parseTargetText,
  TARGET_PATTERNS,
  ZONE_PATTERNS,
} from "../patterns";

describe("TARGET_PATTERNS", () => {
  describe("Character targets", () => {
    it("should match 'chosen character'", () => {
      expect(TARGET_PATTERNS.chosenCharacter?.test("chosen character")).toBe(
        true,
      );
      expect(TARGET_PATTERNS.chosenCharacter?.test("Chosen Character")).toBe(
        true,
      );
      expect(
        TARGET_PATTERNS.chosenCharacter?.test(
          "deal damage to chosen character",
        ),
      ).toBe(true);
    });

    it("should match 'chosen character of yours'", () => {
      expect(
        TARGET_PATTERNS.chosenCharacterOfYours?.test(
          "chosen character of yours",
        ),
      ).toBe(true);
      expect(
        TARGET_PATTERNS.chosenCharacterOfYours?.test(
          "banish chosen character of yours",
        ),
      ).toBe(true);
    });

    it("should match 'chosen opposing character'", () => {
      expect(
        TARGET_PATTERNS.chosenOpposingCharacter?.test(
          "chosen opposing character",
        ),
      ).toBe(true);
      expect(
        TARGET_PATTERNS.chosenOpposingCharacter?.test(
          "damage chosen opposing character",
        ),
      ).toBe(true);
    });

    it("should match 'another chosen character'", () => {
      expect(
        TARGET_PATTERNS.anotherChosenCharacter?.test(
          "another chosen character",
        ),
      ).toBe(true);
    });

    it("should match 'another chosen character of yours'", () => {
      expect(
        TARGET_PATTERNS.anotherChosenCharacterOfYours?.test(
          "another chosen character of yours",
        ),
      ).toBe(true);
    });
  });

  describe("Player targets", () => {
    it("should match 'each opponent'", () => {
      expect(TARGET_PATTERNS.opponent?.test("each opponent")).toBe(true);
      expect(TARGET_PATTERNS.opponent?.test("Each Opponent")).toBe(true);
    });

    it("should match 'you'", () => {
      expect(TARGET_PATTERNS.self?.test("you")).toBe(true);
      expect(TARGET_PATTERNS.self?.test("You")).toBe(true);
    });
  });

  describe("Multiple character targets", () => {
    it("should match 'your characters'", () => {
      expect(TARGET_PATTERNS.yourCharacters?.test("your characters")).toBe(
        true,
      );
      expect(TARGET_PATTERNS.yourCharacters?.test("your character")).toBe(true);
    });

    it("should match 'all your characters'", () => {
      expect(
        TARGET_PATTERNS.allYourCharacters?.test("all your characters"),
      ).toBe(true);
      expect(
        TARGET_PATTERNS.allYourCharacters?.test("all of your characters"),
      ).toBe(true);
    });

    it("should match 'each of your characters'", () => {
      expect(
        TARGET_PATTERNS.eachOfYourCharacters?.test("each of your characters"),
      ).toBe(true);
    });

    it("should match 'opposing characters'", () => {
      expect(
        TARGET_PATTERNS.opposingCharacters?.test("opposing characters"),
      ).toBe(true);
    });

    it("should match 'all opposing characters'", () => {
      expect(
        TARGET_PATTERNS.allOpposingCharacters?.test("all opposing characters"),
      ).toBe(true);
    });
  });

  describe("Item and location targets", () => {
    it("should match 'chosen item'", () => {
      expect(TARGET_PATTERNS.chosenItem?.test("chosen item")).toBe(true);
    });

    it("should match 'chosen location'", () => {
      expect(TARGET_PATTERNS.chosenLocation?.test("chosen location")).toBe(
        true,
      );
    });

    it("should match 'chosen item or location'", () => {
      expect(
        TARGET_PATTERNS.chosenItemOrLocation?.test("chosen item or location"),
      ).toBe(true);
      expect(
        TARGET_PATTERNS.chosenItemOrLocation?.test("chosen location or item"),
      ).toBe(true);
    });
  });

  describe("Pronoun targets", () => {
    it("should match pronouns", () => {
      expect(TARGET_PATTERNS.them?.test("them")).toBe(true);
      expect(TARGET_PATTERNS.they?.test("they")).toBe(true);
      expect(TARGET_PATTERNS.it?.test("it")).toBe(true);
      expect(TARGET_PATTERNS.thisCharacter?.test("this character")).toBe(true);
    });
  });
});

describe("ZONE_PATTERNS", () => {
  describe("Player zones", () => {
    it("should match hand patterns", () => {
      expect(ZONE_PATTERNS.hand?.test("from your hand")).toBe(true);
      expect(ZONE_PATTERNS.hand?.test("from hand")).toBe(true);
    });

    it("should match discard patterns", () => {
      expect(ZONE_PATTERNS.discard?.test("from your discard")).toBe(true);
      expect(ZONE_PATTERNS.discard?.test("from your discard pile")).toBe(true);
      expect(ZONE_PATTERNS.discard?.test("from discard")).toBe(true);
    });

    it("should match deck patterns", () => {
      expect(ZONE_PATTERNS.deck?.test("from your deck")).toBe(true);
      expect(ZONE_PATTERNS.deck?.test("from deck")).toBe(true);
    });

    it("should match play patterns", () => {
      expect(ZONE_PATTERNS.play?.test("in play")).toBe(true);
    });

    it("should match inkwell patterns", () => {
      expect(ZONE_PATTERNS.inkwell?.test("from your inkwell")).toBe(true);
      expect(ZONE_PATTERNS.inkwell?.test("from inkwell")).toBe(true);
    });
  });

  describe("Opponent zones", () => {
    it("should match opponent hand patterns", () => {
      expect(ZONE_PATTERNS.opponentHand?.test("from their hand")).toBe(true);
      expect(ZONE_PATTERNS.opponentHand?.test("from opponent's hand")).toBe(
        true,
      );
    });

    it("should match opponent discard patterns", () => {
      expect(ZONE_PATTERNS.opponentDiscard?.test("from their discard")).toBe(
        true,
      );
      expect(
        ZONE_PATTERNS.opponentDiscard?.test("from opponent's discard pile"),
      ).toBe(true);
    });

    it("should match opponent deck patterns", () => {
      expect(ZONE_PATTERNS.opponentDeck?.test("from their deck")).toBe(true);
      expect(ZONE_PATTERNS.opponentDeck?.test("from opponent's deck")).toBe(
        true,
      );
    });
  });
});

describe("OWNER_PATTERNS", () => {
  it("should match self ownership", () => {
    expect(OWNER_PATTERNS.self?.test("your character")).toBe(true);
    expect(OWNER_PATTERNS.self?.test("Your Character")).toBe(true);
  });

  it("should match opponent ownership", () => {
    expect(OWNER_PATTERNS.opponent?.test("their character")).toBe(true);
    expect(OWNER_PATTERNS.opponent?.test("opponent's character")).toBe(true);
    expect(OWNER_PATTERNS.opponent?.test("opposing character")).toBe(true);
  });
});

describe("parseTargetText", () => {
  it("should parse simple character target", () => {
    const result = parseTargetText("chosen character");

    expect(result.targetType).toBe("chosenCharacter");
    expect(result.zone).toBeNull();
    expect(result.owner).toBeNull();
    expect(result.isMultiple).toBe(false);
    expect(result.originalText).toBe("chosen character");
  });

  it("should parse character target with ownership", () => {
    const result = parseTargetText("chosen character of yours");

    expect(result.targetType).toBe("chosenCharacterOfYours");
    expect(result.zone).toBeNull();
    expect(result.owner).toBe("self");
    expect(result.isMultiple).toBe(false);
  });

  it("should parse target with zone", () => {
    const result = parseTargetText("chosen character from your hand");

    expect(result.targetType).toBe("chosenCharacter");
    expect(result.zone).toBe("hand");
    expect(result.owner).toBe("self");
    expect(result.isMultiple).toBe(false);
  });

  it("should detect multiple targets", () => {
    const testCases = [
      "all your characters",
      "each of your characters",
      "every character",
      "any number of characters",
      "your characters", // plural without specific quantifier
    ];

    for (const testCase of testCases) {
      const result = parseTargetText(testCase);
      expect(result.isMultiple).toBe(true);
    }
  });

  it("should not detect single targets as multiple", () => {
    const testCases = [
      "chosen character",
      "a character",
      "chosen character of yours",
    ];

    for (const testCase of testCases) {
      const result = parseTargetText(testCase);
      expect(result.isMultiple).toBe(false);
    }
  });

  it("should handle complex target text", () => {
    const result = parseTargetText("all opposing characters in play");

    expect(result.targetType).toBe("allOpposingCharacters");
    expect(result.zone).toBe("play");
    expect(result.owner).toBe("opponent");
    expect(result.isMultiple).toBe(true);
  });

  it("should handle pronoun targets", () => {
    const result = parseTargetText("them");

    expect(result.targetType).toBe("them");
    expect(result.zone).toBeNull();
    expect(result.owner).toBeNull();
    expect(result.isMultiple).toBe(false);
  });

  it("should return null for unrecognized targets", () => {
    const result = parseTargetText("unknown target");

    expect(result.targetType).toBeNull();
    expect(result.zone).toBeNull();
    expect(result.owner).toBeNull();
    expect(result.isMultiple).toBe(false);
    expect(result.originalText).toBe("unknown target");
  });
});

describe("convertToEffectTarget", () => {
  it("should convert character target", () => {
    const parsedTarget = parseTargetText("chosen character");
    const effectTarget = convertToEffectTarget(parsedTarget);

    expect(effectTarget).not.toBeNull();
    expect(effectTarget?.type).toBe("card");
    // Use type assertion for custom properties
    expect((effectTarget as any)?.identifier).toBe("chosenCharacter");
  });

  it("should convert player target", () => {
    const parsedTarget = parseTargetText("each opponent");
    const effectTarget = convertToEffectTarget(parsedTarget);

    expect(effectTarget).not.toBeNull();
    expect(effectTarget?.type).toBe("player");
    // Use type assertion for custom properties
    expect((effectTarget as any)?.identifier).toBe("opponent");
  });

  it("should include zone and owner information", () => {
    const parsedTarget = parseTargetText("your characters from hand");
    const effectTarget = convertToEffectTarget(parsedTarget);

    expect(effectTarget).not.toBeNull();
    // Use type assertion for custom properties
    expect((effectTarget as any)?.zone).toBe("hand");
    expect((effectTarget as any)?.owner).toBe("self");
    expect((effectTarget as any)?.isMultiple).toBe(true);
  });

  it("should return null for unrecognized targets", () => {
    const parsedTarget = parseTargetText("unknown target");
    const effectTarget = convertToEffectTarget(parsedTarget);

    expect(effectTarget).toBeNull();
  });
});

describe("matchPatternWithTargets", () => {
  it("should match pattern and extract target", () => {
    const result = matchPatternWithTargets("deal 3 damage to chosen character");

    expect(result.match).not.toBeNull();
    expect(result.pattern).not.toBeNull();
    expect(result.effectType).toBe("damage");
    expect(result.parsedTarget).not.toBeNull();
    expect(result.parsedTarget?.targetType).toBe("chosenCharacter");
    expect(result.effectTarget).not.toBeNull();
  });

  it("should handle patterns without targets", () => {
    const result = matchPatternWithTargets("draw a card");

    expect(result.match).not.toBeNull();
    expect(result.pattern).not.toBeNull();
    expect(result.effectType).toBe("draw");
    expect(result.parsedTarget).toBeNull();
    expect(result.effectTarget).toBeNull();
  });

  it("should return null for no match", () => {
    const result = matchPatternWithTargets("unknown effect");

    expect(result.match).toBeNull();
    expect(result.pattern).toBeNull();
    expect(result.effectType).toBeNull();
    expect(result.parsedTarget).toBeNull();
    expect(result.effectTarget).toBeNull();
  });

  it("should handle complex targets", () => {
    const result = matchPatternWithTargets("banish chosen character of yours");

    expect(result.parsedTarget?.targetType).toBe("chosenCharacterOfYours");
    expect(result.parsedTarget?.owner).toBe("self");
    // Use type assertion to handle the identifier property
    if (result.effectTarget) {
      expect((result.effectTarget as any).identifier).toBe(
        "chosenCharacterOfYours",
      );
    }
  });
});

describe("extractEffectsWithTargets", () => {
  it("should extract single effect with target", () => {
    const effects = extractEffectsWithTargets(
      "deal 2 damage to chosen character",
    );

    expect(effects).toHaveLength(1);
    if (effects[0]) {
      expect(effects[0].type).toBe("damage");
      expect(effects[0].amount).toBe(2);
      if (effects[0].parsedTarget) {
        expect(effects[0].parsedTarget.targetType).toBe("chosenCharacter");
      }
      if (effects[0].resolvedTarget) {
        expect((effects[0].resolvedTarget as any).identifier).toBe(
          "chosenCharacter",
        );
      }
      if (effects[0].target) {
        expect((effects[0].target as any).identifier).toBe("chosenCharacter");
      }
    }
  });

  it("should extract multiple effects with different targets", () => {
    const effects = extractEffectsWithTargets(
      "draw a card. banish chosen character of yours",
    );

    expect(effects).toHaveLength(2);

    // First effect (draw) has no target
    if (effects[0]) {
      expect(effects[0].type).toBe("draw");
      expect(effects[0].parsedTarget).toBeUndefined();
      expect(effects[0].resolvedTarget).toBeUndefined();
    }

    // Second effect (banish) has target
    if (effects[1]) {
      expect(effects[1].type).toBe("banish");
      expect(effects[1].parsedTarget?.targetType).toBe(
        "chosenCharacterOfYours",
      );
      expect((effects[1].resolvedTarget as any)?.identifier).toBe(
        "chosenCharacterOfYours",
      );
    }
  });

  it("should handle complex target text", () => {
    const effects = extractEffectsWithTargets(
      "deal 5 damage to all opposing characters in play",
    );

    expect(effects).toHaveLength(1);
    if (effects[0]) {
      expect(effects[0].type).toBe("damage");
      expect(effects[0].amount).toBe(5);
      expect(effects[0].parsedTarget?.targetType).toBe("allOpposingCharacters");
      expect(effects[0].parsedTarget?.zone).toBe("play");
      expect(effects[0].parsedTarget?.owner).toBe("opponent");
      expect(effects[0].parsedTarget?.isMultiple).toBe(true);
    }
  });

  it("should handle zone-based targeting", () => {
    const effects = extractEffectsWithTargets(
      "banish chosen character from your hand",
    );

    expect(effects).toHaveLength(1);
    if (effects[0]) {
      expect(effects[0].parsedTarget?.targetType).toBe("chosenCharacter");
      expect(effects[0].parsedTarget?.zone).toBe("hand");
      expect(effects[0].parsedTarget?.owner).toBe("self");
    }
  });

  it("should return empty array for no matches", () => {
    const effects = extractEffectsWithTargets("unknown effect text");
    expect(effects).toEqual([]);
  });

  it("should handle extraction errors gracefully", () => {
    // Mock console.warn to avoid test output
    const consoleSpy = spyOn(console, "warn").mockImplementation(() => {});

    // This should not throw an error even if extraction fails
    const effects = extractEffectsWithTargets("deal damage to");
    expect(Array.isArray(effects)).toBe(true);

    consoleSpy.mockRestore();
  });
});
