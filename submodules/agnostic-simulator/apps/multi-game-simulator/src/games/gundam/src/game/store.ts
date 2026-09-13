import type { EngineInteractionView } from "@tcg/protocol";

import type {
  EngineAdapter,
  TurnTaggedLogEntry,
  TurnTaggedMoveLog,
  TurnTaggedPacketAnimation,
} from "./adapter.ts";
import type { BoardProjection } from "./types.ts";

export interface GameSnapshot {
  readonly view: BoardProjection;
  readonly interactionView: EngineInteractionView;
  readonly logEntries: readonly TurnTaggedLogEntry[];
  readonly moveLogs: readonly TurnTaggedMoveLog[];
  readonly acceptedAnimations: readonly TurnTaggedPacketAnimation[];
  readonly didAnimationHistoryReset: boolean;
}

export interface GameStore {
  readonly getSnapshot: () => GameSnapshot;
  readonly subscribe: (listener: () => void) => () => void;
  readonly dispose: () => void;
}

export function createGameStore(adapter: EngineAdapter): GameStore {
  // MatchRuntime exposes its packet history as a readonly view over a mutable
  // array. Keep an owned snapshot here: retaining the runtime array by
  // reference makes both sides of the next comparison include newly pushed
  // records, so every accepted animation is incorrectly treated as old.
  let animationHistory = [...adapter.packetAnimations()];
  let snapshot: GameSnapshot = computeSnapshot(adapter, [], false);
  const listeners = new Set<() => void>();

  const unsubscribeAdapter = adapter.subscribe(() => {
    const nextAnimationHistory = [...adapter.packetAnimations()];
    const nextView = adapter.view();
    const animationDelta = itemsAfterPreviousSnapshot(
      nextAnimationHistory,
      animationHistory,
      animationRecordKey,
    );
    animationHistory = nextAnimationHistory;
    snapshot = computeSnapshot(
      adapter,
      animationDelta.newItems,
      didAuthoritativeHistoryReset(
        snapshot.view.stateID,
        nextView.stateID,
        animationDelta.didReset,
      ),
      nextView,
    );
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
      snapshot = computeSnapshot(
        adapter,
        snapshot.acceptedAnimations,
        snapshot.didAnimationHistoryReset,
      );
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

function computeSnapshot(
  adapter: EngineAdapter,
  acceptedAnimations: readonly TurnTaggedPacketAnimation[],
  didAnimationHistoryReset: boolean,
  view = adapter.view(),
): GameSnapshot {
  return {
    view,
    interactionView: adapter.interactionView(),
    logEntries: adapter.logEntries(),
    moveLogs: adapter.moveLogs(),
    acceptedAnimations,
    didAnimationHistoryReset,
  };
}

export function didAuthoritativeHistoryReset(
  previousStateID: number,
  nextStateID: number,
  didAnimationHistoryReset: boolean,
): boolean {
  return didAnimationHistoryReset || nextStateID < previousStateID;
}

interface SnapshotDelta<T> {
  readonly newItems: readonly T[];
  readonly didReset: boolean;
}

export function itemsAfterPreviousSnapshot<T>(
  items: readonly T[],
  previousItems: readonly T[],
  itemKey: (item: T) => string,
): SnapshotDelta<T> {
  if (items.length < previousItems.length) return { newItems: [], didReset: true };

  if (previousItems.length === 0) return { newItems: items, didReset: false };

  // Runtime packet history is append-only during normal play. Compare the
  // complete ordered prefix instead of anchoring on one animation id: phase
  // ids can repeat within a turn, so a first-match lookup rewinds the delta
  // and replays the intervening combat packets.
  const previousIsPrefix = previousItems.every((previous, index) => {
    const current = items[index];
    return current !== undefined && itemKey(previous) === itemKey(current);
  });
  if (previousIsPrefix) {
    return { newItems: items.slice(previousItems.length), didReset: false };
  }

  // Retain support for a rolling history window by finding the largest
  // ordered suffix/prefix overlap. This path is exceptional; the append-only
  // prefix above keeps ordinary state updates linear.
  const maximumOverlap = Math.min(items.length, previousItems.length);
  for (let overlap = maximumOverlap; overlap > 0; overlap -= 1) {
    const previousStart = previousItems.length - overlap;
    let matches = true;
    for (let index = 0; index < overlap; index += 1) {
      const previous = previousItems[previousStart + index];
      const current = items[index];
      if (!previous || !current || itemKey(previous) !== itemKey(current)) {
        matches = false;
        break;
      }
    }
    if (matches) {
      return { newItems: items.slice(overlap), didReset: false };
    }
  }

  return {
    newItems: items.length > previousItems.length ? items.slice(previousItems.length) : items,
    didReset: false,
  };
}

function animationRecordKey(entry: TurnTaggedPacketAnimation): string {
  return entry.plan?.id ?? entry.animation?.id ?? "invalid-animation";
}
