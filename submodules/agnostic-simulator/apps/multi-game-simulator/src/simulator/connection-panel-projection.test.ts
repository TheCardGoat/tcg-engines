import { describe, expect, test } from "vite-plus/test";

import { projectConnectionPanelDiagnostic } from "./connection-panel-projection";

describe("projectConnectionPanelDiagnostic", () => {
  test("keeps panel-safe connection, presence, and event fields", () => {
    const diagnostic = projectConnectionPanelDiagnostic({
      gameSlug: "gundam",
      route: "/gundam/simulator/matches/m1/games/g1",
      endpoint: { realtimeConfigured: true },
      connection: {
        status: "connected",
        connectionId: "connection-1",
        authModeLabel: "Session",
        authenticated: true,
        authStatus: "ok",
        latencyMs: 42,
        lastHeartbeatAckAt: "2026-07-19T10:00:00.000Z",
      },
      presence: [
        { side: "player", status: "connected", latencyMs: 42 },
        { side: "spectator", status: "unknown" },
      ],
      events: [
        { at: "2026-07-19T10:00:00.000Z", type: "connect", message: "Connected" },
        { at: "2026-07-19T10:00:01.000Z", type: "heartbeat" },
      ],
    });

    expect(diagnostic).toEqual({
      connection: {
        connectionId: "connection-1",
        socketId: undefined,
        authModeLabel: "Session",
        authenticated: true,
        authStatus: "ok",
        authFailureReason: undefined,
        reconnectAttempts: undefined,
        disconnectCount: undefined,
        latencyMs: 42,
        lastPingAt: undefined,
        lastPongAt: undefined,
        lastHeartbeatSentAt: undefined,
        lastHeartbeatAckAt: "2026-07-19T10:00:00.000Z",
      },
      presence: [{ side: "player", status: "connected", latencyMs: 42 }],
      events: [{ at: "2026-07-19T10:00:00.000Z", message: "Connected" }],
    });
  });
});
