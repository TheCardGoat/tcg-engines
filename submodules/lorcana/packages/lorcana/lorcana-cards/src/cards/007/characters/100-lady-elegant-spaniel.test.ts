import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { trampEnterprisingDog } from "./110-tramp-enterprising-dog";
import { ladyElegantSpaniel } from "./100-lady-elegant-spaniel";

describe("Lady - Elegant Spaniel", () => {
  describe("A DOG'S LIFE - While you have a character named Tramp in play, this character gets +1 {L}.", () => {
    it("should have base lore of 1 when Tramp is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ladyElegantSpaniel],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(ladyElegantSpaniel)).toBe(1);
    });

    it("should have derived lore of 2 when Tramp is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ladyElegantSpaniel, trampEnterprisingDog],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardLore(ladyElegantSpaniel)).toBe(2);
    });

    it("should gain 1 lore when questing without Tramp in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ladyElegantSpaniel],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(ladyElegantSpaniel)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
    });

    it("should gain 2 lore when questing with Tramp in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ladyElegantSpaniel, trampEnterprisingDog],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(ladyElegantSpaniel)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
    });
  });
});
