import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { francineEyeingTheEvidence } from "./176-francine-eyeing-the-evidence";

describe("Francine - Eyeing the Evidence", () => {
  it("should have Resist 1 ability", () => {
    expect(hasKeyword(francineEyeingTheEvidence, "Resist")).toBe(true);
  });
});
