// @vitest-environment jsdom
import { cleanup, renderHook } from "@testing-library/react";
import type { AnimationPlanV2, EntityTransferStepV2 } from "@tcg/protocol";
import { compileAnimationPlan } from "@tcg/simulator-runtime/animation";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { useUnitEntryPromptPending } from "./useUnitEntryPromptPending";

const entryStep: EntityTransferStepV2 = {
  id: "entry",
  type: "entityTransfer",
  entity: { kind: "entity", id: "unit" },
  from: { kind: "zone", id: "p-hand" },
  to: { kind: "zone", id: "p-field" },
  sourceFace: "public",
  destinationFace: "public",
  durationMs: 760,
};
const plan: AnimationPlanV2 = {
  id: "unit-entry",
  version: 2,
  steps: [entryStep],
};
type Input = NonNullable<Parameters<typeof useUnitEntryPromptPending>[0]>;
function runtime(
  id: string,
  phase: "preparing" | "running" | "reflowing",
  speed: "normal" | "off" = "normal",
): Input {
  return {
    playbackStartedAtMs: 0,
    compiledPlan: compileAnimationPlan(plan, speed),
    activeTransition: {
      id,
      phase,
      plan,
      source: "authoritative",
      fromState: {},
      toState: {},
      fromVersion: 1,
      toVersion: 2,
    },
  };
}
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

test("entry prompt is available during flight as soon as its destination is mounted", () => {
  vi.useFakeTimers();
  const view = renderHook(useUnitEntryPromptPending, {
    initialProps: runtime("first", "preparing"),
  });
  expect(view.result.current).toBe(true);
  view.rerender(runtime("first", "running"));
  expect(view.result.current).toBe(false);
  view.rerender(runtime("second", "preparing"));
  expect(view.result.current).toBe(true);
  view.rerender(runtime("second", "running"));
  expect(view.result.current).toBe(false);
  view.rerender(runtime("second", "reflowing"));
  expect(view.result.current).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
});

test("instant playback and non-entry transitions do not delay choices", () => {
  vi.useFakeTimers();
  const view = renderHook(useUnitEntryPromptPending, {
    initialProps: runtime("instant", "running", "off"),
  });
  expect(view.result.current).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
  view.rerender({
    ...runtime("other", "running"),
    compiledPlan: compileAnimationPlan({
      ...plan,
      steps: [{ ...entryStep, to: { kind: "zone", id: "p-trash" } }],
    }),
  });
  expect(view.result.current).toBe(false);
});
