/**
 * Parser tests for extra turn abilities
 *
 * Tests for parsing abilities that grant extra turns.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Special: Extra Turn", () => {
  describe("extra turn effect", () => {
    it.skip("should parse 'Take an extra turn after this one.'", () => {
      const result = parseAbilities("Take an extra turn after this one.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "extra-turn",
          }),
        }),
      );
    });
  });

  describe("conditional extra turn", () => {
    it.skip("should parse 'If you've scored 3 or more points this turn, take an extra turn after this one.'", () => {
      const result = parseAbilities(
        "If you've scored 3 or more points this turn, take an extra turn after this one.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          condition: expect.objectContaining({
            type: "score",
          }),
          effect: expect.objectContaining({
            type: "extra-turn",
          }),
        }),
      );
    });
  });
});
