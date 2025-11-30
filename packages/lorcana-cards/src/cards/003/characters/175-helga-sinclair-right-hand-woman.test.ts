import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { helgaSinclairRighthandWoman } from "./175-helga-sinclair-right-hand-woman";

describe("Helga Sinclair - Right-Hand Woman", () => {
  it("should have Challenger 2 ability", () => {
    expect(hasKeyword(helgaSinclairRighthandWoman, "Challenger")).toBe(true);
  });
});
