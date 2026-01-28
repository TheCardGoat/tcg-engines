/**
 * Parser tests for Reaction spells
 *
 * Tests for parsing [Reaction] spell abilities.
 */

import { describe, expect, it } from "bun:test";
import { parseAbilities } from "../../index";
import { Effects, Targets } from "../helpers";

describe("Spell: Reaction", () => {
  describe("draw spells", () => {
    it("should parse '[Reaction] Draw 3.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Draw 3.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          effect: expect.objectContaining({
            type: "draw",
            amount: 3,
          }),
        }),
      );
    });

    it.skip("should parse '[Reaction] Draw 1 for each of your [Mighty] units.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Draw 1 for each of your [Mighty] units. (A unit is Mighty while it has 5+ :rb_might:.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Reaction] If an enemy unit has died this turn, this costs :rb_energy_2: less. Draw 2.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)If an enemy unit has died this turn, this costs :rb_energy_2: less.Draw 2.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("might modification spells", () => {
    it.skip("should parse '[Reaction] Give a unit +2 :rb_might: this turn. Draw 1.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Give a unit +2 :rb_might: this turn. Draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Reaction] Give a unit +2 :rb_might: this turn and another unit -2 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Give a unit +2 :rb_might: this turn and another unit -2 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it("should parse '[Reaction] Give a unit -4 :rb_might: this turn, to a minimum of 1 :rb_might:.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Give a unit -4 :rb_might: this turn, to a minimum of 1 :rb_might:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          effect: expect.objectContaining({
            type: "modify-might",
            amount: -4,
            minimum: 1,
          }),
        }),
      );
    });

    it.skip("should parse '[Reaction] Give two friendly units each +2 :rb_might: this turn.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Give two friendly units each +2 :rb_might: this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Reaction] Give a friendly unit +1 :rb_might: this turn, then an additional +1 :rb_might: this turn if it is the only unit you control there.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Give a friendly unit +1 :rb_might: this turn, then an additional +1 :rb_might: this turn if it is the only unit you control there.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Reaction] Give a friendly unit at a battlefield +2 :rb_might: this turn for each enemy unit there.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Give a friendly unit at a battlefield +2 :rb_might: this turn for each enemy unit there.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("counter spells", () => {
    it("should parse '[Reaction] Counter a spell.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Counter a spell.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          effect: expect.objectContaining({
            type: "counter",
          }),
        }),
      );
    });

    it.skip("should parse '[Reaction] Counter a spell that costs no more than :rb_energy_4: and no more than :rb_rune_rainbow:.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Counter a spell that costs no more than :rb_energy_4: and no more than :rb_rune_rainbow:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Reaction] Counter an enemy spell or ability that chooses a friendly unit or gear.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Counter an enemy spell or ability that chooses a friendly unit or gear.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Reaction] Choose a friendly unit and a spell. Counter that spell and give that unit +:rb_might: equal to that spell's Energy cost this turn.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Choose a friendly unit and a spell. Counter that spell and give that unit +:rb_might: equal to that spell's Energy cost this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("damage spells", () => {
    it.skip("should parse '[Reaction] Deal 1 to all units at battlefields.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Deal 1 to all units at battlefields.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          effect: expect.objectContaining({
            type: "damage",
            amount: 1,
          }),
        }),
      );
    });

    it.skip("should parse '[Reaction] Deal 2 to all enemy units in combat.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Deal 2 to all enemy units in combat.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Reaction] Choose an enemy unit. Deal 6 to it unless its controller has you draw 2.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Choose an enemy unit. Deal 6 to it unless its controller has you draw 2.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("prevent damage spells", () => {
    it.skip("should parse '[Reaction] Choose a unit. The next time that unit would be dealt damage this turn, prevent it. Draw 1.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Choose a unit. The next time that unit would be dealt damage this turn, prevent it. Draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it("should parse '[Reaction] Prevent all spell and ability damage this turn.'", () => {
      const result = parseAbilities(
        "[Reaction]_ (Play any time, even before spells and abilities resolve.)_Prevent all spell and ability damage this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          effect: expect.objectContaining({
            type: "prevent-damage",
          }),
        }),
      );
    });
  });

  describe("movement spells", () => {
    it.skip("should parse '[Reaction] Move up to 2 friendly units to base.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Move up to 2 friendly units to base.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          effect: expect.objectContaining({
            type: "move",
          }),
        }),
      );
    });
  });

  describe("return to hand spells", () => {
    it.skip("should parse '[Reaction] Return a friendly unit to its owner's hand. Its owner channels 1 rune exhausted.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Return a friendly unit to its owner's hand. Its owner channels 1 rune exhausted.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });

    it.skip("should parse '[Reaction] Return a unit at a battlefield with 3 :rb_might: or less to its owner's hand.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Return a unit at a battlefield with 3 :rb_might: or less to its owner's hand.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("recall spells", () => {
    it.skip("should parse '[Reaction] Choose a friendly unit. The next time it dies this turn, recall it exhausted instead.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Choose a friendly unit. The next time it dies this turn, recall it exhausted instead. (Send it to base. This isn't a move.)",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("control spells", () => {
    it("should parse '[Reaction] Gain control of a spell. You may make new choices for it.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Gain control of a spell. You may make new choices for it.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
      expect(result.abilities?.[0]).toEqual(
        expect.objectContaining({
          type: "spell",
          timing: "reaction",
          effect: expect.objectContaining({
            type: "gain-control-of-spell",
            newChoices: true,
          }),
        }),
      );
    });
  });

  describe("equipment spells", () => {
    it.skip("should parse '[Reaction] Choose a unit and an Equipment with the same controller. Attach that Equipment to that unit or detach that Equipment from that unit. Draw 1.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Choose a unit and an Equipment with the same controller. Attach that Equipment to that unit or detach that Equipment from that unit. Draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("kill spells", () => {
    it.skip("should parse '[Reaction] Kill a friendly unit to give +:rb_might: equal to its Might to another friendly unit this turn. Draw 1.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Kill a friendly unit to give +:rb_might: equal to its Might to another friendly unit this turn. Draw 1.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("battlefield location spells", () => {
    it.skip("should parse '[Reaction] Choose a battlefield. Give friendly units there +1 :rb_might: this turn and enemy units there -1 :rb_might: this turn, to a minimum of 1 :rb_might:.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Choose a battlefield. Give friendly units there +1 :rb_might: this turn and enemy units there -1 :rb_might: this turn, to a minimum of 1 :rb_might:.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });

  describe("might comparison spells", () => {
    it.skip("should parse '[Reaction] Choose a friendly unit. If its Might is less than another friendly unit's, its Might becomes the Might of that friendly unit this turn.'", () => {
      const result = parseAbilities(
        "[Reaction] (Play any time, even before spells and abilities resolve.)Choose a friendly unit. If its Might is less than another friendly unit's, its Might becomes the Might of that friendly unit this turn.",
      );

      expect(result.success).toBe(true);
      expect(result.abilities).toHaveLength(1);
    });
  });
});
