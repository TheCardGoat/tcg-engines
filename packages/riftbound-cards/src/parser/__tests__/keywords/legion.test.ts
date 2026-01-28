/**
 * Parser tests for Legion keyword
 *
 * Tests for parsing [Legion] keyword abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Abilities, Conditions, Effects } from "../helpers";

describe("Keyword: Legion", () => {
  describe("legion with cost reduction", () => {
    it.skip("should parse '[Legion] — I cost :rb_energy_2: less.'", () => {
      const result = parseAbilities(
        "[Legion] — I cost :rb_energy_2: less._ (Get the effect if you've played another card this turn.)_",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Legion",
        }),
      );
    });
  });

  describe("legion with buff", () => {
    it("should parse '[Legion] — When you play me, buff me.'", () => {
      const result = parseAbilities(
        "[Legion] — When you play me, buff me. (If I don't have a buff, I get a +1 :rb_might: buff. Get the effect if you've played another card this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Legion",
          effect: expect.objectContaining({
            type: "buff",
          }),
        }),
      );
    });
  });

  describe("legion with discard and draw", () => {
    it.skip("should parse '[Legion] — When you play me, discard 2, then draw 2.'", () => {
      const result = parseAbilities(
        "[Legion] — When you play me, discard 2, then draw 2. (Get the effect if you've played another card this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Legion",
          effect: expect.objectContaining({
            type: "sequence",
          }),
        }),
      );
    });
  });

  describe("legion with might modification", () => {
    it.skip("should parse '[Legion] — When you play me, give a unit +2 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Legion] — When you play me, give a unit +2 :rb_might: this turn. (Get the effect if you've played another card this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Legion",
          effect: expect.objectContaining({
            type: "modify-might",
            amount: 2,
          }),
        }),
      );
    });
  });

  describe("legion with token creation", () => {
    it.skip("should parse '[Legion] — When you play me, play two 1 :rb_might: Recruit unit tokens here.'", () => {
      const result = parseAbilities(
        "[Legion] — When you play me, play two 1 :rb_might: Recruit unit tokens here._ (Get the effect if you've played another card this turn.)_",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Legion",
          effect: expect.objectContaining({
            type: "create-token",
            amount: 2,
          }),
        }),
      );
    });
  });

  describe("legion with ready and static", () => {
    it.skip("should parse '[Legion] — When you play me, ready me. Other friendly units have +1 :rb_might: here.'", () => {
      const result = parseAbilities(
        "[Legion] — When you play me, ready me. (Get the effect if you've played another card this turn)Other friendly units have +1 :rb_might: here.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "keyword",
          keyword: "Legion",
          effect: expect.objectContaining({
            type: "ready",
          }),
        }),
      );
      expect(result.abilities?.[1]).toEqual(
        expect.objectContaining({
          type: "static",
        }),
      );
    });
  });

  describe("legion in activated abilities", () => {
    it.skip("should parse ':rb_exhaust:: [Legion] — The next unit you play this turn enters ready.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Legion] — The next unit you play this turn enters ready. (Get the effect if you've played another card this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
          condition: expect.objectContaining({
            type: "legion",
          }),
        }),
      );
    });

    it.skip("should parse ':rb_exhaust:: [Reaction], [Legion] — [Add] :rb_energy_1:.'", () => {
      const result = parseAbilities(
        ":rb_exhaust:: [Reaction], [Legion] — [Add] :rb_energy_1:. (Abilities that add resources can't be reacted to. Get the effect if you've played a card this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "activated",
          timing: "reaction",
          condition: expect.objectContaining({
            type: "legion",
          }),
        }),
      );
    });
  });

  describe("legion in spell abilities", () => {
    it.skip("should parse '[Action] Choose a unit. Kill it the next time it takes damage this turn. [Legion] — Kill it now instead.'", () => {
      const result = parseAbilities(
        "[Action]_ (Play on your turn or in showdowns.)_Choose a unit. Kill it the next time it takes damage this turn.[Legion] — Kill it now instead. (Get the effect if you've played another card this turn.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities?.length).toBeGreaterThanOrEqual(1);
    });
  });
});
