import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { judyHoppsOptimisticOfficer } from "./152-judy-hopps-optimistic-officer";

const ownItem = createMockItem({
  id: "judy-002-own-item",
  name: "Own Item",
  cost: 1,
});

const opponentItem = createMockItem({
  id: "judy-002-opponent-item",
  name: "Opponent Item",
  cost: 1,
});

describe("Judy Hopps - Optimistic Officer", () => {
  describe("DON'T CALL ME CUTE - When you play this character, you may banish chosen item. If you do, its player draws a card.", () => {
    it("triggers when played and creates an optional bag effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [judyHoppsOptimisticOfficer],
          inkwell: judyHoppsOptimisticOfficer.cost,
          play: [ownItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(judyHoppsOptimisticOfficer)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("banishes the chosen item when the optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [judyHoppsOptimisticOfficer],
          inkwell: judyHoppsOptimisticOfficer.cost,
          play: [ownItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(judyHoppsOptimisticOfficer)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(judyHoppsOptimisticOfficer, {
          resolveOptional: true,
          targets: [ownItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("discard");
    });

    it("its player (player one) draws a card when their own item is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [judyHoppsOptimisticOfficer],
          inkwell: judyHoppsOptimisticOfficer.cost,
          play: [ownItem],
          deck: 1,
        },
        {},
      );

      const handCountBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(testEngine.asPlayerOne().playCard(judyHoppsOptimisticOfficer)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(judyHoppsOptimisticOfficer, {
          resolveOptional: true,
          targets: [ownItem],
        }),
      ).toBeSuccessfulCommand();

      // Player one played Judy (hand -1), then draws a card (hand +1) = net 0 change
      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(handCountBefore);
    });

    it("the opponent draws a card when their item is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [judyHoppsOptimisticOfficer],
          inkwell: judyHoppsOptimisticOfficer.cost,
        },
        {
          play: [opponentItem],
          deck: 1,
        },
      );

      const opponentHandCountBefore = testEngine.getCardInstanceIdsInZone(
        "hand",
        PLAYER_TWO,
      ).length;

      expect(testEngine.asPlayerOne().playCard(judyHoppsOptimisticOfficer)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(judyHoppsOptimisticOfficer, {
          resolveOptional: true,
          targets: [opponentItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO).length).toBe(
        opponentHandCountBefore + 1,
      );
    });

    it("does not banish an item and does not draw a card when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [judyHoppsOptimisticOfficer],
          inkwell: judyHoppsOptimisticOfficer.cost,
          play: [ownItem],
          deck: 1,
        },
        {},
      );

      const handCountBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(testEngine.asPlayerOne().playCard(judyHoppsOptimisticOfficer)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(judyHoppsOptimisticOfficer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("play");
      // Hand: played Judy (hand -1), no draw = net -1
      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(
        handCountBefore - 1,
      );
    });
  });
});
