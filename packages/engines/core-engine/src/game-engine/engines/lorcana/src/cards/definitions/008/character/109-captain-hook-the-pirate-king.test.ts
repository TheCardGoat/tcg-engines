import { describe, expect, it } from "bun:test";
import { elsaQueenRegent } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import {
  captainHookForcefulDuelist,
  captainHookThePirateKing,
  deweyLovableShowoff,
  hueyReliableLeader,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Captain Hook - The Pirate King", () => {
  it("SHIFT 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)", async () => {
    const testEngine = new TestEngine({
      inkwell: captainHookThePirateKing.cost,
      play: [captainHookForcefulDuelist],
      hand: [captainHookThePirateKing],
    });

    await testEngine.shiftCard({
      shifter: captainHookThePirateKing,
      shifted: captainHookForcefulDuelist,
    });
  });

  describe("GIVE 'EM ALL YOU GOT! Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn. (Damage dealt to them is reduced by 2.)", () => {
    it("should increase strength and grant resist to all Pirates when an opposing character is damaged", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: captainHookThePirateKing.cost,
          play: [
            captainHookThePirateKing,
            mrSmeeBumblingMate,
            deweyLovableShowoff,
          ],
        },
        {
          play: [elsaQueenRegent],
        },
      );

      const cardUnderTest = testEngine.getCardModel(captainHookThePirateKing);
      const otherPirate = testEngine.getCardModel(mrSmeeBumblingMate);
      const noPirate = testEngine.getCardModel(deweyLovableShowoff);
      const oppoCard = testEngine.getCardModel(elsaQueenRegent);

      testEngine.setCardDamage(oppoCard, 1);

      expect(cardUnderTest.strength).toEqual(
        captainHookThePirateKing.strength + 2,
      );
      expect(otherPirate.strength).toEqual(mrSmeeBumblingMate.strength + 2);
      expect(noPirate.strength).toEqual(deweyLovableShowoff.strength);

      expect(cardUnderTest.hasResist).toEqual(true);
      expect(otherPirate.hasResist).toEqual(true);
      expect(noPirate.hasResist).toEqual(false);

      // Verify happens only once per turn
      testEngine.setCardDamage(oppoCard, 2);

      expect(cardUnderTest.strength).toEqual(
        captainHookThePirateKing.strength + 2,
      );
      expect(otherPirate.strength).toEqual(mrSmeeBumblingMate.strength + 2);
      expect(noPirate.strength).toEqual(deweyLovableShowoff.strength);
    });

    it("should not increase strength during an opposing player's turn", async () => {
      const testEngine = new TestEngine(
        {
          play: [elsaQueenRegent],
        },
        {
          play: [
            captainHookThePirateKing,
            mrSmeeBumblingMate,
            deweyLovableShowoff,
          ],
        },
      );

      const cardUnderTest = testEngine.getCardModel(captainHookThePirateKing);
      const otherPirate = testEngine.getCardModel(mrSmeeBumblingMate);
      const noPirate = testEngine.getCardModel(deweyLovableShowoff);
      const oppoCard = testEngine.getCardModel(elsaQueenRegent);

      testEngine.setCardDamage(oppoCard, 1);

      expect(cardUnderTest.strength).toEqual(captainHookThePirateKing.strength);
      expect(otherPirate.strength).toEqual(mrSmeeBumblingMate.strength);
      expect(noPirate.strength).toEqual(deweyLovableShowoff.strength);

      expect(cardUnderTest.hasResist).toEqual(false);
      expect(otherPirate.hasResist).toEqual(false);
      expect(noPirate.hasResist).toEqual(false);
    });

    it("challenging pirate should not gain resist before damage", async () => {
      const testEngine = new TestEngine(
        {
          play: [captainHookThePirateKing, mrSmeeBumblingMate],
        },
        {
          play: [hueyReliableLeader],
        },
      );

      const cardUnderTest = testEngine.getCardModel(mrSmeeBumblingMate);
      const oppoCard = testEngine.getCardModel(hueyReliableLeader);

      await testEngine.challenge({
        attacker: cardUnderTest,
        defender: oppoCard,
        exertDefender: true,
      });

      // Smee should have 2 damage after the challenge (not 0 as though resist applied)
      expect(cardUnderTest.damage).toEqual(2);
    });
  });
});
