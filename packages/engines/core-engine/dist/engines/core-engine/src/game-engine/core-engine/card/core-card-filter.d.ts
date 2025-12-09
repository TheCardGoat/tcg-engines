import type { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { CoreCardInstanceStore } from "~/game-engine/core-engine/card/core-card-instance-store";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import type { BaseCoreCardFilter, GameSpecificCardFilter } from "~/game-engine/core-engine/types/game-specific-types";
/**
 * Generic card filter that can be extended by games with specific properties
 */
export type CoreCardFilterDSL<T extends GameSpecificCardFilter = BaseCoreCardFilter> = T;
export declare function getCardsByFilter<T extends GameSpecificCardFilter = BaseCoreCardFilter>({ state, store, filter, }: {
    state: CoreEngineState;
    store: CoreCardInstanceStore;
    filter: CoreCardFilterDSL<T>;
}): CoreCardInstance[];
//# sourceMappingURL=core-card-filter.d.ts.map