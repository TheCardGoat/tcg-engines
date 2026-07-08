import { describe, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Goro Takemura - Losing His Way (Embracing Power) jsdom behavior", () => {
  test("gains +5 power on attack when all friendly Legends are face-up", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitEmbracingGoroTakemuraLosingHisWay",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const goro = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );

      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goro.instanceId, 4);
      await pom.attackUnit(goro.instanceId, defender.instanceId, CYBERPUNK_P1);

      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goro.instanceId, 9);
      expectEqual("Goro Losing His Way attack kind", (await pom.getAttackState())?.kind, "fight");
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
