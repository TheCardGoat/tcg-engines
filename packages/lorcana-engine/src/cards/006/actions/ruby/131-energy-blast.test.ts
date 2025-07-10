/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { energyBlast } from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe.skip("Energy Blast", () => {
  it("Banish chosen character. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [mickeyBraveLittleTailor],
      hand: [energyBlast],
    });

    await testEngine.playCard(energyBlast);
    await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });

    expect(testEngine.getCardModel(mickeyBraveLittleTailor).zone).toBe(
      "discard",
    );
    expect(testEngine.getZonesCardCount().hand).toBe(1);
  });
});
