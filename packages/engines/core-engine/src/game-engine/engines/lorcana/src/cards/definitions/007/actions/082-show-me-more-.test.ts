import { describe, expect, it } from "bun:test";
import { showMeMore } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Show Me More!", () => {
  it("Each player draws 3 cards", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: showMeMore.cost,
        hand: [showMeMore],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    await testEngine.playCard(showMeMore);

    expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
    expect(testEngine.getZonesCardCount("player_two").hand).toBe(3);
  });
});
