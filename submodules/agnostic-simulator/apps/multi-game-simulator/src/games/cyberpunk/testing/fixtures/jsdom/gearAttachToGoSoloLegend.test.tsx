import { describe, test, vi } from "vite-plus/test";

vi.mock("../../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../../animation")>("../../../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { alphaMantisBlades, alphaVCorporateExile } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "../../cyberpunk-simulator-pom";

import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

describe("gearAttachToGoSoloLegend fixture behavior", () => {
  test("Mantis Blades - attach to a GO SOLO legend on field in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearAttachToGoSoloLegend" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const gear = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaMantisBlades.id,
      );
      const goSoloLegend = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaVCorporateExile.id,
      );

      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectEddies(CYBERPUNK_P1, 3);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goSoloLegend.instanceId, 8);

      await pom.attachGearFromHand(gear.instanceId, goSoloLegend.instanceId, CYBERPUNK_P1);

      await pom.expectHandSize(CYBERPUNK_P1, 0);
      await pom.expectEddies(CYBERPUNK_P1, 2);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, goSoloLegend.instanceId, 1);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goSoloLegend.instanceId, 10);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
