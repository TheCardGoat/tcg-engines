import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { donaldDuckPerfectGentleman } from "./085-donald-duck-perfect-gentleman";

describe("Donald Duck - Perfect Gentleman (Set 9)", () => {
  it("has the Shift 3 keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [donaldDuckPerfectGentleman],
    });

    const cardModel = testEngine.getCardModel(donaldDuckPerfectGentleman);
    expect(cardModel.hasShift()).toBe(true);
    expect(cardModel.shiftInkCost).toBe(3);
  });

  describe("ALLOW ME - At the start of your turn, each player may draw a card", () => {
    it("each player draws when both accept the optional", () => {
      // P1 has Donald in play. ALLOW ME triggers at the start of P1's next turn.
      // Two separate bag items fire: one for P1 (CONTROLLER), one for P2 (OPPONENT).
      // After P1's passTurn: P2 gets mandatory draw → P2: hand=1, deck=4
      // After P2's passTurn: P1's turn begins, both ALLOW ME bag items fire, draw step deferred
      // P1 resolves bag item 0 (accepts): P1 draws 1 → P1: hand=1, deck=4
      // P1 resolves bag item 1 (opponent trigger): creates pending action for P2
      // P2 resolves pending (accepts): P2 draws 1 → P2: hand=2, deck=3
      // After all bag resolution: P1 mandatory draw completes → P1: hand=2, deck=3
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [donaldDuckPerfectGentleman], deck: 5 },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // P1 accepts their optional ALLOW ME draw (bag item 0: CONTROLLER trigger)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(donaldDuckPerfectGentleman, { bagIndex: 0, resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // P1 resolves the opponent's bag item (bag item 1: OPPONENT trigger) — creates P2's pending
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckPerfectGentleman),
      ).toBeSuccessfulCommand();

      // P2 accepts their optional ALLOW ME draw via the pending effect
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // P2 drew 1 from their mandatory turn draw + 1 from ALLOW ME = hand: 2, deck: 3
      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO)).toEqual(
        expect.objectContaining({ hand: 2, deck: 3 }),
      );
      // P1 drew 1 from ALLOW ME + 1 from mandatory draw step (deferred until bag resolved)
      // = hand: 2, deck: 3
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE)).toEqual(
        expect.objectContaining({ hand: 2, deck: 3 }),
      );
    });

    it("controller can decline while opponent still draws", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [donaldDuckPerfectGentleman], deck: 5 },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // P1 declines their optional ALLOW ME draw (bag item 0: CONTROLLER trigger)
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckPerfectGentleman, {
          bagIndex: 0,
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // P1 resolves the opponent's bag item (bag item 1: OPPONENT trigger) — creates P2's pending
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckPerfectGentleman),
      ).toBeSuccessfulCommand();

      // P2 accepts their optional ALLOW ME draw independently
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // P2 drew 1 mandatory + 1 ALLOW ME = hand: 2, deck: 3
      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO)).toEqual(
        expect.objectContaining({ hand: 2, deck: 3 }),
      );
      // P1 only drew 1 from mandatory draw step (declined ALLOW ME)
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE)).toEqual(
        expect.objectContaining({ hand: 1, deck: 4 }),
      );
    });

    it("opponent can decline while controller draws", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [donaldDuckPerfectGentleman], deck: 5 },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // P1 accepts their optional ALLOW ME draw (bag item 0: CONTROLLER trigger)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(donaldDuckPerfectGentleman, { bagIndex: 0, resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // P1 resolves the opponent's bag item (bag item 1: OPPONENT trigger) — creates P2's pending
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckPerfectGentleman),
      ).toBeSuccessfulCommand();

      // P2 declines their optional ALLOW ME draw independently
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // P2 only drew 1 mandatory (declined ALLOW ME)
      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO)).toEqual(
        expect.objectContaining({ hand: 1, deck: 4 }),
      );
      // P1 drew 1 ALLOW ME + 1 mandatory = hand: 2, deck: 3
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE)).toEqual(
        expect.objectContaining({ hand: 2, deck: 3 }),
      );
    });

    it("does not trigger during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {},
        { play: [donaldDuckPerfectGentleman], deck: 3 },
      );

      // At game start it is P1's turn; Donald is controlled by P2.
      // ALLOW ME fires at the start of the controller's (P2's) turn, not P1's.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
