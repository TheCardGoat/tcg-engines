import { describe, expect, test } from "vitest";

import { consecutiveAnimationStaggerMs } from "./stagger.js";

describe("consecutiveAnimationStaggerMs", () => {
  test("increments every item in a consecutive run without collapsing the tail", () => {
    const items = ["draw", "draw", "draw", "draw", "draw"];

    expect(items.map((_, index) => consecutiveAnimationStaggerMs(items, index, String))).toEqual([
      0, 65, 130, 195, 260,
    ]);
  });

  test("starts a new run when the key changes", () => {
    const items = ["draw", "draw", "discard", "draw"];

    expect(items.map((_, index) => consecutiveAnimationStaggerMs(items, index, String))).toEqual([
      0, 65, 0, 0,
    ]);
  });
});
