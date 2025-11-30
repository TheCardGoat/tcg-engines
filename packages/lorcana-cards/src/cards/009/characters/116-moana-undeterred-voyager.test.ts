import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { moanaUndeterredVoyager } from "./116-moana-undeterred-voyager";

describe("Moana - Undeterred Voyager", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(moanaUndeterredVoyager)).toBe(true);
  });
});
