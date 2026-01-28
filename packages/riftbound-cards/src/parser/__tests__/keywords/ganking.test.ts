/**
 * Parser tests for Ganking keyword
 *
 * Tests for parsing [Ganking] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Effects, Triggers } from "../helpers";

describe("Keyword: Ganking", () => {
  describe("simple ganking", () => {
    it("should parse '[Ganking] (I can move from battlefield to battlefield.)'", () => {
      const result = parseAbilities(
        "[Ganking] (I can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.ganking()),
      );
    });
  });

  describe("ganking with static abilities", () => {
    it.skip("should parse '[Ganking] I enter ready.'", () => {
      const result = parseAbilities(
        "[Ganking] (I can move from battlefield to battlefield.)I enter ready.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.ganking()),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });

    it.skip("should parse '[Ganking] If I have moved twice this turn, I don't take damage.'", () => {
      const result = parseAbilities(
        "[Ganking] (I can move from battlefield to battlefield.)If I have moved twice this turn, I don't take damage.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("ganking with triggered abilities", () => {
    it.skip("should parse '[Ganking] The third time I move in a turn, you score 1 point.'", () => {
      const result = parseAbilities(
        "[Ganking] (I can move from battlefield to battlefield.)The third time I move in a turn, you score 1 point.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "triggered",
        }),
      );
    });

    it.skip("should parse '[Ganking] When I conquer, you may play a spell from your trash.'", () => {
      const result = parseAbilities(
        "[Ganking] (I can move from battlefield to battlefield.)When I conquer, you may play a spell from your trash with Energy cost less than your points without paying its Energy cost. Then recycle it. (You must still pay its Power cost.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "triggered",
          optional: true,
        }),
      );
    });

    it.skip("should parse '[Ganking] When you look at cards from the top of your deck (and don't draw them) and see me, you may play me for :rb_rune_rainbow:.'", () => {
      const result = parseAbilities(
        "[Ganking] (I can move from battlefield to battlefield.)When you look at cards from the top of your deck (and don't draw them) and see me, you may play me for :rb_rune_rainbow:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("ganking with activated abilities", () => {
    it.skip("should parse '[Ganking] Recycle 1 from your trash: Give me +1 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Ganking] (I can move from battlefield to battlefield.)Recycle 1 from your trash: Give me +1 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "activated",
        }),
      );
    });
  });

  describe("conditional ganking", () => {
    it.skip("should parse 'While I'm buffed, I have [Ganking].'", () => {
      const result = parseAbilities(
        "While I'm buffed, I have [Ganking]. (I can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          condition: expect.objectContaining({
            type: "while-buffed",
          }),
        }),
      );
    });

    it.skip("should parse 'If you've discarded a card this turn, I have [Assault] and [Ganking].'", () => {
      const result = parseAbilities(
        "If you've discarded a card this turn, I have [Assault] and [Ganking]. (+1 :rb_might: while I'm an attacker. I can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });

    it.skip("should parse 'If you've spent at least :rb_rune_rainbow::rb_rune_rainbow: this turn, I have +2 :rb_might: and [Ganking].'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_chaos: as an additional cost to have me enter ready.)If you've spent at least :rb_rune_rainbow::rb_rune_rainbow: this turn, I have +2 :rb_might: and [Ganking]. (I can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("ganking granted to others", () => {
    it.skip("should parse 'Units here have [Ganking].'", () => {
      const result = parseAbilities(
        "Units here have [Ganking]. (They can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Ganking",
          }),
        }),
      );
    });

    it.skip("should parse ':rb_exhaust:: Give a unit [Ganking] this turn.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: Give a unit [Ganking] this turn. (It can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Ganking",
          }),
        }),
      );
    });

    it.skip("should parse 'When you play me, give a unit [Ganking] this turn.'", () => {
      const result = parseAbilities(
        "When you play me, give a unit [Ganking] this turn. (It can move from battlefield to battlefield.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "triggered",
          effect: expect.objectContaining({
            type: "grant-keyword",
            keyword: "Ganking",
          }),
        }),
      );
    });
  });

  describe("ganking combined with accelerate", () => {
    it.skip("should parse '[Accelerate][Ganking] The first time I move each turn, you may ready something else that's exhausted.'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_body: as an additional cost to have me enter ready.)[Ganking] (I can move from battlefield to battlefield.)The first time I move each turn, you may ready something else that's exhausted.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(3);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Accelerate",
        }),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining(Abilities.ganking()),
      );
    });
  });
});
