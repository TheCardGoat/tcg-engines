import { describe, it } from "vite-plus/test";
import { theHeistRetailStarterDeckViktorVektorSitDownAndRelax } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Viktor Vektor - Sit Down and Relax", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(theHeistRetailStarterDeckViktorVektorSitDownAndRelax);
  });
});
