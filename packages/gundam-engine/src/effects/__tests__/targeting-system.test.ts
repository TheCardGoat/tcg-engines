/**
 * Tests for the new targeting system (TargetingSpec/TargetFilter)
 */

import { describe, expect, it } from "bun:test";
import type { CardId, PlayerId } from "@tcg/core";
import { createCardId, createPlayerId } from "@tcg/core";
import type { BaseEffectCardDefinition } from "@tcg/gundam-types/effects";
import { createTestState, type TestZoneData } from "../../testing/test-helpers";
import type { GundamGameState } from "../../types";
import {
  enumerateValidTargets,
  filterCardsByZone,
  getAllCardsInGame,
  getCardDamage,
  getCardOwner,
  getCardsInZone,
  getCardsOwnedByPlayer,
  getOpponentId,
  hasTrait,
  isCardDamaged,
  isCardInZone as isCardInZoneCheck,
  isCardRested,
  matchesCardFilter,
  matchesCardType,
  matchesColor,
  matchesCostFilter,
  matchesFilter,
  matchesLevelFilter,
  matchesPropertyFilter,
  matchesStateFilter,
  type TargetingContext,
  validateTargets,
} from "../targeting-system";

const PLAYER_1 = createPlayerId("player-1");
const PLAYER_2 = createPlayerId("player-2");
const UNIT_1 = createCardId("unit-1");
const UNIT_2 = createCardId("unit-2");
const UNIT_3 = createCardId("unit-3");

// Mock card definitions for testing
const MOCK_CARD_DEFINITIONS: Record<CardId, BaseEffectCardDefinition> = {
  [UNIT_1]: {
    id: UNIT_1,
    name: "Test Unit 1",
    cardType: "UNIT",
    lv: 1,
    cost: 2,
    effects: [],
  },
  [UNIT_2]: {
    id: UNIT_2,
    name: "Test Unit 2",
    cardType: "UNIT",
    lv: 1,
    cost: 2,
    effects: [],
  },
  [UNIT_3]: {
    id: UNIT_3,
    name: "Test Unit 3",
    cardType: "UNIT",
    lv: 1,
    cost: 2,
    effects: [],
  },
};

// Helper to create a targeting context
function createContext(
  controllerId: PlayerId,
  sourceCardId: CardId,
  cardDefinitions?: Record<CardId, BaseEffectCardDefinition>,
): TargetingContext {
  return {
    controllerId,
    sourceCardId,
    cardDefinitions: cardDefinitions ?? MOCK_CARD_DEFINITIONS,
  };
}

describe("matchesFilter", () => {
  describe("zone filtering", () => {
    it("should match cards in specified zone", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        battleAreaCards: { [PLAYER_1]: [UNIT_1, UNIT_2], [PLAYER_2]: [] },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "unit", zone: "battleArea", owner: "self" },
        context,
      );

      expect(result).toBe(true);
    });

    it("should not match cards in different zone", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        handCards: { [PLAYER_1]: [], [PLAYER_2]: [UNIT_3] },
        battleAreaCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [] },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_3,
        { type: "card", zone: "battleArea", owner: "opponent" },
        context,
      );

      expect(result).toBe(false);
    });
  });

  describe("owner filtering", () => {
    it("should match cards owned by self", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        battleAreaCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [UNIT_2] },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "unit", owner: "self" },
        context,
      );

      expect(result).toBe(true);
    });

    it("should match cards owned by opponent", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        battleAreaCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [UNIT_2] },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_2,
        { type: "unit", owner: "opponent" },
        context,
      );

      expect(result).toBe(true);
    });
  });

  describe("state filtering", () => {
    it("should match rested cards", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        battleAreaCards: { [PLAYER_1]: [UNIT_1, UNIT_2], [PLAYER_2]: [] },
        cardPositions: { [UNIT_1]: "active", [UNIT_2]: "rested" },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_2,
        { type: "unit", owner: "self", state: { rested: true } },
        context,
      );

      expect(result).toBe(true);
    });

    it("should match active cards", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        battleAreaCards: { [PLAYER_1]: [UNIT_1, UNIT_2], [PLAYER_2]: [] },
        cardPositions: { [UNIT_1]: "active", [UNIT_2]: "rested" },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "unit", owner: "self", state: { rested: false } },
        context,
      );

      expect(result).toBe(true);
    });
  });
});

describe("enumerateValidTargets", () => {
  it("should enumerate all valid targets", () => {
    const state = createTestState({
      players: [PLAYER_1, PLAYER_2],
      battleAreaCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [UNIT_2] },
    });

    const context = createContext(PLAYER_1, UNIT_1);

    const targets = enumerateValidTargets(
      state,
      {
        count: 1,
        validTargets: [{ type: "unit", owner: "any" }],
        chooser: "controller",
        timing: "on_declaration",
      },
      context,
    );

    expect(targets).toContain(UNIT_1);
    expect(targets).toContain(UNIT_2);
  });

  it("should filter targets by owner", () => {
    const state = createTestState({
      players: [PLAYER_1, PLAYER_2],
      battleAreaCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [UNIT_2] },
    });

    const context = createContext(PLAYER_1, UNIT_1);

    const targets = enumerateValidTargets(
      state,
      {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_declaration",
      },
      context,
    );

    expect(targets).toContain(UNIT_1);
    expect(targets).not.toContain(UNIT_2);
  });
});

describe("validateTargets", () => {
  it("should validate correct number of targets", () => {
    const state = createTestState({
      players: [PLAYER_1, PLAYER_2],
      battleAreaCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [] },
    });

    const context = createContext(PLAYER_1, UNIT_1);

    const result = validateTargets(
      state,
      {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_declaration",
      },
      [UNIT_1],
      context,
    );

    expect(result).toBe(true);
  });

  it("should reject wrong number of targets", () => {
    const state = createTestState({
      players: [PLAYER_1, PLAYER_2],
      battleAreaCards: { [PLAYER_1]: [UNIT_1, UNIT_2], [PLAYER_2]: [] },
    });

    const context = createContext(PLAYER_1, UNIT_1);

    const result = validateTargets(
      state,
      {
        count: 2,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_declaration",
      },
      [UNIT_1],
      context,
    );

    expect(result).toBe(false);
  });
});

describe("helper functions", () => {
  describe("getCardOwner", () => {
    it("should return owner of card in battle area", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        battleAreaCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [] },
      });

      expect(getCardOwner(state, UNIT_1)).toBe(PLAYER_1);
    });

    it("should return undefined for card not found", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
      });

      expect(getCardOwner(state, UNIT_1)).toBeUndefined();
    });
  });

  describe("getOpponentId", () => {
    it("should return opponent player ID", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
      });

      expect(getOpponentId(state, PLAYER_1)).toBe(PLAYER_2);
      expect(getOpponentId(state, PLAYER_2)).toBe(PLAYER_1);
    });
  });

  describe("isCardRested", () => {
    it("should return true for rested card", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        battleAreaCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [] },
        cardPositions: { [UNIT_1]: "rested" },
      });

      expect(isCardRested(state, UNIT_1)).toBe(true);
    });

    it("should return false for active card", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        battleAreaCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [] },
        cardPositions: { [UNIT_1]: "active" },
      });

      expect(isCardRested(state, UNIT_1)).toBe(false);
    });
  });

  describe("getCardDamage", () => {
    it("should return damage from card meta", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        battleAreaCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [] },
        cardMetas: { [UNIT_1]: { damage: 2 } },
      });

      expect(getCardDamage(state, UNIT_1)).toBe(2);
    });

    it("should return 0 for undamaged card", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        battleAreaCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [] },
      });

      expect(getCardDamage(state, UNIT_1)).toBe(0);
    });
  });

  describe("getAllCardsInGame", () => {
    it("should return all cards in all zones", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        handCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [] },
        battleAreaCards: { [PLAYER_1]: [], [PLAYER_2]: [UNIT_2] },
      });

      const allCards = getAllCardsInGame(state);
      expect(allCards).toContain(UNIT_1);
      expect(allCards).toContain(UNIT_2);
    });
  });

  describe("getCardsOwnedByPlayer", () => {
    it("should return cards owned by specific player", () => {
      const state = createTestState({
        players: [PLAYER_1, PLAYER_2],
        handCards: { [PLAYER_1]: [UNIT_1], [PLAYER_2]: [] },
        battleAreaCards: { [PLAYER_1]: [], [PLAYER_2]: [UNIT_2] },
      });

      const p1Cards = getCardsOwnedByPlayer(state, PLAYER_1);
      expect(p1Cards).toContain(UNIT_1);
      expect(p1Cards).not.toContain(UNIT_2);
    });
  });
});
