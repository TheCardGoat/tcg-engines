import { describe, expect, test, vi } from "vitest";

import { compileAnimationPlan } from "./compile-plan.js";
import { createSimulatorAnimationStore } from "./transition-store.js";

interface State {
  readonly cards: readonly string[];
}

const plan = {
  id: "move",
  version: 2,
  steps: [
    {
      id: "move:a",
      type: "entityTransfer",
      entity: { kind: "entity", id: "a" },
      from: { kind: "zone", id: "field" },
      to: { kind: "zone", id: "trash" },
      sourceFace: "public",
      destinationFace: "public",
    },
  ],
} as const;

describe("createSimulatorAnimationStore", () => {
  test("separates authoritative, presentation, and settled state", () => {
    const store = createSimulatorAnimationStore<State>();
    const from = { cards: ["a", "b"] };
    const to = { cards: ["b"] };
    store.hydrate({ state: from, version: 1 });
    store.enqueue({ state: to, version: 2, plan });

    expect(store.getSnapshot().authoritativeState).toBe(to);
    expect(store.getSnapshot().presentationState).toBe(from);
    expect(store.getSnapshot().settledState).toBe(from);
    const id = store.getSnapshot().activeTransition!.id;

    store.startActive(id);
    expect(store.getSnapshot().presentationState).toBe(to);
    expect(store.getSnapshot().settledState).toBe(from);

    store.beginReflow(id);
    expect(store.getSnapshot().activeTransition?.phase).toBe("reflowing");
    store.finishActive(id);
    expect(store.getSnapshot().settledState).toBe(to);
  });

  test("chains queued transitions from the preceding target", () => {
    const store = createSimulatorAnimationStore<State>();
    const one = { cards: ["a", "b"] };
    const two = { cards: ["b"] };
    const three = { cards: ["c"] };
    store.hydrate({ state: one, version: 1 });
    store.enqueue({ state: two, version: 2, plan });
    store.enqueue({ state: three, version: 3, plan: { ...plan, id: "move-2" } });

    expect(store.getSnapshot().queuedTransitions[0]?.fromState).toBe(two);
    expect(store.getSnapshot().queuedTransitions[0]?.toState).toBe(three);
  });

  test("ignores stale updates and sync replacement cancels pending work", () => {
    const diagnostic = vi.fn();
    const store = createSimulatorAnimationStore<State>({ onDiagnostic: diagnostic });
    const one = { cards: ["a"] };
    const two = { cards: [] };
    store.hydrate({ state: one, version: 2 });
    expect(store.enqueue({ state: two, version: 2, plan })).toBe(false);
    expect(diagnostic).toHaveBeenCalledWith(
      expect.objectContaining({ type: "stale-update", receivedVersion: 2 }),
    );

    store.enqueue({ state: two, version: 3, plan });
    store.replaceFromSync({ state: one, version: 7 });
    expect(store.getSnapshot()).toMatchObject({
      authoritativeState: one,
      settledState: one,
      presentationState: one,
      authoritativeVersion: 7,
      activeTransition: null,
      queuedTransitions: [],
    });
  });

  test("refreshes the current projected state without cancelling its animation", () => {
    const store = createSimulatorAnimationStore<State>();
    const before = { cards: ["a"] };
    const after = { cards: [] };
    const refreshedAfter = { cards: [] };
    store.hydrate({ state: before, version: 1 });
    store.enqueue({ state: after, version: 2, plan });
    const active = store.getSnapshot().activeTransition!;

    expect(store.refreshFromProjection({ state: refreshedAfter, version: 2 })).toBe(true);
    expect(store.getSnapshot()).toMatchObject({
      authoritativeState: refreshedAfter,
      presentationState: before,
      activeTransition: {
        id: active.id,
        phase: "preparing",
        fromState: before,
        toState: refreshedAfter,
      },
    });

    store.startActive(active.id);
    expect(store.getSnapshot()).toMatchObject({
      presentationState: refreshedAfter,
      activeTransition: { id: active.id, phase: "running" },
    });
    expect(store.refreshFromProjection({ state: before, version: 1 })).toBe(false);
  });

  test("commits a no-plan update only when it reaches the queue head", () => {
    const store = createSimulatorAnimationStore<State>();
    const one = { cards: ["a"] };
    const two = { cards: [] };
    const three = { cards: ["b"] };
    store.hydrate({ state: one, version: 1 });
    store.enqueue({ state: two, version: 2, plan });
    store.enqueue({ state: three, version: 3, plan: null });

    expect(store.getSnapshot().presentationState).toBe(one);
    const activeId = store.getSnapshot().activeTransition!.id;
    store.startActive(activeId);
    store.beginReflow(activeId);
    store.finishActive(activeId);

    expect(store.getSnapshot()).toMatchObject({
      authoritativeState: three,
      settledState: three,
      presentationState: three,
      activeTransition: null,
      queuedTransitions: [],
    });
  });

  test("accepts version gaps and ignores stale completion ids", () => {
    const store = createSimulatorAnimationStore<State>();
    store.hydrate({ state: { cards: ["a"] }, version: 1 });
    expect(store.enqueue({ state: { cards: [] }, version: 8, plan })).toBe(true);
    const active = store.getSnapshot().activeTransition;
    expect(active?.toVersion).toBe(8);

    store.startActive("stale-id");
    store.beginReflow("stale-id");
    store.finishActive("stale-id");
    expect(store.getSnapshot().activeTransition).toBe(active);
  });

  test("whenIdle resolves after the active transition and queued snap finish", async () => {
    const store = createSimulatorAnimationStore<State>();
    store.hydrate({ state: { cards: ["a"] }, version: 1 });
    store.enqueue({ state: { cards: [] }, version: 2, plan });
    store.enqueue({ state: { cards: ["b"] }, version: 3, plan: null });
    const idle = store.whenIdle(100);
    const id = store.getSnapshot().activeTransition!.id;
    store.startActive(id);
    store.beginReflow(id);
    store.finishActive(id);

    await expect(idle).resolves.toBe("idle");
  });

  test("skipActive reports cancellation and advances queued work", () => {
    const diagnostic = vi.fn();
    const store = createSimulatorAnimationStore<State>({ onDiagnostic: diagnostic });
    store.hydrate({ state: { cards: ["a"] }, version: 1 });
    store.enqueue({ state: { cards: [] }, version: 2, plan });
    store.enqueue({
      state: { cards: ["b"] },
      version: 3,
      plan: { ...plan, id: "next" },
    });
    const firstId = store.getSnapshot().activeTransition!.id;
    store.skipActive("user-skip");

    expect(diagnostic).toHaveBeenCalledWith({
      type: "cancelled",
      transitionId: firstId,
      reason: "user-skip",
    });
    expect(store.getSnapshot().activeTransition?.plan.id).toBe("next");
  });
});

describe("compileAnimationPlan", () => {
  test("scales one timeline for motion, audio, and watchdogs", () => {
    const compiled = compileAnimationPlan(
      {
        ...plan,
        steps: [{ ...plan.steps[0], startAtMs: 100, durationMs: 600, audioCue: "card.move" }],
      },
      "fast",
    );

    expect(compiled.steps[0]).toMatchObject({ startAtMs: 50, durationMs: 300, endAtMs: 350 });
    expect(compiled.audioCues).toEqual([
      { planId: "move", stepId: "move:a", cue: "card.move", startAtMs: 50 },
    ]);
    expect(compiled.reflowDurationMs).toBe(120);
  });

  test.each([
    ["off", 0],
    ["normal", 600],
    ["slow", 900],
  ] as const)("applies the %s speed scale", (speed, expectedDuration) => {
    const compiled = compileAnimationPlan(
      { ...plan, steps: [{ ...plan.steps[0], durationMs: 600 }] },
      speed,
    );
    expect(compiled.primaryDurationMs).toBe(expectedDuration);
  });

  test("reduced motion compiles all visual and reflow timing to zero", () => {
    const compiled = compileAnimationPlan(
      { ...plan, steps: [{ ...plan.steps[0], audioCue: "card.move" }] },
      "slow",
      true,
    );
    expect(compiled.primaryDurationMs).toBe(0);
    expect(compiled.reflowDurationMs).toBe(0);
    expect(compiled.audioCues).toEqual([
      { planId: "move", stepId: "move:a", cue: "card.move", startAtMs: 0 },
    ]);
  });
});
