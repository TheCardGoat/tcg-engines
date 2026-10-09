import {
  isFabMatchSnapshotV21,
  isFabMoveName,
  type FabMatchSnapshotV21,
  type FabMoveName,
  type FabUndoBarrier,
} from "@tcg/flesh-and-blood-engine/runtime";
import { z } from "zod";

/** A hosted interaction, from announcement through payment and resolution. */
export interface FabUndoCheckpoint {
  readonly actorId: string;
  readonly move: FabMoveName;
  readonly snapshot: FabMatchSnapshotV21;
  readonly clockBonuses: Readonly<Record<string, number>>;
}

export interface FabTurnStartCheckpoint {
  readonly actorId: string;
  readonly snapshot: FabMatchSnapshotV21;
  readonly clockBonuses: Readonly<Record<string, number>>;
}

export interface FabUndoState {
  readonly checkpoints: readonly FabUndoCheckpoint[];
  readonly turnStart: FabTurnStartCheckpoint | null;
}

const checkpointSchema = z.object({
  actorId: z.string(),
  move: z.custom<FabMoveName>((value) => typeof value === "string" && isFabMoveName(value)),
  snapshot: z.custom<FabMatchSnapshotV21>(isFabMatchSnapshotV21),
  clockBonuses: z.record(z.string(), z.number().nonnegative()),
});
const turnStartSchema = checkpointSchema.omit({ move: true });

export function readFabUndoState(metadata: unknown): FabUndoState {
  if (metadata === undefined) return { checkpoints: [], turnStart: null };
  const parsed = z
    .object({
      undoCheckpoints: z.array(checkpointSchema).optional(),
      undoCheckpoint: checkpointSchema.nullable().optional(),
      turnStartCheckpoint: turnStartSchema.nullable().optional(),
    })
    .parse(metadata);
  return {
    checkpoints: parsed.undoCheckpoints ?? (parsed.undoCheckpoint ? [parsed.undoCheckpoint] : []),
    turnStart: parsed.turnStartCheckpoint ?? null,
  };
}

export function nextFabUndoCheckpoint(input: {
  readonly current: FabUndoCheckpoint | null;
  readonly before: FabMatchSnapshotV21 | null;
  readonly actorId: string;
  readonly move: FabMoveName;
  readonly barrier: FabUndoBarrier | null;
  readonly ended: boolean;
}): FabUndoCheckpoint | null {
  if (input.ended || input.barrier?.reasons.some((reason) => reason !== "move-hidden-to-public"))
    return null;
  // Preferences are not gameplay and must not displace an interaction checkpoint.
  if (
    input.move === "set-automation-preferences" ||
    input.move === "set-optional-trigger-automation" ||
    input.move === "arm-priority-hold"
  )
    return input.current;
  const current =
    input.current?.actorId === input.actorId || input.move === "pass" ? input.current : null;
  if (!input.before) return current;
  if (input.move === "pass" && current) return current;
  return {
    actorId: input.actorId,
    move: input.move,
    snapshot: input.before,
    clockBonuses: {},
  };
}
