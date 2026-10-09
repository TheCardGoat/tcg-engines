import type { Action } from "@tcg/op-types";
import type { MatchState } from "../types.ts";

type BoundAction = Action & {
  delayedIdentity?: {
    chainId: string;
    sourceId: string;
    sourceGeneration: number;
    previous: Record<string, number>;
  };
};

/** Runtime-only identity: card definitions remain independent of match instances. */
export function bindDelayedAction(
  state: MatchState,
  action: Action,
  sourceId: string,
  previousIds: string[] = [],
  inheritedSourceGeneration?: number,
  chainId = `delayed-${++state.idCounter}`,
): Action {
  const binding = {
    chainId,
    sourceId,
    sourceGeneration: inheritedSourceGeneration ?? state.cards[sourceId]!.zoneChangeCounter,
    previous: Object.fromEntries(
      previousIds.flatMap((id) => {
        const card = state.cards[id];
        return card ? [[id, card.zoneChangeCounter]] : [];
      }),
    ),
  };
  const bind = (child: Action) =>
    bindDelayedAction(state, child, sourceId, previousIds, binding.sourceGeneration, chainId);
  const result: BoundAction = { ...action, delayedIdentity: binding };
  if ("actions" in result) result.actions = result.actions.map(bind);
  if ("thenActions" in result && result.thenActions)
    result.thenActions = result.thenActions.map(bind);
  if (result.action === "conditional") {
    result.whenTrue = result.whenTrue.map(bind);
    if (result.whenFalse) result.whenFalse = result.whenFalse.map(bind);
  }
  return result;
}

/** Missing metadata is a legacy snapshot; retain its historical ID-only behavior. */
export function delayedTargetIsCurrent(
  state: MatchState,
  action: BoundAction,
  id: string,
): boolean {
  const binding = action.delayedIdentity;
  if (!binding) return true;
  const generation =
    "target" in action && action.target?.self && id === binding.sourceId
      ? binding.sourceGeneration
      : "previousActionTargets" in action && action.previousActionTargets
        ? binding.previous[id]
        : undefined;
  return generation === undefined || state.cards[id]?.zoneChangeCounter === generation;
}

export function rebindDelayedPrevious(
  state: MatchState,
  action: BoundAction,
  ids: string[],
): Action {
  const binding = action.delayedIdentity;
  return binding
    ? bindDelayedAction(
        state,
        action,
        binding.sourceId,
        ids,
        binding.sourceGeneration,
        binding.chainId,
      )
    : action;
}

export function delayedActionChain(action: BoundAction): string | undefined {
  return action.delayedIdentity?.chainId;
}

export function delayedSourceIsCurrent(state: MatchState, action: BoundAction): boolean {
  const binding = action.delayedIdentity;
  return !binding || state.cards[binding.sourceId]?.zoneChangeCounter === binding.sourceGeneration;
}

function withDelayedChain(action: BoundAction, chainId: string): Action {
  const result: BoundAction = {
    ...action,
    ...(action.delayedIdentity && { delayedIdentity: { ...action.delayedIdentity, chainId } }),
  };
  const update = (child: Action) => withDelayedChain(child, chainId);
  if ("actions" in result) result.actions = result.actions.map(update);
  if ("thenActions" in result && result.thenActions)
    result.thenActions = result.thenActions.map(update);
  if (result.action === "conditional") {
    result.whenTrue = result.whenTrue.map(update);
    if (result.whenFalse) result.whenFalse = result.whenFalse.map(update);
  }
  return result;
}

export function scheduledActions(
  state: MatchState,
  actions: BoundAction[],
  sourceId: string,
  previousIds?: string[],
): Action[] {
  const chainId = `delayed-${++state.idCounter}`;
  return actions.map((action) =>
    action.delayedIdentity
      ? withDelayedChain(action, chainId)
      : bindDelayedAction(state, action, sourceId, previousIds, undefined, chainId),
  );
}
