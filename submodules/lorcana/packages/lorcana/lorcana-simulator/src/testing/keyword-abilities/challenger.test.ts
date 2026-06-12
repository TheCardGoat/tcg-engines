import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { daisyDuckDonaldsDate } from "@tcg/lorcana-cards/cards/005";
import { challengerAttacker } from "../rules/section-08-test-utils";

describe("Challenger - Challenger +N (While challenging, this character gets +N Strength.)", () => {
  it("Challenger adds strength only while this character is challenging", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [challengerAttacker],
      },
      {
        play: [{ card: daisyDuckDonaldsDate, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(challengerAttacker, daisyDuckDonaldsDate).success,
    ).toBe(true);

    // Attacker has Challenger +2, so damage dealt = base strength + 2
    expect(testEngine.asPlayerTwo().getDamage(daisyDuckDonaldsDate)).toBe(
      challengerAttacker.strength + 2,
    );
    expect(testEngine.asPlayerOne().getDamage(challengerAttacker)).toBe(
      daisyDuckDonaldsDate.strength,
    );
  });

  it("Challenger doesn't apply while this character is being challenged (defending)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [stitchNewDog],
      },
      {
        play: [{ card: challengerAttacker, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().challenge(stitchNewDog, challengerAttacker).success).toBe(true);

    // Challenger defender takes normal damage from attacker
    expect(testEngine.asPlayerOne().getDamage(challengerAttacker)).toBe(stitchNewDog.strength);
    // Attacker takes only base strength from Challenger defender (no bonus)
    expect(testEngine.asPlayerOne().getDamage(stitchNewDog)).toBe(challengerAttacker.strength);
    expect(testEngine.asPlayerOne().getCardZone(challengerAttacker)).toBe("play");
  });
});
