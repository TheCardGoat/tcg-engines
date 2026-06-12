import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fredGiantsized } from "./098-fred-giant-sized";

const nonFloodbornTopCard = createMockCharacter({
  id: "fred-giant-sized-non-floodborn-top",
  name: "Non-Floodborn Top Card",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const floodbornHit = createMockCharacter({
  id: "fred-giant-sized-floodborn-hit",
  name: "Floodborn Hit",
  cost: 5,
  classifications: ["Floodborn", "Hero"],
});

const deeperDeckCard = createMockCharacter({
  id: "fred-giant-sized-deeper-card",
  name: "Deeper Deck Card",
  cost: 4,
  classifications: ["Dreamborn", "Ally"],
});

describe("Fred - Giant-Sized", () => {
  it("puts the first revealed Floodborn character into your hand when he quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: fredGiantsized, isDrying: false }],
      deck: [deeperDeckCard, floodbornHit, nonFloodbornTopCard],
    });

    expect(testEngine.asPlayerOne().quest(fredGiantsized)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().getCardZone(floodbornHit)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(nonFloodbornTopCard)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(deeperDeckCard)).toBe("deck");
  });
});
