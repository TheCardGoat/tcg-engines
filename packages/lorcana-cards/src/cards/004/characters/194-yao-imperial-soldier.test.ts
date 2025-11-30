import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { yaoImperialSoldier } from "./194-yao-imperial-soldier";

describe("Yao - Imperial Soldier", () => {
  it("should have Challenger 2 ability", () => {
    expect(hasKeyword(yaoImperialSoldier, "Challenger")).toBe(true);
  });
});
