/**
 * Tests for optional fields (id, name, text) in AbilityWithText
 *
 * @group parser
 * @group optional-fields
 */

import { describe, expect, it } from "bun:test";
import { parseAbilityText } from "../parser";

describe("Optional Fields in AbilityWithText", () => {
  describe("Default behavior (no options)", () => {
    it("should NOT include id field by default", () => {
      const result = parseAbilityText("Rush");

      expect(result.success).toBe(true);
      expect(result.ability).toBeDefined();
      expect(result.ability?.id).toBeUndefined();
    });

    it("should include text field by default if provided", () => {
      const result = parseAbilityText("Rush");

      expect(result.success).toBe(true);
      expect(result.ability).toBeDefined();
      // Text is currently included by default if it has a value
      expect(result.ability?.text).toBe("Rush");
    });

    it("should include name field for named triggered abilities", () => {
      // Named triggered ability: "NAME When/Whenever..." pattern
      const result = parseAbilityText(
        "COLD SHOULDER When you play this character, draw a card.",
      );

      expect(result.success).toBe(true);
      expect(result.ability).toBeDefined();
      // Named triggered abilities should have their name extracted
      expect(result.ability?.name).toBe("COLD SHOULDER");
      // Text should also be present
      expect(result.ability?.text).toBe(
        "COLD SHOULDER When you play this character, draw a card.",
      );
    });

    it("should include name field for named static abilities", () => {
      // Named static ability: "NAME This character can't/cannot..." pattern
      const result = parseAbilityText(
        "STAY LOW This character can't be challenged.",
      );

      expect(result.success).toBe(true);
      expect(result.ability).toBeDefined();
      // Named static abilities should have their name extracted
      expect(result.ability?.name).toBe("STAY LOW");
    });

    it("should not include name field for unnamed abilities", () => {
      const result = parseAbilityText("Rush");

      expect(result.success).toBe(true);
      expect(result.ability).toBeDefined();
      // Keyword abilities don't have names, so name should be undefined
      expect(result.ability?.name).toBeUndefined();
    });
  });

  describe("With generateAbilityUids option", () => {
    it("should include id when generateAbilityUids is true and cardId is provided", () => {
      const result = parseAbilityText("Rush", {
        cardId: "17t",
        generateAbilityUids: true,
      });

      expect(result.success).toBe(true);
      expect(result.ability?.id).toBe("17t-1");
    });

    it("should NOT include id when generateAbilityUids is false", () => {
      const result = parseAbilityText("Rush", {
        cardId: "17t",
        generateAbilityUids: false,
      });

      expect(result.success).toBe(true);
      expect(result.ability?.id).toBeUndefined();
    });
  });
});
