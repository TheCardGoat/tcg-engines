import { describe, test } from "vite-plus/test";
import {
  spoilerAfterpartyAtLizzieS,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("V - Streetkid (Retail) jsdom happy path", () => {
  test("call trashes 3 and recovers a Braindance from trash", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendVStreetkidRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const vStreetkid = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailVStreetkid.id,
      );

      const handBefore = await pom.getHandSize(CYBERPUNK_P1);
      const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);

      await pom.callLegend(vStreetkid.instanceId, CYBERPUNK_P1);

      // Optional moveCard creates a chooseTarget for the Braindance selection
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("V-Streetkid eligible Braindance count", eligible.length, 1);
      await pom.resolveEffectTarget([eligible[0]!], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectEddies(CYBERPUNK_P1, 4); // CALL costs 1 Eddie
      const deckAfter = await pom.getDeckSize(CYBERPUNK_P1);
      expectEqual("V-Streetkid deck after", deckAfter, deckBefore - 3);
      await pom.expectHandSize(CYBERPUNK_P1, handBefore + 1);
      await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, spoilerAfterpartyAtLizzieS.id);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
