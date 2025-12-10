/**
 * Tests for Manual Overrides by Name
 */

import { describe, expect, it } from "bun:test";
import { MANUAL_ENTRIES_BY_NAME } from "../manual-overrides";
import { parseAbilityText } from "../parser";

describe("Manual Overrides by Name", () => {
  // Add a test entry to MANUAL_ENTRIES_BY_NAME
  const TEST_CARD_NAME = "Test Card For Manual Override";
  const TEST_ABILITY_TEXT = "Test ability text.";

  // Register a manual entry for testing
  MANUAL_ENTRIES_BY_NAME[TEST_CARD_NAME] = {
    text: TEST_ABILITY_TEXT,
    name: "TEST ABILITY",
    ability: {
      type: "static",
      effect: {
        type: "keyword", // Using a simple type for testing
        keyword: "Ward",
      },
    },
  };

  it("should look up manual entry by card name", () => {
    // The text passed doesn't match the manual entry text, but the name should trigger the override
    const result = parseAbilityText(
      "Some random text that would normally fail or parse differently",
      {
        cardName: TEST_CARD_NAME,
      },
    );

    expect(result.success).toBe(true);
    expect(result.ability).toBeDefined();
    expect(result.ability?.name).toBe("TEST ABILITY");
    // Verify it got the capability from the manual entry
    expect((result.ability?.ability as any).effect.keyword).toBe("Ward");
  });

  it("should fall back to text lookup if card name not found", () => {
    // Should parse normally if name is not in overrides
    const result = parseAbilityText("Rush", {
      cardName: "Non Existent Card",
    });

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("keyword");
  });

  it("should ignore card name if not provided", () => {
    const result = parseAbilityText("Rush");

    expect(result.success).toBe(true);
    expect(result.ability?.ability.type).toBe("keyword");
  });
});
