/**
 * MatchRuntime Flow Resolution
 *
 * Flow and phase transition helpers.
 */

import type { Draft } from "mutative";
import type { MatchState } from "./types";
import type {
  RuntimeFlowDefinition,
  RuntimeLifecycleContext,
  RuntimeLifecycleHook,
  RuntimePhaseDefinition,
  GameEndResult,
} from "./match-runtime.types";
export type FlowLifecycleContextFactory = (
  draft: Draft<MatchState>,
  gameEnded: boolean,
  playerId?: string,
) => RuntimeLifecycleContext;
export type FlowLifecycleContextFactoryWithDerived = (
  draft: Draft<MatchState>,
  gameEnded: boolean,
  playerId?: string,
) => RuntimeLifecycleContext;

// =============================================================================
// Phase Resolution
// =============================================================================

export function getCurrentPhaseDefinition(
  flow: RuntimeFlowDefinition | undefined,
  currentPhaseId: string | undefined,
  currentGameSegmentId?: string,
): RuntimePhaseDefinition | undefined {
  if (!flow || !currentPhaseId) {
    return undefined;
  }

  // Handle gameSegments structure
  if (flow.gameSegments) {
    const gameSegmentId = currentGameSegmentId || flow.initialGameSegment;
    const gameSegment = gameSegmentId ? flow.gameSegments[gameSegmentId] : undefined;
    if (gameSegment?.turn?.phases) {
      return gameSegment.turn.phases[currentPhaseId];
    }
  }

  return undefined;
}

export function isMoveAllowedByFlow(
  flow: RuntimeFlowDefinition | undefined,
  currentPhaseId: string | undefined,
  moveId: string,
  currentGameSegmentId?: string,
): boolean {
  const currentPhase = getCurrentPhaseDefinition(flow, currentPhaseId, currentGameSegmentId);
  if (!currentPhase?.validMoves) {
    return true;
  }

  return currentPhase.validMoves.includes(moveId);
}

export function getFlowDisallowReason(
  flow: RuntimeFlowDefinition | undefined,
  currentPhaseId: string | undefined,
  moveId: string,
  currentGameSegmentId?: string,
): string {
  const currentPhase = getCurrentPhaseDefinition(flow, currentPhaseId, currentGameSegmentId);
  if (!currentPhase?.validMoves) {
    return `Move '${moveId}' is not legal in the current flow state`;
  }

  return `Move '${moveId}' is not legal in phase '${currentPhase.id}'`;
}

export function resolveFlowTransitionsOnDraft(
  draft: Draft<MatchState>,
  flow: RuntimeFlowDefinition | undefined,
  buildLifecycleContext: FlowLifecycleContextFactoryWithDerived,
  options?: {
    bootstrap?: boolean;
    gameEnded?: boolean;
  },
): void {
  if (!flow?.gameSegments) {
    return;
  }

  const maxTransitions = 20;
  const runBootstrap = options?.bootstrap ?? false;
  let resolvedGameEnded = options?.gameEnded ?? false;

  const getCurrentSegmentId = (): string | undefined =>
    draft.ctx.status.gameSegment ?? flow.initialGameSegment;
  const getCurrentSegment = (segmentId: string | undefined) =>
    segmentId ? flow.gameSegments[segmentId] : undefined;
  const getCurrentTurn = (segmentId: string | undefined) => getCurrentSegment(segmentId)?.turn;
  const getCurrentPhase = (segmentId: string | undefined, phaseId: string | undefined) =>
    getCurrentSegment(segmentId)?.turn?.phases?.[phaseId ?? ""];

  const invoke = (hook: RuntimeLifecycleHook | undefined, playerId?: string) => {
    resolvedGameEnded = resolvedGameEnded || draft.ctx.status.gameEnded;
    invokeLifecycleHook(draft, hook, buildLifecycleContext, resolvedGameEnded, playerId);
  };

  if (runBootstrap) {
    const segmentId = getCurrentSegmentId();
    const segment = getCurrentSegment(segmentId);
    const turn = getCurrentTurn(segmentId);
    const phase = getCurrentPhase(segmentId, draft.ctx.status.phase);

    invoke(segment?.onEnter);
    invoke(turn?.onBegin);
    invoke(phase?.onEnter);
  }

  for (let transitionCount = 0; transitionCount < maxTransitions; transitionCount++) {
    const currentGameSegmentId = getCurrentSegmentId();
    const currentSegment = getCurrentSegment(currentGameSegmentId);
    const currentTurn = getCurrentTurn(currentGameSegmentId);
    const currentPhaseId = draft.ctx.status.phase;
    const currentPhase = getCurrentPhase(currentGameSegmentId, currentPhaseId);

    if (!currentPhase?.endIf) {
      return;
    }

    resolvedGameEnded = resolvedGameEnded || draft.ctx.status.gameEnded;

    const shouldEnd = currentPhase.endIf(draft as MatchState);
    if (!shouldEnd) {
      return;
    }

    const nextPhaseId =
      typeof currentPhase.nextPhase === "function"
        ? currentPhase.nextPhase(draft as MatchState)
        : currentPhase.nextPhase;

    if (nextPhaseId) {
      invoke(currentPhase.onExit);
      draft.ctx.status.phase = nextPhaseId;
      const nextPhase = getCurrentPhase(currentGameSegmentId, nextPhaseId);
      invoke(nextPhase?.onEnter);
      continue;
    }

    if (currentSegment?.next) {
      const nextSegmentId = currentSegment.next;
      const nextSegment = flow.gameSegments[nextSegmentId];
      const nextInitialPhase = nextSegment?.turn?.initialPhase;
      if (nextSegmentId && nextInitialPhase) {
        invoke(currentPhase.onExit);
        if (currentTurn?.onEnd) {
          invoke(currentTurn.onEnd);
        }
        invoke(currentSegment.onExit);

        draft.ctx.status.gameSegment = nextSegmentId;
        draft.ctx.status.phase = nextInitialPhase;

        invoke(nextSegment?.onEnter);
        invoke(nextSegment?.turn?.onBegin);

        const nextSegmentInitialPhase = nextSegment?.turn?.phases?.[nextInitialPhase];
        invoke(nextSegmentInitialPhase?.onEnter);

        continue;
      }
    }

    return;
  }

  throw new Error("Flow transition resolution exceeded the maximum number of transitions");
}

function invokeLifecycleHook(
  draft: Draft<MatchState>,
  hook: RuntimeLifecycleHook | undefined,
  buildLifecycleContext: FlowLifecycleContextFactoryWithDerived,
  gameEnded: boolean,
  playerId?: string,
): void {
  if (!hook) {
    return;
  }

  const callbackContext = buildLifecycleContext(
    draft,
    gameEnded,
    playerId,
  ) as RuntimeLifecycleContext;
  const hookContext = callbackContext as unknown as MatchState & RuntimeLifecycleContext;
  const invoke = hook as (ctx: MatchState | RuntimeLifecycleContext) => unknown;
  // Return value is intentionally ignored; mutate-by-side-effect is canonical.
  invoke(hookContext);
}

// =============================================================================
// Game End Resolution
// =============================================================================

export function checkGameEndCondition(
  draft: Draft<MatchState>,
  flow: RuntimeFlowDefinition | undefined,
): GameEndResult | undefined {
  if (!flow) {
    return undefined;
  }

  const currentGameSegmentId = draft.ctx.status.gameSegment;

  // Handle gameSegments structure
  if (flow.gameSegments) {
    const gameSegmentId = currentGameSegmentId || flow.initialGameSegment;
    const gameSegment = gameSegmentId ? flow.gameSegments[gameSegmentId] : undefined;
    if (gameSegment?.endIf) {
      return gameSegment.endIf(draft as MatchState);
    }
  }

  return undefined;
}

export function applyGameEndToDraft(draft: Draft<MatchState>, result: GameEndResult): void {
  draft.ctx.status.gameEnded = true;
  draft.ctx.status.winner = result.winner;
  draft.ctx.status.reason = result.reason;

  // Pause clocks
  if (draft.ctx.time.mode !== "none") {
    draft.ctx.time.running = false;
    draft.ctx.time.pausedReason = "GAME_ENDED";
  }
}
