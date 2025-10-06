/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { frecklesGoodBoy } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Freckles - Good Boy", () => {
  it.skip("JUST SO CUTE! When you play this character, chosen opposing character gets -1 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: frecklesGoodBoy.cost,
      hand: [frecklesGoodBoy],
    });

    await testEngine.playCard(frecklesGoodBoy);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
