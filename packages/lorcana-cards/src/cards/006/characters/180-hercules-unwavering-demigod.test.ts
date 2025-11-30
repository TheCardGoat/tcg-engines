import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { herculesUnwaveringDemigod } from "./180-hercules-unwavering-demigod";

describe("Hercules - Unwavering Demigod", () => {
  it("should have Challenger 2 ability", () => {
    expect(hasKeyword(herculesUnwaveringDemigod, "Challenger")).toBe(true);
  });
});
