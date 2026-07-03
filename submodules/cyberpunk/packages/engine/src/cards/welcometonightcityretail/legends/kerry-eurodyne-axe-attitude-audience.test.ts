import { describe, it } from "vite-plus/test";
import { welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Kerry Eurodyne - Axe, Attitude, Audience", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience);
  });
});
