import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { snowFort } from "./098-snow-fort";
import { liloBundledUp } from "../characters/195-lilo-bundled-up";
import { tipoGrowingSon } from "../../005/characters/157-tipo-growing-son";

const fortifiedAlly = createMockCharacter({
  id: "snow-fort-fortified-ally",
  name: "Fortified Ally",
  cost: 2,
  strength: 3,
  willpower: 5,
});

const opponentAttacker = createMockCharacter({
  id: "snow-fort-opponent-attacker",
  name: "Opponent Attacker",
  cost: 2,
  strength: 3,
  willpower: 5,
});

describe("Snow Fort", () => {
  describe("THE HIGH GROUND - Your characters get +1 {S}", () => {
    it("gives your characters +1 strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [snowFort, fortifiedAlly],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardStrength(fortifiedAlly)).toBe(4);
    });

    it("does not affect opponent characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [snowFort],
          deck: 2,
        },
        {
          play: [opponentAttacker],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerTwo().getCardStrength(opponentAttacker)).toBe(3);
    });
  });

  describe("BARRICADE - During opponents' turns, your characters gain Resist +1", () => {
    it("gives your characters Resist during opponents' turns", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [snowFort, fortifiedAlly],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(fortifiedAlly, "Resist")).toBe(false);
      expect(testEngine.asPlayerOne().getKeywordValue(fortifiedAlly, "Resist")).toBe(null);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(fortifiedAlly, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(fortifiedAlly, "Resist")).toBe(1);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(fortifiedAlly, "Resist")).toBe(false);
      expect(testEngine.asPlayerOne().getKeywordValue(fortifiedAlly, "Resist")).toBe(null);
    });

    it("reduces challenge damage by 1 during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          // fortifiedAlly: 3 STR (+1 from Snow Fort = 4), 5 WP
          play: [snowFort, { card: fortifiedAlly, exerted: true }],
        },
        {
          deck: 2,
          // opponentAttacker: 3 STR, 5 WP
          play: [opponentAttacker],
        },
      );

      // Pass player one's turn so it becomes opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges the exerted fortified ally
      // Attacker deals 3 damage, but Resist +1 reduces it to 2
      const result = testEngine.asPlayerTwo().challenge(opponentAttacker, fortifiedAlly);
      expect(result.success).toBe(true);

      // Fortified ally should take 2 damage (3 STR - 1 Resist = 2)
      expect(testEngine.asPlayerOne().getDamage(fortifiedAlly)).toBe(2);
      // Attacker should take 4 damage (3 base + 1 from Snow Fort's THE HIGH GROUND)
      expect(testEngine.asPlayerTwo().getDamage(opponentAttacker)).toBe(4);
    });

    it("regression: Resist reducing damage to 0 should not consume Lilo - Bundled Up damage prevention shield", () => {
      // Bug: Tipo - Growing Son (1 STR) challenging Lilo - Bundled Up with Snow Fort's Resist +1
      // would incorrectly consume Lilo's EXTRA LAYERS shield even though Resist already reduced
      // damage to 0. A follow-up challenge from Hades - Infernal Schemer would then banish her.
      // Expected: Resist +1 reduces 1 damage to 0, shield is NOT consumed (no damage to prevent).
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          // Player 1 has Snow Fort and Lilo - Bundled Up (exerted so she can be challenged)
          play: [snowFort, { card: liloBundledUp, exerted: true }],
          deck: 2,
        },
        {
          // Player 2 has Tipo (1 STR) and a second stronger attacker
          play: [
            { card: tipoGrowingSon, isDrying: false },
            { card: opponentAttacker, isDrying: false },
          ],
          deck: 2,
        },
      );

      // Pass to opponent's turn — Snow Fort grants Resist +1 and Lilo's shield is active
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Tipo (1 STR) challenges Lilo — Resist +1 reduces damage to 0
      expect(
        testEngine.asPlayerTwo().challenge(tipoGrowingSon, liloBundledUp),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(liloBundledUp)).toBe(0);

      // Second attacker (3 STR) challenges Lilo — shield should STILL be active since it
      // was not consumed by the first 0-damage hit. Resist +1 reduces 3 to 2, shield prevents that 2.
      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, liloBundledUp),
      ).toBeSuccessfulCommand();
      // Shield prevents the damage, so Lilo should still have 0 damage
      expect(testEngine.asPlayerOne().getDamage(liloBundledUp)).toBe(0);
    });

    it("does not reduce challenge damage during your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          // fortifiedAlly: 3 STR (+1 from Snow Fort = 4), 5 WP
          play: [snowFort, fortifiedAlly],
        },
        {
          deck: 2,
          play: [{ card: opponentAttacker, exerted: true }],
        },
      );

      // Player one challenges the exerted opponent attacker during their own turn
      // No Resist applies since it's player one's turn
      const result = testEngine.asPlayerOne().challenge(fortifiedAlly, opponentAttacker);
      expect(result.success).toBe(true);

      // Fortified ally should take full 3 damage (no Resist on own turn)
      expect(testEngine.asPlayerOne().getDamage(fortifiedAlly)).toBe(3);
      // Opponent attacker should take 4 damage (3 base + 1 from Snow Fort)
      expect(testEngine.asPlayerTwo().getDamage(opponentAttacker)).toBe(4);
    });
  });
});
