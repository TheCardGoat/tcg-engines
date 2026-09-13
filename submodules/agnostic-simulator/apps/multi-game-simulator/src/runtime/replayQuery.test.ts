import { describe, expect, it } from "vite-plus/test";

import { parseNonNegativeIntegerQuery, syncReplayStepQuery } from "./replayQuery.ts";

describe("replay query helpers", () => {
  it("accepts only safe non-negative integer query values", () => {
    expect(parseNonNegativeIntegerQuery("42")).toBe(42);
    expect(parseNonNegativeIntegerQuery("42abc")).toBeNull();
    expect(parseNonNegativeIntegerQuery("-1")).toBeNull();
    expect(parseNonNegativeIntegerQuery("1.5")).toBeNull();
    expect(parseNonNegativeIntegerQuery(null)).toBeNull();
  });

  it("replaces a state-version anchor with the displayed replay step", () => {
    expect(syncReplayStepQuery("?stateVersion=83&side=playerOne", 12)).toBe(
      "?side=playerOne&step=12",
    );
    expect(syncReplayStepQuery("?stateVersion=83&step=12", 0)).toBe("");
  });
});
