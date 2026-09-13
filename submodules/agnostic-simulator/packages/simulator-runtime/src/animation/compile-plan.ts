import type {
  AnimationPlanV2,
  AnimationStepV2,
  SimulatorAudioCueId,
} from "@tcg/protocol/animations";

export type AnimationSpeed = "off" | "fast" | "normal" | "slow";

export interface CompiledAnimationStep {
  readonly step: AnimationStepV2;
  readonly startAtMs: number;
  readonly durationMs: number;
  readonly endAtMs: number;
}

export interface CompiledAudioCue {
  readonly planId: string;
  readonly stepId: string;
  readonly cue: SimulatorAudioCueId;
  readonly startAtMs: number;
}

export interface CompiledAnimationPlan {
  readonly id: string;
  readonly steps: readonly CompiledAnimationStep[];
  readonly audioCues: readonly CompiledAudioCue[];
  readonly primaryDurationMs: number;
  /** Time during which commands must wait for state-changing presentation to settle. */
  readonly interactionBlockingDurationMs: number;
  readonly reflowDurationMs: number;
}

const DEFAULT_ENTITY_DURATION_MS = 560;
// Text-forward feedback carries rule-relevant information. At normal speed,
// keep one consistent window that is readable without turning routine actions
// into pauses in play.
const DEFAULT_READABLE_FEEDBACK_DURATION_MS = 800;
const DEFAULT_GAME_RESULT_DURATION_MS = 1_200;
export const DEFAULT_REFLOW_DURATION_MS = 240;

export function compileAnimationPlan(
  plan: AnimationPlanV2,
  speed: AnimationSpeed = "normal",
  reducedMotion = false,
  layoutDurationMs = DEFAULT_REFLOW_DURATION_MS,
): CompiledAnimationPlan {
  const scale = reducedMotion ? 0 : speedScale(speed);
  const steps = plan.steps.map((step): CompiledAnimationStep => {
    const startAtMs = Math.round((step.startAtMs ?? 0) * scale);
    const durationMs = Math.round(resolveDurationMs(step) * scale);
    return { step, startAtMs, durationMs, endAtMs: startAtMs + durationMs };
  });
  const primaryDurationMs = steps.reduce((latest, step) => Math.max(latest, step.endAtMs), 0);
  const interactionBlockingDurationMs = steps.reduce(
    (latest, step) => (step.step.type === "phaseChange" ? latest : Math.max(latest, step.endAtMs)),
    0,
  );
  const hasSpatialStep = steps.some(({ step }) => step.type === "entityTransfer");
  const reflowDurationMs =
    scale === 0 || !hasSpatialStep ? 0 : Math.round(layoutDurationMs * scale);

  return {
    id: plan.id,
    steps,
    audioCues: steps.flatMap(({ step, startAtMs }) =>
      step.audioCue ? [{ planId: plan.id, stepId: step.id, cue: step.audioCue, startAtMs }] : [],
    ),
    primaryDurationMs,
    interactionBlockingDurationMs,
    reflowDurationMs,
  };
}

function resolveDurationMs(step: AnimationStepV2): number {
  if (step.durationMs !== undefined) return step.durationMs;
  switch (step.type) {
    case "entityTransfer":
    case "entityStateChange":
      return DEFAULT_ENTITY_DURATION_MS;
    case "emphasize":
    case "phaseChange":
      return DEFAULT_READABLE_FEEDBACK_DURATION_MS;
    case "hold":
      // Hold duration is schema-required and therefore handled by the early
      // return above. Keep a finite defensive fallback for unvalidated input.
      return DEFAULT_ENTITY_DURATION_MS;
    case "effect":
    case "combat":
    case "valueDelta":
      return DEFAULT_READABLE_FEEDBACK_DURATION_MS;
    case "randomization":
    case "comparison":
      return DEFAULT_READABLE_FEEDBACK_DURATION_MS;
    case "gameResult":
      return DEFAULT_GAME_RESULT_DURATION_MS;
  }
}

function speedScale(speed: AnimationSpeed): number {
  switch (speed) {
    case "off":
      return 0;
    case "fast":
      return 0.5;
    case "normal":
      return 1;
    case "slow":
      return 1.5;
  }
}
