import { describe, test } from "vite-plus/test";
import { alphaCorpoSecurity, spoilerElSombreronLaVenganzaLenta } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("El Sombreron jsdom happy path", () => {
  test("el Sombreron - attack trigger doubles fight power", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitElSombreronLaVenganzaLenta" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const elSombreron = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        spoilerElSombreronLaVenganzaLenta.id,
      );
      const target = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.attackUnit(elSombreron.instanceId, target.instanceId, CYBERPUNK_P1);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, elSombreron.instanceId, 8);

      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected El Sombreron to start a fight.");
      }
      expectEqual("El Sombreron attack kind", attack.kind, "fight");
      expectEqual("El Sombreron attack defender", attack.defenderId, target.instanceId);

      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);

      expectEqual("El Sombreron resolved attack", await pom.getAttackState(), null);
      await pom.expectFieldSize(CYBERPUNK_P1, 1);
      await pom.expectTrashSize(CYBERPUNK_P2, 1);
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaCorpoSecurity.id);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
