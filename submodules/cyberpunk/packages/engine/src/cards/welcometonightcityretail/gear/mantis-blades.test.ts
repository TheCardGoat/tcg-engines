import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailMantisBlades } from "@tcg/cyberpunk-cards";

describe("Mantis Blades", () => {
  it("is a structured card with the expected slug", () => {
    expect(welcomeToNightCityRetailMantisBlades.slug).toBe("mantis-blades");
  });
});
