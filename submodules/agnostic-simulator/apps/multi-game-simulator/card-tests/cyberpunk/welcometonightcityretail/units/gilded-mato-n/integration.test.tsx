import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import {
  welcomeToNightCityRetailGildedMatoN,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

// Integration tier (jsdom): verify the full React simulator wires the Gilded
// Maton ifYouDo flow (chooseCardToMove -> chooseTarget) the engine unit test
// already pinned. One canonical line, not the full boundary matrix.
describe("unitGildedMatonRetail fixture behavior", () => {
  test("Gilded Maton defeats friendly Gear then defeats a cheap rival Unit (jsdom)", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitGildedMatonRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const maton = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailGildedMatoN.id,
      );
      const gear = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailKiroshiOptics.id,
      );
      const cheapRival = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );

      await pom.playCardFromHand(maton.instanceId, CYBERPUNK_P1);
      // Engine surfaces the optional Gear defeat as a chooseCardToMove choice.
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
      await pom.resolveCardToMove(gear.instanceId, CYBERPUNK_P1);
      // Then the rival Unit target choice.
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      await pom.resolveEffectTarget([cheapRival.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectTrashSize(CYBERPUNK_P2, 1);
      // Gear and cheap rival are now in their respective trash zones.
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailKiroshiOptics.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );
    } finally {
      view.unmount();
    }
  });
});
