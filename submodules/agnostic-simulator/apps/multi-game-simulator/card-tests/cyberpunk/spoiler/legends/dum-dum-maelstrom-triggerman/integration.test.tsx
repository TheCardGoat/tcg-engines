import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import {
  alphaKiroshiOptics,
  alphaTBugAmateurPhilosopher,
  spoilerDumDumMaelstromTriggerman,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("legendDumDumMaelstromTriggerman fixture behavior", () => {
  test("Dum Dum - call defeats gear to draw four in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendDumDumMaelstromTriggerman",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const dumDum = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        spoilerDumDumMaelstromTriggerman.id,
      );
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaTBugAmateurPhilosopher.id,
      );
      const kiroshi = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaKiroshiOptics.id,
      );

      await pom.callLegend(dumDum.instanceId, CYBERPUNK_P1);

      await pom.expectEddies(CYBERPUNK_P1, 2);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
      const choices = await pom.getChoiceCardIds(CYBERPUNK_P1);
      expectEqual("Dum Dum friendly gear choices", choices.length, 2);
      if (!choices.includes(kiroshi.instanceId)) {
        throw new Error("Expected Dum Dum to offer attached Kiroshi Optics.");
      }

      await pom.resolveCardToMove(kiroshi.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectHandSize(CYBERPUNK_P1, 5);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
      const moved = await pom.getCardInZoneByInstanceId("trash", CYBERPUNK_P1, kiroshi.instanceId);
      expectEqual("Dum Dum moved gear detached", moved.attachedToId, null);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
