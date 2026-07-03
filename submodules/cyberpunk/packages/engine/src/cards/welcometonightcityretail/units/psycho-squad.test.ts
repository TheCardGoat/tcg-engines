import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailPsychoSquad } from "@tcg/cyberpunk-cards";

describe("Psycho Squad", () => {
  it("is a structured card with the expected slug", () => {
    expect(welcomeToNightCityRetailPsychoSquad.slug).toBe("psycho-squad");
  });
});
