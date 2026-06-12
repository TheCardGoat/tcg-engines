import { describe, test } from "vite-plus/test";
import { alphaCorpoSecurity, alphaFloorIt } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Floor It jsdom happy path", () => {
  test("returns the selected spent low-cost unit to its owner's hand", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progFloorIt" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const rivalHandBefore = await pom.getHandSize(CYBERPUNK_P2);

      const floorIt = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaFloorIt.id);
      await pom.playCardFromHand(floorIt.instanceId, CYBERPUNK_P1);
      const corpo = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );
      await pom.resolveEffectTarget([corpo.instanceId], CYBERPUNK_P1);

      await pom.expectHandSize(CYBERPUNK_P2, rivalHandBefore + 1);
      expectEqual(
        "Corpo Security removed from rival field",
        (await pom.getCardsInZone("field", CYBERPUNK_P2)).some(
          (card) => card.definitionId === alphaCorpoSecurity.id,
        ),
        false,
      );
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P1, alphaFloorIt.id);
    } finally {
      view.unmount();
    }
  });
});
