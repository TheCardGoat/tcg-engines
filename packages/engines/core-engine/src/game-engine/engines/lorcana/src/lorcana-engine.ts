import { ResultHelpers } from "~/game-engine/core-engine";
import type { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import type { CoreEngineOpts } from "~/game-engine/core-engine/engine/core-engine";
import { getCardZone } from "~/game-engine/core-engine/engine/zone-operation";
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
    "game" | "repository" | "matchID" | "playerID"
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
   * Exert ink cards to pay for costs
   * This is a Lorcana-specific mechanism for paying costs with ink
   */
  exertInkForCost(playerId: string, cost: number): boolean {
    logger.info(`Player ${playerId} attempting to pay ${cost} ink`);

    if (cost <= 0) {
      logger.debug("No ink cost to pay");
      return true;
    }

    // Get only ready (non-exerted) ink cards for the player
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
    // Get the current game state to access metadata
    const gameState = this.getGameState();

    // Mark ink card as exerted in game state metadata
    if (!gameState.G.metas[card]) {
      gameState.G.metas[card] = { exerted };
    }
    gameState.G.metas[card].exerted = exerted;

    logger.debug(`Exerted card ${card} set to ${exerted}`);
  }

  /**
   * Get the number of available (ready) ink cards for a player
   * This is used for cost validation
   */
  getAvailableInk(playerId: string): number {
    // Get only ready (non-exerted) ink cards for the player
    const readyInkCards = this.cardInstanceStore.queryCards({
      zone: "inkwell",
      owner: playerId,
      exerted: false,
    } as LorcanaCardFilter);

    return readyInkCards.length;
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

  leaveLocation(char: LorcanaCardInstance) {
    const G = this.getGameState().G;

    const location = char.location;
    if (!location) {
      return;
    }

    logger.info(
      `Leaving location: ${location.fullName} ${location.instanceId} for character: ${char.fullName} ${char.instanceId}`,
    );

    G.metas[char.instanceId].location = undefined;
    G.metas[location.instanceId].characters = G.metas[
      location.instanceId
    ].characters.filter((card) => card !== char.instanceId);
  }

  enterLocation(char: LorcanaCardInstance, location: LorcanaCardInstance) {
    const G = this.getGameState().G;

    const characterInstanceId = char.instanceId;
    const locationInstanceId = location.instanceId;

    this.leaveLocation(char);

    // Track character-location relationship by setting character's location metadata
    if (!G.metas[characterInstanceId]) {
      G.metas[characterInstanceId] = {};
    }
    G.metas[characterInstanceId].location = locationInstanceId;

    // Track characters at location by adding to location's characters array
    if (!G.metas[locationInstanceId]) {
      G.metas[locationInstanceId] = {};
    }
    // Always initialize as array for locations
    if (!Array.isArray(G.metas[locationInstanceId].characters)) {
      G.metas[locationInstanceId].characters = [];
    }
    const currentCharactersAtLocation = G.metas[locationInstanceId].characters;
    if (!currentCharactersAtLocation.includes(characterInstanceId)) {
      currentCharactersAtLocation.push(characterInstanceId);
    }

    logger.info(
      `Character ${characterInstanceId} moves to location ${locationInstanceId}`,
    );

    // Add triggered effects to the bag (rule 4.3.7.5)
    this?.addTriggeredEffectsToTheBag("onMove", characterInstanceId);
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
    const results = super.queryCardsByFilter(filter);
    // Safe cast: initializeCardModels() ensures all card instances are LorcanaCardInstance
    return results as LorcanaCardInstance[];
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
