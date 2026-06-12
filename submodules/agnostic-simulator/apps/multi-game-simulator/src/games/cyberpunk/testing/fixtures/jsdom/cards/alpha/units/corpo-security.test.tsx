import { describe, test } from "vite-plus/test";
import { alphaCorpoSecurity, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Corpo Security jsdom happy path", () => {
  test("blocks a direct attack after its controller takes the defensive choice", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitCorpoSecurity" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const swordwise = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      const corpo = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.attackRival(swordwise.instanceId, CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.useBlocker(corpo.instanceId, CYBERPUNK_P2);

      await pom.expectFieldCardSpent(CYBERPUNK_P2, corpo.instanceId, true);
      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Corpo Security to redirect the attack into a fight.");
      }
      expectEqual("Corpo Security redirects to fight", attack.kind, "fight");
      expectEqual("Corpo Security defender", attack.defenderId, corpo.instanceId);
    } finally {
      view.unmount();
    }
  });
});
