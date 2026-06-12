import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import {
  alphaCorpoSecurity,
  alphaKiroshiOptics,
  alphaTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("gearDyingNightLowCred fixture behavior", () => {
  test("Dying Night - low Street Cred does not defeat gear in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearDyingNightLowCred" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaTBugAmateurPhilosopher.id,
      );
      const rivalHost = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      expectEqual("Dying Night low-cred Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 4);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

      await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectTrashSize(CYBERPUNK_P2, 0);
      await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P2, alphaKiroshiOptics.id);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
