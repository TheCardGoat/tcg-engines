import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { thomasOmalleyFelineCharmer } from "./088-thomas-omalley-feline-charmer";

describe("Thomas O'Malley - Feline Charmer", () => {
  it("should have Ward ability", () => {
    expect(hasWard(thomasOmalleyFelineCharmer)).toBe(true);
  });
});
