import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { improvise } from "./099-improvise";

describe("Improvise", () => {
  it("gives chosen character +1 strength this turn and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [improvise],
      inkwell: improvise.cost,
      deck: 2,
      play: [arielOnHumanLegs],
    });

    const strengthBefore = testEngine.asPlayerOne().getCardStrength(arielOnHumanLegs);
    const handBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;
    const playResult = testEngine.asPlayerOne().playCard(improvise, {
      targets: [arielOnHumanLegs],
    });
    expect(playResult).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(arielOnHumanLegs)).toEqual(strengthBefore + 1);
    expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(handBefore);
    testEngine.asServer().passTurn();
    expect(testEngine.asPlayerOne().getCardStrength(arielOnHumanLegs)).toEqual(strengthBefore);
  });
});
