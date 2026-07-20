import { useEffect, useState } from "react";

export interface AnimationPlaybackGate {
  readonly begin: (planIds: readonly string[]) => void;
  readonly complete: (planId: string) => void;
  readonly clear: () => void;
  readonly isBlocked: () => boolean;
  readonly pendingPlanIds: () => readonly string[];
  readonly subscribe: (listener: () => void) => () => void;
  readonly waitForIdle: (timeoutMs?: number) => Promise<"idle" | "timeout">;
}

export function createAnimationPlaybackGate(): AnimationPlaybackGate {
  const pending = new Set<string>();
  const listeners = new Set<() => void>();

  const notify = () => {
    for (const listener of listeners) listener();
  };

  const gate: AnimationPlaybackGate = {
    begin(planIds) {
      const wasBlocked = pending.size > 0;
      for (const planId of planIds) pending.add(planId);
      if (!wasBlocked && pending.size > 0) notify();
    },
    complete(planId) {
      const wasBlocked = pending.size > 0;
      pending.delete(planId);
      if (wasBlocked && pending.size === 0) notify();
    },
    clear() {
      if (pending.size === 0) return;
      pending.clear();
      notify();
    },
    isBlocked: () => pending.size > 0,
    pendingPlanIds: () => [...pending],
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    waitForIdle(timeoutMs = 12_000) {
      if (!gate.isBlocked()) return Promise.resolve("idle");

      return new Promise((resolve) => {
        let settled = false;
        const finish = (result: "idle" | "timeout") => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          unsubscribe();
          resolve(result);
        };
        const unsubscribe = gate.subscribe(() => {
          if (!gate.isBlocked()) finish("idle");
        });
        const timer = setTimeout(() => finish("timeout"), Math.max(0, timeoutMs));
      });
    },
  };

  return gate;
}

export interface AnimationPlaybackTimeoutOptions {
  readonly pending: boolean;
  readonly enabled: boolean;
  readonly timeoutMs?: number;
  readonly onTimeout?: (timeoutMs: number) => void;
}

/** React circuit breaker shared by autonomous simulator playback loops. */
export function useAnimationPlaybackTimeout({
  pending,
  enabled,
  timeoutMs = 12_000,
  onTimeout,
}: AnimationPlaybackTimeoutOptions): boolean {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!pending) {
      setExpired(false);
      return;
    }
    if (!enabled || expired) return;

    const timer = setTimeout(() => {
      onTimeout?.(timeoutMs);
      setExpired(true);
    }, timeoutMs);
    return () => clearTimeout(timer);
  }, [enabled, expired, onTimeout, pending, timeoutMs]);

  return expired;
}
