/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { owlIslandSecludedEntrance } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { jimHawkinsRiggerSpecialist } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jim Hawkins - Rigger Specialist", () => {
  it.skip("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jim Hawkins.)", async () => {
    const testEngine = new TestEngine({
      play: [jimHawkinsRiggerSpecialist],
    });

    const cardUnderTest = testEngine.getCardModel(jimHawkinsRiggerSpecialist);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("BATTLE STATION When you play this character, you may deal 1 damage to chosen character or location.", async () => {
    const testEngine = new TestEngine({
      inkwell: jimHawkinsRiggerSpecialist.cost,
      hand: [jimHawkinsRiggerSpecialist],
      play: [owlIslandSecludedEntrance],
    });

    await testEngine.playCard(jimHawkinsRiggerSpecialist);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
