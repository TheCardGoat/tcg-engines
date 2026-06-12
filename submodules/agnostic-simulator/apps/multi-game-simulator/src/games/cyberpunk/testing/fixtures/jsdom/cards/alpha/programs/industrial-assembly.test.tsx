import { describe, test } from "vite-plus/test";
import { alphaIndustrialAssembly } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Industrial Assembly jsdom happy path", () => {
  test("increases the clicked friendly Gig and draws when Street Cred is high enough", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progIndustrialAssemblyHighCred" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const handBefore = await pom.getHandSize(CYBERPUNK_P1);
      const d8 = (await pom.getGigDice(CYBERPUNK_P1)).find((die) => die.dieType === "d8");
      if (!d8) {
        throw new Error("Expected Industrial Assembly fixture to include a friendly d8.");
      }

      const program = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaIndustrialAssembly.id,
      );
      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
      await pom.resolveEffectTarget([d8.id], CYBERPUNK_P1);

      await pom.expectGigValue(d8.id, 5);
      await pom.expectHandSize(CYBERPUNK_P1, handBefore);
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P1, alphaIndustrialAssembly.id);
      expectEqual(
        "Industrial Assembly pending choice resolved",
        await pom.getPendingChoiceType(CYBERPUNK_P1),
        null,
      );
    } finally {
      view.unmount();
    }
  });
});
