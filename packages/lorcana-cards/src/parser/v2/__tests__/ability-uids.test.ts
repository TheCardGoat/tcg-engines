/**
 * Tests for ability UID generation
 *
 * Tests the generateAbilityUids option in ParseOptions.
 *
 * @group parser
 * @group uids
 */

import { describe, expect, it } from "bun:test";
import { parseAbilityText, parseAbilityTextMulti } from "../parser";

describe("Ability UID Generation", () => {
  describe("parseAbilityText", () => {
    it("should not generate ID when generateAbilityUids is false", () => {
      const result = parseAbilityText("Rush", {
        cardId: "17t",
        generateAbilityUids: false,
      });

      expect(result.success).toBe(true);
      expect(result.ability).toBeDefined();
      expect(result.ability?.id).toBeUndefined();
    });

    it("should not generate ID when generateAbilityUids is not provided", () => {
      const result = parseAbilityText("Rush", {
        cardId: "17t",
      });

      expect(result.success).toBe(true);
      expect(result.ability).toBeDefined();
      expect(result.ability?.id).toBeUndefined();
    });

    it("should not generate ID when cardId is not provided", () => {
      const result = parseAbilityText("Rush", {
        generateAbilityUids: true,
      });

      expect(result.success).toBe(true);
      expect(result.ability).toBeDefined();
      expect(result.ability?.id).toBeUndefined();
    });

    it("should generate ID when both generateAbilityUids and cardId are provided", () => {
      const result = parseAbilityText("Rush", {
        cardId: "17t",
        generateAbilityUids: true,
      });

      expect(result.success).toBe(true);
      expect(result.ability).toBeDefined();
      expect(result.ability?.id).toBe("17t-1");
    });

    it("should generate correct ID format for Shift keyword", () => {
      const result = parseAbilityText("Shift 3 {I}", {
        cardId: "17t",
        generateAbilityUids: true,
      });

      expect(result.success).toBe(true);
      expect(result.ability).toBeDefined();
      expect(result.ability?.id).toBe("17t-1");
      const ability = result.ability?.ability as any;
      expect(ability.type).toBe("keyword");
      expect(ability.keyword).toBe("Shift");
    });
  });

  describe("parseAbilityTextMulti", () => {
    it("should not generate IDs when generateAbilityUids is false", () => {
      const result = parseAbilityTextMulti("Rush\nWard", {
        cardId: "17t",
        generateAbilityUids: false,
      });

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(2);
      expect(result.abilities[0]?.id).toBeUndefined();
      expect(result.abilities[1]?.id).toBeUndefined();
    });

    it("should not generate IDs when generateAbilityUids is not provided", () => {
      const result = parseAbilityTextMulti("Rush\nWard", {
        cardId: "17t",
      });

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(2);
      expect(result.abilities[0]?.id).toBeUndefined();
      expect(result.abilities[1]?.id).toBeUndefined();
    });

    it("should not generate IDs when cardId is not provided", () => {
      const result = parseAbilityTextMulti("Rush\nWard", {
        generateAbilityUids: true,
      });

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(2);
      expect(result.abilities[0]?.id).toBeUndefined();
      expect(result.abilities[1]?.id).toBeUndefined();
    });

    it("should generate sequential IDs for multiple abilities", () => {
      const result = parseAbilityTextMulti("Rush\nWard", {
        cardId: "17t",
        generateAbilityUids: true,
      });

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(2);
      expect(result.abilities[0]?.id).toBe("17t-1");
      expect(result.abilities[1]?.id).toBe("17t-2");
    });

    it("should generate correct IDs for Shift and triggered abilities", () => {
      const text =
        "Shift 3 {I}\nCASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.";
      const result = parseAbilityTextMulti(text, {
        cardId: "17t",
        generateAbilityUids: true,
      });

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBeGreaterThanOrEqual(2);
      expect(result.abilities[0]?.id).toBe("17t-1");
      expect(result.abilities[1]?.id).toBe("17t-2");

      const firstAbility = result.abilities[0]?.ability as any;
      expect(firstAbility?.type).toBe("keyword");
      expect(firstAbility?.keyword).toBe("Shift");
    });

    it("should generate ID for single ability", () => {
      const result = parseAbilityTextMulti("Rush", {
        cardId: "17t",
        generateAbilityUids: true,
      });

      expect(result.success).toBe(true);
      expect(result.abilities.length).toBe(1);
      expect(result.abilities[0]?.id).toBe("17t-1");
    });

    it("should generate IDs with different cardId prefixes", () => {
      const result1 = parseAbilityTextMulti("Rush", {
        cardId: "17t",
        generateAbilityUids: true,
      });

      const result2 = parseAbilityTextMulti("Ward", {
        cardId: "18a",
        generateAbilityUids: true,
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.abilities[0]?.id).toBe("17t-1");
      expect(result2.abilities[0]?.id).toBe("18a-1");
    });
  });
});
