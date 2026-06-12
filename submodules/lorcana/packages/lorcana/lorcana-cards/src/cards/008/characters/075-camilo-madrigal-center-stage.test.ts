import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { camiloMadrigalCenterStage } from "./075-camilo-madrigal-center-stage";

const challengeAttacker = createMockCharacter({
  id: "camilo-test-challenge-attacker",
  name: "Challenge Attacker",
  cost: 2,
  strength: 5,
  willpower: 5,
});

const challengeDefender = createMockCharacter({
  id: "camilo-test-challenge-defender",
  name: "Challenge Defender",
  cost: 2,
  strength: 5,
  willpower: 5,
});

describe("Camilo Madrigal - Center Stage", () => {
  it("does not return to hand when banished outside a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: camiloMadrigalCenterStage, isDrying: false }],
        deck: 5,
      },
      {
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().playCard(dragonFire, {
        targets: [camiloMadrigalCenterStage],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(camiloMadrigalCenterStage)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("returns to hand when banished while attacking in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: camiloMadrigalCenterStage, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: challengeDefender, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(camiloMadrigalCenterStage, challengeDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(camiloMadrigalCenterStage)).toBe("hand");
  });

  it("returns to hand when banished while defending in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: challengeAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: camiloMadrigalCenterStage, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(challengeAttacker, camiloMadrigalCenterStage),
    ).toBeSuccessfulCommand();
    if (testEngine.asPlayerTwo().getBagCount() > 0) {
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(camiloMadrigalCenterStage),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerTwo().getCardZone(camiloMadrigalCenterStage)).toBe("hand");
  });
});
