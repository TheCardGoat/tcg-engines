import type { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import {
  getCardZone,
  isZoneOperationError,
  move,
  moveCardByInstanceId,
  shuffleZone,
  type ZoneOperationError,
} from "~/game-engine/core-engine/engine/zone-operation";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import {
  getCurrentPriorityPlayer,
  setPriorityPlayer,
  setTurnPlayer,
} from "~/game-engine/core-engine/state/context";
import {
  ErrorFormatters,
  safeExecute,
} from "~/game-engine/core-engine/utils/error-utils";
import { getValidatedZone } from "~/game-engine/core-engine/utils/validation";
import type {
  BaseCoreCardFilter,
  DefaultCardDefinition,
  DefaultPlayerState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "~/game-engine/engines/grand-archive/grand-archive-engine-types";
import { logger } from "~/shared/logger";
import type { CoreCardInstance } from "../card/core-card-instance";

export class CoreOperation<
  G extends GameSpecificGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> {
  state: CoreEngineState<G>;
  private engine: CoreEngine<
    G,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardInstance
  >;

  // This class acts as an abstraction layer for Ctx manipulations, the goals is to ensure that framework users do not
  // directly manipulate the Ctx object, but rather use this class to perform operations on it.
  constructor({
    state,
    engine,
  }: {
    state: CoreEngineState<G>;
    engine: CoreEngine<
      G,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardInstance
    >;
  }) {
    this.state = state;
    this.engine = engine;
  }

  /**
   * Check if engine is available for operations that require it
   * @returns true if engine is available, false otherwise
   */
  private hasEngine(): boolean {
    // Engine is now required, so it's always available
    return true;
  }

  setOTP(playerId: string) {
    this.state.ctx.otp = playerId;
  }

  setPendingMulligan(playerIds?: string[]) {
    if (!playerIds) {
      this.state.ctx.pendingMulligan = undefined;
      return;
    }

    this.state.ctx.pendingMulligan = new Set();

    for (const id of playerIds) {
      this.state.ctx.pendingMulligan.add(id);
    }
  }

  playerHasMulliganed(playerId: string) {
    this.state.ctx.pendingMulligan?.delete(playerId);
  }

  setPendingChampionSelection(playerIds?: string[]) {
    if (!playerIds) {
      this.state.ctx.pendingChampionSelection = undefined;
      return;
    }

    this.state.ctx.pendingChampionSelection = new Set();

    for (const id of playerIds) {
      this.state.ctx.pendingChampionSelection.add(id);
    }
  }

  playerHasSelectedChampion(playerId: string) {
    this.state.ctx.pendingChampionSelection?.delete(playerId);
  }

  getPlayers() {
    return this.state.ctx.playerOrder;
  }

  setPriorityPlayer(playerId: string) {
    this.state.ctx = setPriorityPlayer(this.state.ctx, playerId);
  }

  setTurnPlayer(playerId: string) {
    this.state.ctx = setTurnPlayer(this.state.ctx, playerId);
  }

  passPriority() {
    const ctx = this.state.ctx;

    const totalPlayers = this.state.ctx.playerOrder.length;
    const playersWhoAltered = this.state.ctx.pendingMulligan?.size || 0;

    if (playersWhoAltered < totalPlayers) {
      // Find the next player who hasn't altered their hand
      let nextPlayerIndex =
        (ctx.priorityPlayerPos + 1) % ctx.playerOrder.length;
      let attempts = 0;

      while (attempts < totalPlayers) {
        const nextPlayerId = ctx.playerOrder[nextPlayerIndex];
        if (ctx.pendingMulligan?.has(nextPlayerId)) {
          // Found a player who still needs to alter their hand
          this.state.ctx.priorityPlayerPos = nextPlayerIndex;
          break;
        }

        nextPlayerIndex = (nextPlayerIndex + 1) % ctx.playerOrder.length;
        attempts++;
      }
    }
  }

  getZone(zoneId: string, playerId?: string) {
    // Use the new getValidatedZone function from validation.ts
    return getValidatedZone(this.state.ctx, zoneId, playerId);
  }

  shuffleZone(zoneId: string, playerId?: string) {
    // Use the new getValidatedZone function from validation.ts
    getValidatedZone(this.state.ctx, zoneId, playerId);

    logger.info(`Shuffling zone ${zoneId} for player ${playerId}`);
    this.state.ctx = shuffleZone(this.state.ctx, zoneId);
  }

  /**
   * Get a card instance by its instance ID
   * @param instanceId The instance ID of the card to retrieve
   * @returns The card instance if found and engine is available, otherwise null
   * @throws {Error} If the card instance is not found
   */
  getCardInstance(instanceId: string): CardInstance {
    return safeExecute(`getCardInstance:${instanceId}`, () => {
      const cardInstance =
        this.engine.cardInstanceStore.getCardByInstanceId(instanceId);

      if (!cardInstance) {
        throw new Error(ErrorFormatters.notFound("Card instance", instanceId));
      }

      // Safe cast: Game engines initialize card models with proper types during engine initialization
      // The card instances in the store should already be of the correct CardInstance type
      return cardInstance as CardInstance;
    });
  }

  /**
   * Query cards based on filter criteria
   * @param filter Filter criteria for cards
   * @returns Array of matching cards if engine is available, otherwise empty array
   */
  queryCards(filter: CardFilter): CardInstance[] {
    return this.engine.queryCards(filter);
  }

  /**
   * Get cards in a specific zone
   * @param zoneName The zone name to look in
   * @param playerId Optional player ID to filter by
   * @returns Array of cards in the zone if engine is available, otherwise empty array
   */
  getCardsInZone(zoneName: string, playerId?: string): CardInstance[] {
    return this.engine.getCardsInZone(zoneName, playerId);
  }

  /**
   * Get the owner of a card
   * @param instanceId The instance ID of the card
   * @returns The owner's player ID if found and engine is available, otherwise undefined
   */
  getCardOwner(instanceId: string) {
    return this.engine.getCardOwner(instanceId);
  }

  /**
   * Get the zone of a card
   * @param instanceId The instance ID of the card
   * @returns The zone name if found and engine is available, otherwise undefined
   */
  getCardZone(instanceId: string) {
    return this.engine.getCardZone(instanceId);
  }

  moveCard({
    playerId,
    from,
    to,
    origin = "start",
    destination = "end",
    instanceId,
  }: {
    playerId: string;
    instanceId?: string;
    from?: string;
    to?: string;
    origin?: "start" | "end";
    destination?: "start" | "end";
  }): ZoneOperationError | undefined {
    return safeExecute(
      `moveCard:${instanceId || `${from}-to-${to}`}`,
      () => {
        if (instanceId) {
          const result = moveCardByInstanceId({
            ctx: this.state.ctx,
            playerId,
            instanceId,
            to,
            from,
            origin,
            destination,
          });

          if (isZoneOperationError(result)) {
            return result; // Return error to caller
          }

          this.state.ctx = result; // Update context on success
        } else {
          this.state.ctx = move({
            ctx: this.state.ctx,
            playerId,
            from,
            to,
            origin,
            destination,
          });
        }

        return undefined; // Success
      },
      { playerID: playerId },
    );
  }

  concede(playerId: string) {}

  incrementTurnCount() {
    this.state.ctx.numTurns = (this.state.ctx.numTurns || 0) + 1;
  }

  getTurnCount() {
    return this.state.ctx.numTurns || 0;
  }

  debug() {
    console.log({
      otp: this.state.ctx.otp,
      priorityPlayer: getCurrentPriorityPlayer(this.state.ctx),
    });
  }
}
