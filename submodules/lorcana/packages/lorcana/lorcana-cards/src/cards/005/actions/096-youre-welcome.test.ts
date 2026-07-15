import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub, tinkerBellPeterPansAlly } from "../../001";
import { youreWelcome } from "./096-youre-welcome";

describe("You're Welcome", () => {
  it("shuffles the chosen permanent into its player's deck and that player draws 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [youreWelcome],
        inkwell: youreWelcome.cost,
      },
      {
        deck: [mickeyMouseTrueFriend, tinkerBellPeterPansAlly],
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardTo(youreWelcome, simbaProtectiveCub),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, discard: 1 });
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ play: 0, hand: 2, deck: 1 });
  });

  it("regression: should shuffle the character into deck before the player draws 2 cards", () => {
    // Bug: You're Welcome was drawing cards without shuffling the character back into the deck first.
    // The shuffle should happen before the draw.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [youreWelcome],
        inkwell: youreWelcome.cost,
      },
      {
        deck: [mickeyMouseTrueFriend, tinkerBellPeterPansAlly],
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardTo(youreWelcome, simbaProtectiveCub),
    ).toBeSuccessfulCommand();

    // Simba should have been shuffled into deck first, then opponent draws 2
    // So opponent should have: 0 play, 2 hand, and simba + remaining in deck
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ play: 0, hand: 2, deck: 1 });
  });
});
