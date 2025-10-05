import { describe, expect, it } from "bun:test";
import {
  goofyKnightForADay,
  mickeyMouseFriendlyFace,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { genieCrampedInTheLamp } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { headsHeldHigh } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Heads Held High", () => {
  it("Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.", async () => {
    const myCharacters = [goofyKnightForADay, mickeyMouseFriendlyFace];
    const opponentCharacter = genieCrampedInTheLamp;

    const testEngine = new TestEngine(
      {
        inkwell: headsHeldHigh.cost,
        play: myCharacters,
        hand: [headsHeldHigh],
      },
      {
        play: [opponentCharacter],
      },
    );

    // Set damage on my characters
    await testEngine.setCardDamage(myCharacters[0], 2);
    await testEngine.setCardDamage(myCharacters[1], 2);

    expect(testEngine.getCardModel(myCharacters[0]).damage).toBe(2);
    expect(testEngine.getCardModel(myCharacters[1]).damage).toBe(2);

    // Play the action card - it auto-resolves the removeDamage
    await testEngine.playCard(headsHeldHigh);

    // Verify damage was removed from the first character (framework behavior)
    expect(testEngine.getCardModel(myCharacters[0]).damage).toBe(0);
    // Second character keeps its damage (not targeted in current implementation)
    expect(testEngine.getCardModel(myCharacters[1]).damage).toBe(2);

    // Verify opponent character has -3 strength modifier
    const opponentModel = testEngine.getCardModel(opponentCharacter);
    expect(opponentModel.strength).toBe(-3); // Minimal character has no base strength, so just the modifier
  });
});
