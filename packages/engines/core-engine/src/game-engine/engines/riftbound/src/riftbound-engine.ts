/**
 * Main Riftbound Engine class
 * Extends the GameEngine framework to implement Riftbound TCG rules
 */

// Imports from core engine
import {
  CardRepository,
  createCardRepository,
} from "~/game-engine/core-engine/card/card-repository-factory";
import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { GameCards } from "~/game-engine/core-engine/types";
import type {
  BaseCoreCardFilter,
  DefaultCardDefinition,
} from "~/game-engine/core-engine/types/game-specific-types";
import { LogLevel } from "../../../types/log-types";
import type { LogCollector } from "../../../utils/log-collector";

// Riftbound specific imports
import { RiftboundGame } from "./game-definition/riftbound-game-definition";
import type {
  Domain,
  GamePhase,
  GameSegment,
  MoveResult,
  RiftboundGameState,
  RiftboundMoveParams,
  RiftboundMoves,
  RiftboundMoveType,
  RiftboundPlayerState,
  ZoneType,
} from "./riftbound-generic-types";
import { createEmptyRiftboundGameState } from "./utils/createEmptyRiftboundGameState";

// Type definitions
type RiftboundCardDefinition = DefaultCardDefinition;
type RiftboundCardFilter = BaseCoreCardFilter;
type RiftboundCardInstance = CoreCardInstance<RiftboundCardDefinition>;

/**
 * Configuration options for the Riftbound engine
 */
export interface RiftboundEngineConfig {
  initialState?: RiftboundGameState;
  initialCoreCtx?: CoreCtx;
  cards?: Record<string, Record<string, string>>;
  cardRepository?: CardRepository<RiftboundCardDefinition>;
  playerId?: string;
  gameId: string;
  matchId?: string;
  debug?: boolean;
  seed: string;
  players: string[];
  skipPreGame?: boolean;
  logCollector?: LogCollector;
}

// Create a simple card repository for testing
const createDefaultRepository = (): CardRepository<RiftboundCardDefinition> => {
  const mockCards: Record<string, RiftboundCardDefinition> = {};
  const mockDictionary: GameCards = {
    player_one: {},
    player_two: {},
  };
  return new CardRepository<RiftboundCardDefinition>(mockDictionary, mockCards);
};

/**
 * Main Riftbound Engine class
 * Implements the complete Riftbound TCG ruleset
 */
export class RiftboundEngine extends CoreEngine<
  RiftboundGameState,
  RiftboundCardDefinition,
  RiftboundPlayerState,
  RiftboundCardFilter,
  RiftboundCardInstance
> {
  // Store the repository locally for access in card model initialization
  protected cardRepository?: CardRepository<RiftboundCardDefinition>;

  /**
   * Constructor for RiftboundEngine
   */
  constructor(config: RiftboundEngineConfig) {
    const initialState = config.initialState || createEmptyRiftboundGameState();
    const repository = config.cardRepository || createDefaultRepository();

    super({
      game: RiftboundGame,
      seed: config.seed,
      initialState,
      initialCoreCtx: config.initialCoreCtx,
      matchID: config.gameId,
      playerID: config.playerId,
      debug: config.debug,
      players: config.players,
      cards: config.cards || {},
      repository,
      logCollector: config.logCollector,
    });

    if (config.cardRepository) {
      this.cardRepository = config.cardRepository;
    }

    // Initialize the engine state
    this.initializeEngine(config);
  }

  /**
   * Initialize the engine with configuration
   */
  private initializeEngine(config: RiftboundEngineConfig): void {
    const state = this.getGameState();
    const G = state.G;

    this.log(
      LogLevel.NORMAL_PLAYER,
      `Riftbound Engine initialized: ${config.gameId}`,
      {
        playerId: this.playerID,
        gameMode: G.gameMode,
        playerCount: config.players?.length || 0,
        skipPreGame: config.skipPreGame,
      },
    );
  }

  /**
   * Initializes card models with Riftbound-specific functionality
   */
  protected override initializeCardModels(): void {
    // This will be implemented when the card system is complete
    // Similar to how GundamModel initializes cards
  }

  /**
   * Get zone card counts for a player
   */
  getZonesCardCount(player?: string): Record<ZoneType, number> {
    const ctx = this.getCtx();
    const playerId = player || "player_one";

    const count: Record<ZoneType, number> = {
      deck: 0,
      hand: 0,
      resourceDeck: 0,
      base: 0,
      legendZone: 0,
      championZone: 0,
      removalArea: 0,
      trash: 0,
      sideboard: 0,
    };

    const zones: ZoneType[] = [
      "deck",
      "hand",
      "resourceDeck",
      "base",
      "legendZone",
      "championZone",
      "removalArea",
      "trash",
      "sideboard",
    ];

    for (const zone of zones) {
      const cardZone = ctx.cardZones[`${playerId}-${zone}`];
      count[zone] = cardZone?.cards?.length || 0;
    }

    return count;
  }

  /** Query all cards in the game */
  queryAllCards() {
    return Object.values(
      this.cardInstanceStore.getCardInstances(),
    ) as RiftboundCardInstance[];
  }

  /**
   * Process a Riftbound-specific move with type safety
   */
  processRiftboundMove<T extends RiftboundMoveType>(
    moveType: T,
    params: any,
  ): MoveResult {
    try {
      // Get the current player (for moves that need a player ID)
      const currentPlayer =
        this.playerID || this.getTurnPlayer() || "player_one";

      // Process the move through CoreEngine
      const result = this.processMove(currentPlayer, moveType, [params]);

      if (result.success) {
        return {
          success: true,
          gameState: result.data.state.G,
          logs: result.data.logs,
        };
      }
      return {
        success: false,
        error: "Move failed",
      };
    } catch (error) {
      this.log(
        LogLevel.DEVELOPER,
        `Error processing move ${moveType}:`,
        error as Record<string, unknown>,
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Game move implementations
   */
  get moves() {
    return {
      // Will implement actual moves later
      concede: (playerId: string) => {
        return this.processMove(playerId, "concede", [playerId]);
      },
    };
  }

  /**
   * Get the current game state for debugging
   */
  getDebugState() {
    const G = this.getGameState().G;
    const ctx = this.getGameState().ctx;

    return {
      gameSegment: ctx.currentSegment as string,
      gamePhase: ctx.currentPhase as string,
      gameState: G.gameState as string,
      turnPlayer: ctx.playerOrder[ctx.turnPlayerPos] || "NOT_SET",
      priorityPlayers: [ctx.playerOrder[ctx.priorityPlayerPos] || "NOT_SET"],
      playerCount: ctx.playerOrder.length,
      victoryScore: G.victoryScore,
    };
  }

  /**
   * Required implementations of abstract methods
   */
  getCurrentPhase(): string {
    const ctx = this.getCtx();
    return ctx?.currentPhase || "";
  }

  getCurrentSegment(): string {
    const ctx = this.getCtx();
    return ctx?.currentSegment || "";
  }

  isGameOver(): boolean {
    const G = this.getGameState().G;

    // Check for victory by points
    for (const playerId of this.getGameState().ctx.playerOrder) {
      if (this.canWin(playerId)) {
        return true;
      }
    }

    return this.getCtx()?.gameOver !== undefined;
  }

  /**
   * Check if a player can win the game
   */
  canWin(playerId: string): boolean {
    const player = this.getPlayerState(playerId);
    return player ? player.points >= 8 : false;
  }

  getWinners(): string[] {
    const ctx = this.getCtx();
    if (!ctx?.gameOver) {
      return [];
    }

    const winners: string[] = [];
    for (const playerId of ctx.playerOrder) {
      if (this.canWin(playerId)) {
        winners.push(playerId);
      }
    }

    return winners;
  }

  /**
   * Serialize the game state for persistence
   */
  serialize(): string {
    return JSON.stringify({
      gameState: this.getGameState().G,
      coreCtx: this.getGameState().ctx,
    });
  }

  /**
   * Deserialize and restore game state
   */
  static deserialize(
    data: string,
    config: Omit<RiftboundEngineConfig, "initialState">,
  ): RiftboundEngine {
    const parsed = JSON.parse(data);

    return new RiftboundEngine({
      ...config,
      initialState: parsed.gameState,
      initialCoreCtx: parsed.coreCtx,
    });
  }
}
