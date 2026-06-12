import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { auntCassBiggestFan } from "./138-aunt-cass-biggest-fan";

const inventorCharacter = createMockCharacter({
  id: "aunt-cass-test-inventor",
  name: "Test Inventor",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Inventor"],
});

const nonInventorCharacter = createMockCharacter({
  id: "aunt-cass-test-non-inventor",
  name: "Test Non-Inventor",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Aunt Cass - Biggest Fan", () => {
  describe("HAPPY TO HELP - Whenever this character quests, chosen Inventor character gets +1 lore this turn.", () => {
    it("gives +1 lore to a chosen Inventor character when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auntCassBiggestFan, inventorCharacter],
        deck: 5,
      });

      const initialLore = testEngine.asPlayerOne().getCardLore(inventorCharacter);

      expect(testEngine.asPlayerOne().quest(auntCassBiggestFan)).toBeSuccessfulCommand();

      // Resolve the triggered ability
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(auntCassBiggestFan),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [inventorCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(inventorCharacter)).toBe(initialLore + 1);
    });

    it("does not give +1 lore to a non-Inventor character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auntCassBiggestFan, nonInventorCharacter],
        deck: 5,
      });

      const initialLore = testEngine.asPlayerOne().getCardLore(nonInventorCharacter);

      expect(testEngine.asPlayerOne().quest(auntCassBiggestFan)).toBeSuccessfulCommand();

      // The ability triggers but auto-resolves since no valid Inventor targets exist
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolveOnlyBag();
      }

      // Non-Inventor should not get the bonus
      expect(testEngine.asPlayerOne().getCardLore(nonInventorCharacter)).toBe(initialLore);
    });

    it("lore bonus lasts only for the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [auntCassBiggestFan, inventorCharacter],
        deck: 5,
      });

      const initialLore = testEngine.asPlayerOne().getCardLore(inventorCharacter);

      expect(testEngine.asPlayerOne().quest(auntCassBiggestFan)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(auntCassBiggestFan),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [inventorCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(inventorCharacter)).toBe(initialLore + 1);

      // Pass turns
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Lore bonus should be gone
      expect(testEngine.asPlayerOne().getCardLore(inventorCharacter)).toBe(initialLore);
    });
  });
});
