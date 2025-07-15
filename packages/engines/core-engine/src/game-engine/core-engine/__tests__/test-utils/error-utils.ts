/**
 * Test utilities for working with errors in tests
 */

import type {
  EntityNotFoundError,
  FlowFailedError,
  MoveValidationFailedError,
  PermissionDeniedError,
  SerializationFailedError,
  StateUpdateFailedError,
  SystemFailureError,
  ValidationFailedError,
} from "../../errors/consolidated-errors";
import { EngineError } from "../../errors/engine-errors";
import { isErrorOfType } from "../../utils/error-utils";

/**
 * Type guard for checking if an error is of a specific consolidated error type
 */
export function isConsolidatedError(error: unknown): error is EngineError {
  return error instanceof EngineError;
}

/**
 * Asserts that a function throws an error of a specific type
 * @param fn Function to execute
 * @param errorType Expected error type
 * @param message Optional assertion message
 */
export function expectToThrowErrorOfType(
  fn: () => any,
  errorType: string,
  message?: string,
): void {
  try {
    fn();
    throw new Error(
      `Expected function to throw ${errorType} error, but it did not throw`,
    );
  } catch (error) {
    if (!isErrorOfType(error, errorType)) {
      throw new Error(
        message ||
          `Expected error of type ${errorType}, but got ${
            isConsolidatedError(error) ? error.type : String(error)
          }`,
      );
    }
  }
}

/**
 * Asserts that a function throws a ValidationFailedError
 */
export function expectToThrowValidationError(
  fn: () => any,
  entityType?: string,
  property?: string,
): ValidationFailedError {
  try {
    fn();
    throw new Error(
      "Expected function to throw ValidationFailedError, but it did not throw",
    );
  } catch (error) {
    if (!isErrorOfType(error, "VALIDATION_FAILED")) {
      throw new Error(
        `Expected ValidationFailedError, but got ${
          isConsolidatedError(error) ? error.type : String(error)
        }`,
      );
    }

    const validationError = error as ValidationFailedError;

    if (entityType && validationError.entityType !== entityType) {
      throw new Error(
        `Expected ValidationFailedError for entity type "${entityType}", but got "${validationError.entityType}"`,
      );
    }

    if (property && validationError.property !== property) {
      throw new Error(
        `Expected ValidationFailedError for property "${property}", but got "${validationError.property}"`,
      );
    }

    return validationError;
  }
}

/**
 * Asserts that a function throws an EntityNotFoundError
 */
export function expectToThrowNotFoundError(
  fn: () => any,
  entityType?: string,
  entityId?: string,
): EntityNotFoundError {
  try {
    fn();
    throw new Error(
      "Expected function to throw EntityNotFoundError, but it did not throw",
    );
  } catch (error) {
    if (!isErrorOfType(error, "ENTITY_NOT_FOUND")) {
      throw new Error(
        `Expected EntityNotFoundError, but got ${
          isConsolidatedError(error) ? error.type : String(error)
        }`,
      );
    }

    const notFoundError = error as EntityNotFoundError;

    if (entityType && notFoundError.entityType !== entityType) {
      throw new Error(
        `Expected EntityNotFoundError for entity type "${entityType}", but got "${notFoundError.entityType}"`,
      );
    }

    if (entityId && notFoundError.entityId !== entityId) {
      throw new Error(
        `Expected EntityNotFoundError for entity ID "${entityId}", but got "${notFoundError.entityId}"`,
      );
    }

    return notFoundError;
  }
}

/**
 * Asserts that a function throws a MoveValidationFailedError
 */
export function expectToThrowMoveValidationError(
  fn: () => any,
  moveType?: string,
): MoveValidationFailedError {
  try {
    fn();
    throw new Error(
      "Expected function to throw MoveValidationFailedError, but it did not throw",
    );
  } catch (error) {
    if (!isErrorOfType(error, "MOVE_VALIDATION_FAILED")) {
      throw new Error(
        `Expected MoveValidationFailedError, but got ${
          isConsolidatedError(error) ? error.type : String(error)
        }`,
      );
    }

    const moveError = error as MoveValidationFailedError;

    if (moveType && moveError.moveType !== moveType) {
      throw new Error(
        `Expected MoveValidationFailedError for move type "${moveType}", but got "${moveError.moveType}"`,
      );
    }

    return moveError;
  }
}

/**
 * Asserts that a function throws a PermissionDeniedError
 */
export function expectToThrowPermissionError(
  fn: () => any,
  playerId?: string,
  action?: string,
): PermissionDeniedError {
  try {
    fn();
    throw new Error(
      "Expected function to throw PermissionDeniedError, but it did not throw",
    );
  } catch (error) {
    if (!isErrorOfType(error, "PERMISSION_DENIED")) {
      throw new Error(
        `Expected PermissionDeniedError, but got ${
          isConsolidatedError(error) ? error.type : String(error)
        }`,
      );
    }

    const permissionError = error as PermissionDeniedError;

    if (playerId && permissionError.playerID !== playerId) {
      throw new Error(
        `Expected PermissionDeniedError for player ID "${playerId}", but got "${permissionError.playerID}"`,
      );
    }

    if (action && permissionError.action !== action) {
      throw new Error(
        `Expected PermissionDeniedError for action "${action}", but got "${permissionError.action}"`,
      );
    }

    return permissionError;
  }
}

// Removed unused function: expectToThrowStateUpdateError
