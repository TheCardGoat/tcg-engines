import { describe, test } from "vite-plus/test";
import { alphaGoroTakemuraLosingHisWay } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Goro Takemura - Losing His Way jsdom happy path", () => {
  test("renders +1 power for each face-up friendly Legend on your turn", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitGoroTakemuraLosingHisWay" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const goro = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaGoroTakemuraLosingHisWay.id,
      );

      await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goro.instanceId, 7);
    } finally {
      view.unmount();
    }
  });
});
