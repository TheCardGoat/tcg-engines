import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { anastasiaBossyStepsister } from "./113-anastasia-bossy-stepsister";

const attacker = createMockCharacter({
  id: "anastasia-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const handCard = createMockCharacter({
  id: "anastasia-hand-card",
  name: "Hand Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const defender = createMockCharacter({
  id: "anastasia-defender",
  name: "Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Anastasia - Bossy Stepsister", () => {
  describe("OH, I HATE THIS!: Whenever this character is challenged, the challenging player chooses and discards a card.", () => {
    it("triggers when challenged — the challenging player must discard a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          hand: [handCard],
          deck: 1,
        },
        {
          play: [{ card: anastasiaBossyStepsister, exerted: true }],
          deck: 1,
        },
      );

      const handCardId = testEngine.findCardInstanceId(handCard, "hand", PLAYER_ONE);

      // Player one challenges Anastasia (player two's character)
      expect(
        testEngine.asPlayerOne().challenge(attacker, anastasiaBossyStepsister),
      ).toBeSuccessfulCommand();

      // The challenged trigger should fire as a bag effect
      const p1BagCount = testEngine.asPlayerOne().getBagCount();
      const p2BagCount = testEngine.asPlayerTwo().getBagCount();
      expect(p1BagCount + p2BagCount).toBeGreaterThan(0);

      // Resolve the bag effect (owned by Anastasia's controller, player two)
      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(anastasiaBossyStepsister),
      ).toBeSuccessfulCommand();

      // The challenging player (player one) must choose a card to discard
      expect(testEngine.asPlayerOne().respondWith(handCardId)).toBeSuccessfulCommand();

      // Player one should have discarded the chosen card
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("discard");
    });

    it("challenging player can resolve the bag directly when they own the opposing Anastasia trigger", () => {
      // Player one owns Anastasia; player two is the challenger who must discard.
      // This is the regression scenario for bug-16: the challenging player (player two)
      // is the directBagChooser and must be able to resolve the bag themselves.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: anastasiaBossyStepsister, exerted: true }],
          deck: 1,
        },
        {
          play: [{ card: attacker, isDrying: false }],
          hand: [handCard],
          deck: 0,
        },
      );

      const handCardId = testEngine.findCardInstanceId(handCard, "hand", PLAYER_TWO);

      // Pass so player two gets priority to challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two challenges player one's Anastasia
      expect(
        testEngine.asPlayerTwo().challenge(attacker, anastasiaBossyStepsister),
      ).toBeSuccessfulCommand();

      // Bag should have triggered
      const totalBag =
        testEngine.asPlayerOne().getBagCount() + testEngine.asPlayerTwo().getBagCount();
      expect(totalBag).toBeGreaterThan(0);

      // The challenging player (player two) must be able to resolve the bag directly
      // (they are the direct chooser for the CHALLENGING_PLAYER discard effect)
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(anastasiaBossyStepsister),
      ).toBeSuccessfulCommand();

      // Player two must now choose a card to discard
      expect(testEngine.asPlayerTwo().respondWith(handCardId)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).hand).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(handCard)).toBe("discard");
    });

    it("does not trigger when Anastasia is the attacker", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: defender, exerted: true }],
          hand: [handCard],
          deck: 2,
        },
        {
          play: [{ card: anastasiaBossyStepsister, isDrying: false }],
          deck: 2,
        },
      );

      // Pass turn so player two gets priority
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two attacks with Anastasia (Anastasia is the attacker, not being challenged)
      expect(
        testEngine.asPlayerTwo().challenge(anastasiaBossyStepsister, defender),
      ).toBeSuccessfulCommand();

      // The trigger should NOT fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      // Player one's hand should remain intact
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(1);
    });

    it("works when the challenging player has no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          hand: [],
          deck: 1,
        },
        {
          play: [{ card: anastasiaBossyStepsister, exerted: true }],
          deck: 1,
        },
      );

      // Challenge with no cards in hand
      expect(
        testEngine.asPlayerOne().challenge(attacker, anastasiaBossyStepsister),
      ).toBeSuccessfulCommand();

      // The trigger fires but the discard auto-resolves since there are no cards in hand
      const p2BagCount = testEngine.asPlayerTwo().getBagCount();
      if (p2BagCount > 0) {
        const bagEffects = testEngine.asPlayerTwo().getBagEffects();
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(anastasiaBossyStepsister),
        ).toBeSuccessfulCommand();
      }

      // Should resolve cleanly even with 0 cards
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(0);
    });
  });
});
