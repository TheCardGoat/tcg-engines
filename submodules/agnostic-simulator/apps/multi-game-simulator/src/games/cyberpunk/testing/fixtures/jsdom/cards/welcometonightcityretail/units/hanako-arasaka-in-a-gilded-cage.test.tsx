import { describe, test } from "vite-plus/test";
import {
  alphaFloorIt,
  alphaSecondhandBombus,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailHanakoArasakaInAGildedCage,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectExcludes,
  expectIncludes,
  getZoneDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Hanako Arasaka (Retail) jsdom happy path", () => {
  test("hanako Arasaka (Retail) - play trigger keeps top-deck cost matches", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitHanakoArasakaInAGildedCageRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const hanako = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailHanakoArasakaInAGildedCage.id,
      );

      expectEqual("Hanako initial deck size", await pom.getDeckSize(CYBERPUNK_P1), 40);
      await pom.playCardFromHand(hanako.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFieldSize(CYBERPUNK_P1, 2);
      await pom.expectHandSize(CYBERPUNK_P1, 2);
      await pom.expectTrashSize(CYBERPUNK_P1, 0);
      expectEqual("Hanako deck after search", await pom.getDeckSize(CYBERPUNK_P1), 38);
      await pom.expectEddies(CYBERPUNK_P1, 0);

      const handDefinitions = await getZoneDefinitionIds(pom, "hand", CYBERPUNK_P1);
      expectIncludes("Hanako hand definitions", handDefinitions, alphaSwordwiseHuscle.id);
      expectIncludes("Hanako hand definitions", handDefinitions, alphaFloorIt.id);
      expectExcludes("Hanako hand definitions", handDefinitions, alphaSecondhandBombus.id);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
