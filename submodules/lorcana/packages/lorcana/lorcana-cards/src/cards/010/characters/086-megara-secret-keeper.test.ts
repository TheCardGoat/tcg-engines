import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { megaraSecretKeeper } from "./086-megara-secret-keeper";

const deckCard = createMockCharacter({
  id: "megara-deck-card",
  name: "Deck Card",
  cost: 1,
});

const opponentHandCard = createMockCharacter({
  id: "megara-test-opponent-hand-card",
  name: "Opponent Hand Card",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const challenger = createMockCharacter({
  id: "megara-test-challenger",
  name: "Challenger",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
});

describe("Megara - Secret Keeper", () => {
  describe("Boost 1", () => {
    it("has Boost keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [megaraSecretKeeper],
      });

      expect(testEngine.hasKeyword(megaraSecretKeeper, "Boost")).toBe(true);
    });

    it("can activate Boost 1 to put top card of deck under Megara", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        deck: 3,
        play: [megaraSecretKeeper],
      });

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(
        testEngine.asPlayerOne().activateAbility(megaraSecretKeeper, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
      expect(deckAfter).toBe(deckBefore - 1);
      expect(testEngine.getCardsUnder(megaraSecretKeeper)).toHaveLength(1);
    });
  });

  describe("I'LL BE FINE - +1 Lore while card under character", () => {
    it("has base lore without card under", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [megaraSecretKeeper],
      });

      const megaraCard = testEngine.asPlayerOne().getCard(megaraSecretKeeper);
      expect(megaraCard.lore).toBe(megaraSecretKeeper.lore);
      expect(testEngine.getCardsUnder(megaraSecretKeeper)).toHaveLength(0);
    });

    it("gets +1 lore while there's a card under this character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        deck: 1,
        play: [megaraSecretKeeper],
      });

      expect(testEngine.getCardsUnder(megaraSecretKeeper)).toHaveLength(0);

      expect(
        testEngine.asPlayerOne().activateAbility(megaraSecretKeeper, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(megaraSecretKeeper)).toHaveLength(1);

      const megaraCard = testEngine.asPlayerOne().getCard(megaraSecretKeeper);
      expect(megaraCard.lore).toBe(megaraSecretKeeper.lore + 1);
    });

    it("starts with +1 lore when cardsUnder is pre-populated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: megaraSecretKeeper, cardsUnder: [deckCard] }],
      });

      expect(testEngine.getCardsUnder(megaraSecretKeeper)).toHaveLength(1);

      const megaraCard = testEngine.asPlayerOne().getCard(megaraSecretKeeper);
      expect(megaraCard.lore).toBe(megaraSecretKeeper.lore + 1);
    });
  });

  describe("I'LL BE FINE - Gained discard ability when challenged", () => {
    it("does NOT trigger discard when challenged without a card under Megara", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: megaraSecretKeeper, exerted: true }],
        },
        {
          play: [challenger],
          hand: [opponentHandCard],
        },
      );

      expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

      expect(
        testEngine.asPlayerTwo().challenge(challenger, megaraSecretKeeper),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(0);

      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard)).toBe("hand");
    });

    // TODO: Engine gap - grant-ability with triggered ability inside static with condition not yet supported
    it.skip("triggers discard ability when challenged if there's a card under Megara", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: megaraSecretKeeper, exerted: true, cardsUnder: [deckCard] }],
        },
        {
          play: [challenger],
          hand: [opponentHandCard],
        },
      );

      const opponentDiscardId = testEngine.findCardInstanceId(
        opponentHandCard,
        "hand",
        "player_two",
      );

      expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

      expect(
        testEngine.asPlayerTwo().challenge(challenger, megaraSecretKeeper),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(megaraSecretKeeper),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentDiscardId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard)).toBe("discard");
    });
  });
});
