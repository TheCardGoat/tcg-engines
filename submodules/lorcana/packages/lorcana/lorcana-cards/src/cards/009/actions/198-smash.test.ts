import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs } from "../../001";
import { smash } from "./198-smash";

describe("Smash", () => {
  it("deals 3 damage to a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [smash],
        inkwell: smash.cost,
      },
      {
        play: [arielOnHumanLegs],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(smash, {
        targets: [arielOnHumanLegs],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(3);
  });
});
