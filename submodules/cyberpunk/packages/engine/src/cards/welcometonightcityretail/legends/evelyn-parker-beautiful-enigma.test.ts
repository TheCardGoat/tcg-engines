import { describe, it } from "vite-plus/test";
import { welcomeToNightCityRetailEvelynParkerBeautifulEnigma } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Evelyn Parker - Beautiful Enigma", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailEvelynParkerBeautifulEnigma);
  });
});
