import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { princeEricDashingAndBrave } from "./194-prince-eric-dashing-and-brave";

describe("Prince Eric - Dashing and Brave", () => {
  it("should have Challenger 2 ability", () => {
    expect(hasKeyword(princeEricDashingAndBrave, "Challenger")).toBe(true);
  });
});
