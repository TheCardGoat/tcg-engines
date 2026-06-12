import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { shereKhanInfamousTiger } from "./092-shere-khan-infamous-tiger";

const otherCard1 = createMockCharacter({
  id: "other-card-1",
  name: "Other Card 1",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const otherCard2 = createMockCharacter({
  id: "other-card-2",
  name: "Other Card 2",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Shere Khan - Infamous Tiger", () => {
  describe("WHAT A PITY - When you play this character, discard your hand.", () => {
    it("discards all other cards in hand when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [shereKhanInfamousTiger, otherCard1, otherCard2],
        inkwell: shereKhanInfamousTiger.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(shereKhanInfamousTiger)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(otherCard1)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(otherCard2)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(shereKhanInfamousTiger)).toBe("play");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        hand: 0,
        discard: 2,
        play: 1,
      });
    });

    it("does nothing when no other cards are in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [shereKhanInfamousTiger],
        inkwell: shereKhanInfamousTiger.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(shereKhanInfamousTiger)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(shereKhanInfamousTiger)).toBe("play");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        hand: 0,
        discard: 0,
        play: 1,
      });
    });
  });
});
