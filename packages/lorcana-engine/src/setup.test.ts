import { describe, expect, it } from "bun:test";

describe("@tcg/lorcana Package Setup", () => {
  it("package is properly configured", () => {
    // Basic smoke test to verify package structure
    expect(true).toBe(true);
  });

  it("can import from @tcg/core", async () => {
    const core = await import("@tcg/core");
    expect(core).toBeDefined();
    expect(core.RuleEngine).toBeDefined();
  });
});
