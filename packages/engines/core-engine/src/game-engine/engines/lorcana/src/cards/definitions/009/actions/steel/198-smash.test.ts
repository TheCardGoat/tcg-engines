/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { smash } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Smash", () => {
  it.skip("Deal 3 damage to chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: smash.cost,
      play: [smash],
      hand: [smash],
    });

    await testEngine.playCard(smash);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
