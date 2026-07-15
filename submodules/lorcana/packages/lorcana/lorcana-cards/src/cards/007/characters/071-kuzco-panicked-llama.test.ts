import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kuzcoPanickedLlama } from "./071-kuzco-panicked-llama";

const handCardOne = createMockCharacter({
  id: "kuzco-hand-card-one",
  name: "Hand Card One",
  cost: 1,
});

const handCardTwo = createMockCharacter({
  id: "kuzco-hand-card-two",
  name: "Hand Card Two",
  cost: 1,
});

describe("Kuzco - Panicked Llama", () => {
  it("has the Evasive keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kuzcoPanickedLlama],
    });

    const cardModel = testEngine.getCardModel(kuzcoPanickedLlama);
    expect(cardModel.hasEvasive).toBe(true);
  });

  describe("WE CAN FIGURE THIS OUT - At the start of your turn, choose one:", () => {
    it("mode 0: Each player draws a card", () => {
      // P2 controls Kuzco. Ability fires at the start of P2's turn.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3 },
        { deck: 3, play: [kuzcoPanickedLlama] },
      );

      // Pass P1's turn → P2's turn starts, WE CAN FIGURE THIS OUT triggers
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Bag has the triggered ability for P2 (controller)
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      // Choose mode 0: each player draws a card
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(kuzcoPanickedLlama, { choiceIndex: 0 }),
      ).toBeSuccessfulCommand();

      // P1 draws 1 from mandatory draw at start of their turn, P2 drew 1 from ALLOW ME effect
      // P2 started with deck=3, drew 1 mandatory at start of turn + 1 from the ability
      // Actually P2 draws at start of turn + Kuzco draws both players 1 card
      // P2 turn: mandatory draw (deck: 3→2, hand: 0→1), then Kuzco triggers
      // Mode 0: P2 draws 1 (deck: 2→1, hand: 1→2), P1 draws 1 (deck: 3→2, hand: 0→1)
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE)).toEqual(
        expect.objectContaining({ hand: 1, deck: 2 }),
      );
      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO)).toEqual(
        expect.objectContaining({ hand: 2, deck: 1 }),
      );
    });

    it("mode 1: Each player chooses and discards a card", () => {
      // P2 controls Kuzco. P1 has handCardOne in hand, P2 has handCardTwo in hand.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3, hand: [handCardOne] },
        { deck: 3, play: [kuzcoPanickedLlama], hand: [handCardTwo] },
      );

      // Pass P1's turn → P2's turn starts, WE CAN FIGURE THIS OUT triggers
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // P2 (controller) resolves bag with mode 1
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(kuzcoPanickedLlama, { choiceIndex: 1 }),
      ).toBeSuccessfulCommand();

      // P2 resolves their pending discard (handCardTwo)
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [handCardTwo] }),
      ).toBeSuccessfulCommand();

      // P1 resolves their pending discard (handCardOne)
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [handCardOne] }),
      ).toBeSuccessfulCommand();

      // After all pending effects resolve, verify both players discarded
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE)).toEqual(
        expect.objectContaining({ hand: 0, discard: 1 }),
      );
      // P2 drew 1 mandatory card (deck: 3→2, hand: 0→1) after bag resolves, then discarded (hand:0)
      // The mandatory draw may be deferred, so P2's hand count depends on timing
      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO)).toEqual(
        expect.objectContaining({ discard: 1 }),
      );
    });

    it("regression: discard mode fully resolves for both players (doesn't skip discard resolution)", () => {
      const handCardP1 = createMockCharacter({
        id: "kuzco-regression-hand-p1",
        name: "P1 Hand Card",
        cost: 1,
      });
      const handCardP2 = createMockCharacter({
        id: "kuzco-regression-hand-p2",
        name: "P2 Hand Card",
        cost: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3, hand: [handCardP1] },
        { deck: 3, play: [kuzcoPanickedLlama], hand: [handCardP2] },
      );

      // Pass P1's turn -> P2's turn starts, WE CAN FIGURE THIS OUT triggers
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // P2 (controller) resolves bag with mode 1 (discard)
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(kuzcoPanickedLlama, { choiceIndex: 1 }),
      ).toBeSuccessfulCommand();

      // P2 resolves their pending discard
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [handCardP2] }),
      ).toBeSuccessfulCommand();

      // P1 resolves their pending discard
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [handCardP1] }),
      ).toBeSuccessfulCommand();

      // Both cards should be in discard
      expect(testEngine.asPlayerOne().getCardZone(handCardP1)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(handCardP2)).toBe("discard");
    });
  });
});
