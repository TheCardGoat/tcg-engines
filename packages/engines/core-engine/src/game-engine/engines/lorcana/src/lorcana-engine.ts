import { ResultHelpers } from "~/game-engine/core-engine";
import type { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { CoreEngineOpts } from "~/game-engine/core-engine/engine/core-engine";
import { getCardZone } from "~/game-engine/core-engine/engine/zone-operation";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import { GameEngine } from "~/game-engine/core-engine/game-engine";

import { logger } from "~/game-engine/core-engine/utils/logger";
import { LorcanaCardInstance } from "./cards/lorcana-card-instance";
import type { LorcanaCardRepository } from "./cards/lorcana-card-repository";
import { LorcanaGame } from "./game-definition/lorcana-game-definition";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  TriggerTiming,
  Zone,
} from "./lorcana-engine-types";
import type {
  LorcanaCardDefinition,
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "./lorcana-generic-types";
import { LorcanaCoreOperations } from "./operations/lorcana-core-operations";

// Re-export types for external usage
export type { LorcanaCardDefinition, LorcanaCardFilter, LorcanaPlayerState };

interface LorcanaEngineOpts
  extends Omit<
    CoreEngineOpts<
      LorcanaGameState,
      LorcanaCardDefinition,
      LorcanaPlayerState,
      LorcanaCardFilter,
      LorcanaCardInstance
    >,
    "game" | "repository" | "matchID" | "playerID" | "coreOperationClass"
  > {
  cardRepository?: LorcanaCardRepository;
  gameId: string;
  playerId?: string;
}

export class LorcanaEngine extends GameEngine<
  LorcanaGameState,
  LorcanaCardDefinition,
  LorcanaPlayerState,
  LorcanaCardFilter,
  LorcanaCardInstance
> {
  // Store the repository locally for access in card model initialization
  protected cardRepository?: LorcanaCardRepository;

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
  }: LorcanaEngineOpts) {
    super({
      game: LorcanaGame,
      seed,
      initialState,
      initialCoreCtx,
      matchID: gameId,
      playerID: playerId,
      players,
      cards,
      debug,
      repository:
        cardRepository || ({} as CardRepository<LorcanaCardDefinition>),
      coreOperationClass: LorcanaCoreOperations,
    });

    if (cardRepository) {
      this.cardRepository = cardRepository;
    }
  }

  /**
   * Initializes card models with Lorcana-specific functionality
   */
  protected override initializeCardModels(): void {
    const cardInstances = this.cardInstanceStore.getCardInstances();

    // Replace each CoreCardInstance with a LorcanaCardInstance
    for (const [instanceId, instance] of Object.entries(cardInstances)) {
      if (!(instance instanceof LorcanaCardInstance)) {
        const playerId = this.cardInstanceStore.getCardOwner(instanceId) || "";
        const definition = instance.card as LorcanaCardDefinition;

        const lorcanaInstance = new LorcanaCardInstance(
          this,
          definition,
          instanceId,
          playerId,
        );

        this.cardInstanceStore.replaceCardInstance(instanceId, lorcanaInstance);
      }
    }
  }

  /**
   * Get a card instance by its ID
   * Use this method when you need a fully typed LorcanaCardInstance
   */
  getLorcanaCardInstance(instanceId: string): LorcanaCardInstance | undefined {
    const cardInstance = this.cardInstanceStore.getCardByInstanceId(instanceId);
    return cardInstance as LorcanaCardInstance | undefined;
  }

  /** Get engine store for backward compatibility with legacy APIs */
  getStore() {
    return {
      state: this.getGameState(),
      stateHash: this.getGameStateHash(),
    };
  }

  /**
   * Add triggered effects to the bag for processing
   * This is a Lorcana-specific mechanism for handling card triggers
   */
  addTriggeredEffectsToTheBag(
    timing: TriggerTiming,
    cardInstanceId: string,
  ): void {
    logger.info(
      `Adding triggered effects to bag: ${timing} for card ${cardInstanceId}`,
    );

    // Get the card instance
    const cardInstance =
      this.cardInstanceStore.getCardByInstanceId(cardInstanceId);
    if (!cardInstance) {
      logger.warn(
        `Card instance ${cardInstanceId} not found for trigger timing ${timing}`,
      );
      return;
    }

    // For now, we'll just log the action
    // In a full implementation, this would:
    // 1. Check if the card has triggers for this timing
    // 2. Create appropriate LayerItem entries
    // 3. Add them to the bag in the correct order
    logger.debug(
      `Would add triggers for timing ${timing} on card ${cardInstanceId}`,
    );
  }

  /**
   * Apply Lorcana-specific filtering to cards that have already passed core filtering
   */
  private applyLorcanaSpecificFilters(
    cards: LorcanaCardInstance[],
    filter: LorcanaCardFilter,
  ): LorcanaCardInstance[] {
    // IMPORTANT: Always get the most recent game state to ensure we have latest metadata
    // This ensures consistency between CoreOps and card filtering
    const gameState = this.getGameState();

    return cards.filter((card) => {
      // Always get fresh metadata from the current state
      const meta = gameState.G.metas[card.instanceId] || {};

      // Filter by exerted status
      if (filter.exerted !== undefined) {
        const isExerted = !!meta.exerted;
        if (filter.exerted !== isExerted) {
          return false;
        }
      }

      // Filter by damaged status
      if (filter.damaged !== undefined) {
        const isDamaged = (meta.damage || 0) > 0;
        if (filter.damaged !== isDamaged) {
          return false;
        }
      }

      // Filter by banished status
      if (filter.banished !== undefined) {
        // Cards are banished if they're in the discard zone
        const zone = this.getCardZone(card.instanceId);
        const isBanished = zone === "discard";
        if (filter.banished !== isBanished) {
          return false;
        }
      }

      // Filter by cost
      if (filter.cost) {
        const cardCost = card.card.cost || 0;
        if (filter.cost.exact !== undefined && cardCost !== filter.cost.exact) {
          return false;
        }
        if (filter.cost.min !== undefined && cardCost < filter.cost.min) {
          return false;
        }
        if (filter.cost.max !== undefined && cardCost > filter.cost.max) {
          return false;
        }
      }

      // Filter by strength
      if (filter.strength) {
        const cardStrength = card.card.strength || 0;
        if (
          filter.strength.exact !== undefined &&
          cardStrength !== filter.strength.exact
        ) {
          return false;
        }
        if (
          filter.strength.min !== undefined &&
          cardStrength < filter.strength.min
        ) {
          return false;
        }
        if (
          filter.strength.max !== undefined &&
          cardStrength > filter.strength.max
        ) {
          return false;
        }
      }

      // Filter by willpower
      if (filter.willpower) {
        const cardWillpower = card.card.willpower || 0;
        if (
          filter.willpower.exact !== undefined &&
          cardWillpower !== filter.willpower.exact
        ) {
          return false;
        }
        if (
          filter.willpower.min !== undefined &&
          cardWillpower < filter.willpower.min
        ) {
          return false;
        }
        if (
          filter.willpower.max !== undefined &&
          cardWillpower > filter.willpower.max
        ) {
          return false;
        }
      }

      // Filter by lore
      if (filter.lore) {
        const cardLore = card.card.lore || 0;
        if (filter.lore.exact !== undefined && cardLore !== filter.lore.exact) {
          return false;
        }
        if (filter.lore.min !== undefined && cardLore < filter.lore.min) {
          return false;
        }
        if (filter.lore.max !== undefined && cardLore > filter.lore.max) {
          return false;
        }
      }

      // Filter by inkable status
      if (filter.inkable !== undefined) {
        const isInkable = !!card.card.inkwell;
        if (filter.inkable !== isInkable) {
          return false;
        }
      }

      // Filter by card type
      if (filter.cardType) {
        const cardTypes = card.card.type?.toLowerCase() || "";
        if (!cardTypes.includes(filter.cardType.toLowerCase())) {
          return false;
        }
      }

      // Filter by move cost
      if (filter.moveCost) {
        const cardMoveCost = (card.card as any).moveCost || 0;
        if (
          filter.moveCost.exact !== undefined &&
          cardMoveCost !== filter.moveCost.exact
        ) {
          return false;
        }
        if (
          filter.moveCost.min !== undefined &&
          cardMoveCost < filter.moveCost.min
        ) {
          return false;
        }
        if (
          filter.moveCost.max !== undefined &&
          cardMoveCost > filter.moveCost.max
        ) {
          return false;
        }
      }

      // Additional filters can be added here as needed

      return true;
    });
  }

  /**
   * Exert ink cards to pay for costs
   * This is a Lorcana-specific mechanism for paying costs with ink
   */
  exertInkForCost(playerId: string, cost: number): boolean {
    logger.info(`Player ${playerId} attempting to pay ${cost} ink`);

    if (cost <= 0) {
      logger.debug("No ink cost to pay");
      return true;
    }

    // Use the card filter approach with Lorcana-specific filtering
    const filter: LorcanaCardFilter = {
      zone: "inkwell",
      owner: playerId,
      exerted: false,
    };

    const readyInkCards = this.cardInstanceStore.queryCards(filter);

    if (readyInkCards.length < cost) {
      logger.warn(
        `Player ${playerId} does not have enough ready ink. Required: ${cost}, Available: ${readyInkCards.length}`,
      );
      return false;
    }

    // Exert the required number of ink cards
    for (let i = 0; i < cost; i++) {
      const inkCard = readyInkCards[i];
      if (inkCard) {
        this.exertCard({ card: inkCard.instanceId, exerted: true });
      }
    }

    logger.info(`Player ${playerId} successfully paid ${cost} ink`);
    return true;
  }

  exertCard({ card, exerted }: { card: string; exerted: boolean }) {
    // Always get the current game state to ensure we're modifying the same reference
    // that the card filtering system will use
    const gameState = this.getGameState();

    // Mark ink card as exerted in game state metadata
    if (gameState.G.metas[card]) {
      // Make sure we're modifying the existing object, not creating a new reference
      gameState.G.metas[card].exerted = exerted;
    } else {
      gameState.G.metas[card] = { exerted };
    }

    logger.debug(`Exerted card ${card} set to ${exerted}`);
  }

  /**
   * Get the number of available (ready) ink cards for a player
   * This is used for cost validation
   */
  getAvailableInk(playerId: string): number {
    // Use the card filter approach with Lorcana-specific filtering
    // This should work now that we've properly implemented the filter
    const filter: LorcanaCardFilter = {
      zone: "inkwell",
      owner: playerId,
      exerted: false,
    };
    const readyInkCards = this.cardInstanceStore.queryCards(filter);

    // Add debug logging to verify
    const gameState = this.getGameState();
    const allInkCards = this.getCardsInZone("inkwell", playerId);
    const directFilterCount = allInkCards.filter(
      (card) => !gameState.G.metas[card.instanceId]?.exerted,
    ).length;

    // If there's a mismatch, log it
    if (readyInkCards.length !== directFilterCount) {
      logger.warn(
        `[getAvailableInk] Filter mismatch: filter found ${readyInkCards.length} but direct check found ${directFilterCount} ready ink cards`,
      );
      // Use the direct filter as a fallback
      return directFilterCount;
    }

    return readyInkCards.length;
  }

  /**
   * Returns the total number of cards in the player's inkwell
   */
  getTotalInk(playerId: string): number {
    // Count all cards in the player's inkwell zone
    const filter: LorcanaCardFilter = {
      zone: "inkwell",
      owner: playerId,
    };
    const allInkCards = this.cardInstanceStore.queryCards(filter);
    return allInkCards.length;
  }

  /**
   * Process all effects currently in the bag
   * This resolves triggered effects in the proper order
   */
  resolveBag(): void {
    logger.info("Resolving bag effects");

    // For now, we'll just log the action
    // In a full implementation, this would:
    // 1. Process each effect in the bag according to Lorcana rules
    // 2. Handle player choices and interactions
    // 3. Update the game state accordingly
    logger.debug("Would resolve all effects in the bag");
  }

  get moves() {
    const currentPlayer = this.playerID;

    // These are the moves available to players to manipulate the game state at will.
    // They are not part of the game rules, but rather allow players to perform actions that correct the game state if needed.
    const manualMoves = {
      moveCard: (params: { card: string; to: string }) => {
        return this.processMove(currentPlayer, "manualMoves-moveCard", [
          params,
        ]);
      },
      updateLore: (params: { player: string; lore: string }) => {
        return this.processMove(currentPlayer, "manualMoves-updateLore", [
          params,
        ]);
      },
      exertCard: (params: { card: string; exerted: boolean }) => {
        return this.processMove(currentPlayer, "manualMoves-exertCard", [
          params,
        ]);
      },
    };

    return {
      manualMoves,
      chooseWhoGoesFirstMove: (playerId: string) => {
        // The move function expects (state, playerId) - playerId is passed as first arg to processMove
        // and then again as the first element of args array, so the move gets (state, playerId)
        return this.processMove(currentPlayer, "chooseWhoGoesFirstMove", [
          playerId,
        ]);
      },
      alterHand: (cardsToAlter: string[]) => {
        if (!currentPlayer) {
          logger.warn("No current player found for alterHand move.");
          return ResultHelpers.error(
            "No current player found for alterHand move.",
          );
        }

        return this.processMove(currentPlayer, "alterHand", cardsToAlter);
      },
      putACardIntoTheInkwell: (instanceId: string) => {
        if (!currentPlayer) {
          logger.warn(
            "No current player found for putACardIntoTheInkwell move.",
          );
          return ResultHelpers.error(
            "No current player found for putACardIntoTheInkwell move.",
          );
        }

        return this.processMove(currentPlayer, "putACardIntoTheInkwell", [
          instanceId,
        ]);
      },
      passTurn: () => {
        if (!currentPlayer) {
          logger.warn("No current player found for passTurn move.");
          return ResultHelpers.error(
            "No current player found for passTurn move.",
          );
        }

        return this.processMove(currentPlayer, "passTurn", []);
      },
      moveCharToLocation: (params: { location: string; character: string }) => {
        const { location, character } = params;
        return this.processMove(currentPlayer, "moveCharacter", [
          location,
          character,
        ]);
      },
    };
  }

  /**
   * Override the createCoreOperationFromState method to return a properly typed LorcanaCoreOperations
   * This eliminates the need for type casting when using this method
   */
  protected override createCoreOperationFromState(
    state: CoreEngineState<LorcanaGameState>,
  ): LorcanaCoreOperations {
    // The parent method will create a CoreOperation using the coreOperationClass we provided (LorcanaCoreOperations)
    // We can safely return it with the correct type because we know it's LorcanaCoreOperations
    return super.createCoreOperationFromState(state) as LorcanaCoreOperations;
  }

  leaveLocation(char: LorcanaCardInstance) {
    const lorcanaOps = this.createCoreOperationFromState(this.getGameState());
    lorcanaOps.leaveLocation(char);
  }

  enterLocation(char: LorcanaCardInstance, location: LorcanaCardInstance) {
    const lorcanaOps = this.createCoreOperationFromState(this.getGameState());
    lorcanaOps.enterLocation(char, location);

    // Add triggered effects to the bag (rule 4.3.7.5)
    lorcanaOps.addTriggeredEffectsToTheBag("onMove", char.instanceId);
  }

  getCardZone(instanceId: string): Zone | undefined {
    const zone = super.getCardZone(instanceId);
    return zone as Zone | undefined;
  }

  getZonesCardCount(player?: string): Record<Zone, number> {
    const ctx = this.getCtx();
    const playerId = player || "player_one";

    const count: Record<Zone, number> = {
      deck: 0,
      hand: 0,
      play: 0,
      bag: 0,
      inkwell: 0,
      discard: 0,
    };

    // Get zone counts from ctx.cardZones using the same pattern as getZone()
    const zones: Zone[] = ["deck", "hand", "play", "bag", "inkwell", "discard"];
    for (const zone of zones) {
      const cardZone = getCardZone(ctx, zone, playerId);
      count[zone] = cardZone?.cards?.length || 0;
    }

    return count;
  }

  queryAllPlayers() {
    return Object.values(this.getCtx().players);
  }

  queryAllZones() {
    return Object.values(this.getCtx().cardZones);
  }

  queryAllCards() {
    return this.getAllCards();
  }

  getCardMeta(instanceId: string): LorcanaCardMeta {
    return this.getGameState().G.metas[instanceId] || {};
  }

  queryCardsByFilter(filter: LorcanaCardFilter): LorcanaCardInstance[] {
    // Special handling for exerted filter to ensure it's properly synchronized
    // This is the most direct fix that ensures metadata changes are seen by card filtering
    if (filter.exerted !== undefined) {
      // First get all cards that match the basic criteria (zone, owner, etc.)
      const baseFilter = { ...filter };
      delete baseFilter.exerted; // Remove exerted to get all matching cards

      // Apply base filtering
      const baseResults = super.queryCardsByFilter(baseFilter);

      // Convert to LorcanaCardInstance for type safety
      const lorcanaCards = baseResults as LorcanaCardInstance[];

      // Get the latest game state for fresh metadata
      const gameState = this.getGameState();

      // Manually filter by exerted status
      return lorcanaCards.filter((card) => {
        const meta = gameState.G.metas[card.instanceId] || {};
        const isExerted = !!meta.exerted;
        return filter.exerted === isExerted;
      });
    }

    // For all other filters, use the standard approach
    // First apply core filtering (zone, owner, publicId, instanceId)
    const baseResults = super.queryCardsByFilter(filter);

    // Convert to LorcanaCardInstance for type safety
    const lorcanaCards = baseResults as LorcanaCardInstance[];

    // Apply Lorcana-specific filtering
    return this.applyLorcanaSpecificFilters(lorcanaCards, filter);
  }

  get core() {
    return this;
  }

  hasPlayerMulliganed(playerId: string): boolean {
    return super.hasPlayerMulliganed(playerId);
  }

  canPlayerPutCardIntoInkwell(playerId: string): boolean {
    return (
      this.getCtx().currentPhase === "mainPhase" &&
      this.getCtx().currentStep === "idle" &&
      this.getState().G.turnActions?.putCardIntoInkwell === undefined
    );
  }
}
