import { describe, it } from "vite-plus/test";
import { welcomeToNightCityRetailDumDumMaelstromTriggerman } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Dum Dum - Maelstrom Triggerman", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailDumDumMaelstromTriggerman);
  });
});
