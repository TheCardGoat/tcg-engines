import { describe, expect, test } from "vitest";

import { createLiveTransitionController } from "./live-transition";

interface TestState {
  version: number;
  cards: readonly string[];
}

interface TestAnimation {
  id: string;
  kind: "exit" | "move";
}

describe("createLiveTransitionController", () => {
  test("holds display state until an authoritative animation completes", () => {
    const controller = createLiveTransitionController<TestState, TestAnimation>();
    const fromState = { version: 1, cards: ["a", "b", "c"] };
    const toState = { version: 2, cards: [] };

    controller.hydrateAuthoritativeState({ state: fromState, version: 1 });
    controller.enqueueAuthoritativeUpdate({
      state: toState,
      version: 2,
      animationPlan: [
        { id: "wipe:a", kind: "exit" },
        { id: "wipe:b", kind: "exit" },
        { id: "wipe:c", kind: "exit" },
      ],
    });

    const animating = controller.getSnapshot();
    expect(animating.authoritativeState).toBe(toState);
    expect(animating.displayState).toBe(fromState);
    expect(animating.activeTransition?.status).toBe("animating");
    expect(animating.activeTransition?.animationPlan).toHaveLength(3);

    controller.markAnimationComplete(animating.activeTransition!.id);

    const committed = controller.getSnapshot();
    expect(committed.displayState).toBe(toState);
    expect(committed.displayVersion).toBe(2);
    expect(committed.activeTransition).toBeNull();
  });

  test("commits authoritative updates immediately when there are no animations", () => {
    const controller = createLiveTransitionController<TestState, TestAnimation>();
    const fromState = { version: 1, cards: ["a"] };
    const toState = { version: 2, cards: ["a", "b"] };

    controller.hydrateAuthoritativeState({ state: fromState, version: 1 });
    controller.enqueueAuthoritativeUpdate({ state: toState, version: 2 });

    const snapshot = controller.getSnapshot();
    expect(snapshot.authoritativeState).toBe(toState);
    expect(snapshot.displayState).toBe(toState);
    expect(snapshot.activeTransition).toBeNull();
    expect(snapshot.queuedTransitions).toHaveLength(0);
  });

  test("chains queued authoritative transitions from the previous transition target", () => {
    const controller = createLiveTransitionController<TestState, TestAnimation>();
    const state1 = { version: 1, cards: ["a", "b"] };
    const state2 = { version: 2, cards: ["b"] };
    const state3 = { version: 3, cards: ["c"] };

    controller.hydrateAuthoritativeState({ state: state1, version: 1 });
    controller.enqueueAuthoritativeUpdate({
      state: state2,
      version: 2,
      animationPlan: [{ id: "remove:a", kind: "exit" }],
    });
    controller.enqueueAuthoritativeUpdate({
      state: state3,
      version: 3,
      animationPlan: [{ id: "replace:b", kind: "move" }],
    });

    const first = controller.getSnapshot().activeTransition;
    const queued = controller.getSnapshot().queuedTransitions[0];

    expect(first?.fromState).toBe(state1);
    expect(first?.toState).toBe(state2);
    expect(queued?.fromState).toBe(state2);
    expect(queued?.toState).toBe(state3);
  });

  test("queues sync updates behind an active transition", () => {
    const controller = createLiveTransitionController<TestState, TestAnimation>();
    const state1 = { version: 1, cards: ["a"] };
    const state2 = { version: 2, cards: ["b"] };
    const syncState = { version: 5, cards: ["server:x"] };

    controller.hydrateAuthoritativeState({ state: state1, version: 1 });
    controller.enqueueAuthoritativeUpdate({
      state: state2,
      version: 2,
      animationPlan: [{ id: "a-to-b", kind: "move" }],
    });
    controller.enqueueAuthoritativeUpdate({
      state: syncState,
      version: 5,
      source: "sync",
    });

    const snapshot = controller.getSnapshot();
    expect(snapshot.authoritativeState).toBe(syncState);
    expect(snapshot.activeTransition?.source).toBe("authoritative");
    expect(snapshot.queuedTransitions[0]?.source).toBe("sync");
    expect(snapshot.queuedTransitions[0]?.fromState).toBe(state2);
  });

  test("ignores completion for a stale transition id", () => {
    const controller = createLiveTransitionController<TestState, TestAnimation>();
    const fromState = { version: 1, cards: ["hand:program", "field:target"] };
    const toState = { version: 2, cards: ["trash:program", "trash:target"] };

    controller.hydrateAuthoritativeState({ state: fromState, version: 1 });
    controller.enqueueAuthoritativeUpdate({
      state: toState,
      version: 2,
      animationPlan: [{ id: "program-defeats-target", kind: "move" }],
    });

    const animating = controller.getSnapshot();
    controller.markAnimationComplete("wrong-transition-id");
    expect(controller.getSnapshot().displayState).toBe(fromState);

    controller.markAnimationComplete(animating.activeTransition!.id);
    expect(controller.getSnapshot().displayState).toBe(toState);
  });
});
