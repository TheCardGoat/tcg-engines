import { useAnimationPlaybackTimeout } from "@tcg/simulator-runtime/animation-playback";

const AI_ANIMATION_WAIT_TIMEOUT_MS = 12_000;

export function useAiAnimationWaitCircuitBreaker(
  hasPendingAnimations: boolean,
  waitEnabled: boolean,
): boolean {
  return useAnimationPlaybackTimeout({
    pending: hasPendingAnimations,
    enabled: waitEnabled,
    timeoutMs: AI_ANIMATION_WAIT_TIMEOUT_MS,
    onTimeout: (timeoutMs) => {
      console.warn("[cyberpunk-ai] animation wait watchdog timed out", {
        timeoutMs,
      });
    },
  });
}
