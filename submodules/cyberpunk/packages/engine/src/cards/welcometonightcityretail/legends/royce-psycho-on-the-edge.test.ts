import { describe, it } from "vite-plus/test";
import { welcomeToNightCityRetailRoycePsychoOnTheEdge } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Royce - Psycho on the Edge", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailRoycePsychoOnTheEdge);
  });
});
