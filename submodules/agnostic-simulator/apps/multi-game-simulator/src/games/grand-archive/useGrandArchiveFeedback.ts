import { useLayoutEffect, useState } from "react";
import {
  reconcileGrandArchiveFeedback,
  type GrandArchiveFeedbackSnapshot,
  type GrandArchiveFeedbackState,
  type GrandArchiveFeedbackCue,
} from "./grand-archive-feedback";

export const GRAND_ARCHIVE_FEEDBACK_HISTORY_LIMIT = 200;

/** A latest-batch feed. Scene reconciliation never waits for animation completion. */
export function useGrandArchiveFeedback(
  snapshot: GrandArchiveFeedbackSnapshot,
  resetKey: string | number = 0,
): GrandArchiveFeedbackState & {
  readonly history: readonly GrandArchiveFeedbackCue[];
  readonly generation: number;
} {
  const viewerId = snapshot.table.seats.find((seat) => seat.perspective === "bottom")?.id;
  // Hotseat/viewer switches are privacy boundaries even when version and match ID stay equal.
  const viewerResetKey = JSON.stringify([resetKey, viewerId]);
  const [state, setState] = useState<
    GrandArchiveFeedbackState & {
      readonly history: readonly GrandArchiveFeedbackCue[];
      readonly generation: number;
    }
  >(() => ({
    ...reconcileGrandArchiveFeedback(undefined, snapshot, viewerResetKey),
    history: [],
    generation: 0,
  }));
  useLayoutEffect(() => {
    setState((previous) => {
      if (previous.snapshot === snapshot && previous.resetKey === viewerResetKey) return previous;
      const next = reconcileGrandArchiveFeedback(previous, snapshot, viewerResetKey);
      const reset =
        previous.resetKey !== viewerResetKey ||
        (snapshot.table.status.stateVersion ?? 0) <
          (previous.snapshot.table.status.stateVersion ?? 0);
      return {
        ...next,
        history: reset
          ? []
          : [...previous.history, ...next.cues].slice(-GRAND_ARCHIVE_FEEDBACK_HISTORY_LIMIT),
        generation: previous.generation + (reset ? 1 : 0),
      };
    });
  }, [snapshot, viewerResetKey]);
  return state;
}
