// @vitest-environment jsdom

import type { AnimationPlanV1 } from "@tcg/protocol";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { act } from "react";
import type { ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { MotionAnimationSurface } from "./MotionAnimationSurface";

interface StubOverlay {
  id: string;
  planId: string;
}

interface StubOverlayProps {
  overlay: StubOverlay;
  onComplete: (overlay: StubOverlay) => void;
  visible?: boolean;
}

vi.mock("./MotionOverlays", () => {
  const StuckOverlay = ({ overlay, onComplete, visible }: StubOverlayProps) => (
    <button
      type="button"
      data-testid="stuck-motion-overlay"
      data-plan-id={overlay.planId}
      data-visible={visible === undefined ? undefined : visible ? "true" : "false"}
      onClick={() => onComplete(overlay)}
    >
      Complete {overlay.planId}
    </button>
  );
  return {
    BeamMotionOverlay: StuckOverlay,
    CardMotionOverlay: StuckOverlay,
    LayoutShiftSentinel: StuckOverlay,
    PhaseMotionOverlay: StuckOverlay,
    ResourceMotionOverlay: StuckOverlay,
  };
});

function phasePlan(id: string): AnimationPlanV1 {
  return {
    id,
    version: 1,
    anchors: [],
    steps: [{ id: `${id}-step`, type: "phaseChange", from: "main", to: "start" }],
  };
}

let activeRoot: Root | null = null;
let activeContainer: HTMLDivElement | null = null;

function renderSurface(
  plans: readonly AnimationPlanV1[],
  onPlanComplete: (id: string) => void,
  options: { children?: ReactNode; resolveEntity?: (entityId: string) => SimulatorEntity } = {},
) {
  activeContainer = document.createElement("div");
  document.body.append(activeContainer);
  activeRoot = createRoot(activeContainer);
  const renderPlans = (nextPlans: readonly AnimationPlanV1[]) =>
    activeRoot?.render(
      <MotionAnimationSurface
        animationPlans={nextPlans}
        onPlanComplete={onPlanComplete}
        resolveEntity={options.resolveEntity}
      >
        {options.children ?? <div data-sim-board />}
      </MotionAnimationSurface>,
    );
  act(() => {
    renderPlans(plans);
  });
  return {
    container: activeContainer,
    rerender: (nextPlans: readonly AnimationPlanV1[]) => {
      act(() => renderPlans(nextPlans));
    },
    unmount: () => {
      act(() => activeRoot?.unmount());
      activeRoot = null;
      activeContainer?.remove();
      activeContainer = null;
    },
  };
}

describe("MotionAnimationSurface animation watchdog", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (activeRoot) {
      act(() => activeRoot?.unmount());
    }
    activeContainer?.remove();
    activeRoot = null;
    activeContainer = null;
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("force-completes and clears a plan whose overlay never completes", () => {
    const onPlanComplete = vi.fn();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const view = renderSurface([phasePlan("stuck-plan")], onPlanComplete);

    expect(view.container.querySelector('[data-testid="stuck-motion-overlay"]')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(view.container.querySelector('[data-testid="stuck-motion-overlay"]')).toBeNull();
    expect(onPlanComplete).toHaveBeenCalledTimes(1);
    expect(onPlanComplete).toHaveBeenCalledWith("stuck-plan");
    expect(warn).toHaveBeenCalledWith(
      "[sim-animation] animation plan watchdog timed out",
      expect.objectContaining({
        planId: "stuck-plan",
        pendingStepIds: ["stuck-plan-step"],
        timeoutMs: 10_000,
      }),
    );
  });

  test("removes card suppression when a card animation times out", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      bottom: 120,
      height: 100,
      left: 20,
      right: 100,
      top: 20,
      width: 80,
      x: 20,
      y: 20,
      toJSON: () => ({}),
    });
    const entity: SimulatorEntity = {
      id: "card-1",
      title: "Card One",
      subtitle: "Unit",
      kind: "unit",
      ownerId: "player-1",
      face: "public",
      states: [],
      stats: [],
      traits: [],
    };
    const plan: AnimationPlanV1 = {
      id: "card-plan",
      version: 1,
      anchors: [],
      steps: [
        {
          id: "card-step",
          type: "moveEntity",
          entity: { kind: "entity", id: entity.id },
          from: { kind: "zone", id: "source-zone", ownerId: entity.ownerId },
          to: { kind: "zone", id: "target-zone", ownerId: entity.ownerId },
          sourceFace: "public",
          destinationFace: "public",
        },
      ],
    };
    const view = renderSurface([plan], vi.fn(), {
      resolveEntity: () => entity,
      children: (
        <div data-sim-board>
          <div data-sim-zone-id="source-zone">
            <div data-sim-entity-id={entity.id}>
              <div className="sim-card-face" />
            </div>
          </div>
          <div data-sim-zone-id="target-zone" />
        </div>
      ),
    });

    expect(view.container.querySelector("style")?.textContent).toContain(entity.id);

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(view.container.querySelector('[data-testid="stuck-motion-overlay"]')).toBeNull();
    expect(view.container.querySelector("style")?.textContent).not.toContain(entity.id);
  });

  test("isolates plans and cancels the watchdog after normal completion", () => {
    const onPlanComplete = vi.fn();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const completedPlan = phasePlan("completed-plan");
    const stuckPlan = phasePlan("other-plan");

    const view = renderSurface([completedPlan, stuckPlan], onPlanComplete);

    const completedPlanButton = view.container.querySelector<HTMLButtonElement>(
      '[data-plan-id="completed-plan"]',
    );
    expect(completedPlanButton).toBeTruthy();
    act(() => completedPlanButton?.click());
    expect(onPlanComplete).toHaveBeenCalledWith("completed-plan");

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(onPlanComplete).toHaveBeenCalledTimes(2);
    expect(onPlanComplete).toHaveBeenCalledWith("other-plan");
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      "[sim-animation] animation plan watchdog timed out",
      expect.objectContaining({ planId: "other-plan" }),
    );
  });

  test("cancels outstanding watchdogs when the surface unmounts", () => {
    const onPlanComplete = vi.fn();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = renderSurface([phasePlan("removed-plan")], onPlanComplete);

    view.unmount();
    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(onPlanComplete).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  test("cancels outstanding watchdogs when a plan is removed", () => {
    const onPlanComplete = vi.fn();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const view = renderSurface([phasePlan("reset-plan")], onPlanComplete);

    view.rerender([]);
    expect(view.container.querySelector('[data-testid="stuck-motion-overlay"]')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(onPlanComplete).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});
