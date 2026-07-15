import type { InboxEnvelope } from "./inbox.js";
import type { ServerToClientEvents } from "./events.js";

/**
 * Adapter passed to inbox-side handlers so they don't import Socket.io
 * directly. Concrete implementation lives on game-server in
 * `apps/api/src/modules/play/inbox/handler-context.ts` and wraps the typed
 * `Server<ClientToServerEvents, ServerToClientEvents, ...>` instance.
 *
 * `reply` / `broadcast*` are typed against `ServerToClientEvents` so a typo
 * or shape mismatch fails compilation in handlers, not at runtime.
 */
export interface HandlerContext<
  E extends keyof import("./events.js").ClientToServerEvents =
    keyof import("./events.js").ClientToServerEvents,
> {
  envelope: InboxEnvelope<E>;

  /** Unicast back to the originating socket. Routed by the Streams adapter
   *  to whichever ws-gateway instance owns that socket id. */
  reply<K extends keyof ServerToClientEvents>(
    event: K,
    data: Parameters<ServerToClientEvents[K]>[0],
  ): void;

  /** Broadcast to all sockets in the `game:${gameId}` room. */
  broadcastGame<K extends keyof ServerToClientEvents>(
    gameId: string,
    event: K,
    data: Parameters<ServerToClientEvents[K]>[0],
  ): void;

  /** Broadcast to sockets seated as `actorId` in a specific game. */
  broadcastGameActor<K extends keyof ServerToClientEvents>(
    gameId: string,
    actorId: string,
    event: K,
    data: Parameters<ServerToClientEvents[K]>[0],
  ): void;

  /** Broadcast to spectator sockets in a specific game. */
  broadcastGameSpectators<K extends keyof ServerToClientEvents>(
    gameId: string,
    event: K,
    data: Parameters<ServerToClientEvents[K]>[0],
  ): void;

  /** Broadcast to all sockets in the `match:${matchId}` room. */
  broadcastMatch<K extends keyof ServerToClientEvents>(
    matchId: string,
    event: K,
    data: Parameters<ServerToClientEvents[K]>[0],
  ): void;

  /** Broadcast to all sockets in the `user:${userId}` room (every tab). */
  broadcastUser<K extends keyof ServerToClientEvents>(
    userId: string,
    event: K,
    data: Parameters<ServerToClientEvents[K]>[0],
  ): void;
}
