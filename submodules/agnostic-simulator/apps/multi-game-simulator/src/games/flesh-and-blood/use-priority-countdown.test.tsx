/**
 * Staleness suite for the `always-hold` priority countdown gate.
 *
 * Hard requirement: a stale `setTimeout` must never be able to submit a
 * priority pass. Every case below arms a real 5 s timer under fake timers and
 * then proves the expiry cannot fire a submission for a window that changed,
 * closed, became ineligible, was manually handled, or was unmounted.
 */
// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useFabPriorityCountdown, type FabPriorityCountdownParams } from "./use-priority-countdown";

const DURATION_MS = 5000;

interface Params {
  readonly armed: boolean;
  readonly windowKey: string | null;
  readonly durationMs?: number;
  readonly isStillEligible?: () => boolean;
  readonly onSubmitPass?: () => void;
}

function setup(
  initial: Params,
  wrapper?: (props: { children: React.ReactNode }) => React.JSX.Element,
) {
  const onSubmitPass = initial.onSubmitPass ?? vi.fn();
  const rendered = renderHook(
    (params: FabPriorityCountdownParams) => useFabPriorityCountdown(params),
    {
      initialProps: {
        armed: initial.armed,
        windowKey: initial.windowKey,
        durationMs: initial.durationMs ?? DURATION_MS,
        isStillEligible: initial.isStillEligible ?? (() => true),
        onSubmitPass,
      },
      wrapper,
    },
  );
  return { rendered, onSubmitPass };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("useFabPriorityCountdown staleness suite", () => {
  it("expiry submits exactly once, never twice", () => {
    const { rendered, onSubmitPass } = setup({ armed: true, windowKey: "p1:10:req-1" });
    expect(rendered.result.current.armed).toBe(true);

    act(() => vi.advanceTimersByTime(DURATION_MS - 1));
    expect(onSubmitPass).toHaveBeenCalledTimes(0);
    act(() => vi.advanceTimersByTime(1));
    expect(onSubmitPass).toHaveBeenCalledTimes(1);
    // The submission is spent: no retry loop, ever.
    act(() => vi.advanceTimersByTime(60_000));
    expect(onSubmitPass).toHaveBeenCalledTimes(1);
  });

  it("Hold cancels the countdown for the current window", () => {
    const { rendered, onSubmitPass } = setup({ armed: true, windowKey: "p1:10:req-1" });

    act(() => rendered.result.current.cancel());
    expect(rendered.result.current.armed).toBe(false);

    act(() => vi.advanceTimersByTime(60_000));
    expect(onSubmitPass).toHaveBeenCalledTimes(0);
  });

  it("a window change after arm disarms the old timer (stale timer submits nothing)", () => {
    const { rendered, onSubmitPass } = setup({ armed: true, windowKey: "p1:10:req-1" });
    act(() => vi.advanceTimersByTime(2_000));

    // The state advanced: a new window with a new identity.
    act(() =>
      rendered.rerender({
        armed: true,
        windowKey: "p1:11:req-2",
        durationMs: DURATION_MS,
        isStillEligible: () => true,
        onSubmitPass,
      }),
    );
    act(() => vi.advanceTimersByTime(DURATION_MS - 1));
    expect(onSubmitPass).toHaveBeenCalledTimes(0);
    // Only the NEW window's timer may fire.
    act(() => vi.advanceTimersByTime(1));
    expect(onSubmitPass).toHaveBeenCalledTimes(1);
  });

  it("disarming (state change / manual submission) kills the timer", () => {
    const { rendered, onSubmitPass } = setup({ armed: true, windowKey: "p1:10:req-1" });
    act(() => vi.advanceTimersByTime(1_000));
    act(() =>
      rendered.rerender({
        armed: false,
        windowKey: "p1:10:req-1",
        durationMs: DURATION_MS,
        isStillEligible: () => true,
        onSubmitPass,
      }),
    );
    act(() => vi.advanceTimersByTime(60_000));
    expect(onSubmitPass).toHaveBeenCalledTimes(0);
  });

  it("a view that flips non-pass-only before expiry submits nothing (re-validation)", () => {
    const { rendered, onSubmitPass } = setup({ armed: true, windowKey: "p1:10:req-1" });
    act(() => vi.advanceTimersByTime(2_000));
    // Same window identity, but the fail-closed derivation now says no.
    act(() =>
      rendered.rerender({
        armed: true,
        windowKey: "p1:10:req-1",
        durationMs: DURATION_MS,
        isStillEligible: () => false,
        onSubmitPass,
      }),
    );
    act(() => vi.advanceTimersByTime(60_000));
    expect(onSubmitPass).toHaveBeenCalledTimes(0);
  });

  it("unmount clears the timer", () => {
    const { rendered, onSubmitPass } = setup({ armed: true, windowKey: "p1:10:req-1" });
    act(() => vi.advanceTimersByTime(2_000));
    rendered.unmount();
    act(() => vi.advanceTimersByTime(60_000));
    expect(onSubmitPass).toHaveBeenCalledTimes(0);
  });

  it("strict-mode double mount still yields exactly one live timer", () => {
    const { rendered, onSubmitPass } = setup(
      { armed: true, windowKey: "p1:10:req-1" },
      ({ children }) => <StrictMode>{children}</StrictMode>,
    );
    act(() => vi.advanceTimersByTime(DURATION_MS + 1_000));
    expect(onSubmitPass).toHaveBeenCalledTimes(1);
    rendered.unmount();
  });

  it("an expiry answered with rejection is never retried for the same window", () => {
    // The parent models a rejected_stale response by keeping the same window
    // armed-eligible; the hook must not re-arm its spent submission.
    const { rendered, onSubmitPass } = setup({ armed: true, windowKey: "p1:10:req-1" });
    act(() => vi.advanceTimersByTime(DURATION_MS));
    expect(onSubmitPass).toHaveBeenCalledTimes(1);

    act(() =>
      rendered.rerender({
        armed: true,
        windowKey: "p1:10:req-1",
        durationMs: DURATION_MS,
        isStillEligible: () => true,
        onSubmitPass,
      }),
    );
    act(() => vi.advanceTimersByTime(60_000));
    expect(onSubmitPass).toHaveBeenCalledTimes(1);
  });

  it("the next state update re-derives a fresh countdown from scratch", () => {
    const { rendered, onSubmitPass } = setup({ armed: true, windowKey: "p1:10:req-1" });
    act(() => vi.advanceTimersByTime(DURATION_MS));
    expect(onSubmitPass).toHaveBeenCalledTimes(1);

    act(() =>
      rendered.rerender({
        armed: true,
        windowKey: "p1:12:req-3",
        durationMs: DURATION_MS,
        isStillEligible: () => true,
        onSubmitPass,
      }),
    );
    expect(rendered.result.current.armed).toBe(true);
    act(() => vi.advanceTimersByTime(DURATION_MS));
    expect(onSubmitPass).toHaveBeenCalledTimes(2);
  });

  it("Hold dismisses only the current window; a new window arms again", () => {
    const { rendered, onSubmitPass } = setup({ armed: true, windowKey: "p1:10:req-1" });
    act(() => rendered.result.current.cancel());

    act(() =>
      rendered.rerender({
        armed: true,
        windowKey: "p1:11:req-2",
        durationMs: DURATION_MS,
        isStillEligible: () => true,
        onSubmitPass,
      }),
    );
    expect(rendered.result.current.armed).toBe(true);
    act(() => vi.advanceTimersByTime(DURATION_MS));
    expect(onSubmitPass).toHaveBeenCalledTimes(1);
  });

  it("Hold on a later window dismisses that window too (no stranded dismissal key)", () => {
    // Regression: a dismissal keyed to the first window used to survive the
    // window change, so a second Hold could not dismiss the second window.
    const { rendered, onSubmitPass } = setup({ armed: true, windowKey: "p1:10:req-1" });
    act(() => rendered.result.current.cancel());

    act(() =>
      rendered.rerender({
        armed: true,
        windowKey: "p1:11:req-2",
        durationMs: DURATION_MS,
        isStillEligible: () => true,
        onSubmitPass,
      }),
    );
    expect(rendered.result.current.armed).toBe(true);

    act(() => rendered.result.current.cancel());
    expect(rendered.result.current.armed).toBe(false);
    act(() => vi.advanceTimersByTime(120_000));
    expect(onSubmitPass).toHaveBeenCalledTimes(0);
  });

  it("no-op in auto-pass mode (never armed)", () => {
    const { rendered, onSubmitPass } = setup({ armed: false, windowKey: null });
    expect(rendered.result.current.armed).toBe(false);
    act(() => vi.advanceTimersByTime(60_000));
    expect(onSubmitPass).toHaveBeenCalledTimes(0);
  });
});
