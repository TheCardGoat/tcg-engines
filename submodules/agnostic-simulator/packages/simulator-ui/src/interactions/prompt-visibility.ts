import { useSyncExternalStore } from "react";

type PromptMinimizeState = {
  requestId: string | null;
  minimized: boolean;
  open: boolean;
};

type PromptExpandState = {
  requestId: string | null;
  expanded: boolean;
};

/** Isolated per consumer; keys are a game-owned seat/match scope and request id. */
export function createPromptVisibilityStore<Scope extends string = string>() {
  const promptMinimizeState = new Map<Scope, PromptMinimizeState>();
  const promptExpandState = new Map<Scope, PromptExpandState>();
  const promptMinimizeListeners = new Set<() => void>();
  const DEFAULT_MINIMIZE_STATE: PromptMinimizeState = {
    requestId: null,
    minimized: false,
    open: false,
  };
  const DEFAULT_EXPAND_STATE: PromptExpandState = {
    requestId: null,
    expanded: false,
  };

  function emitPromptMinimizeChange() {
    for (const listener of promptMinimizeListeners) {
      listener();
    }
  }

  function subscribePromptMinimize(listener: () => void): () => void {
    promptMinimizeListeners.add(listener);
    return () => promptMinimizeListeners.delete(listener);
  }

  function promptSnapshot(side: Scope): PromptMinimizeState {
    return promptMinimizeState.get(side) ?? DEFAULT_MINIMIZE_STATE;
  }

  function setPromptMinimized(side: Scope, requestId: string, minimized: boolean) {
    const current = promptSnapshot(side);
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
    promptMinimizeState.set(side, next);
    emitPromptMinimizeChange();
  }

  function setPromptOpen(side: Scope, requestId: string, open: boolean) {
    const current = promptSnapshot(side);
    const next = { requestId, minimized: open ? false : current.minimized, open };
    if (
      current.requestId === next.requestId &&
      current.minimized === next.minimized &&
      current.open === next.open
    ) {
      return;
    }
    promptMinimizeState.set(side, next);
    emitPromptMinimizeChange();
  }

  function usePromptMinimized(side: Scope, requestId: string | undefined): boolean {
    const state = useSyncExternalStore(
      subscribePromptMinimize,
      () => promptSnapshot(side),
      () => DEFAULT_MINIMIZE_STATE,
    );
    return Boolean(requestId && state.requestId === requestId && state.minimized);
  }

  function usePromptOpen(side: Scope, requestId: string | undefined): boolean {
    const state = useSyncExternalStore(
      subscribePromptMinimize,
      () => promptSnapshot(side),
      () => DEFAULT_MINIMIZE_STATE,
    );
    return Boolean(requestId && state.requestId === requestId && state.open);
  }

  function usePromptExplicitlyClosed(side: Scope, requestId: string | undefined): boolean {
    const state = useSyncExternalStore(
      subscribePromptMinimize,
      () => promptSnapshot(side),
      () => DEFAULT_MINIMIZE_STATE,
    );
    return Boolean(requestId && state.requestId === requestId && !state.open && !state.minimized);
  }

  function setPromptExpanded(side: Scope, requestId: string, expanded: boolean) {
    const current = promptExpandState.get(side) ?? DEFAULT_EXPAND_STATE;
    if (current.requestId === requestId && current.expanded === expanded) {
      return;
    }
    promptExpandState.set(side, { requestId, expanded });
    emitPromptMinimizeChange();
  }

  /** Whether the pending-effect chooser renders its full list (default: compact card row). */
  function usePromptExpanded(side: Scope, requestId: string | undefined): boolean {
    const state = useSyncExternalStore(
      subscribePromptMinimize,
      () => promptExpandState.get(side) ?? DEFAULT_EXPAND_STATE,
      () => DEFAULT_EXPAND_STATE,
    );
    return Boolean(requestId && state.requestId === requestId && state.expanded);
  }

  function resetPromptStateForTests() {
    promptMinimizeState.clear();
    promptExpandState.clear();
    emitPromptMinimizeChange();
  }

  return {
    setPromptMinimized,
    setPromptOpen,
    usePromptMinimized,
    usePromptOpen,
    usePromptExplicitlyClosed,
    setPromptExpanded,
    usePromptExpanded,
    resetPromptStateForTests,
  };
}
