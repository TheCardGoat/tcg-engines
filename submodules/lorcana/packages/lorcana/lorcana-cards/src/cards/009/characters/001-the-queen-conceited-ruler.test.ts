import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theQueenConceitedRuler } from "./001-the-queen-conceited-ruler";

const princessCard = createMockCharacter({
  id: "queen-conceited-ruler-princess-mock",
  name: "Test Princess",
  cost: 2,
  classifications: ["Princess"],
});

const queenCard = createMockCharacter({
  id: "queen-conceited-ruler-queen-mock",
  name: "Test Queen",
  cost: 2,
  classifications: ["Queen"],
});

const nonPrincessQueenCard = createMockCharacter({
  id: "queen-conceited-ruler-other-mock",
  name: "Test Other",
  cost: 2,
  classifications: ["Hero"],
});

const characterInDiscard = createMockCharacter({
  id: "queen-conceited-ruler-discard-char",
  name: "Test Discard Character",
  cost: 3,
});

describe("The Queen - Conceited Ruler", () => {
  it("has the Support keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [theQueenConceitedRuler],
    });

    expect(testEngine.getCardModel(theQueenConceitedRuler).hasSupport()).toBe(true);
  });

  describe("ROYAL SUMMONS - At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.", () => {
    it("triggers at the start of the controller's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theQueenConceitedRuler],
          hand: [princessCard],
          discard: [characterInDiscard],
          deck: 3,
        },
        { deck: 3 },
      );

      // Advance to P1's next turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // ROYAL SUMMONS should trigger at the start of P1's turn
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    });

    it("discarding a Princess card returns a character from discard to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theQueenConceitedRuler],
          hand: [princessCard],
          discard: [characterInDiscard],
          deck: 3,
        },
        { deck: 3 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Resolve ROYAL SUMMONS (accept optional), targeting the princess to discard
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theQueenConceitedRuler, {
          resolveOptional: true,
          targets: [princessCard],
        }),
      ).toBeSuccessfulCommand();

      // Princess should now be in discard
      expect(testEngine.asPlayerOne().getCardZone(princessCard)).toBe("discard");

      // Resolve the return-from-discard choice
      const discardId = testEngine.findCardInstanceId(characterInDiscard, "discard");
      if (discardId) {
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [discardId] }),
        ).toBeSuccessfulCommand();
      }

      // characterInDiscard should now be in hand
      expect(testEngine.asPlayerOne().getCardZone(characterInDiscard)).toBe("hand");
    });

    it("discarding a Queen card returns a character from discard to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theQueenConceitedRuler],
          hand: [queenCard],
          discard: [characterInDiscard],
          deck: 3,
        },
        { deck: 3 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theQueenConceitedRuler, {
          resolveOptional: true,
          targets: [queenCard],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(queenCard)).toBe("discard");

      const discardId = testEngine.findCardInstanceId(characterInDiscard, "discard");
      if (discardId) {
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [discardId] }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(characterInDiscard)).toBe("hand");
    });

    it("is optional — can be declined without discarding or returning any card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theQueenConceitedRuler],
          hand: [princessCard],
          discard: [characterInDiscard],
          deck: 3,
        },
        { deck: 3 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      // Decline the optional
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theQueenConceitedRuler, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Princess stays in hand, characterInDiscard stays in discard
      expect(testEngine.asPlayerOne().getCardZone(princessCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(characterInDiscard)).toBe("discard");
    });

    it("does not trigger during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {},
        {
          play: [theQueenConceitedRuler],
          hand: [princessCard],
          discard: [characterInDiscard],
          deck: 3,
        },
      );

      // P1's turn — The Queen is controlled by P2, ability should not fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
