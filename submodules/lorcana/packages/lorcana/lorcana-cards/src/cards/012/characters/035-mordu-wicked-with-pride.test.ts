import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { morduWickedWithPride } from "./035-mordu-wicked-with-pride";

const opponentCharacter = createMockCharacter({
  id: "mordu-opponent-char",
  name: "Opponent Character",
  strength: 2,
  willpower: 2,
  cost: 2,
});

describe("Mor'du - Wicked with Pride", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [morduWickedWithPride],
    });

    const cardUnderTest = testEngine.getCardModel(morduWickedWithPride);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should be able to challenge the turn it's played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [morduWickedWithPride],
        inkwell: morduWickedWithPride.cost,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(morduWickedWithPride)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(morduWickedWithPride, opponentCharacter),
    ).toBeSuccessfulCommand();
  });
});
