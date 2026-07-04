import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailMandibularUpgrade } from "@tcg/cyberpunk-cards";

describe("Mandibular Upgrade", () => {
  it("is a structured card with the expected slug", () => {
    expect(welcomeToNightCityRetailMandibularUpgrade.slug).toBe("mandibular-upgrade");
  });
});
