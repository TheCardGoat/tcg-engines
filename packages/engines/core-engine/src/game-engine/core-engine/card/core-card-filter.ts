import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { CoreCardInstanceStore } from "~/game-engine/core-engine/card/core-card-instance-store";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import type {
  BaseCoreCardFilter,
  GameSpecificCardFilter,
} from "~/game-engine/core-engine/types/game-specific-types";
import {
  filterCards,
  filterCoreCardInstances,
  filterGameCards,
} from "./card-filtering";

/**
 * Generic card filter that can be extended by games with specific properties
 * @deprecated Use CardFilterDSL from card-filtering.ts instead
 */
export type CoreCardFilterDSL<
  T extends GameSpecificCardFilter = BaseCoreCardFilter,
> = T;

/**
 * Filter cards using CoreCardInstance pattern
 * @deprecated Use filterCoreCardInstances from card-filtering.ts instead
 */
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
  return filterCoreCardInstances({ state, store, filter });
}

// Export the new functions for backward compatibility
export { filterCoreCardInstances, filterGameCards, filterCards };
