import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  spoilerGoroTakemuraVengefulBodyguard,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("legendGoroTakemuraVengefulBodyguard fixture behavior", () => {
  test("Goro Takemura - Vengeful Bodyguard grants BLOCKER in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendGoroTakemuraVengefulBodyguard",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const goro = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        spoilerGoroTakemuraVengefulBodyguard.id,
      );
      const corpoSecurity = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaCorpoSecurity.id,
      );
      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaArmoredMinotaur.id,
      );

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const targets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (!targets.includes(corpoSecurity.instanceId)) {
        throw new Error("Expected Goro to be able to grant BLOCKER to Corpo Security.");
      }

      await pom.resolveEffectTarget([corpoSecurity.instanceId], CYBERPUNK_P1);

      await pom.expectLegendCardSpent(CYBERPUNK_P1, goro.instanceId, true);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, corpoSecurity.instanceId, 3);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, corpoSecurity.instanceId, "blocker", true);

      const offensiveAttack = expectDefined("Goro defensive attack", await pom.getAttackState());
      expectEqual("Goro defensive attacker", offensiveAttack.attackerId, attacker.instanceId);

      await pom.resolveAttack(CYBERPUNK_P2);
      await pom.useBlocker(corpoSecurity.instanceId, CYBERPUNK_P1);

      const redirected = expectDefined("Goro redirected attack", await pom.getAttackState());
      expectEqual("Goro redirected kind", redirected.kind, "fight");
      expectEqual("Goro redirected defender", redirected.defenderId, corpoSecurity.instanceId);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, corpoSecurity.instanceId, true);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
