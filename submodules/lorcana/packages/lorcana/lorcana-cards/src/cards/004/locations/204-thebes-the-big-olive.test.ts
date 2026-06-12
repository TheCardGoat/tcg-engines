import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { thebesTheBigOlive } from "./204-thebes-the-big-olive";

const thebanChampion = createMockCharacter({
  id: "theban-champion",
  name: "Theban Champion",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const doomedInvader = createMockCharacter({
  id: "doomed-invader",
  name: "Doomed Invader",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("Thebes - The Big Olive", () => {
  it("gains 2 lore when a character here banishes another character in a challenge during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [thebesTheBigOlive, { card: thebanChampion, atLocation: thebesTheBigOlive }],
        deck: 1,
      },
      {
        play: [{ card: doomedInvader, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(thebanChampion, doomedInvader),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });
});
