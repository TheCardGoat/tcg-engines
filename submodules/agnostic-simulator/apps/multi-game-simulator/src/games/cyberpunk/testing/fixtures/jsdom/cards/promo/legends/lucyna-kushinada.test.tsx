import { describe, test } from "vite-plus/test";
import { promoLucynaKushinada } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Lucyna Kushinada jsdom happy path", () => {
  test("renders the promo legend in the legend area", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "legendLucynaKushinada" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const lucyna = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        promoLucynaKushinada.id,
      );

      expectEqual("Lucyna definition", lucyna.definitionId, promoLucynaKushinada.id);
    } finally {
      view.unmount();
    }
  });
});
