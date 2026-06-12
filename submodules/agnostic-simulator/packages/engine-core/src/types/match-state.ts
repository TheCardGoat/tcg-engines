import type { PlayerId } from "./branded.ts";
import type { ZoneRuntimeState } from "./zones.ts";

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
  time: TimeContext;
  random: CtxRandom;
}

export interface CtxStatus {
  gameSegment?: string;
  phase?: string;
  step?: string;
  turn: number;
  turnPlayer?: PlayerId;
  activePlayer: PlayerId;
  gameEnded: boolean;
  winner?: PlayerId;
  winReason?: string;
  pendingDecision: PlayerId[];
  nextTurnPlayer?: PlayerId;
}

export type TimeContext =
  | { mode: "none" }
  | ChessClockContext
  | PriorityClockContext
  | DynamicClockContext;

export type ClockPauseReason =
  | "ENGINE_RESOLVING"
  | "SIMULTANEOUS_CHOICE"
  | "JUDGE_PAUSE"
  | "DISCONNECTED"
  | "MATCH_NOT_STARTED"
  | "GAME_ENDED"
  | "SERVER_RECOVERY";

export interface ChessClockContext {
  mode: "chess";
  running: boolean;
  activePlayerID?: string;
  startedAtMs?: number;
  pausedReason?: ClockPauseReason;
  players: Record<string, ChessClockPlayerState>;
  config: ChessClockConfig;
  activePlayerAccumulatedMs?: number;
}

export interface PriorityClockContext {
  mode: "priority";
  running: boolean;
  activePlayerID?: string;
  startedAtMs?: number;
  pausedReason?: ClockPauseReason;
  prioritySeq: number;
  activeWindow?: {
    playerID: string;
    prioritySeq: number;
    windowMs: number;
    deadlineMs: number;
  };
  players: Record<string, PriorityClockPlayerState>;
  config: PriorityClockConfig;
}

export interface DynamicClockContext {
  mode: "dynamic";
  running: boolean;
  activePlayerID?: string;
  startedAtMs?: number;
  pausedReason?: ClockPauseReason;
  players: Record<string, DynamicClockPlayerState>;
  config: DynamicClockConfig;
  activePlayerAccumulatedMs?: number;
}

export interface ClockPlayerState {
  reserveMsRemaining: number;
  totalConsumedMs: number;
  movesMade: number;
  lastUpdatedAtMs: number;
}

export interface ChessClockPlayerState extends ClockPlayerState {
  timeoutCount: number;
  isInNegativeTime: boolean;
}

export interface PriorityClockPlayerState extends ClockPlayerState {
  totalWindowOverageMs: number;
  moveBonusMsGranted: number;
  windowTimeouts: number;
}

export interface DynamicClockPlayerState extends ClockPlayerState {
  timeoutCount: number;
  isInNegativeTime: boolean;
  actionBonusMsGranted: number;
  turnPassBonusMsGranted: number;
}

export interface ChessClockConfig {
  initialReserveMs: number;
  incrementMs: number;
  delayMs: number;
  graceMs: number;
  resetTimeOnSkipMs: number;
  lossPolicy: "lose-on-time";
  maxDecisionTimeMs?: number;
}

export interface PriorityClockConfig {
  perPriorityWindowMs: number;
  reserveMs: number;
  perMoveBonusMs: number;
  endGameBaselineMs: number;
  graceMs: number;
  onWindowExpiry: "auto-pass-if-legal-else-forfeit";
  onReserveExpiry: "lose-on-time";
}

export interface DynamicClockConfig {
  initialReserveMs: number;
  reserveCapMs: number;
  perActionBonusMs: number;
  perTurnPassBonusMs: number;
  resetTimeOnSkipMs: number;
  graceMs: number;
  maxDecisionTimeMs?: number;
}

export type TimeControlConfig =
  | { mode: "none" }
  | { mode: "chess"; config: ChessClockConfig }
  | { mode: "priority"; config: PriorityClockConfig }
  | { mode: "dynamic"; config: DynamicClockConfig };

export interface CtxRandom {
  seed: string;
  state: unknown;
  drawCount: number;
}
