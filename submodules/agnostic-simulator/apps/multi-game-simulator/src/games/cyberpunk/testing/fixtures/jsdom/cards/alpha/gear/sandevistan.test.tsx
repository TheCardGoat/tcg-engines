import { describe, test } from "vite-plus/test";
import { alphaCorpoSecurity, alphaSandevistan, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Sandevistan jsdom happy path", () => {
  test("lets the equipped played unit attack spent units", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearSandevistan" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const unitInHand = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      const gearInHand = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaSandevistan.id,
      );
      const rivalTarget = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.expectHandSize(CYBERPUNK_P1, 2);
      await pom.expectEddies(CYBERPUNK_P1, 6);

      await pom.playCardFromHand(unitInHand.instanceId, CYBERPUNK_P1);
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      await pom.attachGearFromHand(gearInHand.instanceId, host.instanceId, CYBERPUNK_P1);

      await pom.expectHandSize(CYBERPUNK_P1, 0);
      await pom.expectEddies(CYBERPUNK_P1, 0);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, host.instanceId, 8);
      await pom.expectFieldCardGrantedRule(
        CYBERPUNK_P1,
        host.instanceId,
        "canAttackOnPlayedTurnAgainstUnits",
        true,
      );

      await pom.attackUnit(host.instanceId, rivalTarget.instanceId, CYBERPUNK_P1);

      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Sandevistan host to attack a spent rival unit.");
      }
      expectEqual("Sandevistan attack kind", attack.kind, "fight");
      expectEqual("Sandevistan attack step", attack.step, "offensive");
      expectEqual("Sandevistan attack defender", attack.defenderId, rivalTarget.instanceId);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, host.instanceId, true);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
