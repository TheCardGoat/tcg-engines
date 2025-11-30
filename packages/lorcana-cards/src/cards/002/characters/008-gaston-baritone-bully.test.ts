import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

describe("Gaston - Baritone Bully", () => {
  it("should have Singer 5 ability", () => {
    expect(hasKeyword(gastonBaritoneBully, "Singer")).toBe(true);
  });
});
