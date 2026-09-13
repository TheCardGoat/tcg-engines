import { describe, expect, it } from "vitest";

import { replayRoutePath } from "./replay-route-path";

describe("replayRoutePath", () => {
  it("builds a standalone simulator replay route", () => {
    expect(replayRoutePath("game /1", "")).toBe("/replay/game%20%2F1");
  });

  it("preserves the configured platform mount path", () => {
    expect(replayRoutePath("game /1", "/lorcana/simulator/")).toBe(
      "/lorcana/simulator/replay/game%20%2F1",
    );
  });
});
