import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { pullTheLever } from "./080-pull-the-lever";
import { wrongLever } from "./116-wrong-lever";
import { wrongLeverEnchanted } from "./216-wrong-lever-enchanted";

describe("Wrong Lever! (Enchanted)", () => {
  it("enchanted version shares the same canonical id and abilities as the base", () => {
    expect(wrongLeverEnchanted.canonicalId).toBe(wrongLever.canonicalId);
    expect(wrongLeverEnchanted.abilities).toEqual(wrongLever.abilities);
  });

  it("returns the chosen character to hand in the first mode", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wrongLeverEnchanted],
        inkwell: wrongLeverEnchanted.cost,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardWithChoice(wrongLeverEnchanted, 0, {
        targets: [goofyKnightForADay],
      }).success,
    ).toBe(true);
    expect(testEngine.asPlayerTwo().getCardZone(goofyKnightForADay)).toBe("hand");
  });

  it("puts Pull the Lever! on the bottom of your deck before resolving the follow-up target selection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wrongLeverEnchanted],
        inkwell: wrongLeverEnchanted.cost,
        discard: [pullTheLever],
      },
      {
        play: [goofyKnightForADay],
        deck: [simbaProtectiveCub],
      },
    );
    const playerOne = testEngine.asPlayerOne();
    const goofyId = testEngine.findCardInstanceId(goofyKnightForADay, "play", "p2");

    expect(playerOne.playCardWithChoice(wrongLeverEnchanted, 1).success).toBe(true);
    expect(playerOne.resolveNextPending({ targets: [goofyId] }).success).toBe(true);

    expect(playerOne.getCardZone(pullTheLever)).toBe("deck");
  });
});
