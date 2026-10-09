import { PresentationEnvelopeSchema } from "./presentation.js";
import { z } from "zod";
export const PregameTurnOrderSchema = z.discriminatedUnion("stage", [
  z.object({ stage: z.literal("choosing"), chooserId: z.string() }),
  z.object({
    stage: z.literal("chosen"),
    chooserId: z.string(),
    firstPlayerId: z.string(),
    source: z.enum(["player", "bot", "timeout", "random", "seed"]),
  }),
]);
export type PregameTurnOrder = z.infer<typeof PregameTurnOrderSchema>;

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
    phase: z.enum(["selecting", "choosing-first-player", "starting", "cancelled"]),
    phaseToken: z.string().min(1),
    serverTime: z.string().datetime(),
    deadlineAt: z.string().datetime(),
    turnOrder: PregameTurnOrderSchema,
    playerId: z.string().min(1),
    pool: z.record(z.string(), z.unknown()),
    selection: z.record(z.string(), z.unknown()),
    player: participant,
    opponent: participant,
    locked: z.boolean(),
    selectionOutcome: z.enum(["pending", "confirmed", "timeout", "fixed"]),
    opponentReady: z.boolean(),
  })
  .strict();
export type MatchPreparation = z.infer<typeof MatchPreparationSchema>;

const identity = {
  matchId: z.string().min(1),
  gameId: z.string().min(1),
};

/** Re-subscribing also synchronizes state. It does not mutate preparation. */
export const RequestPreparationSyncMessage = z
  .object({
    type: z.literal("request_preparation_sync"),
    ...identity,
    correlationId: z.string().min(1),
    revision: z.number().int().nonnegative().optional(),
  })
  .strict();

const commandIdentity = {
  ...identity,
  commandId: z.string().uuid(),
  phaseToken: z.string().min(1),
  correlationId: z.string().min(1),
};

export const ConfirmPreparationMessage = z
  .object({
    type: z.literal("confirm_preparation"),
    ...commandIdentity,
    selection: z.json(),
  })
  .strict();

export const ChoosePreparationFirstPlayerMessage = z
  .object({
    type: z.literal("choose_preparation_first_player"),
    ...commandIdentity,
    firstPlayerId: z.string().min(1),
  })
  .strict();

export const PreparationCommandSchema = z.discriminatedUnion("type", [
  ConfirmPreparationMessage,
  ChoosePreparationFirstPlayerMessage,
]);
export type PreparationCommand = z.infer<typeof PreparationCommandSchema>;
export const PreparationClientMessageSchema = z.discriminatedUnion("type", [
  RequestPreparationSyncMessage,
  ConfirmPreparationMessage,
  ChoosePreparationFirstPlayerMessage,
]);

export function preparationActorRoom(matchId: string, gameId: string, actorId: string): string {
  return `preparation:${matchId}:${gameId}:actor:${actorId}`;
}

/** Only the actor's authorized room receives the private preparation variant. */
export const PreparationSnapshotSchema = z.discriminatedUnion("state", [
  z
    .object({
      state: z.literal("unchanged"),
      ...identity,
      revision: z.number().int().nonnegative(),
      serverTime: z.string().datetime(),
    })
    .strict(),
  z
    .object({
      state: z.literal("preparation"),
      ...identity,
      revision: z.number().int().nonnegative(),
      serverTime: z.string().datetime(),
      preparation: MatchPreparationSchema,
    })
    .strict(),
  z
    .object({
      state: z.literal("lifecycle"),
      ...identity,
      revision: z.number().int().nonnegative(),
      serverTime: z.string().datetime(),
      status: z.enum(["waiting", "in_progress", "completed", "abandoned"]),
    })
    .strict(),
]);
export type PreparationSnapshot = z.infer<typeof PreparationSnapshotSchema>;

export const PreparationCommandResultSchema = z.discriminatedUnion("status", [
  z
    .object({
      status: z.literal("accepted"),
      ...identity,
      commandId: z.string().uuid(),
      phaseToken: z.string().min(1),
      revision: z.number().int().nonnegative(),
    })
    .strict(),
  z
    .object({
      status: z.literal("rejected"),
      ...identity,
      commandId: z.string().uuid(),
      code: z.enum([
        "expired",
        "stale_preparation",
        "invalid_selection",
        "unauthorized",
        "temporarily_unavailable",
        "command_id_conflict",
        "already_locked",
      ]),
      message: z.string(),
    })
    .strict(),
]);
export type PreparationCommandResult = z.infer<typeof PreparationCommandResultSchema>;
