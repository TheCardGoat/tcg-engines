import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { ursulaCreatedByTheVine } from "./026-ursula-created-by-the-vine";

const opposingCharacter = createMockCharacter({
  id: "ursula-created-by-the-vine-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 4,
});

describe("Ursula - Created by the Vine", () => {
  it("gives an opposing character -1 strength when one of your Floodborn characters quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: ursulaCreatedByTheVine, isDrying: false }],
      },
      {
        play: [opposingCharacter],
      },
    );

    expect(testEngine.asPlayerOne().quest(ursulaCreatedByTheVine)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(ursulaCreatedByTheVine, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
      opposingCharacter.strength - 1,
    );
  });
});
