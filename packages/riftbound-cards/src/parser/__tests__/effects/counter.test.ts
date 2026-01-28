/**
 * Parser tests for counter effects
 *
 * Tests for parsing abilities that counter spells.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Counter", () => {
  describe("counter spell", () => {
    it.skip("should parse 'Counter a spell.'", () => {
      const result = parseAbilities("Counter a spell.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "counter",
          }),
        }),
      );
    });
  });

  describe("counter with cost restriction", () => {
    it.skip("should parse 'Counter a spell that costs no more than :rb_energy_4: and no more than :rb_rune_rainbow:.'", () => {
      const result = parseAbilities(
        "Counter a spell that costs no more than :rb_energy_4: and no more than :rb_rune_rainbow:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("counter unless", () => {
    it.skip("should parse 'Counter a spell unless its controller pays :rb_energy_2:.'", () => {
      const result = parseAbilities(
        "Counter a spell unless its controller pays :rb_energy_2:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "counter",
            unless: expect.objectContaining({
              energy: 2,
            }),
          }),
        }),
      );
    });
  });

  describe("counter ability", () => {
    it.skip("should parse 'Counter an enemy spell or ability that chooses a friendly unit or gear.'", () => {
      const result = parseAbilities(
        "Counter an enemy spell or ability that chooses a friendly unit or gear.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("counter with additional effects", () => {
    it.skip("should parse 'Counter that spell and give that unit +:rb_might: equal to that spell's Energy cost this turn.'", () => {
      const result = parseAbilities(
        "Choose a friendly unit and a spell. Counter that spell and give that unit +:rb_might: equal to that spell's Energy cost this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
