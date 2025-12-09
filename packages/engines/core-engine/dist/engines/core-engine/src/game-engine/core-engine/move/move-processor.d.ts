import { type AnyEngineError } from "~/game-engine/core-engine/errors/engine-errors";
import type { FlowManager } from "~/game-engine/core-engine/flow/flow-manager";
import type { CoreEngineState, FnContext } from "~/game-engine/core-engine/game-configuration";
import { type Move } from "~/game-engine/core-engine/move/move-types";
import type { Result } from "~/game-engine/core-engine/types/result";
export type MoveRequest = {
    readonly playerID: string;
    readonly moveType: string;
    readonly args: readonly unknown[];
};
export type ValidatedMove<G> = {
    readonly playerID: string;
    readonly moveType: string;
    readonly args: readonly unknown[];
    readonly moveFunction: Move<G>;
    readonly fnContext: FnContext<G>;
};
export type MoveResult<G> = {
    readonly newState: CoreEngineState<G>;
};
/**
 * Pure move validation service
 * Validates player permissions and move availability
 */
export declare class MoveValidator<G> {
    constructor();
    validate(request: MoveRequest, fnContext: FnContext<G>, flowManager: FlowManager<G>): Result<ValidatedMove<G>, AnyEngineError>;
}
/**
 * Pure move execution service
 * Executes validated moves and creates new game state
 */
export declare class MoveExecutor<G> {
    private readonly debug;
    private readonly engine;
    constructor(debug?: boolean);
    execute(validatedMove: ValidatedMove<G>, fnContext: FnContext<G>): Result<MoveResult<G>, AnyEngineError>;
    private extractMoveFunction;
}
/**
 * Main move processor service
 * Orchestrates move validation and execution
 */
export declare class MoveProcessor<G> {
    private readonly validator;
    private readonly executor;
    constructor(debug?: boolean);
    process(request: MoveRequest, flowManager: FlowManager<G>, fnContext: FnContext<G>): Result<MoveResult<G>, AnyEngineError>;
}
//# sourceMappingURL=move-processor.d.ts.map