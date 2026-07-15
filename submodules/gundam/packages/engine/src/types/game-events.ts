import type { PlayerId } from "./branded.ts";

export interface GameEvent {
  type: string;
  payload?: unknown;
  source?: string;
  targets?: string[];
}

export interface PublishedGameEvent {
  eventId: number;
  stateID: number;
  timestamp: number;
  event: GameEvent;
}

export type EventEmitFn = (event: GameEvent) => void;

export interface GameLogEntry {
  id: number;
  stateID: number;
  timestamp: number;
  type: string;
  message: string;
  playerId?: PlayerId;
  cardIds?: string[];
  data?: Record<string, unknown>;
  // Visibility control: if set, only these players see this log entry
  visibleTo?: PlayerId[] | "all";
}
