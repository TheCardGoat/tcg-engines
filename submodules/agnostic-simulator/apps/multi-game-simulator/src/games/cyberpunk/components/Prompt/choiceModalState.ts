import { useSyncExternalStore } from "react";
import type { Side } from "../../engine";

type ChoiceModalMinimizeState = {
  requestId: string | null;
  minimized: boolean;
  open: boolean;
};

const choiceModalMinimizeState = new Map<Side, ChoiceModalMinimizeState>();
const choiceModalMinimizeListeners = new Set<() => void>();
const DEFAULT_MINIMIZE_STATE: ChoiceModalMinimizeState = {
  requestId: null,
  minimized: false,
  open: false,
};

function emitChoiceModalMinimizeChange() {
  for (const listener of choiceModalMinimizeListeners) {
    listener();
  }
}

function subscribeChoiceModalMinimize(listener: () => void): () => void {
  choiceModalMinimizeListeners.add(listener);
  return () => choiceModalMinimizeListeners.delete(listener);
}

function choiceModalSnapshot(side: Side): ChoiceModalMinimizeState {
  return choiceModalMinimizeState.get(side) ?? DEFAULT_MINIMIZE_STATE;
}

export function setChoiceModalMinimized(side: Side, requestId: string, minimized: boolean) {
  const current = choiceModalSnapshot(side);
  const next = {
    requestId,
    minimized,
    open: minimized ? false : current.requestId === requestId && current.open,
  };
  if (
    current.requestId === next.requestId &&
    current.minimized === next.minimized &&
    current.open === next.open
  ) {
    return;
  }
  choiceModalMinimizeState.set(side, next);
  emitChoiceModalMinimizeChange();
}

export function setChoiceModalOpen(side: Side, requestId: string, open: boolean) {
  const current = choiceModalSnapshot(side);
  const next = { requestId, minimized: open ? false : current.minimized, open };
  if (
    current.requestId === next.requestId &&
    current.minimized === next.minimized &&
    current.open === next.open
  ) {
    return;
  }
  choiceModalMinimizeState.set(side, next);
  emitChoiceModalMinimizeChange();
}

export function useChoiceModalMinimized(side: Side, requestId: string | undefined): boolean {
  const state = useSyncExternalStore(
    subscribeChoiceModalMinimize,
    () => choiceModalSnapshot(side),
    () => DEFAULT_MINIMIZE_STATE,
  );
  return Boolean(requestId && state.requestId === requestId && state.minimized);
}

export function useChoiceModalOpen(side: Side, requestId: string | undefined): boolean {
  const state = useSyncExternalStore(
    subscribeChoiceModalMinimize,
    () => choiceModalSnapshot(side),
    () => DEFAULT_MINIMIZE_STATE,
  );
  return Boolean(requestId && state.requestId === requestId && state.open);
}
