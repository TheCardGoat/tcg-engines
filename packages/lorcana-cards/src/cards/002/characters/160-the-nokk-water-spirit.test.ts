import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { theNokkWaterSpirit } from "./160-the-nokk-water-spirit";

describe("The Nokk - Water Spirit", () => {
  it("should have Ward ability", () => {
    expect(hasWard(theNokkWaterSpirit)).toBe(true);
  });
});
