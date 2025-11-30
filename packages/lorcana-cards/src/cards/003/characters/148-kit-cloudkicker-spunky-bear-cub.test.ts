import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { kitCloudkickerSpunkyBearCub } from "./148-kit-cloudkicker-spunky-bear-cub";

describe("Kit Cloudkicker - Spunky Bear Cub", () => {
  it("should have Ward ability", () => {
    expect(hasWard(kitCloudkickerSpunkyBearCub)).toBe(true);
  });
});
