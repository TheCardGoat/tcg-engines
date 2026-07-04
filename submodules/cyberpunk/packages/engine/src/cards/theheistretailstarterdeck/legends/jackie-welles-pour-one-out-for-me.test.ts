import { describe, it } from "vite-plus/test";
import { theHeistRetailStarterDeckJackieWellesPourOneOutForMe } from "@tcg/cyberpunk-cards";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Jackie Welles - Pour One Out For Me", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(theHeistRetailStarterDeckJackieWellesPourOneOutForMe);
  });
});
