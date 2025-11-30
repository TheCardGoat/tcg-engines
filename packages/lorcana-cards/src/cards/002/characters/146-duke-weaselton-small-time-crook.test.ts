import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { dukeWeaseltonSmalltimeCrook } from "./146-duke-weaselton-small-time-crook";

describe("Duke Weaselton - Small-Time Crook", () => {
  it("should have Ward ability", () => {
    expect(hasWard(dukeWeaseltonSmalltimeCrook)).toBe(true);
  });
});
