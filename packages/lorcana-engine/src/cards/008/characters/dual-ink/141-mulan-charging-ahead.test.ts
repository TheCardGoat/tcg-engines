/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liShangNewlyPromoted } from "@lorcanito/lorcana-engine/cards/007/characters/characters";
import { mulanChargingAhead } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
