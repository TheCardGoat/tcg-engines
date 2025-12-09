/**
 * Core Engine Error Hierarchy
 * Provides structured error types for all engine operations
 */
// Base error class for all engine errors
export class EngineError extends Error {
    context;
    constructor(message, context) {
        super(message);
        this.context = context;
        this.name = this.constructor.name;
    }
}
// ========== MOVE PROCESSING ERRORS ==========
export class MoveError extends EngineError {
    category = "execution";
}
export class InvalidPlayerError extends MoveError {
    playerID;
    reason;
    type = "INVALID_PLAYER";
    constructor(playerID, reason) {
        super(`Player ${playerID} cannot make move: ${reason}`);
        this.playerID = playerID;
        this.reason = reason;
    }
}
export class UnknownMoveError extends MoveError {
    moveType;
    availableMoves;
    type = "UNKNOWN_MOVE";
    constructor(moveType, availableMoves) {
        super(`Unknown move type: ${moveType}. Available moves: ${availableMoves.join(", ")}`);
        this.moveType = moveType;
        this.availableMoves = availableMoves;
    }
}
export class MoveExecutionError extends MoveError {
    moveType;
    playerID;
    cause;
    type = "EXECUTION_FAILED";
    constructor(moveType, playerID, cause) {
        super(`Failed to execute move ${moveType} for player ${playerID}: ${cause.message}`);
        this.moveType = moveType;
        this.playerID = playerID;
        this.cause = cause;
        this.cause = cause;
    }
}
export class InvalidMoveError extends MoveError {
    moveType;
    playerID;
    reason;
    type = "INVALID_MOVE";
    constructor(moveType, playerID, reason) {
        super(`Invalid move ${moveType} for player ${playerID}: ${reason}`);
        this.moveType = moveType;
        this.playerID = playerID;
        this.reason = reason;
    }
}
// ========== VALIDATION ERRORS ==========
export class ValidationError extends EngineError {
    category = "validation";
}
export class PlayerValidationError extends ValidationError {
    playerID;
    validationRule;
    type = "PLAYER_VALIDATION";
    constructor(playerID, validationRule) {
        super(`Player validation failed for ${playerID}: ${validationRule}`);
        this.playerID = playerID;
        this.validationRule = validationRule;
    }
}
export class StateValidationError extends ValidationError {
    stateProperty;
    expectedValue;
    actualValue;
    type = "STATE_VALIDATION";
    constructor(stateProperty, expectedValue, actualValue) {
        super(`State validation failed for ${stateProperty}: expected ${expectedValue}, got ${actualValue}`);
        this.stateProperty = stateProperty;
        this.expectedValue = expectedValue;
        this.actualValue = actualValue;
    }
}
export class MoveValidationError extends ValidationError {
    moveType;
    validationRule;
    context;
    type = "MOVE_VALIDATION";
    constructor(moveType, validationRule, context) {
        super(`Move validation failed for ${moveType}: ${validationRule}`);
        this.moveType = moveType;
        this.validationRule = validationRule;
        this.context = context;
    }
}
// ========== STATE MANAGEMENT ERRORS ==========
export class StateError extends EngineError {
    category = "state";
}
export class StateTransitionError extends StateError {
    fromStateId;
    toStateId;
    reason;
    type = "STATE_TRANSITION";
    constructor(fromStateId, toStateId, reason) {
        super(`Invalid state transition from ${fromStateId} to ${toStateId}: ${reason}`);
        this.fromStateId = fromStateId;
        this.toStateId = toStateId;
        this.reason = reason;
    }
}
export class StateCorruptionError extends StateError {
    stateId;
    corruptionDetails;
    type = "STATE_CORRUPTION";
    constructor(stateId, corruptionDetails) {
        super(`State corruption detected at state ${stateId}: ${corruptionDetails}`);
        this.stateId = stateId;
        this.corruptionDetails = corruptionDetails;
    }
}
export class StateUpdateError extends StateError {
    updateType;
    cause;
    type = "STATE_UPDATE";
    constructor(updateType, cause) {
        super(`Failed to update state during ${updateType}: ${cause.message}`);
        this.updateType = updateType;
        this.cause = cause;
        this.cause = cause;
    }
}
// ========== FLOW ERRORS ==========
export class FlowError extends EngineError {
    category = "execution";
}
export class FlowTransitionError extends FlowError {
    currentStep;
    targetStep;
    reason;
    type = "FLOW_TRANSITION";
    constructor(currentStep, targetStep, reason) {
        super(`Cannot transition from ${currentStep} to ${targetStep}: ${reason}`);
        this.currentStep = currentStep;
        this.targetStep = targetStep;
        this.reason = reason;
    }
}
export class FlowEventError extends FlowError {
    eventType;
    playerID;
    reason;
    type = "FLOW_EVENT";
    constructor(eventType, playerID, reason) {
        super(`Flow event ${eventType} failed for player ${playerID}: ${reason}`);
        this.eventType = eventType;
        this.playerID = playerID;
        this.reason = reason;
    }
}
export class FlowProcessingError extends FlowError {
    iterations;
    maxIterations;
    type = "FLOW_PROCESSING";
    constructor(iterations, maxIterations) {
        super(`Flow processing exceeded maximum iterations: ${iterations}/${maxIterations}`);
        this.iterations = iterations;
        this.maxIterations = maxIterations;
    }
}
// ========== SYSTEM ERRORS ==========
export class SystemError extends EngineError {
    category = "system";
}
export class EngineInitializationError extends SystemError {
    component;
    cause;
    type = "ENGINE_INITIALIZATION";
    constructor(component, cause) {
        super(`Failed to initialize engine component ${component}: ${cause.message}`);
        this.component = component;
        this.cause = cause;
        this.cause = cause;
    }
}
export class ConfigurationError extends SystemError {
    configProperty;
    expectedType;
    actualValue;
    type = "CONFIGURATION";
    constructor(configProperty, expectedType, actualValue) {
        super(`Invalid configuration for ${configProperty}: expected ${expectedType}, got ${typeof actualValue}`);
        this.configProperty = configProperty;
        this.expectedType = expectedType;
        this.actualValue = actualValue;
    }
}
export class NetworkError extends SystemError {
    operation;
    playerID;
    cause;
    type = "NETWORK";
    constructor(operation, playerID, cause) {
        super(`Network error during ${operation} for player ${playerID}: ${cause.message}`);
        this.operation = operation;
        this.playerID = playerID;
        this.cause = cause;
        this.cause = cause;
    }
}
/**
 * Helper to check if an error is of a specific type
 */
export function isErrorType(error, ErrorClass) {
    return error instanceof ErrorClass;
}
/**
 * Helper to create error from unknown thrown value
 */
export function createEngineError(thrown, context) {
    if (thrown instanceof EngineError) {
        return thrown;
    }
    if (thrown instanceof Error) {
        return new MoveExecutionError(context.moveType || "unknown", context.playerID || "unknown", thrown);
    }
    return new MoveExecutionError(context.moveType || "unknown", context.playerID || "unknown", new Error(String(thrown)));
}
//# sourceMappingURL=engine-errors.js.map