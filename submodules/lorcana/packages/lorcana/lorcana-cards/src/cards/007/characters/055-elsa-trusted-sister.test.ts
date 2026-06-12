import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { elsaTrustedSister } from "./055-elsa-trusted-sister";

const annaCard = createMockCharacter({
  id: "elsa-test-anna",
  name: "Anna",
  version: "Test Version",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

const notAnna = createMockCharacter({
  id: "elsa-test-not-anna",
  name: "Not Anna",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("Elsa - Trusted Sister", () => {
  describe("WHAT DO WE DO NOW? - Whenever this character quests, if you have a character named Anna in play, gain 1 lore.", () => {
    it("gains 1 extra lore when questing with Anna in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: elsaTrustedSister, isDrying: false }, annaCard],
          deck: 2,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().quest(elsaTrustedSister)).toBeSuccessfulCommand();

      // Base lore (1) + bonus lore (1) = 2
      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    });

    it("regression: does NOT gain extra lore when no Anna is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: elsaTrustedSister, isDrying: false }, notAnna],
          deck: 2,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().quest(elsaTrustedSister)).toBeSuccessfulCommand();

      // Only base lore (1), no bonus
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    });

    it("regression: does NOT gain extra lore when Elsa is alone (no Anna)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: elsaTrustedSister, isDrying: false }],
          deck: 2,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().quest(elsaTrustedSister)).toBeSuccessfulCommand();

      // Only base lore (1), no bonus
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    });
  });
});
