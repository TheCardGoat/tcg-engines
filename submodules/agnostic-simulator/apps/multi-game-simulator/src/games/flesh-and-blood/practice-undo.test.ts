import { describe, expect, it } from "vitest";
import {
  classifyFabPracticeUndoMove,
  fabPracticeUndoBlockedByBarrier,
  nextFabPracticeUndoPoint,
} from "./practice-undo";
import type { FabUndoBarrier } from "@tcg/flesh-and-blood-engine/simulator";

interface StubSnapshot {
  readonly seed: string;
}

function point(seed: string): {
  snapshot: StubSnapshot;
  telemetryLength: number;
  analyticsLength: number;
} {
  return { snapshot: { seed }, telemetryLength: 1, analyticsLength: 0 };
}

describe("practice undo policy", () => {
  it("treats the actor's own hidden-to-public moves as undoable in practice", () => {
    const barrier: FabUndoBarrier = { reasons: ["move-hidden-to-public"] };
    expect(fabPracticeUndoBlockedByBarrier(barrier)).toBe(false);
  });

  it("keeps hidden-information draws, looks, and randomness final", () => {
    const reasons = [
      "draw",
      "reveal",
      "look-hidden-zone",
      "search-hidden-zone",
      "shuffle",
      "random-result",
    ] as const;
    for (const reason of reasons) {
      expect(fabPracticeUndoBlockedByBarrier({ reasons: [reason] })).toBe(true);
    }
    expect(fabPracticeUndoBlockedByBarrier({ reasons: ["move-hidden-to-public", "draw"] })).toBe(
      true,
    );
    expect(fabPracticeUndoBlockedByBarrier(null)).toBe(false);
  });

  it("classifies decision answers and passes as continuations of the interaction", () => {
    expect(
      classifyFabPracticeUndoMove({ move: "answer-decision", answersPendingDecision: true }),
    ).toBe("decision-answer");
    expect(classifyFabPracticeUndoMove({ move: "pass", answersPendingDecision: false })).toBe(
      "pass",
    );
    expect(classifyFabPracticeUndoMove({ move: "begin-play", answersPendingDecision: false })).toBe(
      "interaction-start",
    );
  });

  it("keeps the pre-play undo point across a decline that would resurrect the prompt", () => {
    const prePlay = point("pre-play");
    const promptState = point("prompt-state");
    const next = nextFabPracticeUndoPoint<StubSnapshot>({
      moveKind: "decision-answer",
      barrier: null,
      current: prePlay,
      next: promptState,
    });
    expect(next).toBe(prePlay);
  });

  it("never arms an undo point onto a declined prompt state", () => {
    const promptState = point("prompt-state");
    const next = nextFabPracticeUndoPoint<StubSnapshot>({
      moveKind: "decision-answer",
      barrier: null,
      current: null,
      next: promptState,
    });
    expect(next).toBeNull();
  });

  it("keeps the interaction undo point across the passes that resolve it", () => {
    const prePlay = point("pre-play");
    const prePass = point("pre-pass");
    const next = nextFabPracticeUndoPoint<StubSnapshot>({
      moveKind: "pass",
      barrier: null,
      current: prePlay,
      next: prePass,
    });
    expect(next).toBe(prePlay);
  });

  it("arms the undo point on a lone pass so a premature pass stays undoable", () => {
    const prePass = point("pre-pass");
    const next = nextFabPracticeUndoPoint<StubSnapshot>({
      moveKind: "pass",
      barrier: null,
      current: null,
      next: prePass,
    });
    expect(next).toBe(prePass);
  });

  it("re-points the undo point when a play starts a new interaction", () => {
    const previous = point("previous");
    const prePlay = point("pre-play");
    const next = nextFabPracticeUndoPoint<StubSnapshot>({
      moveKind: "interaction-start",
      barrier: { reasons: ["move-hidden-to-public"] },
      current: previous,
      next: prePlay,
    });
    expect(next).toBe(prePlay);
  });

  it("still blocks undo entirely when a command exposes hidden information", () => {
    const next = nextFabPracticeUndoPoint<StubSnapshot>({
      moveKind: "interaction-start",
      barrier: { reasons: ["draw"] },
      current: point("current"),
      next: point("next"),
    });
    expect(next).toBeNull();
  });
});
