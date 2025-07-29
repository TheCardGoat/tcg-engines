import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { helpingHand } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Helping Hand", () => {
  it("Chosen character gains Support this turn. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: helpingHand.cost,
      play: [mickeyBraveLittleTailor],
      hand: [helpingHand],
    });

    await testEngine.playCard(helpingHand);
    await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });

    expect(testEngine.getZonesCardCount().hand).toBe(1);
  });
});
