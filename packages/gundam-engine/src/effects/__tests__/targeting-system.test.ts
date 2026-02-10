/**
 * Tests for the new targeting system (TargetingSpec/TargetFilter)
 */

import { describe, expect, it } from "bun:test";
import { createCardId, createPlayerId } from "@tcg/core";
import type { GundamGameState } from "../../types";
import type { BaseEffectCardDefinition } from "../../types/effects";
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

// Helper to create a minimal game state
function createMockGameState(
  players: string[],
  zones: Record<string, Record<string, { cards: string[] }>>,
  cardPositions: Record<string, "active" | "rested"> = {},
  temporaryModifiers: Record<string, unknown[]> = {},
): GundamGameState {
  // Transform the simplified zone structure to proper Zone structure
  const transformedZones: Record<
    string,
    Record<
      string,
      {
        config: {
          id: string;
          name: string;
          visibility: string;
          ordered: boolean;
          owner: string;
          faceDown?: boolean;
          maxSize?: number;
        };
        cards: string[];
      }
    >
  > = {};

  for (const [zoneType, playerZones] of Object.entries(zones)) {
    transformedZones[zoneType] = {};
    for (const [playerId, zoneData] of Object.entries(playerZones)) {
      transformedZones[zoneType][playerId] = {
        config: {
          id: `${zoneType}-${playerId}`,
          name: zoneType,
          visibility: "public",
          ordered: false,
          owner: playerId,
          faceDown:
            zoneType === "deck" ||
            zoneType === "resourceDeck" ||
            zoneType === "shieldSection",
          maxSize:
            zoneType === "battleArea"
              ? 6
              : zoneType === "hand"
                ? 10
                : zoneType === "baseSection"
                  ? 1
                  : zoneType === "resourceArea"
                    ? 15
                    : undefined,
        },
        cards: zoneData.cards,
      };
    }
  }

  return {
    players: players as [string, ...string[]],
    currentPlayer: players[0] as string,
    turn: 1,
    phase: "main",
    zones: transformedZones as GundamGameState["zones"],
    gundam: {
      activeResources: {},
      cardPositions,
      attackedThisTurn: [],
      hasPlayedResourceThisTurn: {},
      effectStack: {
        stack: [],
        nextInstanceId: 0,
      },
      temporaryModifiers:
        temporaryModifiers as GundamGameState["gundam"]["temporaryModifiers"],
    },
  };
}

// Helper to create a mock card definition
function createMockCardDefinition(
  overrides: Partial<BaseEffectCardDefinition> = {},
): BaseEffectCardDefinition {
  return {
    id: "card-001",
    name: "Test Unit",
    cardType: "UNIT",
    lv: 2,
    cost: 3,
    text: "Test card",
    effects: [],
    ...overrides,
  };
}

// Helper to create a targeting context
function createContext(
  controllerId: string,
  sourceCardId: string,
  cardDefinitions?: Record<string, BaseEffectCardDefinition>,
): TargetingContext {
  return {
    controllerId,
    sourceCardId,
    cardDefinitions,
  };
}

const PLAYER_1 = "player-1" as const;
const PLAYER_2 = "player-2" as const;
const UNIT_1 = "unit-1" as const;
const UNIT_2 = "unit-2" as const;
const UNIT_3 = "unit-3" as const;
const BASE_1 = "base-1" as const;
const SHIELD_1 = "shield-1" as const;

describe("matchesFilter", () => {
  describe("zone filtering", () => {
    it("should match cards in specified zone", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1, UNIT_2] },
          [PLAYER_2]: { cards: [] },
        },
        hand: {
          [PLAYER_1]: { cards: [] },
          [PLAYER_2]: { cards: [UNIT_3] },
        },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "card", zone: "battleArea", owner: "self" },
        context,
      );

      expect(result).toBe(true);
    });

    it("should not match cards in different zone", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [] },
          [PLAYER_2]: { cards: [] },
        },
        hand: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "card", zone: "battleArea", owner: "self" },
        context,
      );

      expect(result).toBe(false);
    });
  });

  describe("state filtering", () => {
    it("should match rested cards when rested=true", () => {
      const state = createMockGameState(
        [PLAYER_1, PLAYER_2],
        {
          battleArea: {
            [PLAYER_1]: { cards: [UNIT_1] },
            [PLAYER_2]: { cards: [] },
          },
        },
        { [UNIT_1]: "rested" },
      );

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "card", owner: "self", state: { rested: true } },
        context,
      );

      expect(result).toBe(true);
    });

    it("should not match rested cards when rested=false", () => {
      const state = createMockGameState(
        [PLAYER_1, PLAYER_2],
        {
          battleArea: {
            [PLAYER_1]: { cards: [UNIT_1] },
            [PLAYER_2]: { cards: [] },
          },
        },
        { [UNIT_1]: "rested" },
      );

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "card", owner: "self", state: { rested: false } },
        context,
      );

      expect(result).toBe(false);
    });

    it("should match active cards when rested=false", () => {
      const state = createMockGameState(
        [PLAYER_1, PLAYER_2],
        {
          battleArea: {
            [PLAYER_1]: { cards: [UNIT_1] },
            [PLAYER_2]: { cards: [] },
          },
        },
        { [UNIT_1]: "active" },
      );

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "card", owner: "self", state: { rested: false } },
        context,
      );

      expect(result).toBe(true);
    });
  });

  describe("property filtering", () => {
    it("should match cards by card type", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const cardDefs: Record<string, BaseEffectCardDefinition> = {
        [UNIT_1]: createMockCardDefinition({ cardType: "UNIT" }),
      };

      const context = createContext(PLAYER_1, UNIT_1, cardDefs);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "unit", owner: "self", properties: { cardType: "UNIT" } },
        context,
      );

      expect(result).toBe(true);
    });

    it("should not mismatch cards by card type", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        baseSection: {
          [PLAYER_1]: { cards: [BASE_1] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const cardDefs: Record<string, BaseEffectCardDefinition> = {
        [BASE_1]: createMockCardDefinition({ cardType: "BASE" }),
      };

      const context = createContext(PLAYER_1, BASE_1, cardDefs);

      const result = matchesFilter(
        state,
        BASE_1,
        { type: "unit", owner: "self", properties: { cardType: "UNIT" } },
        context,
      );

      expect(result).toBe(false);
    });

    it("should match cards by color", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const cardDefs: Record<string, BaseEffectCardDefinition> = {
        [UNIT_1]: { ...createMockCardDefinition(), color: "Red" as const },
      };

      const context = createContext(PLAYER_1, UNIT_1, cardDefs);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "card", owner: "self", properties: { color: "Red" } },
        context,
      );

      expect(result).toBe(true);
    });

    it("should match cards by traits", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const cardDefs: Record<string, BaseEffectCardDefinition> = {
        [UNIT_1]: {
          ...createMockCardDefinition(),
          traits: ["Zeon", "Mobile Suit"],
        },
      };

      const context = createContext(PLAYER_1, UNIT_1, cardDefs);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "card", owner: "self", properties: { trait: ["Zeon"] } },
        context,
      );

      expect(result).toBe(true);
    });

    it("should require all traits to match", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const cardDefs: Record<string, BaseEffectCardDefinition> = {
        [UNIT_1]: {
          ...createMockCardDefinition(),
          traits: ["Zeon", "Mobile Suit"],
        },
      };

      const context = createContext(PLAYER_1, UNIT_1, cardDefs);

      const result = matchesFilter(
        state,
        UNIT_1,
        {
          type: "card",
          owner: "self",
          properties: { trait: ["Zeon", "NewType"] },
        },
        context,
      );

      expect(result).toBe(false);
    });

    it("should match cards by cost range (min)", () => {
      const cardDefs: Record<string, BaseEffectCardDefinition> = {
        [UNIT_1]: createMockCardDefinition({ cost: 3 }),
      };

      expect(matchesCostFilter(cardDefs[UNIT_1], { min: 2 })).toBe(true);
      expect(matchesCostFilter(cardDefs[UNIT_1], { min: 4 })).toBe(false);
    });

    it("should match cards by cost range (max)", () => {
      const cardDefs: Record<string, BaseEffectCardDefinition> = {
        [UNIT_1]: createMockCardDefinition({ cost: 3 }),
      };

      expect(matchesCostFilter(cardDefs[UNIT_1], { max: 4 })).toBe(true);
      expect(matchesCostFilter(cardDefs[UNIT_1], { max: 2 })).toBe(false);
    });

    it("should match cards by cost range (exactly)", () => {
      const cardDefs: Record<string, BaseEffectCardDefinition> = {
        [UNIT_1]: createMockCardDefinition({ cost: 3 }),
      };

      expect(matchesCostFilter(cardDefs[UNIT_1], { exactly: 3 })).toBe(true);
      expect(matchesCostFilter(cardDefs[UNIT_1], { exactly: 2 })).toBe(false);
    });

    it("should match cards by level range", () => {
      const cardDefs: Record<string, BaseEffectCardDefinition> = {
        [UNIT_1]: createMockCardDefinition({ lv: 2 }),
      };

      expect(matchesLevelFilter(cardDefs[UNIT_1], { min: 1, max: 3 })).toBe(
        true,
      );
      expect(matchesLevelFilter(cardDefs[UNIT_1], { exactly: 2 })).toBe(true);
      expect(matchesLevelFilter(cardDefs[UNIT_1], { min: 3 })).toBe(false);
    });
  });

  describe("owner filtering", () => {
    it("should match self-owned cards", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [UNIT_2] },
        },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_1,
        { type: "card", owner: "self" },
        context,
      );

      expect(result).toBe(true);
    });

    it("should not match opponent cards when owner=self", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [UNIT_2] },
        },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_2,
        { type: "card", owner: "self" },
        context,
      );

      expect(result).toBe(false);
    });

    it("should match opponent cards when owner=opponent", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [UNIT_2] },
        },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      const result = matchesFilter(
        state,
        UNIT_2,
        { type: "card", owner: "opponent" },
        context,
      );

      expect(result).toBe(true);
    });

    it("should match any card when owner=any", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [UNIT_2] },
        },
      });

      const context = createContext(PLAYER_1, UNIT_1);

      expect(
        matchesFilter(state, UNIT_1, { type: "card", owner: "any" }, context),
      ).toBe(true);
      expect(
        matchesFilter(state, UNIT_2, { type: "card", owner: "any" }, context),
      ).toBe(true);
    });
  });

  describe("combined filters", () => {
    it("should require all filter criteria to match (AND logic)", () => {
      const state = createMockGameState(
        [PLAYER_1, PLAYER_2],
        {
          battleArea: {
            [PLAYER_1]: { cards: [UNIT_1] },
            [PLAYER_2]: { cards: [UNIT_2] },
          },
        },
        { [UNIT_1]: "rested" },
      );

      const cardDefs: Record<string, BaseEffectCardDefinition> = {
        [UNIT_1]: createMockCardDefinition({
          cost: 2,
          cardType: "UNIT",
        }),
      };

      const context = createContext(PLAYER_1, UNIT_1, cardDefs);

      // All criteria match
      const result1 = matchesFilter(
        state,
        UNIT_1,
        {
          type: "unit",
          zone: "battleArea",
          owner: "self",
          state: { rested: true },
          properties: { cost: { max: 3 } },
        },
        context,
      );

      expect(result1).toBe(true);

      // One criteria doesn't match (cost too high)
      const result2 = matchesFilter(
        state,
        UNIT_1,
        {
          type: "unit",
          zone: "battleArea",
          owner: "self",
          state: { rested: true },
          properties: { cost: { min: 3 } },
        },
        context,
      );

      expect(result2).toBe(false);
    });
  });
});

describe("enumerateValidTargets", () => {
  describe("single filter", () => {
    it("should return all cards matching a single filter", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1, UNIT_2] },
          [PLAYER_2]: { cards: [UNIT_3] },
        },
      });

      const targetingSpec = {
        count: 1,
        validTargets: [{ type: "card", zone: "battleArea", owner: "self" }],
        chooser: "controller" as const,
        timing: "on_resolution" as const,
      };

      const context = createContext(PLAYER_1, UNIT_1);

      const result = enumerateValidTargets(state, targetingSpec, context);

      expect(result).toHaveLength(2);
      expect(result).toContain(UNIT_1);
      expect(result).toContain(UNIT_2);
      expect(result).not.toContain(UNIT_3);
    });
  });

  describe("multiple filters (OR)", () => {
    it("should combine matching cards from multiple filters with OR logic", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [] },
        },
        hand: {
          [PLAYER_1]: { cards: [] },
          [PLAYER_2]: { cards: [UNIT_2] },
        },
      });

      const targetingSpec = {
        count: 1,
        validTargets: [
          { type: "card", zone: "battleArea", owner: "self" },
          { type: "card", zone: "hand", owner: "opponent" },
        ],
        chooser: "controller" as const,
        timing: "on_resolution" as const,
      };

      const context = createContext(PLAYER_1, UNIT_1);

      const result = enumerateValidTargets(state, targetingSpec, context);

      expect(result).toHaveLength(2);
      expect(result).toContain(UNIT_1);
      expect(result).toContain(UNIT_2);
    });

    it("should deduplicate results when card matches multiple filters", () => {
      const state = createMockGameState(
        [PLAYER_1, PLAYER_2],
        {
          battleArea: {
            [PLAYER_1]: { cards: [UNIT_1] },
            [PLAYER_2]: { cards: [] },
          },
        },
        { [UNIT_1]: "rested" },
      );

      const targetingSpec = {
        count: 1,
        validTargets: [
          { type: "card", zone: "battleArea", owner: "self" },
          {
            type: "card",
            zone: "battleArea",
            owner: "self",
            state: { rested: true },
          },
        ],
        chooser: "controller" as const,
        timing: "on_resolution" as const,
      };

      const context = createContext(PLAYER_1, UNIT_1);

      const result = enumerateValidTargets(state, targetingSpec, context);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(UNIT_1);
    });
  });

  describe("no valid targets", () => {
    it("should return empty array when no cards match", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const targetingSpec = {
        count: 1,
        validTargets: [{ type: "card", zone: "battleArea", owner: "self" }],
        chooser: "controller" as const,
        timing: "on_resolution" as const,
      };

      const context = createContext(PLAYER_1, UNIT_1);

      const result = enumerateValidTargets(state, targetingSpec, context);

      expect(result).toHaveLength(0);
    });
  });
});

describe("validateTargets", () => {
  describe("count validation", () => {
    it("should validate exact count", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1, UNIT_2] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const targetingSpec = {
        count: 2,
        validTargets: [{ type: "card", zone: "battleArea", owner: "self" }],
        chooser: "controller" as const,
        timing: "on_resolution" as const,
      };

      const context = createContext(PLAYER_1, UNIT_1);

      // Correct count
      expect(
        validateTargets(state, targetingSpec, [UNIT_1, UNIT_2], context),
      ).toBe(true);

      // Wrong count
      expect(validateTargets(state, targetingSpec, [UNIT_1], context)).toBe(
        false,
      );
    });

    it("should validate count range", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1, UNIT_2, UNIT_3] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const targetingSpec = {
        count: { min: 1, max: 3 },
        validTargets: [{ type: "card", zone: "battleArea", owner: "self" }],
        chooser: "controller" as const,
        timing: "on_resolution" as const,
      };

      const context = createContext(PLAYER_1, UNIT_1);

      // Valid: min count
      expect(validateTargets(state, targetingSpec, [UNIT_1], context)).toBe(
        true,
      );

      // Valid: max count
      expect(
        validateTargets(
          state,
          targetingSpec,
          [UNIT_1, UNIT_2, UNIT_3],
          context,
        ),
      ).toBe(true);

      // Valid: between min and max
      expect(
        validateTargets(state, targetingSpec, [UNIT_1, UNIT_2], context),
      ).toBe(true);

      // Invalid: below min
      expect(validateTargets(state, targetingSpec, [], context)).toBe(false);

      // Invalid: above max
      expect(
        validateTargets(
          state,
          targetingSpec,
          [UNIT_1, UNIT_2, UNIT_3, "invalid"],
          context,
        ),
      ).toBe(false);
    });
  });

  describe("validity checking", () => {
    it("should verify each target is in valid targets", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [UNIT_2] },
        },
      });

      const targetingSpec = {
        count: 1,
        validTargets: [{ type: "card", zone: "battleArea", owner: "self" }],
        chooser: "controller" as const,
        timing: "on_resolution" as const,
      };

      const context = createContext(PLAYER_1, UNIT_1);

      // Valid target
      expect(validateTargets(state, targetingSpec, [UNIT_1], context)).toBe(
        true,
      );

      // Invalid target (opponent's card)
      expect(validateTargets(state, targetingSpec, [UNIT_2], context)).toBe(
        false,
      );
    });
  });

  describe("edge cases", () => {
    it("should reject duplicate targets", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const targetingSpec = {
        count: 2,
        validTargets: [{ type: "card", zone: "battleArea", owner: "self" }],
        chooser: "controller" as const,
        timing: "on_resolution" as const,
      };

      const context = createContext(PLAYER_1, UNIT_1);

      // Duplicate targets
      expect(
        validateTargets(state, targetingSpec, [UNIT_1, UNIT_1], context),
      ).toBe(false);
    });
  });
});

describe("zone helpers", () => {
  describe("getCardsInZone", () => {
    it("should get cards for a specific player", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1, UNIT_2] },
          [PLAYER_2]: { cards: [UNIT_3] },
        },
      });

      const result = getCardsInZone(state, "battleArea", PLAYER_1);

      expect(result).toEqual([UNIT_1, UNIT_2]);
    });

    it("should get cards from all players when no player specified", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1, UNIT_2] },
          [PLAYER_2]: { cards: [UNIT_3] },
        },
      });

      const result = getCardsInZone(state, "battleArea");

      expect(result).toHaveLength(3);
      expect(result).toContain(UNIT_1);
      expect(result).toContain(UNIT_2);
      expect(result).toContain(UNIT_3);
    });
  });

  describe("filterCardsByZone", () => {
    it("should filter cards to only those in specified zone", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [] },
        },
        hand: {
          [PLAYER_1]: { cards: [] },
          [PLAYER_2]: { cards: [UNIT_2] },
        },
      });

      const result = filterCardsByZone(
        state,
        [UNIT_1, UNIT_2, UNIT_3],
        "battleArea",
      );

      expect(result).toEqual([UNIT_1]);
    });
  });

  describe("isCardInZoneCheck", () => {
    it("should return true when card is in zone", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [] },
        },
      });

      expect(isCardInZoneCheck(state, UNIT_1, "battleArea")).toBe(true);
    });

    it("should return false when card is not in zone", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [] },
          [PLAYER_2]: { cards: [] },
        },
        hand: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [] },
        },
      });

      expect(isCardInZoneCheck(state, UNIT_1, "battleArea")).toBe(false);
    });
  });
});

describe("state helpers", () => {
  describe("isCardRested", () => {
    it("should return true for rested cards", () => {
      const state = createMockGameState(
        [PLAYER_1, PLAYER_2],
        {},
        { [UNIT_1]: "rested" },
      );

      expect(isCardRested(state, UNIT_1)).toBe(true);
    });

    it("should return false for active cards", () => {
      const state = createMockGameState(
        [PLAYER_1, PLAYER_2],
        {},
        { [UNIT_1]: "active" },
      );

      expect(isCardRested(state, UNIT_1)).toBe(false);
    });
  });

  describe("matchesStateFilter", () => {
    it("should match rested state", () => {
      const state = createMockGameState(
        [PLAYER_1, PLAYER_2],
        {},
        { [UNIT_1]: "rested" },
      );

      expect(matchesStateFilter(state, UNIT_1, { rested: true })).toBe(true);
      expect(matchesStateFilter(state, UNIT_1, { rested: false })).toBe(false);
    });

    it("should match multiple state criteria", () => {
      const state = createMockGameState(
        [PLAYER_1, PLAYER_2],
        {},
        { [UNIT_1]: "rested" },
        {
          [UNIT_1]: [
            {
              id: "mod-1" as const,
              duration: "permanent" as const,
              apModifier: -1,
              sourceId: UNIT_1,
            },
          ],
        },
      );

      expect(
        matchesStateFilter(state, UNIT_1, {
          rested: true,
          damaged: true,
        }),
      ).toBe(true);
    });
  });

  describe("getCardOwner", () => {
    it("should return owner of card", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [] },
        },
      });

      expect(getCardOwner(state, UNIT_1)).toBe(PLAYER_1);
    });

    it("should return undefined for card not in any zone", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [] },
          [PLAYER_2]: { cards: [] },
        },
      });

      expect(getCardOwner(state, UNIT_1)).toBeUndefined();
    });
  });
});

describe("property helpers", () => {
  describe("matchesCardType", () => {
    it("should match card type", () => {
      const unitDef = createMockCardDefinition({ cardType: "UNIT" });
      expect(matchesCardType(unitDef, "UNIT")).toBe(true);
      expect(matchesCardType(unitDef, "BASE")).toBe(false);
    });
  });

  describe("matchesColor", () => {
    it("should match color", () => {
      const cardDef = { ...createMockCardDefinition(), color: "Red" as const };
      expect(matchesColor(cardDef, "Red")).toBe(true);
      expect(matchesColor(cardDef, "Blue")).toBe(false);
    });
  });

  describe("hasTrait", () => {
    it("should match when card has all traits", () => {
      const cardDef = {
        ...createMockCardDefinition(),
        traits: ["Zeon", "Mobile Suit"],
      };
      expect(hasTrait(cardDef, ["Zeon"])).toBe(true);
      expect(hasTrait(cardDef, ["Zeon", "Mobile Suit"])).toBe(true);
      expect(hasTrait(cardDef, ["Zeon", "NewType"])).toBe(false);
    });
  });
});

describe("utility functions", () => {
  describe("getAllCardsInGame", () => {
    it("should return all cards across all zones", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [UNIT_2] },
        },
        hand: {
          [PLAYER_1]: { cards: [UNIT_3] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const result = getAllCardsInGame(state);

      expect(result).toHaveLength(3);
      expect(result).toContain(UNIT_1);
      expect(result).toContain(UNIT_2);
      expect(result).toContain(UNIT_3);
    });
  });

  describe("getCardsOwnedByPlayer", () => {
    it("should return all cards owned by player", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {
        battleArea: {
          [PLAYER_1]: { cards: [UNIT_1] },
          [PLAYER_2]: { cards: [UNIT_2] },
        },
        hand: {
          [PLAYER_1]: { cards: [UNIT_3] },
          [PLAYER_2]: { cards: [] },
        },
      });

      const result = getCardsOwnedByPlayer(state, PLAYER_1);

      expect(result).toHaveLength(2);
      expect(result).toContain(UNIT_1);
      expect(result).toContain(UNIT_3);
    });
  });

  describe("getOpponentId", () => {
    it("should return opponent player ID", () => {
      const state = createMockGameState([PLAYER_1, PLAYER_2], {});

      expect(getOpponentId(state, PLAYER_1)).toBe(PLAYER_2);
      expect(getOpponentId(state, PLAYER_2)).toBe(PLAYER_1);
    });
  });
});

describe("matchesCardFilter", () => {
  it("should match by card type", () => {
    const state = createMockGameState([PLAYER_1], {});
    const cardDefs: Record<string, BaseEffectCardDefinition> = {
      [UNIT_1]: createMockCardDefinition({ cardType: "UNIT" }),
    };

    expect(
      matchesCardFilter(state, UNIT_1, { cardType: "UNIT" }, cardDefs),
    ).toBe(true);

    expect(
      matchesCardFilter(state, UNIT_1, { cardType: "BASE" }, cardDefs),
    ).toBe(false);
  });

  it("should match by name", () => {
    const state = createMockGameState([PLAYER_1], {});
    const cardDefs: Record<string, BaseEffectCardDefinition> = {
      [UNIT_1]: createMockCardDefinition({ name: "RX-78-2 Gundam" }),
    };

    expect(
      matchesCardFilter(state, UNIT_1, { name: "RX-78-2 Gundam" }, cardDefs),
    ).toBe(true);

    expect(
      matchesCardFilter(state, UNIT_1, { name: "Zaku II" }, cardDefs),
    ).toBe(false);
  });

  it("should match by keyword", () => {
    const state = createMockGameState([PLAYER_1], {});
    const cardDefs: Record<string, BaseEffectCardDefinition> = {
      [UNIT_1]: {
        ...createMockCardDefinition(),
        keywordEffects: ["Repair", "Breach"],
      },
    };

    expect(
      matchesCardFilter(state, UNIT_1, { hasKeyword: "Repair" }, cardDefs),
    ).toBe(true);

    expect(
      matchesCardFilter(state, UNIT_1, { hasKeyword: "Mobile" }, cardDefs),
    ).toBe(false);
  });
});
