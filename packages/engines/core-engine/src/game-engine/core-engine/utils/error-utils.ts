/**
 * Standardized error handling utilities for the core engine
 * Provides consistent patterns for creating, formatting, and handling errors
 */

import { logger } from "../../../shared/logger";
import {
  type AnyConsolidatedError,
  EntityNotFoundError,
  FlowFailedError,
  MoveValidationFailedError,
  PermissionDeniedError,
  SerializationFailedError,
  StateUpdateFailedError,
  SystemFailureError,
  ValidationFailedError,
} from "../errors/consolidated-errors";
import type { AnyDomainError } from "../errors/domain-errors";
import type { AnyEngineError } from "../errors/engine-errors";
import { createEngineError, EngineError } from "../errors/engine-errors";
import {
  ErrorTemplates,
  FlowTemplates,
  NotFoundTemplates,
  PermissionTemplates,
  SerializationTemplates,
  StateTemplates,
  SystemTemplates,
  ValidationTemplates,
} from "../errors/error-templates";

// Re-export error templates for easy access
export {
  ValidationTemplates,
  NotFoundTemplates,
  PermissionTemplates,
  StateTemplates,
  FlowTemplates,
  SystemTemplates,
  SerializationTemplates,
  ErrorTemplates,
};

/**
 * Standard error message formatting patterns
 * @deprecated Use error-templates.ts instead for consistent error formatting
 */
export const ErrorFormatters = {
  /**
   * Format for validation errors: "Expected [expected] for [property], but got [actual]"
   * @deprecated Use ValidationTemplates.property from error-templates.ts instead
   */
  validation: (property: string, expected: unknown, actual: unknown): string =>
    `Expected ${expected} for ${property}, but got ${actual}`,

  /**
   * Format for not found errors: "[entityType] not found: [id]"
   * @deprecated Use NotFoundTemplates.entity from error-templates.ts instead
   */
  notFound: (entityType: string, id: string): string =>
    `${entityType} not found: ${id}`,

  /**
   * Format for permission errors: "[entityType] [id] cannot be [action] by [actor]: [reason]"
   * @deprecated Use PermissionTemplates.entityAccess from error-templates.ts instead
   */
  permission: (
    entityType: string,
    id: string,
    action: string,
    actor: string,
    reason: string,
  ): string => `${entityType} ${id} cannot be ${action} by ${actor}: ${reason}`,

  /**
   * Format for state errors: "Invalid state for [entityType] [id]: [details]"
   * @deprecated Use StateTemplates.update from error-templates.ts instead
   */
  state: (entityType: string, id: string, details: string): string =>
    `Invalid state for ${entityType} ${id}: ${details}`,

  /**
   * Format for execution errors: "Failed to execute [operation]: [reason]"
   * @deprecated Use FlowTemplates.operation from error-templates.ts instead
   */
  execution: (operation: string, reason: string): string =>
    `Failed to execute ${operation}: ${reason}`,
};

/**
 * Safely wraps a function execution with standardized error handling
 *
 * @param operation - Name of the operation being performed
 * @param fn - Function to execute
 * @param context - Additional context for error reporting
 * @returns The result of the function execution
 * @throws AnyEngineError with standardized formatting
 */
export function safeExecute<T>(
  operation: string,
  fn: () => T,
  context: { playerID?: string; moveType?: string } = {},
): T {
  try {
    return fn();
  } catch (error) {
    const engineError = createEngineError(error, {
      operation,
      playerID: context.playerID,
      moveType: context.moveType,
    });

    // Log the error with consistent format
    logger.error(`Error in ${operation}:`, {
      errorType: engineError.type,
      errorCategory: engineError.category,
      playerID: context.playerID,
      moveType: context.moveType,
      message: engineError.message,
      stack: engineError.stack,
    });

    throw engineError;
  }
}

/**
 * Safely executes an async function with standardized error handling
 *
 * @param operation - Name of the operation being performed
 * @param fn - Async function to execute
 * @param context - Additional context for error reporting
 * @returns Promise resolving to the function result
 * @throws AnyEngineError with standardized formatting
 */
export async function safeExecuteAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  context: { playerID?: string; moveType?: string } = {},
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const engineError = createEngineError(error, {
      operation,
      playerID: context.playerID,
      moveType: context.moveType,
    });

    // Log the error with consistent format
    logger.error(`Error in ${operation}:`, {
      errorType: engineError.type,
      errorCategory: engineError.category,
      playerID: context.playerID,
      moveType: context.moveType,
      message: engineError.message,
      stack: engineError.stack,
    });

    throw engineError;
  }
}

/**
 * Type guard to check if an error is an EngineError
 */
export function isEngineError(error: unknown): error is EngineError {
  return error instanceof EngineError;
}

/**
 * Type guard to check if an error is a specific type of EngineError
 */
export function isErrorOfType<T extends EngineError>(
  error: unknown,
  errorType: string,
): error is T {
  return isEngineError(error) && error.type === errorType;
}

/**
 * Type guard to check if an error is a consolidated error type
 */
export function isConsolidatedError(
  error: unknown,
): error is AnyConsolidatedError {
  return (
    isEngineError(error) &&
    (error.type === "VALIDATION_FAILED" ||
      error.type === "ENTITY_NOT_FOUND" ||
      error.type === "STATE_UPDATE_FAILED" ||
      error.type === "MOVE_VALIDATION_FAILED" ||
      error.type === "PERMISSION_DENIED" ||
      error.type === "SYSTEM_FAILURE" ||
      error.type === "FLOW_FAILED" ||
      error.type === "SERIALIZATION_FAILED")
  );
}

/**
 * Extracts useful debugging information from an error
 */
export function getErrorContext(error: unknown): Record<string, unknown> {
  if (isEngineError(error)) {
    return {
      type: error.type,
      category: error.category,
      message: error.message,
      context: error.context || {},
      cause: error.cause ? getErrorContext(error.cause) : undefined,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause ? getErrorContext(error.cause) : undefined,
    };
  }

  return { value: String(error) };
}

/**
 * Creates a standardized result object with error information
 */
export function createErrorResult<T>(
  error: unknown,
  operation: string,
  context: Record<string, unknown> = {},
): {
  success: false;
  error: { message: string; type: string; details: Record<string, unknown> };
} {
  const errorContext = getErrorContext(error);

  return {
    success: false,
    error: {
      message: (errorContext.message as string) || `Error during ${operation}`,
      type: (errorContext.type as string) || "UNKNOWN_ERROR",
      details: {
        ...errorContext,
        ...context,
        operation,
      },
    },
  };
}

/**
 * Creates a standardized success result object
 */
export function createSuccessResult<T>(data: T): { success: true; data: T } {
  return {
    success: true,
    data,
  };
}

/**
 * Type for standardized operation results
 */
export type OperationResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: {
        message: string;
        type: string;
        details: Record<string, unknown>;
      };
    };

/**
 * Executes an operation and returns a standardized result object
 */
export function executeOperation<T>(
  operation: string,
  fn: () => T,
  context: Record<string, unknown> = {},
): OperationResult<T> {
  try {
    const result = fn();
    return createSuccessResult(result);
  } catch (error) {
    return createErrorResult(error, operation, context);
  }
}

/**
 * Executes an async operation and returns a standardized result object
 */
export async function executeOperationAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  context: Record<string, unknown> = {},
): Promise<OperationResult<T>> {
  try {
    const result = await fn();
    return createSuccessResult(result);
  } catch (error) {
    return createErrorResult(error, operation, context);
  }
}
