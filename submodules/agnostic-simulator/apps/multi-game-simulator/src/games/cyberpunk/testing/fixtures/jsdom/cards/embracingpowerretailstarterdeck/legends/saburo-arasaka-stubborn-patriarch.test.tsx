import { describe, test } from "vite-plus/test";
import { alphaArmoredMinotaur, alphaCorpoSecurity } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Saburo Arasaka - Stubborn Patriarch (Embracing Power) jsdom behavior", () => {
  test("buffs a friendly Arasaka attacker", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendEmbracingSaburoArasakaStubbornPatriarch",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const minotaur = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaArmoredMinotaur.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, minotaur.instanceId, 9);
      await pom.attackUnit(minotaur.instanceId, defender.instanceId, CYBERPUNK_P1);

      expectEqual("Saburo attack is active", (await pom.getAttackState())?.kind, "fight");
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, minotaur.instanceId, 10);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
