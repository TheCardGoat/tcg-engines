import type { SimulatorAudioCueId } from "@tcg/protocol";
import type { ScheduledAnimationStep } from "@tcg/simulator-ui";

export interface ScheduledSimulatorAudioCue {
  readonly cue: SimulatorAudioCueId;
  readonly delayMs: number;
}

export function collectScheduledSimulatorAudioCues(
  steps: readonly ScheduledAnimationStep[],
  seenStepKeys: Set<string>,
): ScheduledSimulatorAudioCue[] {
  const cues: ScheduledSimulatorAudioCue[] = [];
  for (const step of steps) {
    const cue = step.step.audioCue;
    if (!cue) {
      continue;
    }
    const key = `${step.planId}:${step.stepId}:${cue}`;
    if (seenStepKeys.has(key)) {
      continue;
    }
    seenStepKeys.add(key);
    cues.push({ cue, delayMs: step.delayMs });
  }
  return cues;
}
