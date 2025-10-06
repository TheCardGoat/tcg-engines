/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { mysticalTreeMamaOdiesHome } from "~/game-engine/engines/lorcana/src/cards/definitions/006/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mystical Tree - Mama Odie's Home", () => {
  it.skip("NOT BAD At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.", async () => {
    const testEngine = new TestEngine({
      inkwell: mysticalTreeMamaOdiesHome.cost,
      play: [mysticalTreeMamaOdiesHome],
      hand: [mysticalTreeMamaOdiesHome],
    });

    await testEngine.playCard(mysticalTreeMamaOdiesHome);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("HARD-EARNED WISDOM At the start of your turn, if you have a character named Mama Odie here, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: mysticalTreeMamaOdiesHome.cost,
      play: [mysticalTreeMamaOdiesHome],
      hand: [mysticalTreeMamaOdiesHome],
    });

    await testEngine.playCard(mysticalTreeMamaOdiesHome);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
