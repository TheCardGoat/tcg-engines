import { getCardZone } from "../engine/zone-operation";
import type { CoreEngineState } from "../game-configuration";
import type { InstanceId } from "../types/core-types";
import type {
  BaseCoreCardFilter,
  GameSpecificCardFilter,
} from "../types/game-specific-types";
import { logger } from "../utils/logger";
import type { CoreCardInstance } from "./core-card-instance";
import type { CoreCardInstanceStore } from "./core-card-instance-store";
import type { GameCard } from "./game-card";

/**
 * Generic card filter that can be extended by games with specific properties
 */
export type CardFilterDSL<
  T extends GameSpecificCardFilter = BaseCoreCardFilter,
> = T;

/**
 * Filter cards using CoreCardInstance pattern
 * @param state Current engine state
 * @param store Card instance store
 * @param filter Filter criteria
 * @returns Array of matching CoreCardInstance objects
 */
export function filterCoreCardInstances<
  CardDef extends { id: string },
  T extends GameSpecificCardFilter = BaseCoreCardFilter,
>({
  state,
  store,
  filter,
}: {
  state: CoreEngineState;
  store: CoreCardInstanceStore<CardDef>;
  filter: CardFilterDSL<T>;
}): CoreCardInstance<CardDef>[] {
  const { zone, owner, publicId, instanceId } = filter;
  const cards = store.getAllCards();
  const result: CoreCardInstance<CardDef>[] = cards.filter((card) => {
    if (publicId && card.publicId !== publicId) {
      return false;
    }

    if (instanceId && card.instanceId !== instanceId) {
      return false;
    }

    if (owner && card.owner !== owner) {
      return false;
    }

    if (zone) {
      const cardZone = getCardZone(
        state.ctx,
        (Array.isArray(zone) ? Array.from(zone) : zone) as string | string[],
        card.owner,
      );

      if (!cardZone) {
        logger.error(
          `Card ${card.instanceId} is not in zone ${zone}: Zone does not exist.`,
        );
        return false;
      }

      if (!cardZone.cards.find((zoneCard) => zoneCard === card.instanceId)) {
        return false;
      }
    }

    return true;
  });

  return result;
}

/**
 * Filter cards using GameCard pattern
 * @param cards Array of GameCard objects
 * @param filter Filter criteria
 * @param ctx Game context for accessing state
 * @returns Array of matching GameCard objects
 */
export function filterGameCards<
  T extends GameSpecificCardFilter = BaseCoreCardFilter,
  C extends { getCardZone(instanceId: InstanceId): string | undefined } = any,
  G extends GameCard = GameCard,
>({
  cards,
  filter,
  ctx,
}: {
  cards: G[];
  filter: CardFilterDSL<T>;
  ctx: C;
}): G[] {
  const { zone, owner, publicId, instanceId } = filter;

  return cards.filter((card) => {
    if (publicId && card.publicId !== publicId) {
      return false;
    }

    if (instanceId && card.instanceId !== instanceId) {
      return false;
    }

    if (owner && card.ownerId !== owner) {
      return false;
    }

    if (zone) {
      const cardZone = ctx.getCardZone(card.instanceId);
      if (cardZone !== zone) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Common filtering logic that works with any card-like object
 * @param cards Array of card-like objects with required properties
 * @param filter Filter criteria
 * @param getZone Function to get a card's zone
 * @returns Array of matching card-like objects
 */
export function filterCards<
  T extends GameSpecificCardFilter = BaseCoreCardFilter,
  C extends {
    instanceId: string;
    publicId?: string;
    ownerId?: string;
    owner?: string;
  } = any,
>({
  cards,
  filter,
  getZone,
}: {
  cards: C[];
  filter: CardFilterDSL<T>;
  getZone?: (card: C) => string | undefined;
}): C[] {
  const { zone, owner, publicId, instanceId } = filter;

  return cards.filter((card) => {
    if (publicId && card.publicId !== publicId) {
      return false;
    }

    if (instanceId && card.instanceId !== instanceId) {
      return false;
    }

    if (owner && card.ownerId !== owner && card.owner !== owner) {
      return false;
    }

    if (zone && getZone) {
      const cardZone = getZone(card);
      if (cardZone !== zone) {
        return false;
      }
    }

    return true;
  });
}

// Re-export the legacy function name for backward compatibility
export const getCardsByFilter = filterCoreCardInstances;
