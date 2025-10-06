/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { madamMimTrulyMarvelous } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Madam Mim - Truly Marvelous", () => {
  it.skip("OH, BAT GIZZARDS 2 {I}, Choose and discard a card - Gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: madamMimTrulyMarvelous.cost,
      play: [madamMimTrulyMarvelous],
      hand: [madamMimTrulyMarvelous],
    });

    await testEngine.playCard(madamMimTrulyMarvelous);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
