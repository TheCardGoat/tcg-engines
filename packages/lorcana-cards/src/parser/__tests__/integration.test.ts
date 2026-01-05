/**
 * Integration Tests for Lorcana Ability Text Parser
 *
 * Strategic tests for complex ability combinations, edge cases,
 * and real-world parsing scenarios.
 *
 * These tests focus on abilities that the parser currently handles well,
 * documenting its strengths and providing regression protection.
 *
 * @group parser
 * @group integration
 */

import { describe, expect, it } from "bun:test";
import { parseAbilityText, parseAbilityTexts } from "../parser";

describe("Integration: Complex Ability Combinations", () => {
  it("should parse triggered ability with simple draw effect", () => {
    const result = parseAbilityText(
      "When you play this character, draw 2 cards.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("triggered");

    if (result.ability?.ability.type === "triggered") {
      expect(result.ability.ability.trigger.timing).toBe("when");
      expect(result.ability.ability.effect.type).toBe("draw");
    }
  });

  it("should parse simple activated ability with exert cost", () => {
    const result = parseAbilityText("{E} - Draw a card.");

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("activated");

    if (result.ability?.ability.type === "activated") {
      expect(result.ability.ability.cost.exert).toBe(true);
      expect(result.ability.ability.effect.type).toBe("draw");
    }
  });

  it("should parse static ability granting keyword to group", () => {
    const result = parseAbilityText("Your characters gain Ward.");

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("static");

    if (result.ability?.ability.type === "static") {
      expect(result.ability.ability.effect.type).toBe("gain-keyword");
    }
  });

  it("should parse conditional static with while clause", () => {
    const result = parseAbilityText(
      "While this character has no damage, he gets +2 {S}.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("static");
  });

  it("should parse named static ability granting keyword to specific type", () => {
    const result = parseAbilityText(
      "PROUD TO SERVE Your Queen characters gain Ward.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("PROUD TO SERVE");
    expect(result.ability?.ability.type).toBe("static");

    if (result.ability?.ability.type === "static") {
      expect(result.ability.ability.effect.type).toBe("gain-keyword");
      expect(result.ability.ability.name).toBe("PROUD TO SERVE");
    }
  });

  it("should parse activated ability with combined costs", () => {
    const result = parseAbilityText(
      "{E}, 2 {I} - Deal 3 damage to chosen character.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("activated");

    if (result.ability?.ability.type === "activated") {
      expect(result.ability.ability.cost.exert).toBe(true);
      expect(result.ability.ability.cost.ink).toBe(2);
    }
  });
});

describe("Integration: Edge Cases and Unusual Formats", () => {
  it("should handle standard hyphen dash separator", () => {
    const hyphen = parseAbilityText("{E} - Draw a card.");
    expect(hyphen.success).toBe(true);
    expect(hyphen.ability?.ability.type).toBe("activated");
  });

  it("should handle abilities with placeholders in various positions", () => {
    const result = parseAbilityText("Challenger +{d}");
    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("keyword");

    if (result.ability?.ability.type === "keyword") {
      expect(result.ability.ability.keyword).toBe("Challenger");
    }
  });

  it("should parse named restrictions as static abilities", () => {
    const result = parseAbilityText(
      "HIDDEN AWAY This character can't be challenged.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("HIDDEN AWAY");
    expect(result.ability?.ability.type).toBe("static");
  });

  it("should handle location-based static effects", () => {
    const result = parseAbilityText(
      "NIGHT OUT Characters can't be challenged while here.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("NIGHT OUT");
    expect(result.ability?.ability.type).toBe("static");
  });

  it("should handle various keyword grant patterns", () => {
    const grants = [
      "Your characters gain Ward.",
      "GOOD ADVICE Your other characters gain Support.",
      "Chosen character gains Rush this turn.",
    ];

    grants.forEach((text) => {
      const result = parseAbilityText(text);
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("static");

      if (result.ability?.ability.type === "static") {
        expect(result.ability.ability.effect.type).toBe("gain-keyword");
      }
    });
  });
});

describe("Integration: Batch Processing with Real Data", () => {
  it("should process a diverse sample of real ability texts efficiently", () => {
    const realAbilities = [
      "Rush",
      "Challenger +{d}",
      "Shift {d}",
      "When you play this character, draw a card.",
      "{E} - Draw a card.",
      "Your characters gain Ward.",
      "Chosen character gains Rush this turn.",
      "While this character has no damage, he gets +2 {S}.",
      "{E}, 2 {I} - Deal 3 damage to chosen character.",
      "Banish this item - Gain 3 lore.",
    ];

    const startTime = performance.now();
    const results = parseAbilityTexts(realAbilities);
    const elapsed = performance.now() - startTime;

    // Performance check: should parse 10 abilities in under 500ms (higher threshold for CI parallel execution)
    expect(elapsed).toBeLessThan(500);

    // Quality check: keywords, triggered, activated, and basic static should parse
    expect(results.successful).toBeGreaterThanOrEqual(6);
    expect(results.total).toBe(10);
    expect(results.results).toHaveLength(10);
  });

  it("should gracefully handle unparseable text in batch mode", () => {
    const mixedAbilities = [
      "Rush",
      "This is not a valid ability at all",
      "Ward",
      "Some random text that should fail",
      "Challenger +3",
    ];

    const results = parseAbilityTexts(mixedAbilities);

    expect(results.total).toBe(5);
    expect(results.successful).toBeGreaterThanOrEqual(3);
    expect(results.failed).toBeGreaterThanOrEqual(2);

    // Verify that successful parses are actually valid
    const successfulResults = results.results.filter((r) => r.success);
    successfulResults.forEach((result) => {
      expect(result.ability).toBeDefined();
      expect(result.ability?.ability.type).toBeDefined();
    });
  });

  it("should handle large batches without performance degradation", () => {
    // Test with 100 simple keywords
    const largeKeywordBatch = Array(100)
      .fill(null)
      .map((_, i) => (i % 3 === 0 ? "Rush" : i % 3 === 1 ? "Ward" : "Evasive"));

    const startTime = performance.now();
    const results = parseAbilityTexts(largeKeywordBatch);
    const elapsed = performance.now() - startTime;

    // Should parse 100 keywords quickly (under 1000ms, higher threshold for CI parallel execution)
    expect(elapsed).toBeLessThan(1000);
    expect(results.successful).toBe(100);
    expect(results.failed).toBe(0);
  });
});

describe("Integration: Regression Tests for Known Problematic Patterns", () => {
  it("should handle Shift variants correctly", () => {
    const shiftVariants = [
      "Shift {d}",
      "Puppy Shift {d}",
      "Universal Shift {d}",
    ];

    shiftVariants.forEach((text) => {
      const result = parseAbilityText(text);
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("keyword");

      if (result.ability?.ability.type === "keyword") {
        expect(result.ability.ability.keyword).toBe("Shift");
      }
    });
  });

  it("should distinguish between triggered and activated abilities with similar syntax", () => {
    const triggered = parseAbilityText(
      "When you play this character, draw a card.",
    );
    const activated = parseAbilityText("{E} - Draw a card.");

    expect(triggered.success).toBe(true);
    expect(triggered.ability?.ability.type).toBe("triggered");

    expect(activated.success).toBe(true);
    expect(activated.ability?.ability.type).toBe("activated");
  });

  it("should handle placeholder resolution consistently", () => {
    const withPlaceholder = parseAbilityText("Challenger +{d}");
    const withNumber = parseAbilityText("Challenger +3");

    expect(withPlaceholder.success).toBe(true);
    expect(withNumber.success).toBe(true);

    // Both should parse to the same structure
    expect(withPlaceholder.ability?.ability.type).toBe("keyword");
    expect(withNumber.ability?.ability.type).toBe("keyword");
  });

  it("should preserve named ability information for static abilities", () => {
    const namedAbilities = [
      "PROUD TO SERVE Your Queen characters gain Ward.",
      "HIDDEN AWAY This character can't be challenged.",
      "GOOD ADVICE Your other characters gain Support.",
    ];

    namedAbilities.forEach((text) => {
      const result = parseAbilityText(text);
      expect(result.success).toBe(true);
      expect(result.ability?.name).toBeDefined();
      expect(result.ability?.name).toMatch(/^[A-Z\s!]+$/); // All caps pattern

      // Name should be in the ability object too
      if (result.ability && result.ability.ability.type !== "keyword") {
        const ability = result.ability.ability as { name?: string };
        const expectedName = result.ability.name ?? "";
        expect(ability.name ?? "").toBe(expectedName);
      }
    });
  });

  it("should handle all simple keywords correctly", () => {
    const simpleKeywords = [
      "Rush",
      "Ward",
      "Evasive",
      "Bodyguard",
      "Support",
      "Reckless",
      "Vanish",
      "Alert",
    ];

    simpleKeywords.forEach((keyword) => {
      const result = parseAbilityText(keyword);
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("keyword");

      if (result.ability?.ability.type === "keyword") {
        expect(result.ability.ability.keyword).toBe(keyword as any);
      }
    });
  });

  it("should handle multiple trigger timings correctly", () => {
    const triggers = [
      { text: "When you play this character, draw a card.", timing: "when" },
      {
        text: "Whenever this character quests, gain 1 lore.",
        timing: "whenever",
      },
      { text: "At the start of your turn, draw a card.", timing: "at" },
    ];

    triggers.forEach(({ text, timing }) => {
      const result = parseAbilityText(text);
      expect(result.success).toBe(true);
      expect(result.ability?.ability.type).toBe("triggered");

      if (result.ability?.ability.type === "triggered") {
        expect(result.ability.ability.trigger.timing).toBe(timing as any);
      }
    });
  });

  it("should handle banish cost activated abilities", () => {
    const result = parseAbilityText("Banish this item - Gain 3 lore.");

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("activated");

    if (result.ability?.ability.type === "activated") {
      expect(result.ability.ability.cost.banishSelf).toBe(true);
    }
  });

  it("should handle empty string gracefully", () => {
    const result = parseAbilityText("");

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should normalize whitespace before parsing", () => {
    const normalized = parseAbilityText("  Rush  ");
    const standard = parseAbilityText("Rush");

    expect(normalized.success).toBe(true);
    expect(standard.success).toBe(true);
    expect(normalized.ability?.ability.type).toBe(
      standard.ability?.ability.type as any,
    );
  });
});
