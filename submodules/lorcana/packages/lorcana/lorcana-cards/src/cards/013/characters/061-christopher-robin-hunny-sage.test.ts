import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bigBookOfHunny } from "../items/174-big-book-of-hunny";
import { christopherRobinHunnySage } from "./061-christopher-robin-hunny-sage";

const hunnyCharacter = createMockCharacter({
  id: "christopher-robin-hunny-sage-hunny-character",
  name: "Hunny Friend",
  cost: 1,
  classifications: ["Storyborn", "Hunny"],
});

const nonHunnyCharacter = createMockCharacter({
  id: "christopher-robin-hunny-sage-non-hunny-character",
  name: "Non Hunny Friend",
  cost: 1,
});

describe("Christopher Robin - Hunny Sage", () => {
  it("searches the deck for a Hunny card and puts it into hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [christopherRobinHunnySage],
      inkwell: christopherRobinHunnySage.cost,
      deck: [nonHunnyCharacter, hunnyCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(christopherRobinHunnySage)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(christopherRobinHunnySage, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(hunnyCharacter)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(nonHunnyCharacter)).toBe("deck");
  });

  it("can search for a non-character Hunny card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [christopherRobinHunnySage],
      inkwell: christopherRobinHunnySage.cost,
      deck: [nonHunnyCharacter, bigBookOfHunny],
    });

    expect(testEngine.asPlayerOne().playCard(christopherRobinHunnySage)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(christopherRobinHunnySage, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bigBookOfHunny)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(nonHunnyCharacter)).toBe("deck");
  });
});
