/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { mrSmeeSteadfastMate } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mr. Smee - Steadfast Mate", () => {
  it.skip("GOOD CATCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
    const testEngine = new TestEngine({
      inkwell: mrSmeeSteadfastMate.cost,
      play: [mrSmeeSteadfastMate],
      hand: [mrSmeeSteadfastMate],
    });

    await testEngine.playCard(mrSmeeSteadfastMate);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
