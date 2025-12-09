import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
export declare class GameStateStore<G = unknown> {
    private store;
    private derivedHash;
    constructor({ initialState, }: {
        initialState: CoreEngineState<G>;
    });
    get state(): CoreEngineState<G>;
    getState(): CoreEngineState<G>;
    get stateHash(): string;
    updateState({ newState }: {
        newState: CoreEngineState<G>;
    }): void;
}
//# sourceMappingURL=state-store.d.ts.map