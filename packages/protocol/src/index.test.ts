import { describe, expect, it } from "bun:test";
import {
  NEEDS_DEDUP,
  PLAYABLE_GAME_SLUGS,
  buildEnvelope,
  inboxConsumerGroupName,
  inboxDlqKey,
  inboxProcessedKey,
  inboxStreamKey,
  isPlayableGameSlug,
  parseEnvelope,
  serializeEnvelope,
} from ".";
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
        expectedVersion: 5,
        gameId: "g1",
        moveType: "play_card",
        payload: { cardId: "c1" },
        type: "execute_move",
      });
      expect(result.success).toBe(true);
    });

    it("rejects execute_move missing required fields", () => {
      const result = GatewayClientMessage.safeParse({
        gameId: "g1",
        type: "execute_move",
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
        authed: false,
        correlationId: "cid",
        gameSlug: "lorcana",
        payload: { t: 7 },
        socketId: "s1",
        type: "ping",
        userId: null,
      });
      const fields = serializeEnvelope(env);
      expect(fields.gameSlug).toBe("lorcana");
      const parsed = parseEnvelope(fields);
      expect(parsed?.gameSlug).toBe("lorcana");
      expect(parsed?.type).toBe("ping");
    });

    it("rejects an envelope with an unknown slug (DLQ)", () => {
      const env = buildEnvelope({
        authed: false,
        correlationId: "cid",
        gameSlug: "lorcana",
        payload: { t: 1 },
        socketId: "s1",
        type: "ping",
        userId: null,
      });
      const fields = { ...serializeEnvelope(env), gameSlug: "not-a-game" };
      expect(parseEnvelope(fields)).toBeNull();
    });

    it("rejects an envelope missing the slug entirely", () => {
      const env = buildEnvelope({
        authed: false,
        correlationId: "cid",
        gameSlug: "lorcana",
        payload: { t: 1 },
        socketId: "s1",
        type: "ping",
        userId: null,
      });
      const { gameSlug: _drop, ...withoutSlug } = serializeEnvelope(env);
      void _drop;
      expect(parseEnvelope(withoutSlug)).toBeNull();
    });
  });
});
