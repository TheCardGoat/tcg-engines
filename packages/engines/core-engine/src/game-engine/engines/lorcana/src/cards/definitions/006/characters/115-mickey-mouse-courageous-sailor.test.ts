/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { mickeyMouseCourageousSailor } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mickey Mouse - Courageous Sailor", () => {
  it.skip("SOLID GROUND While this character is at a location, he gets +2 {S}.", async () => {
    const testEngine = new TestEngine({
      inkwell: mickeyMouseCourageousSailor.cost,
      play: [mickeyMouseCourageousSailor],
      hand: [mickeyMouseCourageousSailor],
    });

    await testEngine.playCard(mickeyMouseCourageousSailor);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
