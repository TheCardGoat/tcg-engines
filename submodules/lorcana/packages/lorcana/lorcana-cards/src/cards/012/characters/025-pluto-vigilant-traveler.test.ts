import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { plutoVigilantTraveler } from "./025-pluto-vigilant-traveler";

const anotherCharacter = createMockCharacter({
  id: "pluto-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const opposingCharacter = createMockCharacter({
  id: "pluto-opponent",
  name: "Opposing Character",
  cost: 3,
  strength: 3,
  willpower: 4,
});

describe("Pluto - Vigilant Traveler", () => {
  describe("BEWARE OF DOG - Whenever this character quests, if you played another character this turn, chosen opposing character gets -1 {S} until the start of your next turn.", () => {
    it("gives chosen opposing character -1 {S} when questing after playing another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [anotherCharacter],
          play: [plutoVigilantTraveler],
          inkwell: anotherCharacter.cost,
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      const initialStrength = testEngine.getCard(opposingCharacter).strength!;

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().quest(plutoVigilantTraveler)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(plutoVigilantTraveler, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCard(opposingCharacter).strength).toBe(initialStrength - 1);
    });

    it("does not apply -1 {S} when questing without playing another character this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: plutoVigilantTraveler, isDrying: false }],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      const initialStrength = testEngine.getCard(opposingCharacter).strength!;

      expect(testEngine.asPlayerOne().quest(plutoVigilantTraveler)).toBeSuccessfulCommand();

      // Condition not met - ability should not produce a pending effect
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.getCard(opposingCharacter).strength).toBe(initialStrength);
    });
  });
});
