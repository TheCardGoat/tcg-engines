// @vitest-environment jsdom
import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { createSimulatorAnimationScope } from "./provider/createSimulatorAnimationScope";

const preference = vi.hoisted(() => ({ reduced: false }));
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => preference.reduced,
}));
const motionGlobal = globalThis as typeof globalThis & {
  __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean;
};
const original = motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__;
let root: Root | undefined;
let container: HTMLDivElement | undefined;
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = undefined;
  preference.reduced = false;
  motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = original;
  vi.unstubAllGlobals();
});

test.each(["reduced", "off", "harness"] as const)(
  "%s playback settles all queued state and preserves the appropriate sound feedback",
  async (mode) => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    preference.reduced = mode === "reduced";
    motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = mode === "harness";
    const Animation = createSimulatorAnimationScope<number>();
    const scheduled = vi.fn();
    const cancelled = vi.fn();
    let latest = { state: 0, blocked: true };
    function Harness() {
      const actions = Animation.useActions();
      const snapshot = Animation.useState();
      const gate = Animation.useCommandGate();
      latest = { state: snapshot.presentationState ?? 0, blocked: gate.isBlocked };
      useEffect(() => {
        for (const version of [1, 2]) {
          actions.enqueue({
            state: version,
            version,
            plan: {
              id: `play-${version}`,
              version: 2,
              steps: [
                {
                  id: "contact",
                  type: "hold",
                  startAtMs: 500,
                  durationMs: 0,
                  audioCue: "card.play",
                },
              ],
            },
          });
        }
      }, [actions]);
      return null;
    }
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await act(async () => {
      root?.render(
        <Animation.Root
          sessionKey={mode}
          initialState={0}
          initialVersion={0}
          projection={{ getEntity: () => null, getZone: () => null }}
          entityRenderer={() => null}
          viewerSeatId="p1"
          animationSpeed={mode === "off" ? "off" : "normal"}
          onScheduleAudio={scheduled}
          onCancelAudio={cancelled}
        >
          <Harness />
        </Animation.Root>,
      );
    });
    expect(latest).toEqual({ state: 2, blocked: false });
    expect(cancelled).toHaveBeenCalled();
    expect(scheduled).toHaveBeenCalledWith(
      mode === "harness"
        ? []
        : [1, 2].map((version) => ({
            planId: `play-${version}`,
            stepId: "contact",
            cue: "card.play",
            startAtMs: 0,
          })),
    );
    expect(cancelled.mock.invocationCallOrder.at(-1)).toBeLessThan(
      scheduled.mock.invocationCallOrder[0]!,
    );
  },
);
