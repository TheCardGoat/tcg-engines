import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaArmoredMinotaur, alphaSecondhandBombus } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("unitSecondhandBombus fixture behavior", () => {
  test("Secondhand Bombus - blocker redirects direct attack in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitSecondhandBombus" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const bombus = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSecondhandBombus.id,
      );
      const minotaur = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaArmoredMinotaur.id,
      );

      const initialAttack = await pom.getAttackState();
      if (!initialAttack) {
        throw new Error("Expected Secondhand Bombus fixture to start in a direct attack.");
      }
      expectEqual("Bombus attack attacker", initialAttack.attackerId, minotaur.instanceId);
      expectEqual("Bombus initial attack kind", initialAttack.kind, "direct");
      expectEqual("Bombus initial attack step", initialAttack.step, "defensive");
      expectEqual("Bombus initial attack rival", initialAttack.rivalId, CYBERPUNK_P1);

      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, bombus.instanceId, "blocker", true);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, bombus.instanceId, "cantAttack", true);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, bombus.instanceId, false);

      const blockers = await pom.getMoveCandidateIds(CYBERPUNK_P1, "useBlocker");
      if (!blockers.includes(bombus.instanceId)) {
        throw new Error("Expected Secondhand Bombus to be a visible blocker candidate.");
      }

      await pom.useBlocker(bombus.instanceId, CYBERPUNK_P1);

      const blockedAttack = await pom.getAttackState();
      if (!blockedAttack) {
        throw new Error("Expected Secondhand Bombus to redirect the attack into a fight.");
      }
      expectEqual("Bombus blocked attack kind", blockedAttack.kind, "fight");
      expectEqual("Bombus blocked defender", blockedAttack.defenderId, bombus.instanceId);
      expectEqual("Bombus blocked attack redirected", blockedAttack.redirectedByBlocker, true);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, bombus.instanceId, true);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
