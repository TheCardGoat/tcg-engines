/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { johnSilverShipsCook } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("John Silver - Ship's Cook", () => {
  it.skip("HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: johnSilverShipsCook.cost,
      hand: [johnSilverShipsCook],
    });

    await testEngine.playCard(johnSilverShipsCook);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
