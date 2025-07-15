import { EntityNotFoundError } from "../errors/consolidated-errors";
import type { InstanceId, PlayerID } from "../types/core-types";
import type { CoreCardInstance } from "./core-card-instance";
import type { GameCard, GameContext } from "./game-card";

/**
 * Common interface for card operations regardless of abstraction pattern
 */
export interface CardOperations {
  /**
   * Move a card from one zone to another
   */
  moveCard(params: {
    instanceId: InstanceId;
    to: string;
    from?: string;
    playerId?: PlayerID;
  }): void;

  /**
   * Get the zone of a card
   */
  getCardZone(instanceId: InstanceId): string | undefined;

  /**
   * Get a card by its instance ID
   */
  getCard(instanceId: InstanceId): any;

  /**
   * Filter cards based on criteria
   */
  queryCards(filter: any): any[];
}

/**
 * Execute an operation on a card using the CoreCardInstance pattern
 * @param card CoreCardInstance to operate on
 * @param operation Function that performs the operation using engine
 * @param errorMessage Error message if operation fails
 * @returns Result of the operation
 */
export function withCoreCardOperation<T = any>(
  card: CoreCardInstance,
  operation: (engine: any) => T,
  errorMessage = "Failed to perform card operation",
): T {
  // Use the card's withEngine method if available
  if (typeof (card as any).withEngine === "function") {
    return (card as any).withEngine(operation, errorMessage);
  }

  // Fallback for cards without withEngine method
  const engine = (card as any).engineRef?.deref();
  if (!engine) {
    throw new EntityNotFoundError("card", card.instanceId, {
      reason: errorMessage,
      operation: "withCoreCardOperation",
    });
  }
  return operation(engine);
}

/**
 * Execute an operation on a card using the GameCard pattern
 * @param card GameCard to operate on
 * @param ctx Game context for the operation
 * @param operation Function that performs the operation using context
 * @returns Result of the operation
 */
export function withGameCardOperation<
  T = any,
  C extends GameContext = GameContext,
>(card: GameCard, ctx: C, operation: (card: GameCard, context: C) => T): T {
  return operation(card, ctx);
}

/**
 * Move a card to a zone using either pattern
 * @param card Card to move (CoreCardInstance or GameCard)
 * @param targetZone Zone to move the card to
 * @param contextOrEngine Context (for GameCard) or engine (for CoreCardInstance)
 */
export function moveCardToZone(
  card: CoreCardInstance | GameCard,
  targetZone: string,
  contextOrEngine: any,
): void {
  // Check if card is a GameCard (has no engineRef)
  if ((card as any).engineRef) {
    // CoreCardInstance pattern
    const coreCard = card as CoreCardInstance;

    withCoreCardOperation(
      coreCard,
      (engine) => {
        engine.moveCard({
          playerId: coreCard.ownerId,
          instanceId: coreCard.instanceId,
          to: targetZone,
        });
      },
      `Failed to move card ${coreCard.instanceId} to zone ${targetZone}`,
    );
  } else {
    // GameCard pattern
    const gameCard = card as GameCard;
    const ctx = contextOrEngine;

    ctx.moveCard({
      playerId: gameCard.ownerId,
      instanceId: gameCard.instanceId,
      to: targetZone,
    });
  }
}

/**
 * Get the zone of a card using either pattern
 * @param card Card to get zone for (CoreCardInstance or GameCard)
 * @param contextOrEngine Context (for GameCard) or engine (for CoreCardInstance)
 * @returns Zone name or undefined if not found
 */
export function getCardZoneUnified(
  card: CoreCardInstance | GameCard,
  contextOrEngine?: any,
): string | undefined {
  // Check if card is a GameCard (has no engineRef)
  if ((card as any).engineRef) {
    // CoreCardInstance pattern - use the card's own zone getter
    return (card as CoreCardInstance).zone;
  }
  // GameCard pattern
  const gameCard = card as GameCard;
  const ctx = contextOrEngine;

  return ctx.getCardZone(gameCard.instanceId);
}
