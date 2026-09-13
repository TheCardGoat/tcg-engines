import { PresentationEnvelopeSchema } from "@tcg/protocol/presentation";
import { z } from "zod";
import { PregameTurnOrderSchema } from "./schemas.js";

const participant = z
  .object({
    playerId: z.string().min(1),
    label: z.string().min(1),
    profileHref: z.string().optional(),
    mmr: z.number().finite().optional(),
    subscriptionTier: z.string().optional(),
    heroName: z.string().optional(),
    heroId: z.string().optional(),
  })
  .passthrough();

/** Shared transport envelope. Game-owned pool/selection schemas refine the two
 * opaque records; shared contracts never import card or engine definitions. */
export const MatchPreparationSchema = z
  .object({
    object: z.literal("game_pregame"),
    presentation: PresentationEnvelopeSchema.optional(),
    kind: z.string().min(1),
    matchId: z.string().min(1),
    gameId: z.string().min(1),
    status: z.literal("waiting"),
    deadlineAt: z.string().datetime(),
    turnOrder: PregameTurnOrderSchema,
    playerId: z.string().min(1),
    pool: z.record(z.string(), z.unknown()),
    selection: z.record(z.string(), z.unknown()),
    player: participant,
    opponent: participant,
    locked: z.boolean(),
    opponentReady: z.boolean(),
  })
  .strict();
export type MatchPreparation = z.infer<typeof MatchPreparationSchema>;
