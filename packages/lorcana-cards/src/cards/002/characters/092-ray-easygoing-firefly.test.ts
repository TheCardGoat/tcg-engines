import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { rayEasygoingFirefly } from "./092-ray-easygoing-firefly";

describe("Ray - Easygoing Firefly", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(rayEasygoingFirefly)).toBe(true);
  });
});
