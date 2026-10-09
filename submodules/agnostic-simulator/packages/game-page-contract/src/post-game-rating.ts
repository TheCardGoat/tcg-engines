import { z } from "zod";

export const PostGamePlayerRatingSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("placement"), seat: z.union([z.literal(1), z.literal(2)]) }),
  z.object({
    status: z.literal("rated"),
    seat: z.union([z.literal(1), z.literal(2)]),
    before: z.number().finite().nullable(),
    after: z.number().finite(),
  }),
]);

/** A rating applies to the complete match/series, never an individual game. */
export const PostGameRatingSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("not_applicable") }),
  z.object({ status: z.literal("in_progress") }),
  z.object({ status: z.literal("pending") }),
  z.object({ status: z.literal("unavailable") }),
  /** Completed too quickly to qualify for ladder movement; MMR is unchanged. */
  z.object({ status: z.literal("short_match_not_rated") }),
  z.object({
    status: z.literal("ready"),
    seasonId: z.string(),
    players: z.tuple([PostGamePlayerRatingSchema, PostGamePlayerRatingSchema]),
  }),
]);

export type PostGameRating = z.infer<typeof PostGameRatingSchema>;
export type PostGamePlayerRating = z.infer<typeof PostGamePlayerRatingSchema>;
