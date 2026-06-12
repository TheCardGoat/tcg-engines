import { describe, test } from "vite-plus/test";
import { alphaCorpoSecurity, alphaMt0d12Flathead } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("MT0D12 Flathead jsdom happy path", () => {
  test("attacks directly at 7+ Street Cred and rejects the rival blocker", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitMt0d12Flathead" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const flathead = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaMt0d12Flathead.id,
      );
      const blocker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.attackRival(flathead.instanceId, CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);

      const result = await pom.harness.dispatchEngine(
        (engine, payload) =>
          engine.executeMove("useBlocker", { args: { blockerId: payload.blockerId } }, payload.as),
        { blockerId: blocker.instanceId, as: CYBERPUNK_P2 },
      );
      expectEqual("MT0D12 blocker rejected", (result as { success: boolean }).success, false);
      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Flathead direct attack to remain active.");
      }
      expectEqual("MT0D12 direct attack", attack.kind, "direct");
    } finally {
      view.unmount();
    }
  });
});
