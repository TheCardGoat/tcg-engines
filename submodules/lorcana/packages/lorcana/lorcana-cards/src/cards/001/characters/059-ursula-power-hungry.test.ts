import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ursulaPowerHungry } from "./059-ursula-power-hungry";

const ursulaTopDeckCard = createMockCharacter({
  id: "ursula-power-hungry-top",
  name: "Ursula Draw Card",
  cost: 1,
});

const ursulaSecondDeckCard = createMockCharacter({
  id: "ursula-power-hungry-second",
  name: "Ursula Second Card",
  cost: 2,
});

describe("Ursula - Power Hungry", () => {
  describe("IT'S TOO EASY! - When you play this character, each opponent loses 1 lore. You may draw a card for each 1 lore lost this way.", () => {
    it("makes each opponent lose 1 lore when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ursulaPowerHungry],
          inkwell: ursulaPowerHungry.cost,
          deck: [ursulaTopDeckCard, ursulaSecondDeckCard],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asServer().manualSetLore(PLAYER_TWO, 3)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().playCard(ursulaPowerHungry)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ursulaPowerHungry),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2);
    });

    it("allows the controller to draw 1 card for the 1 lore lost when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ursulaPowerHungry],
          inkwell: ursulaPowerHungry.cost,
          deck: [ursulaTopDeckCard, ursulaSecondDeckCard],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asServer().manualSetLore(PLAYER_TWO, 3)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().playCard(ursulaPowerHungry)).toBeSuccessfulCommand();

      // Before resolving bag, P1 has 0 cards in hand (Ursula was played)
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);

      // Resolve bag and accept the optional draw (resolveOptional defaults to true)
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ursulaPowerHungry, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // P2 lost 1 lore (from 3 to 2)
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2);
      // P1 drew 1 card (1 lore was lost, so 1 card drawn)
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });

    it("does not draw a card when the optional draw is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ursulaPowerHungry],
          inkwell: ursulaPowerHungry.cost,
          deck: [ursulaTopDeckCard, ursulaSecondDeckCard],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asServer().manualSetLore(PLAYER_TWO, 3)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().playCard(ursulaPowerHungry)).toBeSuccessfulCommand();

      // Resolve bag and decline the optional draw
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ursulaPowerHungry, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // P2 still loses 1 lore (lose-lore is not optional)
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2);
      // P1 drew no cards (declined the draw)
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });

    it("does not reduce opponent lore below 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ursulaPowerHungry],
          inkwell: ursulaPowerHungry.cost,
          deck: [ursulaTopDeckCard, ursulaSecondDeckCard],
        },
        {
          deck: 2,
        },
      );

      // P2 starts with 0 lore
      expect(testEngine.asServer().manualSetLore(PLAYER_TWO, 0)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().playCard(ursulaPowerHungry)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ursulaPowerHungry, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // P2 lore cannot go below 0
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(0);
      // No lore was lost so no card is drawn
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });
  });
});
