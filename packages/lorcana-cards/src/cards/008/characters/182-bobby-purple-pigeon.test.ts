import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { bobbyPurplePigeon } from "./182-bobby-purple-pigeon";

describe("Bobby - Purple Pigeon", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(bobbyPurplePigeon)).toBe(true);
  });
});
