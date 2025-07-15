/**
 * Shared types for lobby engine to break circular dependencies
 *
 * This file contains core types that are used across multiple lobby engine modules
 * to prevent circular import dependencies.
 */

/**
 * Base lobby player type
 */
export type LobbyPlayer<T = unknown> = {
  id: string;
  data: T;
  isReady: boolean;
  joinedAt: number;
};

/**
 * Base lobby state type
 */
export type LobbyState<T = unknown> = {
  id: string;
  players: LobbyPlayer<T>[];
  createdAt: number;
  updatedAt: number;
  maxPlayers: number;
  minPlayers: number;
  joinInProgress: number;
};

/**
 * Lobby status types
 */
export type StatusType =
  | "players_joining" // Lobby is open for players to join
  | "players_accepting" // minPlayers reached, waiting for players to accept
  | "creating_event" // minPlayers reached, all players accepted, creating event
  | "failed" // Event failed to create, lobby is closed
  | "created"; // Event created, lobby is closed for new players

/**
 * Lobby context type
 */
export type LobbyContext<T = unknown> = {
  status: StatusType;
  presences: Record<string, unknown>;
  players: Record<string, T>;
  joinsInProgress: number;
  minPlayers: number;
  maxPlayers: number;
  playersAccepted: Record<string, boolean>;
  emptyTicks: number;
  maxDurationTicks: number;
  acceptDeadlineEndTick: number;
  createdAt: number;
  updatedAt: number;
  id: string;
  matchId: string;
  type?: string;
};

/**
 * Combined lobby state type
 */
export type CombinedLobbyState<T = unknown, C = unknown> = {
  state: T;
  context: LobbyContext<C>;
};

/**
 * Event types
 */
export type EventType = "sealed" | "draft";
export type PairingType = "swiss";

/**
 * Plugin interface
 */
export type Plugin<T = unknown, C = unknown> = {
  name: string;

  // Plugin hooks for lobby lifecycle events
  onPlayerJoin?: (playerId: string, playerData: C) => void;
  onPlayerLeave?: (playerId: string) => void;
  onPlayerReady?: (playerId: string) => void;
  onTickUpdate?: () => void;
  onStatusChange?: (
    oldStatus: string,
    newStatus: string,
    state: CombinedLobbyState<T, C>,
  ) => void;

  // Allow for additional properties
  [key: string]: unknown;
};
