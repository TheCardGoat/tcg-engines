import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { heathcliffStoicButler } from "./078-heathcliff-stoic-butler";

describe("Heathcliff - Stoic Butler", () => {
  it("should have Ward ability", () => {
    expect(hasWard(heathcliffStoicButler)).toBe(true);
  });
});
