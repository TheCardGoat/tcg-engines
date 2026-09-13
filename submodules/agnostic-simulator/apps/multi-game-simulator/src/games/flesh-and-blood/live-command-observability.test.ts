import { beforeEach, describe, expect, it, vi } from "vitest";

const telemetry = vi.hoisted(() => ({ info: vi.fn(), error: vi.fn() }));

vi.mock("../../observability/browser", () => ({
  logBrowserInfo: telemetry.info,
  logBrowserError: telemetry.error,
}));

import {
  logFabLiveCommandResponse,
  logFabLiveCommandSent,
  logFabLiveCommandTimeout,
} from "./live-command-observability";

const command = {
  gameId: "game-1",
  matchId: "match-1",
  actorId: "player-1",
  expectedVersion: 7,
  correlationId: "correlation-1",
  submission: {
    protocolVersion: 1,
    requestId: "fab:7",
    actionId: "fab:pass",
    stateVersion: 7,
    values: {},
  },
} as const;

describe("FAB live command observability", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    telemetry.info.mockReset();
    telemetry.error.mockReset();
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("records the complete submitted command in the console and browser telemetry", () => {
    logFabLiveCommandSent(command);
    expect(console.info).toHaveBeenCalledWith("[fab-live] command sent", command);
    expect(telemetry.info).toHaveBeenCalledWith(
      "fab.live.command.sent",
      expect.objectContaining({
        "gateway.request_id": "correlation-1",
        "game.command.action_id": "fab:pass",
        "game.command.submission": JSON.stringify(command.submission),
      }),
    );
  });

  it("records the server response and escalates rejections and timeouts", () => {
    const response = {
      gameId: "game-1",
      correlationId: "correlation-1",
      code: "rejected_stale",
      reason: "State changed",
      currentVersion: 8,
    };
    logFabLiveCommandResponse("rejected", response, command);
    logFabLiveCommandTimeout(command);
    expect(console.error).toHaveBeenCalledWith(
      "[fab-live] command response",
      expect.objectContaining({ response }),
    );
    expect(telemetry.info).toHaveBeenCalledWith(
      "fab.live.command.response",
      expect.objectContaining({ "game.command.response": JSON.stringify(response) }),
    );
    expect(telemetry.error).toHaveBeenCalledWith("fab.live.command.rejected", expect.anything());
    expect(telemetry.error).toHaveBeenCalledWith(
      "fab.live.command.confirmation_timeout",
      expect.objectContaining({ "gateway.request_id": "correlation-1" }),
    );
  });
});
