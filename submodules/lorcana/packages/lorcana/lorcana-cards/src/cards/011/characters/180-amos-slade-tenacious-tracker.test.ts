import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { amosSladeTenaciousTracker } from "./180-amos-slade-tenacious-tracker";

describe("Amos Slade - Tenacious Tracker", () => {
  describe("Alert", () => {
    it("should have alert ability", () => {
      const testEngine = new LorcanaTestEngine({
        play: [amosSladeTenaciousTracker],
      });

      const cardUnderTest = testEngine.getCardModel(amosSladeTenaciousTracker);
      expect(cardUnderTest.hasAlert()).toBe(true);
    });
  });

  describe("Stats and basic properties", () => {
    it("should have correct stats", () => {
      const testEngine = new LorcanaTestEngine({
        play: [amosSladeTenaciousTracker],
      });

      const cardUnderTest = testEngine.getCardModel(amosSladeTenaciousTracker);

      expect(cardUnderTest.strength).toBe(6);
      expect(cardUnderTest.willpower).toBe(4);
      expect(cardUnderTest.lore).toBe(1);
      expect(cardUnderTest.cost).toBe(4);
    });

    it("should not be inkable", () => {
      expect(amosSladeTenaciousTracker.inkable).toBe(false);
    });

    it("should have correct classifications", () => {
      expect(amosSladeTenaciousTracker.classifications).toEqual(["Storyborn"]);
    });

    it("should be steel ink type", () => {
      expect(amosSladeTenaciousTracker.inkType).toEqual(["steel"]);
    });

    it("should be common rarity", () => {
      expect(amosSladeTenaciousTracker.rarity).toBe("common");
    });

    it("should be from set 011", () => {
      expect(amosSladeTenaciousTracker.set).toBe("011");
    });

    it("should be card number 180", () => {
      expect(amosSladeTenaciousTracker.cardNumber).toBe(180);
    });
  });

  describe("Gameplay", () => {
    it("should be playable from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [amosSladeTenaciousTracker],
        inkwell: amosSladeTenaciousTracker.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(amosSladeTenaciousTracker)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(amosSladeTenaciousTracker)).toBe("play");
    });

    it("should be able to quest for lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [amosSladeTenaciousTracker],
        deck: 5,
      });

      const initialLore = testEngine.getLore("player_one");

      expect(testEngine.asPlayerOne().quest(amosSladeTenaciousTracker)).toBeSuccessfulCommand();

      expect(testEngine.getLore("player_one")).toBe(initialLore + 1);
      expect(testEngine.isExerted(amosSladeTenaciousTracker)).toBe(true);
    });
  });
});
