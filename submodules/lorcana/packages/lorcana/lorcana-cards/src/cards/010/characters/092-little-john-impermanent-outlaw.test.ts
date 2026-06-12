import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { littleJohnImpermanentOutlaw } from "./092-little-john-impermanent-outlaw";

const opponentCharacter = createMockCharacter({
  id: "lj-test-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 10,
});

describe("Little John - Impermanent Outlaw", () => {
  describe("Boost 3", () => {
    it("has Boost keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [littleJohnImpermanentOutlaw],
      });

      expect(testEngine.hasKeyword(littleJohnImpermanentOutlaw, "Boost")).toBe(true);
    });

    it("can activate Boost 3 to put top card of deck under Little John", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 3,
        deck: 3,
        play: [littleJohnImpermanentOutlaw],
      });

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(
        testEngine.asPlayerOne().activateAbility(littleJohnImpermanentOutlaw, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
      expect(deckAfter).toBe(deckBefore - 1);
      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(1);
    });

    it("can only use Boost once per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 6,
        deck: 5,
        play: [littleJohnImpermanentOutlaw],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(littleJohnImpermanentOutlaw, { ability: "Boost" }),
      ).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(1);

      const result = testEngine
        .asPlayerOne()
        .activateAbility(littleJohnImpermanentOutlaw, { ability: "Boost" });
      expect(result.success).toBe(false);
      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(1);
    });
  });

  describe("READY TO RASSLE - Whenever you put a card under this character, ready him", () => {
    it("readies Little John when a card is put under him via Boost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 3,
        deck: 3,
        play: [{ card: littleJohnImpermanentOutlaw, exerted: true }],
      });

      expect(testEngine.asPlayerOne().getCard(littleJohnImpermanentOutlaw).exerted).toBe(true);
      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(0);

      expect(
        testEngine.asPlayerOne().activateAbility(littleJohnImpermanentOutlaw, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(1);

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(littleJohnImpermanentOutlaw, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(littleJohnImpermanentOutlaw).exerted).toBe(false);
    });

    it("readies Little John even when he was not exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 3,
        deck: 3,
        play: [littleJohnImpermanentOutlaw],
      });

      expect(testEngine.asPlayerOne().getCard(littleJohnImpermanentOutlaw).exerted).toBe(false);
      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(0);

      expect(
        testEngine.asPlayerOne().activateAbility(littleJohnImpermanentOutlaw, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(1);

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(littleJohnImpermanentOutlaw, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(littleJohnImpermanentOutlaw).exerted).toBe(false);
    });

    it("can challenge again after being readied via Boost + READY TO RASSLE", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 3,
          deck: 3,
          play: [{ card: littleJohnImpermanentOutlaw, isDrying: false }],
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(littleJohnImpermanentOutlaw, opponentCharacter),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(littleJohnImpermanentOutlaw).exerted).toBe(true);

      expect(
        testEngine.asPlayerOne().activateAbility(littleJohnImpermanentOutlaw, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(1);

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(littleJohnImpermanentOutlaw, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(littleJohnImpermanentOutlaw).exerted).toBe(false);
    });

    it("can decline the optional ready trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 3,
        deck: 3,
        play: [{ card: littleJohnImpermanentOutlaw, exerted: true }],
      });

      expect(testEngine.asPlayerOne().getCard(littleJohnImpermanentOutlaw).exerted).toBe(true);

      expect(
        testEngine.asPlayerOne().activateAbility(littleJohnImpermanentOutlaw, {
          ability: "Boost",
          preventAutoResolveTriggeredEffects: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(1);

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(littleJohnImpermanentOutlaw, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(littleJohnImpermanentOutlaw).exerted).toBe(true);
    });
  });
});
