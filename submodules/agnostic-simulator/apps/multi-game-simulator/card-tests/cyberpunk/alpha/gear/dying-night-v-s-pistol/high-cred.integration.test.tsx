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

describe("gearDyingNightHighCred fixture behavior", () => {
  test("Dying Night - high Street Cred defeats rival gear in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearDyingNightHighCred" });
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
      const rivalGear = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaKiroshiOptics.id,
      );

      expectEqual("Dying Night high-cred Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 8);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 7);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

      await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Dying Night eligible rival gear count", eligible.length, 1);
      if (!eligible.includes(rivalGear.instanceId)) {
        throw new Error("Expected rival Kiroshi Optics to be the Dying Night target.");
      }

      await pom.resolveEffectTarget([rivalGear.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectTrashSize(CYBERPUNK_P2, 1);
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaKiroshiOptics.id);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 0);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
