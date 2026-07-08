import { describe, expect, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  theHeistRetailStarterDeckMt0d12Flathead,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";

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
        theHeistRetailStarterDeckMt0d12Flathead.id,
      );
      const blocker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );

      await pom.attackRival(flathead.instanceId, CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);

      await expect(pom.useBlocker(blocker.instanceId, CYBERPUNK_P2)).rejects.toThrow(
        "Attacker can't be blocked",
      );

      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Flathead direct attack to remain active.");
      }
      if (attack.kind !== "direct") {
        throw new Error(`Expected Flathead direct attack to remain active, got ${attack.kind}.`);
      }
    } finally {
      view.unmount();
    }
  });
});
