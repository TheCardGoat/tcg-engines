import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { kakamoraBoardingParty } from "./104-kakamora-boarding-party";

describe("Kakamora - Boarding Party", () => {
  it("should have Rush ability", () => {
    expect(hasRush(kakamoraBoardingParty)).toBe(true);
  });
});
