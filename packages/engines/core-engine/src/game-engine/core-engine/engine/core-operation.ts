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
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import {
  getCurrentPriorityPlayer,
  setPriorityPlayer,
  setTurnPlayer,
} from "~/game-engine/core-engine/state/context";
import type {
  BaseCoreCardFilter,
  DefaultCardDefinition,
  DefaultCardMeta,
  DefaultPlayerState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificCardMeta,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";
import {
  createContextWithPriorityPlayer,
  createContextWithTurnPlayer,
} from "~/game-engine/core-engine/utils/context-factory";
import {
  ErrorFormatters,
  safeExecute,
} from "~/game-engine/core-engine/utils/error-utils";
import { getValidatedZone } from "~/game-engine/core-engine/utils/validation";
import { logger } from "~/shared/logger";
import type { CoreCardInstance } from "../card/core-card-instance";

export class CoreOperation<
  G extends GameSpecificGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardMeta extends GameSpecificCardMeta = DefaultCardMeta,
  CardInstance extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> {
  state: CoreEngineState<G>;
  protected engine: CoreEngine<
    G,
    CardDefinition,
    PlayerState,
    CardFilter,
    CardMeta,
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
      CardMeta,
      CardInstance
    >;
  }) {
    this.state = state;
    this.engine = engine;
  }

  // =============================================================================
  // CARD METADATA OPERATIONS
  // =============================================================================

  /**
   * Get card metadata by instance ID
   * @param instanceId The instance ID of the card
   * @returns The card metadata object or empty object if not found
   */
  getCardMeta(instanceId: string): CardMeta {
    return this.state.ctx.cardMetas[instanceId] || ({} as CardMeta);
  }

  /**
   * Set card metadata (replaces existing metadata)
   * @param instanceId The instance ID of the card
   * @param meta The metadata object to set
   */
  setCardMeta(instanceId: string, meta: Partial<CardMeta>): void {
    if (!this.state.ctx.cardMetas[instanceId]) {
      this.state.ctx.cardMetas[instanceId] = {} as CardMeta;
    }
    // Merge the provided metadata with existing metadata
    Object.assign(this.state.ctx.cardMetas[instanceId], meta);
    logger.debug(`Set card meta for ${instanceId}:`, meta);
  }

  /**
   * Update a specific field in card metadata
   * @param instanceId The instance ID of the card
   * @param field The metadata field to update
   * @param value The new value for the field
   */
  updateCardMeta<K extends keyof CardMeta>(
    instanceId: string,
    field: K,
    value: CardMeta[K],
  ): void {
    if (!this.state.ctx.cardMetas[instanceId]) {
      this.state.ctx.cardMetas[instanceId] = {} as CardMeta;
    }
    this.state.ctx.cardMetas[instanceId][field] = value;
    logger.debug(
      `Updated card meta field ${String(field)} for ${instanceId}:`,
      value,
    );
  }

  /**
   * Remove all metadata for a card
   * @param instanceId The instance ID of the card
   */
  removeCardMeta(instanceId: string): void {
    delete this.state.ctx.cardMetas[instanceId];
    logger.debug(`Removed card meta for ${instanceId}`);
  }

  /**
   * Clear a specific metadata field for a card
   * @param instanceId The instance ID of the card
   * @param field The metadata field to clear
   */
  clearCardMetaField<K extends keyof CardMeta>(
    instanceId: string,
    field: K,
  ): void {
    if (this.state.ctx.cardMetas[instanceId]) {
      delete this.state.ctx.cardMetas[instanceId][field];
      logger.debug(
        `Cleared card meta field ${String(field)} for ${instanceId}`,
      );
    }
  }

  /**
   * Set metadata for multiple cards at once
   * @param metas Record of instanceId to metadata mappings
   */
  setCardMetas(metas: Record<string, CardMeta>): void {
    for (const [instanceId, meta] of Object.entries(metas)) {
      this.setCardMeta(instanceId, meta);
    }
  }

  /**
   * Get all card metadata
   * @returns Record of all card metadata
   */
  getCardMetas(): Record<string, CardMeta> {
    return this.state.ctx.cardMetas;
  }

  /**
   * Clear all card metadata
   */
  clearAllCardMetas(): void {
    this.state.ctx.cardMetas = {};
    logger.debug("Cleared all card metadata");
  }

  /**
   * Get cards that have a specific metadata field value
   * @param field The metadata field to check
   * @param value The value to match
   * @returns Array of instance IDs that match the criteria
   */
  getCardsWithMeta<K extends keyof CardMeta>(
    field: K,
    value: CardMeta[K],
  ): string[] {
    const matchingCards: string[] = [];
    for (const [instanceId, meta] of Object.entries(this.state.ctx.cardMetas)) {
      if (meta[field] === value) {
        matchingCards.push(instanceId);
      }
    }
    return matchingCards;
  }

  /**
   * Query cards by metadata using a predicate function
   * @param predicate Function that returns true for matching metadata
   * @returns Array of instance IDs that match the predicate
   */
  queryCardsByMeta(predicate: (meta: CardMeta) => boolean): string[] {
    const matchingCards: string[] = [];
    for (const [instanceId, meta] of Object.entries(this.state.ctx.cardMetas)) {
      if (predicate(meta)) {
        matchingCards.push(instanceId);
      }
    }
    return matchingCards;
  }

  // =============================================================================
  // EXISTING OPERATIONS (Updated context access)
  // =============================================================================

  /**
   * Get the current context
   * @returns The current context object
   */
  getCtx(): CoreCtx<unknown, CardMeta> {
    return this.state.ctx;
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
    logger.log(`CoreOperation.setOTP: Setting otp to ${playerId}`);
    this.state.ctx.otp = playerId;
    logger.log(`CoreOperation.setOTP: otp is now ${this.state.ctx.otp}`);
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

  passTurn() {
    // THIS SHOULD HAVE BEEN END mainPhase
    // THIS IS NOT A CORE OPERATION. Passing a turn is a move and can only be done as move
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

  /**
   * Ready all cards for a player (inkwell and play zones)
   */
  readyAllCards(playerId: string): void {
    // TODO: Implement ready all cards logic
    logger.debug(`Ready all cards for player ${playerId}`);
  }

  /**
   * Clear drying state for characters
   */
  clearDryingState(playerId: string): void {
    // TODO: Implement clear drying state logic
    logger.debug(`Clear drying state for player ${playerId}`);
  }

  /**
   * Gain lore from locations in play
   */
  gainLoreFromLocations(playerId: string): void {
    // Minimal implementation for flow testing - in production this would
    // iterate through locations in play and sum their lore values
    try {
      // Get all locations in play for this player
      const playCards = this.getCardsInZone("play", playerId);
      let totalLore = 0;

      logger.debug(
        `gainLoreFromLocations: Checking ${playCards.length} cards in play for player ${playerId}`,
      );

      for (const card of playCards) {
        logger.debug(
          `Card: ${card ? (card as any).card?.name || (card as any).card?.id || "unnamed" : "null"}, lore: ${(card as any)?.card?.lore}`,
        );
        logger.debug("Full card structure:", JSON.stringify(card, null, 2));

        // Check if this is a location card with lore (card.card.lore)
        if (
          card &&
          (card as any).card &&
          typeof (card as any).card.lore === "number"
        ) {
          totalLore += (card as any).card.lore;
          logger.debug(
            `Added ${(card as any).card.lore} lore from card ${(card as any).card.name || (card as any).card.id}`,
          );
        }
      }

      if (totalLore > 0) {
        // Add lore to player (initialize if not set)
        if (!this.state.ctx.players[playerId]) {
          this.state.ctx.players[playerId] = {
            id: playerId,
            name: playerId,
            turnHistory: [],
          };
        }
        if (!this.state.ctx.players[playerId].lore) {
          this.state.ctx.players[playerId].lore = 0;
        }
        this.state.ctx.players[playerId].lore += totalLore;

        logger.debug(
          `Player ${playerId} gained ${totalLore} lore from locations (total: ${this.state.ctx.players[playerId].lore})`,
        );
      } else {
        logger.debug(
          `No lore gained for player ${playerId} - no locations with lore in play`,
        );
      }
    } catch (error) {
      logger.error(
        `Error in gainLoreFromLocations for player ${playerId}: ${error}`,
      );
    }
  }

  /**
   * Process turn start triggers and add to bag
   */
  processTurnStartTriggers(): void {
    // TODO: Implement process turn start triggers logic
    logger.debug("Process turn start triggers");
  }

  /**
   * Process turn start effects that apply during turn
   */
  processTurnStartEffects(): void {
    // TODO: Implement process turn start effects logic
    logger.debug("Process turn start effects");
  }

  /**
   * Draw a card for a player
   */
  drawCard(playerId: string, amount: number): void {
    // TODO: Implement draw card logic
    logger.debug(`Draw card for player ${playerId}`);
  }

  /**
   * Check if this is the first turn of the game
   */
  isFirstTurn(): boolean {
    // TODO: Implement first turn detection
    return this.state.ctx.numTurns === 1;
  }

  /**
   * Get the current turn player
   */
  getCurrentTurnPlayer(): string {
    const ctx = this.state.ctx;
    if (ctx?.turnPlayerPos !== undefined) {
      return ctx.playerOrder[ctx.turnPlayerPos];
    }
    return ctx?.playerOrder[0] || "";
  }

  endPhase(phaseName?: string): void {
    // Instead of immediately transitioning, set a flag for the flow manager to process
    // This avoids conflicts with the automatic flow processing that happens after moves
    if (phaseName) {
      // Request transition to specific phase
      this.state.ctx.deferredPhaseTransition = phaseName;
    } else {
      // Request to end current phase and advance to next
      this.state.ctx.deferredPhaseTransition = "ADVANCE_TO_NEXT";
    }
  }

  endStep(stepName: string): void {
    // TODO: Implement step-specific transitions when needed
    logger.debug(`EndStep called for ${stepName} - not yet implemented`);
  }

  endSegment(segmentName: string): void {
    // TODO: Implement segment-specific transitions when needed
    logger.debug(`EndSegment called for ${segmentName} - not yet implemented`);
  }
}
