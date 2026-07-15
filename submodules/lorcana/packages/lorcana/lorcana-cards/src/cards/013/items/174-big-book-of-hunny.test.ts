import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { bigBookOfHunny } from "./174-big-book-of-hunny";

const hunnyPage = createMockCharacter({
  id: "big-book-of-hunny-page",
  name: "Hunny Page",
  cost: 1,
  classifications: ["Storyborn", "Hunny"],
});

const storyPage = createMockCharacter({
  id: "big-book-of-hunny-story-page",
  name: "Story Page",
  cost: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Big Book of Hunny", () => {
  it("reveals a Hunny card from the top of your deck and puts it into your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [hunnyPage],
      inkwell: 2,
      play: [bigBookOfHunny],
    });

    expect(testEngine.asPlayerOne().activateAbility(bigBookOfHunny)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(hunnyPage)).toBe("hand");
  });

  it("puts the top card on the bottom of your deck when it is not a Hunny card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [hunnyPage, storyPage],
      inkwell: 2,
      play: [bigBookOfHunny],
    });

    expect(testEngine.asPlayerOne().activateAbility(bigBookOfHunny)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 2 });
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      storyPage.id,
      hunnyPage.id,
    ]);
  });
});
