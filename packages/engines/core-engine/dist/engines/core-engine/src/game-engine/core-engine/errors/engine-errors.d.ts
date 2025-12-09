/**
 * Core Engine Error Hierarchy
 * Provides structured error types for all engine operations
 */
export declare abstract class EngineError extends Error {
    readonly context?: Record<string, unknown>;
    abstract readonly type: string;
    abstract readonly category: "validation" | "execution" | "state" | "system";
    constructor(message: string, context?: Record<string, unknown>);
}
export declare abstract class MoveError extends EngineError {
    readonly category: "execution";
}
export declare class InvalidPlayerError extends MoveError {
    readonly playerID: string;
    readonly reason: string;
    readonly type: "INVALID_PLAYER";
    constructor(playerID: string, reason: string);
}
export declare class UnknownMoveError extends MoveError {
    readonly moveType: string;
    readonly availableMoves: readonly string[];
    readonly type: "UNKNOWN_MOVE";
    constructor(moveType: string, availableMoves: readonly string[]);
}
export declare class MoveExecutionError extends MoveError {
    readonly moveType: string;
    readonly playerID: string;
    readonly cause: Error;
    readonly type: "EXECUTION_FAILED";
    constructor(moveType: string, playerID: string, cause: Error);
}
export declare class InvalidMoveError extends MoveError {
    readonly moveType: string;
    readonly playerID: string;
    readonly reason: string;
    readonly type: "INVALID_MOVE";
    constructor(moveType: string, playerID: string, reason: string);
}
export declare abstract class ValidationError extends EngineError {
    readonly category: "validation";
}
export declare class PlayerValidationError extends ValidationError {
    readonly playerID: string;
    readonly validationRule: string;
    readonly type: "PLAYER_VALIDATION";
    constructor(playerID: string, validationRule: string);
}
export declare class StateValidationError extends ValidationError {
    readonly stateProperty: string;
    readonly expectedValue: unknown;
    readonly actualValue: unknown;
    readonly type: "STATE_VALIDATION";
    constructor(stateProperty: string, expectedValue: unknown, actualValue: unknown);
}
export declare class MoveValidationError extends ValidationError {
    readonly moveType: string;
    readonly validationRule: string;
    readonly context?: Record<string, unknown>;
    readonly type: "MOVE_VALIDATION";
    constructor(moveType: string, validationRule: string, context?: Record<string, unknown>);
}
export declare abstract class StateError extends EngineError {
    readonly category: "state";
}
export declare class StateTransitionError extends StateError {
    readonly fromStateId: number;
    readonly toStateId: number;
    readonly reason: string;
    readonly type: "STATE_TRANSITION";
    constructor(fromStateId: number, toStateId: number, reason: string);
}
export declare class StateCorruptionError extends StateError {
    readonly stateId: number;
    readonly corruptionDetails: string;
    readonly type: "STATE_CORRUPTION";
    constructor(stateId: number, corruptionDetails: string);
}
export declare class StateUpdateError extends StateError {
    readonly updateType: string;
    readonly cause: Error;
    readonly type: "STATE_UPDATE";
    constructor(updateType: string, cause: Error);
}
export declare abstract class FlowError extends EngineError {
    readonly category: "execution";
}
export declare class FlowTransitionError extends FlowError {
    readonly currentStep: string;
    readonly targetStep: string;
    readonly reason: string;
    readonly type: "FLOW_TRANSITION";
    constructor(currentStep: string, targetStep: string, reason: string);
}
export declare class FlowEventError extends FlowError {
    readonly eventType: string;
    readonly playerID: string;
    readonly reason: string;
    readonly type: "FLOW_EVENT";
    constructor(eventType: string, playerID: string, reason: string);
}
export declare class FlowProcessingError extends FlowError {
    readonly iterations: number;
    readonly maxIterations: number;
    readonly type: "FLOW_PROCESSING";
    constructor(iterations: number, maxIterations: number);
}
export declare abstract class SystemError extends EngineError {
    readonly category: "system";
}
export declare class EngineInitializationError extends SystemError {
    readonly component: string;
    readonly cause: Error;
    readonly type: "ENGINE_INITIALIZATION";
    constructor(component: string, cause: Error);
}
export declare class ConfigurationError extends SystemError {
    readonly configProperty: string;
    readonly expectedType: string;
    readonly actualValue: unknown;
    readonly type: "CONFIGURATION";
    constructor(configProperty: string, expectedType: string, actualValue: unknown);
}
export declare class NetworkError extends SystemError {
    readonly operation: string;
    readonly playerID: string;
    readonly cause: Error;
    readonly type: "NETWORK";
    constructor(operation: string, playerID: string, cause: Error);
}
/**
 * Type union of all possible engine errors
 */
export type AnyEngineError = InvalidPlayerError | UnknownMoveError | MoveExecutionError | InvalidMoveError | PlayerValidationError | StateValidationError | MoveValidationError | StateTransitionError | StateCorruptionError | StateUpdateError | FlowTransitionError | FlowEventError | FlowProcessingError | EngineInitializationError | ConfigurationError | NetworkError;
/**
 * Helper to check if an error is of a specific type
 */
export declare function isErrorType<T extends EngineError>(error: EngineError, ErrorClass: new (...args: any[]) => T): error is T;
/**
 * Helper to create error from unknown thrown value
 */
export declare function createEngineError(thrown: unknown, context: {
    operation: string;
    playerID?: string;
    moveType?: string;
}): AnyEngineError;
//# sourceMappingURL=engine-errors.d.ts.map