import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { oneAndOnly } from "./067-one-and-only";

const chosenTwin = createMockCharacter({
  id: "one-and-only-chosen-twin",
  name: "One and Only Twin",
  cost: 2,
});

const otherTwin = createMockCharacter({
  id: "one-and-only-other-twin",
  name: "One and Only Twin",
  cost: 3,
});

const unrelatedCharacter = createMockCharacter({
  id: "one-and-only-unrelated-character",
  name: "Different Character",
  cost: 2,
});

describe("One and Only", () => {
  it("banishes all other characters with the chosen character's name", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [oneAndOnly],
        inkwell: oneAndOnly.cost,
        play: [chosenTwin, unrelatedCharacter],
      },
      {
        play: [otherTwin],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(oneAndOnly, {
        targets: [chosenTwin],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(chosenTwin)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(otherTwin)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(unrelatedCharacter)).toBe("play");
  });
});
