import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { liloStitchFunlovingFriends } from "./031-lilo-stitch-fun-loving-friends";

const liloShiftBase = createMockCharacter({
  id: "lilo-stitch-fun-loving-shift-base",
  name: "Lilo",
  cost: 2,
});

describe("Lilo & Stitch - Fun-Loving Friends", () => {
  it("can shift onto a character named Lilo", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [liloStitchFunlovingFriends],
      play: [liloShiftBase],
      inkwell: 3,
    });
    const shiftTarget = testEngine.findCardInstanceId(liloShiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(liloStitchFunlovingFriends, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(liloStitchFunlovingFriends)).toBe("play");
  });

  it("has Resist +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [liloStitchFunlovingFriends],
    });

    expect(testEngine.asPlayerOne().getKeywordValue(liloStitchFunlovingFriends, "Resist")).toBe(1);
  });

  it("has Support", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [liloStitchFunlovingFriends],
    });

    expect(testEngine.asPlayerOne().hasKeyword(liloStitchFunlovingFriends, "Support")).toBe(true);
  });
});
