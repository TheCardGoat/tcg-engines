import { isPlayableGameSlug, type PlayableGameSlug } from "./games.js";
import type { EventName, InboxEnvelope, PayloadOf } from "./inbox.js";

/**
 * Envelope construction (gateway side) and parsing (consumer side).
 *
 * On the wire, the stream entry is a flat list of `field value field value …`
 * pairs (Redis Streams native format). We keep `payload` as a JSON-stringified
 * blob in a single field rather than splattering nested keys — Streams don't
 * give us nested types and JSON is good enough for our message rate.
 *
 * Internal traffic skips runtime validation: the trust boundary (ws-gateway
 * ingress) already ran Zod against `GatewayClientMessage`. Consumers trust
 * the discriminated `type` and cast `payload` to `PayloadOf<E>`.
 *
 * `gameSlug` is required: it identifies the namespace the socket connected
 * through. Streams are partitioned per slug (`stream:gateway-inbox:<slug>`),
 * so a missing slug means a buggy publisher and the entry should DLQ.
 */

export interface BuildEnvelopeArgs<E extends EventName> {
  type: E;
  payload: PayloadOf<E>;
  gameSlug: PlayableGameSlug;
  correlationId: string;
  socketId: string;
  userId: string | null;
  authed: boolean;
  /** Optional W3C tracecontext carrier injected by the gateway. */
  traceparent?: string;
  tracestate?: string;
}

export function buildEnvelope<E extends EventName>(args: BuildEnvelopeArgs<E>): InboxEnvelope<E> {
  return {
    v: 1,
    type: args.type,
    gameSlug: args.gameSlug,
    correlationId: args.correlationId,
    socketId: args.socketId,
    userId: args.userId,
    authed: args.authed,
    ts: Date.now(),
    payload: args.payload,
    ...(args.traceparent ? { traceparent: args.traceparent } : {}),
    ...(args.tracestate ? { tracestate: args.tracestate } : {}),
  };
}

/**
 * Serialize an envelope into Redis Streams `field value` pairs.
 *
 * `traceparent` and `tracestate` are written only when present so the
 * stream entry stays compact in the common (no-tracing) case.
 */
export function serializeEnvelope(env: InboxEnvelope): Record<string, string> {
  const fields: Record<string, string> = {
    v: String(env.v),
    type: env.type,
    gameSlug: env.gameSlug,
    correlationId: env.correlationId,
    socketId: env.socketId,
    userId: env.userId ?? "-",
    authed: env.authed ? "1" : "0",
    ts: String(env.ts),
    payload: JSON.stringify(env.payload),
  };
  if (env.enqueuedMs !== undefined) fields.enqueuedMs = String(env.enqueuedMs);
  if (env.traceparent) fields.traceparent = env.traceparent;
  if (env.tracestate) fields.tracestate = env.tracestate;
  return fields;
}

/**
 * Parse a Redis Streams entry's field map into a typed envelope. Returns
 * null on shape mismatch — caller decides whether to DLQ or skip.
 *
 * The `v === "1"` check is load-bearing during rolling deploys: a newer
 * gateway writing `v: "2"` envelopes must NOT be cast to the current
 * (v1) handler payload type. An older consumer reading a future schema
 * returns null here, the consumer DLQs the entry, and a human (or a
 * forward-compat parser added later) decides what to do with it.
 *
 * `gameSlug` is also gated: an envelope with an unknown / missing slug
 * means a bad publisher (or a deploy ordering bug) and we'd rather
 * DLQ than route blindly to whichever handler picks it up.
 */
export function parseEnvelope(fields: Record<string, string | undefined>): InboxEnvelope | null {
  const v = fields.v;
  const type = fields.type;
  const gameSlugRaw = fields.gameSlug;
  const correlationId = fields.correlationId;
  const socketId = fields.socketId;
  const userIdRaw = fields.userId;
  const authedRaw = fields.authed;
  const tsRaw = fields.ts;
  const payloadRaw = fields.payload;
  if (
    v !== "1" ||
    typeof type !== "string" ||
    typeof correlationId !== "string" ||
    typeof socketId !== "string" ||
    typeof authedRaw !== "string" ||
    typeof tsRaw !== "string" ||
    typeof payloadRaw !== "string" ||
    !isPlayableGameSlug(gameSlugRaw)
  ) {
    return null;
  }
  let payload: unknown;
  try {
    payload = JSON.parse(payloadRaw);
  } catch {
    return null;
  }
  const ts = Number(tsRaw);
  if (!Number.isFinite(ts)) return null;
  const traceparent = fields.traceparent;
  const tracestate = fields.tracestate;
  const enqueuedMsRaw = fields.enqueuedMs;
  const enqueuedMs = enqueuedMsRaw !== undefined ? Number(enqueuedMsRaw) : undefined;
  return {
    v: 1,
    type: type as EventName,
    gameSlug: gameSlugRaw,
    correlationId,
    socketId,
    userId: userIdRaw && userIdRaw !== "-" ? userIdRaw : null,
    authed: authedRaw === "1",
    ts,
    payload: payload as PayloadOf<EventName>,
    ...(enqueuedMs !== undefined && Number.isFinite(enqueuedMs) ? { enqueuedMs } : {}),
    ...(traceparent ? { traceparent } : {}),
    ...(tracestate ? { tracestate } : {}),
  };
}
