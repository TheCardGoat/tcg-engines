/**
 * Parser tests for Deflect keyword
 *
 * Tests for parsing [Deflect] and [Deflect N] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Conditions, Effects } from "../helpers";

describe("Keyword: Deflect", () => {
  describe("simple deflect", () => {
    it.skip("should parse '[Deflect] (Opponents must pay :rb_rune_rainbow: to choose me with a spell or ability.)'", () => {
      const result = parseAbilities(
        "[Deflect] (Opponents must pay :rb_rune_rainbow: to choose me with a spell or ability.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(expect.objectContaining(Abilities.deflect(1)));
    });
  });

  describe("deflect with value", () => {
    it.skip("should parse '[Deflect 2] (Opponents must pay :rb_rune_rainbow::rb_rune_rainbow: to choose me with a spell or ability.)'", () => {
      const result = parseAbilities(
        "[Deflect 2] (Opponents must pay :rb_rune_rainbow::rb_rune_rainbow: to choose me with a spell or ability.)When I attack, deal 5 damage split among any number of enemy units here.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
      expect(result.abilities?.[0]).toEqual(expect.objectContaining(Abilities.deflect(2)));
    });
  });

  describe("deflect with triggered abilities", () => {
    it.skip("should parse '[Deflect] When I conquer, draw 1 or channel 1 rune exhausted.'", () => {
      const result = parseAbilities(
        "[Deflect] (Opponents must pay :rb_rune_rainbow: to choose me with a spell or ability.)When I conquer, draw 1 or channel 1 rune exhausted.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(expect.objectContaining(Abilities.deflect(1)));
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "triggered",
        }),
      );
    });

    it.skip("should parse '[Deflect] When I move to a battlefield, give a friendly unit my keywords and +:rb_might: equal to my Might this turn.'", () => {
      const result = parseAbilities(
        "[Deflect] (Opponents must pay :rb_rune_rainbow: to choose me with a spell or ability.)When I move to a battlefield, give a friendly unit my keywords and +:rb_might: equal to my Might this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });

    it.skip("should parse '[Deflect] When you choose or ready me, give me +1 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Deflect] (Opponents must pay :rb_rune_rainbow: to choose me with a spell or ability.)When you choose or ready me, give me +1 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("deflect with static abilities", () => {
    it.skip("should parse '[Deflect] While I'm at a battlefield, opponents can't score points.'", () => {
      const result = parseAbilities(
        "[Deflect] (Opponents must pay :rb_rune_rainbow: to choose me with a spell or ability.)While I'm at a battlefield, opponents can't score points.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });

    it.skip("should parse '[Deflect] Each Equipment in your hand has [Quick-Draw].'", () => {
      const result = parseAbilities(
        "[Deflect] (Opponents must pay :rb_rune_rainbow: to choose me with a spell or ability.)Each Equipment in your hand has [Quick-Draw]. (It gains [Reaction]. When you play it, attach it to a unit you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });

    it.skip("should parse '[Deflect] You may play me to an occupied enemy battlefield.'", () => {
      const result = parseAbilities(
        "[Deflect] (Opponents must pay :rb_rune_rainbow: to choose me with a spell or ability.)You may play me to an occupied enemy battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("conditional deflect", () => {
    it.skip("should parse 'While I'm [Mighty], I have [Deflect], [Ganking], and [Shield].'", () => {
      const result = parseAbilities(
        "While I'm [Mighty], I have [Deflect], [Ganking], and [Shield]. (I'm Mighty while I have 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          condition: expect.objectContaining({
            type: "while-mighty",
          }),
          type: "static",
        }),
      );
    });
  });

  describe("deflect granted to others", () => {
    it.skip("should parse 'Your Mechs have [Deflect] and [Ganking].'", () => {
      const result = parseAbilities(
        "Your Mechs have [Deflect] and [Ganking]. (Opponents must pay :rb_rune_rainbow: to choose us with a spell or ability. We can move from battlefield to battlefield.)I enter ready if you control another Mech.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
    });

    it.skip("should parse 'Friendly buffed units have [Deflect] if they didn't already.'", () => {
      const result = parseAbilities(
        "When you play this, buff a friendly unit. (If it doesn't have a buff, it gets a +1 :rb_might: buff.)Friendly buffed units have [Deflect] if they didn't already. (Opponents must pay :rb_rune_rainbow: to choose those units with a spell or ability.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
    });

    it.skip("should parse '[Temporary] Friendly units have [Deflect].'", () => {
      const result = parseAbilities(
        "[Temporary] (Kill this at the start of its controller's Beginning Phase, before scoring.)Friendly units have [Deflect]. (Opponents must pay :rb_rune_rainbow: to choose them with a spell or ability.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("deflect with additional cost", () => {
    it.skip("should parse 'As you play me, you may kill any number of friendly units as an additional cost. Reduce my cost by :rb_rune_order: for each killed this way.[Deflect][Ganking]'", () => {
      const result = parseAbilities(
        "As you play me, you may kill any number of friendly units as an additional cost. Reduce my cost by :rb_rune_order: for each killed this way.[Deflect] (Opponents must pay :rb_rune_rainbow: to choose me with a spell or ability.)[Ganking] (I can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("deflect 2 with weaponmaster", () => {
    it.skip("should parse '[Deflect 2][Weaponmaster] I have +1 :rb_might: for each friendly gear.'", () => {
      const result = parseAbilities(
        "[Deflect 2] (Opponents must pay :rb_rune_rainbow::rb_rune_rainbow: to choose me with a spell or ability.)[Weaponmaster] (When you play me, you may [Equip] one of your Equipment to me for :rb_rune_rainbow: less, even if it's already attached.)I have +1 :rb_might: for each friendly gear.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(3);
      expect(result.abilities?.[0]).toEqual(expect.objectContaining(Abilities.deflect(2)));
      expect(result.abilities?.[1]).toEqual(expect.objectContaining(Abilities.weaponmaster()));
    });
  });
});
