import type { MatchRuntime } from "@tcg/gundam-engine";
import {
  createAnimationPlaybackGate,
  type AnimationPlaybackGate,
} from "@tcg/simulator-runtime/animation-playback";

export type { AnimationPlaybackGate } from "@tcg/simulator-runtime/animation-playback";

const runtimeGates = new WeakMap<MatchRuntime, AnimationPlaybackGate>();

/**
 * Runtime-scoped bridge between React-owned animation playback and bots that
 * live outside the React tree. The shared animation surface remains the sole
 * owner of visual completion; this gate only exposes whether a bot should wait.
 */
export function animationPlaybackGateFor(runtime: MatchRuntime): AnimationPlaybackGate {
  const existing = runtimeGates.get(runtime);
  if (existing) return existing;

  const gate = createAnimationPlaybackGate();

  runtimeGates.set(runtime, gate);
  return gate;
}
