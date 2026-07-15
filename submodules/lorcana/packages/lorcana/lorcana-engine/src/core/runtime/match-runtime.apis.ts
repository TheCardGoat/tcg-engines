/**
 * MatchRuntime API Factories
 *
 * Factory functions for creating runtime API objects.
 */

import type { Draft } from "mutative";
import type { FilteredMatchView, GameEvent, MatchState } from "./types";
import type { EventAPI, GameEndResult } from "./match-runtime.types";
import type { CardQueryAPI, RuntimeCardDeriver } from "./card-runtime";
import { createCardQueryAPI } from "./card-runtime";
import type { MatchStaticResources } from "./static-resources";
import type { BaseCardDefinition, BaseCardMeta } from "./card-contracts";
import type { LorcanaG } from "../../types/runtime-state";
import type { StateScopedValueCache } from "./state-scoped-value-cache";

// Re-export from sub-modules
export { createTimeQueryAPI, createTimeOperationsForDraft } from "./match-runtime.time-apis";
export { createRandomAPIForDraft } from "./match-runtime.random-apis";
export { createZoneQueryAPI } from "./match-runtime.zone-apis";

type ReadonlyMatchLike = MatchState | FilteredMatchView;

export function canPlayerTakeActions(state: ReadonlyMatchLike, playerId: string): boolean {
  return state.ctx.priority.windowOpen && state.ctx.priority.holder === playerId;
}

// =============================================================================
// Event API
// =============================================================================

export function createEventAPI(
  emitGameEvent: (event: GameEvent) => void,
  draft?: Draft<MatchState>,
  gameEndTracker?: { ended: boolean; result?: GameEndResult },
): EventAPI {
  return {
    emit: (event) => {
      if (draft) {
        // Events are buffered outside the draft and committed only on successful execution.
      }
      emitGameEvent(event);
    },
    endGame: (result) => {
      if (draft) {
        draft.ctx.status.gameEnded = true;
        draft.ctx.status.winner = result.winner;
        draft.ctx.status.reason = result.reason;
        if (draft.ctx.time.mode !== "none") {
          draft.ctx.time.running = false;
          draft.ctx.time.pausedReason = "GAME_ENDED";
        }
        if (gameEndTracker) {
          gameEndTracker.ended = true;
          gameEndTracker.result = result;
        }
      }
    },
  };
}

// =============================================================================
// Card Query API
// =============================================================================

export function createCardQueryAPIForState(
  state: ReadonlyMatchLike | Draft<MatchState>,
  staticResources: MatchStaticResources,
  deriveRuntimeCard: RuntimeCardDeriver,
  actorPlayerId?: string,
  runtimeCardCache?: StateScopedValueCache<unknown>,
  cacheViews: boolean = true,
): CardQueryAPI {
  return createCardQueryAPI(state as unknown as MatchState, staticResources, {
    actorPlayerId,
    deriveRuntimeCard,
    runtimeCardCache,
    cacheViews,
  }) as CardQueryAPI;
}
