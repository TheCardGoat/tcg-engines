import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { juniorWoodchuckGuidebook } from "./066-junior-woodchuck-guidebook";

const firstClue = createMockCharacter({
  id: "junior-woodchuck-first-clue",
  name: "First Clue",
  cost: 1,
});

const secondClue = createMockCharacter({
  id: "junior-woodchuck-second-clue",
  name: "Second Clue",
  cost: 1,
});

describe("Junior Woodchuck Guidebook", () => {
  it("exerts, pays 1 ink, banishes itself, and draws 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [firstClue, secondClue],
      inkwell: 1,
      play: [juniorWoodchuckGuidebook],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(juniorWoodchuckGuidebook),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(juniorWoodchuckGuidebook)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(firstClue)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(secondClue)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });
});
