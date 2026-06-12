import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { pocahontasPeacekeeperIconic } from "./241-pocahontas-peacekeeper-iconic";

const pocahontasBase = createMockCharacter({
  id: "pocahontas-peacekeeper-iconic-base-241",
  name: "Pocahontas",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const attacker = createMockCharacter({
  id: "pocahontas-peacekeeper-iconic-attacker-241",
  name: "Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const defender = createMockCharacter({
  id: "pocahontas-peacekeeper-iconic-defender-241",
  name: "Defender",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
});

describe("Pocahontas - Peacekeeper (Iconic)", () => {
  it("has Shift 3 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pocahontasPeacekeeperIconic],
      deck: 1,
    });

    expect(testEngine.hasKeyword(pocahontasPeacekeeperIconic, "Shift")).toBe(true);
  });

  describe("CALMING WORDS", () => {
    it("prevents all characters from challenging until start of your next turn when played with Shift and no challenges happened this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: pocahontasPeacekeeperIconic.cost,
          hand: [pocahontasPeacekeeperIconic],
          play: [pocahontasBase, { card: attacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 5,
        },
      );

      const shiftTarget = testEngine.findCardInstanceId(pocahontasBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(pocahontasPeacekeeperIconic, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      // Player one's attacker should not be able to challenge
      expect(testEngine.asPlayerOne().canChallenge(attacker, defender)).toBe(false);

      // After passing turn and coming back, the restriction should be lifted
      // P1 passes → P2's turn (turn 2, restriction still active)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      // P2 passes → P1's turn (turn 3, restriction expired at start of P1's turn)
      // Re-exert defender so P1 can challenge it on their turn
      expect(testEngine.asServer().manualExertCard(defender)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Now player one can challenge (restriction lifted at start of their turn)
      expect(testEngine.asPlayerOne().canChallenge(attacker, defender)).toBe(true);
    });

    it("does NOT prevent challenging when played without Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: pocahontasPeacekeeperIconic.cost,
          hand: [pocahontasPeacekeeperIconic],
          play: [{ card: attacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(pocahontasPeacekeeperIconic),
      ).toBeSuccessfulCommand();

      // Should still be able to challenge - condition not met (no shift used)
      expect(testEngine.asPlayerOne().canChallenge(attacker, defender)).toBe(true);
    });

    it("does NOT prevent challenging when a character already challenged this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: pocahontasPeacekeeperIconic.cost,
          hand: [pocahontasPeacekeeperIconic],
          play: [pocahontasBase, { card: attacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 1,
        },
      );

      // First, challenge with the attacker
      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      const shiftTarget = testEngine.findCardInstanceId(pocahontasBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(pocahontasPeacekeeperIconic, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      // The CALMING WORDS condition requires none of YOUR characters challenged this turn.
      // Since attacker already challenged, condition is false, so no restriction is applied.
      // Player one should still be able to challenge again (attacker is exerted so won't, but no global restriction)
      // We verify by passing turn - player two should be able to challenge on their turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().canChallenge(defender, attacker)).toBe(true);
    });

    it("also prevents opponent characters from challenging when Shift condition is met", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: pocahontasPeacekeeperIconic.cost,
          hand: [pocahontasPeacekeeperIconic],
          play: [pocahontasBase],
          deck: 1,
        },
        {
          play: [{ card: attacker, isDrying: false }],
          deck: 1,
        },
      );

      const shiftTarget = testEngine.findCardInstanceId(pocahontasBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(pocahontasPeacekeeperIconic, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player TWO's attacker should also be restricted from challenging
      expect(testEngine.asPlayerTwo().canChallenge(attacker, pocahontasPeacekeeperIconic)).toBe(
        false,
      );
    });
  });
});
