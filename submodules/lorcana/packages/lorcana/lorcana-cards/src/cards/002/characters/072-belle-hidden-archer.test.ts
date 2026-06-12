import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { belleHiddenArcher } from "./072-belle-hidden-archer";

const attacker = createMockCharacter({
  id: "belle-hidden-attacker",
  name: "Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
});

const handCard = createMockCharacter({
  id: "belle-hidden-hand-card",
  name: "Hand Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const handCard2 = createMockCharacter({
  id: "belle-hidden-hand-card-2",
  name: "Hand Card 2",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const handCard3 = createMockCharacter({
  id: "belle-hidden-hand-card-3",
  name: "Hand Card 3",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const defender = createMockCharacter({
  id: "belle-hidden-defender",
  name: "Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Belle - Hidden Archer", () => {
  describe("Shift 3", () => {
    it("has Shift keyword ability", () => {
      const shiftAbility = belleHiddenArcher.abilities?.find(
        (a) => a.type === "keyword" && a.keyword === "Shift",
      );
      expect(shiftAbility).toBeDefined();
    });
  });

  describe("THORNY ARROWS: Whenever this character is challenged, the challenging character's player discards all cards in their hand.", () => {
    it("as defender, the challenging player discards all cards in their hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          hand: [handCard, handCard2, handCard3],
          deck: 1,
        },
        {
          play: [{ card: belleHiddenArcher, exerted: true }],
          deck: 1,
        },
      );

      // Player one challenges Belle (player two's character)
      expect(
        testEngine.asPlayerOne().challenge(attacker, belleHiddenArcher),
      ).toBeSuccessfulCommand();

      // The triggered ability fires - resolve the bag effect
      const p1BagCount = testEngine.asPlayerOne().getBagCount();
      const p2BagCount = testEngine.asPlayerTwo().getBagCount();

      // One of the players should have a bag effect to resolve
      if (p1BagCount + p2BagCount > 0) {
        // Resolve all bag effects
        for (const bagEffect of testEngine.asPlayerOne().getBagEffects()) {
          testEngine.asPlayerOne().resolvePendingByCard(belleHiddenArcher);
        }
        for (const bagEffect of testEngine.asPlayerTwo().getBagEffects()) {
          testEngine.asPlayerTwo().resolvePendingByCard(belleHiddenArcher);
        }
      }

      // Player one (the challenging player) should have 0 cards in hand
      // All 3 hand cards should have been discarded
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBeGreaterThanOrEqual(3);
    });

    it("as attacker, does not trigger (only triggers when being challenged)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: defender, exerted: true }],
          hand: [handCard, handCard2, handCard3],
          deck: 2,
        },
        {
          play: [{ card: belleHiddenArcher, isDrying: false }],
          deck: 2,
        },
      );

      // Pass turn so player two gets priority
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two attacks with Belle (Belle is the attacker, not being challenged)
      expect(
        testEngine.asPlayerTwo().challenge(belleHiddenArcher, defender),
      ).toBeSuccessfulCommand();

      // The trigger should NOT fire - player one's hand should remain intact
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    });

    it("regression: does not trigger when a DIFFERENT character on the same side is challenged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          hand: [handCard, handCard2, handCard3],
          deck: 1,
        },
        {
          play: [belleHiddenArcher, { card: defender, exerted: true }],
          deck: 1,
        },
      );

      // Player one challenges the defender (NOT Belle)
      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      // Belle's THORNY ARROWS should NOT trigger because Belle was not challenged
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    });

    it("works when the challenging player has no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          hand: [],
          deck: 1,
        },
        {
          play: [{ card: belleHiddenArcher, exerted: true }],
          deck: 1,
        },
      );

      // Challenge with no cards in hand
      expect(
        testEngine.asPlayerOne().challenge(attacker, belleHiddenArcher),
      ).toBeSuccessfulCommand();

      // Resolve any triggered effects
      const p1BagCount = testEngine.asPlayerOne().getBagCount();
      const p2BagCount = testEngine.asPlayerTwo().getBagCount();
      if (p1BagCount + p2BagCount > 0) {
        for (const bagEffect of testEngine.asPlayerOne().getBagEffects()) {
          testEngine.asPlayerOne().resolvePendingByCard(belleHiddenArcher);
        }
        for (const bagEffect of testEngine.asPlayerTwo().getBagEffects()) {
          testEngine.asPlayerTwo().resolvePendingByCard(belleHiddenArcher);
        }
      }

      // Should still resolve cleanly even with 0 cards
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });
  });
});
