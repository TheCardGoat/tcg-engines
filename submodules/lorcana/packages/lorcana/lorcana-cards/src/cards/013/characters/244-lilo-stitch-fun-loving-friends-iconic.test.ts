import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { liloStitchFunlovingFriendsIconic } from "./244-lilo-stitch-fun-loving-friends-iconic";

const stitchShiftBase = createMockCharacter({
  id: "lilo-stitch-iconic-shift-base",
  name: "Stitch",
  cost: 2,
});

describe("Lilo & Stitch - Fun-Loving Friends Iconic", () => {
  it("can shift onto a character named Stitch", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [liloStitchFunlovingFriendsIconic],
      play: [stitchShiftBase],
      inkwell: 3,
    });
    const shiftTarget = testEngine.findCardInstanceId(stitchShiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(liloStitchFunlovingFriendsIconic, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(liloStitchFunlovingFriendsIconic)).toBe("play");
  });

  it("has Resist +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [liloStitchFunlovingFriendsIconic],
    });

    expect(
      testEngine.asPlayerOne().getKeywordValue(liloStitchFunlovingFriendsIconic, "Resist"),
    ).toBe(1);
  });

  it("has Support", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [liloStitchFunlovingFriendsIconic],
    });

    expect(testEngine.asPlayerOne().hasKeyword(liloStitchFunlovingFriendsIconic, "Support")).toBe(
      true,
    );
  });
});
