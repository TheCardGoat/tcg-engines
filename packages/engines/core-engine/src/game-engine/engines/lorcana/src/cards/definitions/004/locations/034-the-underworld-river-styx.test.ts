/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { stichtNewDog } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { theUnderworldRiverStyx } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/locations";
import { stitchLittleTrickster } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Underworld - River Styx", () => {
  it("**SAVE A SOUL** Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: 3 + theUnderworldRiverStyx.moveCost,
      play: [theUnderworldRiverStyx, stitchLittleTrickster],
      discard: [stichtNewDog],
    });

    await testEngine.moveToLocation({
      character: stitchLittleTrickster,
      location: theUnderworldRiverStyx,
    });

    await testEngine.questCard(stitchLittleTrickster, {
      targets: [stichtNewDog],
    });

    expect(testEngine.getCardModel(stichtNewDog).zone).toEqual("hand");
    expect(testEngine.getAvailableInkwellCardCount()).toBe(0);
  });
});
