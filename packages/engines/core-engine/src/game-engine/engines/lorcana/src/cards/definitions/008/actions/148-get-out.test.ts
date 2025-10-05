import { describe, expect, it } from "bun:test";
import { mickeyMouseDetective } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";
import { getOut } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Get Out!", () => {
  it("Banish chosen character, then return an item card from your discard to your hand.", async () => {
    const opponentCharacter = mickeyMouseDetective;

    const testEngine = new TestEngine(
      {
        inkwell: getOut.cost,
        hand: [getOut],
        discard: [dingleHopper],
      },
      {
        play: [opponentCharacter],
      },
    );

    // Verify initial state
    expect(testEngine.getZonesCardCount("player_one").discard).toBe(1);
    expect(testEngine.getZonesCardCount("player_two").play).toBe(1);
    expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);

    // Play the card
    await testEngine.playCard(getOut);

    // First effect: banish chosen character
    await testEngine.resolveTopOfStack({ targets: [opponentCharacter] });

    // Verify character banished
    expect(testEngine.getZonesCardCount("player_two").play).toBe(0);
    expect(testEngine.getZonesCardCount("player_two").discard).toBe(1);

    // Verify item returned to hand (followedBy effect should auto-resolve)
    // Note: Get Out! card itself is also in discard after being played
    expect(testEngine.getZonesCardCount("player_one").discard).toBe(1); // Just Get Out!
    expect(testEngine.getZonesCardCount("player_one").hand).toBe(1); // Dinglehopper
    expect(testEngine.getCardModel(dingleHopper).zone).toBe("hand");
  });
});
