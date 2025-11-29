/**
 * Tests for Main Parser and Batch Processing
 *
 * Integration tests for the complete parser system.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilityText, parseAbilityTexts } from "../parser";

describe("Main Parser", () => {
  it("should parse keyword ability", () => {
    const result = parseAbilityText("Rush");

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("keyword");
  });

  it("should parse triggered ability", () => {
    const result = parseAbilityText(
      "When you play this character, draw 2 cards.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("triggered");
  });

  it("should parse activated ability", () => {
    const result = parseAbilityText("{E} - Draw a card.");

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("activated");
  });

  it("should parse static ability", () => {
    const result = parseAbilityText("Your characters gain Ward.");

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("static");
  });

  it("should handle lenient mode with warnings", () => {
    const result = parseAbilityText(
      "Unknown ability text that cannot be parsed",
    );

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should normalize text before parsing", () => {
    const result = parseAbilityText("  Rush  ");

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("keyword");
  });
});

describe("Batch Processing", () => {
  it("should process multiple ability texts", () => {
    const texts = [
      "Rush",
      "Ward",
      "Challenger +3",
      "When you play this character, draw a card.",
      "{E} - Draw a card.",
    ];

    const results = parseAbilityTexts(texts);

    expect(results.total).toBe(5);
    expect(results.successful).toBeGreaterThanOrEqual(4);
    expect(results.results).toHaveLength(5);
  });

  it("should continue on individual failures", () => {
    const texts = ["Rush", "Invalid ability text", "Ward"];

    const results = parseAbilityTexts(texts);

    expect(results.total).toBe(3);
    expect(results.successful).toBeGreaterThanOrEqual(2);
    expect(results.failed).toBeGreaterThanOrEqual(1);
  });

  it("should aggregate success/failure counts", () => {
    const texts = ["Rush", "Ward", "Evasive"];

    const results = parseAbilityTexts(texts);

    expect(results.successful + results.failed).toBe(results.total);
  });

  it("should handle empty array", () => {
    const results = parseAbilityTexts([]);

    expect(results.total).toBe(0);
    expect(results.successful).toBe(0);
    expect(results.failed).toBe(0);
    expect(results.results).toHaveLength(0);
  });
});
