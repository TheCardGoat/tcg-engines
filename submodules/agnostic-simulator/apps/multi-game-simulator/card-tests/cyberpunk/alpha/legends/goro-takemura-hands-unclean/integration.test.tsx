import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaCorpoSecurity, alphaGoroTakemuraHandsUnclean } from "@tcg/cyberpunk-cards";
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

describe("legendGoroTakemuraHandsUnclean fixture behavior", () => {
  test("Goro Takemura - Hands Unclean - GO SOLO + BLOCKER in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "legendGoroTakemuraHandsUnclean" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const goro = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        alphaGoroTakemuraHandsUnclean.id,
      );
      const defender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.goSolo(goro.instanceId, CYBERPUNK_P1);

      await pom.expectEddies(CYBERPUNK_P1, 1);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, false);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goro.instanceId, 7);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, goro.instanceId, "goSolo", true);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, goro.instanceId, "blocker", true);

      await pom.attackUnit(goro.instanceId, defender.instanceId, CYBERPUNK_P1);

      const attack = expectDefined("Goro attack state", await pom.getAttackState());
      expectEqual("Goro attack kind", attack.kind, "fight");
      await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, true);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
