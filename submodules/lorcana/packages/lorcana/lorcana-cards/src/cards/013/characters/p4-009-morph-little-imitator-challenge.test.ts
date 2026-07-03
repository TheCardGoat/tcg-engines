import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { theMadrigalFamilyEveryGeneration } from "./030-the-madrigal-family-every-generation";
import { morphLittleImitatorP4Challenge } from "./p4-009-morph-little-imitator-challenge";

describe("Morph - Little Imitator - Challenge", () => {
  it("can be used as the target for classification-based Shift", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theMadrigalFamilyEveryGeneration],
      play: [morphLittleImitatorP4Challenge],
      inkwell: 3,
    });

    const shiftTarget = testEngine.findCardInstanceId(morphLittleImitatorP4Challenge, "play");

    expect(
      testEngine.asPlayerOne().playCard(theMadrigalFamilyEveryGeneration, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theMadrigalFamilyEveryGeneration)).toBe("play");
  });
});
