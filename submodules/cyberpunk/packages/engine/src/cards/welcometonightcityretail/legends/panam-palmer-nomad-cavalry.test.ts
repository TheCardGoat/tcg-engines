import { describe, it } from "vite-plus/test";
import { welcomeToNightCityRetailPanamPalmerNomadCavalry } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Panam Palmer - Nomad Cavalry", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailPanamPalmerNomadCavalry);
  });
});
