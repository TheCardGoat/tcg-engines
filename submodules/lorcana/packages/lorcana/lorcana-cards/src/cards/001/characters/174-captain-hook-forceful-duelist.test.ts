import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { captainHookForcefulDuelist } from "./174-captain-hook-forceful-duelist";

// Defender with 3 willpower: Captain Hook (1 str + 2 challenger = 3) should exactly banish it
const threeWillpowerDefender = createMockCharacter({
  id: "hook-test-3wp-defender",
  name: "Three Willpower Defender",
  cost: 2,
  strength: 1,
  willpower: 3,
});

// Defender with 4 willpower: Captain Hook (effective 3 str) should NOT banish it
const fourWillpowerDefender = createMockCharacter({
  id: "hook-test-4wp-defender",
  name: "Four Willpower Defender",
  cost: 2,
  strength: 1,
  willpower: 4,
});

describe("Captain Hook - Forceful Duelist", () => {
  it("has the printed keyword abilities", () => {
    const keywords = (captainHookForcefulDuelist.abilities ?? [])
      .filter((ability) => ability.type === "keyword")
      .map((ability) =>
        ability.type === "keyword" && "value" in ability && typeof ability.value === "number"
          ? { keyword: ability.keyword, value: ability.value }
          : ability.type === "keyword"
            ? { keyword: ability.keyword }
            : null,
      )
      .filter((ability) => ability !== null);

    expect(keywords).toEqual([
      {
        keyword: "Challenger",
        value: 2,
      },
    ]);
  });

  it("has Challenger +2 keyword value projected by the engine", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [captainHookForcefulDuelist],
    });

    expect(testEngine.getKeywordValue(captainHookForcefulDuelist, "Challenger")).toBe(2);
  });

  it("deals 3 damage when challenging (1 base strength + 2 Challenger bonus)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [captainHookForcefulDuelist],
        deck: 1,
      },
      {
        play: [{ card: fourWillpowerDefender, exerted: true }],
        deck: 1,
      },
    );

    const preview = testEngine
      .asPlayerOne()
      .previewChallenge(captainHookForcefulDuelist, fourWillpowerDefender);

    // Base strength 1 + Challenger +2 = 3 damage dealt
    expect(preview?.attackerDamageDealt).toBe(3);
    // Defender has 4 willpower, so 3 damage is not lethal
    expect(preview?.defenderWouldBeBanished).toBe(false);
  });

  it("banishes a character with willpower equal to effective strength (3)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [captainHookForcefulDuelist],
        deck: 1,
      },
      {
        play: [{ card: threeWillpowerDefender, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(captainHookForcefulDuelist, threeWillpowerDefender),
    ).toBeSuccessfulCommand();

    // Defender should be banished (3 damage >= 3 willpower)
    expect(testEngine.asPlayerOne().getCardZone(threeWillpowerDefender)).toBe("discard");
  });

  it("does not get Challenger bonus when being challenged (defending)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: captainHookForcefulDuelist, exerted: true }],
        deck: 1,
      },
      {
        play: [fourWillpowerDefender],
        deck: 1,
      },
    );

    // Pass player one's turn so player two can act
    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

    const preview = testEngine
      .asPlayerTwo()
      .previewChallenge(fourWillpowerDefender, captainHookForcefulDuelist);

    // When Captain Hook is defending, no Challenger bonus: deals only 1 damage (base strength)
    expect(preview?.defenderDamageDealt).toBe(1);
  });
});
