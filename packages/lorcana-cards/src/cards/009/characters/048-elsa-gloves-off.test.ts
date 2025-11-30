import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { elsaGlovesOff } from "./048-elsa-gloves-off";

describe("Elsa - Gloves Off", () => {
  it("should have Challenger 3 ability", () => {
    expect(hasKeyword(elsaGlovesOff, "Challenger")).toBe(true);
  });
});
