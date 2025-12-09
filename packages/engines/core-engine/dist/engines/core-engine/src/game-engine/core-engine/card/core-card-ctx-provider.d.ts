import type { CoreEngine } from "~/game-engine/core-engine";
import type { BaseCoreCardFilter, DefaultCardDefinition, DefaultGameState, DefaultPlayerState, GameSpecificCardDefinition, GameSpecificCardFilter, GameSpecificGameState, GameSpecificPlayerState } from "~/game-engine/core-engine/types/game-specific-types";
import type { CoreCardInstance } from "./core-card-instance";
export declare class CoreCardCtxProvider<GameState extends GameSpecificGameState = DefaultGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardModel extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>> {
    private engineRef;
    constructor({ engine, }: {
        engine: CoreEngine<GameState, CardDefinition, PlayerState, CardFilter, CardModel>;
    });
    getCtx(): import("../state/context").CoreCtx<unknown>;
    /**
     * Check if the underlying engine is still available
     * Useful for debugging and error handling
     */
    isEngineAvailable(): boolean;
}
//# sourceMappingURL=core-card-ctx-provider.d.ts.map