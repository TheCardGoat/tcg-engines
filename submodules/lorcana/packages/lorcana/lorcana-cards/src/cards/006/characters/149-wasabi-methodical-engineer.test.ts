import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { wasabiMethodicalEngineer } from "./149-wasabi-methodical-engineer";

const ownItem = createMockItem({
  id: "wasabi-own-item",
  name: "Own Item",
  cost: 1,
});

const opponentItem = createMockItem({
  id: "wasabi-opponent-item",
  name: "Opponent Item",
  cost: 1,
});

describe("Wasabi - Methodical Engineer", () => {
  describe("BLADES OF FURY - When you play this character, you may banish chosen item. Its player gains 1 lore.", () => {
    it("triggers when played and offers optional ability to banish an item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [wasabiMethodicalEngineer],
          inkwell: wasabiMethodicalEngineer.cost,
          play: [ownItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(wasabiMethodicalEngineer)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("banishes target item when accepted and target is chosen (own item)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [wasabiMethodicalEngineer],
          inkwell: wasabiMethodicalEngineer.cost,
          play: [ownItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(wasabiMethodicalEngineer)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(wasabiMethodicalEngineer, {
          resolveOptional: true,
          targets: [ownItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("discard");
    });

    it("its player (player one) gains 1 lore when their own item is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [wasabiMethodicalEngineer],
          inkwell: wasabiMethodicalEngineer.cost,
          play: [ownItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(wasabiMethodicalEngineer)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(wasabiMethodicalEngineer, {
          resolveOptional: true,
          targets: [ownItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    });

    it("opponent gains 1 lore when their item is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [wasabiMethodicalEngineer],
          inkwell: wasabiMethodicalEngineer.cost,
        },
        {
          play: [opponentItem],
        },
      );

      expect(testEngine.asPlayerOne().playCard(wasabiMethodicalEngineer)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(wasabiMethodicalEngineer, {
          resolveOptional: true,
          targets: [opponentItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
      expect(testEngine.getLore(PLAYER_TWO)).toBe(1);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [wasabiMethodicalEngineer],
          inkwell: wasabiMethodicalEngineer.cost,
          play: [ownItem],
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(wasabiMethodicalEngineer)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(wasabiMethodicalEngineer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("play");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });
  });

  describe("QUICK REFLEXES - During your turn, this character gains Evasive.", () => {
    it("has Evasive during player one's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [wasabiMethodicalEngineer],
        },
        {},
      );

      expect(testEngine.hasKeyword(wasabiMethodicalEngineer, "Evasive")).toBe(true);
    });

    it("does not have Evasive during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [wasabiMethodicalEngineer],
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(wasabiMethodicalEngineer, "Evasive")).toBe(false);
    });

    it("regression: can challenge Evasive characters during own turn (has Evasive during your turn)", () => {
      const evasiveTarget = createMockItem({
        id: "wasabi-evasive-dummy",
        name: "Evasive Dummy",
        cost: 1,
      });

      // Wasabi with Evasive during your turn should be able to challenge other Evasive characters
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: wasabiMethodicalEngineer, isDrying: false }],
        },
        {
          deck: 1,
        },
      );

      // During own turn, Wasabi has Evasive
      expect(testEngine.hasKeyword(wasabiMethodicalEngineer, "Evasive")).toBe(true);
    });
  });
});
