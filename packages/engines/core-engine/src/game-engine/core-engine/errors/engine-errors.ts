/**
 * Core Engine Error Hierarchy
 * Provides structured error types for all engine operations
 */

// Base error class for all engine errors
export abstract class EngineError extends Error {
  abstract readonly type: string;
  abstract readonly category: "validation" | "execution" | "state" | "system";

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// ========== MOVE PROCESSING ERRORS ==========

export abstract class MoveError extends EngineError {
  readonly category = "execution" as const;
}

export class InvalidPlayerError extends MoveError {
  readonly type = "INVALID_PLAYER" as const;

  constructor(
    public readonly playerID: string,
    public readonly reason: string,
  ) {
    super(`Player ${playerID} cannot make move: ${reason}`);
  }
}

export class UnknownMoveError extends MoveError {
  readonly type = "UNKNOWN_MOVE" as const;

  constructor(
    public readonly moveType: string,
    public readonly availableMoves: readonly string[],
  ) {
    super(
      `Unknown move type: ${moveType}. Available moves: ${availableMoves.join(", ")}`,
    );
  }
}

/**
 * Error thrown when move execution fails
 */
export class MoveExecutionError extends MoveError {
  readonly type = "MOVE_EXECUTION_ERROR";

  constructor(
    public readonly moveType: string,
    public readonly playerID: string,
    public readonly reason: string,
  ) {
    super(`Error executing move ${moveType} for player ${playerID}: ${reason}`);
  }
}

export class InvalidMoveError extends MoveError {
  readonly type = "INVALID_MOVE" as const;

  constructor(
    public readonly moveType: string,
    public readonly playerID: string,
    public readonly reason: string,
  ) {
    super(`Invalid move ${moveType} for player ${playerID}: ${reason}`);
  }
}

/**
 * Error thrown when a move is rejected by the engine for game rule reasons
 */
export class MoveRejectedError extends MoveError {
  readonly type = "MOVE_REJECTED" as const;

  constructor(
    public readonly moveType: string,
    public readonly playerID: string,
    public readonly reason: string,
  ) {
    super(`Move ${moveType} rejected for player ${playerID}: ${reason}`);
  }
}

// ========== VALIDATION ERRORS ==========

export abstract class ValidationError extends EngineError {
  readonly category = "validation" as const;
}

export class PlayerValidationError extends ValidationError {
  readonly type = "PLAYER_VALIDATION" as const;

  constructor(
    public readonly playerID: string,
    public readonly validationRule: string,
  ) {
    super(`Player validation failed for ${playerID}: ${validationRule}`);
  }
}

export class StateValidationError extends ValidationError {
  readonly type = "STATE_VALIDATION" as const;

  constructor(
    public readonly stateProperty: string,
    public readonly expectedValue: unknown,
    public readonly actualValue: unknown,
  ) {
    super(
      `State validation failed for ${stateProperty}: expected ${expectedValue}, got ${actualValue}`,
    );
  }
}

export class MoveValidationError extends ValidationError {
  readonly type = "MOVE_VALIDATION" as const;

  constructor(
    public readonly moveType: string,
    public readonly validationRule: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(`Move validation failed for ${moveType}: ${validationRule}`);
  }
}

// ========== STATE MANAGEMENT ERRORS ==========

export abstract class StateError extends EngineError {
  readonly category = "state" as const;
}

export class StateTransitionError extends StateError {
  readonly type = "STATE_TRANSITION" as const;

  constructor(
    public readonly fromStateId: number,
    public readonly toStateId: number,
    public readonly reason: string,
  ) {
    super(
      `Invalid state transition from ${fromStateId} to ${toStateId}: ${reason}`,
    );
  }
}

export class StateCorruptionError extends StateError {
  readonly type = "STATE_CORRUPTION" as const;

  constructor(
    public readonly stateId: number,
    public readonly corruptionDetails: string,
  ) {
    super(
      `State corruption detected at state ${stateId}: ${corruptionDetails}`,
    );
  }
}

export class StateUpdateError extends StateError {
  readonly type = "STATE_UPDATE" as const;

  constructor(
    public readonly updateType: string,
    public readonly cause: Error,
  ) {
    super(`Failed to update state during ${updateType}: ${cause.message}`);
    this.cause = cause;
  }
}

// ========== FLOW ERRORS ==========

export abstract class FlowError extends EngineError {
  readonly category = "execution" as const;
}

export class FlowTransitionError extends FlowError {
  readonly type = "FLOW_TRANSITION" as const;

  constructor(
    public readonly currentStep: string,
    public readonly targetStep: string,
    public readonly reason: string,
  ) {
    super(`Cannot transition from ${currentStep} to ${targetStep}: ${reason}`);
  }
}

export class FlowEventError extends FlowError {
  readonly type = "FLOW_EVENT" as const;

  constructor(
    public readonly eventType: string,
    public readonly playerID: string,
    public readonly reason: string,
  ) {
    super(`Flow event ${eventType} failed for player ${playerID}: ${reason}`);
  }
}

export class FlowProcessingError extends FlowError {
  readonly type = "FLOW_PROCESSING" as const;

  constructor(
    public readonly iterations: number,
    public readonly maxIterations: number,
  ) {
    super(
      `Flow processing exceeded maximum iterations: ${iterations}/${maxIterations}`,
    );
  }
}

// ========== SYSTEM ERRORS ==========

export abstract class SystemError extends EngineError {
  readonly category = "system" as const;
}

export class EngineInitializationError extends SystemError {
  readonly type = "ENGINE_INITIALIZATION" as const;

  constructor(
    public readonly component: string,
    public readonly cause: Error,
  ) {
    super(
      `Failed to initialize engine component ${component}: ${cause.message}`,
    );
    this.cause = cause;
  }
}

export class ConfigurationError extends SystemError {
  readonly type = "CONFIGURATION" as const;

  constructor(
    public readonly configProperty: string,
    public readonly expectedType: string,
    public readonly actualValue: unknown,
  ) {
    super(
      `Invalid configuration for ${configProperty}: expected ${expectedType}, got ${typeof actualValue}`,
    );
  }
}

export class NetworkError extends SystemError {
  readonly type = "NETWORK" as const;

  constructor(
    public readonly operation: string,
    public readonly playerID: string,
    public readonly cause: Error,
  ) {
    super(
      `Network error during ${operation} for player ${playerID}: ${cause.message}`,
    );
    this.cause = cause;
  }
}

// ========== ERROR UTILITIES ==========

/**
 * Type union of all possible engine errors
 */
export type AnyEngineError =
  | InvalidPlayerError
  | UnknownMoveError
  | MoveExecutionError
  | InvalidMoveError
  | MoveRejectedError
  | PlayerValidationError
  | StateValidationError
  | MoveValidationError
  | StateTransitionError
  | StateCorruptionError
  | StateUpdateError
  | FlowTransitionError
  | FlowEventError
  | FlowProcessingError
  | EngineInitializationError
  | ConfigurationError
  | NetworkError;

/**
 * Helper to check if an error is of a specific type
 */
export function isErrorType<T extends EngineError>(
  error: EngineError,
  ErrorClass: new (...args: any[]) => T,
): error is T {
  return error instanceof ErrorClass;
}

/**
 * Helper to create error from unknown thrown value
 */
export function createEngineError(
  thrown: unknown,
  context: { operation: string; playerID?: string; moveType?: string },
): AnyEngineError {
  if (thrown instanceof EngineError) {
    return thrown as AnyEngineError;
  }

  if (thrown instanceof Error) {
    return new MoveExecutionError(
      context.moveType || "unknown",
      context.playerID || "unknown",
      thrown.message,
    );
  }

  return new MoveExecutionError(
    context.moveType || "unknown",
    context.playerID || "unknown",
    String(thrown),
  );
}
