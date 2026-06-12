import { describe, test } from "vite-plus/test";
import {
  alphaKiroshiOptics,
  alphaRuthlessLowlife,
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectIncludes,
  getZoneDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Meredith Stout (Retail) jsdom happy path", () => {
  test("meredith Stout (Retail) - structural state on rival turn", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitMeredithStoutStoneColdCorpoRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMeredithStoutStoneColdCorpo.id,
      );

      await pom.expectTrashSize(CYBERPUNK_P1, 2);
      const trashDefinitions = await getZoneDefinitionIds(pom, "trash", CYBERPUNK_P1);
      expectIncludes("Meredith trash definitions", trashDefinitions, alphaKiroshiOptics.id);
      expectIncludes("Meredith trash definitions", trashDefinitions, alphaRuthlessLowlife.id);
      expectEqual("Meredith active player is P2", await pom.getActivePlayerId(), CYBERPUNK_P2);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
