import { describe, it } from "vite-plus/test";
import { embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Saburo Arasaka - Stubborn Patriarch", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch);
  });
});
