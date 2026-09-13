// @vitest-environment jsdom

import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { AnimationInteractionBoundary } from "./components/AnimationInteractionBoundary";
import { createSimulatorAnimationScope } from "./provider/createSimulatorAnimationScope";

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
});

describe("phase change interaction policy", () => {
  test("keeps the announcement visible after its command boundary releases", async () => {
    motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = false;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(performance.now());
      return 1;
    });
    const Animation = createSimulatorAnimationScope<{ readonly phase: string }>();

    function Harness() {
      const actions = Animation.useActions();
      const status = Animation.useStatus();
      useEffect(() => {
        actions.enqueue({
          state: { phase: "main" },
          version: 2,
          plan: {
            id: "phase-feedback",
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
      return (
        <AnimationInteractionBoundary active={status.isAnimating}>
          <button type="button">Next action</button>
        </AnimationInteractionBoundary>
      );
    }

    container = document.createElement("div");
    document.body.append(container);
    activeRoot = createRoot(container);
    await act(async () => {
      activeRoot?.render(
        <Animation.Root
          sessionKey="nonblocking-phase"
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

    await vi.waitFor(() =>
      expect(document.querySelector('[data-animation-overlay="phase-change"]')).not.toBeNull(),
    );
    await vi.waitFor(() =>
      expect(
        document.querySelector('[data-animation-interaction-boundary][aria-busy="true"]'),
      ).toBeNull(),
    );

    expect(document.querySelector('[data-animation-overlay="phase-change"]')).not.toBeNull();
    expect(document.querySelector("button")?.disabled).toBe(false);
  });
});
