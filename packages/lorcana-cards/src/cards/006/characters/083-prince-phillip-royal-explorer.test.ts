import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { princePhillipRoyalExplorer } from "./083-prince-phillip-royal-explorer";

describe("Prince Phillip - Royal Explorer", () => {
  it("should have Ward ability", () => {
    expect(hasWard(princePhillipRoyalExplorer)).toBe(true);
  });
});
