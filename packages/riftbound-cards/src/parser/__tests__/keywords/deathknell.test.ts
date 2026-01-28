/**
 * Parser tests for Deathknell keyword
 *
 * Tests for parsing [Deathknell] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Effects, Tokens } from "../helpers";

describe("Keyword: Deathknell", () => {
  describe("deathknell with draw", () => {
    it("should parse '[Deathknell] — Draw 1. (When I die, get the effect.)'", () => {
      const result = parseAbilities(
        "[Deathknell] — Draw 1. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.deathknell(Effects.draw(1))),
      );
    });

    it("should parse '[Deathknell] — If I was [Mighty], draw 2.'", () => {
      const result = parseAbilities(
        "[Deathknell] — If I was [Mighty], draw 2. (When I die, get the effect. I'm Mighty while I have 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Deathknell",
          condition: expect.objectContaining({
            type: "while-mighty",
          }),
        }),
      );
    });

    it("should parse '[Deathknell] — If I died alone, draw 1.'", () => {
      const result = parseAbilities(
        "[Deathknell] — If I died alone, draw 1. (When I die, get the effect. I'm alone if there are no other friendly units here.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Deathknell",
          condition: expect.objectContaining({
            type: "while-alone",
          }),
        }),
      );
    });
  });

  describe("deathknell with channel", () => {
    it("should parse '[Deathknell] — Channel 1 rune exhausted.'", () => {
      const result = parseAbilities(
        "[Deathknell] — Channel 1 rune exhausted. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining(Abilities.deathknell(Effects.channel(1, true))),
      );
    });

    it.skip("should parse '[Accelerate][Deathknell] — Channel 2 runes exhausted and draw 1.'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_calm: as an additional cost to have me enter ready.)[Deathknell] — Channel 2 runes exhausted and draw 1. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Accelerate",
        }),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Deathknell",
        }),
      );
    });
  });

  describe("deathknell with damage", () => {
    it("should parse '[Deathknell] — Deal 4 to all units at my battlefield.'", () => {
      const result = parseAbilities(
        "[Deathknell] — Deal 4 to all units at my battlefield. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Deathknell",
          effect: expect.objectContaining({
            type: "damage",
            amount: 4,
          }),
        }),
      );
    });
  });

  describe("deathknell with discard", () => {
    it.skip("should parse '[Deathknell] — Discard 2, then draw 2.'", () => {
      const result = parseAbilities(
        "[Deathknell] — Discard 2, then draw 2. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Deathknell",
          effect: expect.objectContaining({
            type: "sequence",
          }),
        }),
      );
    });
  });

  describe("deathknell with token creation", () => {
    it.skip("should parse '[Deathknell] — Play a Gold gear token exhausted.'", () => {
      const result = parseAbilities(
        "[Deathknell] — Play a Gold gear token exhausted. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Deathknell",
          effect: expect.objectContaining({
            type: "create-token",
          }),
        }),
      );
    });

    it.skip("should parse '[Deathknell] — Play three 1 :rb_might: Recruit unit tokens into your base.'", () => {
      const result = parseAbilities(
        "[Deathknell] — Play three 1 :rb_might: Recruit unit tokens into your base. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Deathknell",
          effect: expect.objectContaining({
            type: "create-token",
            amount: 3,
          }),
        }),
      );
    });

    it.skip("should parse '[Deathknell] — Play two 3 :rb_might: Mech unit tokens to your base.'", () => {
      const result = parseAbilities(
        "[Deathknell] — Play two 3 :rb_might: Mech unit tokens to your base. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Deathknell",
          effect: expect.objectContaining({
            type: "create-token",
            amount: 2,
          }),
        }),
      );
    });
  });

  describe("deathknell with play from trash", () => {
    it.skip("should parse '[Deathknell] — You may play a unit with cost no more than :rb_energy_3: and no more than :rb_rune_rainbow: from your trash, ignoring its cost.'", () => {
      const result = parseAbilities(
        "[Deathknell] — You may play a unit with cost no more than :rb_energy_3: and no more than :rb_rune_rainbow: from your trash, ignoring its cost. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Deathknell",
          effect: expect.objectContaining({
            type: "play",
          }),
        }),
      );
    });
  });

  describe("deathknell with recycle and ready", () => {
    it.skip("should parse '[Accelerate][Deathknell] — Recycle me to ready your runes.'", () => {
      const result = parseAbilities(
        "[Accelerate] (You may pay :rb_energy_1::rb_rune_mind: as an additional cost to have me enter ready.)[Deathknell] — Recycle me to ready your runes. (When I die, get the effect.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
    });
  });

  describe("deathknell trigger doubling", () => {
    it.skip("should parse 'Your [Deathknell] effects trigger an additional time.'", () => {
      const result = parseAbilities(
        "Your [Deathknell] effects trigger an additional time.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });
  });
});
