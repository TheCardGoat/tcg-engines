// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { compileAnimationPlan } from "@tcg/simulator-runtime/animation";
import type { AnimationPlanV2 } from "@tcg/protocol";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { useAnimatedEntityIds } from "./useAnimatedEntityIds";

const plan: AnimationPlanV2 = {
  version: 2,
  id: "flight",
  steps: [
    {
      id: "a",
      type: "entityTransfer",
      entity: { kind: "entity", id: "A" },
      from: { kind: "zone", id: "hand" },
      to: { kind: "zone", id: "field" },
      sourceFace: "public",
      destinationFace: "public",
      durationMs: 800,
    },
    {
      id: "b",
      type: "entityStateChange",
      entity: { kind: "entity", id: "B" },
      at: { kind: "entity", id: "B" },
      change: "orientation",
      sourceFace: "public",
      destinationFace: "public",
      durationMs: 1200,
    },
    { id: "hold", type: "hold", durationMs: 2000 },
  ],
};
type Playback = NonNullable<Parameters<typeof useAnimatedEntityIds>[0]>;
function runtime(
  id: string,
  phase: "preparing" | "running" | "reflowing",
  speed: "normal" | "off" = "normal",
): Playback {
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
let root: Root | undefined;
let container: HTMLDivElement | undefined;
let ids: ReadonlySet<string> = new Set();
function Probe({
  playback,
  handoff,
}: {
  playback: Playback;
  handoff?: Parameters<typeof useAnimatedEntityIds>[1];
}) {
  ids = useAnimatedEntityIds(playback, handoff);
  return null;
}
async function render(playback: Playback, handoff?: Parameters<typeof useAnimatedEntityIds>[1]) {
  if (!container) {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  }
  await act(async () => root!.render(<Probe playback={playback} handoff={handoff} />));
}
afterEach(async () => {
  await act(async () => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
  vi.useRealTimers();
  vi.restoreAllMocks();
});

test("releases each entity at its own handoff while the rest of the plan continues", async () => {
  vi.useFakeTimers();
  vi.spyOn(performance, "now").mockReturnValue(0);
  await render(runtime("first", "preparing"));
  expect([...ids]).toEqual(["A", "B"]);
  await render(runtime("first", "running"));
  await act(async () => vi.advanceTimersByTime(559));
  expect([...ids]).toEqual(["A", "B"]);
  await act(async () => vi.advanceTimersByTime(1));
  expect([...ids]).toEqual(["B"]);
  await act(async () => vi.advanceTimersByTime(280));
  expect([...ids]).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
});

test("supports an early contact handoff and resets timing for a new transition", async () => {
  vi.useFakeTimers();
  vi.spyOn(performance, "now").mockReturnValue(0);
  const contact: NonNullable<Parameters<typeof useAnimatedEntityIds>[1]> = (entry) =>
    entry.step.type === "entityTransfer"
      ? entry.startAtMs + entry.durationMs * 0.75
      : entry.endAtMs;
  await render(runtime("first", "running"), contact);
  await act(async () => vi.advanceTimersByTime(420));
  expect([...ids]).toEqual(["B"]);
  await render(runtime("second", "running"), contact);
  expect([...ids]).toEqual(["A", "B"]);
  await render(runtime("second", "reflowing"), contact);
  expect([...ids]).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
});

test("instant playback has no hidden entities or timers", async () => {
  vi.useFakeTimers();
  await render(runtime("instant", "running", "off"));
  expect([...ids]).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
});
