import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { televisionSet } from "./178-television-set";

const revealedPuppy = createMockCharacter({
  id: "television-set-puppy",
  name: "Revealed Puppy",
  cost: 2,
  classifications: ["Storyborn", "Puppy"],
});

const revealedMiss = createMockCharacter({
  id: "television-set-miss",
  name: "Revealed Miss",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const secondDeckCard = createMockCharacter({
  id: "television-set-second",
  name: "Second Deck Card",
  cost: 1,
});

describe.skip("Television Set", () => {
  it("may put the revealed Puppy character card into your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [revealedPuppy],
      inkwell: 1,
      play: [televisionSet],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(televisionSet, {
        ability: "IS IT ON YET?",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolveNextPending({ resolveOptional: true }).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCardZone(revealedPuppy)).toBe("hand");
    expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(0);
  });

  it("puts the revealed non-Puppy card on the bottom of your deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [secondDeckCard, revealedMiss],
      inkwell: 1,
      play: [televisionSet],
    });

    const topCardId = testEngine.findCardInstanceId(revealedMiss, "deck", PLAYER_ONE);
    const secondCardId = testEngine.findCardInstanceId(secondDeckCard, "deck", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().activateAbility(televisionSet, {
        ability: "IS IT ON YET?",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(revealedMiss)).toBe("deck");
    expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([
      secondCardId,
      topCardId,
    ]);
  });
});
