import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { scuttleBirdbrained } from "./147-scuttle-birdbrained";

describe("Scuttle - Birdbrained", () => {
  it("should have Ward ability", () => {
    expect(hasWard(scuttleBirdbrained)).toBe(true);
  });
});
