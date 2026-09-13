import { describe, expect, test, vi } from "vite-plus/test";
import type { GatewayHandle } from "@tcg/gateway-client";

import type { LiveGatewayMessage } from "./liveGateway.ts";
import {
  emitGatewayChatPreset,
  emitGatewayChatText,
  emitGatewayFreeTextRequest,
  mergeRemoteChatMessage,
  reduceLiveChatPolicy,
  remoteChatMessageForViewer,
  remoteChatMessagesForViewer,
  systemChatMessageText,
} from "./liveChat.ts";
import { parseRemoteChatMessages } from "./matchContext.ts";

function fakeHandle(): Pick<GatewayHandle, "emit"> & {
  emit: ReturnType<typeof vi.fn<GatewayHandle["emit"]>>;
} {
  return { emit: vi.fn<GatewayHandle["emit"]>() };
}

const VIEWER_ID = "profile_viewer";

function remoteChatRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "msg-1",
    matchId: "match-1",
    gameId: "game-1",
    senderPlayerId: "profile_rival",
    senderSeat: 2,
    kind: "preset",
    presetKey: "good_luck",
    createdAt: "2026-07-09T00:00:00.000Z",
    expiresAt: "2026-07-10T00:00:00.000Z",
    ...overrides,
  };
}

describe("live chat gateway helpers", () => {
  test("emits hosted preset chat messages through the gateway", () => {
    const handle = fakeHandle();

    const sent = emitGatewayChatPreset(handle, "game-1", "good_luck");

    expect(sent).toBe(true);
    expect(handle.emit).toHaveBeenCalledWith("send_chat_message", {
      gameId: "game-1",
      presetKey: "good_luck",
    });
  });

  test("emits hosted free text chat messages through the gateway", () => {
    const handle = fakeHandle();

    const sent = emitGatewayChatText(handle, "game-1", "  Nice play.  ");

    expect(sent).toBe(true);
    expect(handle.emit).toHaveBeenCalledWith("send_free_text_chat_message", {
      gameId: "game-1",
      text: "Nice play.",
    });
  });

  test("does not emit free text chat approval requests until inbox handling exists", () => {
    const handle = fakeHandle();

    const sent = emitGatewayFreeTextRequest(handle, "game-1");

    expect(sent).toBe(false);
    expect(handle.emit).not.toHaveBeenCalled();
  });
});

describe("live chat policy reducer", () => {
  test("hydrates enabled free text from chat history", () => {
    const next = reduceLiveChatPolicy(
      { freeTextEnabled: false, freeTextProposalPending: true },
      {
        type: "game_chat_history",
        gameId: "game-1",
        matchId: "match-1",
        messages: [],
        freeTextEnabled: true,
      },
    );

    expect(next).toEqual({ freeTextEnabled: true, freeTextProposalPending: false });
  });

  test("enables free text when an approval proposal resolves accepted", () => {
    const next = reduceLiveChatPolicy(
      { freeTextEnabled: false, freeTextProposalPending: true },
      {
        type: "proposal_resolved",
        gameId: "game-1",
        matchId: "match-1",
        actionType: "enable_free_text_chat",
        resolution: "accepted",
      },
    );

    expect(next).toEqual({ freeTextEnabled: true, freeTextProposalPending: false });
  });

  test("clears pending state when a free text proposal is declined or expired", () => {
    const declined = reduceLiveChatPolicy(
      { freeTextEnabled: false, freeTextProposalPending: true },
      {
        type: "proposal_resolved",
        gameId: "game-1",
        matchId: "match-1",
        actionType: "enable_free_text_chat",
        resolution: "declined",
      },
    );
    const expired = reduceLiveChatPolicy(declined, {
      type: "proposal_expired",
      gameId: "game-1",
      matchId: "match-1",
      actionType: "enable_free_text_chat",
    });

    expect(declined).toEqual({ freeTextEnabled: false, freeTextProposalPending: false });
    expect(expired).toEqual({ freeTextEnabled: false, freeTextProposalPending: false });
  });

  test("clears pending state when the server reports free text chat is disabled", () => {
    const viaGatewayError = reduceLiveChatPolicy(
      { freeTextEnabled: false, freeTextProposalPending: true },
      {
        type: "gateway_error",
        code: "free_text_chat_disabled",
        message: "Free text chat is disabled for this match.",
      },
    );
    const viaError = reduceLiveChatPolicy(
      { freeTextEnabled: false, freeTextProposalPending: true },
      {
        type: "error",
        code: "free_text_chat_disabled",
        message: "Free text chat is disabled for this match.",
      },
    );

    expect(viaGatewayError).toEqual({ freeTextEnabled: false, freeTextProposalPending: false });
    expect(viaError).toEqual({ freeTextEnabled: false, freeTextProposalPending: false });
  });

  test("enables free text from the system chat event", () => {
    const next = reduceLiveChatPolicy({ freeTextEnabled: false, freeTextProposalPending: true }, {
      type: "chat_message",
      gameId: "game-1",
      matchId: "match-1",
      message: {
        id: "msg-1",
        matchId: "match-1",
        gameId: "game-1",
        senderPlayerId: "system",
        senderSeat: 0,
        kind: "system",
        systemEvent: "free_text_chat_enabled",
        createdAt: "2026-07-09T00:00:00.000Z",
        expiresAt: "2026-07-10T00:00:00.000Z",
      },
    } as LiveGatewayMessage);

    expect(next).toEqual({ freeTextEnabled: true, freeTextProposalPending: false });
  });
});

describe("remote chat message mapping", () => {
  test("attributes messages from the viewer to the player side", () => {
    const message = remoteChatMessageForViewer(
      remoteChatRecord({ senderPlayerId: VIEWER_ID, senderSeat: 1 }),
      VIEWER_ID,
    );

    expect(message).toMatchObject({ kind: "preset", senderSide: "player", presetKey: "good_luck" });
  });

  test("attributes messages from anyone else to the opponent side", () => {
    const message = remoteChatMessageForViewer(remoteChatRecord(), VIEWER_ID);

    expect(message).toMatchObject({
      kind: "preset",
      senderSide: "opponent",
      presetKey: "good_luck",
    });
  });

  test("maps free text and system messages", () => {
    const text = remoteChatMessageForViewer(
      remoteChatRecord({ kind: "text", text: "Hello there.", presetKey: undefined }),
      VIEWER_ID,
    );
    const system = remoteChatMessageForViewer(
      remoteChatRecord({
        kind: "system",
        senderPlayerId: "system",
        senderSeat: 0,
        presetKey: undefined,
        systemEvent: "free_text_chat_enabled",
      }),
      VIEWER_ID,
    );

    expect(text).toMatchObject({ kind: "text", senderSide: "opponent", text: "Hello there." });
    expect(system).toMatchObject({ kind: "system", text: "Free text chat enabled." });
  });

  test("hydrates history and drops malformed entries", () => {
    const messages = remoteChatMessagesForViewer(
      parseRemoteChatMessages([remoteChatRecord(), { bogus: true }]),
      VIEWER_ID,
    );

    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({ kind: "preset", senderSide: "opponent" });
  });

  test("merge dedupes by message id and keeps the same array reference", () => {
    const [message] = remoteChatMessagesForViewer(
      parseRemoteChatMessages([remoteChatRecord()]),
      VIEWER_ID,
    );
    if (!message) throw new Error("expected a mapped message");

    const once = mergeRemoteChatMessage([], message);
    const twice = mergeRemoteChatMessage(once, message);

    expect(once).toHaveLength(1);
    expect(twice).toBe(once);
  });
});

describe("system chat labels", () => {
  test("renders free-text lifecycle events as readable system messages", () => {
    expect(systemChatMessageText("free_text_chat_enabled")).toBe("Free text chat enabled.");
    expect(systemChatMessageText("enable_free_text_chat_proposed")).toBe(
      "Free text chat requested.",
    );
    expect(systemChatMessageText("enable_free_text_chat_declined")).toBe(
      "Free text chat request rejected.",
    );
    expect(systemChatMessageText("enable_free_text_chat_expired")).toBe(
      "Free text chat request expired.",
    );
  });

  test("falls back to the raw event for unknown system events", () => {
    expect(systemChatMessageText("some_other_event")).toBe("some_other_event");
    expect(systemChatMessageText(undefined)).toBe("System message.");
  });
});
