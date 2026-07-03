import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailCorporateSurveillance } from "@tcg/cyberpunk-cards";

describe("Corporate Surveillance", () => {
  it("is a structured card with the expected slug", () => {
    expect(welcomeToNightCityRetailCorporateSurveillance.slug).toBe("corporate-surveillance");
  });
});
