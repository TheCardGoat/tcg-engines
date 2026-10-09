// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { CyberpunkThreeFeedbackLayer } from "./CyberpunkThreeFeedbackLayer";

const animation = vi.hoisted(() => {
  const runtime: {
    activeTransition: { id: string; phase: string } | null;
    playbackStartedAtMs: number;
    compiledPlan: {
      steps: Array<{
        step: { id: string; type: string } & Record<string, unknown>;
        startAtMs: number;
        durationMs: number;
      }>;
    };
  } = {
    activeTransition: { id: "turn-2", phase: "running" },
    playbackStartedAtMs: 0,
    compiledPlan: {
      steps: [
        {
          step: { id: "turn", type: "phaseChange", from: "main", to: "start", variant: "turn" },
          startAtMs: 0,
          durationMs: 1_500,
        },
      ],
    },
  };
  return { runtime };
});

vi.mock("@tcg/simulator-ui", () => ({
  useAnimationRuntime: () => animation.runtime,
}));
vi.mock("../engine", () => ({
  useEngine: () => ({ humanSide: "player" }),
}));
vi.mock("@tcg/simulator-presentation/canvas", () => ({
  SimulatorEffectCanvas: ({ active }: { active: boolean }) => (
    <div data-testid="effect-canvas" data-active={active ? "true" : "false"} />
  ),
}));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

test("turn sweep stays visible after the nonblocking transition finishes", () => {
  vi.useFakeTimers();
  animation.runtime.activeTransition = { id: "turn-2", phase: "running" };
  const view = render(<CyberpunkThreeFeedbackLayer enablePhaseSweep />);
  expect(screen.getByTestId("effect-canvas").getAttribute("data-active")).toBe("true");

  animation.runtime.activeTransition = null;
  view.rerender(<CyberpunkThreeFeedbackLayer enablePhaseSweep />);
  expect(screen.getByTestId("effect-canvas").getAttribute("data-active")).toBe("true");

  act(() => vi.advanceTimersByTime(1_500));
  expect(screen.getByTestId("effect-canvas").getAttribute("data-active")).toBe("false");

  animation.runtime.activeTransition = { id: "turn-2", phase: "running" };
  view.rerender(<CyberpunkThreeFeedbackLayer enablePhaseSweep />);
  expect(screen.getByTestId("effect-canvas").getAttribute("data-active")).toBe("false");
});

test("renders a value pulse anchored to the subject entity, variant by delta sign", () => {
  const anchor = document.createElement("div");
  anchor.setAttribute("data-sim-entity-id", "gd_gig-pulse");
  // jsdom has no layout engine; the layer treats a die with no client rects as
  // not rendered, so fake one visible box.
  Object.defineProperty(anchor, "getClientRects", {
    value: () => [{ left: 0, top: 0, right: 40, bottom: 40, width: 40, height: 40 }],
  });
  document.body.appendChild(anchor);
  animation.runtime.activeTransition = { id: "adjust-1", phase: "running" };
  animation.runtime.compiledPlan = {
    steps: [
      {
        step: {
          id: "gig-pulse",
          type: "valueDelta",
          subject: { kind: "entity", id: "gd_gig-pulse" },
          delta: 3,
          fromValue: 5,
          toValue: 8,
          label: "GIG",
        },
        startAtMs: 0,
        durationMs: 600,
      },
    ],
  };

  try {
    render(<CyberpunkThreeFeedbackLayer enablePhaseSweep />);
    const pulse = document.querySelector('[data-value-pulse="gain"]');
    expect(pulse).not.toBeNull();
    expect(pulse?.getAttribute("aria-hidden")).toBe("true");
  } finally {
    anchor.remove();
    animation.runtime.activeTransition = null;
    animation.runtime.compiledPlan = {
      steps: [
        {
          step: { id: "turn", type: "phaseChange", from: "main", to: "start", variant: "turn" },
          startAtMs: 0,
          durationMs: 1_500,
        },
      ],
    };
  }
});

test("skips the value pulse when the subject has no rendered anchor", () => {
  animation.runtime.activeTransition = { id: "adjust-2", phase: "running" };
  animation.runtime.compiledPlan = {
    steps: [
      {
        step: {
          id: "gig-pulse-missing",
          type: "valueDelta",
          subject: { kind: "entity", id: "gd_not-on-board" },
          delta: -2,
        },
        startAtMs: 0,
        durationMs: 600,
      },
    ],
  };

  try {
    render(<CyberpunkThreeFeedbackLayer enablePhaseSweep />);
    expect(document.querySelector("[data-value-pulse]")).toBeNull();
  } finally {
    animation.runtime.activeTransition = null;
    animation.runtime.compiledPlan = {
      steps: [
        {
          step: { id: "turn", type: "phaseChange", from: "main", to: "start", variant: "turn" },
          startAtMs: 0,
          durationMs: 1_500,
        },
      ],
    };
  }
});
