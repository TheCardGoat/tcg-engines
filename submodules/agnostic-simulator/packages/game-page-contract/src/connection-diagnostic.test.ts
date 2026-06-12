import { describe, expect, test } from "bun:test";

import {
  buildSimulatorConnectionDiagnostic,
  stringifySimulatorConnectionDiagnostic,
} from "./connection-diagnostic.js";

describe("simulator connection diagnostics", () => {
  test("builds stable support payloads without credentials", () => {
    const diagnostic = buildSimulatorConnectionDiagnostic({
      generatedAt: "2026-05-28T12:00:00.000Z",
      gameSlug: "cyberpunk",
      route: "/matches/match_1/games/game_1?ticket=secret_route_ticket",
      matchId: "match_1",
      gameId: "game_1",
      playerId: "player_1",
      playerSide: "player",
      endpoint: {
        realtimeConfigured: true,
        origin: "wss://gateway.example.test",
        namespace: "/cyberpunk",
        path: "/socket.io/",
        transport: "websocket",
      },
      connection: {
        status: "connected",
        connectionId: "conn_1",
        socketId: "sock_1",
        authModeLabel: "Authenticated (ticket)",
        authenticated: true,
        latencyMs: 42,
        lastPongAt: "2026-05-28T12:00:01.000Z",
      },
      presence: [
        {
          side: "player",
          playerId: "player_1",
          status: "connected",
          connected: true,
          latencyMs: 42,
          self: true,
        },
      ],
      events: [
        {
          at: "2026-05-28T12:00:01.000Z",
          type: "welcome",
          details: {
            ticket: "secret_ticket",
            authToken: "secret_token",
            nested: { sessionCookie: "secret_cookie" },
            safe: "kept",
          },
        },
      ],
    });

    expect(diagnostic.schemaVersion).toBe(1);
    expect(diagnostic.endpoint.origin).toBe("wss://gateway.example.test");
    expect(diagnostic.connection.authModeLabel).toBe("Authenticated (ticket)");

    const json = stringifySimulatorConnectionDiagnostic(diagnostic);
    expect(json).toContain('"matchId": "match_1"');
    expect(json).toContain('"route": "/matches/match_1/games/game_1?ticket=%5Bredacted%5D"');
    expect(json).toContain('"safe": "kept"');
    expect(json).not.toContain("secret_route_ticket");
    expect(json).not.toContain("secret_ticket");
    expect(json).not.toContain("secret_token");
    expect(json).not.toContain("secret_cookie");
    expect(json).toContain('"ticket": "[redacted]"');
    expect(json).toContain('"authToken": "[redacted]"');
    expect(json).toContain('"sessionCookie": "[redacted]"');
  });

  test("reports unavailable realtime without inventing socket state", () => {
    const diagnostic = buildSimulatorConnectionDiagnostic({
      generatedAt: "2026-05-28T08:00:00.000Z",
      gameSlug: "one-piece",
      route: "/",
      endpoint: { realtimeConfigured: false },
      connection: { status: "unavailable" },
    });

    expect(diagnostic.generatedAt).toBe("2026-05-28T08:00:00.000Z");
    expect(diagnostic.endpoint.realtimeConfigured).toBe(false);
    expect(diagnostic.connection.status).toBe("unavailable");
  });
});
