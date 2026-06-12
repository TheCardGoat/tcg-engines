import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { chiefBogoRespectedOfficer } from "./175-chief-bogo-respected-officer";

const floodbornCharacter = createMockCharacter({
  id: "bogo-floodborn",
  name: "Floodborn Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Floodborn"],
});

const opposingCharacter = createMockCharacter({
  id: "bogo-opposing",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Chief Bogo - Respected Officer", () => {
  describe("INSUBORDINATION! - Whenever you play a Floodborn character, deal 1 damage to each opposing character", () => {
    it("deals 1 damage to each opposing character when Floodborn is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: floodbornCharacter.cost,
          hand: [floodbornCharacter],
          play: [chiefBogoRespectedOfficer],
        },
        {
          play: [opposingCharacter],
        },
      );

      testEngine.asPlayerOne().playCard(floodbornCharacter);
      expect(testEngine.asPlayerOne().getDamage(opposingCharacter)).toBe(1);
    });

    it("does not trigger from opponent's Bogo when you play Floodborn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: floodbornCharacter.cost,
          hand: [floodbornCharacter],
          play: [chiefBogoRespectedOfficer],
        },
        {
          play: [opposingCharacter, chiefBogoRespectedOfficer],
        },
      );

      testEngine.asPlayerOne().playCard(floodbornCharacter);
      // Player one's Bogo triggers: 1 damage to each opposing character
      expect(testEngine.asPlayerOne().getDamage(opposingCharacter)).toBe(1);
    });
  });
});
