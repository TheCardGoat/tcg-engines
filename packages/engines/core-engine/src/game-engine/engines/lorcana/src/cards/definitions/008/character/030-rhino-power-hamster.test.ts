import { describe, expect, it } from "bun:test";
import { agustinMadrigalClumsyDad } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { vanellopeVonSchweetzSugarRushChamp } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import { rhinoPowerHamster } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rhino - Power Hamster", () => {
  it("Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Rhino.)", async () => {
    const testEngine = new TestEngine({
      play: [rhinoPowerHamster],
    });

    const cardUnderTest = testEngine.getCardModel(rhinoPowerHamster);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("EPIC BALL OF AWESOME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)", async () => {
    const testEngine = new TestEngine({
      inkwell: rhinoPowerHamster.cost,
      play: [rhinoPowerHamster],
      hand: [],
    });

    expect(testEngine.getCardModel(rhinoPowerHamster).hasResist).toBe(true);
  });

  it("EPIC BALL OF AWESOME While this character has damage, he does not have resist", async () => {
    const testEngine = new TestEngine({
      inkwell: rhinoPowerHamster.cost,
      play: [rhinoPowerHamster],
      hand: [],
    });

    const cardUnderTest = testEngine.getCardModel(rhinoPowerHamster);
    testEngine.setCardDamage(cardUnderTest, 1);

    expect(testEngine.getCardModel(rhinoPowerHamster).hasResist).toBe(false);
  });

  it("EPIC BALL OF AWESOME While this character has damage, he does not have resist", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: rhinoPowerHamster.cost,
        play: [rhinoPowerHamster],
        hand: [],
      },
      {
        play: [vanellopeVonSchweetzSugarRushChamp, agustinMadrigalClumsyDad],
      },
    );

    const cardUnderTest = testEngine.getCardModel(rhinoPowerHamster);
    const oppoChar1 = testEngine.getCardModel(
      vanellopeVonSchweetzSugarRushChamp,
    );
    const oppoChar2 = testEngine.getCardModel(agustinMadrigalClumsyDad);
    // testEngine.setCardDamage(cardUnderTest, 1);

    expect(cardUnderTest.hasResist).toBe(true);
    cardUnderTest.exert();

    testEngine.passTurn();

    testEngine.challenge({
      attacker: oppoChar1,
      defender: cardUnderTest,
    });

    expect(cardUnderTest.hasResist).toBe(true);
    expect(cardUnderTest.damage).toBe(0);

    testEngine.challenge({
      attacker: oppoChar2,
      defender: cardUnderTest,
    });

    expect(cardUnderTest.hasResist).toBe(true);
    expect(cardUnderTest.damage).toBe(0);
  });
});
