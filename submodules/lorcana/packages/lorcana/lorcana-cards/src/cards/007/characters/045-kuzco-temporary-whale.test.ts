import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { kuzcoTemporaryWhale } from "./045-kuzco-temporary-whale";

const inkCard = createMockCharacter({
  id: "kuzco-whale-ink-card",
  name: "Ink Card",
  cost: 1,
  inkable: true,
});

const targetCharacterCost2 = createMockCharacter({
  id: "kuzco-whale-target-char-cost2",
  name: "Target Character Cost 2",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const targetItemCost2 = createMockItem({
  id: "kuzco-whale-target-item-cost2",
  name: "Target Item Cost 2",
  cost: 2,
});

const targetLocationCost1 = createMockLocation({
  id: "kuzco-whale-target-location-cost1",
  name: "Target Location Cost 1",
  cost: 1,
  moveCost: 1,
  willpower: 4,
  lore: 1,
});

describe("Kuzco - Temporary Whale", () => {
  describe("DON'T YOU SAY A WORD - Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.", () => {
    it("triggers when you ink a card and returns own character with cost 2 to hand, then that player draws a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [inkCard],
          play: [kuzcoTemporaryWhale, targetCharacterCost2],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      // Accept the optional ability
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kuzcoTemporaryWhale),
      ).toBeSuccessfulCommand();
      // Select the target
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [targetCharacterCost2],
        }),
      ).toBeSuccessfulCommand();

      // Character is returned to hand
      expect(testEngine.asPlayerOne().getCardZone(targetCharacterCost2)).toBe("hand");
      // Owner's deck decreased by 1 (they drew a card)
      expect(testEngine.asPlayerOne().getCardsInZone("deck", "player_one").count).toBe(2);
    });

    it("triggers when you ink a card and bounces opponent character, then opponent draws a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [inkCard],
          play: [kuzcoTemporaryWhale],
          deck: 3,
        },
        {
          play: [targetCharacterCost2],
          deck: 3,
        },
      );

      const opponentHandBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_TWO).count;
      const opponentDeckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_TWO).count;

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      // Accept the optional ability
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kuzcoTemporaryWhale),
      ).toBeSuccessfulCommand();
      // Select the opponent's character as the target
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [targetCharacterCost2],
        }),
      ).toBeSuccessfulCommand();

      // Opponent's character is returned to their hand + they draw 1 card = 2 cards in hand
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_TWO).count).toBe(
        opponentHandBefore + 2,
      );
      // Opponent's play zone is now empty
      expect(testEngine.asPlayerOne().getCardsInZone("play", PLAYER_TWO).count).toBe(0);
      // Opponent's deck decreases by 1 (drew a card)
      expect(testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_TWO).count).toBe(
        opponentDeckBefore - 1,
      );
    });

    it("can target an item with cost 2 or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [inkCard],
          play: [kuzcoTemporaryWhale, targetItemCost2],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kuzcoTemporaryWhale),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [targetItemCost2],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetItemCost2)).toBe("hand");
    });

    it("can target a location with cost 2 or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [inkCard],
          play: [kuzcoTemporaryWhale, targetLocationCost1],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kuzcoTemporaryWhale),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [targetLocationCost1],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(targetLocationCost1)).toBe("hand");
    });

    it("does not trigger during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 3,
          play: [kuzcoTemporaryWhale],
        },
        {
          deck: 3,
          hand: [inkCard],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent inks a card — should NOT trigger (restriction: during-turn your)
      expect(testEngine.asPlayerTwo().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });
  });
});
