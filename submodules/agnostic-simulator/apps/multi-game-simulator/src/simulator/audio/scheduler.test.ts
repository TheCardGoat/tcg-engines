import { describe, expect, test } from "vite-plus/test";
import type { CompiledAudioCue } from "@tcg/simulator-runtime/animation";
import { collectScheduledSimulatorAudioCues } from "./scheduler";

describe("collectScheduledSimulatorAudioCues", () => {
  test("returns cue timing from animation steps", () => {
    const seen = new Set<string>();

    expect(
      collectScheduledSimulatorAudioCues(
        [
          scheduledStep("draw", "card.draw", 150),
          scheduledStep("phase", "phase.change", 0),
          scheduledStep("steal", "resource.steal", 420),
        ],
        seen,
      ),
    ).toEqual([
      { cue: "card.draw", delayMs: 150 },
      { cue: "phase.change", delayMs: 0 },
      { cue: "resource.steal", delayMs: 420 },
    ]);
  });

  test("dedupes repeated scheduled steps", () => {
    const seen = new Set<string>();
    const steps = [scheduledStep("draw", "card.draw", 150)];

    expect(collectScheduledSimulatorAudioCues(steps, seen)).toEqual([
      { cue: "card.draw", delayMs: 150 },
    ]);
    expect(collectScheduledSimulatorAudioCues(steps, seen)).toEqual([]);
  });

  test("does not dedupe reused step ids across plans", () => {
    const seen = new Set<string>();

    expect(
      collectScheduledSimulatorAudioCues(
        [
          scheduledStep("draw", "card.draw", 0, "plan-a"),
          scheduledStep("draw", "card.draw", 0, "plan-b"),
        ],
        seen,
      ),
    ).toHaveLength(2);
  });
});

function scheduledStep(
  stepId: string,
  cue: CompiledAudioCue["cue"],
  startAtMs: number,
  planId = "plan",
): CompiledAudioCue {
  return {
    planId,
    stepId,
    cue,
    startAtMs,
  };
}
