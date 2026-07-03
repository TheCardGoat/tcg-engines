import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { todCopperBestOfFriends } from "./094-tod-copper-best-of-friends";

const todShiftBase = createMockCharacter({
  id: "tod-copper-best-friends-shift-base",
  name: "Tod",
  cost: 2,
});

const copperShiftBase = createMockCharacter({
  id: "tod-copper-best-friends-copper-shift-base",
  name: "Copper",
  cost: 2,
});

describe("Tod & Copper - Best of Friends", () => {
  it("can shift onto a character named Tod and has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [todCopperBestOfFriends],
      play: [todShiftBase],
      inkwell: 2,
    });
    const shiftTarget = testEngine.findCardInstanceId(todShiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(todCopperBestOfFriends, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(todCopperBestOfFriends)).toBe("play");
    expect(testEngine.asPlayerOne().hasKeyword(todCopperBestOfFriends, "Evasive")).toBe(true);
  });

  it("can shift onto a character named Copper", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [todCopperBestOfFriends],
      play: [copperShiftBase],
      inkwell: 2,
    });
    const shiftTarget = testEngine.findCardInstanceId(copperShiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(todCopperBestOfFriends, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(todCopperBestOfFriends)).toBe("play");
  });
});
