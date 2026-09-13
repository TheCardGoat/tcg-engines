import type { GrandArchiveCommittedEvent } from "./events.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";

export interface GrandArchiveCommandSuccess {
  readonly ok: true;
  readonly state: GrandArchiveMatchState;
  readonly events: readonly GrandArchiveCommittedEvent[];
}

export interface GrandArchiveCommandFailure {
  readonly ok: false;
  readonly code:
    | "match-finished"
    | "stale-state"
    | "unknown-player"
    | "player-lost"
    | "decision-pending"
    | "not-opportunity-holder"
    | "illegal-command"
    | "not-implemented"
    | "internal-error";
  readonly message: string;
  readonly state: GrandArchiveMatchState;
  readonly diagnostic?: {
    readonly baseStateVersion: number;
    readonly cause: string;
  };
}

export type GrandArchiveCommandTransition = GrandArchiveCommandSuccess | GrandArchiveCommandFailure;
