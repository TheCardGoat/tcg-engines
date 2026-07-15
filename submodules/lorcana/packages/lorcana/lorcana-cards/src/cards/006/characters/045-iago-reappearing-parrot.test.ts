import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { iagoReappearingParrot } from "./045-iago-reappearing-parrot";

const opponentCharacter = createMockCharacter({
  id: "iago-opponent-char",
  name: "Opponent Character",
  cost: 3,
  strength: 4,
  willpower: 5,
  lore: 1,
});

describe("Iago - Reappearing Parrot", () => {
  it("regression: returns to hand when banished in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: iagoReappearingParrot, exerted: true, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: opponentCharacter, isDrying: false }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges Iago (strength 4 vs willpower 2 -> Iago is banished)
    expect(
      testEngine.asPlayerTwo().challenge(opponentCharacter, iagoReappearingParrot),
    ).toBeSuccessfulCommand();

    // Resolve any bag effects for GUESS WHO
    testEngine.asPlayerOne().resolveAllBagEffects({});

    // Iago should have returned to hand, not gone to discard
    expect(testEngine.asPlayerOne().getCardZone(iagoReappearingParrot)).toBe("hand");
  });
});
