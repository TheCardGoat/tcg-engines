import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { trainingGroundsImpossiblePillar } from "./136-training-grounds-impossible-pillar";

const pillarStudent = createMockCharacter({
  id: "pillar-student",
  name: "Pillar Student",
  cost: 2,
  strength: 2,
});

const otherCharacter = createMockCharacter({
  id: "other-character",
  name: "Other Character",
  cost: 2,
  strength: 3,
});

describe("Training Grounds - Impossible Pillar", () => {
  it("spends 1 ink to give a character here +1 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        trainingGroundsImpossiblePillar,
        { card: pillarStudent, atLocation: trainingGroundsImpossiblePillar },
      ],
      inkwell: 1,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(trainingGroundsImpossiblePillar, {
        targets: [pillarStudent],
      }).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCard(pillarStudent)?.strength).toBe(
      pillarStudent.strength + 1,
    );
  });

  it("cannot target a character that is not at this location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        trainingGroundsImpossiblePillar,
        { card: pillarStudent, atLocation: trainingGroundsImpossiblePillar },
        otherCharacter,
      ],
      inkwell: 1,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(trainingGroundsImpossiblePillar, {
        targets: [otherCharacter],
      }).success,
    ).toBe(false);
    expect(testEngine.asPlayerOne().getCard(otherCharacter)?.strength).toBe(
      otherCharacter.strength,
    );
  });

  it("the buff is temporary and does not persist beyond the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        trainingGroundsImpossiblePillar,
        { card: pillarStudent, atLocation: trainingGroundsImpossiblePillar },
      ],
      inkwell: 1,
    });

    testEngine.asPlayerOne().activateAbility(trainingGroundsImpossiblePillar, {
      targets: [pillarStudent],
    });
    expect(testEngine.asPlayerOne().getCard(pillarStudent)?.strength).toBe(
      pillarStudent.strength + 1,
    );

    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    expect(testEngine.asPlayerOne().getCard(pillarStudent)?.strength).toBe(pillarStudent.strength);
  });
});
