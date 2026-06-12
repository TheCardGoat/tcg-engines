import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gyroGearlooseEccentricInventor } from "./123-gyro-gearloose-eccentric-inventor";

const nonEvasiveAttacker = createMockCharacter({
  id: "gyro-gearloose-eccentric-inventor-non-evasive",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "gyro-gearloose-eccentric-inventor-evasive",
  name: "Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "gyro-gearloose-eccentric-inventor-evasive-kw",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

const opposingCharacter = createMockCharacter({
  id: "gyro-gearloose-eccentric-inventor-opponent",
  name: "Opponent Character",
  cost: 4,
  strength: 5,
  willpower: 5,
});

describe("Gyro Gearloose - Eccentric Inventor", () => {
  it("cannot be challenged by non-Evasive characters, but can be challenged by Evasive ones", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: gyroGearlooseEccentricInventor, exerted: true }],
        deck: 1,
      },
      {
        play: [nonEvasiveAttacker, evasiveAttacker],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, gyroGearlooseEccentricInventor),
    ).toBe(false);
    expect(
      testEngine.asPlayerTwo().canChallenge(evasiveAttacker, gyroGearlooseEccentricInventor),
    ).toBe(true);
  });

  it("reduces the chosen opposing character's strength by 3 until end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [gyroGearlooseEccentricInventor],
        inkwell: gyroGearlooseEccentricInventor.cost,
      },
      {
        play: [opposingCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(gyroGearlooseEccentricInventor),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(gyroGearlooseEccentricInventor, { targets: [opposingCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
      opposingCharacter.strength - 3,
    );
    expect(testEngine.asPlayerOne().getCardStrength(gyroGearlooseEccentricInventor)).toBe(
      gyroGearlooseEccentricInventor.strength,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
      opposingCharacter.strength,
    );
  });
});
