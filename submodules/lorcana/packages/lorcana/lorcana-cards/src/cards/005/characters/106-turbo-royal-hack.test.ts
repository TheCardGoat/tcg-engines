import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { turboRoyalHack } from "./106-turbo-royal-hack";
import { kingCandySweetAbomination } from "./154-king-candy-sweet-abomination";

const nonKingCandyShifter = createMockCharacter({
  id: "non-king-candy-shifter",
  name: "Some Other Shifter",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  abilities: [
    {
      id: "nkcs-1",
      keyword: "Shift",
      cost: { ink: 3 },
      type: "keyword",
      text: "Shift 3",
    },
  ],
});

describe("Turbo - Royal Hack", () => {
  describe("Rush", () => {
    it("has Rush keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [turboRoyalHack],
      });

      expect(testEngine.hasKeyword(turboRoyalHack, "Rush")).toBe(true);
    });
  });

  describe("GAME JUMP - This character also counts as being named King Candy for Shift", () => {
    it("allows King Candy (Sweet Abomination, Shift 3) to shift onto Turbo - Royal Hack", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kingCandySweetAbomination],
        play: [turboRoyalHack],
        inkwell: 3,
      });

      const shiftTarget = testEngine.findCardInstanceId(turboRoyalHack, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(kingCandySweetAbomination, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(kingCandySweetAbomination)).toBe("play");
    });

    it("does NOT allow a card with Shift but NOT named King Candy to shift onto Turbo - Royal Hack", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nonKingCandyShifter],
        play: [turboRoyalHack],
        inkwell: 3,
      });

      const shiftTarget = testEngine.findCardInstanceId(turboRoyalHack, "play", PLAYER_ONE);

      const result = testEngine.asPlayerOne().playCard(nonKingCandyShifter, {
        cost: { cost: "shift", shiftTarget },
      });

      expect(result.success).toBe(false);
    });
  });
});
