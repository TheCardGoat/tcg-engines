import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { clawhauserDonutDetective } from "./175-clawhauser-donut-detective";

const defender = createMockCharacter({
  id: "clawhauser-test-defender",
  name: "Test Defender",
  cost: 2,
  strength: 2,
  willpower: 6,
});

describe("Clawhauser - Donut Detective", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [clawhauserDonutDetective],
    });

    expect(testEngine.hasKeyword(clawhauserDonutDetective, "Challenger")).toBe(true);
    expect(testEngine.getKeywordValue(clawhauserDonutDetective, "Challenger")).toBe(2);
  });

  it("adds 2 strength in the challenge preview", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [clawhauserDonutDetective],
      },
      {
        play: [{ card: defender, exerted: true }],
      },
    );

    const preview = testEngine.asPlayerOne().previewChallenge(clawhauserDonutDetective, defender);

    expect(preview?.attackerDamageDealt).toBe(7);
    expect(preview?.defenderDamageDealt).toBe(2);
  });
});
