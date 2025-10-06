/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { lumiereNimbleCandelabra } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lumiere - Nimble Candelabra", () => {
  it("QUICK-STEP While you have an item card in your discard, this character gains Evasive. (Only characters with Evasive can challenge them.)", async () => {
    const testEngine = new TestEngine({
      inkwell: lumiereNimbleCandelabra.cost,
      play: [lumiereNimbleCandelabra],
      discard: [pawpsicle],
    });

    const cardUnderTest = testEngine.getCardModel(lumiereNimbleCandelabra);

    expect(cardUnderTest.hasEvasive).toEqual(true);
  });
});
