import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mrSnoopsBetrayedPartner } from "./143-mr-snoops-betrayed-partner";
import { dragonFire } from "../../001/actions/130-dragon-fire";

describe("Mr. Snoops - Betrayed Partner", () => {
  describe("DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.", () => {
    it("draws a card when banished during your turn and optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mrSnoopsBetrayedPartner],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        deck: 10,
      });

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, { targets: [mrSnoopsBetrayedPartner] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mrSnoopsBetrayedPartner)).toBe("discard");

      // The optional trigger should fire during your turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrSnoopsBetrayedPartner, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        deck: 9,
        hand: 1,
      });
    });

    it("does not draw a card when optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mrSnoopsBetrayedPartner],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        deck: 10,
      });

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, { targets: [mrSnoopsBetrayedPartner] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrSnoopsBetrayedPartner, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        deck: 10,
        hand: 0,
      });
    });

    it("regression: does NOT trigger when player banishes an opponent's character (only triggers on SELF banish)", () => {
      const opponentCharacter = createMockCharacter({
        id: "mr-snoops-opponent-char",
        name: "Opponent Character",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mrSnoopsBetrayedPartner],
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 10,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      // Player one uses Dragon Fire to banish opponent's character while Mr. Snoops is in play
      expect(
        testEngine.asPlayerOne().playCard(dragonFire, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // Opponent's character should be banished
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("discard");

      // Mr. Snoops should NOT trigger - he only triggers when HE is banished
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("regression: triggers exactly once when banished (no double-emit of banish event)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mrSnoopsBetrayedPartner],
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        deck: 10,
      });

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, { targets: [mrSnoopsBetrayedPartner] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mrSnoopsBetrayedPartner)).toBe("discard");

      // Should trigger exactly once, not multiple times
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("does NOT trigger during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mrSnoopsBetrayedPartner],
          deck: 10,
        },
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
        },
      );

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, { targets: [mrSnoopsBetrayedPartner] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mrSnoopsBetrayedPartner)).toBe("discard");

      // No trigger should fire during opponent's turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
