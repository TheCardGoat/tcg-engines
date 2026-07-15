import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { luisaMadrigalMagicallyStrongOne } from "./047-luisa-madrigal-magically-strong-one";

const opponentCharacter = createMockCharacter({
  id: "luisa-test-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Luisa Madrigal - Magically Strong One", () => {
  it("has the Rush keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [luisaMadrigalMagicallyStrongOne],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(luisaMadrigalMagicallyStrongOne, "Rush")).toBe(true);
  });

  it("can challenge the turn it is played because of Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [luisaMadrigalMagicallyStrongOne],
        inkwell: luisaMadrigalMagicallyStrongOne.cost,
        deck: 2,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(luisaMadrigalMagicallyStrongOne),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().challenge(luisaMadrigalMagicallyStrongOne, opponentCharacter),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("discard");
  });
});
