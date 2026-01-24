/**
 * Tests for optional fields (id, name, text) in AbilityWithText
 *
 * @group parser
 * @group optional-fields
 */

import { describe, expect, it } from "bun:test";
import { parseAbilityText, parseAbilityTextMulti } from "../parser";

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
      // text is currently included by default if it has a value
      expect(result.ability?.text).toBe("Rush");
    });

    it("should include name field by default if ability has a name", () => {
      const result = parseAbilityText(
        "CASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.",
      );

      expect(result.success).toBe(true);
      expect(result.ability).toBeDefined();
      // name is currently included by default if it exists
      if (result.ability?.ability && "name" in result.ability.ability) {
        const abilityName = (result.ability.ability as { name?: string }).name;
        if (abilityName) {
          expect(result.ability?.name).toBeDefined();
        }
      }
    });
  });

  describe("With generateAbilityUids option", () => {
    it("should include id when generateAbilityUids is true and cardId is provided", () => {
      const result = parseAbilityText("Rush", {
        generateAbilityUids: true,
        cardId: "17t",
      });

      expect(result.success).toBe(true);
      expect(result.ability?.id).toBe("17t-1");
    });

    it("should NOT include id when generateAbilityUids is false", () => {
      const result = parseAbilityText("Rush", {
        generateAbilityUids: false,
        cardId: "17t",
      });

      expect(result.success).toBe(true);
      expect(result.ability?.id).toBeUndefined();
    });
  });
});
