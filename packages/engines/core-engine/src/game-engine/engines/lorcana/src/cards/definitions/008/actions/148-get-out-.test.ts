import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { shieldOfVirtue } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { getOut } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Get Out!", () => {
  it("Banish chosen character, then return an item card from your discard to your hand.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: getOut.cost,
        hand: [getOut],
        discard: [shieldOfVirtue],
      },
      {
        play: [mickeyBraveLittleTailor],
      },
    );

    await testEngine.playCard(
      getOut,
      {
        targets: [mickeyBraveLittleTailor],
      },
      true, // skipAssertion
    );

    // Second effect: return item from discard to hand
    await testEngine.resolveTopOfStack({
      targets: [shieldOfVirtue],
    });

    expect(testEngine.getZonesCardCount().hand).toBe(1); // Shield of Virtue returned to hand
    expect(testEngine.getZonesCardCount().discard).toBe(1); // Mickey Mouse banished to discard (Get Out! goes elsewhere?)
  });
});
