import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaCorpoSecurity, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("gearMantisBlades fixture behavior", () => {
  test("Mantis Blades - host power boost in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearMantisBlades" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.expectFieldSize(CYBERPUNK_P1, 1);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, host.instanceId, 7);

      await pom.attackUnit(host.instanceId, defender.instanceId, CYBERPUNK_P1);
      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Mantis Blades host to start a fight.");
      }
      expectEqual("Mantis Blades attack kind", attack.kind, "fight");
      expectEqual("Mantis Blades attack defender", attack.defenderId, defender.instanceId);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, host.instanceId, 7);

      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);

      expectEqual("Mantis Blades attack cleared", await pom.getAttackState(), null);
      await pom.expectFieldSize(CYBERPUNK_P1, 1);
      await pom.expectTrashSize(CYBERPUNK_P2, 1);
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaCorpoSecurity.id);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
