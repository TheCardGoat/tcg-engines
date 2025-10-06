/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  belleMechanicExtraordinaire,
  cybugInvasiveEnemy,
  honeyLemonChemistryWhiz,
  pepperQuickthinkingPuppy,
  robinHoodEyeForDetail,
  yzmaAboveItAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Yzma - Above It All", () => {
  it("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Yzma.)", async () => {
    const testEngine = new TestEngine({
      play: [yzmaAboveItAll],
    });

    const cardUnderTest = testEngine.getCardModel(yzmaAboveItAll);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [yzmaAboveItAll],
    });

    const cardUnderTest = testEngine.getCardModel(yzmaAboveItAll);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  describe("BACK TO WORK Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.", () => {
    it("Your character is banished", async () => {
      const testEngine = new TestEngine(
        {
          play: [yzmaAboveItAll, cybugInvasiveEnemy],
          hand: [
            pepperQuickthinkingPuppy,
            honeyLemonChemistryWhiz,
            robinHoodEyeForDetail,
          ],
        },
        {
          play: [belleMechanicExtraordinaire],
        },
      );

      await testEngine.challenge({
        attacker: cybugInvasiveEnemy,
        defender: belleMechanicExtraordinaire,
        exertDefender: true,
      });

      expect(testEngine.getCardModel(cybugInvasiveEnemy).zone).toBe("hand");
      expect(testEngine.getCardModel(pepperQuickthinkingPuppy).zone).toBe(
        "discard",
      );
    });

    it("Opponent's character is banished", async () => {
      const testEngine = new TestEngine(
        {
          play: [yzmaAboveItAll, belleMechanicExtraordinaire],
        },
        {
          play: [cybugInvasiveEnemy],
          hand: [
            pepperQuickthinkingPuppy,
            honeyLemonChemistryWhiz,
            robinHoodEyeForDetail,
          ],
        },
      );

      await testEngine.challenge({
        attacker: belleMechanicExtraordinaire,
        defender: cybugInvasiveEnemy,
        exertDefender: true,
      });

      expect(testEngine.getCardModel(cybugInvasiveEnemy).zone).toBe("hand");
      expect(testEngine.getCardModel(pepperQuickthinkingPuppy).zone).toBe(
        "discard",
      );
    });
  });
});
