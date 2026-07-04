import { describe, it } from "vite-plus/test";
import { embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Goro Takemura - Hands Unclean", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean);
  });
});
