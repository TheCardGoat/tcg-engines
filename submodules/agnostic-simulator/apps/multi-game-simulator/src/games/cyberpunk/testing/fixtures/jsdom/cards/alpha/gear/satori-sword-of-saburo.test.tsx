import { describe, test } from "vite-plus/test";
import { alphaCorpoSecurity, alphaTBugAmateurPhilosopher } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Satori - Sword of Saburo jsdom happy path", () => {
  test("draws after the equipped attacker wins a fight", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearSatoriSwordOfSaburo" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaTBugAmateurPhilosopher.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 6);

      await pom.attackUnit(attacker.instanceId, defender.instanceId, CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);

      expectEqual("Satori attack cleared", await pom.getAttackState(), null);
      await pom.expectHandSize(CYBERPUNK_P1, 2);
      await pom.expectTrashSize(CYBERPUNK_P2, 1);
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaCorpoSecurity.id);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
