import type { PlayableGameSlug } from "./games.js";
import type { ClientToServerEvents } from "./events.js";

/**
 * Inbox envelope written to `stream:gateway-inbox:<slug>` by the
 * game-agnostic ws-gateway and consumed by the matching game-specific
 * game-server. The discriminated `type` field gives the dispatcher an
 * exhaustive switch — adding an event to `ClientToServerEvents` and
 * missing a dispatcher arm becomes a TS error.
 *
 * `payload` is parsed from the JSON column on the stream entry and cast
 * to `PayloadOf<E>`. We do NOT re-validate at the consumer because the
 * trust boundary (ws-gateway middleware) already ran the Zod schema;
 * the stream is internal traffic.
 *
 * `gameSlug` is the namespace the socket connected through. The stream
 * itself is per-slug already, so this field is redundant for routing,
 * but it lets handlers read the slug without re-deriving from socket
 * data and makes the envelope self-describing on the wire.
 */
export type EventName = keyof ClientToServerEvents;
export type PayloadOf<E extends EventName> = Parameters<ClientToServerEvents[E]>[0];

export interface InboxEnvelopeBase {
  /** Envelope schema version. Bump when changing field shape. */
  v: 1;
  /** The game namespace this envelope is bound to. */
  gameSlug: PlayableGameSlug;
  /** Client-supplied (or gateway-generated) correlation id (ULID-ish). */
  correlationId: string;
  /** Socket.io socket id, used for unicast `:response` replies. */
  socketId: string;
  /** Authenticated user id, or null for anonymous connections. */
  userId: string | null;
  /** True when the gateway middleware verified ticket / JWT / session. */
  authed: boolean;
  /** Wall-clock ms timestamp at gateway ingress (telemetry only). */
  ts: number;
  /**
   * Wall-clock ms timestamp set by the gateway just before XADD.
   * Used by the consumer to compute end-to-end Redis Stream latency.
   * Optional: absent on envelopes published by older gateway versions
   * (rolling-deploy safe — consumer skips recording when missing).
   */
  enqueuedMs?: number;
  /**
   * W3C tracecontext `traceparent` (RFC 9110 §11.1), injected by the
   * gateway at XADD time so the upstream consumer can continue the
   * distributed trace. Optional: a publisher with no active span (or no
   * OTel SDK loaded) writes nothing here.
   */
  traceparent?: string;
  /** Optional W3C `tracestate` accompanying `traceparent`. */
  tracestate?: string;
}

export type InboxEnvelope<E extends EventName = EventName> = InboxEnvelopeBase & {
  type: E;
  payload: PayloadOf<E>;
};

/**
 * Per-game stream / consumer-group / DLQ key helpers.
 *
 * Each game-server is parameterized by `GAME_SLUG` and only ever
 * touches its own keys — there is no cross-game traffic on the inbox
 * path. The slug is in the key, not just the envelope, so a `MONITOR`
 * trace makes routing visible at the Redis layer.
 */
export function inboxStreamKey(slug: PlayableGameSlug): string {
  return `stream:gateway-inbox:${slug}`;
}

export function inboxConsumerGroupName(slug: PlayableGameSlug): string {
  return `gateway-inbox-${slug}`;
}

export function inboxDlqKey(slug: PlayableGameSlug): string {
  return `stream:gateway-inbox-dlq:${slug}`;
}

export const INBOX_PROCESSED_TTL_SECONDS = 600;
export const INBOX_MAX_DELIVERIES_BEFORE_DLQ = 5;

export function inboxProcessedKey(correlationId: string): string {
  return `inbox:processed:${correlationId}`;
}

/**
 * Whitelist of events that need an idempotency gate at the consumer.
 * `execute_move` is excluded because the existing CAS write rejects
 * duplicates naturally (version mismatch). Pure-read events
 * (`heartbeat`, `matchmaking_poll`, `request_game_state_sync`) are
 * also naturally idempotent. The set below covers events with
 * externally-visible side effects that wouldn't otherwise dedup on
 * redelivery.
 */
export const NEEDS_DEDUP: ReadonlySet<EventName> = new Set<EventName>([
  "send_chat_message",
  "send_free_text_chat_message",
  "matchmaking_accept",
  "matchmaking_decline",
  "proposal_send",
  "proposal_accept",
  "proposal_decline",
  "skip_opponent_turn",
  "drop_player",
  "leave_game",
]);
