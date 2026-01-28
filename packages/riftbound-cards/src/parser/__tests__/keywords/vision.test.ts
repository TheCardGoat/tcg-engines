/**
 * Parser tests for Vision keyword
 *
 * Tests for parsing [Vision] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Effects } from "../helpers";

describe("Keyword: Vision", () => {
  describe("simple vision", () => {
    it("should parse '[Vision] (When you play me, look at the top card of your Main Deck. You may recycle it.)'", () => {
      const result = parseAbilities(
        "[Vision] (When you play me, look at the top card of your Main Deck. You may recycle it.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Vision",
        }),
      );
    });
  });

  describe("vision with static abilities", () => {
    it("should parse '[Vision] Other friendly units have [Vision].'", () => {
      const result = parseAbilities(
        "[Vision] (When you play me, look at the top card of your Main Deck. You may recycle it.)Other friendly units have [Vision].",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "static",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Vision",
          }),
        }),
      );
    });

    it("should parse '[Vision] You may play me to an open battlefield.'", () => {
      const result = parseAbilities(
        "[Vision] (When you play me, look at the top card of your Main Deck. You may recycle it.)You may play me to an open battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("vision with triggered abilities", () => {
    it.skip("should parse '[Vision] When you recycle one or more cards, buff a friendly unit.'", () => {
      const result = parseAbilities(
        "[Vision] (When you play me, look at the top card of your Main Deck. You may recycle it.)When you recycle one or more cards, buff a friendly unit. (If it doesn't have a buff, it gets a +1 :rb_might: buff. Runes aren't cards.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "triggered",
          trigger: expect.objectContaining({
            event: "recycle",
          }),
          effect: expect.objectContaining({
            type: "buff",
          }),
        }),
      );
    });
  });

  describe("vision combined with shield", () => {
    it.skip("should parse '[Vision][Shield]'", () => {
      const result = parseAbilities(
        "[Vision] (When you play me, look at the top card of your Main Deck. You may recycle it.)[Shield]** **(+1 :rb_might: while I'm a defender.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Vision",
        }),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.shield(1)),
      );
    });
  });

  describe("vision granted to others", () => {
    it("should parse 'Your Mechs have [Vision].'", () => {
      const result = parseAbilities(
        "Your Mechs have [Vision]. (When you play us, look at the top card of your Main Deck. You may recycle it.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Vision",
          }),
        }),
      );
    });
  });
});
