import { z } from "zod";
import {
  LiveMatchBootstrapV1Schema,
  MatchInfoSchema,
  ResolvedMatchViewerSchema,
  ScopedRealtimeAccessSchema,
  ViewerProjectedGameStateSchema,
} from "./schemas.js";
import type { LiveMatchBootstrapV1 } from "./page-data.js";
import { MatchPreparationSchema } from "./preparation.js";

const header = {
  schemaVersion: z.literal(2),
  /** Monotonic revision of the persisted match lifecycle, independent of game moves. */
  revision: z.number().int().nonnegative(),
};
const pending = z
  .object({
    ...header,
    match: MatchInfoSchema,
    viewer: ResolvedMatchViewerSchema,
    gameId: z.string().min(1),
    realtime: ScopedRealtimeAccessSchema.optional(),
  })
  .strict();
const live = LiveMatchBootstrapV1Schema.extend(header);

/** A server-selected screen. Retained private preparation never accompanies a live game. */
export const MatchSessionSchema = z
  .discriminatedUnion("phase", [
    pending
      .extend({
        phase: z.literal("preparation"),
        match: MatchInfoSchema.extend({ status: z.literal("waiting") }),
        preparation: MatchPreparationSchema,
      })
      .strict(),
    pending
      .extend({
        phase: z.literal("starting"),
        match: MatchInfoSchema.extend({ status: z.literal("waiting") }),
      })
      .strict(),
    live
      .extend({
        phase: z.literal("playing"),
        game: ViewerProjectedGameStateSchema.extend({ status: z.literal("in_progress") }),
      })
      .strict(),
    live
      .extend({
        phase: z.literal("finished"),
        game: ViewerProjectedGameStateSchema.extend({ status: z.literal("completed") }),
      })
      .strict(),
    pending
      .extend({
        phase: z.literal("cancelled"),
        match: MatchInfoSchema.extend({ status: z.literal("abandoned") }),
        reason: z.string(),
      })
      .strict(),
  ])
  .superRefine((session, context) => {
    if (session.phase !== "preparation") return;
    if (
      session.viewer.role !== "player" ||
      session.preparation.playerId !== session.viewer.actorId ||
      session.preparation.matchId !== session.match.matchId ||
      session.preparation.gameId !== session.gameId
    ) {
      context.addIssue({
        code: "custom",
        path: ["preparation"],
        message: "Preparation must belong to the seated viewer and requested game",
      });
    }
  });

export type MatchSession = z.infer<typeof MatchSessionSchema>;

/** Active-game projection consumed by game renderers; lifecycle belongs to the session host. */
export function liveGameFromSession(session: MatchSession): LiveMatchBootstrapV1 | null {
  switch (session.phase) {
    case "playing":
    case "finished": {
      const {
        phase: _phase,
        revision: _revision,
        schemaVersion: _schemaVersion,
        ...game
      } = session;
      return { ...game, schemaVersion: 1 };
    }
    case "preparation":
    case "starting":
    case "cancelled":
      return null;
    default:
      return assertNever(session);
  }
}

export function sessionGameId(session: MatchSession): string {
  switch (session.phase) {
    case "playing":
    case "finished":
      return session.game.gameId;
    case "preparation":
    case "starting":
    case "cancelled":
      return session.gameId;
    default:
      return assertNever(session);
  }
}

/** HTTP recovery cannot replace a newer lifecycle or game snapshot with an older one. */
export function acceptSession(current: MatchSession, incoming: MatchSession): MatchSession {
  if (current.match.matchId !== incoming.match.matchId) return current;
  if (incoming.revision < current.revision) return current;
  if (current.phase === "playing" || current.phase === "finished") {
    if (sessionGameId(current) === sessionGameId(incoming)) {
      if (incoming.phase !== "playing" && incoming.phase !== "finished") return current;
      if (incoming.game.stateVersion < current.game.stateVersion) return current;
      if (current.phase === "finished" && incoming.phase !== "finished") return current;
    } else if (incoming.revision === current.revision) return current;
  }
  return incoming;
}

function assertNever(value: never): never {
  throw new Error(`Unsupported match session: ${String(value)}`);
}
