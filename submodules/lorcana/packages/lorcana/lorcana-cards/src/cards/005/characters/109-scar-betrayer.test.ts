import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { scarBetrayer } from "./109-scar-betrayer";

const mockMufasa = createMockCharacter({
  id: "mock-mufasa",
  name: "Mufasa",
  cost: 5,
  willpower: 5,
});

const mockNonMufasa = createMockCharacter({
  id: "mock-non-mufasa",
  name: "Simba",
  cost: 3,
  willpower: 3,
});

describe("Scar - Betrayer", () => {
  describe("LONG LIVE THE KING - When you play this character, you may banish chosen character named Mufasa.", () => {
    it("triggers an optional bag effect when Scar is played with Mufasa in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: scarBetrayer.cost,
        hand: [scarBetrayer],
        play: [mockMufasa],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(scarBetrayer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("banishes chosen Mufasa when you accept the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: scarBetrayer.cost,
        hand: [scarBetrayer],
        play: [mockMufasa],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(scarBetrayer)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarBetrayer, {
          resolveOptional: true,
          targets: [mockMufasa],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockMufasa)).toBe("discard");
    });

    it("does not banish anything when you decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: scarBetrayer.cost,
        hand: [scarBetrayer],
        play: [mockMufasa],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(scarBetrayer)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarBetrayer, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockMufasa)).toBe("play");
    });

    it("can banish an opponent's Mufasa", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: scarBetrayer.cost,
          hand: [scarBetrayer],
          deck: 1,
        },
        {
          play: [mockMufasa],
        },
      );

      expect(testEngine.asPlayerOne().playCard(scarBetrayer)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarBetrayer, {
          resolveOptional: true,
          targets: [mockMufasa],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(mockMufasa)).toBe("discard");
    });

    it("only shows Mufasa as valid target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: scarBetrayer.cost,
        hand: [scarBetrayer],
        play: [mockMufasa, mockNonMufasa],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(scarBetrayer)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scarBetrayer, {
          resolveOptional: true,
          targets: [mockMufasa],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockMufasa)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(mockNonMufasa)).toBe("play");
    });
  });
});
