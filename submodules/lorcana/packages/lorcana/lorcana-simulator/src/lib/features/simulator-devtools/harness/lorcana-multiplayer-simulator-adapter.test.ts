import { describe, expect, it } from "bun:test";

import { selectFallbackMoveLogWindow } from "./lorcana-multiplayer-simulator-adapter.js";

describe("selectFallbackMoveLogWindow", () => {
  it("aligns fallback logs to the returned move-history window", () => {
    expect(selectFallbackMoveLogWindow(["a", "b", "c", "d"], 4, 2)).toEqual(["c", "d"]);
  });

  it("returns the full fallback list when the limit exceeds history length", () => {
    expect(selectFallbackMoveLogWindow(["a", "b"], 2, 50)).toEqual(["a", "b"]);
  });
});
