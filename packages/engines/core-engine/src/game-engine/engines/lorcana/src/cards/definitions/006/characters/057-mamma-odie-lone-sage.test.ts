/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { mammaOdieLoneSage } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mamma Odie - Lone Sage", () => {
  it.skip("I HAVE TO DO EVERYTHING AROUND HERE Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.", async () => {
    const testEngine = new TestEngine({
      inkwell: mammaOdieLoneSage.cost,
      play: [mammaOdieLoneSage],
      hand: [mammaOdieLoneSage],
    });

    await testEngine.playCard(mammaOdieLoneSage);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
