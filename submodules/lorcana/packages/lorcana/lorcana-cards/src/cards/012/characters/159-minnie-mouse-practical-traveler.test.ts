import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { minnieMousePracticalTraveler } from "./159-minnie-mouse-practical-traveler";

const anotherCharacter = createMockCharacter({
  id: "minnie-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Minnie Mouse - Practical Traveler", () => {
  describe("DISCERNING EYE - Whenever this character quests, if you played another character this turn, gain 1 lore.", () => {
    it("gains 1 bonus lore when questing after playing another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [anotherCharacter],
          play: [{ card: minnieMousePracticalTraveler, isDrying: false }],
          inkwell: 1,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().quest(minnieMousePracticalTraveler)).toBeSuccessfulCommand();

      // 1 lore from questing + 1 bonus lore from DISCERNING EYE.
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(
        minnieMousePracticalTraveler.lore + 1,
      );
    });

    it("does not gain bonus lore when no other character was played this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: minnieMousePracticalTraveler, isDrying: false }],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().quest(minnieMousePracticalTraveler)).toBeSuccessfulCommand();

      // Only the lore from questing — the condition is not met.
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(minnieMousePracticalTraveler.lore);
    });
  });
});
