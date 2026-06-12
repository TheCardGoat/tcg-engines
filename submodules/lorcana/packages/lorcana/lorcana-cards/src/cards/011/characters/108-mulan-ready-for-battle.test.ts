import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { CANONICAL_PLAYER_ONE } from "@tcg/shared/testing";
import { mulanReadyForBattle } from "./108-mulan-ready-for-battle";

const weakCharacter = createMockCharacter({
  id: "mulan-test-weak",
  name: "Weak Ally",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const strongCharacter = createMockCharacter({
  id: "mulan-test-strong",
  name: "Strong Ally",
  cost: 3,
  strength: 5,
  willpower: 3,
});

describe("Mulan - Ready for Battle", () => {
  describe("NOBLE SPIRIT - If you have a character in play with damage, you pay 1 {I} less to play this character.", () => {
    it("costs full price when no damaged characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mulanReadyForBattle],
        play: [weakCharacter],
        inkwell: mulanReadyForBattle.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(mulanReadyForBattle)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mulanReadyForBattle)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 1 less when a character has damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mulanReadyForBattle],
        play: [{ card: weakCharacter, damage: 1 }],
        inkwell: mulanReadyForBattle.cost - 1,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(mulanReadyForBattle)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mulanReadyForBattle)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("cannot be played with cost - 1 ink when no damaged character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mulanReadyForBattle],
        play: [weakCharacter],
        inkwell: mulanReadyForBattle.cost - 1,
        deck: 2,
      });

      const result = testEngine.asPlayerOne().playCard(mulanReadyForBattle);
      expect(result).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mulanReadyForBattle)).toBe("hand");
    });
  });

  describe("FIGHTING SPIRIT - If you have a character in play with 5 or more strength, you pay 1 {I} less to play this character.", () => {
    it("costs full price when no character with 5+ strength in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mulanReadyForBattle],
        play: [weakCharacter],
        inkwell: mulanReadyForBattle.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(mulanReadyForBattle)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mulanReadyForBattle)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 1 less when a character with 5+ strength is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mulanReadyForBattle],
        play: [strongCharacter],
        inkwell: mulanReadyForBattle.cost - 1,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(mulanReadyForBattle)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mulanReadyForBattle)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("cannot be played with cost - 1 ink when no character with 5+ strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mulanReadyForBattle],
        play: [weakCharacter],
        inkwell: mulanReadyForBattle.cost - 1,
        deck: 2,
      });

      const result = testEngine.asPlayerOne().playCard(mulanReadyForBattle);
      expect(result).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mulanReadyForBattle)).toBe("hand");
    });
  });

  describe("Both abilities combined", () => {
    it("costs 2 less when both conditions are met by the same character (damaged + 5+ strength)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mulanReadyForBattle],
        play: [{ card: strongCharacter, damage: 1 }],
        inkwell: mulanReadyForBattle.cost - 2,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(mulanReadyForBattle)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mulanReadyForBattle)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("costs 2 less when conditions are met by different characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mulanReadyForBattle],
        play: [{ card: weakCharacter, damage: 1 }, strongCharacter],
        inkwell: mulanReadyForBattle.cost - 2,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(mulanReadyForBattle)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mulanReadyForBattle)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(0);
    });

    it("cannot be played with cost - 2 ink when only one condition is met", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mulanReadyForBattle],
        play: [{ card: weakCharacter, damage: 1 }],
        inkwell: mulanReadyForBattle.cost - 2,
        deck: 2,
      });

      const result = testEngine.asPlayerOne().playCard(mulanReadyForBattle);
      expect(result).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mulanReadyForBattle)).toBe("hand");
    });
  });
});
