/**
 * Alpha Clash Game Engine
 *
 * Main engine class that coordinates all Alpha Clash game systems:
 * - Extends CoreEngine for state management and move processing
 * - Integrates card repository and game definition
 * - Provides Alpha Clash-specific utility methods
 */

import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import { GameEngine } from "~/game-engine/core-engine/game-engine";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type {
  AlphaClashCardDefinition,
  AlphaClashCardFilter,
  AlphaClashGameState,
  AlphaClashPlayerState,
} from "./alpha-clash-engine-types";
import { AlphaClashCardRepository } from "./src/cards/alpha-clash-card-repository";
import { alphaClashGameDefinition } from "./src/game-definition/alpha-clash-game-definition";

// Define card instance type for Alpha Clash
type AlphaClashCardInstance = CoreCardInstance<AlphaClashCardDefinition>;

export interface AlphaClashEngineConfig {
  initialState: AlphaClashGameState;
  initialCoreCtx: CoreCtx;
  cards: Record<string, Record<string, string>>;
  cardRepository?: AlphaClashCardRepository;
  playerId?: string;
  gameId: string;
  players: string[];
  debug?: boolean;
}

export class AlphaClashEngine extends GameEngine<
  AlphaClashGameState,
  AlphaClashCardDefinition,
  AlphaClashPlayerState,
  AlphaClashCardFilter,
  AlphaClashCardInstance
> {
  private cardRepository: AlphaClashCardRepository;

  constructor(config: AlphaClashEngineConfig) {
    // Initialize card repository
    const cardRepository =
      config.cardRepository || new AlphaClashCardRepository(config.cards);

    // Configure CoreEngine
    super({
      game: alphaClashGameDefinition,
      initialState: config.initialState,
      initialCoreCtx: config.initialCoreCtx,
      cards: config.cards,
      players: config.players,
      repository: cardRepository,
      playerID: config.playerId,
      matchID: config.gameId,
      debug: config.debug,
    });

    this.cardRepository = cardRepository;

    logger.info(`AlphaClashEngine initialized for game ${config.gameId}`);
    if (config.playerId) {
      logger.info(`Engine perspective: ${config.playerId}`);
    } else {
      logger.info("Engine perspective: Authoritative");
    }
  }

  /**
   * Get available moves for the engine
   */
  get moves() {
    const currentPlayer = this.playerID;

    return {
      chooseFirstPlayer: (playerId: string) => {
        return this.processMove(currentPlayer, "chooseFirstPlayer", [playerId]);
      },
      mulligan: (cardsToMulligan: string[]) => {
        if (!currentPlayer) {
          logger.warn("No current player found for mulligan move.");
          return {
            success: false,
            error: "No current player found for mulligan move.",
          };
        }
        return this.processMove(currentPlayer, "mulligan", cardsToMulligan);
      },
      concede: (playerId: string) => {
        return this.processMove(playerId, "concede", [playerId]);
      },
    };
  }

  /**
   * Get the Alpha Clash card repository
   */
  getCardRepository(): AlphaClashCardRepository {
    return this.cardRepository;
  }

  /**
   * Get all cards in a specific zone for a player
   */
  getZoneCards(
    zone: string,
    playerId?: string,
  ): Array<{
    instanceId: string;
    definition: AlphaClashCardDefinition;
  }> {
    const ctx = this.getGameState().ctx;
    const targetPlayerId = playerId || ctx.playerOrder[ctx.turnPlayerPos];
    const zoneKey = `${targetPlayerId}-${zone}`;
    const zoneCards = ctx.cardZones[zoneKey]?.cards || [];

    return zoneCards
      .map((instanceId) => ({
        instanceId,
        definition: this.cardRepository.getCardByInstanceId(instanceId)!,
      }))
      .filter((card) => card.definition);
  }

  /**
   * Get player's hand cards
   */
  getHandCards(playerId?: string): Array<{
    instanceId: string;
    definition: AlphaClashCardDefinition;
  }> {
    return this.getZoneCards("hand", playerId);
  }

  /**
   * Get player's battlefield cards (clash zone)
   */
  getBattlefieldCards(playerId?: string): Array<{
    instanceId: string;
    definition: AlphaClashCardDefinition;
  }> {
    return this.getZoneCards("clash", playerId);
  }

  /**
   * Get player's contender card
   */
  getContenderCard(playerId?: string):
    | {
        instanceId: string;
        definition: AlphaClashCardDefinition;
      }
    | undefined {
    const contenderCards = this.getZoneCards("contender", playerId);
    return contenderCards[0]; // Should only be one contender
  }

  /**
   * Get active clashground card
   */
  getActiveClashground():
    | {
        instanceId: string;
        definition: AlphaClashCardDefinition;
        owner: string;
      }
    | undefined {
    // Find clashground in any player's clashground zone
    const ctx = this.getGameState().ctx;
    for (const playerId of ctx.playerOrder) {
      const clashgroundCards = this.getZoneCards("clashground", playerId);
      if (clashgroundCards.length > 0) {
        return {
          ...clashgroundCards[0],
          owner: playerId,
        };
      }
    }
    return undefined;
  }

  /**
   * Get cards by filter
   */
  getCardsByFilter(
    filter: AlphaClashCardFilter,
    playerId?: string,
  ): Array<{
    instanceId: string;
    definition: AlphaClashCardDefinition;
    zone: string;
  }> {
    const results: Array<{
      instanceId: string;
      definition: AlphaClashCardDefinition;
      zone: string;
    }> = [];

    const ctx = this.getGameState().ctx;
    const targetPlayers = playerId ? [playerId] : ctx.playerOrder;

    for (const player of targetPlayers) {
      // Check all zones for this player
      const zones = [
        "hand",
        "deck",
        "contender",
        "clash",
        "clashground",
        "accessory",
        "resource",
        "oblivion",
      ];

      for (const zone of zones) {
        const zoneCards = this.getZoneCards(zone, player);

        for (const card of zoneCards) {
          if (this.matchesFilter(card.definition, filter)) {
            results.push({
              ...card,
              zone,
            });
          }
        }
      }
    }

    return results;
  }

  /**
   * Check if a card matches a filter
   */
  private matchesFilter(
    card: AlphaClashCardDefinition,
    filter: AlphaClashCardFilter,
  ): boolean {
    // Card type filtering
    if (filter.cardType && card.type !== filter.cardType) {
      return false;
    }

    // Subtype filtering - need to check card type first
    if (filter.subtype) {
      let cardSubtype: string | undefined;
      if (card.type === "accessory" || card.type === "action") {
        cardSubtype = card.subtype;
      }
      if (cardSubtype !== filter.subtype) {
        return false;
      }
    }

    // Color filtering
    if (filter.color && filter.color.length > 0) {
      const hasMatchingColor = filter.color.some((color) =>
        card.colors?.includes(color),
      );
      if (!hasMatchingColor) {
        return false;
      }
    }

    // Cost filtering
    if (filter.cost) {
      const cardCost = card.cost || 0;
      if (filter.cost.min !== undefined && cardCost < filter.cost.min)
        return false;
      if (filter.cost.max !== undefined && cardCost > filter.cost.max)
        return false;
      if (filter.cost.exact !== undefined && cardCost !== filter.cost.exact)
        return false;
    }

    // Keyword filtering
    if (filter.hasKeyword && filter.hasKeyword.length > 0) {
      const hasMatchingKeyword = filter.hasKeyword.some((keyword) =>
        card.keywords?.includes(keyword),
      );
      if (!hasMatchingKeyword) {
        return false;
      }
    }

    // Affiliation filtering
    if (filter.affiliation && filter.affiliation.length > 0) {
      const hasMatchingAffiliation = filter.affiliation.some((affiliation) =>
        card.affiliations?.includes(affiliation),
      );
      if (!hasMatchingAffiliation) {
        return false;
      }
    }

    // Rarity filtering
    if (filter.rarity && filter.rarity.length > 0) {
      if (!filter.rarity.includes(card.rarity)) {
        return false;
      }
    }

    // Set filtering
    if (filter.set && filter.set.length > 0) {
      if (!filter.set.includes(card.set)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if a card can be played
   */
  canPlayCard(instanceId: string, playerId?: string): boolean {
    const ctx = this.getGameState().ctx;
    const targetPlayerId = playerId || ctx.playerOrder[ctx.turnPlayerPos];
    const card = this.cardRepository.getCardByInstanceId(instanceId);

    if (!card) return false;

    // Check if card is in player's hand
    const handCards = this.getHandCards(targetPlayerId);
    const cardInHand = handCards.some((c) => c.instanceId === instanceId);
    if (!cardInHand) return false;

    // Check phase restrictions using card repository method
    const gameState = this.getGameState().G;
    const currentPhase = gameState.currentPhase || "primary";

    return this.cardRepository.canPlayCard(instanceId, {
      phase: currentPhase,
      priorityWindow: gameState.priorityState?.window,
    });
  }

  /**
   * Get player's available resources
   */
  getAvailableResources(playerId?: string): number {
    const ctx = this.getGameState().ctx;
    const targetPlayerId = playerId || ctx.playerOrder[ctx.turnPlayerPos];
    const resourceCards = this.getZoneCards("resource", targetPlayerId);

    // Count ready resource cards
    // TODO: Implement card status tracking
    return resourceCards.length;
  }

  /**
   * Check if player can afford a card
   */
  canAffordCard(instanceId: string, playerId?: string): boolean {
    const card = this.cardRepository.getCardByInstanceId(instanceId);
    if (!card) return false;

    const availableResources = this.getAvailableResources(playerId);
    const cardCost = card.cost || 0;

    return availableResources >= cardCost;
  }

  /**
   * Get game statistics
   */
  getGameStats(): {
    turn: number;
    currentPlayer: string;
    phase: string;
    playerStats: Record<
      string,
      {
        handSize: number;
        deckSize: number;
        clashCards: number;
        resources: number;
        contenderHealth?: number;
      }
    >;
  } {
    const ctx = this.getGameState().ctx;
    const gameState = this.getGameState().G;

    const playerStats: Record<string, any> = {};

    for (const playerId of ctx.playerOrder) {
      const handSize = this.getZoneCards("hand", playerId).length;
      const deckSize = this.getZoneCards("deck", playerId).length;
      const clashCards = this.getZoneCards("clash", playerId).length;
      const resources = this.getZoneCards("resource", playerId).length;

      const contender = this.getContenderCard(playerId);
      const contenderHealth =
        contender?.definition.type === "contender"
          ? contender.definition.startingHealth
          : undefined;

      playerStats[playerId] = {
        handSize,
        deckSize,
        clashCards,
        resources,
        contenderHealth,
      };
    }

    return {
      turn: ctx.numTurns,
      currentPlayer: ctx.playerOrder[ctx.turnPlayerPos],
      phase: gameState.currentPhase || "unknown",
      playerStats,
    };
  }
}
