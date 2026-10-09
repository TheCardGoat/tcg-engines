import type { SimulatorAudioCueId } from "@tcg/protocol";
import type { CompiledAudioCue } from "@tcg/simulator-runtime/animation";

export interface ScheduledSimulatorAudioCue {
  readonly cue: SimulatorAudioCueId;
  readonly delayMs: number;
}

export function collectScheduledSimulatorAudioCues(
  steps: readonly CompiledAudioCue[],
  seenStepKeys: Set<string>,
): ScheduledSimulatorAudioCue[] {
  const cues: ScheduledSimulatorAudioCue[] = [];
  for (const step of steps) {
    const cue = step.cue;
    const key = `${step.planId}:${step.stepId}:${cue}`;
    if (seenStepKeys.has(key)) {
      continue;
    }
    seenStepKeys.add(key);
    cues.push({ cue, delayMs: step.startAtMs });
  }
  return cues;
}
