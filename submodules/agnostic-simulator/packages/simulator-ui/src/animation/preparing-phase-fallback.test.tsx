// @vitest-environment jsdom

import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { createSimulatorAnimationScope } from "./provider/createSimulatorAnimationScope";

// Owns the occluded-pane regression: the preparing phase used to wait for
// requestAnimationFrame alone, and a hidden or occluded pane never paints, so
// a queued transition stalled in `preparing` forever — holding the match's
// interaction lock with it. A wall-clock fallback must start the transition.
const motionGlobal = globalThis as typeof globalThis & {
  __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean;
};
const originalMotionSetting = motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__;
let activeRoot: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  act(() => activeRoot?.unmount());
  container?.remove();
  activeRoot = undefined;
  container = undefined;
  motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = originalMotionSetting;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("preparing phase wall-clock fallback", () => {
  test("starts the transition when requestAnimationFrame never fires", async () => {
    motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = false;
    vi.stubGlobal("requestAnimationFrame", () => 1);
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

    const Animation = createSimulatorAnimationScope<{ readonly phase: string }>();
    let latest = { isAnimating: false, phase: null as string | null };

    function Harness() {
      const actions = Animation.useActions();
      const status = Animation.useStatus();
      latest = { isAnimating: status.isAnimating, phase: status.phase };
      useEffect(() => {
        actions.enqueue({
          state: { phase: "main" },
          version: 2,
          plan: {
            id: "preparing-fallback",
            version: 2,
            steps: [
              {
                id: "phase",
                type: "phaseChange",
                from: "start",
                to: "main",
                variant: "phase",
                durationMs: 1_000,
              },
            ],
          },
        });
      }, [actions]);
      return null;
    }

    container = document.createElement("div");
    document.body.append(container);
    activeRoot = createRoot(container);
    await act(async () => {
      activeRoot?.render(
        <Animation.Root
          sessionKey="preparing-fallback"
          initialState={{ phase: "start" }}
          initialVersion={1}
          projection={{ getEntity: () => null, getZone: () => null }}
          entityRenderer={() => null}
          viewerSeatId="p1"
          animationSpeed="normal"
        >
          <Harness />
        </Animation.Root>,
      );
    });

    // rAF never fires, so the transition is stuck locked in preparing.
    expect(latest.isAnimating).toBe(true);
    expect(latest.phase).toBe("preparing");

    // The wall-clock fallback must start it anyway.
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(latest.phase).toBe("running");
    expect(latest.isAnimating).toBe(true);

    // From there the ordinary completion timers settle the transition.
    for (let i = 0; i < 10 && latest.isAnimating; i += 1) {
      await act(async () => {
        vi.advanceTimersByTime(2_000);
      });
    }
    expect(latest.isAnimating).toBe(false);
    expect(latest.phase).toBeNull();
  });
});
