import { describe, expect, it } from "bun:test";
import { mcduckManorScroogesMansion } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations";
import {
  cinderellaMelodyWeaver,
  mulanEliteArcher,
  mulanInjuredSoldier,
  peteRottenGuy,
  plutoRescueDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mulan - Elite Archer", () => {
  it("**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Mulan.)_", () => {
    const testStore = new TestStore({
      play: [mulanEliteArcher],
    });

    const cardUnderTest = testStore.getCard(mulanEliteArcher);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("**STRAIGHT SHOOTER** When you play this character, if you used **Shift** to play her, she gets +3 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: mulanEliteArcher.cost,
      hand: [mulanEliteArcher],
      play: [mulanInjuredSoldier],
    });

    const shifter = testStore.getCard(mulanEliteArcher);
    const shifted = testStore.getCard(mulanInjuredSoldier);

    shifter.shift(shifted);

    expect(shifter.strength).toBe(mulanEliteArcher.strength + 3);
  });

  describe("**TRIPLE SHOT** During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.", () => {
    it("During your turn", async () => {
      const opponentsPlayCard = [
        cinderellaMelodyWeaver,
        plutoRescueDog,
        peteRottenGuy,
      ];
      const testEngine = new TestEngine(
        {
          inkwell: mulanEliteArcher.cost,
          play: [mulanEliteArcher],
        },
        {
          play: opponentsPlayCard,
        },
      );

      await testEngine.challenge({
        attacker: mulanEliteArcher,
        defender: cinderellaMelodyWeaver,
        exertDefender: true,
      });
      await testEngine.resolveTopOfStack(
        {
          targets: [plutoRescueDog, peteRottenGuy],
        },
        true,
      );

      opponentsPlayCard.forEach((target) => {
        expect(testEngine.getCardModel(target).damage).toBe(
          mulanEliteArcher.strength,
        );
      });
      expect(testEngine.stackLayers).toHaveLength(0);
    });

    it("During your turn, does NOT trigger on locations", async () => {
      const opponentsPlayCard = [
        mcduckManorScroogesMansion,
        plutoRescueDog,
        peteRottenGuy,
      ];
      const testEngine = new TestEngine(
        {
          inkwell: mulanEliteArcher.cost,
          play: [mulanEliteArcher],
        },
        {
          play: opponentsPlayCard,
        },
      );

      await testEngine.challenge({
        attacker: mulanEliteArcher,
        defender: mcduckManorScroogesMansion,
        exertDefender: true,
      });
      expect(testEngine.stackLayers).toHaveLength(0);
    });

    it("During opponent's turn", async () => {
      const testEngine = new TestEngine(
        {
          play: [cinderellaMelodyWeaver],
        },
        {
          play: [mulanEliteArcher],
        },
      );

      const cardUnderTest = testEngine.getCardModel(mulanEliteArcher);
      const attacker = testEngine.getCardModel(cinderellaMelodyWeaver);

      cardUnderTest.updateCardMeta({ exerted: true });

      await testEngine.challenge({ attacker, defender: cardUnderTest });
      expect(testEngine.stackLayers).toHaveLength(0);
    });
  });
});
