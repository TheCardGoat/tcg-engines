import { create } from "mutative";

import type { PlayerId } from "../types/branded.ts";
import type {
  ChessClockContext,
  ChessClockPlayerState,
  ClockPauseReason,
  DynamicClockConfig,
  DynamicClockContext,
  DynamicClockPlayerState,
  MatchState,
  PriorityClockContext,
} from "../types/match-state.ts";

export const DEFAULT_DYNAMIC_CLOCK_CONFIG: DynamicClockConfig = {
  initialReserveMs: 150_000,
  reserveCapMs: 150_000,
  perActionBonusMs: 5_000,
  perTurnPassBonusMs: 60_000,
  resetTimeOnSkipMs: 60_000,
  graceMs: 0,
  maxDecisionTimeMs: 60_000,
};

export function settleClocks<G extends object>(state: MatchState<G>, now: number): MatchState<G> {
  const time = state.ctx.time;
  if (time.mode === "none") return state;
  if (!time.running) return state;
  if (!time.activePlayerID) return state;
  if (time.startedAtMs == null) return state;

  const elapsedMs = Math.max(0, now - time.startedAtMs);
  if (elapsedMs === 0) return state;

  return create(state, (draft) => {
    const draftTime = draft.ctx.time;
    if (draftTime.mode === "chess") {
      settleChessClockDraft(draftTime, now, elapsedMs);
    } else if (draftTime.mode === "priority") {
      settlePriorityClockDraft(draftTime, now, elapsedMs);
    } else if (draftTime.mode === "dynamic") {
      settleDynamicClockDraft(draftTime, now, elapsedMs);
    }
  }) as MatchState<G>;
}

function settleChessClockDraft(time: ChessClockContext, now: number, elapsedMs: number): void {
  const playerState = time.activePlayerID ? time.players[time.activePlayerID] : undefined;
  if (!playerState) return;

  playerState.totalConsumedMs += elapsedMs;
  playerState.reserveMsRemaining -= elapsedMs;
  playerState.lastUpdatedAtMs = now;
  time.activePlayerAccumulatedMs = (time.activePlayerAccumulatedMs ?? 0) + elapsedMs;

  if (playerState.reserveMsRemaining <= 0) {
    playerState.isInNegativeTime = true;
  }

  time.startedAtMs = now;
}

function settlePriorityClockDraft(
  time: PriorityClockContext,
  now: number,
  elapsedMs: number,
): void {
  const playerState = time.activePlayerID ? time.players[time.activePlayerID] : undefined;
  if (!playerState) return;

  let windowOverageMs = 0;
  if (time.activeWindow && now > time.activeWindow.deadlineMs) {
    windowOverageMs = now - time.activeWindow.deadlineMs;
    playerState.windowTimeouts++;
  }

  playerState.totalConsumedMs += elapsedMs;
  playerState.totalWindowOverageMs += windowOverageMs;
  playerState.reserveMsRemaining = Math.max(0, playerState.reserveMsRemaining - windowOverageMs);
  playerState.lastUpdatedAtMs = now;

  if (playerState.reserveMsRemaining === 0) {
    time.running = false;
    time.pausedReason = "GAME_ENDED";
  }

  time.startedAtMs = now;
}

function settleDynamicClockDraft(time: DynamicClockContext, now: number, elapsedMs: number): void {
  const playerState = time.activePlayerID ? time.players[time.activePlayerID] : undefined;
  if (!playerState) return;

  playerState.totalConsumedMs += elapsedMs;
  playerState.reserveMsRemaining -= elapsedMs;
  playerState.lastUpdatedAtMs = now;
  time.activePlayerAccumulatedMs = (time.activePlayerAccumulatedMs ?? 0) + elapsedMs;

  if (playerState.reserveMsRemaining <= 0) {
    playerState.isInNegativeTime = true;
  }

  time.startedAtMs = now;
}

export function pauseClock<G extends object>(
  state: MatchState<G>,
  reason: ClockPauseReason,
  now: number,
): MatchState<G> {
  if (state.ctx.time.mode === "none") return state;
  const settled = settleClocks(state, now);
  return create(settled, (draft) => {
    if (draft.ctx.time.mode !== "none") {
      draft.ctx.time.running = false;
      draft.ctx.time.pausedReason = reason;
    }
  }) as MatchState<G>;
}

export function resumeClock<G extends object>(
  state: MatchState<G>,
  activePlayerId: string,
  now: number,
): MatchState<G> {
  if (state.ctx.time.mode === "none") return state;
  return create(state, (draft) => {
    if (draft.ctx.time.mode === "none") return;
    draft.ctx.time.activePlayerID = activePlayerId;
    draft.ctx.time.startedAtMs = now;
    draft.ctx.time.running = true;
    draft.ctx.time.pausedReason = undefined;

    const playerState = draft.ctx.time.players[activePlayerId];
    if (playerState) {
      playerState.lastUpdatedAtMs = now;
    }
  }) as MatchState<G>;
}

function computeActivePlayerWindowMs(
  time: ChessClockContext | DynamicClockContext,
  now: number,
): number {
  const accumulated = time.activePlayerAccumulatedMs ?? 0;
  if (!time.running) return accumulated;
  if (time.startedAtMs == null) return accumulated;
  return accumulated + Math.max(0, now - time.startedAtMs);
}

export function checkTimeout<G extends object>(
  state: MatchState<G>,
  playerId: string,
  now: number = Date.now(),
): "first" | "second" | null {
  const time = state.ctx.time;
  if (time.mode !== "chess" && time.mode !== "dynamic") return null;

  const playerState = time.players[playerId] as
    | ChessClockPlayerState
    | DynamicClockPlayerState
    | undefined;
  if (!playerState) return null;

  const maxDecisionTimeMs = time.config.maxDecisionTimeMs;
  const isActivePlayer = time.activePlayerID === playerId;
  const windowMs = isActivePlayer ? computeActivePlayerWindowMs(time, now) : 0;
  const decisionCapExceeded =
    maxDecisionTimeMs != null && isActivePlayer && windowMs > maxDecisionTimeMs;

  if (!playerState.isInNegativeTime && !decisionCapExceeded) return null;
  return playerState.timeoutCount >= 1 ? "second" : "first";
}

export function resetPlayerTimeAfterSkip<G extends object>(
  state: MatchState<G>,
  playerId: string,
  overrideResetMs?: number,
  options: { incrementTimeoutCount?: boolean } = {},
): MatchState<G> {
  const { incrementTimeoutCount = true } = options;
  const time = state.ctx.time;
  if (time.mode !== "chess" && time.mode !== "dynamic") return state;
  const resetMs = overrideResetMs ?? time.config.resetTimeOnSkipMs;

  return create(state, (draft) => {
    const draftTime = draft.ctx.time;
    if (draftTime.mode !== "chess" && draftTime.mode !== "dynamic") return;

    const playerState = draftTime.players[playerId];
    if (!playerState) return;

    playerState.reserveMsRemaining = resetMs;
    playerState.isInNegativeTime = false;
    if (incrementTimeoutCount) {
      playerState.timeoutCount++;
    }

    if (draftTime.activePlayerID === playerId) {
      draftTime.activePlayerAccumulatedMs = 0;
    }
  }) as MatchState<G>;
}

export function updateClockForWaitingState<G extends object>(
  state: MatchState<G>,
  now: number,
  previousActivePlayerID?: string,
): MatchState<G> {
  if (state.ctx.time.mode === "none") return state;

  return create(state, (draft) => {
    const time = draft.ctx.time;
    if (time.mode === "none") return;

    if (draft.ctx.status.gameEnded) {
      time.running = false;
      time.pausedReason = "GAME_ENDED";
      return;
    }

    const clockTarget = draft.ctx.status.activePlayer as unknown as string | undefined;
    if (clockTarget) {
      time.activePlayerID = clockTarget;
      time.startedAtMs = now;
      time.running = true;
      time.pausedReason = undefined;

      if (time.mode === "priority") {
        time.prioritySeq++;
        const windowMs = time.config.perPriorityWindowMs;
        time.activeWindow = {
          playerID: clockTarget,
          prioritySeq: time.prioritySeq,
          windowMs,
          deadlineMs: now + windowMs,
        };
      }
    } else {
      time.running = false;
      time.pausedReason = "ENGINE_RESOLVING";
    }

    if (
      (time.mode === "chess" || time.mode === "dynamic") &&
      time.activePlayerID !== previousActivePlayerID
    ) {
      time.activePlayerAccumulatedMs = 0;

      if (previousActivePlayerID) {
        const outgoingState = time.players[previousActivePlayerID];
        if (outgoingState?.isInNegativeTime) {
          outgoingState.isInNegativeTime = false;
          outgoingState.timeoutCount++;
          outgoingState.reserveMsRemaining = time.config.resetTimeOnSkipMs;
        }
      }
    }
  }) as MatchState<G>;
}

export function awardDynamicActionBonus<G extends object>(
  state: MatchState<G>,
  playerId: string,
): MatchState<G> {
  if (state.ctx.time.mode !== "dynamic") return state;

  return create(state, (draft) => {
    if (draft.ctx.time.mode !== "dynamic") return;
    const playerState = draft.ctx.time.players[playerId];
    if (!playerState) return;
    playerState.actionBonusMsGranted += draft.ctx.time.config.perActionBonusMs;
    playerState.reserveMsRemaining = Math.min(
      draft.ctx.time.config.reserveCapMs,
      playerState.reserveMsRemaining + draft.ctx.time.config.perActionBonusMs,
    );
  }) as MatchState<G>;
}

export function getOpponentId<G extends object>(
  state: MatchState<G>,
  playerId: string,
): PlayerId | undefined {
  return state.ctx.playerIds.find((id) => String(id) !== playerId);
}
