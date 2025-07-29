import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { submitToMyWill } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Submit to My Will", () => {
  it("Each opponent discards all cards in their hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [mickeyBraveLittleTailor],
      hand: [submitToMyWill],
    });

    await testEngine.playCard(submitToMyWill);

    expect(testEngine.getZonesCardCount("opponent").hand).toBe(0);
  });
});
