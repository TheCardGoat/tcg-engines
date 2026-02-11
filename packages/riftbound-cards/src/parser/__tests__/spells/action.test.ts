/**
 * Parser tests for Action spells
 *
 * Tests for parsing [Action] spell abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Targets } from "../helpers";

describe("Spell: Action", () => {
  describe("damage spells", () => {
    it.skip("should parse '[Action] Deal 3 to a unit at a battlefield.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Deal 3 to a unit at a battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 3,
            type: "damage",
          }),
          timing: "action",
          type: "spell",
        }),
      );
    });

    it.skip("should parse '[Action] Deal 3 to a unit at a battlefield. If this kills it, draw 1.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Deal 3 to a unit at a battlefield. If this kills it, draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Action] Deal 4 to a unit at a battlefield. Draw 1.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Deal 4 to a unit at a battlefield. Draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Action] Deal 6 to a unit at a battlefield.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Deal 6 to a unit at a battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 6,
            type: "damage",
          }),
          timing: "action",
          type: "spell",
        }),
      );
    });

    it.skip("should parse '[Action] Deal 8 to a unit.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Deal 8 to a unit.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Action] Pay any amount of :rb_rune_rainbow: to deal that much damage to all enemy units at a battlefield.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Pay any amount of :rb_rune_rainbow: to deal that much damage to all enemy units at a battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("kill spells", () => {
    it.skip("should parse '[Action] Kill a unit at a battlefield.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Kill a unit at a battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "kill",
          }),
          timing: "action",
          type: "spell",
        }),
      );
    });

    it.skip("should parse '[Action] Kill a unit at a battlefield with 2 :rb_might: or less.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Kill a unit at a battlefield with 2 :rb_might: or less. If it was an enemy unit, play a Gold gear token exhausted. If it was a friendly unit, play two Gold gear tokens exhausted.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Action] Kill all gear.'", () => {
      const result = parseAbilities("[Action] (Play on your turn or in showdowns.)Kill all gear.");

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Action] You may kill a gear. Draw 1.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)You may kill a gear. Draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("movement spells", () => {
    it.skip("should parse '[Action] Move a friendly unit and ready it.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Move a friendly unit and ready it.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          timing: "action",
          type: "spell",
        }),
      );
    });
  });

  describe("return to hand spells", () => {
    it.skip("should parse '[Action] Return a gear to its owner's hand.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Return a gear to its owner's hand.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "return-to-hand",
          }),
          timing: "action",
          type: "spell",
        }),
      );
    });

    it.skip("should parse '[Action] Return a unit at a battlefield to its owner's hand.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Return a unit at a battlefield to its owner's hand.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Action] Return a unit from your trash to your hand.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Return a unit from your trash to your hand.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("buff and might modification spells", () => {
    it.skip("should parse '[Action] Give a unit +5 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Give a unit +5 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 5,
            type: "modify-might",
          }),
          timing: "action",
          type: "spell",
        }),
      );
    });

    it.skip("should parse '[Action] Give a unit +7 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Give a unit +7 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Action] Give friendly units +2 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Give friendly units +2 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Action] Give friendly units +5 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Give friendly units +5 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Action] Double a friendly unit's Might this turn. Give it [Temporary].'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Double a friendly unit's Might this turn. Give it [Temporary]. (Kill it at the start of its controller's Beginning Phase, before scoring.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("stun spells", () => {
    it.skip("should parse '[Action] Stun a unit.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Stun a unit._ (It doesn't deal combat damage this turn.)_",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "stun",
          }),
          timing: "action",
          type: "spell",
        }),
      );
    });

    it.skip("should parse '[Action] Stun an enemy unit at a battlefield. You may move a friendly unit to that enemy unit's battlefield.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Stun an enemy unit at a battlefield. You may move a friendly unit to that enemy unit's battlefield._ (A stunned unit doesn't deal combat damage this turn.)_",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("token creation spells", () => {
    it.skip("should parse '[Action] Play four 1 :rb_might: Recruit unit tokens.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Play four 1 :rb_might: Recruit unit tokens. (They can be played to your base or to battlefields you control.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            amount: 4,
            type: "create-token",
          }),
          timing: "action",
          type: "spell",
        }),
      );
    });
  });

  describe("draw and look spells", () => {
    it.skip("should parse '[Action] Look at the top 3 cards of your Main Deck. Put 1 into your hand and recycle the rest.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Look at the top 3 cards of your Main Deck. Put 1 into your hand and recycle the rest.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "look",
          }),
          timing: "action",
          type: "spell",
        }),
      );
    });

    it.skip("should parse '[Action] Units you play this turn enter ready. Draw 1.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Units you play this turn enter ready. Draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("fight spells", () => {
    it.skip("should parse '[Action] Choose a friendly unit and an enemy unit. They deal damage equal to their Mights to each other.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Choose a friendly unit and an enemy unit. They deal damage equal to their Mights to each other.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "fight",
          }),
          timing: "action",
          type: "spell",
        }),
      );
    });

    it.skip("should parse '[Action] Give a friendly unit +3 :rb_might: this turn. Then choose an enemy unit. They deal damage equal to their Mights to each other.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Give a friendly unit +3 :rb_might: this turn. Then choose an enemy unit. They deal damage equal to their Mights to each other.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("ready spells", () => {
    it.skip("should parse '[Action] Ready a unit.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)As you play this, you may spend a buff as an additional cost. If you do, ignore this spell's cost.Ready a unit.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Action] Ready a friendly unit. It deals damage equal to its Might to an enemy unit at a battlefield.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Ready a friendly unit. It deals damage equal to its Might to an enemy unit at a battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("take control spells", () => {
    it.skip("should parse '[Action] Choose an enemy unit at a battlefield. Take control of it and recall it.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Choose an enemy unit at a battlefield. Take control of it and recall it. (Send it to your base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          effect: expect.objectContaining({
            type: "sequence",
          }),
          timing: "action",
          type: "spell",
        }),
      );
    });
  });

  describe("banish spells", () => {
    it.skip("should parse '[Action] Banish a friendly unit, then its owner plays it to their base, ignoring its cost.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)Banish a friendly unit, then its owner plays it to their base, ignoring its cost.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("cost reduction spells", () => {
    it.skip("should parse '[Action] I cost :rb_energy_2: less to play from anywhere other than your hand. Kill a unit at a battlefield.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)I cost :rb_energy_2: less to play from anywhere other than your hand.Kill a unit at a battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Action] This spell's Energy cost is reduced by the highest Might among units you control. Deal 5 to a unit at a battlefield.'", () => {
      const result = parseAbilities(
        "[Action] (Play on your turn or in showdowns.)This spell's Energy cost is reduced by the highest Might among units you control.Deal 5 to a unit at a battlefield.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
