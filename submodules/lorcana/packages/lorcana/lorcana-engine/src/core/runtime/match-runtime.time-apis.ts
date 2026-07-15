/**
 * MatchRuntime Time API Factories
 */

import type { Draft } from "mutative";
import type { MatchState, ClockPauseReason } from "./types";
import type { TimeOperationsAPI, TimeQueryAPI } from "./match-runtime.types";

export function createTimeQueryAPI(state: MatchState): TimeQueryAPI {
  return {
    getRemainingTime: (playerId) => {
      if (state.ctx.time.mode === "none") return Infinity;
      return state.ctx.time.players[playerId]?.reserveMsRemaining || 0;
    },
  };
}

export function createTimeOperationsForDraft(draft: Draft<MatchState>): TimeOperationsAPI {
  return {
    getRemainingTime: (playerId) => {
      if (draft.ctx.time.mode === "none") return Infinity;
      return draft.ctx.time.players[playerId]?.reserveMsRemaining || 0;
    },
    pause: (reason) => {
      if (draft.ctx.time.mode !== "none") {
        draft.ctx.time.running = false;
        draft.ctx.time.pausedReason = reason as ClockPauseReason;
      }
    },
    resume: () => {
      if (draft.ctx.time.mode !== "none") {
        draft.ctx.time.running = true;
        draft.ctx.time.pausedReason = undefined;
        draft.ctx.time.startedAtMs = Date.now();
      }
    },
  };
}
