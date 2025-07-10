/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { lumiereNimbleCandelabra } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
