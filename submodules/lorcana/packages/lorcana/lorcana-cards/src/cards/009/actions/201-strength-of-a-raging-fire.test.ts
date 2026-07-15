import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { strengthOfARagingFire } from "./201-strength-of-a-raging-fire";
import { arielOnHumanLegs, jetsamUrsulasSpy } from "../../001";

describe("Strength of a Raging Fire", () => {
  it("Deal damage to chosen character equal to the number of characters you have in play.", () => {
    const cardsInPlay = [arielOnHumanLegs, jetsamUrsulasSpy];
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [strengthOfARagingFire],
      inkwell: strengthOfARagingFire.cost,
      play: cardsInPlay,
    });

    testEngine.asPlayerOne().playCard(strengthOfARagingFire, {
      targets: [arielOnHumanLegs],
    });

    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toEqual(cardsInPlay.length);
  });
});
