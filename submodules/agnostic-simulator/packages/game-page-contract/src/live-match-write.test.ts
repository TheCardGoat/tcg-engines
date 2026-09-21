import { describe, expect, it } from "vitest";

import {
  canEmitLiveMatchWrite,
  describeLiveMatchWriteGate,
  shouldShowLiveBoardSyncing,
} from "./live-match-write.js";

const playerViewer = {
  role: "player" as const,
  permissions: { act: true },
};

const readyConnection = {
  status: "connected" as const,
  authenticated: true,
  authStatus: "ok" as const,
  authFailureReason: null,
  wouldHoldEmit: false,
};

describe("canEmitLiveMatchWrite", () => {
  it("allows a seated player when the socket will send now", () => {
    expect(
      canEmitLiveMatchWrite({
        connection: readyConnection,
        viewer: playerViewer,
        capabilities: { actions: true },
        gameStatus: "in_progress",
        bootstrapGameId: "g1",
        emitGameId: "g1",
      }),
    ).toEqual({ ok: true });
  });

  it("does not wait for game_joined", () => {
    expect(
      canEmitLiveMatchWrite({
        connection: readyConnection,
        viewer: playerViewer,
        capabilities: { actions: true },
        gameStatus: "in_progress",
        bootstrapGameId: "g1",
        emitGameId: "g1",
      }).ok,
    ).toBe(true);
  });

  it("refuses an emit that gateway-client would queue", () => {
    expect(
      canEmitLiveMatchWrite({
        connection: { ...readyConnection, wouldHoldEmit: true },
        viewer: playerViewer,
        capabilities: { actions: true },
        gameStatus: "in_progress",
        bootstrapGameId: "g1",
        emitGameId: "g1",
      }),
    ).toEqual({ ok: false, reason: "emit_held" });
    expect(
      canEmitLiveMatchWrite({
        connection: {
          ...readyConnection,
          authFailureReason: "viewer_scope_expired",
        },
        viewer: playerViewer,
        capabilities: { actions: true },
        gameStatus: "in_progress",
        bootstrapGameId: "g1",
        emitGameId: "g1",
      }),
    ).toEqual({ ok: false, reason: "emit_held" });
  });

  it("distinguishes spectator from a seated player who cannot act", () => {
    expect(
      canEmitLiveMatchWrite({
        connection: readyConnection,
        viewer: { role: "spectator", permissions: { act: false } },
        capabilities: { actions: true },
        gameStatus: "in_progress",
        bootstrapGameId: "g1",
        emitGameId: "g1",
      }),
    ).toEqual({ ok: false, reason: "spectator" });
    expect(
      canEmitLiveMatchWrite({
        connection: readyConnection,
        viewer: { role: "player", permissions: { act: false } },
        capabilities: { actions: true },
        gameStatus: "in_progress",
        bootstrapGameId: "g1",
        emitGameId: "g1",
      }),
    ).toEqual({ ok: false, reason: "cannot_act" });
  });

  it("refuses a disconnected or unauthenticated socket", () => {
    expect(
      canEmitLiveMatchWrite({
        connection: { ...readyConnection, status: "reconnecting" },
        viewer: playerViewer,
        capabilities: { actions: true },
        gameStatus: "in_progress",
        bootstrapGameId: "g1",
        emitGameId: "g1",
      }),
    ).toEqual({ ok: false, reason: "not_connected" });
    expect(
      canEmitLiveMatchWrite({
        connection: { ...readyConnection, authenticated: false },
        viewer: playerViewer,
        capabilities: { actions: true },
        gameStatus: "in_progress",
        bootstrapGameId: "g1",
        emitGameId: "g1",
      }),
    ).toEqual({ ok: false, reason: "not_authenticated" });
  });

  it("distinguishes a completed game from a generic read-only session", () => {
    expect(
      canEmitLiveMatchWrite({
        connection: readyConnection,
        viewer: { role: "player", permissions: { act: false } },
        capabilities: { actions: false },
        gameStatus: "completed",
        bootstrapGameId: "g1",
        emitGameId: "g1",
      }),
    ).toEqual({ ok: false, reason: "game_complete" });

    expect(describeLiveMatchWriteGate("game_complete")).toEqual({
      title: "This game has ended",
      message:
        "The final result has been recorded. View the match summary or return to matchmaking.",
    });
  });
});

describe("shouldShowLiveBoardSyncing", () => {
  it("shows until a live server version has caught up", () => {
    expect(shouldShowLiveBoardSyncing({ knownServerVersion: null, localVersion: 0 })).toBe(true);
    expect(shouldShowLiveBoardSyncing({ knownServerVersion: 1, localVersion: 0 })).toBe(true);
    expect(shouldShowLiveBoardSyncing({ knownServerVersion: 1, localVersion: 1 })).toBe(false);
  });
});

describe("describeLiveMatchWriteGate", () => {
  it("does not claim the player is still being seated", () => {
    expect(describeLiveMatchWriteGate("emit_held").title).toBe("Match session is refreshing");
    expect(describeLiveMatchWriteGate("not_connected").message).not.toMatch(/seating/i);
  });
});
