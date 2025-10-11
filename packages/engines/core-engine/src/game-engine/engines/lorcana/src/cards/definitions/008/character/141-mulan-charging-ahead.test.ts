import { describe, expect, it } from "bun:test";
import { liShangNewlyPromoted } from "~/game-engine/engines/lorcana/src/cards/definitions/007/characters";
import { mulanChargingAhead } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mulan - Charging Ahead", () => {
  it("Reckless (This character can’t quest and must challenge each turn if able.)", async () => {
    const testEngine = new TestEngine({
      play: [mulanChargingAhead],
    });

    const cardUnderTest = testEngine.getCardModel(mulanChargingAhead);
    expect(cardUnderTest.hasReckless).toBe(true);
  });

  it("BURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
    const testEngine = new TestEngine({
      play: [mulanChargingAhead],
    });

    const cardUnderTest = testEngine.getCardModel(mulanChargingAhead);
    expect(cardUnderTest.hasEvasive).toBe(true);

    await testEngine.passTurn();

    expect(cardUnderTest.hasEvasive).toBe(false);
  });

  it("LONG RANGE This character can challenge ready characters.", async () => {
    const testEngine = new TestEngine(
      {
        play: [mulanChargingAhead],
      },
      {
        play: [liShangNewlyPromoted],
      },
    );

    expect(
      testEngine.getCardModel(mulanChargingAhead).canChallengeReadyCharacters,
    ).toBe(true);
  });
});
