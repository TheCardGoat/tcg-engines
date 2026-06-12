import { describe, test } from "vite-plus/test";
import { alphaCorpoSecurity, alphaVCorporateExile } from "@tcg/cyberpunk-cards";
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

describe("V - Corporate Exile jsdom happy path", () => {
  test("goes solo as a ready unit", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "legendVCorporateExile" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const v = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        alphaVCorporateExile.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.expectEddies(CYBERPUNK_P1, 6);
      await pom.goSolo(v.instanceId, CYBERPUNK_P1);

      await pom.expectEddies(CYBERPUNK_P1, 1);
      await pom.expectFieldSize(CYBERPUNK_P1, 2);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, v.instanceId, false);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, v.instanceId, 8);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, v.instanceId, "goSolo", true);

      await pom.attackUnit(v.instanceId, defender.instanceId, CYBERPUNK_P1);

      const attack = expectDefined("V attack state", await pom.getAttackState());
      expectEqual("V attack kind", attack.kind, "fight");
      await pom.expectFieldCardSpent(CYBERPUNK_P1, v.instanceId, true);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
