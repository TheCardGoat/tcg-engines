import { ResultHelpers } from "~/game-engine/core-engine";
import type { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";

import { getCardZone } from "~/game-engine/core-engine/engine/zone-operation";
import { GameEngine } from "~/game-engine/core-engine/game-engine";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";

import { logger } from "~/game-engine/core-engine/utils/logger";
import { LorcanaCardInstance } from "./cards/lorcana-card-instance";
import type { LorcanaCardRepository } from "./cards/lorcana-card-repository";
import { LorcanaGame } from "./game-definition/lorcana-game-definition";
import type {
  GameCards,
  LorcanaGameState,
  TriggerTiming,
  Zone,
} from "./lorcana-engine-types";
import type {
  LorcanaCardDefinition,
  LorcanaCardFilter,
  LorcanaPlayerState,
} from "./lorcana-generic-types";

// Re-export types for external usage
export type { LorcanaCardDefinition, LorcanaCardFilter, LorcanaPlayerState };

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
  }: {
    initialState: LorcanaGameState;
    initialCoreCtx?: CoreCtx;
    cards: GameCards;
    cardRepository?: LorcanaCardRepository;
    gameId: string;
    playerId?: string;
    debug?: boolean;
    seed?: string;
    players: string[];
  }) {
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
    });

    if (cardRepository) {
      this.cardRepository = cardRepository;
    }
  }

  /**
   * Initializes card models with Lorcana-specific functionality
   */
  protected override initializeCardModels(): void {
    const contextProvider =
      this.cardInstanceStore.getAllCards()[0]?.contextProvider;
    const cardInstances = this.cardInstanceStore.getCardInstances();

    // Replace each CoreCardInstance with a LorcanaCardInstance
    for (const [instanceId, instance] of Object.entries(cardInstances)) {
      if (!(instance instanceof LorcanaCardInstance)) {
        const playerId = this.cardInstanceStore.getCardOwner(instanceId) || "";
        const definition = instance.card as LorcanaCardDefinition;

        cardInstances[instanceId] = new LorcanaCardInstance(
          this,
          definition,
          instanceId,
          playerId,
        );
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

    return {
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
    };
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

  /**
   * Type-safe card filtering with Lorcana-specific properties
   */
  queryCardsByFilter(filter: LorcanaCardFilter) {
    return super.queryCardsByFilter(filter);
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
