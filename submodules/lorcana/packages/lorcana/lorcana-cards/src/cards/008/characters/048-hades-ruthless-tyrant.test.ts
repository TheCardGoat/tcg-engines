import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hadesRuthlessTyrant } from "./048-hades-ruthless-tyrant";

const alliedCharacter = createMockCharacter({
  id: "hades-ruthless-tyrant-allied-character",
  name: "Allied Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Hades - Ruthless Tyrant", () => {
  describe("SHORT ON PATIENCE - When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.", () => {
    it("deals 2 damage to another friendly character and draws 2 cards when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hadesRuthlessTyrant],
        inkwell: hadesRuthlessTyrant.cost,
        play: [alliedCharacter],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(hadesRuthlessTyrant)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(hadesRuthlessTyrant, {
          resolveOptional: true,
          targets: [alliedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardByInstance(alliedCharacter).damage).toBe(2);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(3);
    });

    it("deals 2 damage to another friendly character and draws 2 cards when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hadesRuthlessTyrant, alliedCharacter],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(hadesRuthlessTyrant)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(hadesRuthlessTyrant, {
          resolveOptional: true,
          targets: [alliedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardByInstance(alliedCharacter).damage).toBe(2);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(3);
    });
  });
});
