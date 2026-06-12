import { describe, expect, it } from "vite-plus/test";
import {
  PLAYABLE_GAME_SLUGS,
  buildEnvelope,
  inboxConsumerGroupName,
  inboxDlqKey,
  inboxProcessedKey,
  inboxStreamKey,
  isPlayableGameSlug,
  NEEDS_DEDUP,
  parseEnvelope,
  serializeEnvelope,
} from "./index";
import { GatewayClientMessage, GatewayPingMessage } from "./schemas";

describe("@tcg/protocol", () => {
  describe("schemas", () => {
    it("parses a valid ping", () => {
      const result = GatewayPingMessage.safeParse({ type: "ping" });
      expect(result.success).toBe(true);
    });

    it("rejects malformed type", () => {
      const result = GatewayClientMessage.safeParse({ type: "unknown_event_xyz" });
      expect(result.success).toBe(false);
    });

    it("validates execute_move payload shape", () => {
      const result = GatewayClientMessage.safeParse({
        type: "execute_move",
        gameId: "g1",
        expectedVersion: 5,
        moveType: "play_card",
        payload: { cardId: "c1" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects execute_move missing required fields", () => {
      const result = GatewayClientMessage.safeParse({
        type: "execute_move",
        gameId: "g1",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("slug helpers", () => {
    it("enumerates every playable slug", () => {
      expect(PLAYABLE_GAME_SLUGS).toEqual([
        "lorcana",
        "gundam",
        "cyberpunk",
        "riftbound",
        "one-piece",
        "platform",
      ]);
    });

    it("guards arbitrary strings", () => {
      expect(isPlayableGameSlug("lorcana")).toBe(true);
      expect(isPlayableGameSlug("one-piece")).toBe(true);
      expect(isPlayableGameSlug("not-a-real-game")).toBe(false);
      expect(isPlayableGameSlug(undefined)).toBe(false);
    });
  });

  describe("inbox key helpers", () => {
    it("partitions stream / group / DLQ keys per slug", () => {
      expect(inboxStreamKey("lorcana")).toBe("stream:gateway-inbox:lorcana");
      expect(inboxStreamKey("cyberpunk")).toBe("stream:gateway-inbox:cyberpunk");
      expect(inboxConsumerGroupName("lorcana")).toBe("gateway-inbox-lorcana");
      expect(inboxDlqKey("lorcana")).toBe("stream:gateway-inbox-dlq:lorcana");
    });

    it("computes the processed-key namespace", () => {
      expect(inboxProcessedKey("01HX")).toBe("inbox:processed:01HX");
    });

    it("flags chat events as needing handler-level dedup", () => {
      expect(NEEDS_DEDUP.has("send_chat_message")).toBe(true);
      expect(NEEDS_DEDUP.has("ping")).toBe(false);
    });
  });

  describe("envelope round-trip with gameSlug", () => {
    it("preserves slug across serialize/parse", () => {
      const env = buildEnvelope({
        type: "ping",
        payload: { t: 7 },
        gameSlug: "lorcana",
        correlationId: "cid",
        socketId: "s1",
        userId: null,
        authed: false,
      });
      const fields = serializeEnvelope(env);
      expect(fields.gameSlug).toBe("lorcana");
      const parsed = parseEnvelope(fields);
      expect(parsed?.gameSlug).toBe("lorcana");
      expect(parsed?.type).toBe("ping");
    });

    it("rejects an envelope with an unknown slug (DLQ)", () => {
      const env = buildEnvelope({
        type: "ping",
        payload: { t: 1 },
        gameSlug: "lorcana",
        correlationId: "cid",
        socketId: "s1",
        userId: null,
        authed: false,
      });
      const fields = { ...serializeEnvelope(env), gameSlug: "not-a-game" };
      expect(parseEnvelope(fields)).toBeNull();
    });

    it("rejects an envelope missing the slug entirely", () => {
      const env = buildEnvelope({
        type: "ping",
        payload: { t: 1 },
        gameSlug: "lorcana",
        correlationId: "cid",
        socketId: "s1",
        userId: null,
        authed: false,
      });
      const { gameSlug: _drop, ...withoutSlug } = serializeEnvelope(env);
      void _drop;
      expect(parseEnvelope(withoutSlug)).toBeNull();
    });

    it("round-trips W3C traceparent/tracestate when present", () => {
      const env = buildEnvelope({
        type: "ping",
        payload: { t: 1 },
        gameSlug: "lorcana",
        correlationId: "cid",
        socketId: "s1",
        userId: null,
        authed: false,
        traceparent: "00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-01",
        tracestate: "vendor=value",
      });
      const fields = serializeEnvelope(env);
      expect(fields.traceparent).toBe("00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-01");
      expect(fields.tracestate).toBe("vendor=value");
      const parsed = parseEnvelope(fields);
      expect(parsed?.traceparent).toBe("00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-01");
      expect(parsed?.tracestate).toBe("vendor=value");
    });

    it("omits traceparent/tracestate when absent (legacy path)", () => {
      const env = buildEnvelope({
        type: "ping",
        payload: { t: 1 },
        gameSlug: "lorcana",
        correlationId: "cid",
        socketId: "s1",
        userId: null,
        authed: false,
      });
      const fields = serializeEnvelope(env);
      expect("traceparent" in fields).toBe(false);
      expect("tracestate" in fields).toBe(false);
      const parsed = parseEnvelope(fields);
      expect(parsed?.traceparent).toBeUndefined();
      expect(parsed?.tracestate).toBeUndefined();
    });
  });
});
