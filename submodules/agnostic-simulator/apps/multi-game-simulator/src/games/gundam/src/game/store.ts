import type { EngineInteractionView } from "@tcg/protocol";

import type { EngineAdapter, TurnTaggedLogEntry, TurnTaggedMoveLog } from "./adapter.ts";
import type { BoardProjection } from "./types.ts";

export interface GameSnapshot {
  readonly view: BoardProjection;
  readonly interactionView: EngineInteractionView;
  readonly logEntries: readonly TurnTaggedLogEntry[];
  readonly moveLogs: readonly TurnTaggedMoveLog[];
}

export interface GameStore {
  readonly getSnapshot: () => GameSnapshot;
  readonly subscribe: (listener: () => void) => () => void;
  readonly dispose: () => void;
}

export function createGameStore(adapter: EngineAdapter): GameStore {
  let snapshot: GameSnapshot = computeSnapshot(adapter);
  const listeners = new Set<() => void>();

  const unsubscribeAdapter = adapter.subscribe(() => {
    snapshot = computeSnapshot(adapter);
    for (const listener of listeners) listener();
  });

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      // React's StrictMode mounts components twice in dev, which causes
      // `useSyncExternalStore` to (un)subscribe in between. Refresh the
      // snapshot on every (re)subscribe so a consumer that attached after a
      // state update that landed during the unmounted window still sees the
      // current engine state.
      snapshot = computeSnapshot(adapter);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispose: () => {
      unsubscribeAdapter();
      listeners.clear();
    },
  };
}

function computeSnapshot(adapter: EngineAdapter): GameSnapshot {
  return {
    view: adapter.view(),
    interactionView: adapter.interactionView(),
    logEntries: adapter.logEntries(),
    moveLogs: adapter.moveLogs(),
  };
}
