import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { flotsamSlipperyAsAnEel } from "./071-flotsam-slippery-as-an-eel";

describe("Flotsam - Slippery as an Eel", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(flotsamSlipperyAsAnEel)).toBe(true);
  });
});
