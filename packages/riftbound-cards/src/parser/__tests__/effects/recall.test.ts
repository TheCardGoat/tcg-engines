/**
 * Parser tests for recall effects
 *
 * Tests for parsing abilities that recall units to base.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Recall", () => {
  describe("recall self", () => {
    it("should parse 'Recall me.'", () => {
      const result = parseAbilities(
        "Recall me. (Send me to base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "recall",
          }),
        }),
      );
    });

    it("should parse 'Recall me exhausted.'", () => {
      const result = parseAbilities(
        "Recall me exhausted. (Send me to base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "recall",
            exhausted: true,
          }),
        }),
      );
    });
  });

  describe("recall target", () => {
    it("should parse 'Recall a unit.'", () => {
      const result = parseAbilities(
        "Recall a unit. (Send it to base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it("should parse 'Recall that unit exhausted.'", () => {
      const result = parseAbilities(
        "Recall that unit exhausted. (Send it to base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("recall with replacement", () => {
    it.skip("should parse 'The next time a friendly unit would die, recall it exhausted instead.'", () => {
      const result = parseAbilities(
        "Choose a friendly unit. The next time it dies this turn, recall it exhausted instead. (Send it to base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
