import type {
  FabMatchSnapshotV21,
  FabMoveName,
  FabUndoBarrier,
} from "@tcg/flesh-and-blood-engine/simulator";

/**
 * One restorable undo point on the local practice surface: the serialized
 * pre-command match snapshot plus the telemetry and analytics lengths that
 * were current before the command, so a restore also rewinds both trails.
 */
export interface FabPracticeUndoPoint<TSnapshot = FabMatchSnapshotV21> {
  readonly snapshot: TSnapshot;
  /** Command records to discard with the restored game state. */
  readonly telemetryLength: number;
  readonly analyticsLength: number;
}

/**
 * Practice-only undo policy. The engine reports one conservative
 * information-exposure barrier per accepted command; the practice surface owns
 * what that means for its undo point.
 *
 * In a local practice match the acting player already knows the contents of
 * their own hidden zones, so `move-hidden-to-public` (playing, pitching,
 * discarding, or banishing one of those cards) must not strand the pre-play
 * snapshot: undoing a mistaken play is the primary practice recovery flow
 * (playtest F009). Draws, looks, searches, shuffles, reveals, and randomness
 * stay final — rolling those back would replay hidden information.
 */
export function fabPracticeUndoBlockedByBarrier(barrier: FabUndoBarrier | null): boolean {
  return barrier !== null && barrier.reasons.some((reason) => reason !== "move-hidden-to-public");
}

/** How a command relates to the undo point of the interaction it belongs to. */
export type FabPracticeUndoMoveKind = "decision-answer" | "pass" | "interaction-start";

/**
 * A command dispatched while an engine decision was pending answers that
 * decision rather than starting a new interaction, and a pass only advances
 * the resolution of whatever the last interaction started.
 */
export function classifyFabPracticeUndoMove(input: {
  readonly move: FabMoveName;
  readonly answersPendingDecision: boolean;
}): FabPracticeUndoMoveKind {
  if (input.answersPendingDecision) return "decision-answer";
  return input.move === "pass" ? "pass" : "interaction-start";
}

/**
 * Resolve the practice undo point after one accepted command. `next` describes
 * the pre-command snapshot of the command being applied; `current` is the
 * undo point surviving from earlier commands.
 */
export function nextFabPracticeUndoPoint<TSnapshot>(input: {
  readonly moveKind: FabPracticeUndoMoveKind;
  readonly barrier: FabUndoBarrier | null;
  readonly current: FabPracticeUndoPoint<TSnapshot> | null;
  readonly next: FabPracticeUndoPoint<TSnapshot>;
}): FabPracticeUndoPoint<TSnapshot> | null {
  if (fabPracticeUndoBlockedByBarrier(input.barrier)) return null;
  switch (input.moveKind) {
    case "decision-answer":
      // The pre-answer state still contains the prompt being answered, so
      // pointing undo there would resurrect the just-answered decision and
      // loop it instead of undoing the play that created it (playtest F009:
      // decline Danse Macabre, Undo re-opens Danse Macabre). Keep whatever
      // earlier undo point the interaction started from.
      return input.current;
    case "pass":
      // Passes advance the current interaction's undo point, but arm their own
      // when nothing is in flight so a premature pass stays undoable.
      return input.current ?? input.next;
    case "interaction-start":
      return input.next;
  }
}
