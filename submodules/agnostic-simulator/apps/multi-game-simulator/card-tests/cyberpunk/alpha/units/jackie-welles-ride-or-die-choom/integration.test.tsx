import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaArmoredMinotaur, alphaJackieWellesRideOrDieChoom } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("unitJackieWellesRideOrDieChoom fixture behavior", () => {
  test("Jackie Welles - power scales with friendly gigs in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitJackieWellesRideOrDieChoom" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const jackie = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaJackieWellesRideOrDieChoom.id,
      );
      const minotaur = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaArmoredMinotaur.id,
      );

      await pom.expectGigCount(CYBERPUNK_P1, 3);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, jackie.instanceId, 12);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, jackie.instanceId, false);

      await pom.attackUnit(jackie.instanceId, minotaur.instanceId, CYBERPUNK_P1);
      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Jackie to start a fight.");
      }
      expectEqual("Jackie attack kind", attack.kind, "fight");
      expectEqual("Jackie attack defender", attack.defenderId, minotaur.instanceId);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, jackie.instanceId, 12);

      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);

      expectEqual("Jackie attack cleared", await pom.getAttackState(), null);
      await pom.expectFieldSize(CYBERPUNK_P1, 1);
      await pom.expectFieldSize(CYBERPUNK_P2, 1);
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaJackieWellesRideOrDieChoom.id,
      );
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaArmoredMinotaur.id);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
