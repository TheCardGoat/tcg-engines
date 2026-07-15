import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { judyHoppsSnowballPatrol } from "./194-judy-hopps-snowball-patrol";

const attacker = createMockCharacter({
  id: "judy-test-attacker",
  name: "Test Attacker",
  strength: 2,
  willpower: 5,
  cost: 2,
});

describe("Judy Hopps - Snowball Patrol", () => {
  it("should have Resist ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [judyHoppsSnowballPatrol],
    });

    const cardUnderTest = testEngine.getCardModel(judyHoppsSnowballPatrol);
    expect(cardUnderTest.hasResist).toBe(true);
    expect(cardUnderTest.damageReduction).toBe(1);
  });

  it("should reduce damage taken in a challenge by 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: judyHoppsSnowballPatrol, exerted: true }],
      },
      {
        play: [attacker],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(attacker, judyHoppsSnowballPatrol),
    ).toBeSuccessfulCommand();

    // Attacker has 2 strength, Resist +1 reduces to 1 damage
    expect(testEngine.asPlayerOne().getDamage(judyHoppsSnowballPatrol)).toBe(1);
  });

  describe("UNDERDOG", () => {
    it("costs 1 less on the first turn when not the first player", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 5 },
        {
          hand: [judyHoppsSnowballPatrol],
          inkwell: judyHoppsSnowballPatrol.cost - 1,
          deck: 5,
        },
      );

      testEngine.asPlayerOne().passTurn();

      const result = testEngine.asPlayerTwo().playCard(judyHoppsSnowballPatrol);
      expect(result.success).toBe(true);
      expect(testEngine.asPlayerTwo().getCardZone(judyHoppsSnowballPatrol)).toBe("play");
    });
  });
});
