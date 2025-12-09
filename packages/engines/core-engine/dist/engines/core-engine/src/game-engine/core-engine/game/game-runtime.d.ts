import { FlowManager } from "~/game-engine/core-engine/flow/flow-manager";
import type { CoreEngineState, FnContext, GameDefinition, GameRuntime } from "~/game-engine/core-engine/game-configuration";
import { type MoveRequest } from "~/game-engine/core-engine/move/move-processor";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { GameCards } from "~/game-engine/core-engine/types";
export declare class CoreGameRuntime<GameState = unknown> {
    readonly processedGame: GameRuntime<GameState>;
    readonly initialState: CoreEngineState<GameState>;
    readonly flowManager: FlowManager<GameState>;
    private readonly moveProcessor;
    constructor({ game, initialState, initialCoreCtx, cards, players, seed, debug, }: {
        game: GameDefinition<GameState>;
        initialState?: GameState;
        initialCoreCtx?: CoreCtx;
        players?: string[];
        cards: GameCards;
        seed?: string;
        debug: boolean;
    });
    /**
     * Process game definition and set defaults (consolidates processGameDefinition)
     */
    private processGameDefinition;
    processMove(request: MoveRequest, fnContext: FnContext<GameState>): import("..").Result<import("~/game-engine/core-engine/move/move-processor").MoveResult<GameState>, import("../errors/engine-errors").AnyEngineError>;
}
//# sourceMappingURL=game-runtime.d.ts.map