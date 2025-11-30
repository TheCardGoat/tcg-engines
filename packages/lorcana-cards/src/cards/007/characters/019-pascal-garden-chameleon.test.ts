import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { pascalGardenChameleon } from "./019-pascal-garden-chameleon";

describe("Pascal - Garden Chameleon", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(pascalGardenChameleon)).toBe(true);
  });
});
