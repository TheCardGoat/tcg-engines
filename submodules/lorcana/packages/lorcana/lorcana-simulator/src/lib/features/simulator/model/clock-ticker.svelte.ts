/**
 * Shared reactive "now" for all clock displays in the simulator.
 *
 * Ref-counted: exactly ONE setInterval runs regardless of how many
 * PlayerTimers or TabletopBoard effects subscribe. First subscriber starts
 * the interval, last unsubscribe stops it.
 *
 * Why this exists: prior to consolidation, each PlayerTimer mount ran its own
 * 100ms interpolation interval AND TabletopBoard ran a separate 250ms effect
 * for the skip/drop overlay. That caused visual drift between the displayed
 * clock and the skip button's enable state. Pooling both through a single
 * reactive `now` guarantees they tick from the same timestamp.
 *
 * Usage:
 *
 *   const clockNow = useClockNow();
 *   const view = $derived(deriveClockView(snapshot, clockNow.value, { isOwnClock }));
 *
 * The returned object is a tiny reactive wrapper (not the `$state` directly)
 * so `clockNow.value` reads the current timestamp and participates in the
 * Svelte fine-grained reactivity graph.
 */

const TICK_INTERVAL_MS = 100;

let now = $state(Date.now());
let refCount = 0;
let intervalId: ReturnType<typeof setInterval> | undefined;

function startTicking() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    now = Date.now();
  }, TICK_INTERVAL_MS);
}

function stopTicking() {
  if (!intervalId) return;
  clearInterval(intervalId);
  intervalId = undefined;
}

export interface ClockNow {
  readonly value: number;
}

/**
 * Subscribe to the shared reactive "now" timestamp, updated every 100ms.
 *
 * Must be called inside a Svelte component (relies on `$effect` for mount /
 * unmount tracking). Returns an object whose `value` reads the current
 * timestamp and re-runs derived state on each tick.
 */
export function useClockNow(): ClockNow {
  $effect(() => {
    refCount++;
    if (refCount === 1) {
      // Start fresh so the first tick aligns with subscription.
      now = Date.now();
      startTicking();
    }
    return () => {
      refCount--;
      if (refCount === 0) {
        stopTicking();
      }
    };
  });

  return {
    get value() {
      return now;
    },
  };
}
