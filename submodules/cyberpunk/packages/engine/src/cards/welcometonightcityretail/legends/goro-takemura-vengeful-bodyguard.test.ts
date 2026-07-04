import { describe, it } from "vite-plus/test";
import { welcomeToNightCityRetailGoroTakemuraVengefulBodyguard } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Goro Takemura - Vengeful Bodyguard", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard);
  });
});
