import { describe, it } from "vite-plus/test";
import { embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Yorinobu Arasaka - Embracing Destruction", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(embracingPowerRetailStarterDeckYorinobuArasakaEmbracingDestruction);
  });
});
