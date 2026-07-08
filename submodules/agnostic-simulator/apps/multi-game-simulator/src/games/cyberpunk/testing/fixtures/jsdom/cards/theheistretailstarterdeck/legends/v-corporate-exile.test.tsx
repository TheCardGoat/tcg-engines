import { describe, test } from "vite-plus/test";
import { alphaCorpoSecurity, theHeistRetailStarterDeckVCorporateExile } from "@tcg/cyberpunk-cards";
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

describe("V - Corporate Exile (The Heist) jsdom behavior", () => {
  test("goes solo as a ready unit that can attack this turn", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "legendTheHeistVCorporateExile" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const v = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        theHeistRetailStarterDeckVCorporateExile.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.goSolo(v.instanceId, CYBERPUNK_P1);

      await pom.expectEddies(CYBERPUNK_P1, 1);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, v.instanceId, false);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, v.instanceId, 8);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, v.instanceId, "goSolo", true);

      await pom.attackUnit(v.instanceId, defender.instanceId, CYBERPUNK_P1);

      const attack = expectDefined("The Heist V attack state", await pom.getAttackState());
      expectEqual("The Heist V attack kind", attack.kind, "fight");
      await pom.expectFieldCardSpent(CYBERPUNK_P1, v.instanceId, true);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
