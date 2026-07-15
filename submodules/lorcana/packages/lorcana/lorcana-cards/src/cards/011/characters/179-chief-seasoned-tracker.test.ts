import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { chiefSeasonedTracker } from "./179-chief-seasoned-tracker";

const weakOpponent = createMockCharacter({
  id: "chief-weak-opponent",
  name: "Weak Opponent",
  strength: 1,
  willpower: 1,
  cost: 1,
});

const chiefAttacker = createMockCharacter({
  id: "chief-attacker",
  name: "Chief Attacker",
  strength: 3,
  willpower: 3,
  cost: 2,
});

describe("Chief - Seasoned Tracker", () => {
  it("does not draw when no opposing character was banished in a challenge this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [chiefSeasonedTracker],
      deck: 5,
    });

    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

    const result = testEngine.asPlayerOne().activateAbility(chiefSeasonedTracker);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("ABILITY_CONDITION_NOT_MET");
    }

    const handAfter = testEngine.asPlayerOne().getZonesCardCount().hand;
    expect(handAfter).toBe(handBefore);
  });

  it("GOOD RIDDANCE - draws a card when an opposing character was banished in a challenge this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [chiefSeasonedTracker, chiefAttacker],
        deck: 5,
      },
      {
        play: [{ card: weakOpponent, exerted: true }],
      },
    );

    // Challenge to banish the weak opponent
    expect(testEngine.asPlayerOne().challenge(chiefAttacker, weakOpponent)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(weakOpponent)).toBe("discard");

    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

    // Now activate Chief - condition is met, should draw
    expect(testEngine.asPlayerOne().activateAbility(chiefSeasonedTracker)).toBeSuccessfulCommand();

    const handAfter = testEngine.asPlayerOne().getZonesCardCount().hand;
    expect(handAfter).toBe(handBefore + 1);
  });
});
