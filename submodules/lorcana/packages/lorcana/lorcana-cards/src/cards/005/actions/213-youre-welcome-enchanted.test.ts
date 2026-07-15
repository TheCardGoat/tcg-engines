import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub, tinkerBellPeterPansAlly } from "../../001";
import { youreWelcome } from "./096-youre-welcome";
import { youreWelcomeEnchanted } from "./213-youre-welcome-enchanted";

describe("You're Welcome (Enchanted)", () => {
  it("shuffles the chosen permanent into its player's deck and that player draws 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [youreWelcomeEnchanted],
        inkwell: youreWelcomeEnchanted.cost,
      },
      {
        deck: [mickeyMouseTrueFriend, tinkerBellPeterPansAlly],
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardTo(youreWelcomeEnchanted, simbaProtectiveCub),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, discard: 1 });
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ play: 0, hand: 2, deck: 1 });
  });

  it("shares the same canonical id and abilities as the base card", () => {
    expect(youreWelcomeEnchanted.canonicalId).toBe(youreWelcome.canonicalId);
    expect(youreWelcomeEnchanted.abilities).toEqual(youreWelcome.abilities);
  });
});
