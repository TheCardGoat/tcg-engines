import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { thievery } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe.skip("Thievery", () => {
  it("Chosen opponent loses 1 lore. Gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [mickeyBraveLittleTailor],
      hand: [thievery],
    });

    await testEngine.playCard(thievery);
    await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });

    expect(testEngine.getPlayerLore("opponent")).toBe(0);
    expect(testEngine.getPlayerLore()).toBe(1);
  });
});
