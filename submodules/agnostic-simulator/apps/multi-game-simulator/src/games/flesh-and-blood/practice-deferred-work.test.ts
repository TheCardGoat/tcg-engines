import { describe, expect, it, vi } from "vitest";

import { createFabPracticeDeferredWorkQueue } from "./practice-deferred-work";

describe("FAB practice deferred command work", () => {
  it("waits for the matching transition and commits history through a React transition", () => {
    const order: string[] = [];
    const microtasks: Array<() => void> = [];
    const queue = createFabPracticeDeferredWorkQueue({
      run: (id, stage, work) => {
        order.push(`${id}:${stage}`);
        work();
      },
      startTransition: (work) => {
        order.push("react-transition");
        work();
      },
      persist: (snapshot: number) => order.push(`persist:${snapshot}`),
      scheduleMicrotask: (work) => microtasks.push(work),
    });

    queue.defer(
      {
        correlationId: "command:1",
        snapshot: 1,
        commitAnalytics: () => order.push("analytics-work"),
        commitTelemetry: () => order.push("telemetry-work"),
      },
      true,
    );
    queue.settle("another-command");
    expect(order).toEqual([]);

    queue.settle("command:1");
    expect(order).toEqual([
      "command:1:analytics",
      "analytics-work",
      "react-transition",
      "command:1:telemetry",
      "telemetry-work",
    ]);
    expect(microtasks).toHaveLength(1);
    microtasks.shift()?.();
    expect(order.at(-1)).toBe("persist:1");
  });

  it("coalesces persistence to the newest settled snapshot", () => {
    const persisted = vi.fn();
    const microtasks: Array<() => void> = [];
    const queue = createFabPracticeDeferredWorkQueue({
      run: (_id, _stage, work) => work(),
      startTransition: (work) => work(),
      persist: persisted,
      scheduleMicrotask: (work) => microtasks.push(work),
    });
    const work = (id: string, snapshot: number) => ({
      correlationId: id,
      snapshot,
      commitAnalytics: vi.fn(),
      commitTelemetry: vi.fn(),
    });

    queue.defer(work("one", 1), true);
    queue.defer(work("two", 2), true);
    queue.settle("one");
    queue.settle("two");
    expect(microtasks).toHaveLength(1);
    microtasks.shift()?.();
    expect(persisted).toHaveBeenCalledOnce();
    expect(persisted).toHaveBeenCalledWith(2);
  });

  it("flushes analytics, telemetry, and the newest snapshot on pagehide", () => {
    const order: string[] = [];
    const persisted = vi.fn();
    const queue = createFabPracticeDeferredWorkQueue({
      run: (id, stage, work) => {
        order.push(`${id}:${stage}`);
        work();
      },
      startTransition: () => {
        throw new Error("pagehide must commit telemetry synchronously");
      },
      persist: persisted,
      scheduleMicrotask: vi.fn(),
    });
    for (const snapshot of [1, 2]) {
      queue.defer(
        {
          correlationId: `command:${snapshot}`,
          snapshot,
          commitAnalytics: vi.fn(),
          commitTelemetry: vi.fn(),
        },
        true,
      );
    }

    queue.flushPageHide();
    expect(order).toEqual([
      "command:1:analytics",
      "command:1:telemetry",
      "command:2:analytics",
      "command:2:telemetry",
    ]);
    expect(persisted).toHaveBeenCalledWith(2);
    expect(queue.pendingCount()).toBe(0);
  });
});
