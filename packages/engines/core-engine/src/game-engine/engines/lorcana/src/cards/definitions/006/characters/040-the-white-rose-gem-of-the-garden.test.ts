/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { theWhiteRoseGemOfTheGarden } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The White Rose - Gem of the Garden", () => {
  it.skip("THE BEAUTY OF THE WORLD When you play this character, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: theWhiteRoseGemOfTheGarden.cost,
      hand: [theWhiteRoseGemOfTheGarden],
    });

    await testEngine.playCard(theWhiteRoseGemOfTheGarden);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
