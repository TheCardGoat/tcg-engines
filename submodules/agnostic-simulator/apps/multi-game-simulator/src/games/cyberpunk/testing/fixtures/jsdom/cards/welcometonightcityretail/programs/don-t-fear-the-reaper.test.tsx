import { describe, expect, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailDonTFearTheReaper,
  welcomeToNightCityRetailEmergencyAtlus,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../../../../cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("(Don't Fear) The Reaper (Retail) simulator regression", () => {
  test("spends every rival Unit before offering the spent-Unit defeat choice", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailWtnc22CombatStealQa" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const reaper = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailDonTFearTheReaper.id,
      );
      const rivals = await Promise.all(
        [
          welcomeToNightCityRetailEmergencyAtlus,
          welcomeToNightCityRetailSecondhandBombus,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailTBugAmateurPhilosopher,
        ].map((card) => pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P2, card.id)),
      );

      await pom.playCardFromHand(reaper.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      for (const rival of rivals) {
        await pom.expectFieldCardSpent(CYBERPUNK_P2, rival.instanceId, true);
      }
      expect(new Set(await pom.getEligibleTargetIds(CYBERPUNK_P1))).toEqual(
        new Set(rivals.map((rival) => rival.instanceId)),
      );

      await pom.interactionPanel.selectCandidate("resolveEffectTarget", rivals[2]!.instanceId);
      await pom.interactionPanel.submitInteraction("resolveEffectTarget");

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
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
