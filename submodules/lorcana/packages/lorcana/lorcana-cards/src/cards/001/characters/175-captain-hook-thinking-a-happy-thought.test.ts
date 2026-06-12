import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { captainHookThinkingAHappyThought } from "./175-captain-hook-thinking-a-happy-thought";
import { captainHookForcefulDuelist } from "./174-captain-hook-forceful-duelist";
import { moanaOfMotunui } from "./014-moana-of-motunui";

const cheapAttacker = createMockCharacter({
  id: "cheap-attacker-cost-3",
  name: "Cheap Attacker",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const expensiveAttacker = createMockCharacter({
  id: "expensive-attacker-cost-4",
  name: "Expensive Attacker",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Captain Hook - Thinking a Happy Thought", () => {
  describe("STOLEN DUST: Characters with cost 3 or less can't challenge this character.", () => {
    it("Characters with cost 3 or less can't challenge THIS character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: cheapAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: captainHookThinkingAHappyThought, exerted: true }],
          deck: 1,
        },
      );

      const result = testEngine
        .asPlayerOne()
        .challenge(cheapAttacker, captainHookThinkingAHappyThought);

      // Challenge should be rejected - cheap attacker can't challenge Captain Hook
      expect(result).not.toBeSuccessfulCommand();
    });

    it("Characters with cost 3 or less can challenge OTHER characters", () => {
      const otherDefender = createMockCharacter({
        id: "other-defender",
        name: "Other Defender",
        cost: 2,
        strength: 1,
        willpower: 6,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: cheapAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: captainHookThinkingAHappyThought, exerted: false },
            { card: otherDefender, exerted: true },
          ],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(cheapAttacker, otherDefender);

      // Challenge should succeed - cheap attacker CAN challenge other characters
      expect(result).toBeSuccessfulCommand();
    });

    it("Characters with cost 4 or more can challenge this character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: expensiveAttacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: captainHookThinkingAHappyThought, exerted: true }],
          deck: 1,
        },
      );

      const result = testEngine
        .asPlayerOne()
        .challenge(expensiveAttacker, captainHookThinkingAHappyThought);

      // Challenge should succeed - expensive attacker CAN challenge Captain Hook
      expect(result).toBeSuccessfulCommand();
    });
  });

  it("Challenger +3: While challenging, this character gets +3 strength", () => {
    const weakDefender = createMockCharacter({
      id: "weak-defender",
      name: "Weak Defender",
      cost: 1,
      strength: 1,
      willpower: 10,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: weakDefender, exerted: true }],
        deck: 1,
      },
      {
        play: [{ card: captainHookThinkingAHappyThought, isDrying: false }],
        deck: 1,
      },
    );

    // Pass turn so player_two gets priority
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    const result = testEngine
      .asPlayerTwo()
      .challenge(captainHookThinkingAHappyThought, weakDefender);
    expect(result).toBeSuccessfulCommand();

    // Captain Hook has 2 strength + 3 Challenger bonus = 5 damage dealt to defender
    const defenderCard = testEngine.getCard(weakDefender);
    expect(defenderCard.damage).toBe(5);
  });

  it("Shift 3: Can be played on top of Captain Hook for 3 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [captainHookThinkingAHappyThought],
      play: [{ card: captainHookForcefulDuelist, isDrying: false }],
      inkwell: 3,
      deck: 1,
    });

    const shiftTarget = testEngine.findCardInstanceId(captainHookForcefulDuelist, "play");

    const result = testEngine.asPlayerOne().playCard(captainHookThinkingAHappyThought, {
      cost: { cost: "shift", shiftTarget },
    });

    expect(result).toBeSuccessfulCommand();

    // Captain Hook should be in play after shifting
    const hookCard = testEngine.getCard(captainHookThinkingAHappyThought);
    expect(hookCard.zone).toBe("play");
  });
});
