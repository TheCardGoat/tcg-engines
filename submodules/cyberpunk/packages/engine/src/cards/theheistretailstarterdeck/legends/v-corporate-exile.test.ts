import { describe, it } from "vite-plus/test";
import { theHeistRetailStarterDeckVCorporateExile } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("V - Corporate Exile", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(theHeistRetailStarterDeckVCorporateExile);
  });
});
