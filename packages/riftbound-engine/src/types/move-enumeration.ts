/**
 * Riftbound Move Enumeration Types
 *
 * Types for enumerating available moves and their parameters.
 */

/**
 * Information about an available move
 */
export interface AvailableMoveInfo {
  readonly moveType: string;
  readonly isValid: boolean;
  readonly parameters?: MoveParameterOptions;
  readonly validationErrors?: MoveValidationError[];
}

/**
 * Options for move parameters
 */
export interface MoveParameterOptions {
  readonly [key: string]: ParameterInfo;
}

/**
 * Information about a single parameter
 */
export interface ParameterInfo {
  readonly type: string;
  readonly required: boolean;
  readonly options?: unknown[];
  readonly description?: string;
}

/**
 * Schema for move parameters
 */
export interface MoveParamSchema {
  readonly fields: Record<string, ParamFieldSchema>;
}

/**
 * Schema for a single parameter field
 */
export interface ParamFieldSchema {
  readonly type: string;
  readonly required: boolean;
  readonly description?: string;
  readonly enum?: unknown[];
  readonly min?: number;
  readonly max?: number;
}

/**
 * Move validation error
 */
export interface MoveValidationError {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
}
