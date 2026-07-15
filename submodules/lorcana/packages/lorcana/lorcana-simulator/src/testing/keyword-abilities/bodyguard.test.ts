import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  genieOnTheJob,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { ladyKluckProtectiveConfidant } from "@tcg/lorcana-cards/cards/007";
import { herculesBelovedHero } from "@tcg/lorcana-cards/cards/009";
import { bodyguardEvasiveDefender, evasiveDefender } from "../rules/section-08-test-utils";

describe("Bodyguard - Simba, Protective Cub - Bodyguard (This character may enter play exerted. An opposing character who challenges must challenge this character if able.)", () => {
  it("Bodyguard may enter play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simbaProtectiveCub],
        inkwell: [mickeyMouseTrueFriend, stitchNewDog],
      },
      {},
    );

    expect(
      testEngine.asPlayerOne().playCardOptional(simbaProtectiveCub, true),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(true);
  });

  it("Bodyguard may still enter play ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [simbaProtectiveCub],
        inkwell: [mickeyMouseTrueFriend, stitchNewDog],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(simbaProtectiveCub)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(false);
  });

  it("Opponents must challenge a Bodyguard character if able", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: stitchNewDog, isDrying: false }],
      },
      {
        play: [
          { card: simbaProtectiveCub, exerted: true },
          { card: mickeyMouseTrueFriend, exerted: true },
        ],
      },
    );

    const result = testEngine
      .asPlayerOne()
      .challenge(stitchNewDog, mickeyMouseTrueFriend) as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("DEFENDER_BODYGUARD_RESTRICTION");
  });

  it("If more than one Bodyguard can be challenged, the attacker may choose among them", () => {
    const firstChoiceEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: stitchNewDog, isDrying: false }],
      },
      {
        play: [
          { card: simbaProtectiveCub, exerted: true },
          { card: ladyKluckProtectiveConfidant, exerted: true },
          { card: mickeyMouseTrueFriend, exerted: true },
        ],
      },
    );

    expect(
      firstChoiceEngine.asPlayerOne().challenge(stitchNewDog, simbaProtectiveCub),
    ).toBeSuccessfulCommand();

    const secondChoiceEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: stitchNewDog, isDrying: false }],
      },
      {
        play: [
          { card: simbaProtectiveCub, exerted: true },
          { card: ladyKluckProtectiveConfidant, exerted: true },
          { card: mickeyMouseTrueFriend, exerted: true },
        ],
      },
    );

    expect(
      secondChoiceEngine.asPlayerOne().challenge(stitchNewDog, ladyKluckProtectiveConfidant),
    ).toBeSuccessfulCommand();
  });

  it("If no Bodyguard character can be challenged (Bodyguard has Evasive), attacker may challenge another", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: stitchNewDog, isDrying: false }],
      },
      {
        play: [
          { card: bodyguardEvasiveDefender, exerted: true },
          { card: mickeyMouseTrueFriend, exerted: true },
        ],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(stitchNewDog, mickeyMouseTrueFriend),
    ).toBeSuccessfulCommand();
  });

  it("An attacker with Evasive still must challenge a Bodyguard with Evasive if able", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [genieOnTheJob],
      },
      {
        play: [
          { card: bodyguardEvasiveDefender, exerted: true },
          { card: evasiveDefender, exerted: true },
        ],
      },
    );

    const restrictedResult = testEngine
      .asPlayerOne()
      .challenge(genieOnTheJob, evasiveDefender) as CommandFailure;

    expect(restrictedResult.success).toBe(false);
    expect(restrictedResult.errorCode).toBe("DEFENDER_BODYGUARD_RESTRICTION");
    expect(
      testEngine.asPlayerOne().challenge(genieOnTheJob, bodyguardEvasiveDefender),
    ).toBeSuccessfulCommand();
  });
});

describe("Bodyguard + Resist - Hercules, Beloved Hero - Bodyguard, Resist +1", () => {
  it("Hercules takes reduced damage from challenges due to Resist", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: stitchNewDog, isDrying: false }],
      },
      {
        play: [{ card: herculesBelovedHero, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(stitchNewDog, herculesBelovedHero),
    ).toBeSuccessfulCommand();

    // Stitch has 2 strength, Hercules has Resist +1, so 1 damage dealt
    expect(testEngine.asPlayerTwo().getDamage(herculesBelovedHero)).toBe(stitchNewDog.strength - 1);
  });
});
