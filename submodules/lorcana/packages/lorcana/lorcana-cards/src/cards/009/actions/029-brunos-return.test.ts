import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "../../001";
import { brunosReturn } from "./029-brunos-return";

describe("Bruno's Return", () => {
  it("returns a character from your discard and removes 2 damage from the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [brunosReturn],
      inkwell: brunosReturn.cost,
      discard: [simbaProtectiveCub],
      play: [{ card: arielOnHumanLegs, damage: 3 }],
    });

    expect(
      testEngine.asPlayerOne().playCard(brunosReturn, {
        targets: [simbaProtectiveCub, arielOnHumanLegs],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(1);
  });

  it("regression: both returns the character from discard AND removes damage (not just one)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [brunosReturn],
      inkwell: brunosReturn.cost,
      discard: [simbaProtectiveCub],
      play: [{ card: arielOnHumanLegs, damage: 2 }],
    });

    expect(
      testEngine.asPlayerOne().playCard(brunosReturn, {
        targets: [simbaProtectiveCub, arielOnHumanLegs],
      }),
    ).toBeSuccessfulCommand();

    // Both effects should resolve: character returned AND damage removed
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(0);
  });
});
