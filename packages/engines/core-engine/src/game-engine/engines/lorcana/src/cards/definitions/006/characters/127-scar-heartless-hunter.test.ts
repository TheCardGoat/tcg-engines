/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { scarHeartlessHunter } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scar - Heartless Hunter", () => {
  it.skip("BARED TEETH When you play this character, deal 2 damage to chosen character of yours to deal 2 damage to chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: scarHeartlessHunter.cost,
      hand: [scarHeartlessHunter],
    });

    await testEngine.playCard(scarHeartlessHunter);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
