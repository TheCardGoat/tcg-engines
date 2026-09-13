/**
 * The `always-hold` priority countdown gate.
 *
 * Hard requirement: a stale `setTimeout` must never be able to submit a
 * priority pass. The hook is engineered around four independent guards:
 *
 * 1. **Window identity binding** — the timer is keyed to
 *    `(actorId, stateVersion, requestId)` collapsed into `windowKey`. The arm
 *    effect depends on `[armed, windowKey, durationMs]`; any change clears
 *    the old timer before a new one arms, and unmount clears it too. A new
 *    window always gets a new timer, never a reused one.
 * 2. **Generation token** — a ref-held monotonically increasing counter. The
 *    expiry callback captures the generation it was armed with and no-ops
 *    unless it is still current, proof against re-renders, React strict-mode
 *    double effects, and out-of-order renders.
 * 3. **Synchronous re-validation at expiry** — expiry never submits a
 *    captured command. It calls `isStillEligible()` (the same fail-closed
 *    pass-only derivation the arm decision used, reading *current* state) and
 *    submits the *current* pass path via `onSubmitPass()` only if still
 *    eligible. A timer that outlived its window submits nothing.
 * 4. **In-flight dedupe** — one submission per armed window; `cancel()` from
 *    the Hold button (or any dependency change) disarms permanently for that
 *    window. A rejected submission (live `rejected_stale`) is never retried —
 *    the next state update re-derives the countdown from scratch.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export interface FabPriorityCountdownParams {
  /**
   * All gate conditions as of the current render: seat mode `always-hold`,
   * local player holds priority, window is pass-only, controls not
   * suppressed (animations, read-only, terminal).
   */
  readonly armed: boolean;
  /** Identity of the priority window; any component change disarms. */
  readonly windowKey: string | null;
  /** Countdown duration in milliseconds. */
  readonly durationMs: number;
  /** Fail-closed synchronous re-validation executed at expiry. */
  readonly isStillEligible: () => boolean;
  /** Submits the *current* pass path; must read current state itself. */
  readonly onSubmitPass: () => void;
}

export interface FabPriorityCountdown {
  /** True while the timer is armed and not dismissed for this window. */
  readonly armed: boolean;
  /** Cancels the countdown for the current window (Hold button). */
  readonly cancel: () => void;
}

export function useFabPriorityCountdown({
  armed,
  windowKey,
  durationMs,
  isStillEligible,
  onSubmitPass,
}: FabPriorityCountdownParams): FabPriorityCountdown {
  const generationRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const submittedRef = useRef(false);
  const eligibilityRef = useRef(isStillEligible);
  const submitRef = useRef(onSubmitPass);
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  eligibilityRef.current = isStillEligible;
  submitRef.current = onSubmitPass;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // Bumping the generation invalidates any expiry callback still holding
    // an older token, including one already queued on the macrotask queue.
    generationRef.current += 1;
  }, []);

  const cancel = useCallback(() => {
    clearTimer();
    // Unconditional: Hold always dismisses the *current* window. The arm
    // effect (line 90) is what clears a stale dismissal when the window
    // changes, so a `current ?? windowKey` here would strand the first
    // window's key and let a later Hold leak through.
    setDismissedKey(windowKey);
  }, [clearTimer, windowKey]);

  useEffect(() => {
    // Every dependency change disarms the previous timer before deciding
    // whether a new one arms. This is also the strict-mode double-effect
    // defense: the first effect pass is cleaned up before the second arms.
    clearTimer();
    submittedRef.current = false;
    setDismissedKey((current) => (current === windowKey ? null : current));

    if (!armed || windowKey == null || durationMs <= 0) return;

    const generation = ++generationRef.current;
    const onExpire = () => {
      timerRef.current = null;
      // Generation check: a timer from any earlier arm must never act.
      if (generationRef.current !== generation) return;
      // One submission per window even when expiry races a manual click.
      if (submittedRef.current) return;
      submittedRef.current = true;
      generationRef.current += 1;
      // Synchronous fail-closed re-validation against *current* state. The
      // submit callback itself re-derives the current pass action; nothing
      // captured at arm time is submitted.
      if (!eligibilityRef.current()) return;
      submitRef.current();
    };
    timerRef.current = window.setTimeout(onExpire, durationMs);
    return clearTimer;
  }, [armed, clearTimer, durationMs, windowKey]);

  useEffect(() => clearTimer, [clearTimer]);

  const active = armed && windowKey != null && dismissedKey !== windowKey;
  return { armed: active, cancel };
}
