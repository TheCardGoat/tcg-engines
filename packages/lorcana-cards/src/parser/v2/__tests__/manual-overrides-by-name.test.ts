/**
 * Tests for Manual Overrides by Name
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { MANUAL_ENTRIES_BY_NAME } from "../manual-overrides";
import { parseAbilityText } from "../parser";

describe("Manual Overrides by Name", () => {
  const TEST_CARD_NAME = "Test Card For Manual Override";
  const TEST_ABILITY_TEXT = "Test ability text.";

  // Store original state for cleanup
  let originalEntry: (typeof MANUAL_ENTRIES_BY_NAME)[string] | undefined;

  // Register a manual entry for testing before each test
  const testEntry: any = {
    text: TEST_ABILITY_TEXT,
    name: "TEST ABILITY",
    ability: {
      type: "static",
      id: "test-1",
      text: "Test static ability",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "THIS_CHARACTER",
      },
    },
  };

  beforeEach(() => {
    // Save original entry if it exists
    originalEntry = MANUAL_ENTRIES_BY_NAME[TEST_CARD_NAME];
    // Register test entry
    MANUAL_ENTRIES_BY_NAME[TEST_CARD_NAME] = testEntry;
  });

  afterEach(() => {
    // Clean up: restore original state or delete the test entry
    if (originalEntry) {
      MANUAL_ENTRIES_BY_NAME[TEST_CARD_NAME] = originalEntry;
    } else {
      delete MANUAL_ENTRIES_BY_NAME[TEST_CARD_NAME];
    }
  });

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
    expect((result.ability?.ability as any)?.type).toBe("keyword");
  });

  it("should ignore card name if not provided", () => {
    const result = parseAbilityText("Rush");

    expect(result.success).toBe(true);
    expect((result.ability?.ability as any)?.type).toBe("keyword");
  });
});
