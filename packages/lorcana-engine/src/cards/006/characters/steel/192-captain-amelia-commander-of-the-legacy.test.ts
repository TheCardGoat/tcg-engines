/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  captainAmeliaCommanderOfTheLegacy,
  chipRangerLeader,
  honeyLemonChemicalGenius,
  jafarPowerhungryVizier,
  jimHawkinsHonorablePirate,
} from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Captain Amelia - Commander of the Legacy", () => {
  it("DRIVELING GALOOTS This character can't be challenged by Pirate characters.", async () => {
    const testEngine = new TestEngine(
      {
        play: [captainAmeliaCommanderOfTheLegacy],
      },
      {
        play: [jimHawkinsHonorablePirate, honeyLemonChemicalGenius],
      },
    );

    const pirate = testEngine.getCardModel(jimHawkinsHonorablePirate);
    const nonPirate = testEngine.getCardModel(honeyLemonChemicalGenius);
    const cardUnderTest = testEngine.getCardModel(
      captainAmeliaCommanderOfTheLegacy,
    );

    await testEngine.tapCard(captainAmeliaCommanderOfTheLegacy);

    expect(nonPirate.canChallenge(cardUnderTest)).toBe(true);
    expect(cardUnderTest.canBeChallenged(nonPirate)).toBe(true);

    expect(pirate.canChallenge(cardUnderTest)).toBe(false);
    expect(cardUnderTest.canBeChallenged(pirate)).toBe(false);
  });

  it("EVERYTHING SHIPSHAPE While being challenged, your other characters gain Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine(
      {
        play: [chipRangerLeader],
      },
      {
        play: [captainAmeliaCommanderOfTheLegacy, jafarPowerhungryVizier],
      },
    );

    const challenged = await testEngine.tapCard(jafarPowerhungryVizier);

    expect(challenged.hasResist).toBe(false);

    await testEngine.challenge({
      attacker: chipRangerLeader,
      defender: jafarPowerhungryVizier,
    });

    expect(challenged.damage).toBe(chipRangerLeader.strength - 1);
  });
});
