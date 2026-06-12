import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaCorpoSecurity, spoilerRiverWardDetectiveOnTheHunt } from "@tcg/cyberpunk-cards";
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

describe("progChromeReverie fixture behavior", () => {
  test("Chrome Reverie - cant-attack target and free legend call in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progChromeReverie" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const program = expectDefined(
        "Chrome Reverie in hand",
        (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
      );
      const corpoSecurity = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );
      const riverWard = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        spoilerRiverWardDetectiveOnTheHunt.id,
      );

      expectEqual("River Ward starts face-down", riverWard.faceDown, true);
      await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 1);
      await pom.expectEddies(CYBERPUNK_P1, 4);

      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

      await pom.expectHandSize(CYBERPUNK_P1, 0);
      await pom.expectEddies(CYBERPUNK_P1, 1);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const rivalUnitTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Chrome Reverie rival unit target count", rivalUnitTargets.length, 2);
      if (!rivalUnitTargets.includes(corpoSecurity.instanceId)) {
        throw new Error("Expected rival Corpo Security to be a Chrome Reverie target.");
      }

      await pom.resolveEffectTarget([corpoSecurity.instanceId], CYBERPUNK_P1);

      await pom.expectFieldCardGrantedRule(
        CYBERPUNK_P2,
        corpoSecurity.instanceId,
        "cantAttack",
        true,
      );
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const legendTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Chrome Reverie free legend-call target count", legendTargets.length, 1);
      if (!legendTargets.includes(riverWard.instanceId)) {
        throw new Error("Expected face-down River Ward to be the free legend-call target.");
      }

      await pom.resolveEffectTarget([riverWard.instanceId], CYBERPUNK_P1);

      const calledRiverWard = await pom.getCardInZoneByInstanceId(
        "legendArea",
        CYBERPUNK_P1,
        riverWard.instanceId,
      );
      expectEqual("River Ward is face-up after free call", calledRiverWard.faceDown, false);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);
      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectEddies(CYBERPUNK_P1, 1);
      await pom.expectFieldCardGrantedRule(
        CYBERPUNK_P2,
        corpoSecurity.instanceId,
        "cantAttack",
        true,
      );

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
