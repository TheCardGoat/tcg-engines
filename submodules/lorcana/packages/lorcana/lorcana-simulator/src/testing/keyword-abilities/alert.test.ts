import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { crikeeGoodLuckCharm } from "@tcg/lorcana-cards/cards/010";
import {
  alertAttacker,
  bodyguardEvasiveDefender,
  evasiveDefender,
} from "../rules/section-08-test-utils";

describe("Alert - Cri-Kee, Good Luck Charm - Alert (This character can challenge as if they had Evasive.)", () => {
  it("Alert character can challenge an Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [crikeeGoodLuckCharm],
      },
      {
        play: [{ card: evasiveDefender, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(crikeeGoodLuckCharm, evasiveDefender),
    ).toBeSuccessfulCommand();
  });

  it("Alert does not grant Evasive -- a non-Evasive character can still challenge an Alert character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [stitchNewDog],
      },
      {
        play: [{ card: crikeeGoodLuckCharm, exerted: true }],
      },
    );

    expect(testEngine.asPlayerTwo().hasKeyword(crikeeGoodLuckCharm, "Evasive")).toBe(false);
    expect(
      testEngine.asPlayerOne().challenge(stitchNewDog, crikeeGoodLuckCharm),
    ).toBeSuccessfulCommand();
  });

  it("Alert character must still challenge a Bodyguard+Evasive character if one exists", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [crikeeGoodLuckCharm],
      },
      {
        play: [
          { card: bodyguardEvasiveDefender, exerted: true },
          { card: evasiveDefender, exerted: true },
        ],
      },
    );

    const result = testEngine
      .asPlayerOne()
      .challenge(crikeeGoodLuckCharm, evasiveDefender) as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("DEFENDER_BODYGUARD_RESTRICTION");
    expect(
      testEngine.asPlayerOne().challenge(crikeeGoodLuckCharm, bodyguardEvasiveDefender),
    ).toBeSuccessfulCommand();
  });

  it.todo("Alert character readies after challenging", () => {});

  it.todo("Alert character does not ready if banished during the challenge", () => {});
});
