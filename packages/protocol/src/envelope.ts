import { type PlayableGameSlug, isPlayableGameSlug } from "./shared";
import type { EventName, InboxEnvelope, PayloadOf } from "./inbox";

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
}

export function buildEnvelope<E extends EventName>(args: BuildEnvelopeArgs<E>): InboxEnvelope<E> {
  return {
    authed: args.authed,
    correlationId: args.correlationId,
    gameSlug: args.gameSlug,
    payload: args.payload,
    socketId: args.socketId,
    ts: Date.now(),
    type: args.type,
    userId: args.userId,
    v: 1,
  };
}

/** Serialize an envelope into Redis Streams `field value` pairs. */
export function serializeEnvelope(env: InboxEnvelope): Record<string, string> {
  return {
    authed: env.authed ? "1" : "0",
    correlationId: env.correlationId,
    gameSlug: env.gameSlug,
    payload: JSON.stringify(env.payload),
    socketId: env.socketId,
    ts: String(env.ts),
    type: env.type,
    userId: env.userId ?? "-",
    v: String(env.v),
  };
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
  const {v} = fields;
  const {type} = fields;
  const gameSlugRaw = fields.gameSlug;
  const {correlationId} = fields;
  const {socketId} = fields;
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
  if (!Number.isFinite(ts)) {return null;}
  return {
    authed: authedRaw === "1",
    correlationId,
    gameSlug: gameSlugRaw,
    payload: payload as PayloadOf<EventName>,
    socketId,
    ts,
    type: type as EventName,
    userId: userIdRaw && userIdRaw !== "-" ? userIdRaw : null,
    v: 1,
  };
}
