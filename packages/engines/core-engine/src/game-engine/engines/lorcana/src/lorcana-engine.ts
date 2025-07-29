import { ResultHelpers } from "~/game-engine/core-engine";
import type { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { CoreEngineOpts } from "~/game-engine/core-engine/engine/core-engine";
import { getCardZone } from "~/game-engine/core-engine/engine/zone-operation";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import { GameEngine } from "~/game-engine/core-engine/game-engine";

import { logger } from "~/game-engine/core-engine/utils/logger";
import type { TriggerTiming } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type { PlayCardOptions } from "~/game-engine/engines/lorcana/src/moves/play-card";
import { LorcanaCardInstance } from "./cards/lorcana-card-instance";
import type {
  LorcanaCardDefinition,
  LorcanaCardRepository,
} from "./cards/lorcana-card-repository";
import { LorcanaGame } from "./game-definition/lorcana-game-definition";
import type {
  LorcanaCardFilter,
  LorcanaCardFilterExtended,
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaPlayerState,
  LorcanaZone,
} from "./lorcana-engine-types";
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
  LorcanaCardMeta,
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
      coreOperationClass: LorcanaCoreOperations as any,
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
      // Always get fresh metadata from the current context
      const ctx = this.getCtx();
      const meta = ctx.cardMetas?.[card.instanceId] || {};

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
        if (
          filter.cost.exact !== undefined &&
          typeof filter.cost.exact === "number" &&
          cardCost !== filter.cost.exact
        ) {
          return false;
        }
        if (
          filter.cost.min !== undefined &&
          typeof filter.cost.min === "number" &&
          cardCost < filter.cost.min
        ) {
          return false;
        }
        if (
          filter.cost.max !== undefined &&
          typeof filter.cost.max === "number" &&
          cardCost > filter.cost.max
        ) {
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
        if (Array.isArray(filter.cardType)) {
          // Handle array of card types (from builder)
          if (
            !filter.cardType.some((type) =>
              cardTypes.includes(type.toLowerCase()),
            )
          ) {
            return false;
          }
        } else {
          // Handle single card type (legacy filter)
          if (!cardTypes.includes(filter.cardType.toLowerCase())) {
            return false;
          }
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
    // Always get the current context to ensure we're modifying the same reference
    // that the card filtering system will use
    const ctx = this.getCtx();

    // Mark ink card as exerted in context metadata
    if (!ctx.cardMetas) {
      ctx.cardMetas = {};
    }

    if (ctx.cardMetas[card]) {
      // Make sure we're modifying the existing object, not creating a new reference
      ctx.cardMetas[card].exerted = exerted;
    } else {
      ctx.cardMetas[card] = { exerted };
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
    const ctx = this.getCtx();
    const allInkCards = this.getCardsInZone("inkwell", playerId);
    const directFilterCount = allInkCards.filter(
      (card) => !ctx.cardMetas?.[card.instanceId]?.exerted,
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

    const playCard = (params: { card: string; opts?: PlayCardOptions }) => {
      return this.processMove(currentPlayer, "playCard", [
        params.card,
        params.opts,
      ]);
    };

    return {
      manualMoves,
      playCard,
      resolveBag: () => {
        if (!currentPlayer) {
          logger.warn("No current player found for resolveBag move.");
          return ResultHelpers.error(
            "No current player found for resolveBag move.",
          );
        }

        return this.processMove(currentPlayer, "resolveBag", []);
      },
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
      sing: (params: { singer: string; song: string }) => {
        return playCard({
          card: params.song,
          opts: {
            alternativeCost: {
              type: "sing",
              targetInstanceId: [params.singer],
            },
          },
        });
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

  get bag() {
    return this.getState().G.bag;
  }

  /**
   * Override the createCoreOperationFromState method to return a properly typed LorcanaCoreOperations
   * This eliminates the need for type casting when using this method
   */
  protected override createCoreOperationFromState(
    state: CoreEngineState<LorcanaGameState>,
  ): any {
    return super.createCoreOperationFromState(state) as any;
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

  getCardZone(instanceId: string): LorcanaZone | undefined {
    const zone = super.getCardZone(instanceId);
    return zone as LorcanaZone | undefined;
  }

  getZonesCardCount(player?: string): Record<LorcanaZone, number> {
    const ctx = this.getCtx();
    const playerId = player || "player_one";

    const count: Record<LorcanaZone, number> = {
      deck: 0,
      hand: 0,
      play: 0,
      bag: 0,
      inkwell: 0,
      discard: 0,
    };

    // Get zone counts from ctx.cardZones using the same pattern as getZone()
    const zones: LorcanaZone[] = [
      "deck",
      "hand",
      "play",
      "bag",
      "inkwell",
      "discard",
    ];
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

  queryCardsInPlay(): LorcanaCardInstance[] {
    const filter: LorcanaCardFilter = {
      zone: "play",
    };

    return this.cardInstanceStore.queryCards(filter) as LorcanaCardInstance[];
  }

  getCardMeta(instanceId: string): LorcanaCardMeta {
    const ctx = this.getCtx();
    return ctx.cardMetas?.[instanceId] || {};
  }

  queryCardsByFilter(
    filter: LorcanaCardFilter | LorcanaCardFilterExtended,
  ): LorcanaCardInstance[] {
    // Handle extended filters from the builder
    if (this.isExtendedFilter(filter)) {
      return this.queryCardsByExtendedFilter(filter);
    }

    // Handle legacy filters
    const legacyFilter = filter as LorcanaCardFilter;

    // Special handling for exerted filter to ensure it's properly synchronized
    if (legacyFilter.exerted !== undefined) {
      // First get all cards that match the basic criteria (zone, owner, etc.)
      const baseFilter = { ...legacyFilter };
      delete baseFilter.exerted; // Remove exerted to get all matching cards

      // Apply base filtering
      const baseResults = super.queryCardsByFilter(baseFilter);

      // Convert to LorcanaCardInstance for type safety
      const lorcanaCards = baseResults as LorcanaCardInstance[];

      // Get the latest context for fresh metadata
      const ctx = this.getCtx();

      // Manually filter by exerted status
      return lorcanaCards.filter((card) => {
        const meta = ctx.cardMetas?.[card.instanceId] || {};
        const isExerted = !!meta.exerted;
        return legacyFilter.exerted === isExerted;
      });
    }

    // For all other filters, use the standard approach
    // First apply core filtering (zone, owner, publicId, instanceId)
    const baseResults = super.queryCardsByFilter(legacyFilter);

    // Convert to LorcanaCardInstance for type safety
    const lorcanaCards = baseResults as LorcanaCardInstance[];

    // Apply Lorcana-specific filtering
    return this.applyLorcanaSpecificFilters(lorcanaCards, legacyFilter);
  }

  /**
   * Type guard to check if filter is the extended builder type
   */
  private isExtendedFilter(
    filter: LorcanaCardFilter | LorcanaCardFilterExtended,
  ): filter is LorcanaCardFilterExtended {
    // If it's an empty object {}, treat it as an extended filter
    // This handles the case where LorcanaCardFilterBuilder().build() returns {}
    if (Object.keys(filter).length === 0) {
      return true;
    }

    // Extended filters have properties that legacy filters don't have
    const extendedFilter = filter as LorcanaCardFilterExtended;
    return !!(
      extendedFilter.and ||
      extendedFilter.or ||
      extendedFilter.not ||
      extendedFilter.name ||
      extendedFilter.title ||
      extendedFilter.text ||
      extendedFilter.ready ||
      extendedFilter.dry ||
      extendedFilter.atLocation ||
      extendedFilter.hasCardUnder ||
      extendedFilter.canSingTogether ||
      extendedFilter.canShift ||
      extendedFilter.source ||
      extendedFilter.location ||
      extendedFilter.usedInkwellThisTurn ||
      extendedFilter.wasChallenged ||
      extendedFilter.challengeRole ||
      extendedFilter.singRole ||
      extendedFilter.topDeck ||
      extendedFilter.namedCard ||
      extendedFilter.negate ||
      extendedFilter.ignoreBonuses ||
      extendedFilter.hasKeyword ||
      extendedFilter.hasAbility ||
      // Check if zone is an array (multi-zone filtering)
      Array.isArray(extendedFilter.zone)
    );
  }

  /**
   * Query cards using the extended filter from the builder
   */
  private queryCardsByExtendedFilter(
    filter: LorcanaCardFilterExtended,
  ): LorcanaCardInstance[] {
    // Start with all cards or apply basic zone/owner filtering
    let baseCards: LorcanaCardInstance[] = [];

    // Convert zone filter to legacy format for base filtering
    if (filter.zone) {
      const zones = Array.isArray(filter.zone) ? filter.zone : [filter.zone];
      baseCards = zones.flatMap((zone) => {
        const legacyFilter: LorcanaCardFilter = { zone };
        if (filter.owner === "self" || filter.owner === "opponent") {
          legacyFilter.owner = filter.owner;
        }
        return super.queryCardsByFilter(legacyFilter) as LorcanaCardInstance[];
      });
    } else {
      // Get all cards from all game zones (not from repository)
      const allZones: LorcanaZone[] = [
        "deck",
        "hand",
        "play",
        "inkwell",
        "discard",
        "bag",
      ];
      baseCards = allZones.flatMap((zone) => {
        const legacyFilter: LorcanaCardFilter = { zone };
        if (filter.owner === "self" || filter.owner === "opponent") {
          legacyFilter.owner = filter.owner;
        }
        return super.queryCardsByFilter(legacyFilter) as LorcanaCardInstance[];
      });
    }

    // Remove duplicates (in case a card matched multiple zones)
    const uniqueCards = Array.from(
      new Map(baseCards.map((card) => [card.instanceId, card])).values(),
    );

    // Apply all extended filters
    return this.applyExtendedFilters(uniqueCards, filter);
  }

  /**
   * Apply extended filter logic to cards
   */
  private applyExtendedFilters(
    cards: LorcanaCardInstance[],
    filter: LorcanaCardFilterExtended,
  ): LorcanaCardInstance[] {
    let filteredCards = [...cards];

    // Handle logical operators first
    if (filter.and) {
      // All AND conditions must be true
      for (const andFilter of filter.and) {
        const matchingCards = this.queryCardsByFilter(andFilter);
        filteredCards = filteredCards.filter((card) =>
          matchingCards.some((match) => match.instanceId === card.instanceId),
        );
      }
    }

    if (filter.or) {
      // At least one OR condition must be true
      const orResults = filter.or.flatMap((orFilter) =>
        this.queryCardsByFilter(orFilter),
      );
      const orInstanceIds = new Set(orResults.map((card) => card.instanceId));
      filteredCards = filteredCards.filter((card) =>
        orInstanceIds.has(card.instanceId),
      );
    }

    if (filter.not) {
      // NOT condition must be false
      const notResults = this.queryCardsByFilter(filter.not);
      const notInstanceIds = new Set(notResults.map((card) => card.instanceId));
      filteredCards = filteredCards.filter(
        (card) => !notInstanceIds.has(card.instanceId),
      );
    }

    // Get fresh game state for metadata checks
    const gameState = this.getGameState();

    // Apply individual filters
    filteredCards = filteredCards.filter((card) => {
      const ctx = this.getCtx();
      const meta = ctx.cardMetas?.[card.instanceId] || {};

      // Basic attribute filters
      if (
        filter.cost &&
        !this.matchesNumericRange(card.card.cost || 0, filter.cost)
      ) {
        return false;
      }

      if (
        filter.strength &&
        !this.matchesNumericRange(card.card.strength || 0, filter.strength)
      ) {
        return false;
      }

      if (
        filter.willpower &&
        !this.matchesNumericRange(card.card.willpower || 0, filter.willpower)
      ) {
        return false;
      }

      if (
        filter.lore &&
        !this.matchesNumericRange(card.card.lore || 0, filter.lore)
      ) {
        return false;
      }

      if (
        filter.moveCost &&
        !this.matchesNumericRange(
          (card.card as any).moveCost || 0,
          filter.moveCost,
        )
      ) {
        return false;
      }

      // String attribute filters
      if (
        filter.name &&
        !this.matchesStringComparison(card.card.name || "", filter.name)
      ) {
        return false;
      }

      if (
        filter.title &&
        !this.matchesStringComparison(card.card.title || "", filter.title)
      ) {
        return false;
      }

      if (
        filter.text &&
        !this.matchesStringComparison(card.card.text || "", filter.text)
      ) {
        return false;
      }

      // Card type filter
      if (filter.cardType && !filter.cardType.includes(card.card.type as any)) {
        return false;
      }

      // Ink filters
      if (filter.ink && filter.ink.length > 0) {
        const cardColors = card.card.colors || [];
        if (!filter.ink.some((color) => cardColors.includes(color as any))) {
          return false;
        }
      }

      if (
        filter.inkable !== undefined &&
        !!card.card.inkwell !== filter.inkable
      ) {
        return false;
      }

      // Keyword and ability filters
      if (filter.hasKeyword && filter.hasKeyword.length > 0) {
        const cardKeywords: string[] = [];

        // Extract keywords from card abilities
        if (card.card.abilities && Array.isArray(card.card.abilities)) {
          for (const ability of card.card.abilities) {
            if (ability && typeof ability === "object") {
              // Check for keyword abilities (LorcanaKeywordAbility structure)
              if (
                ability.type === "keyword" &&
                ability.keyword &&
                typeof ability.keyword === "string"
              ) {
                cardKeywords.push(ability.keyword.toLowerCase());
              }
              // Also check in the ability text for keywords
              else if (ability.text && typeof ability.text === "string") {
                // Extract keywords from text patterns like "**Rush**", "**Singer**", etc.
                const keywordMatches = ability.text.match(/\*\*([^*]+)\*\*/g);
                if (keywordMatches) {
                  keywordMatches.forEach((match) => {
                    const keyword = match.replace(/\*\*/g, "").trim();
                    // Handle keywords with values like "Singer 5"
                    const keywordName = keyword.split(" ")[0].toLowerCase();
                    cardKeywords.push(keywordName);
                  });
                }
              }
            }
          }
        }

        // Check if any of the required keywords match
        const hasRequiredKeyword = filter.hasKeyword.some((requiredKeyword) =>
          cardKeywords.some(
            (cardKeyword) =>
              cardKeyword.includes(requiredKeyword.toLowerCase()) ||
              requiredKeyword.toLowerCase().includes(cardKeyword),
          ),
        );

        if (!hasRequiredKeyword) {
          return false;
        }
      }

      if (filter.hasAbility && filter.hasAbility.length > 0) {
        const cardAbilityTexts: string[] = [];

        // Extract ability texts from card abilities
        if (card.card.abilities && Array.isArray(card.card.abilities)) {
          for (const ability of card.card.abilities) {
            if (ability && typeof ability === "object" && ability.text) {
              cardAbilityTexts.push(ability.text.toLowerCase());
            }
          }
        }

        // Check if any of the required abilities match
        const hasRequiredAbility = filter.hasAbility.some((requiredAbility) =>
          cardAbilityTexts.some((abilityText) => {
            // Remove formatting characters and normalize spaces for better matching
            const normalizedText = abilityText
              .replace(/\*\*/g, "")
              .replace(/\s+/g, " ")
              .trim();
            const normalizedRequired = requiredAbility
              .toLowerCase()
              .replace(/\s+/g, " ")
              .trim();
            return normalizedText.includes(normalizedRequired);
          }),
        );

        if (!hasRequiredAbility) {
          return false;
        }
      }

      // State filters
      if (filter.exerted !== undefined && !!meta.exerted !== filter.exerted) {
        return false;
      }

      if (filter.ready !== undefined && !!meta.exerted === filter.ready) {
        return false; // ready is opposite of exerted
      }

      if (filter.damaged !== undefined) {
        if (typeof filter.damaged === "boolean") {
          const isDamaged = (meta.damage || 0) > 0;
          if (filter.damaged !== isDamaged) {
            return false;
          }
        } else {
          // NumericComparison for damage amount
          if (
            !this.matchesNumericComparison(meta.damage || 0, filter.damaged)
          ) {
            return false;
          }
        }
      }

      // Instance ID filters
      if (filter.instanceId) {
        const targetIds = Array.isArray(filter.instanceId)
          ? filter.instanceId
          : [filter.instanceId];
        if (!targetIds.includes(card.instanceId)) {
          return false;
        }
      }

      if (filter.publicId) {
        const targetIds = Array.isArray(filter.publicId)
          ? filter.publicId
          : [filter.publicId];
        if (!targetIds.includes(card.card.id)) {
          return false;
        }
      }

      // Additional extended filters can be added here as needed

      return true;
    });

    return filteredCards;
  }

  private matchesNumericRange(
    value: number,
    range: { min?: number; max?: number; exact?: number },
  ): boolean {
    if (range.exact !== undefined) {
      return value === range.exact;
    }
    if (range.min !== undefined && value < range.min) {
      return false;
    }
    if (range.max !== undefined && value > range.max) {
      return false;
    }
    return true;
  }

  private matchesStringComparison(
    value: string,
    comparison: { operator: string; value: string | string[] },
  ): boolean {
    const targets = Array.isArray(comparison.value)
      ? comparison.value
      : [comparison.value];

    switch (comparison.operator) {
      case "eq":
        return targets.includes(value);
      case "contains":
        return targets.some((target) => value.includes(target));
      case "startsWith":
        return targets.some((target) => value.startsWith(target));
      case "endsWith":
        return targets.some((target) => value.endsWith(target));
      case "ne":
        return !targets.includes(value);
      default:
        return false;
    }
  }

  private matchesNumericComparison(
    value: number,
    comparison: { operator: string; value: number },
  ): boolean {
    switch (comparison.operator) {
      case "eq":
        return value === comparison.value;
      case "gt":
        return value > comparison.value;
      case "gte":
        return value >= comparison.value;
      case "lt":
        return value < comparison.value;
      case "lte":
        return value <= comparison.value;
      case "ne":
        return value !== comparison.value;
      default:
        return false;
    }
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
