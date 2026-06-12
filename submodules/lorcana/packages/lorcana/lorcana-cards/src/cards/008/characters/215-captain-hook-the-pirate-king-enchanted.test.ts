import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { captainHookThePirateKingEnchanted } from "./215-captain-hook-the-pirate-king-enchanted";

const pirateAlly = createMockCharacter({
  id: "hook-test-pirate-ally",
  name: "Pirate Ally",
  cost: 2,
  strength: 2,
  willpower: 4,
  classifications: ["Storyborn", "Ally", "Pirate"],
});

const nonPirateAlly = createMockCharacter({
  id: "hook-test-non-pirate-ally",
  name: "Non-Pirate Ally",
  cost: 2,
  strength: 2,
  willpower: 4,
  classifications: ["Storyborn", "Ally"],
});

const opposingDefenderOne = createMockCharacter({
  id: "hook-test-opposing-defender-one",
  name: "Opposing Defender One",
  cost: 2,
  strength: 1,
  willpower: 4,
});

const opposingDefenderTwo = createMockCharacter({
  id: "hook-test-opposing-defender-two",
  name: "Opposing Defender Two",
  cost: 2,
  strength: 1,
  willpower: 4,
});

describe("Captain Hook - The Pirate King", () => {
  it("GIVE 'EM ALL YOU GOT! grants +2 strength and Resist +2 to your Pirates once during your turn when an opposing character is damaged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: captainHookThePirateKingEnchanted, isDrying: false },
          { card: pirateAlly, isDrying: false },
          { card: nonPirateAlly, isDrying: false },
        ],
        deck: 5,
      },
      {
        play: [
          { card: opposingDefenderOne, exerted: true, isDrying: false },
          { card: opposingDefenderTwo, exerted: true, isDrying: false },
        ],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().getCard(captainHookThePirateKingEnchanted).strength).toBe(4);
    expect(testEngine.asPlayerOne().hasKeyword(captainHookThePirateKingEnchanted, "Resist")).toBe(
      false,
    );
    expect(testEngine.asPlayerOne().getCard(pirateAlly).strength).toBe(2);
    expect(testEngine.asPlayerOne().hasKeyword(pirateAlly, "Resist")).toBe(false);
    expect(testEngine.asPlayerOne().getCard(nonPirateAlly).strength).toBe(2);
    expect(testEngine.asPlayerOne().hasKeyword(nonPirateAlly, "Resist")).toBe(false);

    expect(
      testEngine.asPlayerOne().challenge(captainHookThePirateKingEnchanted, opposingDefenderOne),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(captainHookThePirateKingEnchanted).strength).toBe(6);
    expect(testEngine.asPlayerOne().getCard(pirateAlly).strength).toBe(4);
    expect(testEngine.asPlayerOne().getCard(nonPirateAlly).strength).toBe(2);

    expect(
      testEngine.asPlayerOne().challenge(pirateAlly, opposingDefenderTwo),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(pirateAlly).damage).toBe(0);
    expect(testEngine.asPlayerOne().getCard(pirateAlly).strength).toBe(4);
    expect(testEngine.asPlayerOne().getCard(captainHookThePirateKingEnchanted).strength).toBe(6);
    expect(testEngine.asPlayerOne().getCard(nonPirateAlly).strength).toBe(2);
  });
});
