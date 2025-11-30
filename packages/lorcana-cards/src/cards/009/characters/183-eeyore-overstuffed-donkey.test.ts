import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { eeyoreOverstuffedDonkey } from "./183-eeyore-overstuffed-donkey";

describe("Eeyore - Overstuffed Donkey", () => {
  it("should have Resist 1 ability", () => {
    expect(hasKeyword(eeyoreOverstuffedDonkey, "Resist")).toBe(true);
  });
});
