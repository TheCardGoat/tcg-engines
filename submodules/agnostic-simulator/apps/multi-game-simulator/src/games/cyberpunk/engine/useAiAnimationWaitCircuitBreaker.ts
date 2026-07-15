import { useEffect, useState } from "react";

const AI_ANIMATION_WAIT_TIMEOUT_MS = 12_000;

export function useAiAnimationWaitCircuitBreaker(
  hasPendingAnimations: boolean,
  waitEnabled: boolean,
): boolean {
  const [animationWaitExpired, setAnimationWaitExpired] = useState(false);

  useEffect(() => {
    if (!hasPendingAnimations) {
      setAnimationWaitExpired(false);
      return;
    }
    if (animationWaitExpired) {
      return;
    }
    if (!waitEnabled) {
      return;
    }
    const timer = setTimeout(() => {
      console.warn("[cyberpunk-ai] animation wait watchdog timed out", {
        timeoutMs: AI_ANIMATION_WAIT_TIMEOUT_MS,
      });
      setAnimationWaitExpired(true);
    }, AI_ANIMATION_WAIT_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [animationWaitExpired, hasPendingAnimations, waitEnabled]);

  return animationWaitExpired;
}
