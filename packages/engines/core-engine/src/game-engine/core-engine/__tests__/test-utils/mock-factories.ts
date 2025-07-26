/**
 * Factory functions for creating standardized mock objects in tests
 */
import type { CoreCardInstance } from "../../card/core-card-instance";
import type { GameCard } from "../../card/game-card";
import {
  EntityNotFoundError,
  MoveValidationFailedError,
  PermissionDeniedError,
  StateUpdateFailedError,
  SystemFailureError,
  ValidationFailedError,
} from "../../errors/consolidated-errors";
import type {
  InstanceId,
  PlayerID,
  PublicId,
  ZoneId,
} from "../../types/core-types";
import { mockFn } from "./index";

/**
 * Creates a mock player with standard properties
 */
export function createMockPlayer(
  playerId: PlayerID,
  properties: Record<string, any> = {},
): Record<string, any> {
  return {
    id: playerId,
    name: `Player ${playerId}`,
    resources: 0,
    active: true,
    ...properties,
  };
}

/**
 * Creates a mock card instance with standard properties
 */
export function createMockCardInstance<
  T extends { id: string } = { id: string },
>(
  instanceId: InstanceId,
  ownerId: PlayerID,
  publicId: PublicId,
  properties: Record<string, any> = {},
): CoreCardInstance<T> {
  return {
    instanceId,
    ownerId,
    publicId,
    ...properties,
  } as CoreCardInstance<T>;
}

/**
 * Creates a mock game card with standard properties
 */
export function createMockGameCard<
  T extends { id: string; name?: string } = { id: string; name?: string },
>(
  instanceId: InstanceId,
  ownerId: PlayerID,
  publicId: PublicId,
  properties: Record<string, any> = {},
): GameCard<T> {
  // Create a base definition with the required id property
  const baseDefinition = {
    id: publicId,
    name: `Card ${publicId}`,
  };

  // Merge the properties to create the full definition
  const definition = {
    ...baseDefinition,
    ...(properties as object),
  } as unknown as T;

  const gameCard = {
    instanceId,
    ownerId,
    publicId,
    definition,
    // Add required methods from GameCard
    canBePlayed: () => true,
    getPlayCost: () => 0,
    getZone: () => "",
    moveTo: () => ({}),
    canBeTargeted: () => true,
    toString: () => `${publicId} (${instanceId})`,
    ...properties,
  } as unknown as GameCard<T>;

  return gameCard;
}

/**
 * Creates a mock zone with standard properties
 */
export function createMockZone(
  zoneId: ZoneId,
  owner: PlayerID,
  cards: InstanceId[] = [],
  properties: Record<string, any> = {},
): Record<string, any> {
  return {
    id: zoneId,
    name: zoneId,
    owner,
    cards: [...cards],
    visibility: "public",
    ...properties,
  };
}

/**
 * Creates a mock move with standard properties
 */
export function createMockMove(
  playerId: PlayerID,
  moveType: string,
  data: Record<string, any> = {},
  moveId = `move-${Date.now()}`,
): Record<string, any> {
  return {
    moveId,
    playerId,
    type: moveType,
    data,
    timestamp: Date.now(),
  };
}

/**
 * Creates a mock engine with standard methods
 */
export function createMockEngine(
  methods: Record<string, (...args: any[]) => any> = {},
): Record<string, any> {
  return {
    gameId: "test-game",
    playerOrder: ["player1", "player2"],
    moveCard: mockFn(),
    getCardZone: mockFn(),
    getCard: mockFn(),
    queryCards: mockFn(),
    ...methods,
  };
}

/**
 * Creates a mock validation error
 */
export function createMockValidationError(
  entityType: "state" | "context" | "card" | "zone" | "player" | "move",
  entityId: string,
  property: string,
  expectedValue: unknown,
  actualValue?: unknown,
): ValidationFailedError {
  return new ValidationFailedError(
    entityType,
    entityId,
    property,
    expectedValue,
    actualValue,
  );
}

/**
 * Creates a mock entity not found error
 */
export function createMockNotFoundError(
  entityType: "card" | "zone" | "modifier" | "player",
  entityId: string,
  context?: Record<string, unknown>,
): EntityNotFoundError {
  return new EntityNotFoundError(entityType, entityId, context);
}

/**
 * Creates a mock move validation error
 */
export function createMockMoveValidationError(
  moveType: string,
  reason: string,
  context?: Record<string, unknown>,
): MoveValidationFailedError {
  return new MoveValidationFailedError(moveType, reason, context);
}

/**
 * Creates a mock permission denied error
 */
export function createMockPermissionError(
  playerId: string,
  action: string,
  reason: string,
): PermissionDeniedError {
  return new PermissionDeniedError(playerId, action, reason);
}

/**
 * Creates a mock state update error
 */
export function createMockStateUpdateError(
  stateType: "game" | "context" | "zone" | "card",
  updateType: string,
  cause: Error | string,
): StateUpdateFailedError {
  return new StateUpdateFailedError(
    stateType,
    updateType,
    typeof cause === "string" ? new Error(cause) : cause,
  );
}

/**
 * Creates a mock system failure error
 */
export function createMockSystemError(
  component: string,
  operation: string,
  causeOrMessage: Error | string,
): SystemFailureError {
  return new SystemFailureError(component, operation, causeOrMessage);
}

/**
 * Creates a standard test engine configuration
 */
export function createStandardTestEngineConfig(
  overrides: Record<string, any> = {},
): Record<string, any> {
  return {
    gameId: "test-game",
    playerCount: 2,
    initialState: {
      playerOrder: ["player1", "player2"],
      turnPlayerPos: 0,
      priorityPlayerPos: 0,
      currentSegment: "setup",
      currentPhase: "initialization",
      currentStep: "setup",
    },
    ...overrides,
  };
}

/**
 * Creates a standard test context configuration
 */
export function createStandardTestContextConfig(
  overrides: Record<string, any> = {},
): Record<string, any> {
  return {
    gameId: "test-game",
    playerOrder: ["player1", "player2"],
    turnPlayerPos: 0,
    priorityPlayerPos: 0,
    currentSegment: "setup",
    currentPhase: "initialization",
    currentStep: "setup",
    cards: {
      player1: {},
      player2: {},
    },
    cardZones: {},
    ...overrides,
  };
}
