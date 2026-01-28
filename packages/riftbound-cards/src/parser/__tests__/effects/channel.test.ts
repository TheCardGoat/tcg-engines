/**
 * Parser tests for channel effects
 *
 * Tests for parsing abilities that channel runes.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects } from "../helpers";

describe("Effect: Channel", () => {
  describe("channel exhausted", () => {
    it.skip("should parse 'Channel 1 rune exhausted.'", () => {
      const result = parseAbilities("Channel 1 rune exhausted.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "channel",
            amount: 1,
            exhausted: true,
          }),
        }),
      );
    });

    it.skip("should parse 'Channel 2 runes exhausted.'", () => {
      const result = parseAbilities("Channel 2 runes exhausted.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "channel",
            amount: 2,
            exhausted: true,
          }),
        }),
      );
    });
  });

  describe("channel ready", () => {
    it.skip("should parse 'Channel 1 rune.'", () => {
      const result = parseAbilities("Channel 1 rune.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "channel",
            amount: 1,
          }),
        }),
      );
    });
  });

  describe("channel with additional effects", () => {
    it.skip("should parse 'Channel 2 runes exhausted and draw 1.'", () => {
      const result = parseAbilities("Channel 2 runes exhausted and draw 1.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
