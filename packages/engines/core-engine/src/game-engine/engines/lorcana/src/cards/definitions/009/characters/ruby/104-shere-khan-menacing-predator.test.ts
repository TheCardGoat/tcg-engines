/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { shereKhanMenacingPredator } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Shere Khan - Menacing Predator", () => {
  it.skip("**DON'T INSULT MY INTELLIGENCE** Whenever one of your characters challenges another character, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: shereKhanMenacingPredator.cost,
      play: [shereKhanMenacingPredator],
      hand: [shereKhanMenacingPredator],
    });

    await testEngine.playCard(shereKhanMenacingPredator);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
