import type { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import { GameEngine } from "~/game-engine/core-engine/game-engine";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import { allGundamCardsById } from "./cards/definitions/cards";
import { GundamModel } from "./cards/gundam-card-model";
import type { GundamCardRepository } from "./cards/gundam-card-repository";
import { GundamGame } from "./game-definition/gundam-game-definition";
import type {
  GameCards,
  GundamGameState,
  ZoneType,
} from "./gundam-engine-types";
import type {
  GundamCardDefinition,
  GundamCardFilter,
  GundamPlayerState,
} from "./gundam-generic-types";

export type { GundamCardDefinition, GundamCardFilter, GundamPlayerState };

/**
 * GundamEngine Class
 * Main engine class for Gundam TCG game logic.
 */
export class GundamEngine extends GameEngine<
  GundamGameState,
  GundamCardDefinition,
  GundamPlayerState,
  GundamCardFilter,
  GundamModel
> {
  // Store the repository locally for access in card model initialization
  protected cardRepository?: GundamCardRepository;
  /**
   * Constructor for GundamEngine
   */
  constructor({
    initialState,
    initialCoreCtx,
    cards,
    cardRepository,
    gameId,
    playerId,
    seed,
    players,
    debug,
  }: {
    initialState: GundamGameState;
    initialCoreCtx?: CoreCtx;
    cards: GameCards;
    cardRepository?: GundamCardRepository;
    gameId: string;
    playerId?: string;
    debug?: boolean;
    seed?: string;
    players: string[];
  }) {
    super({
      game: GundamGame,
      seed,
      initialState,
      initialCoreCtx,
      matchID: gameId,
      playerID: playerId,
      players,
      cards,
      debug,
      repository:
        cardRepository || ({} as CardRepository<GundamCardDefinition>),
    });

    if (cardRepository) {
      this.cardRepository = cardRepository;
    }
  }

  /**
   * Initializes card models with Gundam-specific functionality
   */
  protected override initializeCardModels(): void {
    const getCardDefinition = this.cardRepository
      ? (id: string) => this.cardRepository.getCardByPublicId(id)
      : (id: string) => allGundamCardsById[id];

    for (const [playerId, playerCards] of Object.entries(
      this.cardInstanceStore.playerCardsIds,
    )) {
      for (const card of Object.keys(playerCards)) {
        const cardDefinition = getCardDefinition(playerCards[card]);
        if (cardDefinition) {
          const originalCard = this.cardRepository
            ? { ...cardDefinition }
            : cardDefinition;

          if (this.cardRepository && originalCard) {
            (originalCard as any).instanceId = undefined;
          }

          this.cardInstanceStore.getCardInstances()[card] = new GundamModel({
            engine: this,
            card: originalCard,
            instanceId: card,
            ownerId: playerId,
          });
        }
      }
    }
  }

  /**
   * ### Enhanced Card Filtering
   * Type-safe card filtering with Gundam-specific properties
   */

  /** Query cards with Gundam-specific filtering capabilities */
  queryCardsByFilter(filter: GundamCardFilter) {
    return super.queryCardsByFilter(filter);
  }

  /** Get engine store for backward compatibility with legacy APIs */
  getStore() {
    return {
      state: this.getGameState(),
      stateHash: "core-engine-hash",
    };
  }

  /**
   * ### Available Moves
   * Game moves that can be executed by players.
   *
   * **chooseWhoGoesFirstMove(playerId)**
   * - Selects which player goes first
   * - Used during game setup phase
   * - Returns move result with success/failure status
   *
   * **alterHand(cardsToAlter)**
   * - Allows player to mulligan cards from hand
   * - Takes array of card instance IDs to replace
   * - Used during setup phase after initial draw
   */
  get moves() {
    const currentPlayer = this.getCurrentPlayer();

    return {
      chooseFirstPlayer: (playerId: string) => {
        return this.processMove(currentPlayer, "chooseFirstPlayer", [playerId]);
      },
      alterHand: (cardsToAlter: string[]) => {
        return this.processMove(currentPlayer, "alterHand", [cardsToAlter]);
      },
      redrawHand: (shouldRedraw: boolean) => {
        return this.processMove(currentPlayer, "redrawHand", [shouldRedraw]);
      },
      concede: (playerId: string) => {
        return this.processMove(currentPlayer, "concede", [playerId]);
      },
    };
  }

  /**
   * ### State Query Methods
   * Methods for querying game state and context.
   */

  /** Get the owner of a card by instance ID */
  getCardOwner(instanceId: string) {
    return super.getCardOwner(instanceId);
  }

  /** Get the zone of a card by instance ID */
  getCardZone(instanceId: string): ZoneType | undefined {
    const zone = super.getCardZone(instanceId);
    return zone as ZoneType | undefined;
  }

  getZonesCardCount(player?: string): Record<ZoneType, number> {
    const ctx = this.getCtx();
    const playerId = player || "player_one";

    const count: Record<ZoneType, number> = {
      deck: 0,
      resourceDeck: 0,
      resourceArea: 0,
      battleArea: 0,
      shieldBase: 0,
      shieldSection: 0,
      removalArea: 0,
      hand: 0,
      trash: 0,
      sideboard: 0,
    };

    const zones: ZoneType[] = [
      "deck",
      "resourceDeck",
      "resourceArea",
      "battleArea",
      "shieldBase",
      "shieldSection",
      "removalArea",
      "hand",
      "trash",
      "sideboard",
    ];

    for (const zone of zones) {
      const cardZone = ctx.cardZones[`${playerId}-${zone}`];
      count[zone] = cardZone?.cards?.length || 0;
    }

    return count;
  }

  /** Get all card models in the game */
  queryAllCards() {
    return Object.values(
      this.cardInstanceStore.getCardInstances(),
    ) as GundamModel[];
  }

  /** Required implementations of abstract methods */
  getCurrentPhase(): string {
    const ctx = this.getCtx();
    return ctx?.currentPhase || "";
  }

  getCurrentSegment(): string {
    const ctx = this.getCtx();
    return ctx?.currentSegment || "";
  }

  isGameOver(): boolean {
    const ctx = this.getCtx();
    return ctx?.gameOver !== undefined;
  }

  getWinners(): string[] {
    const ctx = this.getCtx();
    return ctx?.winner ? [ctx.winner] : [];
  }
}
