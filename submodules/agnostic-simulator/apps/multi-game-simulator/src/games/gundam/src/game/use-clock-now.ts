import { useEffect, useSyncExternalStore } from "react";

const TICK_INTERVAL_MS = 100;

let now = Date.now();
let intervalId: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function emit() {
  now = Date.now();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!intervalId) {
    now = Date.now();
    intervalId = setInterval(emit, TICK_INTERVAL_MS);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  };
}

function getSnapshot() {
  return now;
}

export function useClockNow(): number {
  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    now = Date.now();
  }, []);

  return value;
}
