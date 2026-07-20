// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createAnimationPlaybackGate, useAnimationPlaybackTimeout } from "./animation-playback.js";

let activeRoot: ReturnType<typeof createRoot> | null = null;
let activeContainer: HTMLDivElement | null = null;
let latestExpired = false;

function TimeoutHarness({ pending, enabled }: { pending: boolean; enabled: boolean }) {
  latestExpired = useAnimationPlaybackTimeout({ pending, enabled, timeoutMs: 100 });
  return null;
}

afterEach(() => {
  act(() => activeRoot?.unmount());
  activeContainer?.remove();
  activeRoot = null;
  activeContainer = null;
  vi.useRealTimers();
});

describe("createAnimationPlaybackGate", () => {
  it("tracks unique plans and only becomes idle after every plan completes", () => {
    const gate = createAnimationPlaybackGate();
    const listener = vi.fn();
    gate.subscribe(listener);

    gate.begin(["draw", "draw", "effect"]);
    expect(gate.pendingPlanIds()).toEqual(["draw", "effect"]);
    expect(gate.isBlocked()).toBe(true);

    gate.complete("draw");
    expect(gate.isBlocked()).toBe(true);
    gate.complete("effect");
    expect(gate.isBlocked()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("waits for idle and provides a shared timeout circuit breaker", async () => {
    vi.useFakeTimers();
    const gate = createAnimationPlaybackGate();
    gate.begin(["move"]);

    const idle = gate.waitForIdle(100);
    gate.complete("move");
    await expect(idle).resolves.toBe("idle");

    gate.begin(["stuck"]);
    const timedOut = gate.waitForIdle(100);
    await vi.advanceTimersByTimeAsync(100);
    await expect(timedOut).resolves.toBe("timeout");
  });

  it("shares the React timeout circuit breaker used by autonomous players", async () => {
    vi.useFakeTimers();
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);

    act(() => activeRoot?.render(<TimeoutHarness pending enabled />));
    expect(latestExpired).toBe(false);
    await act(() => vi.advanceTimersByTimeAsync(100));
    expect(latestExpired).toBe(true);

    act(() => activeRoot?.render(<TimeoutHarness pending={false} enabled />));
    expect(latestExpired).toBe(false);
  });
});
