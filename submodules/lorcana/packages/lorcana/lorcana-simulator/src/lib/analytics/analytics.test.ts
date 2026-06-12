import { describe, expect, it } from "bun:test";
import { ANALYTICS_TEXT_MAX_LENGTH, truncateForAnalytics } from "./analytics.js";

describe("truncateForAnalytics", () => {
  it("returns undefined for null/undefined/empty", () => {
    expect(truncateForAnalytics(null)).toBeUndefined();
    expect(truncateForAnalytics(undefined)).toBeUndefined();
    expect(truncateForAnalytics("")).toBeUndefined();
  });

  it("returns the string unchanged when under the limit", () => {
    expect(truncateForAnalytics("short error")).toBe("short error");
  });

  it("truncates to ANALYTICS_TEXT_MAX_LENGTH characters", () => {
    const longInput = "x".repeat(ANALYTICS_TEXT_MAX_LENGTH + 50);
    const result = truncateForAnalytics(longInput);
    expect(result).toHaveLength(ANALYTICS_TEXT_MAX_LENGTH);
  });

  it("coerces non-string inputs via String()", () => {
    expect(truncateForAnalytics(42)).toBe("42");
    expect(truncateForAnalytics(new Error("boom"))).toBe("Error: boom");
  });

  it("ANALYTICS_TEXT_MAX_LENGTH is 100 (GA4 hard limit)", () => {
    expect(ANALYTICS_TEXT_MAX_LENGTH).toBe(100);
  });
});
