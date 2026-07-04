import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailSketchyRipper } from "@tcg/cyberpunk-cards";

describe("Sketchy Ripper", () => {
  it("is a structured card with the expected slug", () => {
    expect(welcomeToNightCityRetailSketchyRipper.slug).toBe("sketchy-ripper");
  });
});
