import { describe, test } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Saburo Arasaka - Stubborn Patriarch (Retail) jsdom happy path", () => {
  test("buffs a friendly Arasaka attacker", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendSaburoArasakaStubbornPatriachRetail",
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
      const lowlife = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaRuthlessLowlife.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, minotaur.instanceId, 9);
      await pom.attackUnit(minotaur.instanceId, defender.instanceId, CYBERPUNK_P1);

      const attack = expectDefined("Saburo attack state", await pom.getAttackState());
      expectEqual("Saburo attack kind", attack.kind, "fight");
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, minotaur.instanceId, 10);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, lowlife.instanceId, 1);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, minotaur.instanceId, true);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
