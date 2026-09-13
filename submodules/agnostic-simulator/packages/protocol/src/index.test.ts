import { describe, expect, it } from "vite-plus/test";
import {
  PLAYABLE_GAME_SLUGS,
  buildEnvelope,
  createScopedWsTicketPayload,
  createWsTicketPayload,
  inboxConsumerGroupName,
  inboxDlqKey,
  inboxProcessedKey,
  inboxStreamKey,
  isPlayableGameSlug,
  isWsTicketFresh,
  NEEDS_DEDUP,
  parseEnvelope,
  parseWsTicketPayload,
  serializeEnvelope,
  WS_TICKET_MAX_AGE_MS,
} from "./index.js";
import { GatewayClientMessage, GatewayPingMessage } from "./schemas.js";

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

    it("rejects the removed matchmaking polling event", () => {
      const result = GatewayClientMessage.safeParse({ type: "matchmaking_poll" });
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
        "flesh-and-blood",
        "grand-archive",
        "naruto",
        "platform",
      ]);
    });

    it("guards arbitrary strings", () => {
      expect(isPlayableGameSlug("lorcana")).toBe(true);
      expect(isPlayableGameSlug("one-piece")).toBe(true);
      expect(isPlayableGameSlug("flesh-and-blood")).toBe(true);
      expect(isPlayableGameSlug("grand-archive")).toBe(true);
      expect(isPlayableGameSlug("naruto")).toBe(true);
      expect(isPlayableGameSlug("not-a-real-game")).toBe(false);
      expect(isPlayableGameSlug(undefined)).toBe(false);
    });
  });

  describe("WebSocket ticket payloads", () => {
    it("creates and parses a versioned game-scoped ticket", () => {
      const payload = createWsTicketPayload("user-1", {
        gameSlug: "gundam",
        createdAt: 123,
      });

      expect(payload).toEqual({ v: 1, userId: "user-1", gameSlug: "gundam", createdAt: 123 });
      expect(parseWsTicketPayload(JSON.stringify(payload))).toEqual(payload);
    });

    it("accepts legacy unversioned payloads", () => {
      expect(parseWsTicketPayload('{"userId":"legacy","gameSlug":"lorcana"}')).toEqual({
        v: 1,
        userId: "legacy",
        gameSlug: "lorcana",
      });
    });

    it("round-trips an anonymous spectator scope without inventing an account identity", () => {
      const payload = createScopedWsTicketPayload(
        "gundam",
        {
          gameSlug: "gundam",
          matchId: "match-1",
          gameId: "game-1",
          role: "spectator",
          spectatorId: "spectator-1",
          expiresAt: 456,
        },
        123,
      );

      expect(parseWsTicketPayload(JSON.stringify(payload))).toEqual(payload);
      expect(payload.userId).toBeNull();
    });

    it("rejects a ticket whose viewer scope is bound to another game", () => {
      const raw = JSON.stringify({
        v: 1,
        userId: "user-1",
        gameSlug: "cyberpunk",
        createdAt: 123,
        viewerScope: {
          gameSlug: "gundam",
          matchId: "match-1",
          gameId: "game-1",
          role: "player",
          actorId: "actor-1",
          userId: "user-1",
          expiresAt: 456,
        },
      });

      expect(parseWsTicketPayload(raw)).toBeNull();
    });

    it.each([
      "not-json",
      "null",
      "[]",
      "{}",
      '{"userId":""}',
      '{"userId":42}',
      '{"userId":"u","gameSlug":"unknown"}',
      '{"v":2,"userId":"u"}',
      '{"v":1,"userId":"u"}',
      '{"userId":"u","createdAt":"now"}',
      '{"userId":"u","createdAt":-1}',
    ])("rejects malformed or unsupported payload %s", (raw) => {
      expect(parseWsTicketPayload(raw)).toBeNull();
    });

    it("flags v1 tickets older than the TTL as stale", () => {
      const now = 1_000_000;
      const fresh = createWsTicketPayload("user-1", { createdAt: now - 1_000 });
      const boundary = createWsTicketPayload("user-1", {
        createdAt: now - WS_TICKET_MAX_AGE_MS,
      });
      const stale = createWsTicketPayload("user-1", {
        createdAt: now - WS_TICKET_MAX_AGE_MS - 1,
      });

      expect(isWsTicketFresh(fresh, now)).toBe(true);
      expect(isWsTicketFresh(boundary, now)).toBe(true);
      expect(isWsTicketFresh(stale, now)).toBe(false);
    });

    it("rejects future-dated v1 tickets", () => {
      const now = 1_000_000;
      const future = createWsTicketPayload("user-1", { createdAt: now + 1 });

      expect(isWsTicketFresh(future, now)).toBe(false);
    });

    it("honors an issuer-specific max age", () => {
      const payload = createWsTicketPayload("user-1", { createdAt: 1_000_000 - 45_000 });

      expect(isWsTicketFresh(payload, 1_000_000, 30_000)).toBe(false);
      expect(isWsTicketFresh(payload, 1_000_000, 60_000)).toBe(true);
    });

    it("treats legacy payloads without createdAt as fresh (nothing to check)", () => {
      const legacy = parseWsTicketPayload('{"userId":"legacy","gameSlug":"lorcana"}');
      expect(legacy).not.toBeNull();
      expect(isWsTicketFresh(legacy!)).toBe(true);
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

    it("round-trips a verified viewer scope", () => {
      const env = buildEnvelope({
        type: "join_game",
        payload: { gameId: "g1" },
        gameSlug: "gundam",
        correlationId: "cid",
        socketId: "s1",
        userId: "u1",
        authed: true,
        viewerScope: {
          gameSlug: "gundam",
          matchId: "m1",
          gameId: "g1",
          role: "player",
          actorId: "p1",
          userId: "u1",
          expiresAt: 2_000_000_000_000,
        },
      });
      expect(parseEnvelope(serializeEnvelope(env))?.viewerScope).toEqual(env.viewerScope);
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
