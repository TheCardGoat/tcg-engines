import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { letTheStormRageOn } from "./199-let-the-storm-rage-on";

describe("Let the Storm Rage On", () => {
  it("deals 2 damage to the chosen character and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [letTheStormRageOn],
        inkwell: letTheStormRageOn.cost,
        deck: [simbaProtectiveCub],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(testEngine.asPlayerOne().playCardTo(letTheStormRageOn, goofyKnightForADay).success).toBe(
      true,
    );

    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: goofyKnightForADay, value: 2 });
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
  });
});
