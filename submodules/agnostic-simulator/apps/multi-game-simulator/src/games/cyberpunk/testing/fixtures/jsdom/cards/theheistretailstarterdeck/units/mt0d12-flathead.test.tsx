import { describe, test } from "vite-plus/test";
import { theHeistRetailStarterDeckMt0d12Flathead } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("MT0D12 Flathead (The Heist) jsdom behavior", () => {
  test("has cantBeBlocked while friendly Street Cred is lower", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitTheHeistMt0d12Flathead" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const flathead = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        theHeistRetailStarterDeckMt0d12Flathead.id,
      );

      expectEqual("Flathead P1 Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 1);
      expectEqual("Flathead P2 Street Cred", await pom.getStreetCred(CYBERPUNK_P2), 7);
      await pom.expectFieldCardGrantedRule(
        CYBERPUNK_P1,
        flathead.instanceId,
        "cantBeBlocked",
        true,
      );
      await pom.attackRival(flathead.instanceId, CYBERPUNK_P1);

      const attack = await pom.getAttackState();
      expectEqual("Flathead attack kind", attack?.kind, "direct");
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
