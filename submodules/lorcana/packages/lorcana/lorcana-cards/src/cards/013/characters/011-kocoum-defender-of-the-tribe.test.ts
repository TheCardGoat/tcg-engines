import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { kocoumDefenderOfTheTribe } from "./011-kocoum-defender-of-the-tribe";

describe("Kocoum - Defender of the Tribe", () => {
  it("has Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [kocoumDefenderOfTheTribe],
    });

    expect(testEngine.asPlayerOne().hasKeyword(kocoumDefenderOfTheTribe, "Bodyguard")).toBe(true);
  });
});
