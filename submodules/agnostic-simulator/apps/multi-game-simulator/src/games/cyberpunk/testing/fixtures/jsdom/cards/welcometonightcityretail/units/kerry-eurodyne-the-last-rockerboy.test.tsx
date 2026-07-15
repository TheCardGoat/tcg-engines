import { describe, test } from "vite-plus/test";
import { welcomeToNightCityRetailKerryEurodyneTheLastRockerboy } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Kerry Eurodyne (Retail) jsdom happy path", () => {
  test("kerry Eurodyne (Retail) - spend with an 8+ value gig draws two", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitKerryEurodyneTheLastRockerboyRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const kerry = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailKerryEurodyneTheLastRockerboy.id,
      );
      const abilityCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "activateAbility");
      if (!abilityCandidates.includes(`${kerry.instanceId}:0`)) {
        throw new Error("Expected Kerry's activated ability to be visible.");
      }

      const handBefore = await pom.getHandSize(CYBERPUNK_P1);
      const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);

      await pom.activateAbility(kerry.instanceId, 0, CYBERPUNK_P1);

      await pom.expectFieldCardSpent(CYBERPUNK_P1, kerry.instanceId, true);
      await pom.expectHandSize(CYBERPUNK_P1, handBefore + 2);
      expectEqual("Kerry deck after draw", await pom.getDeckSize(CYBERPUNK_P1), deckBefore - 2);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
