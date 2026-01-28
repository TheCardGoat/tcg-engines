/**
 * Parser tests for Temporary keyword
 *
 * Tests for parsing [Temporary] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Effects } from "../helpers";

describe("Keyword: Temporary", () => {
  describe("simple temporary", () => {
    it("should parse '[Temporary] (Kill me at the start of your Beginning Phase, before scoring.)'", () => {
      const result = parseAbilities(
        "[Temporary] (Kill me at the start of your Beginning Phase, before scoring.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.temporary()),
      );
    });
  });

  describe("temporary with static ability", () => {
    it.skip("should parse '[Temporary] Friendly units have [Deflect].'", () => {
      const result = parseAbilities(
        "[Temporary] (Kill this at the start of its controller's Beginning Phase, before scoring.)Friendly units have [Deflect]. (Opponents must pay :rb_rune_rainbow: to choose them with a spell or ability.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.temporary()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "static",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Deflect",
          }),
        }),
      );
    });
  });

  describe("temporary granted to others", () => {
    it.skip("should parse 'Give a unit at a battlefield or a gear [Temporary].'", () => {
      const result = parseAbilities(
        "Give a unit at a battlefield or a gear [Temporary]. (Kill it at the start of its controller's Beginning Phase, before scoring.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Temporary",
          }),
        }),
      );
    });

    it.skip("should parse 'When you play me, play a ready 3 :rb_might: Sprite unit token with [Temporary] here.'", () => {
      const result = parseAbilities(
        "When you play me, play a ready 3 :rb_might: Sprite unit token with [Temporary] here. (Kill it at the start of its controller's Beginning Phase, before scoring.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "create-token",
            token: expect.objectContaining({
              keywords: expect.arrayContaining(["Temporary"]),
            }),
          }),
        }),
      );
    });
  });

  describe("temporary in spell effects", () => {
    it.skip("should parse '[Action] Double a friendly unit's Might this turn. Give it [Temporary].'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Double a friendly unit's Might this turn. Give it [Temporary]. (Kill it at the start of its controller's Beginning Phase, before scoring.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "action",
        }),
      );
    });

    it.skip("should parse '[Hidden][Action] Play a ready 3 :rb_might: Sprite unit token with [Temporary].'", () => {
      const result = parseAbilities(
        "[Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)[Action] (Play on your turn or in showdowns.)Play a ready 3 :rb_might: Sprite unit token with [Temporary]. (Kill it at the start of its controller's Beginning Phase, before scoring.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("temporary with quick-draw", () => {
    it.skip("should parse '[Quick-Draw][Equip] :rb_rune_rainbow:[Temporary]'", () => {
      const result = parseAbilities(
        "[Quick-Draw] (This has [Reaction]. When you play it, attach it to a unit you control.)[Equip] :rb_rune_rainbow: (:rb_rune_rainbow:: Attach this to a unit you control.)[Temporary] (If this is unattached, kill it at the start of its controller's Beginning Phase, before scoring.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(3);
      expect(result.abilities?.[2]).toEqual(
        expect.objectContaining(Abilities.temporary()),
      );
    });
  });
});
