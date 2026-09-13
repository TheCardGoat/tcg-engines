import { MAX_HEARTBEAT_ROUND_TRIP_MS, type HeartbeatAckPayload } from "@tcg/protocol";

export { MAX_HEARTBEAT_ROUND_TRIP_MS };
export const MAX_QUEUED_HEARTBEAT_PROBES = 8;

export interface CompletedHeartbeatProbe {
  correlationId: string;
  roundTripMs: number;
}

export interface HeartbeatProbeFields {
  correlationId: string;
  clientSentAt: number;
  previousCorrelationId?: string;
  previousRoundTripMs?: number;
}

export interface HeartbeatProbeTracker {
  nextHeartbeatFields(now?: number): HeartbeatProbeFields;
  acknowledge(
    payload: Pick<HeartbeatAckPayload, "correlationId" | "clientSentAt">,
    receivedAt?: number,
  ): CompletedHeartbeatProbe | null;
  clear(): void;
}

const MAX_OUTSTANDING_HEARTBEAT_PROBES = 32;

type HeartbeatProbeCrypto = Pick<Crypto, "getRandomValues"> & Partial<Pick<Crypto, "randomUUID">>;

export function createHeartbeatProbeId(
  cryptoApi: HeartbeatProbeCrypto = globalThis.crypto,
): string {
  if (typeof cryptoApi.randomUUID === "function") return cryptoApi.randomUUID();

  const bytes = cryptoApi.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

/**
 * Tracks heartbeat probes entirely on the originating browser clock.
 * Completed samples are reported to the server one at a time in FIFO order.
 */
export function createHeartbeatProbeTracker(
  randomUUID: () => string = createHeartbeatProbeId,
): HeartbeatProbeTracker {
  const outstanding = new Map<string, number>();
  const completed: CompletedHeartbeatProbe[] = [];

  return {
    nextHeartbeatFields(now = Date.now()): HeartbeatProbeFields {
      const previous = completed.shift();
      const correlationId = randomUUID();
      outstanding.set(correlationId, now);
      while (outstanding.size > MAX_OUTSTANDING_HEARTBEAT_PROBES) {
        const oldestCorrelationId = outstanding.keys().next().value;
        if (oldestCorrelationId === undefined) break;
        outstanding.delete(oldestCorrelationId);
      }

      return {
        correlationId,
        clientSentAt: now,
        ...(previous
          ? {
              previousCorrelationId: previous.correlationId,
              previousRoundTripMs: previous.roundTripMs,
            }
          : {}),
      };
    },

    acknowledge(payload, receivedAt = Date.now()): CompletedHeartbeatProbe | null {
      if (!payload.correlationId || payload.clientSentAt === undefined) return null;
      const sentAt = outstanding.get(payload.correlationId);
      if (sentAt === undefined || sentAt !== payload.clientSentAt) return null;
      outstanding.delete(payload.correlationId);

      const roundTripMs = receivedAt - sentAt;
      if (
        !Number.isFinite(roundTripMs) ||
        roundTripMs < 0 ||
        roundTripMs > MAX_HEARTBEAT_ROUND_TRIP_MS
      ) {
        return null;
      }

      const sample = { correlationId: payload.correlationId, roundTripMs };
      if (completed.length < MAX_QUEUED_HEARTBEAT_PROBES) completed.push(sample);
      return sample;
    },

    clear(): void {
      outstanding.clear();
      completed.length = 0;
    },
  };
}
