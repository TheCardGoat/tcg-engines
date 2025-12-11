/**
 * Spec 2: Zones & Card States Test Suite
 *
 * Tests for zone configuration and card state management per Lorcana rules.
 */

import { describe, expect, it } from "bun:test";
import type { CardId } from "@tcg/core";
import {
  addDamage,
  type CardInstanceState,
  clearDrying,
  createCardInstanceState,
  createStack,
  exertCard,
  getDamage,
  getStackCardIds,
  isDamaged,
  isDry,
  isDrying,
  isExerted,
  isInStack,
  isReady,
  isTopOfStack,
  isUnderCard,
  readyCard,
  removeDamage,
  setDrying,
} from "../zones/card-state";
import {
  areCardsVisibleIn,
  getZoneConfig,
  isLorcanaZoneId,
  isZoneVisibleTo,
  LORCANA_ZONES,
  type LorcanaZoneId,
} from "../zones/zone-config";

// Helper to create card IDs
const cardId = (id: string): CardId => id as CardId;

describe("Spec 2: Zones & Card States", () => {
  describe("Zone Visibility (Rule 8.1)", () => {
    it("deck is private - only owner can see contents (Rule 8.2)", () => {
      const config = getZoneConfig("deck");
      expect(config.visibility).toBe("private");
      expect(config.faceDown).toBe(true);
      expect(config.ordered).toBe(true);

      // Owner can see
      expect(isZoneVisibleTo("deck", "player1", "player1")).toBe(true);
      // Opponent cannot see
      expect(isZoneVisibleTo("deck", "player1", "player2")).toBe(false);
    });

    it("hand is private - only owner can see contents (Rule 8.3)", () => {
      const config = getZoneConfig("hand");
      expect(config.visibility).toBe("private");

      expect(isZoneVisibleTo("hand", "player1", "player1")).toBe(true);
      expect(isZoneVisibleTo("hand", "player1", "player2")).toBe(false);
    });

    it("play is public - all players see cards (Rule 8.4)", () => {
      const config = getZoneConfig("play");
      expect(config.visibility).toBe("public");
      expect(config.faceDown).toBe(false);

      expect(isZoneVisibleTo("play", "player1", "player1")).toBe(true);
      expect(isZoneVisibleTo("play", "player1", "player2")).toBe(true);
    });

    it("inkwell count is public, card identity is hidden (Rule 8.5)", () => {
      const config = getZoneConfig("inkwell");
      expect(config.visibility).toBe("hidden_identity");
      expect(config.faceDown).toBe(true);

      // Card identities are not visible
      expect(areCardsVisibleIn("inkwell", "player1", "player1")).toBe(false);
      expect(areCardsVisibleIn("inkwell", "player1", "player2")).toBe(false);
    });

    it("discard is public - all players see all cards (Rule 8.6)", () => {
      const config = getZoneConfig("discard");
      expect(config.visibility).toBe("public");
      expect(config.faceDown).toBe(false);

      expect(areCardsVisibleIn("discard", "player1", "player1")).toBe(true);
      expect(areCardsVisibleIn("discard", "player1", "player2")).toBe(true);
    });
  });

  describe("Zone Ordering", () => {
    it("deck is ordered - has top and bottom (Rule 8.2)", () => {
      const config = getZoneConfig("deck");
      expect(config.ordered).toBe(true);
    });

    it("other zones are unordered", () => {
      expect(getZoneConfig("hand").ordered).toBe(false);
      expect(getZoneConfig("play").ordered).toBe(false);
      expect(getZoneConfig("inkwell").ordered).toBe(false);
      expect(getZoneConfig("discard").ordered).toBe(false);
    });
  });

  describe("Zone ID Validation", () => {
    it("validates correct zone IDs", () => {
      expect(isLorcanaZoneId("deck")).toBe(true);
      expect(isLorcanaZoneId("hand")).toBe(true);
      expect(isLorcanaZoneId("play")).toBe(true);
      expect(isLorcanaZoneId("inkwell")).toBe(true);
      expect(isLorcanaZoneId("discard")).toBe(true);
    });

    it("rejects invalid zone IDs", () => {
      expect(isLorcanaZoneId("graveyard")).toBe(false);
      expect(isLorcanaZoneId("exile")).toBe(false);
      expect(isLorcanaZoneId("")).toBe(false);
      expect(isLorcanaZoneId(123)).toBe(false);
    });
  });

  describe("Card States (Rule 5.1)", () => {
    it("cards enter play ready (Rule 5.1.1)", () => {
      const state = createCardInstanceState(cardId("card-1"));
      expect(isReady(state)).toBe(true);
      expect(isExerted(state)).toBe(false);
    });

    it("exerting turns card sideways (Rule 5.1.2)", () => {
      const state = createCardInstanceState(cardId("card-1"));
      const exertedState = exertCard(state);

      expect(isExerted(exertedState)).toBe(true);
      expect(isReady(exertedState)).toBe(false);
    });

    it("readying returns card to upright position", () => {
      const state = exertCard(createCardInstanceState(cardId("card-1")));
      const readiedState = readyCard(state);

      expect(isReady(readiedState)).toBe(true);
      expect(isExerted(readiedState)).toBe(false);
    });

    it("damaged cards have 1+ damage counters (Rule 5.1.3)", () => {
      const state = createCardInstanceState(cardId("card-1"));
      const damagedState = addDamage(state, 2);

      expect(isDamaged(damagedState)).toBe(true);
      expect(getDamage(damagedState)).toBe(2);
    });

    it("undamaged cards have 0 damage (Rule 5.1.4)", () => {
      const state = createCardInstanceState(cardId("card-1"));

      expect(isDamaged(state)).toBe(false);
      expect(getDamage(state)).toBe(0);
    });

    it("damage can be removed", () => {
      const state = addDamage(createCardInstanceState(cardId("card-1")), 5);
      const healedState = removeDamage(state, 3);

      expect(getDamage(healedState)).toBe(2);
    });

    it("damage cannot go below 0", () => {
      const state = addDamage(createCardInstanceState(cardId("card-1")), 2);
      const overHealedState = removeDamage(state, 10);

      expect(getDamage(overHealedState)).toBe(0);
    });
  });

  describe("Drying State", () => {
    it("characters are drying when they enter play", () => {
      const state = createCardInstanceState(cardId("card-1"));

      expect(isDrying(state)).toBe(true);
      expect(isDry(state)).toBe(false);
    });

    it("characters can be set to dry (clear drying)", () => {
      const state = createCardInstanceState(cardId("card-1"));
      const dryState = clearDrying(state);

      expect(isDrying(dryState)).toBe(false);
      expect(isDry(dryState)).toBe(true);
    });

    it("can create non-drying cards (e.g., items)", () => {
      const state = createCardInstanceState(cardId("item-1"), {
        isDrying: false,
      });

      expect(isDrying(state)).toBe(false);
      expect(isDry(state)).toBe(true);
    });

    it("setDrying can change drying state", () => {
      const state = createCardInstanceState(cardId("card-1"));
      const dryState = setDrying(state, false);
      const dryingAgain = setDrying(dryState, true);

      expect(isDrying(dryState)).toBe(false);
      expect(isDrying(dryingAgain)).toBe(true);
    });
  });

  describe("Stacks (Rule 5.1.5-5.1.7)", () => {
    it("shifting creates a stack", () => {
      const topState = createCardInstanceState(cardId("shifted-card"));
      const underState = createCardInstanceState(cardId("original-card"));

      const { topCard, underneathCard } = createStack(topState, underState);

      expect(isInStack(topCard)).toBe(true);
      expect(isInStack(underneathCard)).toBe(true);
    });

    it("only top card is accessible in stack (Rule 5.1.5)", () => {
      const topState = createCardInstanceState(cardId("shifted-card"));
      const underState = createCardInstanceState(cardId("original-card"));

      const { topCard, underneathCard } = createStack(topState, underState);

      expect(isTopOfStack(topCard)).toBe(true);
      expect(isTopOfStack(underneathCard)).toBe(false);
      expect(isUnderCard(underneathCard)).toBe(true);
    });

    it("damage carries over from underneath character (Rule 10.8.x)", () => {
      const topState = createCardInstanceState(cardId("shifted-card"));
      const underState = addDamage(
        createCardInstanceState(cardId("original-card")),
        3,
      );

      const { topCard } = createStack(topState, underState);

      expect(getDamage(topCard)).toBe(3);
    });

    it("shifted character is ready (Rule 10.8.x)", () => {
      const topState = createCardInstanceState(cardId("shifted-card"));
      const underState = exertCard(
        createCardInstanceState(cardId("original-card")),
      );

      const { topCard } = createStack(topState, underState);

      expect(isReady(topCard)).toBe(true);
      expect(isDrying(topCard)).toBe(false);
    });

    it("getStackCardIds returns all cards in stack", () => {
      const topState = createCardInstanceState(cardId("shifted-card"));
      const underState = createCardInstanceState(cardId("original-card"));

      const { topCard } = createStack(topState, underState);
      const stackIds = getStackCardIds(topCard);

      expect(stackIds).toContain(cardId("shifted-card"));
      expect(stackIds).toContain(cardId("original-card"));
      expect(stackIds).toHaveLength(2);
    });

    it("cards not in stack return only themselves", () => {
      const state = createCardInstanceState(cardId("solo-card"));
      const stackIds = getStackCardIds(state);

      expect(stackIds).toEqual([cardId("solo-card")]);
    });
  });

  describe("Zone Configuration Access", () => {
    it("all zone configs are accessible", () => {
      const zones: LorcanaZoneId[] = [
        "deck",
        "hand",
        "play",
        "inkwell",
        "discard",
      ];

      for (const zone of zones) {
        const config = LORCANA_ZONES[zone];
        expect(config).toBeDefined();
        expect(config.id).toBe(zone);
      }
    });
  });
});
