import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { rollyHungryPup } from "./021-rolly-hungry-pup";

describe("Rolly - Hungry Pup", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(rollyHungryPup, "Support")).toBe(true);
  });
});
