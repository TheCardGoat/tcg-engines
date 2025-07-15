/**
 * Consolidated error types for the core engine
 * This file contains merged error types that replace overlapping functionality
 */

import { EngineError } from "./engine-errors";
import {
  FlowTemplates,
  NotFoundTemplates,
  PermissionTemplates,
  SerializationTemplates,
  StateTemplates,
  SystemTemplates,
  ValidationTemplates,
} from "./error-templates";

/**
 * Consolidated validation error that combines functionality from:
 * - StateValidationError
 * - ContextValidationError
 * - InvalidCardStateError
 *
 * This provides a unified approach to validation errors across different entities.
 */
export class ValidationFailedError extends EngineError {
  readonly category = "validation" as const;
  readonly type = "VALIDATION_FAILED" as const;

  constructor(
    public readonly entityType:
      | "state"
      | "context"
      | "card"
      | "zone"
      | "player"
      | "move",
    public readonly entityId: string,
    public readonly property: string,
    public readonly expectedValue: unknown,
    public readonly actualValue?: unknown,
  ) {
    super(
      actualValue !== undefined
        ? ValidationTemplates.property(
            entityType,
            entityId,
            property,
            expectedValue,
            actualValue,
          )
        : ValidationTemplates.entity(
            entityType,
            entityId,
            `${property}: ${expectedValue}`,
          ),
    );
  }
}

/**
 * Consolidated entity not found error that combines functionality from:
 * - CardNotFoundError
 * - ZoneNotFoundError
 * - ModifierNotFoundError
 *
 * This provides a unified approach to "not found" errors across different entity types.
 */
export class EntityNotFoundError extends EngineError {
  readonly category = "validation" as const;
  readonly type = "ENTITY_NOT_FOUND" as const;

  constructor(
    public readonly entityType: "card" | "zone" | "modifier" | "player",
    public readonly entityId: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(NotFoundTemplates.entity(entityType, entityId));
  }
}

/**
 * Consolidated state error that combines functionality from:
 * - StateUpdateError
 * - ContextUpdateError
 *
 * This provides a unified approach to state update errors.
 */
export class StateUpdateFailedError extends EngineError {
  readonly category = "state" as const;
  readonly type = "STATE_UPDATE_FAILED" as const;

  constructor(
    public readonly stateType: "game" | "context" | "zone" | "card",
    public readonly updateType: string,
    public readonly cause: Error,
  ) {
    super(StateTemplates.update(stateType, updateType, cause.message));
    this.cause = cause;
  }
}

/**
 * Consolidated move error that combines functionality from:
 * - ZoneMoveValidationError
 * - MoveValidationError
 *
 * This provides a unified approach to move validation errors.
 */
export class MoveValidationFailedError extends EngineError {
  readonly category = "validation" as const;
  readonly type = "MOVE_VALIDATION_FAILED" as const;

  constructor(
    public readonly moveType: string,
    public readonly reason: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(ValidationTemplates.move(moveType, reason));
  }
}

/**
 * Consolidated permission error that combines functionality from:
 * - InvalidPlayerError
 * - PlayerValidationError
 *
 * This provides a unified approach to permission and player validation errors.
 */
export class PermissionDeniedError extends EngineError {
  readonly category = "validation" as const;
  readonly type = "PERMISSION_DENIED" as const;

  constructor(
    public readonly playerID: string,
    public readonly action: string,
    public readonly reason: string,
  ) {
    super(PermissionTemplates.denied(playerID, action, reason));
  }
}

/**
 * Consolidated system error that combines functionality from:
 * - EngineInitializationError
 * - ConfigurationError
 * - NetworkError
 *
 * This provides a unified approach to system-level errors.
 */
export class SystemFailureError extends EngineError {
  readonly category = "system" as const;
  readonly type = "SYSTEM_FAILURE" as const;
  public readonly cause?: Error;

  constructor(
    public readonly component: string,
    public readonly operation: string,
    causeOrMessage: Error | string,
  ) {
    const causeMessage =
      typeof causeOrMessage === "string"
        ? causeOrMessage
        : causeOrMessage.message;
    super(SystemTemplates.failure(component, operation, causeMessage));
    if (typeof causeOrMessage !== "string") {
      this.cause = causeOrMessage;
    }
  }
}

/**
 * Consolidated flow error that combines functionality from:
 * - FlowTransitionError
 * - FlowEventError
 * - FlowProcessingError
 *
 * This provides a unified approach to flow-related errors.
 */
export class FlowFailedError extends EngineError {
  readonly category = "execution" as const;
  readonly type = "FLOW_FAILED" as const;

  constructor(
    public readonly operation: "transition" | "event" | "processing" | string,
    public readonly flowState: string,
    public readonly reason: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(FlowTemplates.operation(operation, flowState, reason));
  }
}

/**
 * Consolidated serialization error that combines functionality from:
 * - SerializationError
 * - SerializationFailedError
 *
 * This provides a unified approach to serialization-related errors.
 */
export class SerializationFailedError extends EngineError {
  readonly category = "system" as const;
  readonly type = "SERIALIZATION_FAILED" as const;

  constructor(
    public readonly operation: "serialize" | "deserialize" | "parse" | string,
    public readonly dataType: string,
    public readonly reason: string,
    public readonly cause?: Error,
  ) {
    super(SerializationTemplates.operation(operation, dataType, reason));
    if (cause) {
      this.cause = cause;
    }
  }
}

/**
 * Type union of all consolidated error types
 */
export type AnyConsolidatedError =
  | ValidationFailedError
  | EntityNotFoundError
  | StateUpdateFailedError
  | MoveValidationFailedError
  | PermissionDeniedError
  | SystemFailureError
  | FlowFailedError
  | SerializationFailedError;
