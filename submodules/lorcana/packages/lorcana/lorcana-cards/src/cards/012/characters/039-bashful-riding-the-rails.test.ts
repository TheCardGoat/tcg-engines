import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bashfulRidingTheRails } from "./039-bashful-riding-the-rails";

const nonEvasiveAttacker = createMockCharacter({
  id: "bashful-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "bashful-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
  abilities: [{ type: "keyword", keyword: "Evasive", text: "Evasive" }],
});

describe("Bashful - Riding the Rails", () => {
  it("cannot be challenged by a character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: nonEvasiveAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: bashfulRidingTheRails, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(nonEvasiveAttacker, bashfulRidingTheRails),
    ).not.toBeSuccessfulCommand();
  });

  it("can be challenged by a character with Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: evasiveAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: bashfulRidingTheRails, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(evasiveAttacker, bashfulRidingTheRails),
    ).toBeSuccessfulCommand();
  });

  it("quests for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: bashfulRidingTheRails, isDrying: false }],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(bashfulRidingTheRails)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
  });
});
