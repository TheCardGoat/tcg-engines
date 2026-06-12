import { describe, test } from "vite-plus/test";
import { alphaTBugAmateurPhilosopher } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("T-Bug - Amateur Philosopher jsdom happy path", () => {
  test("renders at printed power and starts a direct attack", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitTBugAmateurPhilosopher",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const tBug = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaTBugAmateurPhilosopher.id,
      );

      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, tBug.instanceId, 5);
      await pom.attackRival(tBug.instanceId, CYBERPUNK_P1);

      const attack = await pom.getAttackState();
      expectEqual("T-Bug attack kind", attack?.kind, "direct");
      await pom.expectFieldCardSpent(CYBERPUNK_P1, tBug.instanceId, true);
    } finally {
      view.unmount();
    }
  });
});
