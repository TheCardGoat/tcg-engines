import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { genieOnTheJob, stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { peterPanHighFlyer } from "@tcg/lorcana-cards/cards/010";
import { evasiveDefender, bodyguardEvasiveDefender } from "../rules/section-08-test-utils";

describe("Evasive - (Only characters with Evasive can challenge this character.)", () => {
  it("A character WITHOUT Evasive can't challenge an Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: stitchNewDog, isDrying: false }],
      },
      {
        play: [{ card: evasiveDefender, exerted: true }],
      },
    );

    const result = testEngine
      .asPlayerOne()
      .challenge(stitchNewDog, evasiveDefender) as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("DEFENDER_EVASIVE_RESTRICTION");
  });

  it("A character WITH Evasive CAN challenge an Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [genieOnTheJob],
      },
      {
        play: [{ card: evasiveDefender, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(genieOnTheJob, evasiveDefender),
    ).toBeSuccessfulCommand();
  });

  it("An Evasive character can be challenged by another Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [genieOnTheJob],
      },
      {
        play: [{ card: peterPanHighFlyer, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(genieOnTheJob, peterPanHighFlyer),
    ).toBeSuccessfulCommand();
  });

  it("A non-Evasive attacker with an Evasive Bodyguard present bypasses the Bodyguard to challenge a non-Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: stitchNewDog, isDrying: false }],
      },
      {
        play: [
          { card: bodyguardEvasiveDefender, exerted: true },
          { card: peterPanHighFlyer, exerted: true },
        ],
      },
    );

    // Stitch can't challenge bodyguardEvasiveDefender (has Evasive), so he can target peterPan
    // But peterPan also has Evasive... so Stitch can't challenge either.
    const result = testEngine
      .asPlayerOne()
      .challenge(stitchNewDog, peterPanHighFlyer) as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("DEFENDER_EVASIVE_RESTRICTION");
  });
});
