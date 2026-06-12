import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { flynnRiderCharmingRogue } from "./074-flynn-rider-charming-rogue";

const attacker = createMockCharacter({
  id: "flynn-charming-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const handCard = createMockCharacter({
  id: "flynn-charming-hand-card",
  name: "Hand Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const defender = createMockCharacter({
  id: "flynn-charming-defender",
  name: "Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Flynn Rider - Charming Rogue", () => {
  describe("HERE COMES THE SMOLDER: Whenever this character is challenged, the challenging player chooses and discards a card.", () => {
    it("triggers when challenged — the challenging player must discard a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          hand: [handCard],
          deck: 1,
        },
        {
          play: [{ card: flynnRiderCharmingRogue, exerted: true }],
          deck: 1,
        },
      );

      const handCardId = testEngine.findCardInstanceId(handCard, "hand", PLAYER_ONE);

      // Player one challenges Flynn (player two's character)
      expect(
        testEngine.asPlayerOne().challenge(attacker, flynnRiderCharmingRogue),
      ).toBeSuccessfulCommand();

      // The challenged trigger should fire as a bag effect
      const p1BagCount = testEngine.asPlayerOne().getBagCount();
      const p2BagCount = testEngine.asPlayerTwo().getBagCount();
      expect(p1BagCount + p2BagCount).toBeGreaterThan(0);

      // Resolve the bag effect (owned by Flynn's controller, player two)
      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(flynnRiderCharmingRogue),
      ).toBeSuccessfulCommand();

      // The challenging player (player one) must choose a card to discard
      expect(testEngine.asPlayerOne().respondWith(handCardId)).toBeSuccessfulCommand();

      // Player one should have discarded the chosen card
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("discard");
    });

    it("does not trigger when attacking (only when being challenged)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: defender, exerted: true }],
          hand: [handCard],
          deck: 2,
        },
        {
          play: [{ card: flynnRiderCharmingRogue, isDrying: false }],
          deck: 2,
        },
      );

      // Pass turn so player_two gets priority
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(flynnRiderCharmingRogue, defender),
      ).toBeSuccessfulCommand();

      // Flynn is the attacker here, so the trigger should NOT fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      // Player one's hand should remain intact
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(1);
    });

    it("regression: discard does NOT trigger when Flynn challenges (only when Flynn is challenged)", () => {
      const p2HandCard = createMockCharacter({
        id: "flynn-p2-hand-card",
        name: "P2 Hand Card",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: defender, exerted: true }],
          hand: [handCard],
          deck: 2,
        },
        {
          play: [{ card: flynnRiderCharmingRogue, isDrying: false }],
          hand: [p2HandCard],
          deck: 2,
        },
      );

      // Pass to P2's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Flynn (P2) challenges defender (P1) — Flynn is the ATTACKER, not being challenged
      expect(
        testEngine.asPlayerTwo().challenge(flynnRiderCharmingRogue, defender),
      ).toBeSuccessfulCommand();

      // No bag effects should fire — trigger is "when this character IS CHALLENGED"
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);

      // Neither player should have had to discard
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(1);
      expect(testEngine.asPlayerTwo().getCardZone(p2HandCard)).toBe("hand");
    });

    it("works when the challenging player has no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          hand: [],
          deck: 1,
        },
        {
          play: [{ card: flynnRiderCharmingRogue, exerted: true }],
          deck: 1,
        },
      );

      // Challenge with no cards in hand
      expect(
        testEngine.asPlayerOne().challenge(attacker, flynnRiderCharmingRogue),
      ).toBeSuccessfulCommand();

      // The trigger fires but the discard auto-resolves since there are no cards in hand
      const p2BagCount = testEngine.asPlayerTwo().getBagCount();
      if (p2BagCount > 0) {
        const bagEffects = testEngine.asPlayerTwo().getBagEffects();
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(flynnRiderCharmingRogue),
        ).toBeSuccessfulCommand();
      }

      // Should resolve cleanly even with 0 cards
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(0);
    });
  });
});
