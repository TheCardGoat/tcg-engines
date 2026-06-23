import { describe, test } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailBootlegBlackSapphireShow,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Bootleg Black Sapphire Show (Retail) jsdom happy path", () => {
  test("play sells the top deck card and draws from odd/even gigs", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progBootlegBlackSapphireShowRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const eddiesBefore = await pom.getEddies(CYBERPUNK_P1);
      const handBefore = await pom.getHandSize(CYBERPUNK_P1);
      const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);

      const bootleg = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailBootlegBlackSapphireShow.id,
      );

      await pom.playCardFromHand(bootleg.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectEddies(CYBERPUNK_P1, eddiesBefore - 4);
      await pom.expectHandSize(CYBERPUNK_P1, handBefore + 1);
      expectEqual(
        "Bootleg deck after sell and draw",
        await pom.getDeckSize(CYBERPUNK_P1),
        deckBefore - 3,
      );

      await pom.getCardInZoneByDefinitionId("eddieArea", CYBERPUNK_P1, alphaCorpoSecurity.id);
      await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaRuthlessLowlife.id);
      await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaSwordwiseHuscle.id);
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailBootlegBlackSapphireShow.id,
      );

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
