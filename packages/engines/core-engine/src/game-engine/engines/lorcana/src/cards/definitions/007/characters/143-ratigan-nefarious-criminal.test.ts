/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { ratiganNefariousCriminal } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ratigan - Nefarious Criminal", () => {
  it.skip("A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: ratiganNefariousCriminal.cost,
      play: [ratiganNefariousCriminal],
      hand: [ratiganNefariousCriminal],
    });

    await testEngine.playCard(ratiganNefariousCriminal);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
