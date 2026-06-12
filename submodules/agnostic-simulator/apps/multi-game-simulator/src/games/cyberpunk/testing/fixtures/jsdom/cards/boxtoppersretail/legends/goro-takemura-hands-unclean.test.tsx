import { describe, test } from "vite-plus/test";
import { alphaCorpoSecurity, boxTopperRetailGoroTakemuraHandsUnclean } from "@tcg/cyberpunk-cards";
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

describe("Goro Takemura - Hands Unclean (Retail) jsdom happy path", () => {
  test("goes solo with BLOCKER", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendGoroTakemuraHandsUncleanRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const goro = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        boxTopperRetailGoroTakemuraHandsUnclean.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.goSolo(goro.instanceId, CYBERPUNK_P1);

      await pom.expectEddies(CYBERPUNK_P1, 1);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, false);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goro.instanceId, 7);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, goro.instanceId, "goSolo", true);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, goro.instanceId, "blocker", true);

      await pom.attackUnit(goro.instanceId, defender.instanceId, CYBERPUNK_P1);

      const attack = expectDefined("Goro attack state", await pom.getAttackState());
      expectEqual("Goro attack kind", attack.kind, "fight");
      await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, true);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
