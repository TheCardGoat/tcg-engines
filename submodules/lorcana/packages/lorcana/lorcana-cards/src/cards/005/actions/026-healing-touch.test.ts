import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goofyKnightForADay } from "../../002";
import { healingTouch } from "./026-healing-touch";

describe("Healing Touch", () => {
  it("removes up to 4 damage from the chosen character and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [healingTouch],
      inkwell: healingTouch.cost,
      play: [{ card: goofyKnightForADay, damage: 5 }],
      deck: [simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCardTo(healingTouch, goofyKnightForADay).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: goofyKnightForADay, value: 1 });
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
  });

  it("draws a card even when there are no characters in play to heal", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [healingTouch],
      inkwell: healingTouch.cost,
      deck: [simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCard(healingTouch)).toBeSuccessfulCommand();

    // The remove-damage step has no valid targets, but the draw step should still execute
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
  });
});
