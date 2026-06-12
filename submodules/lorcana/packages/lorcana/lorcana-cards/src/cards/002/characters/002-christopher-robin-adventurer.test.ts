import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { tiggerOneOfAKind, winnieThePoohHunnyWizard } from "../characters";
import { christopherRobinAdventurer } from "./002-christopher-robin-adventurer";

describe("Christopher Robin - Adventurer", () => {
  describe("WE'LL ALWAYS BE TOGETHER Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.", () => {
    it("Should gain 2 lore when readying with 2 other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: christopherRobinAdventurer, isDrying: false },
          { card: winnieThePoohHunnyWizard },
          { card: tiggerOneOfAKind },
        ],
      });

      const initialLore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
      const christopherId = testEngine.findCardInstanceId(christopherRobinAdventurer, "play");

      // Exert and then ready Christopher Robin
      testEngine.asServer().manualExertCard(christopherId);
      expect(testEngine.asServer().isExerted(christopherId)).toBe(true);

      testEngine.asServer().manualReadyCard(christopherId);
      expect(testEngine.asServer().isExerted(christopherId)).toBe(false);

      // Should have gained 2 lore
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(initialLore + 2);
    });

    it("Should not gain 2 lore when readying with 1 other character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: christopherRobinAdventurer, isDrying: false },
          { card: winnieThePoohHunnyWizard },
        ],
      });

      const initialLore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
      const christopherId = testEngine.findCardInstanceId(christopherRobinAdventurer, "play");

      // Exert and then ready Christopher Robin
      testEngine.asServer().manualExertCard(christopherId);
      testEngine.asServer().manualReadyCard(christopherId);

      // Should not have gained lore
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(initialLore);
    });

    it("Passing the turn triggers the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {},
        {
          deck: 1,
          play: [
            { card: christopherRobinAdventurer, isDrying: false },
            { card: winnieThePoohHunnyWizard },
            { card: tiggerOneOfAKind },
          ],
        },
      );

      // Exert Christopher Robin (Player 2)
      const christopherId = testEngine.findCardInstanceId(
        christopherRobinAdventurer,
        "play",
        PLAYER_TWO,
      );
      testEngine.asServer().manualExertCard(christopherId);

      const initialLore = testEngine.asPlayerTwo().getLore(PLAYER_TWO);

      // Pass turn (which should ready all characters for Player 2)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Auto-resolve might not trigger for Player 2 since Player 1 passed the turn
      if (testEngine.asPlayerTwo().getBagCount() > 0) {
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(christopherRobinAdventurer),
        ).toBeSuccessfulCommand();
      }

      // Should have gained 2 lore from the ready trigger
      expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(initialLore + 2);
    });
  });
});
