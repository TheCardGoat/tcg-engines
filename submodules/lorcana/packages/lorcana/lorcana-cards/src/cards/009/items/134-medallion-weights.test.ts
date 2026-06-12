import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { medallionWeights } from "./134-medallion-weights";

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
  willpower: 4,
});

const challengeDummy = createMockCharacter({
  id: "medallion-weights-defender",
  name: "Challenge Dummy",
  cost: 2,
  strength: 1,
  willpower: 3,
});

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
    expect(testEngine.asPlayerOne().resolvePendingByCard(trainedAttacker)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerTwo().getCardZone(challengeDummy)).toBe("discard");
  });

  it("activating two Medallion Weights on the same character grants two draw triggers when that character challenges", () => {
    // BUG-04: Both MW grant the same ability id ("draw-when-challenging").
    // The engine must not deduplicate them — 2 activations → 2 bag effects → 2 draws.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        // 4 ink: enough to pay the 2-ink cost of each Medallion Weights activation
        inkwell: 4,
        deck: [trainingCard, trainingCard],
        play: [medallionWeights, medallionWeights, trainedAttacker],
      },
      {
        deck: 1,
        play: [{ card: challengeDummy, exerted: true, isDrying: false }],
      },
    );

    // Identify the two Medallion Weights instance IDs so we can activate each one.
    const p1PlayZone = testEngine.asPlayerOne().getCardsInZone("play", PLAYER_ONE);
    const mwInstances = p1PlayZone.cards.filter(
      (card) => card.definitionId === medallionWeights.id,
    );
    expect(mwInstances.length).toBe(2);

    const [mw1, mw2] = mwInstances as [(typeof mwInstances)[0], (typeof mwInstances)[0]];

    // Activate the first Medallion Weights, targeting trainedAttacker
    expect(
      testEngine.asPlayerOne().activateAbility(mw1.id, {
        targets: [trainedAttacker],
      }),
    ).toBeSuccessfulCommand();

    // Activate the second Medallion Weights, targeting the same character
    expect(
      testEngine.asPlayerOne().activateAbility(mw2.id, {
        targets: [trainedAttacker],
      }),
    ).toBeSuccessfulCommand();

    // Both activations grant +2 strength each → total +4 over base
    const baseStrength = 1; // trainedAttacker has strength: 1
    expect(testEngine.asPlayerOne().getCardStrength(trainedAttacker)).toBe(baseStrength + 4);

    // Challenge — both "draw-when-challenging" triggers should fire
    expect(
      testEngine.asPlayerOne().challenge(trainedAttacker, challengeDummy),
    ).toBeSuccessfulCommand();

    // Should have exactly 2 bag effects — one per Medallion Weights activation
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

    // Resolve both draws by bag-effect ID to avoid ambiguity
    const bagEffects1 = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolveBag(bagEffects1[0]!.id, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    const bagEffects2 = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolveBag(bagEffects2[0]!.id, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    // Both draws resolved → hand should have 2 cards
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });
});
