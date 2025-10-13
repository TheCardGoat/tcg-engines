/**
 * Move Enumeration Types
 *
 * Type definitions for the move enumeration system that allows AI agents
 * and UI components to discover available moves and their parameters.
 */

/**
 * Parameter field schema
 *
 * Describes a single parameter field for a move, including its type,
 * description, and valid values.
 */
export type ParamFieldSchema = {
  /** Parameter name */
  name: string;

  /** Parameter type */
  type: "cardId" | "playerId" | "number" | "boolean" | "object" | "string";

  /** Human-readable description */
  description: string;

  /** For cardId/playerId type: valid IDs that can be used */
  validValues?: string[];

  /** For enum types: valid enum values */
  enumValues?: string[];
};

/**
 * Move parameter schema
 *
 * Defines the structure of parameters a move accepts, including
 * required and optional fields.
 */
export type MoveParamSchema = {
  /** Required parameters */
  required: ParamFieldSchema[];

  /** Optional parameters */
  optional?: ParamFieldSchema[];
};

/**
 * Available move information
 *
 * Metadata about a move that is available to execute, including
 * display information and parameter schema.
 */
export type AvailableMoveInfo = {
  /** Unique move identifier */
  moveId: string;

  /** Human-readable display name */
  displayName: string;

  /** Brief description of what the move does */
  description: string;

  /** Icon hint for UI (optional) */
  icon?: string;

  /** Parameter schema (undefined if move has no parameters) */
  paramSchema?: MoveParamSchema;
};

/**
 * Parameter information
 *
 * Detailed information about a specific parameter, including
 * type, description, and constraints.
 */
export type ParameterInfo = {
  /** Parameter type */
  type: "cardId" | "playerId" | "number" | "boolean" | "object";

  /** Human-readable description */
  description: string;

  /** Valid values for this parameter */
  validValues?: any[];

  /** Minimum value (for number types) */
  min?: number;

  /** Maximum value (for number types) */
  max?: number;
};

/**
 * Move parameter options
 *
 * All valid parameter combinations for a specific move, along with
 * metadata about each parameter field.
 */
export type MoveParameterOptions = {
  /** All valid parameter combinations for this move */
  validCombinations: Record<string, any>[];

  /** Information about each parameter */
  parameterInfo: Record<string, ParameterInfo>;
};

/**
 * Move validation error
 *
 * Detailed information about why a move cannot be executed,
 * including error code, reason, context, and suggestions.
 */
export type MoveValidationError = {
  /** Move that was attempted */
  moveId: string;

  /** Error code for programmatic handling */
  errorCode: string;

  /** Human-readable reason */
  reason: string;

  /** Additional error context */
  context?: Record<string, any>;

  /** Suggested actions to make the move valid */
  suggestions?: string[];
};
