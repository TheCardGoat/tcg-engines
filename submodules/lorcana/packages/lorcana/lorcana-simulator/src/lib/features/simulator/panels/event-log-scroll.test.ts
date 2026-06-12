import { describe, expect, it } from "bun:test";

import { isScrolledNearBottom, shouldAutoScrollOnNewRows } from "./event-log-scroll.js";

describe("event log scroll", () => {
  it.skip("treats nearby bottom positions as pinned", () => {
    expect(
      isScrolledNearBottom({
        scrollHeight: 1000,
        scrollTop: 776,
        clientHeight: 200,
      }),
    ).toBe(true);
  });

  it.skip("auto-scrolls when a new row is added", () => {
    expect(shouldAutoScrollOnNewRows(10, 9)).toBe(true);
  });

  it.skip("does not auto-scroll when no new rows were added", () => {
    expect(shouldAutoScrollOnNewRows(10, 10)).toBe(false);
  });

  it("does not require a new group to auto-scroll", () => {
    expect(shouldAutoScrollOnNewRows(12, 11)).toBe(true);
  });
});
