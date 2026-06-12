import { describe, test } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaCorporateSurveillance,
  alphaCorpoSecurity,
  spoilerPlacideVoodooSentinel,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectIncludes,
  getChoiceDefinitionIds,
  getZoneDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Placide jsdom happy path", () => {
  test("placide - discards program to bottom-deck a rival unit", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitPlacideVoodooSentinel" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const placide = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        spoilerPlacideVoodooSentinel.id,
      );
      const program = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaCorporateSurveillance.id,
      );
      const target = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaArmoredMinotaur.id,
      );

      const deckBefore = await pom.getDeckSize(CYBERPUNK_P2);
      await pom.playCardFromHand(placide.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToMove");
      const cardChoices = await pom.getChoiceCardIds(CYBERPUNK_P1);
      const choiceDefinitions = await getChoiceDefinitionIds(pom, cardChoices);
      expectEqual("Placide program choice count", cardChoices.length, 1);
      expectIncludes("Placide program choices", choiceDefinitions, alphaCorporateSurveillance.id);

      await pom.resolveCardToMove(program.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const targetChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      const targetDefinitions = await getChoiceDefinitionIds(pom, targetChoices);
      expectEqual("Placide target count", targetChoices.length, 2);
      expectIncludes("Placide target choices", targetDefinitions, alphaArmoredMinotaur.id);
      expectIncludes("Placide target choices", targetDefinitions, alphaCorpoSecurity.id);

      await pom.resolveEffectTarget([target.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectFieldSize(CYBERPUNK_P2, 1);
      expectEqual("Placide rival deck size", await pom.getDeckSize(CYBERPUNK_P2), deckBefore + 1);

      const p2Deck = await getZoneDefinitionIds(pom, "deck", CYBERPUNK_P2);
      expectEqual("Placide bottom-decked card", p2Deck[p2Deck.length - 1], alphaArmoredMinotaur.id);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
