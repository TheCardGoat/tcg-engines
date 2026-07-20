// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { AnimationPlanV1 } from "@tcg/protocol";
import { createAnimationPlaybackGate } from "@tcg/simulator-runtime/animation-playback";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import {
  useAnimationPlanQueue,
  type AnimationPlanQueue,
  type AnimationPlanQueueOptions,
} from "./useAnimationPlanQueue.js";

const plan = (id: string): AnimationPlanV1 => ({ id, version: 1, anchors: [], steps: [] });
let latestQueue: AnimationPlanQueue | null = null;
let activeRoot: ReturnType<typeof createRoot> | null = null;
let activeContainer: HTMLDivElement | null = null;

function Harness(options: AnimationPlanQueueOptions) {
  latestQueue = useAnimationPlanQueue(options);
  return null;
}

function renderQueue(options: AnimationPlanQueueOptions) {
  activeContainer = document.createElement("div");
  document.body.append(activeContainer);
  activeRoot = createRoot(activeContainer);
  act(() => activeRoot?.render(<Harness {...options} />));
  return (next: AnimationPlanQueueOptions) => {
    act(() => activeRoot?.render(<Harness {...next} />));
  };
}

afterEach(() => {
  act(() => activeRoot?.unmount());
  activeContainer?.remove();
  activeRoot = null;
  activeContainer = null;
  latestQueue = null;
});

describe("useAnimationPlanQueue", () => {
  it("deduplicates plans and completes the shared playback gate", () => {
    const gate = createAnimationPlaybackGate();
    const rerender = renderQueue({ incomingPlans: [plan("draw")], gate });

    expect(latestQueue?.plans.map(({ id }) => id)).toEqual(["draw"]);
    expect(gate.pendingPlanIds()).toEqual(["draw"]);

    rerender({ incomingPlans: [plan("draw"), plan("effect")], gate });
    expect(latestQueue?.plans.map(({ id }) => id)).toEqual(["draw", "effect"]);

    act(() => latestQueue?.completePlan("draw"));
    expect(latestQueue?.plans.map(({ id }) => id)).toEqual(["effect"]);
    expect(gate.pendingPlanIds()).toEqual(["effect"]);
  });

  it("clears plans and reports pending changes on reset", () => {
    const onPendingChange = vi.fn();
    const rerender = renderQueue({ incomingPlans: [plan("draw")], onPendingChange });

    expect(latestQueue?.hasPending).toBe(true);
    rerender({ incomingPlans: [plan("draw")], reset: true, onPendingChange });
    expect(latestQueue?.hasPending).toBe(false);
    expect(onPendingChange).toHaveBeenCalledWith(true);
    expect(onPendingChange).toHaveBeenCalledWith(false);
  });
});
