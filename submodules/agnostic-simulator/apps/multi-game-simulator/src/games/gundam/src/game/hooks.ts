import { useSyncExternalStore } from "react";

import type {
  TurnTaggedLogEntry,
  TurnTaggedMoveLog,
  TurnTaggedPacketAnimation,
} from "./adapter.ts";
import { useGundamGame } from "./context.tsx";
import { useGundamPresentation } from "./presentation-context.tsx";
import type { GameSnapshot } from "./store.ts";
import type { BoardProjection, ViewerId, ZoneId } from "./types.ts";

function useGameSnapshot(): GameSnapshot {
  const { store } = useGundamGame();
  // getSnapshot doubles as the server snapshot — the store is a pure
  // in-memory projection of engine state, identical on server and
  // client when both are initialized from the same MatchSnapshot.
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

export function useBoardProjection(): BoardProjection {
  const presentation = useGundamPresentation();
  const authoritative = useGameSnapshot().view;
  return presentation ?? authoritative;
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

export function useAcceptedAnimations(): {
  readonly records: readonly TurnTaggedPacketAnimation[];
  readonly didHistoryReset: boolean;
} {
  const snapshot = useGameSnapshot();
  return {
    records: snapshot.acceptedAnimations,
    didHistoryReset: snapshot.didAnimationHistoryReset,
  };
}
