import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailEmergencyAtlus } from "@tcg/cyberpunk-cards";

describe("Emergency - Atlus", () => {
  it("is a structured card with the expected slug", () => {
    expect(welcomeToNightCityRetailEmergencyAtlus.slug).toBe("emergency-atlus");
  });
});
