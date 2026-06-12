import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { daisyDuckPirateCaptain } from "./081-daisy-duck-pirate-captain";

const pirateQuester = createMockCharacter({
  id: "daisy-pirate-quester",
  name: "Pirate Quester",
  cost: 2,
  classifications: ["Storyborn", "Hero", "Pirate"],
});

const testLocation = createMockLocation({
  id: "daisy-test-location",
  name: "Daisy Test Location",
  cost: 2,
});

const drawnCard = createMockCharacter({
  id: "daisy-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Daisy Duck - Pirate Captain", () => {
  it("Distant Shores - whenever one of your Pirate characters quests while at a location, draw a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [daisyDuckPirateCaptain, pirateQuester, testLocation],
      inkwell: testLocation.moveCost,
      deck: [drawnCard],
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(pirateQuester, testLocation).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().quest(pirateQuester).success).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0 }),
    );
  });

  it("does not trigger when the Pirate is not at a location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [daisyDuckPirateCaptain, pirateQuester, testLocation],
      inkwell: testLocation.moveCost,
      deck: [drawnCard],
    });

    expect(testEngine.asPlayerOne().quest(pirateQuester).success).toBe(true);

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 0, deck: 1 }),
    );
  });
});
