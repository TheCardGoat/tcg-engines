import { describe, expect, it } from "vitest";

import { EXTERNAL_SOURCES, isExternalSource } from "./index.js";

describe("isExternalSource", () => {
  it("returns true for every member of EXTERNAL_SOURCES", () => {
    for (const source of EXTERNAL_SOURCES) {
      expect(isExternalSource(source)).toBe(true);
    }
  });

  it("returns false for unknown strings, non-strings, and cdn", () => {
    expect(isExternalSource("cdn")).toBe(false);
    expect(isExternalSource("not-a-source")).toBe(false);
    expect(isExternalSource("")).toBe(false);
    expect(isExternalSource(123)).toBe(false);
    expect(isExternalSource(null)).toBe(false);
    expect(isExternalSource(undefined)).toBe(false);
    expect(isExternalSource({ ravensburger: "x" })).toBe(false);
  });
});
