import { describe, expect, it } from "bun:test";
import { robinHoodBelovedOutlaw } from "./189-robin-hood-beloved-outlaw";

describe("Robin Hood - Beloved Outlaw", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(robinHoodBelovedOutlaw.vanilla).toBe(true);
    expect(robinHoodBelovedOutlaw.abilities).toBeUndefined();
  });
});
