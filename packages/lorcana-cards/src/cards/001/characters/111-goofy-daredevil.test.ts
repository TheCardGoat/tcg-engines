import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { goofyDaredevil } from "./111-goofy-daredevil";

describe("Goofy - Daredevil", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(goofyDaredevil)).toBe(true);
  });
});
