import type { PlayerId } from "./branded.ts";
import type { ZoneRuntimeState } from "./zone-types.ts";

export type {
  TimeContext,
  ClockPauseReason,
  ChessClockContext,
  PriorityClockContext,
  DynamicClockContext,
  ClockPlayerState,
  ChessClockPlayerState,
  PriorityClockPlayerState,
  DynamicClockPlayerState,
  ChessClockConfig,
  PriorityClockConfig,
  DynamicClockConfig,
  TimeControlConfig,
  CtxRandom,
} from "@tcg/engine-core";

export interface MatchState<G extends object = object> {
  G: G;
  ctx: TCGCtx;
}

export interface TCGCtx {
  protocolVersion: string;
  matchID: string;
  gameID: string;
  rulesetHash: string;
  _stateID: number;
  playerIds: PlayerId[];
  zones: ZoneRuntimeState;
  status: CtxStatus;
  time: import("@tcg/engine-core").TimeContext;
  random: import("@tcg/engine-core").CtxRandom;
}

export interface CtxStatus {
  gameSegment?: string;
  phase?: string;
  step?: string;
  turn: number;
  /** The player whose turn it is. Undefined during the setup segment (no turns yet). */
  turnPlayer?: PlayerId;
  /** The player who can currently act. Always set — never undefined. */
  activePlayer: PlayerId;
  gameEnded: boolean;
  winner?: PlayerId;
  winReason?: string;
  /**
   * Players who still need to make a pending decision.
   * Used during mulligan (players choosing to redraw) and action steps
   * (players choosing to pass or act). Cleared as each player resolves.
   */
  pendingDecision: PlayerId[];
  /**
   * Set by passTurn — identifies the next turn's player and signals that
   * the current turn should end. The flow runner's main-phase.endIf and
   * turn.endIf check this flag. Cleared by turnCycleOnBegin.
   */
  nextTurnPlayer?: PlayerId;
}
