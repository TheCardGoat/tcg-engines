/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { plasmaBlaster } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import {
  devilsEyeDiamond,
  mulanDisguisedSoldier,
  suzyMasterSeamstress,
  tobyDoggedCompanion,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Devil's Eye Diamond", () => {
  it("THE PRICE OF POWER {E} - If one of your characters was damaged this turn, gain 1 lore.", async () => {
    const testEngine = new TestEngine(
      {
        deck: 2,
        inkwell: 2,
        play: [devilsEyeDiamond, plasmaBlaster, suzyMasterSeamstress],
      },
      {
        deck: 2,
      },
    );
    expect(testEngine.getLoreForPlayer()).toBe(0);

    await testEngine.activateCard(plasmaBlaster, {
      targets: [suzyMasterSeamstress],
    });
    expect(testEngine.getCardModel(suzyMasterSeamstress).damage).toBe(1);

    await testEngine.activateCard(devilsEyeDiamond);
    expect(testEngine.getCardModel(devilsEyeDiamond).exerted).toBe(true);

    expect(testEngine.getLoreForPlayer()).toBe(1);

    await testEngine.passTurn();
    await testEngine.passTurn();

    // If damage was not taken during the turn, lore should not be gained
    expect(testEngine.getCardModel(devilsEyeDiamond).exerted).toBe(false);
    await testEngine.activateCard(devilsEyeDiamond);

    expect(testEngine.getLoreForPlayer()).toBe(1);
  });
});

describe("Regression", () => {
  it("Should be able to activate Devil's Eye Diamond when characters are banished by damage", async () => {
    const testEngine = new TestEngine(
      {
        deck: 2,
        inkwell: 2,
        play: [devilsEyeDiamond, mulanDisguisedSoldier],
      },
      {
        play: [tobyDoggedCompanion],
        deck: 2,
      },
    );

    await testEngine.challenge({
      attacker: mulanDisguisedSoldier,
      defender: tobyDoggedCompanion,
      exertDefender: true,
    });

    await testEngine.activateCard(devilsEyeDiamond);
    expect(testEngine.getCardModel(devilsEyeDiamond).exerted).toBe(true);
    expect(testEngine.getLoreForPlayer()).toBe(1);
  });
});
