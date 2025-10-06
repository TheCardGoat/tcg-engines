/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { theCarpenterDinnerCompanion } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Carpenter - Dinner Companion", () => {
  it.skip("I'LL GET YOU! When this character is banished, you may exert chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: theCarpenterDinnerCompanion.cost,
      play: [theCarpenterDinnerCompanion],
      hand: [theCarpenterDinnerCompanion],
    });

    await testEngine.playCard(theCarpenterDinnerCompanion);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
