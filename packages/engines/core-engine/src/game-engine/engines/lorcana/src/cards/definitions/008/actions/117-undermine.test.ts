import { describe, expect, it } from "bun:test";
import {
  liloMakingAWish,
  mickeyMouseDetective,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { undermine } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Undermine", () => {
  it("Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.", async () => {
    const playerCharacter = liloMakingAWish;
    const opponentCharacter = mickeyMouseDetective;

    const testEngine = new TestEngine(
      {
        inkwell: undermine.cost,
        hand: [undermine],
        play: [playerCharacter],
      },
      {
        hand: 3, // Opponent has 3 cards in hand
        play: [opponentCharacter],
      },
    );

    // Verify initial state
    expect(testEngine.getZonesCardCount("player_two").hand).toBe(3);
    expect(testEngine.getZonesCardCount("player_two").discard).toBe(0);
    expect(testEngine.getCardModel(playerCharacter).strength).toBe(
      playerCharacter.strength,
    );

    // Play undermine
    await testEngine.playCard(undermine);

    // Resolve - opponent discards, character gets +2 strength
    await testEngine.resolveTopOfStack({ targets: [playerCharacter] });

    // Verify opponent discarded 1 card
    expect(testEngine.getZonesCardCount("player_two").hand).toBe(2);
    expect(testEngine.getZonesCardCount("player_two").discard).toBe(1);

    // Verify character strength increased
    expect(testEngine.getCardModel(playerCharacter).strength).toBe(
      playerCharacter.strength + 2,
    );
  });
});
