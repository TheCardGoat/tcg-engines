import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { chienpoImperialSoldier } from "./178-chien-po-imperial-soldier";

describe("Chien-Po - Imperial Soldier", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(chienpoImperialSoldier)).toBe(true);
  });
});
