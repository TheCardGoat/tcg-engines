import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailCorpoSecurity } from "@tcg/cyberpunk-cards";

describe("Corpo Security", () => {
  it("is a structured card with the expected slug", () => {
    expect(welcomeToNightCityRetailCorpoSecurity.slug).toBe("corpo-security");
  });
});
