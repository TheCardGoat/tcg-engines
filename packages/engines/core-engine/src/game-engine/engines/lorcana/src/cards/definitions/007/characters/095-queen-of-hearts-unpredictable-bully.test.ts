import { describe, expect, it } from "bun:test";
import {
  drCalicoGreeneyedMan,
  queenOfHeartsUnpredictableBully,
  rayaGuidanceSeeker,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Queen Of Hearts - Unpredictable Bully", () => {
  it("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Queen of Hearts.)", async () => {
    const testEngine = new TestEngine({
      play: [queenOfHeartsUnpredictableBully],
    });

    const cardUnderTest = testEngine.getCardModel(
      queenOfHeartsUnpredictableBully,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("IF I LOSE MY TEMPER… Whenever another character is played, put a damage counter on them.", async () => {
    const testEngine = new TestEngine({
      inkwell:
        drCalicoGreeneyedMan.cost +
        queenOfHeartsUnpredictableBully.cost +
        rayaGuidanceSeeker.cost,
      hand: [
        drCalicoGreeneyedMan,
        queenOfHeartsUnpredictableBully,
        rayaGuidanceSeeker,
      ],
    });

    const cardUnderTest = testEngine.getCardModel(
      queenOfHeartsUnpredictableBully,
    );
    await testEngine.playCard(cardUnderTest);
    expect(cardUnderTest.damage).toBe(0);

    await testEngine.playCard(rayaGuidanceSeeker);
    expect(cardUnderTest.damage).toBe(0);
    expect(testEngine.getCardModel(rayaGuidanceSeeker).damage).toBe(1);

    await testEngine.playCard(drCalicoGreeneyedMan);
    expect(cardUnderTest.damage).toBe(0);
    expect(testEngine.getCardModel(rayaGuidanceSeeker).damage).toBe(1);
    expect(testEngine.getCardModel(drCalicoGreeneyedMan).damage).toBe(1);
  });
});
