import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaDyingNightVSPistol, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("legendJackieWellesPourOneOutForMe fixture behavior", () => {
  test("Jackie Welles - blue gear increases a gig in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendJackieWellesPourOneOutForMe",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const gear = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaDyingNightVSPistol.id,
      );
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      const gig = (await pom.getGigDice(CYBERPUNK_P1))[0]!;

      await pom.expectGigValue(gig.id, 2);
      await pom.attachGearFromHand(gear.instanceId, host.instanceId, CYBERPUNK_P1);

      await pom.expectGigValue(gig.id, 4);
      await pom.expectEddies(CYBERPUNK_P1, 2);
      await pom.expectHandSize(CYBERPUNK_P1, 2);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
      expectEqual("Jackie deck after max-gig draw", await pom.getDeckSize(CYBERPUNK_P1), 37);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
