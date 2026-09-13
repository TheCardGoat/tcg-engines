import { describe, expect, it } from "vitest";
import {
  DEFAULT_FAB_LOOP_LIMIT,
  FabLoopLimitError,
  createFabLoopGuard,
} from "@tcg/flesh-and-blood-types";

describe("createFabLoopGuard", () => {
  it("does not throw while the budget has not been exceeded", () => {
    const guard = createFabLoopGuard({ label: "bounded" });
    for (let i = 0; i < DEFAULT_FAB_LOOP_LIMIT; i += 1) guard.tick();
    expect(guard.count).toBe(DEFAULT_FAB_LOOP_LIMIT);
    expect(guard.limit).toBe(DEFAULT_FAB_LOOP_LIMIT);
  });

  it("throws a typed FabLoopLimitError one iteration past a custom limit", () => {
    const guard = createFabLoopGuard({ label: "replacement stage", limit: 3 });
    guard.tick();
    guard.tick();
    guard.tick();

    let caught: unknown;
    try {
      guard.tick();
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(FabLoopLimitError);
    const error = caught as FabLoopLimitError;
    expect(error.label).toBe("replacement stage");
    expect(error.limit).toBe(3);
    expect(error.count).toBe(4);
    expect(error.message).toContain("FAB loop iteration limit exceeded (replacement stage)");
  });
});
