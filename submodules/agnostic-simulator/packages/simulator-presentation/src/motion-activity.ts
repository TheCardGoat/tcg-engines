import { useState, useSyncExternalStore } from "react";

/** Each motion releases only its own ticket. No per-frame React updates. */
export function createMotionActivity() {
  const tickets = new Set<symbol>();
  const listeners = new Set<() => void>();
  const notify = () => {
    for (const listener of listeners) listener();
  };
  return {
    getSnapshot: () => tickets.size > 0,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    begin: () => {
      const ticket = Symbol();
      const wasIdle = tickets.size === 0;
      tickets.add(ticket);
      if (wasIdle) notify();
      return () => {
        if (tickets.delete(ticket) && tickets.size === 0) notify();
      };
    },
  };
}
export function useMotionActivity() {
  const [activity] = useState(createMotionActivity);
  const busy = useSyncExternalStore(activity.subscribe, activity.getSnapshot, () => false);
  return { begin: activity.begin, busy };
}
