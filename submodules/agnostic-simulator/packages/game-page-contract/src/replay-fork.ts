import { z } from "zod";

/** Private archive, never part of a public ReplayPlaybackV1 response. */
export const ReplayForkArchiveV1Schema = z.object({
  schemaVersion: z.literal(1),
  gameId: z.string().min(1),
  matchId: z.string().min(1),
  gameType: z.string().min(1),
  frames: z
    .array(
      z.object({
        stateVersion: z.number().int().nonnegative(),
        state: z.unknown().refine((state) => state !== undefined && state !== null),
      }),
    )
    .min(1),
});

export type ReplayForkArchiveV1 = z.infer<typeof ReplayForkArchiveV1Schema>;

/** One participant-authorized checkpoint, selected by accepted-move cursor. */
export const ReplayForkPositionV1Schema = z.object({
  schemaVersion: z.literal(1),
  gameId: z.string().min(1),
  gameType: z.string().min(1),
  cursor: z.number().int().nonnegative(),
  stateVersion: z.number().int().nonnegative(),
  state: z.unknown().refine((state) => state !== undefined && state !== null),
});
