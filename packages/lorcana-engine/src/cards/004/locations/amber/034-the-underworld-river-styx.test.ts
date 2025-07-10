/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { stichtNewDog } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { theUnderworldRiverStyx } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
import { stitchLittleTrickster } from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
