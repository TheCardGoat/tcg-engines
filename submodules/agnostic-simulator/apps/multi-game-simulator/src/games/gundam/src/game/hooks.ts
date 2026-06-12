import { useCallback, useSyncExternalStore } from "react";

import type { TurnTaggedLogEntry, TurnTaggedMoveLog } from "./adapter.ts";
import { useGundamGame } from "./context.tsx";
import type { GameSnapshot } from "./store.ts";
import type {
  BoardProjection,
  MoveName,
  PartialInput,
  PendingState,
  SubmitOutcome,
  ViewerId,
  ZoneId,
} from "./types.ts";

function useGameSnapshot(): GameSnapshot {
  const { store } = useGundamGame();
  // getSnapshot doubles as the server snapshot — the store is a pure
  // in-memory projection of engine state, identical on server and
  // client when both are initialized from the same MatchSnapshot.
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

function usePendingState(): PendingState {
  const { pending } = useGundamGame();
  return useSyncExternalStore(pending.subscribe, pending.getSnapshot, pending.getSnapshot);
}

export function useBoardProjection(): BoardProjection {
  return useGameSnapshot().view;
}

export function useStatus(): BoardProjection["status"] {
  return useGameSnapshot().view.status;
}

export function useZone(zoneId: ZoneId): BoardProjection["zones"]["zones"][string] | undefined {
  return useGameSnapshot().view.zones.zones[zoneId];
}

export function useViewerId(): ViewerId {
  return useGundamGame().viewerId;
}

export function useInteractionView(): GameSnapshot["interactionView"] {
  return useGameSnapshot().interactionView;
}

export function useLogEntries(): readonly TurnTaggedLogEntry[] {
  return useGameSnapshot().logEntries;
}

export function useMoveLogs(): readonly TurnTaggedMoveLog[] {
  return useGameSnapshot().moveLogs;
}

export interface PendingMoveControls {
  readonly state: PendingState;
  readonly start: (move: MoveName, seed?: PartialInput) => PendingState;
  readonly startForCard: (move: MoveName, cardId: string) => PendingState;
  readonly provide: (key: string, value: unknown) => PendingState;
  readonly provideTarget: (
    step: Extract<PendingState, { status: "collecting" }>["steps"][number],
    cardId: string,
  ) => PendingState;
  readonly confirm: () => SubmitOutcome | null;
  readonly cancel: () => void;
}

export function usePending(): PendingMoveControls {
  const { pending } = useGundamGame();
  const state = usePendingState();

  const start = useCallback(
    (move: MoveName, seed?: PartialInput) => pending.start(move, seed),
    [pending],
  );
  const startForCard = useCallback(
    (move: MoveName, cardId: string) => pending.startForCard(move, cardId),
    [pending],
  );
  const provide = useCallback(
    (key: string, value: unknown) => pending.provide(key, value),
    [pending],
  );
  const provideTarget = useCallback(
    (step: Extract<PendingState, { status: "collecting" }>["steps"][number], cardId: string) =>
      pending.provideTarget(step, cardId),
    [pending],
  );
  const confirm = useCallback(() => pending.confirm(), [pending]);
  const cancel = useCallback(() => pending.cancel(), [pending]);

  return { state, start, startForCard, provide, provideTarget, confirm, cancel };
}
