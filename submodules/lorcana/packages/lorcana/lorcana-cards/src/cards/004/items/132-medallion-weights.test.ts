import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { medallionWeights } from "./132-medallion-weights";

const trainingCard = createMockCharacter({
  id: "medallion-weights-draw",
  name: "Training Card",
  cost: 1,
});

const trainedAttacker = createMockCharacter({
  id: "medallion-weights-attacker",
  name: "Trained Attacker",
  cost: 2,
  strength: 1,
  willpower: 6,
});

const challengeDummy = createMockCharacter({
  id: "medallion-weights-defender",
  name: "Challenge Dummy",
  cost: 2,
  strength: 1,
  willpower: 3,
});

const medallionWeights2 = { ...medallionWeights, id: "Tcn-2" as typeof medallionWeights.id };

describe("Medallion Weights", () => {
  it("gives the chosen character +2 strength and lets you draw when they challenge another character this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 2,
        deck: [trainingCard],
        play: [medallionWeights, trainedAttacker],
      },
      {
        deck: 1,
        play: [{ card: challengeDummy, exerted: true, isDrying: false }],
      },
    );

    const baseStrength = testEngine.asPlayerOne().getCardStrength(trainedAttacker);

    expect(
      testEngine.asPlayerOne().activateAbility(medallionWeights, {
        targets: [trainedAttacker],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(trainedAttacker)).toBe(baseStrength + 2);
    expect(
      testEngine.asPlayerOne().challenge(trainedAttacker, challengeDummy),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolveBag(bagEffect!.id)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerTwo().getCardZone(challengeDummy)).toBe("discard");
  });

  it("stacks: two Medallion Weights activations on the same character each fire a separate draw trigger", () => {
    // Regression for BUG-008: activating two Medallion Weights on the same character
    // should register two independent draw-on-challenge triggers, not just one.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 4,
        deck: 2,
        play: [medallionWeights, medallionWeights2, trainedAttacker],
      },
      {
        deck: 2,
        play: [{ card: challengeDummy, exerted: true, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(medallionWeights, { targets: [trainedAttacker] }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().activateAbility(medallionWeights2, { targets: [trainedAttacker] }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().challenge(trainedAttacker, challengeDummy),
    ).toBeSuccessfulCommand();

    // Both Medallion Weights fired: expect 2 bag effects queued
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

    testEngine.asPlayerOne().resolveAllBagEffects();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });
});
