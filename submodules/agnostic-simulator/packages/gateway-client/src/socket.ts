import type { ClientToServerEvents, ServerToClientEvents } from "@tcg/protocol";
import { io, type Socket } from "socket.io-client";
import * as msgpackParser from "socket.io-msgpack-parser";

/**
 * Typed Socket.IO socket bound to the gateway wire contract.
 */
export type GatewaySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Shape carried in the Socket.IO handshake `auth` object. Credentials are sent
 * here — never as query params or headers — so the gateway's auth middleware
 * (`io.use(authMiddleware)`) can populate `SocketData` before `connection`.
 */
export interface GatewayHandshakeAuth {
  ticket?: string;
  token?: string;
  requireAuth?: true;
}

export interface CreateGatewaySocketOptions {
  /** Full Socket.IO namespace URL, e.g. `"wss://gateway.tcg.online/lorcana"`. */
  url: string;
  /**
   * Returns the credentials to embed in this handshake. Invoked by Socket.IO
   * on every (re)connect attempt. The resolver MUST consume any single-use
   * ticket internally so a reconnect never replays it.
   */
  resolveHandshakeAuth: () => GatewayHandshakeAuth;
}

/**
 * Build a Socket.IO client using the canonical gateway wire contract shared by
 * the platform web app and the game simulator:
 *
 * - per-game namespace `${origin}/${slug}`
 * - path `/socket.io/`
 * - WebSocket-only transport
 * - `socket.io-msgpack-parser`
 * - `autoConnect: false` (the manager drives `connect()`)
 * - unbounded reconnection (1s backoff, 30s cap)
 * - `withCredentials: true` so the browser sends the Better Auth session cookie
 *   on cross-origin handshakes
 * - credentials supplied via the handshake `auth` callback (function form, so
 *   values are re-read on every reconnect and single-use tickets are consumed)
 */
export function createGatewaySocket({
  url,
  resolveHandshakeAuth,
}: CreateGatewaySocketOptions): GatewaySocket {
  return io(url, {
    path: "/socket.io/",
    transports: ["websocket"],
    parser: msgpackParser,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Number.POSITIVE_INFINITY,
    reconnectionDelay: 1_000,
    reconnectionDelayMax: 30_000,
    withCredentials: true,
    auth: (cb: (data: GatewayHandshakeAuth) => void) => {
      cb(resolveHandshakeAuth());
    },
  });
}
