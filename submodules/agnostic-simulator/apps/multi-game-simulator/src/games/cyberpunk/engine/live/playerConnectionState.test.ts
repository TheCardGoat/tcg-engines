import { describe, expect, test } from "vite-plus/test";
import { applyPresenceDiagnostics } from "./playerConnectionState";

describe("applyPresenceDiagnostics", () => {
  test("mirrors session-owned presence into per-side connection state", () => {
    const next = applyPresenceDiagnostics(
      {
        player: { status: "connected", connected: true },
        opponent: { status: "connected", connected: true },
      },
      { player: "gp_self", opponent: "gp_opp" },
      [
        {
          playerId: "gp_opp",
          status: "disconnected",
          connected: false,
          disconnectedAt: "2026-01-02T00:00:00.000Z",
          latencyMs: 240,
          disconnectCount: 1,
        },
      ],
    );

    expect(next.opponent).toMatchObject({
      status: "disconnected",
      connected: false,
      disconnectedAt: "2026-01-02T00:00:00.000Z",
      latencyMs: 240,
      disconnectCount: 1,
    });
    expect(next.player).toMatchObject({ status: "connected", connected: true });
  });
});
