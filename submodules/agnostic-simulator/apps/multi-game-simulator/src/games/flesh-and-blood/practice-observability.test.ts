import { afterEach, describe, expect, it, vi } from "vitest";

const telemetry = vi.hoisted(() => ({
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
}));

vi.mock("../../observability/browser", () => ({
  logBrowserError: telemetry.error,
  logBrowserInfo: telemetry.info,
  logBrowserWarn: telemetry.warn,
}));

import {
  reportFabPracticeCommandFailure,
  reportFabPracticeDispatchException,
  reportFabPracticeCommandSubmitted,
  reportFabPracticeRulesReversal,
  runFabPracticePostCommandWork,
} from "./practice-observability";

const command = {
  actorId: "player-1",
  commandLabel: "Confirm selections",
  commandMove: "answer-decision",
  stateID: 7,
  turnNumber: 1,
} as const;

afterEach(() => {
  vi.restoreAllMocks();
  telemetry.error.mockReset();
  telemetry.info.mockReset();
  telemetry.warn.mockReset();
});

describe("FAB practice observability", () => {
  it("contains post-command presentation failures after the engine accepts a command", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    runFabPracticePostCommandWork({
      commandId: "practice:8:1",
      stage: "animation",
      work: () => {
        throw new TypeError("Unknown animation event.");
      },
    });

    expect(consoleError).toHaveBeenCalledWith(
      "[fab-practice] non-blocking post-command task failed",
      expect.objectContaining({
        "fab.command.id": "practice:8:1",
        "fab.post_command.stage": "animation",
        "exception.message": "Unknown animation event.",
      }),
    );
    expect(telemetry.error).toHaveBeenCalledWith(
      "fab.practice.post_command_failure",
      expect.objectContaining({ "fab.post_command.stage": "animation" }),
    );
  });

  it("records the command submitted to the engine without its payload", () => {
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => undefined);

    reportFabPracticeCommandSubmitted({ ...command, commandId: "practice:8:1" });

    expect(consoleInfo).toHaveBeenCalledWith(
      "[fab-practice] engine command submitted",
      expect.objectContaining({
        "fab.command.id": "practice:8:1",
        "fab.command.label": "Confirm selections",
        "fab.command.move": "answer-decision",
      }),
    );
    expect(telemetry.info).toHaveBeenCalledWith(
      "fab.practice.command_submitted",
      expect.objectContaining({ "fab.command.id": "practice:8:1" }),
    );
  });

  it("reports a rules reversal as a warning rather than an engine error", () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    reportFabPracticeRulesReversal({
      ...command,
      action: "play-card",
      reasonCode: "required_targets_unavailable",
      reasonMessage: "Required targets are unavailable.",
    });

    expect(consoleWarn).toHaveBeenCalledOnce();
    expect(consoleError).not.toHaveBeenCalled();
    expect(telemetry.warn).toHaveBeenCalledWith(
      "fab.practice.rules_action_reversed",
      expect.objectContaining({
        "fab.reversal.reason_code": "required_targets_unavailable",
      }),
    );
    expect(telemetry.error).not.toHaveBeenCalled();
  });

  it("reports a rejected command to the console and error exporter", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    reportFabPracticeCommandFailure({
      ...command,
      error: "Decision state is stale.",
      errorCode: "stale_decision",
    });

    expect(consoleError).toHaveBeenCalledOnce();
    expect(telemetry.error).toHaveBeenCalledWith(
      "fab.practice.command_rejected",
      expect.objectContaining({
        "error.code": "stale_decision",
        "error.message": "Decision state is stale.",
      }),
    );
  });

  it("reports a caught dispatch exception with its diagnostic context", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    reportFabPracticeDispatchException(command, new TypeError("Engine invariant failed."));

    expect(consoleError).toHaveBeenCalledOnce();
    expect(telemetry.error).toHaveBeenCalledWith(
      "fab.practice.dispatch_exception",
      expect.objectContaining({
        "exception.type": "TypeError",
        "exception.message": "Engine invariant failed.",
        "fab.command.move": "answer-decision",
      }),
    );
  });
});
