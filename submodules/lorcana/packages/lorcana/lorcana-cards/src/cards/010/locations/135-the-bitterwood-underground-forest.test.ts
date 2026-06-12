import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theBitterwoodUndergroundForest } from "./135-the-bitterwood-underground-forest";

const mightyExplorer = createMockCharacter({
  id: "bitterwood-mighty-explorer",
  name: "Mighty Explorer",
  cost: 4,
  strength: 5,
});

const weakExplorer = createMockCharacter({
  id: "bitterwood-weak-explorer",
  name: "Weak Explorer",
  cost: 2,
  strength: 3,
});

const secondMightyExplorer = createMockCharacter({
  id: "bitterwood-second-mighty-explorer",
  name: "Second Mighty Explorer",
  cost: 4,
  strength: 6,
});

describe("The Bitterwood - Underground Forest", () => {
  it("lets you draw a card the first time you move a 5+ strength character here during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [theBitterwoodUndergroundForest, mightyExplorer],
      inkwell: theBitterwoodUndergroundForest.moveCost,
      deck: 2,
    });

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(mightyExplorer, theBitterwoodUndergroundForest).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theBitterwoodUndergroundForest).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("does not trigger when moving a character with less than 5 strength here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [theBitterwoodUndergroundForest, weakExplorer],
      inkwell: theBitterwoodUndergroundForest.moveCost,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(weakExplorer, theBitterwoodUndergroundForest)
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });

  it("only triggers once per turn even when a second 5+ strength character is moved here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [theBitterwoodUndergroundForest, mightyExplorer, secondMightyExplorer],
      inkwell: theBitterwoodUndergroundForest.moveCost * 2,
      deck: 2,
    });

    // First move - should trigger
    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(mightyExplorer, theBitterwoodUndergroundForest).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theBitterwoodUndergroundForest).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);

    // Second move with another 5+ strength character - should NOT trigger again this turn
    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(secondMightyExplorer, theBitterwoodUndergroundForest).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});
