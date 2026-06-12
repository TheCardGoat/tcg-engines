import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bellwetherAssistantMayor } from "./090-bellwether-assistant-mayor";

const inkableCard = createMockCharacter({
  id: "bellwether-ink-fodder",
  name: "Ink Fodder",
  cost: 1,
  inkable: true,
});

const opponentCharacter = createMockCharacter({
  id: "bellwether-opponent-char",
  name: "Opponent Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const opponentCharacter2 = createMockCharacter({
  id: "bellwether-opponent-char-2",
  name: "Opponent Character 2",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Bellwether - Assistant Mayor", () => {
  describe("FEAR ALWAYS WORKS - During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn.", () => {
    it("triggers when a card is put into your inkwell and grants Reckless to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bellwetherAssistantMayor],
          hand: [inkableCard],
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      // Put a card into inkwell during your turn
      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

      // Triggered ability should fire - resolve it by choosing an opposing character
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bellwetherAssistantMayor, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Reckless should not be active yet (it's during "their next turn")
      expect(testEngine.hasKeyword(opponentCharacter, "Reckless")).toBe(false);

      // Pass turn to player two - now Reckless should be active
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(opponentCharacter, "Reckless")).toBe(true);
    });

    it("does not trigger on opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bellwetherAssistantMayor],
          deck: 5,
        },
        {
          hand: [inkableCard],
          play: [opponentCharacter],
          deck: 5,
        },
      );

      // Pass turn to player two
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two puts a card into inkwell (not player one's turn)
      expect(testEngine.asPlayerTwo().ink(inkableCard)).toBeSuccessfulCommand();

      // Bellwether's ability should not trigger since it's not player one's turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("regression: player can pass turn after resolving Bellwether's ability without freezing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [bellwetherAssistantMayor],
          hand: [inkableCard],
          deck: 5,
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      // Ink a card to trigger the ability
      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve the trigger
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bellwetherAssistantMayor, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Now pass turn - this should NOT freeze
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    });
  });
});
