import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { energyBlast } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Energy Blast", () => {
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
