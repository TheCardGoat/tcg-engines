import { describe, expect, it } from "bun:test";
import { robinHoodDaydreamer } from "./084-robin-hood-daydreamer";

describe("Robin Hood - Daydreamer", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(robinHoodDaydreamer.vanilla).toBe(true);
    expect(robinHoodDaydreamer.abilities).toBeUndefined();
  });
});
