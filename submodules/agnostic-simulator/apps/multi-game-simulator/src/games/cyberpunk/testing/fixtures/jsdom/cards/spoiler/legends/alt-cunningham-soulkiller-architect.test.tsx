import { describe, test } from "vite-plus/test";
import {
  alphaCorporateSurveillance,
  alphaCorpoSecurity,
  spoilerAltCunninghamSoulkillerArchitect,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Alt Cunningham jsdom happy path", () => {
  test("alt Cunningham - steal gig and replay a program", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendAltCunninghamSoulkillerArchitect",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const alt = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        spoilerAltCunninghamSoulkillerArchitect.id,
      );
      const corpoSecurity = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      await pom.attackRival(alt.instanceId, CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P1);

      expectEqual(
        "Alt removed after steal trigger",
        await pom.getCardInstanceExists(alt.instanceId),
        false,
      );
      await pom.expectGigCount(CYBERPUNK_P1, 3);
      await pom.expectGigCount(CYBERPUNK_P2, 0);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");

      const choices = await pom.getChoiceCardIds(CYBERPUNK_P1);
      expectEqual("Alt program choice count", choices.length, 1);
      expectEqual(
        "Alt program choice",
        await pom.getCardDefinitionId(choices[0]!),
        alphaCorporateSurveillance.id,
      );

      await pom.resolveCardToPlay(choices[0]!, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const targets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (!targets.includes(corpoSecurity.instanceId)) {
        throw new Error("Expected Corporate Surveillance to target rival Corpo Security.");
      }

      await pom.resolveEffectTarget([corpoSecurity.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectEddies(CYBERPUNK_P1, 8);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectFieldCardSpent(CYBERPUNK_P2, corpoSecurity.instanceId, true);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
