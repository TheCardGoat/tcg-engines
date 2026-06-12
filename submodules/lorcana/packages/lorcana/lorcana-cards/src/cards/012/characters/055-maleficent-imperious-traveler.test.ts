import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { maleficentImperiousTraveler } from "./055-maleficent-imperious-traveler";

const anotherCharacter = createMockCharacter({
  id: "maleficent-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const opposingCharacter = createMockCharacter({
  id: "maleficent-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Maleficent - Imperious Traveler", () => {
  it("HEED MY WORDS - exerts chosen opposing character when questing after playing another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [anotherCharacter],
        play: [maleficentImperiousTraveler],
        inkwell: 1,
        deck: 5,
      },
      {
        play: [opposingCharacter],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(maleficentImperiousTraveler)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(maleficentImperiousTraveler, {
        resolveOptional: true,
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
  });
});
