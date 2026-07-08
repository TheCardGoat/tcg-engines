import { describe, expect, test } from "vite-plus/test";
import type { ScheduledAnimationStep } from "@tcg/simulator-ui";
import { collectScheduledSimulatorAudioCues } from "./scheduler";

describe("collectScheduledSimulatorAudioCues", () => {
  test("returns cue timing from animation steps", () => {
    const seen = new Set<string>();

    expect(
      collectScheduledSimulatorAudioCues(
        [
          scheduledStep("plan-1", "draw", "card.draw", 150),
          scheduledStep("plan-1", "phase", "phase.change", 0),
          scheduledStep("plan-1", "silent", undefined, 75),
        ],
        seen,
      ),
    ).toEqual([
      { cue: "card.draw", delayMs: 150 },
      { cue: "phase.change", delayMs: 0 },
    ]);
  });

  test("dedupes repeated scheduled steps", () => {
    const seen = new Set<string>();
    const steps = [scheduledStep("plan-1", "draw", "card.draw", 150)];

    expect(collectScheduledSimulatorAudioCues(steps, seen)).toEqual([
      { cue: "card.draw", delayMs: 150 },
    ]);
    expect(collectScheduledSimulatorAudioCues(steps, seen)).toEqual([]);
  });
});

function scheduledStep(
  planId: string,
  stepId: string,
  audioCue: ScheduledAnimationStep["step"]["audioCue"],
  delayMs: number,
): ScheduledAnimationStep {
  return {
    planId,
    stepId,
    delayMs,
    durationMs: 300,
    step: {
      id: stepId,
      type: "phaseChange",
      from: "Main",
      to: "End",
      ...(audioCue ? { audioCue } : {}),
      delayMs,
      durationMs: 300,
    },
  };
}
