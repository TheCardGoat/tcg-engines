import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mauiSoaringDemigod } from "../characters";
import { mauisFishHook } from "./132-mauis-fish-hook";

const targetCharacter = createMockCharacter({
  id: "mauis-fish-hook-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Maui's Fish Hook", () => {
  describe("SHAPESHIFT — {E}, 2 {I} — Choose one: Chosen character gains Evasive until start of next turn / Chosen character gets +3 {S} this turn.", () => {
    it("grants Evasive until the start of your next turn (option 1)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mauisFishHook, targetCharacter],
        inkwell: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Evasive")).toBe(false);

      const result = testEngine.asPlayerOne().activateAbility(mauisFishHook, {
        ability: "SHAPESHIFT",
        choiceIndex: 0,
        targets: [targetCharacter],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(mauisFishHook)).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Evasive")).toBe(true);

      // Evasive persists through opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Evasive")).toBe(true);

      // Evasive expires at start of controller's next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Evasive")).toBe(false);
    });

    it("gives +3 strength this turn (option 2)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mauisFishHook, targetCharacter],
        inkwell: 2,
      });

      const result = testEngine.asPlayerOne().activateAbility(mauisFishHook, {
        ability: "SHAPESHIFT",
        choiceIndex: 1,
        targets: [targetCharacter],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(mauisFishHook)).toBe(true);
      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(5); // 2 + 3
    });

    it("requires 2 ink to activate without Maui", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mauisFishHook, targetCharacter],
        inkwell: 1,
      });

      const result = testEngine.asPlayerOne().activateAbility(mauisFishHook, {
        ability: "SHAPESHIFT",
        choiceIndex: 0,
        targets: [targetCharacter],
      });

      expect(result).not.toBeSuccessfulCommand();
    });
  });

  describe("IT'S MAUI TIME! — If you have a character named Maui in play, you may use this item's Shapeshift ability for free.", () => {
    it("can be activated for free (exert only) when a character named Maui is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mauisFishHook, mauiSoaringDemigod, targetCharacter],
        inkwell: 0,
      });

      const result = testEngine.asPlayerOne().activateAbility(mauisFishHook, {
        ability: "SHAPESHIFT (IT'S MAUI TIME!)",
        choiceIndex: 0,
        targets: [targetCharacter],
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(mauisFishHook)).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Evasive")).toBe(true);
    });

    it("cannot use the free ability without a character named Maui in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mauisFishHook, targetCharacter],
        inkwell: 0,
      });

      const result = testEngine.asPlayerOne().activateAbility(mauisFishHook, {
        ability: "SHAPESHIFT (IT'S MAUI TIME!)",
        choiceIndex: 0,
        targets: [targetCharacter],
      });

      expect(result).not.toBeSuccessfulCommand();
    });
  });
});
