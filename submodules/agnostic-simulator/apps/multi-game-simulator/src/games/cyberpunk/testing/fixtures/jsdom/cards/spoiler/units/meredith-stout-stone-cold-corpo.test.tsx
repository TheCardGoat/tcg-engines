import { describe, test } from "vite-plus/test";
import {
  alphaKiroshiOptics,
  spoilerEvelynParkerBeautifulEnigma,
  spoilerMeredithStoutStoneColdCorpo,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Meredith Stout jsdom happy path", () => {
  test("meredith Stout - rival gig decrease recovers from trash", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitMeredithStoutStoneColdCorpo",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        spoilerMeredithStoutStoneColdCorpo.id,
      );
      const evelyn = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P2,
        spoilerEvelynParkerBeautifulEnigma.id,
      );
      const p1Gig = (await pom.getGigDice(CYBERPUNK_P1))[0];
      if (!p1Gig) {
        throw new Error("Expected Meredith fixture to start with a friendly gig.");
      }

      await pom.expectTrashSize(CYBERPUNK_P1, 2);
      await pom.callLegend(evelyn.instanceId, CYBERPUNK_P2);

      await pom.expectGigValue(p1Gig.id, 1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
      const recoverChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
      const recoverDefinitions = await getChoiceDefinitionIds(pom, recoverChoices);
      expectIncludes("Meredith recovery choices", recoverDefinitions, alphaKiroshiOptics.id);

      const kiroshiId = recoverChoices[recoverDefinitions.indexOf(alphaKiroshiOptics.id)];
      if (!kiroshiId) {
        throw new Error("Expected Kiroshi Optics to be recoverable by Meredith.");
      }
      await pom.resolveCardToMove(kiroshiId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectEddies(CYBERPUNK_P2, 4);
      await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaKiroshiOptics.id);
      expectEqual("Meredith active player remains P2", await pom.getActivePlayerId(), CYBERPUNK_P2);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
