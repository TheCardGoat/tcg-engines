import { describe, expect, test, vi } from "vite-plus/test";
import type { GatewayHandle } from "@tcg/gateway-client";
import type { LiveGatewayMessage } from "../engine/live/liveGateway";
import {
  canRunClientAuthorityPracticeForContext,
  emitGatewayChatPreset,
  emitGatewayChatText,
  emitGatewayFreeTextRequest,
  reduceLiveChatPolicy,
  systemChatMessageText,
} from "./LiveMatch.page";
import type { LiveMatchContext } from "../engine/live/matchContext";

function fakeHandle(): Pick<GatewayHandle, "emit"> & {
  emit: ReturnType<typeof vi.fn>;
} {
  return { emit: vi.fn() };
}

function liveMatchContext({
  authority,
  actorIds,
}: {
  authority: LiveMatchContext["game"]["authority"];
  actorIds: NonNullable<LiveMatchContext["game"]["actorIds"]>;
}): LiveMatchContext {
  return {
    match: {
      matchId: "match_1",
      status: "in_progress",
      format: "best_of_1",
      gameIds: ["game_1"],
      participants: [],
    },
    game: {
      gameId: "game_1",
      gameNumber: 1,
      status: "in_progress",
      authority,
      actorIds,
      state: null,
      version: 0,
    },
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

describe("live match player identity gates", () => {
  test("allows client-authority practice when the player id is derived from context", () => {
    expect(
      canRunClientAuthorityPracticeForContext(
        liveMatchContext({
          authority: "client",
          actorIds: { player: "profile_1", opponent: "bot_1" },
        }),
        true,
        "profile_1",
      ),
    ).toBe(true);
  });

  test("keeps spectators out of client-authority practice controls", () => {
    expect(
      canRunClientAuthorityPracticeForContext(
        liveMatchContext({
          authority: "client",
          actorIds: { player: "profile_1", opponent: "bot_1" },
        }),
        true,
        undefined,
      ),
    ).toBe(false);
    expect(
      canRunClientAuthorityPracticeForContext(
        liveMatchContext({
          authority: "client",
          actorIds: { player: "profile_1", opponent: "bot_1" },
        }),
        true,
        "spectator_profile",
      ),
    ).toBe(false);
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

describe("live proposal system chat labels", () => {
  test("renders undo proposal lifecycle events as readable system messages", () => {
    expect(systemChatMessageText("undo_proposed")).toBe("Undo requested.");
    expect(systemChatMessageText("undo_accepted")).toBe("Undo request accepted.");
    expect(systemChatMessageText("undo_declined")).toBe("Undo request rejected.");
    expect(systemChatMessageText("undo_expired")).toBe("Undo request expired.");
  });

  test("renders server drop system events with their reason", () => {
    expect(systemChatMessageText("Drop claimed: Opponent timed out")).toBe(
      "Drop approved: opponent timed out.",
    );
    expect(systemChatMessageText("Drop claimed: Opponent disconnected")).toBe(
      "Drop approved: opponent disconnected.",
    );
  });
});
