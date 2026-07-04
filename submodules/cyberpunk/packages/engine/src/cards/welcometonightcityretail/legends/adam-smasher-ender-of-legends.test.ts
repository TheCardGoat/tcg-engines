import { describe, it } from "vite-plus/test";
import { welcomeToNightCityRetailAdamSmasherEnderOfLegends } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Adam Smasher - Ender of Legends", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailAdamSmasherEnderOfLegends);
  });
});
