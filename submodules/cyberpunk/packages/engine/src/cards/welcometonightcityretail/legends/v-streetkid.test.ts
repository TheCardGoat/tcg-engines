import { describe, it } from "vite-plus/test";
import { welcomeToNightCityRetailVStreetkid } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("V - Streetkid", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailVStreetkid);
  });
});
