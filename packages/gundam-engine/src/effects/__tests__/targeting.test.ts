/**
 * Gundam Targeting System Tests
 *
 * Tests for target resolution, validation, and filtering.
 */

import { beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId, ZoneId } from "@tcg/core";
import { createZoneId } from "@tcg/core";
import type { GundamGameState } from "../../types";
import {
  chosenCardTarget,
  chosenUnitTarget,
  eachFriendlyUnitTarget,
  eachOpponentUnitTarget,
  eachUnitTarget,
  filterTargets,
  filterTargetsByPosition,
  getAllUnits,
  getBase,
  getCardsInDeck,
  getCardsInHand,
  getCardsInTrash,
  getCardsInZone,
  getResources,
  getShields,
  getUnitsInBattleArea,
  isValidTarget,
  isValidTargetId,
  limitTargets,
  opponentTarget,
  resolveTarget,
  selfTarget,
  target,
  thisTarget,
} from "../targeting";

// Helper to create a Zone with proper structure
function createZone(
  owner: PlayerId,
  zoneName: string,
  cards: CardId[],
  visibility: "public" | "private" | "secret" = "public",
  ordered = false,
): GundamGameState["zones"][keyof GundamGameState["zones"]][PlayerId] {
  return {
    cards,
    config: {
      faceDown: visibility === "secret",
      id: createZoneId(`${zoneName}-${owner}`),
      maxSize: undefined,
      name: zoneName,
      ordered,
      owner,
      visibility,
    },
  };
}

describe("Target Resolution", () => {
  let mockState: GundamGameState;
  let player1: PlayerId;
  let player2: PlayerId;
  let card1: CardId;
  let card2: CardId;

  beforeEach(() => {
    player1 = "player1" as PlayerId;
    player2 = "player2" as PlayerId;
    card1 = "card1" as CardId;
    card2 = "card2" as CardId;

    mockState = {
      currentPlayer: player1,
      gundam: {
        activeResources: { [player1]: 3, [player2]: 2 },
        attackedThisTurn: [],
        cardDamage: {},
        cardPositions: { [card1]: "active", [card2]: "rested" },
        effectStack: { nextInstanceId: 0, stack: [] },
        hasPlayedResourceThisTurn: { [player1]: false, [player2]: false },
        revealedCards: [],
        temporaryModifiers: {},
      },
      phase: "main",
      players: [player1, player2],
      turn: 1,
      zones: {
        baseSection: {
          [player1]: createZone(player1, "baseSection", [], "public"),
          [player2]: createZone(player2, "baseSection", [], "public"),
        },
        battleArea: {
          [player1]: createZone(player1, "battleArea", [card2], "public", true),
          [player2]: createZone(player2, "battleArea", [], "public", true),
        },
        deck: {
          [player1]: createZone(player1, "deck", [], "secret", true),
          [player2]: createZone(player2, "deck", [], "secret", true),
        },
        hand: {
          [player1]: createZone(player1, "hand", [card1], "private"),
          [player2]: createZone(player2, "hand", [], "private"),
        },
        limbo: {
          [player1]: createZone(player1, "limbo", [], "public"),
          [player2]: createZone(player2, "limbo", [], "public"),
        },
        removal: {
          [player1]: createZone(player1, "removal", [], "public"),
          [player2]: createZone(player2, "removal", [], "public"),
        },
        resourceArea: {
          [player1]: createZone(player1, "resourceArea", [], "public"),
          [player2]: createZone(player2, "resourceArea", [], "public"),
        },
        resourceDeck: {
          [player1]: createZone(player1, "resourceDeck", [], "secret", true),
          [player2]: createZone(player2, "resourceDeck", [], "secret", true),
        },
        shieldSection: {
          [player1]: createZone(player1, "shieldSection", [], "secret", true),
          [player2]: createZone(player2, "shieldSection", [], "secret", true),
        },
        trash: {
          [player1]: createZone(player1, "trash", [], "public", true),
          [player2]: createZone(player2, "trash", [], "public", true),
        },
      },
    };
  });

  describe("String Target Resolution", () => {
    it("should resolve 'this' target", () => {
      const result = resolveTarget("this", mockState, player1, card1);
      expect(result.cardIds).toEqual([card1]);
      expect(result.players).toHaveLength(0);
    });

    it("should resolve 'self' target", () => {
      const result = resolveTarget("self", mockState, player1);
      expect(result.cardIds).toHaveLength(0);
      expect(result.players).toEqual([player1]);
    });

    it("should resolve 'opponent' target", () => {
      const result = resolveTarget("opponent", mockState, player1);
      expect(result.cardIds).toHaveLength(0);
      expect(result.players).toEqual([player2]);
    });

    it("should resolve 'each-player' target", () => {
      const result = resolveTarget("each-player", mockState, player1);
      expect(result.cardIds).toHaveLength(0);
      expect(result.players).toEqual([player1, player2]);
    });

    it("should resolve 'each-unit' target", () => {
      const result = resolveTarget("each-unit", mockState, player1);
      expect(result.cardIds).toEqual([card2]);
      expect(result.players).toHaveLength(0);
    });

    it("should resolve 'each-friendly-unit' target", () => {
      const result = resolveTarget("each-friendly-unit", mockState, player1);
      expect(result.cardIds).toEqual([card2]);
      expect(result.players).toHaveLength(0);
    });

    it("should resolve 'each-opponent-unit' target", () => {
      const result = resolveTarget("each-opponent-unit", mockState, player1);
      expect(result.cardIds).toHaveLength(0);
      expect(result.players).toHaveLength(0);
    });

    it("should resolve 'chosen-unit' target", () => {
      const result = resolveTarget("chosen-unit", mockState, player1);
      expect(result.cardIds).toHaveLength(0);
      expect(result.players).toHaveLength(0);
    });

    it("should resolve 'chosen-card' target", () => {
      const result = resolveTarget("chosen-card", mockState, player1);
      expect(result.cardIds).toHaveLength(0);
      expect(result.players).toHaveLength(0);
    });
  });

  describe("Selector Target Resolution", () => {
    it("should resolve selector with controller filter", () => {
      const selector = {
        controller: "self" as const,
      };
      const result = resolveTarget({ selector }, mockState, player1);
      expect(result.cardIds).toEqual([card2]);
    });

    it("should resolve selector with position filter", () => {
      const selector = {
        controller: "self" as const,
        position: "rested" as const,
      };
      const result = resolveTarget({ selector }, mockState, player1);
      expect(result.cardIds).toEqual([card2]);
    });

    it("should resolve selector with active position filter", () => {
      const selector = {
        controller: "self" as const,
        position: "active" as const,
      };
      const result = resolveTarget({ selector }, mockState, player1);
      expect(result.cardIds).toHaveLength(0);
    });

    it("should resolve selector with opponent controller", () => {
      const selector = {
        controller: "opponent" as const,
      };
      const result = resolveTarget({ selector }, mockState, player1);
      expect(result.cardIds).toHaveLength(0);
    });
  });
});

describe("Target Validation", () => {
  let mockState: GundamGameState;
  let player1: PlayerId;
  let player2: PlayerId;
  let card1: CardId;
  let card2: CardId;

  beforeEach(() => {
    player1 = "player1" as PlayerId;
    player2 = "player2" as PlayerId;
    card1 = "card1" as CardId;
    card2 = "card2" as CardId;

    mockState = {
      currentPlayer: player1,
      gundam: {
        activeResources: { [player1]: 3, [player2]: 2 },
        attackedThisTurn: [],
        cardDamage: {},
        cardPositions: { [card1]: "active", [card2]: "rested" },
        effectStack: { nextInstanceId: 0, stack: [] },
        hasPlayedResourceThisTurn: { [player1]: false, [player2]: false },
        revealedCards: [],
        temporaryModifiers: {},
      },
      phase: "main",
      players: [player1, player2],
      turn: 1,
      zones: {
        baseSection: {
          [player1]: createZone(player1, "baseSection", [], "public"),
          [player2]: createZone(player2, "baseSection", [], "public"),
        },
        battleArea: {
          [player1]: createZone(player1, "battleArea", [card2], "public", true),
          [player2]: createZone(player2, "battleArea", [], "public", true),
        },
        deck: {
          [player1]: createZone(player1, "deck", [], "secret", true),
          [player2]: createZone(player2, "deck", [], "secret", true),
        },
        hand: {
          [player1]: createZone(player1, "hand", [card1], "private"),
          [player2]: createZone(player2, "hand", [], "private"),
        },
        limbo: {
          [player1]: createZone(player1, "limbo", [], "public"),
          [player2]: createZone(player2, "limbo", [], "public"),
        },
        removal: {
          [player1]: createZone(player1, "removal", [], "public"),
          [player2]: createZone(player2, "removal", [], "public"),
        },
        resourceArea: {
          [player1]: createZone(player1, "resourceArea", [], "public"),
          [player2]: createZone(player2, "resourceArea", [], "public"),
        },
        resourceDeck: {
          [player1]: createZone(player1, "resourceDeck", [], "secret", true),
          [player2]: createZone(player2, "resourceDeck", [], "secret", true),
        },
        shieldSection: {
          [player1]: createZone(player1, "shieldSection", [], "secret", true),
          [player2]: createZone(player2, "shieldSection", [], "secret", true),
        },
        trash: {
          [player1]: createZone(player1, "trash", [], "public", true),
          [player2]: createZone(player2, "trash", [], "public", true),
        },
      },
    };
  });

  it("should validate valid target", () => {
    expect(isValidTarget("this", mockState, player1, card1)).toBe(true);
    expect(isValidTarget("self", mockState, player1)).toBe(true);
    expect(isValidTarget("opponent", mockState, player1)).toBe(true);
    expect(isValidTarget("each-unit", mockState, player1)).toBe(true);
  });

  it("should validate invalid target", () => {
    expect(isValidTarget("each-opponent-unit", mockState, player1)).toBe(false);
    expect(isValidTarget("chosen-unit", mockState, player1)).toBe(false);
  });

  it("should validate target ID", () => {
    expect(isValidTargetId(card1, "this", mockState, player1, card1)).toBe(true);
    expect(isValidTargetId(card2, "this", mockState, player1, card2)).toBe(true);
    expect(isValidTargetId(card1, "this", mockState, player1, card2)).toBe(false);
    expect(isValidTargetId(card2, "this", mockState, player1, card1)).toBe(false);
  });
});

describe("Target Query Functions", () => {
  let mockState: GundamGameState;
  let player1: PlayerId;
  let player2: PlayerId;
  let card1: CardId;
  let card2: CardId;
  let card3: CardId;

  beforeEach(() => {
    player1 = "player1" as PlayerId;
    player2 = "player2" as PlayerId;
    card1 = "card1" as CardId;
    card2 = "card2" as CardId;
    card3 = "card3" as CardId;

    mockState = {
      currentPlayer: player1,
      gundam: {
        activeResources: { [player1]: 3, [player2]: 2 },
        attackedThisTurn: [],
        cardDamage: {},
        cardPositions: {
          [card1]: "active",
          [card2]: "rested",
          [card3]: "active",
        },
        effectStack: { nextInstanceId: 0, stack: [] },
        hasPlayedResourceThisTurn: { [player1]: false, [player2]: false },
        revealedCards: [],
        temporaryModifiers: {},
      },
      phase: "main",
      players: [player1, player2],
      turn: 1,
      zones: {
        baseSection: {
          [player1]: createZone(player1, "baseSection", [], "public"),
          [player2]: createZone(player2, "baseSection", [], "public"),
        },
        battleArea: {
          [player1]: createZone(player1, "battleArea", [card2], "public", true),
          [player2]: createZone(player2, "battleArea", [], "public", true),
        },
        deck: {
          [player1]: createZone(player1, "deck", [card3], "secret", true),
          [player2]: createZone(player2, "deck", [], "secret", true),
        },
        hand: {
          [player1]: createZone(player1, "hand", [card1], "private"),
          [player2]: createZone(player2, "hand", [], "private"),
        },
        limbo: {
          [player1]: createZone(player1, "limbo", [], "public"),
          [player2]: createZone(player2, "limbo", [], "public"),
        },
        removal: {
          [player1]: createZone(player1, "removal", [], "public"),
          [player2]: createZone(player2, "removal", [], "public"),
        },
        resourceArea: {
          [player1]: createZone(player1, "resourceArea", [], "public"),
          [player2]: createZone(player2, "resourceArea", [], "public"),
        },
        resourceDeck: {
          [player1]: createZone(player1, "resourceDeck", [], "secret", true),
          [player2]: createZone(player2, "resourceDeck", [], "secret", true),
        },
        shieldSection: {
          [player1]: createZone(player1, "shieldSection", [], "secret", true),
          [player2]: createZone(player2, "shieldSection", [], "secret", true),
        },
        trash: {
          [player1]: createZone(player1, "trash", [], "public", true),
          [player2]: createZone(player2, "trash", [], "public", true),
        },
      },
    };
  });

  it("should get all units", () => {
    const result = getAllUnits(mockState);
    expect(result.cardIds).toEqual([card2]);
  });

  it("should get units in battle area", () => {
    const result = getUnitsInBattleArea(mockState, player1);
    expect(result.cardIds).toEqual([card2]);
  });

  it("should get cards in hand", () => {
    const result = getCardsInHand(mockState, player1);
    expect(result.cardIds).toEqual([card1]);
  });

  it("should get cards in deck", () => {
    const result = getCardsInDeck(mockState, player1);
    expect(result.cardIds).toEqual([card3]);
  });

  it("should get cards in trash", () => {
    const result = getCardsInTrash(mockState, player1);
    expect(result.cardIds).toHaveLength(0);
  });

  it("should get cards in zone", () => {
    const result = getCardsInZone(mockState, player1, "hand");
    expect(result.cardIds).toEqual([card1]);
  });

  it("should get shields", () => {
    const result = getShields(mockState, player1);
    expect(result.cardIds).toHaveLength(0);
  });

  it("should get resources", () => {
    const result = getResources(mockState, player1);
    expect(result.cardIds).toHaveLength(0);
  });

  it("should get base", () => {
    const result = getBase(mockState, player1);
    expect(result.cardIds).toHaveLength(0);
  });
});

describe("Target Filtering", () => {
  it("should filter targets by predicate", () => {
    const card1 = "card1" as CardId;
    const card2 = "card2" as CardId;
    const card3 = "card3" as CardId;
    const targets = {
      cardIds: [card1, card2, card3],
      players: [],
      zones: [],
    };

    const result = filterTargets(targets, (cardId) => cardId !== card2);
    expect(result.cardIds).toEqual([card1, card3]);
  });

  it("should filter targets by position", () => {
    const player1 = "player1" as PlayerId;
    const card1 = "card1" as CardId;
    const card2 = "card2" as CardId;
    const card3 = "card3" as CardId;

    const mockState: GundamGameState = {
      currentPlayer: player1,
      gundam: {
        activeResources: { [player1]: 0 },
        attackedThisTurn: [],
        cardDamage: {},
        cardPositions: {
          [card1]: "active",
          [card2]: "rested",
          [card3]: "active",
        },
        effectStack: { nextInstanceId: 0, stack: [] },
        hasPlayedResourceThisTurn: { [player1]: false },
        revealedCards: [],
        temporaryModifiers: {},
      },
      phase: "main",
      players: [player1],
      turn: 1,
      zones: {
        baseSection: {
          [player1]: createZone(player1, "baseSection", [], "public"),
        },
        battleArea: {
          [player1]: createZone(player1, "battleArea", [], "public", true),
        },
        deck: { [player1]: createZone(player1, "deck", [], "secret", true) },
        hand: { [player1]: createZone(player1, "hand", [], "private") },
        limbo: { [player1]: createZone(player1, "limbo", [], "public") },
        removal: { [player1]: createZone(player1, "removal", [], "public") },
        resourceArea: {
          [player1]: createZone(player1, "resourceArea", [], "public"),
        },
        resourceDeck: {
          [player1]: createZone(player1, "resourceDeck", [], "secret", true),
        },
        shieldSection: {
          [player1]: createZone(player1, "shieldSection", [], "secret", true),
        },
        trash: { [player1]: createZone(player1, "trash", [], "public", true) },
      },
    };

    const targets = {
      cardIds: [card1, card2, card3],
      players: [],
      zones: [],
    };

    const result = filterTargetsByPosition(mockState, targets, "active");
    expect(result.cardIds).toEqual([card1, card3]);
  });

  it("should limit targets", () => {
    const card1 = "card1" as CardId;
    const card2 = "card2" as CardId;
    const card3 = "card3" as CardId;
    const card4 = "card4" as CardId;
    const card5 = "card5" as CardId;
    const targets = {
      cardIds: [card1, card2, card3, card4, card5],
      players: [],
      zones: [],
    };

    const result = limitTargets(targets, 3);
    expect(result.cardIds).toEqual([card1, card2, card3]);
  });
});

describe("Target Builders", () => {
  it("should create target selector", () => {
    const selector = {
      controller: "self" as const,
      position: "active" as const,
    };
    const result = target(selector);
    expect(result).toEqual({ selector });
  });

  it("should create 'this' target", () => {
    expect(thisTarget()).toBe("this");
  });

  it("should create 'self' target", () => {
    expect(selfTarget()).toBe("self");
  });

  it("should create 'opponent' target", () => {
    expect(opponentTarget()).toBe("opponent");
  });

  it("should create 'each-unit' target", () => {
    expect(eachUnitTarget()).toBe("each-unit");
  });

  it("should create 'each-friendly-unit' target", () => {
    expect(eachFriendlyUnitTarget()).toBe("each-friendly-unit");
  });

  it("should create 'each-opponent-unit' target", () => {
    expect(eachOpponentUnitTarget()).toBe("each-opponent-unit");
  });

  it("should create 'chosen-unit' target", () => {
    expect(chosenUnitTarget()).toBe("chosen-unit");
  });

  it("should create 'chosen-card' target", () => {
    expect(chosenCardTarget()).toBe("chosen-card");
  });
});
