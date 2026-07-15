import type { CardsMaps } from "./cards.js";
import type { GameId, PlayerId } from "./ids.js";

/**
 * Optional time-control display data. `mode: "none"` means no clock; the
 * page hides clock UI entirely.
 */
export interface ClockSnapshot {
  mode: "none" | "chess" | "byo-yomi";
  perPlayerMs: Record<PlayerId, number>;
  activePlayerId?: PlayerId;
  /** Wall-clock at which `perPlayerMs` was sampled. Client extrapolates. */
  asOfWallClockMs: number;
}

/**
 * The page layer treats `state` as opaque. The deployable's `parseState`
 * narrows it to a game-specific type. `stateVersion` is monotonic and
 * server-assigned for `authority: "server"`; client-authority deployables
 * may use any monotonic source.
 */
export interface GameSnapshot {
  gameId: GameId;
  /** Position in the match (1-based for best-of-N). */
  gameNumber: number;
  status: "in_progress" | "completed";
  /** Tells the page which orchestrator to mount. Never inferred. */
  authority: "server" | "client";
  stateVersion: number;
  state: unknown;
  cardsMaps: CardsMaps;
  clock?: ClockSnapshot;
}
