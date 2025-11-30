import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { basilPracticedDetective } from "./153-basil-practiced-detective";

describe("Basil - Practiced Detective", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(basilPracticedDetective, "Support")).toBe(true);
  });
});
