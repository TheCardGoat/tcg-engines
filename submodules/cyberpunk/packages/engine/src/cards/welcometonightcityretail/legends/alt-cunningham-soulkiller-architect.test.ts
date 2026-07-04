import { describe, it } from "vite-plus/test";
import { welcomeToNightCityRetailAltCunninghamSoulkillerArchitect } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Alt Cunningham - Soulkiller Architect", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect);
  });
});
