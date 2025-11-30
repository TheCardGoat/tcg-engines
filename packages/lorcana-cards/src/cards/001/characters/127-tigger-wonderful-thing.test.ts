import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { tiggerWonderfulThing } from "./127-tigger-wonderful-thing";

describe("Tigger - Wonderful Thing", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(tiggerWonderfulThing)).toBe(true);
  });
});
