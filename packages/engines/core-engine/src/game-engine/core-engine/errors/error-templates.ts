/**
 * Standardized error message templates for the core engine
 * This file provides consistent templates for error messages across the codebase
 */

/**
 * Templates for validation error messages
 */
export const ValidationTemplates = {
  /**
   * Template for property validation errors
   * @example "card validation failed: expected 'health' to be > 0, got -1"
   */
  property: (
    entityType: string,
    entityId: string,
    property: string,
    expected: unknown,
    actual: unknown,
  ): string =>
    `${entityType} validation failed: expected '${property}' to be ${expected}, got ${actual}`,

  /**
   * Template for entity validation errors
   * @example "card 'card-123' validation failed: must be in play zone"
   */
  entity: (entityType: string, entityId: string, constraint: string): string =>
    `${entityType} '${entityId}' validation failed: ${constraint}`,

  /**
   * Template for move validation errors
   * @example "move 'play-card' validation failed: not enough resources"
   */
  move: (moveType: string, reason: string): string =>
    `move '${moveType}' validation failed: ${reason}`,
};

/**
 * Templates for not found error messages
 */
export const NotFoundTemplates = {
  /**
   * Template for entity not found errors
   * @example "card 'card-123' not found"
   */
  entity: (entityType: string, entityId: string): string =>
    `${entityType} '${entityId}' not found`,

  /**
   * Template for entity not found in container errors
   * @example "card 'card-123' not found in zone 'hand-p1'"
   */
  entityInContainer: (
    entityType: string,
    entityId: string,
    containerType: string,
    containerId: string,
  ): string =>
    `${entityType} '${entityId}' not found in ${containerType} '${containerId}'`,
};

/**
 * Templates for permission error messages
 */
export const PermissionTemplates = {
  /**
   * Template for permission denied errors
   * @example "player 'p1' cannot 'draw card': not their turn"
   */
  denied: (playerId: string, action: string, reason: string): string =>
    `player '${playerId}' cannot '${action}': ${reason}`,

  /**
   * Template for entity permission errors
   * @example "player 'p1' cannot modify card 'card-123': owned by 'p2'"
   */
  entityAccess: (
    playerId: string,
    action: string,
    entityType: string,
    entityId: string,
    reason: string,
  ): string =>
    `player '${playerId}' cannot ${action} ${entityType} '${entityId}': ${reason}`,
};

/**
 * Templates for state update error messages
 */
export const StateTemplates = {
  /**
   * Template for state update errors
   * @example "failed to update 'game' state during 'transition': invalid state"
   */
  update: (stateType: string, updateType: string, reason: string): string =>
    `failed to update '${stateType}' state during '${updateType}': ${reason}`,

  /**
   * Template for state transition errors
   * @example "invalid state transition from 'setup' to 'active': missing required data"
   */
  transition: (
    stateType: string,
    fromState: string,
    toState: string,
    reason: string,
  ): string =>
    `invalid '${stateType}' state transition from '${fromState}' to '${toState}': ${reason}`,
};

/**
 * Templates for flow error messages
 */
export const FlowTemplates = {
  /**
   * Template for flow operation errors
   * @example "flow 'transition' failed in state 'SETUP': invalid event"
   */
  operation: (operation: string, flowState: string, reason: string): string =>
    `flow '${operation}' failed in state '${flowState}': ${reason}`,
};

/**
 * Templates for system error messages
 */
export const SystemTemplates = {
  /**
   * Template for system failure errors
   * @example "system failure in 'engine' during 'initialization': configuration invalid"
   */
  failure: (component: string, operation: string, reason: string): string =>
    `system failure in '${component}' during '${operation}': ${reason}`,
};

/**
 * Templates for serialization error messages
 */
export const SerializationTemplates = {
  /**
   * Template for serialization errors
   * @example "failed to 'serialize' 'game-state': circular reference detected"
   */
  operation: (operation: string, dataType: string, reason: string): string =>
    `failed to '${operation}' '${dataType}': ${reason}`,
};

/**
 * All error message templates grouped by category
 */
export const ErrorTemplates = {
  validation: ValidationTemplates,
  notFound: NotFoundTemplates,
  permission: PermissionTemplates,
  state: StateTemplates,
  flow: FlowTemplates,
  system: SystemTemplates,
  serialization: SerializationTemplates,
};
