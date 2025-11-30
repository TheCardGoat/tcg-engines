import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { ratiganCriminalMastermind } from "./091-ratigan-criminal-mastermind";

describe("Ratigan - Criminal Mastermind", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(ratiganCriminalMastermind)).toBe(true);
  });
});
