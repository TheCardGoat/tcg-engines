// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import type { ClockSnapshot } from "@tcg/gundam-engine";

import { OpponentTimeoutOverlayContainer } from "./OpponentTimeoutOverlayContainer.tsx";

const BASE_TIME_MS = 1_000_000;

function runningSnapshot(overrides: Partial<ClockSnapshot> = {}): ClockSnapshot {
  return {
    reserveMsRemaining: 60_000,
    isRunning: true,
    startedAtMs: BASE_TIME_MS,
    timeoutCount: 0,
    isInNegativeTime: false,
    activePlayerAccumulatedMs: 0,
    maxDecisionTimeMs: 1_000,
    ...overrides,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(BASE_TIME_MS);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("OpponentTimeoutOverlayContainer", () => {
  it("reveals the first-timeout skip action when the decision cap is exceeded", async () => {
    const onSkip = vi.fn();
    const onDrop = vi.fn();
    render(
      <OpponentTimeoutOverlayContainer
        snapshot={runningSnapshot()}
        onSkip={onSkip}
        onDrop={onDrop}
      />,
    );

    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.queryByTestId("skip-opponent-turn")).toBeNull();
    expect(screen.queryByTestId("drop-opponent")).toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(1_000);
    });
    fireEvent.click(screen.getByTestId("skip-opponent-turn"));

    expect(onSkip).toHaveBeenCalledOnce();
    expect(screen.queryByTestId("drop-opponent")).toBeNull();
    expect(onDrop).not.toHaveBeenCalled();
  });

  it("reveals skip and drop actions after a repeated decision timeout", async () => {
    const onSkip = vi.fn();
    const onDrop = vi.fn();
    render(
      <OpponentTimeoutOverlayContainer
        snapshot={runningSnapshot({ timeoutCount: 1 })}
        onSkip={onSkip}
        onDrop={onDrop}
      />,
    );

    await act(async () => {
      vi.advanceTimersByTime(1_100);
    });
    fireEvent.click(screen.getByTestId("skip-opponent-turn"));
    fireEvent.click(screen.getByTestId("drop-opponent"));

    expect(onSkip).toHaveBeenCalledOnce();
    expect(onDrop).toHaveBeenCalledOnce();
  });
});
