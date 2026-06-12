import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { motherKnowsBest } from "./099-mother-knows-best";

describe("Mother Knows Best", () => {
  it("returns the chosen character to their player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [motherKnowsBest],
        inkwell: motherKnowsBest.cost,
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(motherKnowsBest, {
        targets: [arielOnHumanLegs],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(arielOnHumanLegs)).toBe("hand");
  });
});
