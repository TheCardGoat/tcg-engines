// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";

import { createPracticeEngineForSessionTest } from "./practice-session.test-support";
import {
  clearGrandArchivePracticeSession,
  persistGrandArchivePracticeSession,
  restoreGrandArchivePracticeSession,
  undoGrandArchivePracticeCommand,
} from "./practice-session";

describe("Grand Archive practice session", () => {
  beforeEach(() => clearGrandArchivePracticeSession());

  it("restores a validated replay journal with its bot settings", () => {
    const server = createPracticeEngineForSessionTest();
    const view = server.getInteractionView("p1");
    const action = view.actions.find((candidate) => candidate.text.key.includes("pre-game"))!;
    const result = server.submitInteraction("p1", buildInteractionSubmission({ view, action }), {
      gameId: "ga-session-test",
      sourceAuthority: "client",
    });
    expect(result.success).toBe(true);
    expect(
      persistGrandArchivePracticeSession(server, "value-extract", "step", [
        {
          id: 1,
          recordedAt: 1_725_000_000_000,
          turn: 0,
          actorId: "p1",
          message: "Check the opening sequence",
        },
      ]),
    ).toBe(true);

    const restored = restoreGrandArchivePracticeSession(createPracticeEngineForSessionTest);
    expect(restored.kind).toBe("restored");
    if (restored.kind !== "restored") return;
    expect(restored.server.runtime.state.stateVersion).toBe(server.runtime.state.stateVersion);
    expect(restored.strategyId).toBe("value-extract");
    expect(restored.botPacing).toBe("step");
    expect(restored.chatMessages).toEqual([
      {
        id: 1,
        recordedAt: 1_725_000_000_000,
        turn: 0,
        actorId: "p1",
        message: "Check the opening sequence",
      },
    ]);
  });

  it("undoes the viewer command together with the following bot response", () => {
    const server = createPracticeEngineForSessionTest();
    const view = server.getInteractionView("p1");
    const action = view.actions.find((candidate) => candidate.text.key.includes("pre-game"))!;
    server.submitInteraction("p1", buildInteractionSubmission({ view, action }), {
      gameId: "ga-session-test",
      sourceAuthority: "client",
    });
    const botView = server.getInteractionView("p2");
    const botAction = botView.actions.find((candidate) => candidate.text.key.includes("pre-game"))!;
    server.submitInteraction(
      "p2",
      buildInteractionSubmission({ view: botView, action: botAction }),
      {
        gameId: "ga-session-test",
        sourceAuthority: "client",
      },
    );

    const undone = undoGrandArchivePracticeCommand(server, "p1");
    expect(undone?.runtime.state.stateVersion).toBe(0);
    expect(undone?.replayJournal.commands).toHaveLength(0);
  });

  it("discards a saved session from a different card catalog", () => {
    const server = createPracticeEngineForSessionTest();
    expect(persistGrandArchivePracticeSession(server, "value-extract", "step")).toBe(true);
    const key = window.sessionStorage.key(0);
    if (!key) throw new Error("Expected the persisted practice session key");
    const saved = JSON.parse(window.sessionStorage.getItem(key)!) as Record<string, unknown>;
    window.sessionStorage.setItem(
      key,
      JSON.stringify({ ...saved, programFingerprint: "different-catalog" }),
    );

    expect(restoreGrandArchivePracticeSession(createPracticeEngineForSessionTest)).toEqual({
      kind: "none",
    });
    expect(window.sessionStorage.getItem(key)).toBeNull();
  });
});
