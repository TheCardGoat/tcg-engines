import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { CoreCardInstanceStore } from "~/game-engine/core-engine/card/core-card-instance-store";
import { getCardZone } from "~/game-engine/core-engine/engine/zone-operation";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import type {
  BaseCoreCardFilter,
  GameSpecificCardFilter,
} from "~/game-engine/core-engine/types/game-specific-types";
import { logger } from "~/game-engine/core-engine/utils/logger";

/**
 * Generic card filter that can be extended by games with specific properties
 */
export type CoreCardFilterDSL<
  T extends GameSpecificCardFilter = BaseCoreCardFilter,
> = T;

export function getCardsByFilter<
  T extends GameSpecificCardFilter = BaseCoreCardFilter,
>({
  state,
  store,
  filter,
}: {
  state: CoreEngineState;
  store: CoreCardInstanceStore;
  filter: CoreCardFilterDSL<T>;
}): CoreCardInstance[] {
  const { zone, owner, publicId, instanceId } = filter;
  const cards = store.getAllCards();
  const result: CoreCardInstance[] = cards.filter((card) => {
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
      const cardZone = getCardZone(state.ctx, zone, card.owner);

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
