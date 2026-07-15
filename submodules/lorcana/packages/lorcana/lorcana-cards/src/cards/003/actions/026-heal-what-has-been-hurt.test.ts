import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { healWhatHasBeenHurt } from "./026-heal-what-has-been-hurt";

describe("Heal What Has Been Hurt", () => {
  it("removes up to 3 damage from the chosen character and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [healWhatHasBeenHurt],
      inkwell: healWhatHasBeenHurt.cost,
      play: [arielOnHumanLegs],
      deck: 1,
    });

    testEngine.asServer().manualSetDamage(arielOnHumanLegs, 3);

    const handBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;
    const playResult = testEngine.asPlayerOne().playCard(healWhatHasBeenHurt, {
      targets: [arielOnHumanLegs],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(0);
    expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(handBefore);
  });
});
